/// <reference path="./typings/tsd.d.ts" />
/// <reference path="../phosphor/dist/phosphor.d.ts" />
import Orientation = phosphor.widgets.Orientation;
import SizePolicy = phosphor.widgets.SizePolicy;
import Widget = phosphor.widgets.Widget;
import SplitPanel = phosphor.widgets.SplitPanel;
import Size = phosphor.utility.Size;
import Menu = phosphor.widgets.Menu;
import MenuBar = phosphor.widgets.MenuBar;
import MenuItem = phosphor.widgets.MenuItem;
import connect = phosphor.core.connect;

/*
TODO
-Should make preventDefault only happen if focused on the spreadsheet.
-Shift select rows/cols
-Select all upon the top left corner?
-Make cells extend for longer text
-Undo/Redo
*/

/*known bugs
-Internet Explorer mystery focus on click
-Some stuff doesnt work on internet explorer because it is an amazing program
*/

function is(type : string, obj : Object) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

class MutableNumber {
  private _num: number;
  constructor(num: number) {
    this._num = num;
  }
  get num(): number {
    return this._num;
  }
  set num(newVal: number) {
    this._num = newVal;
  }
}

class Label extends Widget {
  private _div: JQuery;
  private _isCol: boolean;
  private _num: MutableNumber;
  constructor(isCol: boolean, num: MutableNumber) {
    super();
    this._div = $('<div/>').attr('contenteditable', 'false');
    this._num = num;
    this._isCol = isCol;
    this.updateText();

    this._div.appendTo(this.node);
    this._div.addClass('label');
    this._div.data("label", this);

    this.addClass('content');
    this.verticalSizePolicy = SizePolicy.Fixed;
    this.horizontalSizePolicy = SizePolicy.MinimumExpanding;
  }

  get column(): boolean {
    return this._isCol;
  }
  get num(): number {
    if (this._num == null) {
      return 0;
    }
    return this._num.num;
  }

  updateText() {
    var num = this.num;
    this._div.text("");
    if (!this._isCol) {
      this._div.text(num);
    }
    else {
      while (num > 0) {
        num--;
        this._div.text(String.fromCharCode(65 + (num % 26)) + this._div.text());
        num = Math.floor(num / 26);
      }
    }
  }
}

class Cell extends Widget {
  private _cellx : MutableNumber;
  private _celly : MutableNumber;
  private _sheet : Spreadsheet;
  private _div : JQuery;

  constructor(parent : Spreadsheet, x : MutableNumber, y : MutableNumber) {
    super();
    this._cellx = x;
    this._celly = y;
    this._sheet = parent;
    this._div = $('<div/>').attr('contenteditable', 'false');
    //this.attach(this._div);
    this._div.appendTo(this.node);
    this._div.addClass('cell');
    this._div.data("cell", this);

    this.addClass('content');
    this.verticalSizePolicy = SizePolicy.Fixed;
    this.horizontalSizePolicy = SizePolicy.MinimumExpanding;

    this.updateView();


    this._div.focus(this, this.onFocus);
    this._div.blur(this, this.onBlur)
  }


  onFocus(e : JQueryEventObject) {
    console.log(e);
  }

  onBlur(e : JQueryEventObject) {
    console.log(e);
    var cell = <Cell>e.data;
    cell.pushBack();
  }

  focus() {
    this._div.focus();
    this._div.addClass('focused');
  }

  editable() {
    this._div.attr('contenteditable', 'true');
  }

  updateView() {
    this._div.text(this._sheet.cellVal[this.cellX - 1][this.cellY - 1]);
  }
  pushBack() {
    this._sheet.cellVal[this.cellX - 1][this.cellY - 1] = this._div.text();
    this._div.attr('contenteditable', 'false');
    this._sheet.selector.endEdits();
  }
  equals(other : Cell): boolean {
    return this.cellX == other.cellX && this.cellY == other.cellY;
  }

  get text() : string {
    return this._div.text();
  }

  addDivClass(clas: string) {
    this._div.addClass(clas);
  }
  removeDivClass(clas: string) {
    this._div.removeClass(clas);
  }

  focusDiv() {
    this._div.focus();
  }

  get cellX(): number {
    return this._cellx.num;
  }
  get cellY(): number {
    return this._celly.num;
  }
}

class SelectionManager {
  private sheet: Spreadsheet;
  private selectedCells: Cell[];
  private focusedCell: Cell;
  private mouseDown: boolean; //for highlighting
  private editing: boolean; //for navigation, if false, not editing a cell
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  constructor(sheet : Spreadsheet) {
    this.sheet = sheet;
    this.selectedCells = new Array();
    this.editing = false;

    (function(sheet : Spreadsheet, manager : SelectionManager) {

      /* ----------------- MOUSE DOWN ----------------------*/
      sheet.node.addEventListener("mousedown", function (e : MouseEvent) {
        if (is('HTMLDivElement', e.target)) {
          var cell = <Cell>$(e.target).data("cell");
          var label = <Label>$(e.target).data("label");

          if (typeof cell !== 'undefined') {
            manager.mouseDown = true;
            if (!e.shiftKey) {

              manager.removeFocus();
              manager.clearSelections();

              manager.focusCell(cell);
            }
            else {
              manager.mouseSelectRange(cell);
            }
          }
          if (typeof label !== 'undefined') {
            if (e.shiftKey) {
              if (label.column) {/*
                if (label.num manager.focusedCell.cellX) {

                }*/
                manager.minX = manager.focusedCell.cellX;
                manager.maxX = manager.focusedCell.cellX;
                for (var i = Math.min(label.num, manager.focusedCell.cellX); 
                  i < Math.max(label.num, manager.focusedCell.cellX + 1);
                  i++) {
                  manager.selectCol(i);
                }
              }
              else {
                manager.minY = manager.focusedCell.cellY;
                manager.maxY = manager.focusedCell.cellY;
                for (var i = Math.min(label.num, manager.focusedCell.cellY); 
                  i < Math.max(label.num, manager.focusedCell.cellY) + 1;
                  i++) {
                  manager.selectRow(i);
                }
              }
            }
            else {
              manager.removeFocus();
              manager.clearSelections();
              if (label.column) {
                manager.focusCell(sheet.cell[label.num - 1][0]);
                manager.selectCol(label.num);
              }
              else {
                manager.focusCell(sheet.cell[0][label.num - 1]);
                manager.selectRow(label.num);
              }
            }
          }
        }
      });

      /* ----------------- MOUSE MOVE ----------------------*/
      sheet.node.addEventListener("mousemove", function (e : MouseEvent){
        if (typeof e.target !== 'undefined' && 
          typeof manager.focusedCell != 'undefined') {
          var cell = <Cell>$(e.target).data("cell");
          if(manager.mouseDown && typeof cell !== 'undefined' && 
            !manager.editing) {
            manager.mouseSelectRange(cell);
          }
        }
      });

      /* --------------- MOUSE UP --------------------------*/
      //sheet.node.addEventListener("mouseup", function (e : MouseEvent) {
      $(window).mouseup(function (e : JQueryEventObject) {
        manager.mouseDown = false;
      });

      /* -------------- DOUBLE CLICK ---------------------*/
      sheet.node.addEventListener("dblclick", function (e : MouseEvent) {
        if (typeof e.target !== 'undefined' && 
          typeof $(e.target).data('cell') !== 'undefined') {
          manager.beginEdits();
        }
      });

      /* --------------------KEY PRESS -----------------------*/

      window.addEventListener("keydown", function (e : KeyboardEvent) {
        switch (e.keyCode) {

          case 13: //enter
            if (e.shiftKey) {
              manager.move(true, 0, -1);
            }
            else {
              manager.move(true, 0, 1);
            }
            if (manager.editing) {
              e.preventDefault();
            }
            
            break;
          case 8: //backspace/delete
          case 46:
            console.log("backspace pressed");
            if (!manager.editing) {
              e.preventDefault();
              for (var i = 0; i < manager.selectedCells.length; i++) {
                
                manager.clearCell(manager.selectedCells[i]);
              }
            }
            break;
          case 37: //left arrow
            if (!e.shiftKey) {
              manager.move(false, -1, 0);
            }
            else {
              if (manager.maxX > manager.focusedCell.cellX) {
                manager.maxX--;
                manager.selectArea();
              }
              else {
                if (manager.minX > 1) {
                  manager.minX--;
                  manager.selectArea();
                }
              }
            }
            break;
          case 38: //up arrow
            if (!e.shiftKey) {
              manager.move(false, 0, -1);
            }
            else {
              if (manager.maxY > manager.focusedCell.cellY) {
                manager.maxY--;
                manager.selectArea();
              
              }
              else {
                if (manager.minY > 1) {
                  manager.minY--;
                  manager.selectArea();
                }
              }
            }
            break;
          case 39: //right arrow
            if (!e.shiftKey) {
              manager.move(false, 1, 0);
            }
            else {
              if (manager.minX < manager.focusedCell.cellX) {
                manager.minX++;
                manager.selectArea();
              }
              else {
                if (manager.maxX < sheet.cwidth) {
                  manager.maxX++;
                  manager.selectArea();
                }
              }
            }
            break;
          case 40: //down arrow
            if (!e.shiftKey) {
              manager.move(false, 0, 1);
            }
            else {
              if (manager.minY < manager.focusedCell.cellY) {
                manager.minY++;
                manager.selectArea();
              }
              else {
                if (manager.maxY < sheet.cheight) {
                  manager.maxY++;
                  manager.selectArea();
                }
              }
            }
            break;
          case 9: //tab
            e.preventDefault(); //check focus on this one...
            if (e.shiftKey) {
              manager.move(true, -1, 0);
            }
            else {
              manager.move(true, 1, 0);
            }
            break;
          default:
            if (!manager.editing && e.keyCode >= 32 && e.keyCode != 127 
              && !e.altKey && !e.ctrlKey) {
              console.log(e.keyCode);
              if (typeof manager.focusedCell !== 'undefined') {
                manager.clearCell(manager.focusedCell);
                manager.beginEdits();
              }
            }
        }
      });
      /* --test--*/
      window.addEventListener("copy", function(e : ClipboardEvent){
        var str = "";
        for (var i = manager.minY; i <= manager.maxY; i++) {
          for (var j = manager.minX; j <= manager.maxX; j++) {
            str = str + manager.sheet.cell[j - 1][i - 1].text;
            if (j < manager.maxX) {
              str = str + '\t';
            }
          }
          if (i < manager.maxY) {
            str = str + '\r\n';
          }
        }
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
      });

      window.addEventListener("paste", function(e: ClipboardEvent) {
        if (!manager.editing) {
          manager.clearSelections();
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
              if (manager.minX + j <= sheet.cwidth 
                && manager.minY + i <= sheet.cheight) {
                if (typeof cells[j] !== 'undefined') {
                  manager.setCell(manager.minX + j - 1, manager.minY + i - 1, cells[j]);
                }
                else {
                  manager.setCell(manager.minX + j - 1, manager.minY + i - 1, "");
                }
                manager.select(manager.sheet.cell[manager.minX + j - 1][manager.minY + i - 1]);
              }
            }
          }
          manager.maxX = manager.minX + maxW - 1;
          manager.maxY = manager.minY + lines.length - 1;
          manager.removeFocus();
          manager.focusCell(manager.sheet.cell[manager.minX - 1][manager.minY - 1]);
        }
      });
    })(this.sheet, this);

    this.focusCell(this.sheet.cell[0][0]);
    this.createMenu();
  }

  insertRow(rowNum: number) {
    this.sheet.insertRow(rowNum);
    for (var i = 0; i < this.sheet.label.length; i++) {
      if (this.sheet.label[i].num >= rowNum) {
        this.sheet.label[i].updateText();
      }
    }

    this.removeFocus();
    this.clearSelections();
    this.focusCell(this.sheet.cell[0][rowNum - 1]);
    this.selectRow(rowNum);
  }

  insertCol(colNum: number) {
    this.sheet.insertCol(colNum);
    for (var i = 0; i < this.sheet.label.length; i++) {
      if (this.sheet.label[i].num >= colNum) {
        this.sheet.label[i].updateText();
      }
    }

    this.removeFocus();
    this.clearSelections();
    this.focusCell(this.sheet.cell[colNum - 1][0]);
    this.selectCol(colNum);
  }

  deleteRow(rowNum : number) {
    this.sheet.deleteRow(rowNum);

    console.log(this.focusedCell);
    this.removeFocus();
    this.clearSelections();
    this.focusCell(this.sheet.cell[0][rowNum - 1]);
    if (this.sheet.cheight < rowNum) {
      this.selectRow(rowNum - 1);
    }
    else {
      this.selectRow(rowNum);
    }

  }

  deleteCol(colNum : number) {

    this.sheet.deleteCol(colNum);
    this.removeFocus();
    this.clearSelections();
    this.focusCell(this.sheet.cell[colNum - 1][0]);

    if (this.sheet.cwidth < colNum) {
      this.selectCol(colNum - 1);
    }
    else {
      this.selectCol(colNum);
    }
  }

  createMenu() {
    (function(manager : SelectionManager) {

      var handler = {
        rowBefore: function() {
          console.log("Add row before");
          manager.insertRow(manager.focusedCell.cellY);
        },
        rowAfter: function() {
          console.log("Add row after"); 
          manager.insertRow(manager.focusedCell.cellY + 1);
        },
        colBefore: function() {
          console.log("Add col before"); 
          manager.insertCol(manager.focusedCell.cellX);
        },
        colAfter: function() {
          console.log("Add col after"); 
          manager.insertCol(manager.focusedCell.cellX + 1);
        },
        delRow: function() {
          console.log("Delete row"); 
          manager.deleteRow(manager.focusedCell.cellY);
        },
        delCol: function() {
          console.log("Delete col"); 
          manager.deleteCol(manager.focusedCell.cellX);
        },
        sortColAsc: function() {
          console.log("Sort col asc"); 
          manager.sortColAsc(manager.focusedCell.cellX);
        },
        sortColDesc: function() {
          console.log("Sort col desc"); 
          manager.sortColDesc(manager.focusedCell.cellX);
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

      connect(rowBeforeItem, MenuItem.triggered, handler, handler.rowBefore);
      connect(rowAfterItem, MenuItem.triggered, handler, handler.rowAfter);
      connect(colBeforeItem, MenuItem.triggered, handler, handler.colBefore);
      connect(colAfterItem, MenuItem.triggered, handler, handler.colAfter);
      connect(delRowItem, MenuItem.triggered, handler, handler.delRow);
      connect(delColItem, MenuItem.triggered, handler, handler.delCol);
      connect(sortColAscItem, MenuItem.triggered, handler, handler.sortColAsc);
      connect(sortColDescItem, MenuItem.triggered, handler, handler.sortColDesc);

      var rightClickMenu = new Menu([
        rowBeforeItem,
        rowAfterItem,
        colBeforeItem,
        colAfterItem,
        delRowItem,
        delColItem,
        sortColAscItem,
        sortColDescItem]);
          document.addEventListener('contextmenu', function (event) {
              event.preventDefault();
              var x = event.clientX;
              var y = event.clientY;
              rightClickMenu.popup(x, y);
          });
    })(this);
  }

  removeFocus() {
    if (typeof this.focusedCell !== 'undefined') {
      this.focusedCell.removeDivClass('focused');
    }
  }

  focusCell(cell : Cell) {
    this.minX = cell.cellX;
    this.maxX = cell.cellX;
    this.minY = cell.cellY;
    this.maxY = cell.cellY;

    cell.focus();
    this.focusedCell = cell;
    this.select(cell);
  }

  mouseSelectRange(target : Cell) {
    if (!target.equals(this.focusedCell)) {
      document.getSelection().removeAllRanges();
      //this.focusedCell._div.focus();
    }
    this.minX = Math.min(target.cellX, this.focusedCell.cellX);
    this.maxX = Math.max(target.cellX, this.focusedCell.cellX);
    this.minY = Math.min(target.cellY, this.focusedCell.cellY);
    this.maxY = Math.max(target.cellY, this.focusedCell.cellY);
    this.selectArea();
  }

  selectArea() {
    this.clearSelections();
    for (var i = this.minX; i <= this.maxX; i++) {
      for (var j = this.minY; j <= this.maxY; j++) {
        this.select(this.sheet.cell[i - 1][j - 1]);
      }
    }
  }

  selectRow(rowNum: number) {
    /*this.sheet.getCell(0, rowNum).focus();
    this.focusedCell = this.sheet.getCell(0, rowNum);*/
    this.minX = 1;
    this.maxX = this.sheet.cwidth;
    this.minY = Math.min(rowNum, this.minY);
    this.maxY = Math.max(rowNum, this.maxY);
    this.selectArea();
  }

  selectCol(colNum: number) {
    if (colNum >= 0) {
      /*for (var i = 0; i < this.sheet.cheight; i++) {
        this.select(this.sheet.getCell(colNum, i));
      }
      this.sheet.getCell(colNum, 0).focus();
      this.focusedCell = this.sheet.getCell(colNum, 0);*/
      this.minY = 1;
      this.maxY = this.sheet.cheight;
      this.minX = Math.min(colNum, this.minX);
      this.maxX = Math.max(colNum, this.maxX);
      this.selectArea();
    }
  }


  clearCell (cell : Cell) {
    this.sheet.cellVal[cell.cellX - 1][cell.cellY - 1] = "";
    cell.updateView();
  }

  move(skipCheck : boolean, xAmount : number, yAmount : number) {
    if (typeof this.focusedCell !== 'undefined' && 
      this.focusedCell.cellX + xAmount > 0 && 
      this.focusedCell.cellX + xAmount <= this.sheet.cwidth && 
      this.focusedCell.cellY + yAmount > 0 && 
      this.focusedCell.cellY + yAmount <= this.sheet.cheight) {
      if (!this.editing || skipCheck) {
        this.clearSelections();
        this.focusedCell.pushBack();
        this.focusedCell.removeDivClass('focused');

        var cell = this.sheet.cell[this.focusedCell.cellX - 1 + xAmount] 
          [this.focusedCell.cellY - 1 + yAmount];
        this.focusCell(cell);
      }
    }
  }

  setCell(x : number, y : number, newVal : string) {
    this.sheet.cellVal[x][y] = newVal;
    this.sheet.cell[x][y].updateView();
  }

  select(cell : Cell) {
    this.selectedCells.push(cell);
    cell.addDivClass('selected');
  }

  clearSelections() {
    for (var i = 0; i < this.selectedCells.length; i++) {
      this.selectedCells[i].removeDivClass('selected');
    }
    this.selectedCells = new Array();
  }

  beginEdits() {
    if (typeof this.focusedCell !== 'undefined') {
      this.focusedCell.editable();
      this.focusedCell.focusDiv();
      this.editing = true;
    }
  }
  endEdits() {
    this.editing = false;
  }
  sortColAsc(col: number) {
    this.sheet.sortByCol(col, true);
  }
  sortColDesc(col: number) {
    this.sheet.sortByCol(col, false);
  }

}

//act like model class
class Spreadsheet extends SplitPanel {
  private _columns: SplitPanel[];
  private _cells : Cell[][];
  private _labels: Label[];
  private _cellVals : string[][];
  private _selector : SelectionManager;
  private _xVals: MutableNumber[];
  private _yVals: MutableNumber[];

  constructor(width : number, height : number) {
    super(Orientation.Horizontal);
    this._columns = new Array();
    this._labels = new Array();

    this.handleSize = 1;
    this._cells = new Array();
    this._cellVals = new Array();
    this._xVals = new Array();
    this._yVals = new Array();
    var panel = new SplitPanel(Orientation.Vertical);
    var label = new Label(true, null);
    panel.addWidget(label);
    this._labels.push(label);
    for (var i = 1; i <= height; i++) {
      this._yVals.push(new MutableNumber(i));
      label = new Label(false, this._yVals[i - 1]);
      panel.addWidget(label);
      this._labels.push(label);
    }
    this.addWidget(panel);
    this._columns.push(panel);

    for (var i = 1; i <= width; i++) {
      panel = new SplitPanel(Orientation.Vertical);
      this._xVals.push(new MutableNumber(i));
      this._cells.push(new Array());
      this._cellVals.push(new Array());
      label = new Label(true, this._xVals[i - 1]);
      panel.addWidget(label);
      this._labels.push(label);
      for (var j = 1; j <= height; j++) {
        this._cellVals[i - 1].push("");

        var cell = new Cell(this, this._xVals[i - 1], this._yVals[j - 1]);
        panel.addWidget(cell);
        this._cells[i - 1].push(cell);
      }
      this.addWidget(panel);
      this._columns.push(panel);
    }

    this._selector = new SelectionManager(this);
  }
  get selector(): SelectionManager {
    return this._selector;
  }
  get label(): Label[] {
    return this._labels;
  }
  delLabel(idx: number) {
    this._labels[idx].dispose();
    this._labels.splice(idx, 1);
  }

  get cell(): Cell[][] {
    return this._cells;
  }
  get cwidth(): number {
    return this._cells.length;
  }
  get cheight(): number {
    return this._cells[0].length;
  }
  get cellVal(): string[][] {
    return this._cellVals;
  }

  updateCells() {
    for (var i = 0; i < this.cwidth; i++) {
      for (var j = 0; j < this.cheight; j++) {
        console.log(i + " " + j);
        this.cell[i][j].updateView();
      }
    }
  }

  insertRow(rowNum: number) {
    this._yVals.push(new MutableNumber(this._yVals.length + 1));
    var label = new Label(false, this._yVals[this._yVals.length - 1]);
    this._columns[0].addWidget(label);
    this._labels.push(label);

    for (var i = 1; i < this._columns.length; i++) {
      this._cellVals[i - 1].splice(rowNum - 1, 0, "");
      var cell = new Cell(this, this._xVals[i - 1], this._yVals[this._yVals.length - 1]);
      this._cells[i - 1].push(cell);
      this._columns[i].addWidget(cell);
    }
    this.updateCells();
  }

  insertCol(colNum: number) {
    var panel = new SplitPanel(Orientation.Vertical);
    this.addWidget(panel);
    this._xVals.push(new MutableNumber(this._xVals.length + 1));
    var label = new Label(true, this._xVals[this._xVals.length - 1]);
    panel.addWidget(label);
    this._labels.push(label);
    this._columns.push(panel);
    
    var len = this._cells[0].length;
    this._cells.push(new Array());
    this._cellVals.splice(colNum - 1, 0, new Array());

    for (var i = 0; i < len; i++) {
      var cell = new Cell(this, this._xVals[this._xVals.length - 1], this._yVals[i]);
      panel.addWidget(cell);
      this._cellVals[colNum - 1].push("");
      this._cells[this.cwidth - 1].push(cell);
    }
    this.updateCells();
  }

  deleteRow(rowNum: number) {
    for (var i = 0; i < this.cwidth; i++) {
      this._cells[i][this.cheight - 1].dispose();
      this._cells[i].splice(this.cheight - 1, 1);
      this._cellVals[i].splice(rowNum - 1, 1);
    }
    for (var i = 0; i < this.label.length; i++) {
      if (this.label[i].num == this._yVals[this._yVals.length - 1].num && !this.label[i].column) {
        this.delLabel(i--);
      }
      else {
        this.label[i].updateText();
      }
    }
    this._yVals.splice(this.cheight - 1, 1);
    this.updateCells();
  }
  deleteCol(colNum: number) {
    while (this._cells[this.cwidth - 1].length > 0) {
      this._cells[this.cwidth - 1][0].dispose();
      this._cells[this.cwidth - 1].splice(0, 1);
      this._cellVals[colNum - 1].splice(0, 1);
    }
    for (var i = 0; i < this.label.length; i++) {
      if (this.label[i].num == this._xVals[this._xVals.length - 1].num && this.label[i].column) {
        this.delLabel(i--);
      }
      else {
        this.label[i].updateText();
      }
    }
    this._cells.splice(this.cwidth - 1, 1);

    this._columns[this.cwidth + 1].dispose();
    this._columns.splice(this.cwidth + 1, 1);

    this._xVals.splice(this.cwidth - 1, 1);
    this.updateCells();
  }
  
  sortByCol(colNum: number, ascending : boolean) {
    var nums: number[] = [];
    for (var i = 0; i < this.cheight; i++) {
      nums.push(i);
    }
    if (ascending) {
      nums = this.sortCol(nums, this._cellVals[colNum - 1]);
    }
    else {
      nums = this.sortCol(nums, this._cellVals[colNum - 1], function(a: string, b: string) {
        return b < a;
      });
    }
    console.log(nums);
    var newVals: string[][] = [];
    for (var i = 0; i < this.cwidth; i++) {
      newVals.push([]);
    }
    for (var i = 0; i < this.cheight; i++) {
      for (var j = 0; j < this.cwidth; j++) {
        console.log(j + " " + i);
        newVals[j][i] = this.cellVal[j][nums[i]];
      }
    }
    this._cellVals = newVals;
    for (var i = 0; i < this.cwidth; i++) {
      for (var j = 0; j < this.cheight; j++) {
        this._cells[i][j].updateView();
      }
    }
    console.log(this._cellVals[colNum - 1]);
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

}


function main() {
  setup(27, 15);
}

function setup(width : number, height : number) {
  var spreadsheet = new Spreadsheet(width, height);

  spreadsheet.attach(document.getElementById('main'));
  //spCol.horizontalSizePolicy = SizePolicy.Fixed;

    spreadsheet.fit();

   window.onresize = () => spreadsheet.fit();
}

window.onload = main;