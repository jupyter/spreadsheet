/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../bower_components/phosphor/dist/phosphor.d.ts" />

import Widget = phosphor.widgets.Widget;
import {
IMessageHandler, Message, clearMessageData, postMessage, sendMessage
} from 'phosphor-messaging';

import {MenuBar, Menu, MenuItem} from 'phosphor-menus';

console.log("finished imports");


interface ISpreadsheetModel {
  cellVals: string[][];
  width: number;
  height: number;
  getCell(x: number, y: number): string;
  setCell(x: number, y: number, newCell: string): void;
  insertCol(colNum: number): void;
  deleteCol(colNum: number): void;
  insertRow(rowNum: number): void;
  deleteRow(rowNum: number): void;
  clearCell(x: number, y: number): void;

  processMessage(msg: Message): void;

}
interface ISpreadsheetViewModel {
  model: ISpreadsheetModel;
  highlightedCells: boolean[][];
  focusedCellX: number;
  focusedCellY: number;
  focusedCell: HTMLCell;
  mouseDown: boolean; //for highlighting
  editing: boolean; //for navigation, if false, not editing a cell
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  events: SpreadsheetEventObject;
  eventManager: any;

  insertRow(rowNum: number): void;
  insertCol(colNum: number): void;
  deleteRow(rowNum: number): void;
  deleteCol(colNum: number): void;
  mouseClicked(e: MouseEvent): void;
  clearSelections(): void;
  focusCell(cellX: number, cellY: number): void;
  clearCell(x: number, y: number): void;
  select(cellX: number, cellY: number): void;
  mouseSelectRange(cellX: number, cellY: number): void;
  selectArea(): void;
  focusChanged(): void;
  selectionChanged(): void;

  processMessage(msg: Message): void;

}

interface ISpreadsheetView {
  cells: ICell[][];
  mv: ISpreadsheetViewModel;
  focusedCell: ICell;

  updateSelections(): void;
  updateFocus(): void;
  attachCell(cell: HTMLCell): void;
  addCallback(event: string, callback: EventListener, to: HTMLElement): void;
  insertCol(colNum: number): void;
  insertRow(rowNum: number): void;
  createMenu(): void;
  processMessage(msg: Message): void;

}

interface ICell {
  _row: MutableNumber;
  _col: MutableNumber;
  _displayVal: string;
  parent: ISpreadsheetView;
  setDisplayVal(newVal: string): void;
  getDisplayVal(): string;
  setCol(newVal: number): void;
  getCol(): number;
  setRow(newVal: number): void;
  getRow(): number;
  beginEdits(): void;
  finishEdits(): void;
  select(): void;
  deselect(): void;
  startFocus(): void;
  endFocus(): void;
  getHTMLElement(): HTMLElement;
}

function getCellX(cell: HTMLTableCellElement): number {
  return cell.cellIndex - 1;
}

function getCellY(cell: HTMLTableCellElement): number {
  return (<HTMLTableRowElement>cell.parentElement).rowIndex - 1;
}

class CellChangeMessage extends Message {
  private _cellX: number;
  private _cellY: number;
  constructor(cellX: number, cellY: number) {
    super("cellchanged");
    this._cellX = cellX;
    this._cellY = cellY;
  }
  get cellX(): number {
    return this._cellX;
  }
  get cellY(): number {
    return this._cellY;
  }

}

class MutableNumber {
  public val: number;
  constructor(val: number) {
    this.val = val;
  }
}

const MSG_ON_FOCUS = new Message("focuschanged");
const MSG_ON_SELECTION = new Message("selectionchanged");
const MSG_ON_BEGIN_EDIT = new Message("beginedits");

class HTMLLabel {
  public val: number;
  public isCol: boolean;
  public div: HTMLDivElement;
  constructor(val: number, isCol: boolean, newCell: HTMLTableCellElement) {
    this.val = val;
    this.isCol = isCol;
    this.div = document.createElement("div");
    newCell.appendChild(this.div);
    this.div.innerHTML = this.val.toString();
    this.div.setAttribute("data-type", "label");
    this.div.setAttribute("data-col", isCol.toString());
    this.div.setAttribute("data-num", val.toString());
  }
}

class SpreadsheetEventObject {
  public mousedown: (e: MouseEvent) => void;
  public mouseup: (e: MouseEvent) => void;
  public mousemove: (e: MouseEvent) => void;
  public doubleclick: (e: MouseEvent) => void;
  public keypressed: (e: KeyboardEvent) => void;
  public copy: (e: ClipboardEvent) => void;  
  public paste: (e: ClipboardEvent) => void;  
}

class HTMLCell implements ICell {
  public _row: MutableNumber;
  public _col: MutableNumber;
  public _displayVal: string;  
  public parent: ISpreadsheetView;
  public div: HTMLDivElement;
  constructor(parent: ISpreadsheetView, mutableRow: MutableNumber, mutableCol: MutableNumber) {
    this.parent = parent;

    this.div = document.createElement("div");
    this.div.setAttribute("contenteditable", "false");
    this.div.classList.add("cell");
    this.div.setAttribute("data-type", "cell");

    this._row = mutableRow;
    this._col = mutableCol;
    this.row = mutableRow.val;
    this.col = mutableCol.val;
    this.displayVal = parent.mv.model.cellVals[this.col][this.row];
  }
  setDisplayVal(newVal: string) {
    this.displayVal = newVal;
  }
  getDisplayVal() {
    return this._displayVal;
  }
  setCol(newVal: number) {
    this.col = newVal;
  }
  getCol() {
    return this.col;
  }
  setRow(newVal: number) {
    this.row = newVal;
  }
  getRow() {
    return this.row;
  }
  beginEdits() {
    this.div.setAttribute("contentEditable", "true");
    this.div.focus();
  }
  finishEdits() {
    this.div.setAttribute("contentEditable", "false");
    this.parent.mv.model.cellVals[this.col][this.row] = this.div.innerHTML.toString();
  }
  select() {
    var container = <HTMLTableCellElement>this.div.parentElement;
    this.div.classList.add("selected");
    container.classList.add("selectedtd");
  }
  deselect() {
    var container = <HTMLTableCellElement>this.div.parentElement;
    this.div.classList.remove("selected");
    container.classList.remove("selectedtd");
  }
  startFocus() {
    var parentElement = <HTMLTableCellElement>this.div.parentElement;
    parentElement.classList.add("focusedtd");
  }
  endFocus() {
    this.finishEdits();
    var parentElement = <HTMLTableCellElement>this.div.parentElement;
    parentElement.classList.remove("focusedtd");
  }
  getHTMLElement() {
    return this.div;
  }

  set displayVal(newVal: string) {
    this._displayVal = newVal;
    this.div.innerHTML = newVal;
  }
  get displayVal() {
    return this._displayVal;
  }
  set col(newVal: number) {
    this._col.val = newVal;
  }
  get col() {
    return this._col.val;
  }
  set row(newVal: number) {
    this._row.val = newVal;
  }
  get row() {
    return this._row.val;
  }
}

class HTMLSpreadsheetModel implements ISpreadsheetModel {
  public cellVals: string[][];
  public width: number;
  public height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cellVals = new Array();
    for (var i = 0; i < width; i++) {
      this.cellVals[i] = new Array();
      for (var j = 0; j < height; j++) {
        this.cellVals[i][j] = i + " " + j;
      }
    }
  }

  processMessage(msg: Message) {}

  getCell(x: number, y: number): string {
    return this.cellVals[x][y];
  }
  setCell(x: number, y: number, newCell: string) {
    this.cellVals[x][y] = newCell;

    var event = new CustomEvent("cellchanged", {detail: {
      cellx: x,
      celly: y,
    }});
    dispatchEvent(event);

    var msg = new CellChangeMessage(x, y);
    sendMessage(this, msg);
  }
  insertCol(colNum: number) {
    this.cellVals.splice(colNum, 0, new Array());
    for (var i = 0; i < this.height; i++) {
      this.cellVals[colNum][i] = "";
    }
    this.width++;
  }
  
  deleteCol(colNum: number) {
    this.cellVals.splice(colNum, 1);
    this.width--;
  }


  insertRow(rowNum: number) {
    for (var i = 0; i < this.width; i++) {
      this.cellVals[i].splice(rowNum, 0, "");
    }
    this.height++;
  }
  deleteRow(rowNum: number) {
    for (var i = 0; i < this.width; i++) {
      this.cellVals[i].splice(rowNum, 1);
    }
    this.height--;
  }
  clearCell(x: number, y: number) {
    this.setCell(x, y, "");
  }
}

class HTMLSpreadsheetViewModel implements ISpreadsheetViewModel{
  public model: ISpreadsheetModel;
  //public view: ISpreadsheetView;
  public highlightedCells: boolean[][];
  public focusedCellX: number;
  public focusedCellY: number;

  public focusedCell: HTMLCell;
  public mouseDown: boolean; //for highlighting
  public editing: boolean; //for navigation, if false, not editing a cell
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;
  public events: SpreadsheetEventObject;

  public eventManager: any;

  insertRow(rowNum: number) {
    this.minX = 0;
    this.maxX = this.model.width - 1;
    this.minY = rowNum;
    this.maxY = rowNum;
    this.selectArea();
    this.model.insertRow(rowNum);
    this.focusCell(0, rowNum);
  }

  insertCol(colNum: number) {
    this.minY = 0;
    this.maxY = this.model.height - 1;
    this.minX = colNum;
    this.maxX = colNum;
    this.selectArea();
    this.focusCell(colNum, 0);
  }

  deleteRow (rowNum: number) {
    this.minX = 0;
    this.maxX = this.model.width - 1;
    this.minY = rowNum;
    this.maxY = rowNum;
    this.selectArea();
    this.focusCell(0, rowNum);
  }
  deleteCol(colNum: number) {
    this.minY = 0;
    this.maxY = this.model.height - 1;
    this.minX = colNum;
    this.maxX = colNum;
    this.selectArea();
    this.focusCell(colNum, 0);
  }

  move(skipCheck: boolean, xAmount: number, yAmount: number): void {
    if (this.focusedCellX + xAmount >= 0 &&
      this.focusedCellX + xAmount < this.model.width &&
      this.focusedCellY + yAmount >= 0 &&
      this.focusedCellY + yAmount < this.model.height) {
      if (!this.editing || skipCheck) {
        this.focusedCellX += xAmount;
        this.focusedCellY += yAmount;
        this.clearSelections();
        this.focusCell(this.focusedCellX, this.focusedCellY);
      }
    }
  }

  mouseClicked(e: MouseEvent) {
    console.log(this);
    this.mouseDown = true;
    var cellX: number;
    var cellY: number;
    cellX = getCellX(<HTMLTableCellElement>(<HTMLDivElement>e.target).parentElement);
    cellY = getCellY(<HTMLTableCellElement>(<HTMLDivElement>e.target).parentElement);
    if (typeof cellX !== 'undefined') {
      this.mouseDown = true;
      if (!e.shiftKey) {
        this.clearSelections();
        this.focusCell(cellX, cellY);
      }
      else {
        this.mouseSelectRange(cellX, cellY);
      }
    }
  }

  clearSelections() {
    this.highlightedCells = new Array();
    for (var i = 0; i < this.model.width; i++) {
      this.highlightedCells[i] = new Array();
      for (var j = 0; j < this.model.height; j++) {
        this.highlightedCells[i][j] = false;
      }
    }
  }

  focusCell(cellX: number, cellY: number) {
    this.minX = cellX;
    this.maxX = cellX;
    this.minY = cellY;
    this.maxY = cellY;
    console.log("In focusCell");
    //cell.focus();
    console.log(cellX);
    console.log(cellY);
    this.focusedCellX = cellX;
    this.focusedCellY = cellY;


    this.focusChanged();

    //if not selected?? then
    this.select(cellX, cellY);
  }

  clearCell(x: number, y: number) {
    this.model.clearCell(x, y);
  }

  select(cellX: number, cellY: number) {
    this.highlightedCells[cellX][cellY] = true;
    this.selectionChanged();
    //THROW BACK SELECTION CHANGED EVENT
  } 

  mouseSelectRange(cellX: number, cellY: number) {
    if(cellX == this.focusedCellX && cellY == this.focusedCellY) {
      document.getSelection().removeAllRanges();
      //this.focusedCell._div.focus();
    }
    this.minX = Math.min(cellX, this.focusedCellX);
    this.maxX = Math.max(cellX, this.focusedCellX);
    this.minY = Math.min(cellY, this.focusedCellY);
    this.maxY = Math.max(cellY, this.focusedCellY);
    this.selectArea();

  }

  selectArea() {
    this.clearSelections();
    for (var i = this.minX; i <= this.maxX; i++) {
      for (var j = this.minY; j <= this.maxY; j++) {
        this.highlightedCells[i][j] = true;
      }
    }//PUSH BACK SELECTION CHANGE
    this.selectionChanged();
  }

  focusChanged() {
    var event = new CustomEvent("focuschanged");
    dispatchEvent(event);
    sendMessage(this, MSG_ON_FOCUS);
  }

  selectionChanged() {
    var event = new CustomEvent("selectionchanged");
    dispatchEvent(event);

    sendMessage(this, MSG_ON_SELECTION)
  }
  beginEdits() {
    this.editing = true;
    console.log("edits = true");

    var event = new CustomEvent("beginedits");
    dispatchEvent(event);

    sendMessage(this, MSG_ON_BEGIN_EDIT)
  }


  constructor(model: ISpreadsheetModel) {
    this.model = model;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.editing = false;
    this.mouseDown = false;
    this.highlightedCells = new Array();
    for (var i = 0; i < model.width; i++) {
      this.highlightedCells[i] = new Array();
      for (var j = 0; j < model.height; j++) {
        this.highlightedCells[i][j] = false;
      }
    }

    this.eventManager = function() {
      var that = this;
      return {
        doubleClick: function(e: MouseEvent) {
          if ((<HTMLDivElement>e.target).dataset["type"] == "cell") {
            console.log("doubleclick");
            that.beginEdits();
          }
        },
        mouseClick: function(e: MouseEvent) {
          if (e.target instanceof HTMLDivElement) {
            var div = <HTMLDivElement>e.target;
            var type = div.dataset["type"];
            if (type === "cell") {
              var cellX: number;
              var cellY: number;
              cellX = getCellX(<HTMLTableCellElement>div.parentElement);
              cellY = getCellY(<HTMLTableCellElement>div.parentElement);
              that.mouseDown = true;
              if (!e.shiftKey) {
                that.clearSelections();
                that.focusCell(cellX, cellY);
              }
              else {
                that.mouseSelectRange(cellX, cellY);
              }
              
            }
            if (type === "label") {
              var num = parseInt(div.dataset["num"]) - 1;
              if (div.dataset["col"] === "true") {
                if (!e.shiftKey) {
                  that.focusCell(num, 0);
                  that.minX = num;
                  that.maxX = num;
                  that.minY = 0;
                  that.maxY = that.model.height - 1;
                  that.selectArea();
                }
                else {
                  that.minX = Math.min(num, that.focusedCellX);
                  that.maxX = Math.max(num, that.focusedCellX);
                  that.minY = 0;
                  that.maxY = that.model.height - 1;
                  that.selectArea();
                }
              }
              else {
                if (!e.shiftKey) {
                  that.focusCell(0, num);
                  that.minX = 0;
                  that.maxX = that.model.width - 1;
                  that.minY = num;
                  that.maxY = num;
                  that.selectArea();
                }
                else {
                  that.minX = 0;
                  that.maxX = that.model.width - 1;
                  that.minY = Math.min(num, that.focusedCellY);
                  that.maxY = Math.max(num, that.focusedCellY);
                  that.selectArea();

                }
              }
            }
          }
        },

        mouseUp: function(e: MouseEvent) {
          console.log("mouse up");
          that.mouseDown = false;
        },
        mouseMoved: function(e: MouseEvent) {
          //FIX ME, I WILL BREAK WHEN NOT OVER A DIV!
          var cellX: number;
          var cellY: number;
          if ((<HTMLElement>e.target).nodeName == "DIV") {
            cellX = getCellX(<HTMLTableCellElement>(<HTMLDivElement>e.target).parentElement);
            cellY = getCellY(<HTMLTableCellElement>(<HTMLDivElement>e.target).parentElement);
            if (that.mouseDown) {
              that.mouseSelectRange(cellX, cellY);
            }
          }
        },


        copy: function(e: ClipboardEvent){
          var str = "";
          for (var i = that.minY; i <= that.maxY; i++) {
            for (var j = that.minX; j <= that.maxX; j++) {
              str = str + that.model.cellVals[j][i];
              if (j < that.maxX) {
                str = str + '\t';
              }
            }
            if (i < that.maxY) {
              str = str + '\r\n';
            }
          }
          e.clipboardData.setData('text/plain', str);
          e.preventDefault();
        },

        paste: function(e: ClipboardEvent) {
          if (!that.editing) {
            that.clearSelections();
            var lines = e.clipboardData.getData("text/plain").split("\r\n");
            var maxW = 0;
            for (var i = 0; i < lines.length; i++) {
              var cells = lines[i].split("\t");
              if (cells.length > maxW) {
                maxW = cells.length;
              }
            }
            for (var i = 0; i < lines.length; i++) {
              var cells = lines[i].split("\t");
              for (var j = 0; j < maxW; j++) {
                if (that.minX + j <= that.model.width 
                  && that.minY + i <= that.model.height) {
                  if (typeof cells[j] !== 'undefined') {
                    that.model.setCell(that.minX + j, that.minY + i, cells[j]);
                  }
                  else {
                    that.model.setCell(that.minX + j, that.minY + i, "");
                  }
                  //that.select(manager.sheet.cell[manager.minX + j - 1][manager.minY + i - 1]);
                }
              }
            }
            //manager.maxX = manager.minX + maxW - 1;
            //manager.maxY = manager.minY + lines.length - 1;
            //manager.removeFocus();
            //manager.focusCell(manager.sheet.cell[manager.minX - 1][manager.minY - 1]);
          }
        },

        keyPressed: function(e: KeyboardEvent) {
          console.log(e); 
          switch (e.keyCode) {

            case 13: //enter
              if (e.shiftKey) {
                that.move(true, 0, -1);
              }
              else {
                that.move(true, 0, 1);
              }
              if (that.editing) {
                e.preventDefault();
              }

              break;
            case 8: //backspace/delete
            case 46:
              console.log("backspace pressed");
              if (!that.editing) {
                console.log("not currently editing");
                console.log(that.selectedCells);
                e.preventDefault();
                for (var i = that.minX; i <= that.maxX; i++) {
                  for (var j = that.minY; j <= that.maxY; j++) {
                    that.clearCell(i, j);
                  }
                }
              }
              break;
            case 37: //left arrow

              if (!that.editing) {
                if (!e.shiftKey) {
                  that.move(false, -1, 0);
                }
                else {
                  if (that.maxX > that.focusedCellX) {
                    that.maxX--;
                    that.selectArea();
                  }
                  else {
                    if (that.minX > 0) {
                      that.minX--;
                      that.selectArea();
                    }
                  }
                }
              }
              break;
            case 38: //up arrow

              if (!that.editing) {
                console.log("up arrow");
                if (!e.shiftKey) {
                  that.move(false, 0, -1);
                }
                else {
                  if (that.maxY > that.focusedCellY) {
                    that.maxY--;
                    that.selectArea();

                  }
                  else {
                    if (that.minY > 0) {
                      that.minY--;
                      that.selectArea();
                    }
                  }
                }
              }
              break;
            case 39: //right arrow
              if (!that.editing) {
                if (!e.shiftKey) {
                  that.move(false, 1, 0);
                }
                else {
                  if (that.minX < that.focusedCellX) {
                    that.minX++;
                    that.selectArea();
                  }
                  else {
                    if (that.maxX < that.model.width - 1) {
                      that.maxX++;
                      that.selectArea();
                    }
                  }
                }
              }
              break;
            case 40: //down arrow

              if (!that.editing) {
                if (!e.shiftKey) {
                  that.move(false, 0, 1);
                }
                else {
                  if (that.minY < that.focusedCellY) {
                    that.minY++;
                    that.selectArea();
                  }
                  else {
                    if (that.maxY < that.model.height - 1) {
                      that.maxY++;
                      that.selectArea();
                    }
                  }
                }
              }
              break;
            case 9: //tab
              e.preventDefault(); //check focus on this one...
              if (e.shiftKey) {
                that.move(true, -1, 0);
              }
              else {
                that.move(true, 1, 0);
              }
              break;
            default:
              if (!that.editing && e.keyCode >= 32 && e.keyCode != 127
                && !e.altKey && !e.ctrlKey) {
                console.log(e.keyCode);
                that.clearCell(that.focusedCellX, that.focusedCellY);
                that.beginEdits();
              
            }
          }
        }

      };
    }

    var eventGrabber = this.eventManager();

    this.events = new SpreadsheetEventObject();

    
    this.events.mousedown = eventGrabber.mouseClick,
    this.events.mouseup = eventGrabber.mouseUp,
    this.events.mousemove = eventGrabber.mouseMoved,
    this.events.doubleclick = eventGrabber.doubleClick,
    this.events.keypressed = eventGrabber.keyPressed,
    this.events.copy = eventGrabber.copy,
    this.events.paste = eventGrabber.paste
    
  }

  processMessage(msg: Message):void {
    console.log("mv");
    console.log(msg);
  }
}



class HTMLSpreadsheetView extends Widget implements ISpreadsheetView {
  public columnLabels: HTMLLabel[];
  public mutableColVals: MutableNumber[];
  public mutableRowVals: MutableNumber[];
  public rowLabels: HTMLLabel[];
  public cells: ICell[][];
  public mv: ISpreadsheetViewModel;
  public table: HTMLTableElement;
  public focusedCell: ICell;

  constructor(modelView: HTMLSpreadsheetViewModel) {
    super();
    this.mv = modelView;
    this.table = <HTMLTableElement>document.createElement("table");
    this.table.classList.add("spreadsheet");

    this.mutableColVals = new Array();
    this.mutableRowVals = new Array();
    this.cells = new Array();


    for (var i = 0; i < this.mv.model.height; i++) {
      this.mutableRowVals[i] = new MutableNumber(i);
    }

    for (var i = 0; i < this.mv.model.width; i++) {
      this.mutableColVals[i] = new MutableNumber(i);
    }


    for (var i = 0; i <= this.mv.model.height; i++) { //create height + 1 rows for labels and cells
      this.table.insertRow();
      if (i > 0) {
        this.cells[i - 1] = new Array();
      }
      var row = <HTMLTableRowElement>this.table.rows[i];
      for (var j = 0; j <= this.mv.model.width; j++) {
        var cell = <HTMLTableCellElement>row.insertCell();
        if (j > 0 && i > 0) {
          this.cells[i - 1][j - 1] = new HTMLCell(this, this.mutableRowVals[i - 1], this.mutableColVals[j - 1]); //fill in later
          this.attachCell(this.cells[i - 1][j - 1]);
        }
      }
    }

    this.columnLabels = new Array();
    this.rowLabels = new Array();
    for (var i = 1; i <= this.mv.model.height; i++) {
      var row = <HTMLTableRowElement>this.table.rows[i];
      var cell = <HTMLTableCellElement>row.cells[0];
      this.rowLabels[i] = new HTMLLabel(i, false, cell);
    }
    for (var i = 1; i <= this.mv.model.width; i++) {
      var row = <HTMLTableRowElement>this.table.rows[0];
      var cell = <HTMLTableCellElement>row.cells[i];
      this.columnLabels[i] = new HTMLLabel(i, true, cell);
    }
    this.node.appendChild(this.table);
    if (this.mv.events.mousedown != undefined) {
      this.addCallback("mousedown", this.mv.events.mousedown, this.table);
    }
    if (this.mv.events.mouseup != undefined) {
      this.addCallback("mouseup", this.mv.events.mouseup, document);
    }
    if (this.mv.events.mousemove != undefined) {
      this.addCallback("mousemove", this.mv.events.mousemove, document);
    }
    if (this.mv.events.doubleclick != undefined) {
      this.addCallback("dblclick", this.mv.events.doubleclick, this.table);
    }
    if (this.mv.events.keypressed != undefined) {
      this.addCallback("keydown", this.mv.events.keypressed, document);
    }
    if (this.mv.events.copy != undefined) {
      this.addCallback("copy", this.mv.events.copy, document);
    }

    (function(that: HTMLSpreadsheetView) {
      addEventListener("selectionchanged", function(e: CustomEvent) {
        that.updateSelections();

      });
      //this.table.
      addEventListener("focuschanged", function(e: CustomEvent) {
        that.updateFocus();

      });
      addEventListener("cellchanged", function(e: CustomEvent) {
        that.cells[e.detail.celly][e.detail.cellx].setDisplayVal(that.mv.model.cellVals[e.detail.cellx][e.detail.celly]);
      });

      addEventListener("beginedits", function(e: CustomEvent) {
          that.focusedCell.beginEdits();
      });

      // that.table.addEventListener("dblclick", function(e: MouseEvent) {
      //   if ((<HTMLDivElement>e.target).dataset["cellx"] != undefined) {
      //     that.focusedCell.div.setAttribute("contentEditable", true);
      //     that.focusedCell.div.focus();
      //   }

      // });

    })(this);
    this.createMenu();
  }

  processMessage(msg: Message) {
    console.log(msg);
  }

  updateSelections() {
    for (var i = 0; i < this.cells.length; i++) {
      for (var j = 0; j < this.cells[0].length; j++) {

        if (this.mv.highlightedCells[j][i]) {
          this.cells[i][j].select();
        }
        else {
          this.cells[i][j].deselect();
        }
      }
    }
  }

  updateFocus() {
    if (this.focusedCell != undefined) {
      this.focusedCell.endFocus();
      this.mv.editing = false;
    }
    console.log(this.mv.focusedCellX);
    console.log(this.mv.focusedCellY);
    this.focusedCell = this.cells[this.mv.focusedCellY][this.mv.focusedCellX];
    this.focusedCell.startFocus();
  }

  attachCell(cell: ICell) {
    var row = <HTMLTableRowElement>this.table.rows[cell.getRow() + 1];
    var tableCell = (<HTMLTableRowElement>this.table.rows[cell.getRow() + 1]).cells[cell.getCol() + 1];
    tableCell.appendChild(cell.getHTMLElement());
  }
  addCallback(event: string, callback: EventListener, to: EventTarget) {
    to.addEventListener(event, callback);
  }
  insertCol(colNum: number) {
    this.mv.model.insertCol(colNum);
    var row = <HTMLTableRowElement>this.table.rows[0];
    var cell = <HTMLTableCellElement>row.insertCell(colNum + 1);

    this.columnLabels.splice(colNum, 0, new HTMLLabel(colNum + 1, true, cell));
    this.mutableColVals.splice(colNum, 0, new MutableNumber(colNum));

    for (var i = 0; i < this.mv.model.height; i++) {
      row = <HTMLTableRowElement>this.table.rows[i + 1];
      row.insertCell(colNum + 1);
      this.cells[i].splice(colNum, 0, new HTMLCell(this, this.mutableRowVals[i], this.mutableColVals[colNum]));
      this.attachCell(this.cells[i][colNum]);
    }

    for (var j = colNum + 2; j <= this.mv.model.width; j++) {
      this.columnLabels[j].val++;;
      this.columnLabels[j].div.innerHTML = this.columnLabels[j].val.toString();
    }
    this.mv.insertCol(colNum);
  }
  deleteCol(colNum: number){
    this.mv.model.deleteCol(colNum);
    this.columnLabels.splice(colNum, 1);
    var row = <HTMLTableRowElement>this.table.rows[0];
    row.deleteCell(colNum + 1);
    for (var i = 0; i < this.mv.model.height; i++) {
      row = <HTMLTableRowElement>this.table.rows[i + 1];
      row.deleteCell(colNum + 1);
      this.cells[i].splice(colNum, 1);
      
      this.cells[i][0].setCol(this.cells[i][0].getCol() - 1);
    }
    for (var j = colNum + 1; j <= this.mv.model.width; j++) {
      this.columnLabels[j].val--;
      this.columnLabels[j].div.innerHTML = this.columnLabels[j].val.toString();
    }
    this.mv.deleteCol(colNum);
  }
  insertRow(rowNum: number) {
    this.mv.model.insertRow(rowNum);

    this.cells.splice(rowNum, 0, new Array());
    var row = <HTMLTableRowElement>this.table.insertRow(rowNum + 1);
    var label = <HTMLTableCellElement>row.insertCell();
    this.rowLabels.splice(rowNum, 0, new HTMLLabel(rowNum + 1, false, label));
    this.mutableRowVals.splice(rowNum, 0, new MutableNumber(rowNum));

    for (var i = 0; i < this.mv.model.width; i++) {
      row.insertCell();
      this.cells[rowNum][i] = new HTMLCell(this, this.mutableRowVals[rowNum], this.mutableColVals[i]);
      this.attachCell(this.cells[rowNum][i]);
    }

    for (var j = rowNum + 2; j <= this.mv.model.height; j++) { //all the rest of the cells
      this.rowLabels[j].val++;
      this.rowLabels[j].div.innerHTML = this.rowLabels[j].val.toString();
      this.cells[j][0].setRow(this.cells[j][0].getRow() + 1);
    }

    this.mv.insertRow(rowNum);
  }
  deleteRow(rowNum: number) {
    console.log(rowNum);
    this.mv.model.deleteRow(rowNum);
    this.cells.splice(rowNum, 1);
    this.table.deleteRow(rowNum + 1);
    this.rowLabels.splice(rowNum, 1);
    for (var i = 0; i < this.mv.model.width; i++) {
      for (var j = rowNum; j <= this.mv.model.height; j++) {
        if (i == 0) {        
          this.rowLabels[j].val--;
          this.rowLabels[j].div.innerHTML = this.rowLabels[j].val.toString();
        }
      }
      this.cells[0][i].setRow(this.cells[0][i].getRow() - 1);
    }
    this.mv.deleteRow(rowNum);
  }
  sortColAsc(col: number) {
    this.sortByCol(col, true);
  }
  sortColDesc(col: number) {
    this.sortByCol(col, false);
  }

  sortByCol(colNum: number, ascending: boolean): void {
    var nums: number[] = [];
    for (var i = 0; i < this.mv.model.height; i++) {
      nums.push(i);
    }
    console.log(this.mv.model.cellVals[colNum])
    if (ascending) {
      nums = this.sortCol(nums, this.mv.model.cellVals[colNum]);
    }
    else {
      nums = this.sortCol(nums, this.mv.model.cellVals[colNum], function(a: string, b: string) {
        return b < a;
      });
    }
    console.log(nums);
    var newVals: string[][] = [];
    for (var i = 0; i < this.mv.model.width; i++) {
      newVals.push([]);
    }
    for (var i = 0; i < this.mv.model.height; i++) {
      for (var j = 0; j < this.mv.model.width; j++) {
        newVals[j][i] = this.mv.model.cellVals[j][nums[i]];
      }
    }
    console.log(newVals);
    this.mv.model.cellVals = newVals;
    for (var i = 0; i < this.mv.model.width; i++) {
      for (var j = 0; j < this.mv.model.height; j++) {
        this.cells[j][i].setDisplayVal(this.mv.model.cellVals[i][j]);
      }
    }
    console.log(this.mv.model.cellVals[colNum]);
  }
  protected sortCol(nums: number[], vals: string[], sorter?: (a: string, b: string) => boolean): number[] {
    if (vals.length == 0) {
      return nums;
    }
    if (!sorter) {
      console.log("No sort function passed");
      sorter = function(a: string, b: string) {
        return a < b;
      }
    }
    var leftVals: string[] = [];
    var leftNums: number[] = [];
    var rightVals: string[] = [];
    var rightNums: number[] = [];
    var pivot = vals[0];

    for (var i = 1; i < vals.length; i++) {
      if ((sorter(vals[i], pivot) || pivot == "") && vals[i] != "") {
        leftVals.push(vals[i]);
        leftNums.push(nums[i]);
      }
      else {
        rightVals.push(vals[i]);
        rightNums.push(nums[i]);
      }
    }
    return this.sortCol(leftNums, leftVals, sorter).concat(nums[0])
      .concat(this.sortCol(rightNums, rightVals, sorter));
  }


  createMenu(): void {
    (function(view: HTMLSpreadsheetView) {

      var handler = {
        rowBefore: () => {
          console.log("Add row before");
          view.insertRow(view.mv.focusedCellY);
        },
        rowAfter: () => {
          console.log("Add row after");
          view.insertRow(view.mv.focusedCellY + 1);
        },
        colBefore: () => {
          console.log("Add col before");
          view.insertCol(view.mv.focusedCellX);
        },
        colAfter: () => {
          console.log("Add col after");
          view.insertCol(view.mv.focusedCellX + 1);
        },
        delRow: () => {
          console.log("Delete row");
          view.deleteRow(view.mv.focusedCellY);
        },
        delCol: () => {
          console.log("Delete col");
          view.deleteCol(view.mv.focusedCellX);
        },
        sortColAsc: () => {
          console.log("Sort col asc");
          view.sortColAsc(view.mv.focusedCellX);
        },
        sortColDesc: () => {
          console.log("Sort col desc");
          view.sortColDesc(view.mv.focusedCellX);
        },
      };
      var rowBeforeItem = new MenuItem({
        text: "Insert Row Before",
        className: 'rowBefore'
      });
      var rowAfterItem = new MenuItem({
        text: "Insert Row After",
        className: 'rowAfter'
      });
      var colBeforeItem = new MenuItem({
        text: "Insert Column Before",
        className: 'colBefore'
      });
      var colAfterItem = new MenuItem({
        text: "Insert Column After",
        className: 'colAfter'
      });
      var delRowItem = new MenuItem({
        text: "Delete Row",
        className: 'delRow'
      });
      var delColItem = new MenuItem({
        text: "Delete Column",
        className: 'delCol'
      });
      var sortColAscItem = new MenuItem({
        text: "Sort By Column A-Z",
        className: 'sortAscCol'
      });
      var sortColDescItem = new MenuItem({
        text: "Sort By Column Z-A",
        className: 'sortDescCol'
      });

      rowBeforeItem.handler = handler.rowBefore;
      rowAfterItem.handler = handler.rowAfter;
      colBeforeItem.handler = handler.colBefore;
      colAfterItem.handler = handler.colAfter;
      delRowItem.handler = handler.delRow;
      delColItem.handler = handler.delCol;
      sortColAscItem.handler = handler.sortColAsc;
      sortColDescItem.handler = handler.sortColDesc;

      var rightClickMenu = new Menu();

      rightClickMenu.items = [
        rowBeforeItem,
        rowAfterItem,
        colBeforeItem,
        colAfterItem,
        delRowItem,
        delColItem,
        sortColAscItem,
        sortColDescItem];
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            rightClickMenu.popup(x, y);
        });
    })(this);
  }

}




function main() {
  setup();
}

function setup(): void {
  //var spreadsheet = new Spreadsheet(27, 60);

  var spreadsheet2 = new HTMLSpreadsheetView(new HTMLSpreadsheetViewModel(new HTMLSpreadsheetModel(27, 60)));
  spreadsheet2.addClass("scroll");
  spreadsheet2.attach(document.getElementById('main'));
  
  //spreadsheet.attach(document.getElementById('main'));
  //spCol.horizontalSizePolicy = SizePolicy.Fixed;

  //spreadsheet.fit();
  spreadsheet2.fit();

  //window.onresize = () => spreadsheet.fit();
  window.onresize = () => spreadsheet2.fit();

  console.log("blahh");
}

window.onload = main;
