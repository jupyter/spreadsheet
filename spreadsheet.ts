/// <reference path="./typings/tsd.d.ts" />
/// <reference path="../phosphor/dist/phosphor.d.ts" />

//// <reference path="./backbone.d.ts" />


import Orientation = phosphor.widgets.Orientation;
import SizePolicy = phosphor.widgets.SizePolicy;
import Widget = phosphor.widgets.Widget;
import SplitPanel = phosphor.widgets.SplitPanel;
import Size = phosphor.utility.Size;
import Menu = phosphor.widgets.Menu;
import MenuBar = phosphor.widgets.MenuBar;
import MenuItem = phosphor.widgets.MenuItem;
//import EventEmitter from Node;



// //import Connect = phosphor.core.Connect;

// /*
// Split Table Function
// Need to make label split around. Make labels into trees. Mess heavily with views.
// -Focus on making the build operation fast - how many cells can be kept/moved/changed to avoid reinstantiating? Freelist?
// -Be able to load pandas?



// TODO
// -BACKBONE INTEGRATION
// -Should make preventDefault only happen if focused on the spreadsheet.
// -Shift select rows/cols
// -Select all upon the top left corner?
// -Make cells extend for longer text
// -Undo/Redo
// */

// /*known bugs
// -Internet Explorer mystery focus on click
// -Some stuff doesnt work on internet explorer because it is an amazing program
// */

// function is(type: string, obj: Object) {
//   var clas = Object.prototype.toString.call(obj).slice(8, -1);
//   return obj !== undefined && obj !== null && clas === type;
// }

// class MutableNumber { //get rid of this?
//   private _num: number;
//   constructor(num: number) {
//     this._num = num;
//   }
//   get num(): number {
//     return this._num;
//   }
//   set num(newVal: number) {
//     this._num = newVal;
//   }
// }

// class SplitLabel extends SplitPanel {
//   private panel: SplitPanel;
//   constructor(idx: number, data: any[]) {
//     super(Orientation.Vertical);
//     this.addWidget(new Label(true, new MutableNumber(idx)));
//     if (data.length > 0) {
//       this.panel = new SplitPanel(Orientation.Horizontal);
//       this.addWidget(this.panel);
//       for (var i = 0; i < data.length; i++) {
//         this.panel.addWidget(new SplitLabel(i, data[i]));
//       }
//     }
//   }
// }

// class Label extends Widget {
//   //private _div: JQuery;
//   private _div: HTMLDivElement;
//   private _isCol: boolean;
//   private _num: MutableNumber;
//   constructor(isCol: boolean, num: MutableNumber) {
//     super();
//     //this._div = $('<div/>').attr('contenteditable', 'false');
//     this._div = <HTMLDivElement>document.createElement("div");
//     this._num = num;
//     this._isCol = isCol;
//     this.updateText();

//     // this._div.appendTo(this.node);
//     // this._div.addClass('label');
//     // this._div.data("label", this);
//     this.node.appendChild(this._div);
//     this._div.classList.add('label');

//     this.addClass('content');
//     this.verticalSizePolicy = SizePolicy.Fixed;
//     this.horizontalSizePolicy = SizePolicy.MinimumExpanding;
//   }

//   get column(): boolean {
//     return this._isCol;
//   }
//   get num(): number {
//     if (this._num == null) {
//       return 0;
//     }
//     return this._num.num;
//   }

//   updateText(): void {
//     var num = this.num;
//     this._div.innerHTML = "";
//     if (!this._isCol) {
//       this._div.innerHTML = num.toString();
//     }
//     else {
//       while (num > 0) {
//         num--;
//         this._div.innerHTML = String.fromCharCode(65 + (num % 26)) + this._div.innerHTML;
//         num = Math.floor(num / 26);
//       }
//     }
//   }
// }

// class Cell extends Widget {
//   private _cellx: MutableNumber;
//   private _celly: MutableNumber;
//   private _sheet: Spreadsheet;
//   private _div: JQuery;

//   constructor(parent : Spreadsheet, x : MutableNumber, y : MutableNumber) {
//     super();
//     this._cellx = x;
//     this._celly = y;
//     this._sheet = parent;
//     this._div = $('<div/>').attr('contenteditable', 'false');
//     //this.attach(this._div);
//     this._div.appendTo(this.node);
//     this._div.addClass('cell');
//     this._div.data("cell", this);

//     this.addClass('content');
//     this.verticalSizePolicy = SizePolicy.Fixed;
//     this.horizontalSizePolicy = SizePolicy.MinimumExpanding;

//     this.updateView();


//     this._div.focus(this, this.onFocus);
//     this._div.blur(this, this.onBlur)
//   }


//   onFocus(e : JQueryEventObject) {
//     console.log(e);
//   }

//   onBlur(e : JQueryEventObject) {
//     console.log(e);
//     var cell = <Cell>e.data;
//     cell.pushBack();
//   }

//   focus() {
//     this._div.focus();
//     this._div.addClass('focused');
//   }

//   editable() {
//     this._div.attr('contenteditable', 'true');
//   }

//   updateView() {
//     this._div.text(this._sheet.cellVal[this.cellX - 1][this.cellY - 1]);
//   }
//   pushBack() {
//     this._sheet.cellVal[this.cellX - 1][this.cellY - 1] = this._div.text();
//     this._div.attr('contenteditable', 'false');
//     this._sheet.selector.endEdits();
//   }
//   equals(other : Cell): boolean {
//     return this.cellX == other.cellX && this.cellY == other.cellY;
//   }

//   get text(): string {
//     return this._div.text();
//   }

//   addDivClass(clas: string): void {
//     this._div.addClass(clas);
//   }
//   removeDivClass(clas: string): void {
//     this._div.removeClass(clas);
//   }

//   focusDiv(): void {
//     this._div.focus();
//   }

//   get cellX(): number {
//     return this._cellx.num;
//   }
//   get cellY(): number {
//     return this._celly.num;
//   }
// }

// class SelectionManager {
//   private sheet: Spreadsheet;
//   private selectedCells: Cell[];
//   private focusedCell: Cell;
//   private mouseDown: boolean; //for highlighting
//   private editing: boolean; //for navigation, if false, not editing a cell
//   private minX: number;
//   private maxX: number;
//   private minY: number;
//   private maxY: number;

//   constructor(sheet : Spreadsheet) {
//     this.sheet = sheet;
//     this.selectedCells = new Array();
//     this.editing = false;

//     (function(sheet : Spreadsheet, manager : SelectionManager) {

//       /* ----------------- MOUSE DOWN ----------------------*/
//       sheet.node.addEventListener("mousedown", function (e : MouseEvent) {
//         if (is('HTMLDivElement', e.target)) {
//           var cell = <Cell>$(e.target).data("cell");
//           var label = <Label>$(e.target).data("label");

//           if (typeof cell !== 'undefined') {
//             manager.mouseDown = true;
//             if (!e.shiftKey) {

//               manager.removeFocus();
//               manager.clearSelections();

//               manager.focusCell(cell);
//             }
//             else {
//               manager.mouseSelectRange(cell);
//             }
//           }
//           if (typeof label !== 'undefined') {
//             if (e.shiftKey) {
//               if (label.column) {/*
//                 if (label.num manager.focusedCell.cellX) {

//                 }*/
//                 manager.minX = manager.focusedCell.cellX;
//                 manager.maxX = manager.focusedCell.cellX;
//                 for (var i = Math.min(label.num, manager.focusedCell.cellX); 
//                   i < Math.max(label.num, manager.focusedCell.cellX + 1);
//                   i++) {
//                   manager.selectCol(i);
//                 }
//               }
//               else {
//                 manager.minY = manager.focusedCell.cellY;
//                 manager.maxY = manager.focusedCell.cellY;
//                 for (var i = Math.min(label.num, manager.focusedCell.cellY); 
//                   i < Math.max(label.num, manager.focusedCell.cellY) + 1;
//                   i++) {
//                   manager.selectRow(i);
//                 }
//               }
//             }
//             else {
//               manager.removeFocus();
//               manager.clearSelections();
//               if (label.column) {
//                 manager.focusCell(sheet.cell[label.num - 1][0]);
//                 manager.selectCol(label.num);
//               }
//               else {
//                 manager.focusCell(sheet.cell[0][label.num - 1]);
//                 manager.selectRow(label.num);
//               }
//             }
//           }
//         }
//       });

//       /* ----------------- MOUSE MOVE ----------------------*/
//       sheet.node.addEventListener("mousemove", function (e : MouseEvent){
//         if (typeof e.target !== 'undefined' && 
//           typeof manager.focusedCell != 'undefined') {
//           var cell = <Cell>$(e.target).data("cell");
//           if(manager.mouseDown && typeof cell !== 'undefined' && 
//             !manager.editing) {
//             manager.mouseSelectRange(cell);
//           }
//         }
//       });

//       /* --------------- MOUSE UP --------------------------*/
//       //sheet.node.addEventListener("mouseup", function (e : MouseEvent) {
//       $(window).mouseup(function (e : JQueryEventObject) {
//         manager.mouseDown = false;
//       });

//       /* -------------- DOUBLE CLICK ---------------------*/
//       sheet.node.addEventListener("dblclick", function (e : MouseEvent) {
//         if (typeof e.target !== 'undefined' && 
//           typeof $(e.target).data('cell') !== 'undefined') {
//           manager.beginEdits();
//         }
//       });

//       /* --------------------KEY PRESS -----------------------*/

//       window.addEventListener("keydown", function (e : KeyboardEvent) {
//         switch (e.keyCode) {

//           case 13: //enter
//             if (e.shiftKey) {
//               manager.move(true, 0, -1);
//             }
//             else {
//               manager.move(true, 0, 1);
//             }
//             if (manager.editing) {
//               e.preventDefault();
//             }
            
//             break;
//           case 8: //backspace/delete
//           case 46:
//             console.log("backspace pressed");
//             if (!manager.editing) {
//               e.preventDefault();
//               for (var i = 0; i < manager.selectedCells.length; i++) {
                
//                 manager.clearCell(manager.selectedCells[i]);
//               }
//             }
//             break;
//           case 37: //left arrow
//             if (!e.shiftKey) {
//               manager.move(false, -1, 0);
//             }
//             else {
//               if (manager.maxX > manager.focusedCell.cellX) {
//                 manager.maxX--;
//                 manager.selectArea();
//               }
//               else {
//                 if (manager.minX > 1) {
//                   manager.minX--;
//                   manager.selectArea();
//                 }
//               }
//             }
//             break;
//           case 38: //up arrow
//             if (!e.shiftKey) {
//               manager.move(false, 0, -1);
//             }
//             else {
//               if (manager.maxY > manager.focusedCell.cellY) {
//                 manager.maxY--;
//                 manager.selectArea();
              
//               }
//               else {
//                 if (manager.minY > 1) {
//                   manager.minY--;
//                   manager.selectArea();
//                 }
//               }
//             }
//             break;
//           case 39: //right arrow
//             if (!e.shiftKey) {
//               manager.move(false, 1, 0);
//             }
//             else {
//               if (manager.minX < manager.focusedCell.cellX) {
//                 manager.minX++;
//                 manager.selectArea();
//               }
//               else {
//                 if (manager.maxX < sheet.cwidth) {
//                   manager.maxX++;
//                   manager.selectArea();
//                 }
//               }
//             }
//             break;
//           case 40: //down arrow
//             if (!e.shiftKey) {
//               manager.move(false, 0, 1);
//             }
//             else {
//               if (manager.minY < manager.focusedCell.cellY) {
//                 manager.minY++;
//                 manager.selectArea();
//               }
//               else {
//                 if (manager.maxY < sheet.cheight) {
//                   manager.maxY++;
//                   manager.selectArea();
//                 }
//               }
//             }
//             break;
//           case 9: //tab
//             e.preventDefault(); //check focus on this one...
//             if (e.shiftKey) {
//               manager.move(true, -1, 0);
//             }
//             else {
//               manager.move(true, 1, 0);
//             }
//             break;
//           default:
//             if (!manager.editing && e.keyCode >= 32 && e.keyCode != 127 
//               && !e.altKey && !e.ctrlKey) {
//               console.log(e.keyCode);
//               if (typeof manager.focusedCell !== 'undefined') {
//                 manager.clearCell(manager.focusedCell);
//                 manager.beginEdits();
//               }
//             }
//         }
//       });

//       window.addEventListener("copy", function(e : ClipboardEvent){
//         var str = "";
//         for (var i = manager.minY; i <= manager.maxY; i++) {
//           for (var j = manager.minX; j <= manager.maxX; j++) {
//             str = str + manager.sheet.cell[j - 1][i - 1].text;
//             if (j < manager.maxX) {
//               str = str + '\t';
//             }
//           }
//           if (i < manager.maxY) {
//             str = str + '\r\n';
//           }
//         }
//         e.clipboardData.setData('text/plain', str);
//         e.preventDefault();
//       });

//       window.addEventListener("paste", function(e: ClipboardEvent) {
//         if (!manager.editing) {
//           manager.clearSelections();
//           var lines = e.clipboardData.getData("text/plain").split("\r\n");
//           var maxW = 0;
//           for (var i = 0; i < lines.length; i++) {
//             var cells = lines[i].split("\t");
//             if (cells.length > maxW) {
//               maxW = cells.length;
//             }
//           }
//           for (var i = 0; i < lines.length; i++) {
//             var cells = lines[i].split("\t");
//             for (var j = 0; j < maxW; j++) {
//               if (manager.minX + j <= sheet.cwidth 
//                 && manager.minY + i <= sheet.cheight) {
//                 if (typeof cells[j] !== 'undefined') {
//                   manager.setCell(manager.minX + j - 1, manager.minY + i - 1, cells[j]);
//                 }
//                 else {
//                   manager.setCell(manager.minX + j - 1, manager.minY + i - 1, "");
//                 }
//                 manager.select(manager.sheet.cell[manager.minX + j - 1][manager.minY + i - 1]);
//               }
//             }
//           }
//           manager.maxX = manager.minX + maxW - 1;
//           manager.maxY = manager.minY + lines.length - 1;
//           manager.removeFocus();
//           manager.focusCell(manager.sheet.cell[manager.minX - 1][manager.minY - 1]);
//         }
//       });
//     })(this.sheet, this);

//     this.focusCell(this.sheet.cell[0][0]);
//     this.createMenu();
//   }

//   insertRow(rowNum: number): void {
//     this.sheet.insertRow(rowNum);
//     for (var i = 0; i < this.sheet.label.length; i++) {
//       if (this.sheet.label[i].num >= rowNum) {
//         this.sheet.label[i].updateText();
//       }
//     }

//     this.removeFocus();
//     this.clearSelections();
//     this.focusCell(this.sheet.cell[0][rowNum - 1]);
//     this.selectRow(rowNum);
//   }

//   insertCol(colNum: number): void {
//     this.sheet.insertCol(colNum);
//     for (var i = 0; i < this.sheet.label.length; i++) {
//       if (this.sheet.label[i].num >= colNum) {
//         this.sheet.label[i].updateText();
//       }
//     }

//     this.removeFocus();
//     this.clearSelections();
//     this.focusCell(this.sheet.cell[colNum - 1][0]);
//     this.selectCol(colNum);
//   }

//   deleteRow(rowNum : number): void {
//     this.sheet.deleteRow(rowNum);

//     console.log(this.focusedCell);
//     this.removeFocus();
//     this.clearSelections();
//     this.focusCell(this.sheet.cell[0][rowNum - 1]);
//     if (this.sheet.cheight < rowNum) {
//       this.selectRow(rowNum - 1);
//     }
//     else {
//       this.selectRow(rowNum);
//     }

//   }

//   deleteCol(colNum : number): void {

//     this.sheet.deleteCol(colNum);
//     this.removeFocus();
//     this.clearSelections();
//     this.focusCell(this.sheet.cell[colNum - 1][0]);

//     if (this.sheet.cwidth < colNum) {
//       this.selectCol(colNum - 1);
//     }
//     else {
//       this.selectCol(colNum);
//     }
//   }

//   createMenu(): void {
//     (function(manager : SelectionManager) {

//       var handler = {
//         rowBefore: () => {
//           console.log("Add row before");
//           manager.insertRow(manager.focusedCell.cellY);
//         },
//         rowAfter: () => {
//           console.log("Add row after"); 
//           manager.insertRow(manager.focusedCell.cellY + 1);
//         },
//         colBefore: () => {
//           console.log("Add col before"); 
//           manager.insertCol(manager.focusedCell.cellX - 1);
//         },
//         colAfter: () => {
//           console.log("Add col after"); 
//           manager.insertCol(manager.focusedCell.cellX + 1);
//         },
//         delRow: () => {
//           console.log("Delete row"); 
//           manager.deleteRow(manager.focusedCell.cellY - 1);
//         },
//         delCol: () => {
//           console.log("Delete col"); 
//           manager.deleteCol(manager.focusedCell.cellX);
//         },
//         sortColAsc: () => {
//           console.log("Sort col asc"); 
//           manager.sortColAsc(manager.focusedCell.cellX);
//         },
//         sortColDesc: () => {
//           console.log("Sort col desc"); 
//           manager.sortColDesc(manager.focusedCell.cellX);
//         },
//       };
//       var rowBeforeItem = new MenuItem({
//         text: "Insert Row Before",
//         className: 'rowBefore'
//       });
//       var rowAfterItem = new MenuItem({
//         text: "Insert Row After",
//         className: 'rowAfter'
//       });
//       var colBeforeItem = new MenuItem({
//         text: "Insert Column Before",
//         className: 'colBefore'
//       });
//       var colAfterItem = new MenuItem({
//         text: "Insert Column After",
//         className: 'colAfter'
//       });
//       var delRowItem = new MenuItem({
//         text: "Delete Row",
//         className: 'delRow'
//       });
//       var delColItem = new MenuItem({
//         text: "Delete Column",
//         className: 'delCol'
//       });
//       var sortColAscItem = new MenuItem({
//         text: "Sort By Column A-Z",
//         className: 'sortAscCol'
//       });
//       var sortColDescItem = new MenuItem({
//         text: "Sort By Column Z-A",
//         className: 'sortDescCol'
//       });

//       rowBeforeItem.triggered.connect(handler.rowBefore);
//       rowAfterItem.triggered.connect(handler.rowAfter);
//       colBeforeItem.triggered.connect(handler.colBefore);
//       colAfterItem.triggered.connect(handler.colAfter);
//       delRowItem.triggered.connect(handler.delRow);
//       delColItem.triggered.connect(handler.delCol);
//       sortColAscItem.triggered.connect(handler.sortColAsc);
//       sortColDescItem.triggered.connect(handler.sortColDesc);

//       var rightClickMenu = new Menu([
//         rowBeforeItem,
//         rowAfterItem,
//         colBeforeItem,
//         colAfterItem,
//         delRowItem,
//         delColItem,
//         sortColAscItem,
//         sortColDescItem]);
//           document.addEventListener('contextmenu', function (event) {
//               event.preventDefault();
//               var x = event.clientX;
//               var y = event.clientY;
//               rightClickMenu.popup(x, y);
//           });
//     })(this);
//   }

//   removeFocus(): void {
//     if (typeof this.focusedCell !== 'undefined') {
//       this.focusedCell.removeDivClass('focused');
//     }
//   }

//   focusCell(cell : Cell): void {
//     this.minX = cell.cellX;
//     this.maxX = cell.cellX;
//     this.minY = cell.cellY;
//     this.maxY = cell.cellY;

//     cell.focus();
//     this.focusedCell = cell;
//     this.select(cell);
//   }

//   mouseSelectRange(target : Cell): void {
//     if (!target.equals(this.focusedCell)) {
//       document.getSelection().removeAllRanges();
//       //this.focusedCell._div.focus();
//     }
//     this.minX = Math.min(target.cellX, this.focusedCell.cellX);
//     this.maxX = Math.max(target.cellX, this.focusedCell.cellX);
//     this.minY = Math.min(target.cellY, this.focusedCell.cellY);
//     this.maxY = Math.max(target.cellY, this.focusedCell.cellY);
//     this.selectArea();
//   }

//   selectArea(): void {
//     this.clearSelections();
//     for (var i = this.minX; i <= this.maxX; i++) {
//       for (var j = this.minY; j <= this.maxY; j++) {
//         this.select(this.sheet.cell[i - 1][j - 1]);
//       }
//     }
//   }

//   selectRow(rowNum: number): void {
//     /*this.sheet.getCell(0, rowNum).focus();
//     this.focusedCell = this.sheet.getCell(0, rowNum);*/
//     this.minX = 1;
//     this.maxX = this.sheet.cwidth;
//     this.minY = Math.min(rowNum, this.minY);
//     this.maxY = Math.max(rowNum, this.maxY);
//     this.selectArea();
//   }

//   selectCol(colNum: number): void {
//     if (colNum >= 0) {
//       /*for (var i = 0; i < this.sheet.cheight; i++) {
//         this.select(this.sheet.getCell(colNum, i));
//       }
//       this.sheet.getCell(colNum, 0).focus();
//       this.focusedCell = this.sheet.getCell(colNum, 0);*/
//       this.minY = 1;
//       this.maxY = this.sheet.cheight;
//       this.minX = Math.min(colNum, this.minX);
//       this.maxX = Math.max(colNum, this.maxX);
//       this.selectArea();
//     }
//   }


//   clearCell (cell : Cell): void {
//     this.sheet.cellVal[cell.cellX - 1][cell.cellY - 1] = "";
//     cell.updateView();
//   }

//   move(skipCheck : boolean, xAmount : number, yAmount : number): void {
//     if (typeof this.focusedCell !== 'undefined' && 
//       this.focusedCell.cellX + xAmount > 0 && 
//       this.focusedCell.cellX + xAmount <= this.sheet.cwidth && 
//       this.focusedCell.cellY + yAmount > 0 && 
//       this.focusedCell.cellY + yAmount <= this.sheet.cheight) {
//       if (!this.editing || skipCheck) {
//         this.clearSelections();
//         this.focusedCell.pushBack();
//         this.focusedCell.removeDivClass('focused');

//         var cell = this.sheet.cell[this.focusedCell.cellX - 1 + xAmount] 
//           [this.focusedCell.cellY - 1 + yAmount];
//         this.focusCell(cell);
//       }
//     }
//   }

//   setCell(x : number, y : number, newVal : string): void {
//     this.sheet.cellVal[x][y] = newVal;
//     this.sheet.cell[x][y].updateView();
//   }

//   select(cell : Cell): void {
//     this.selectedCells.push(cell);
//     cell.addDivClass('selected');
//   }

//   clearSelections(): void {
//     for (var i = 0; i < this.selectedCells.length; i++) {
//       this.selectedCells[i].removeDivClass('selected');
//     }
//     this.selectedCells = new Array();
//   }

//   beginEdits(): void {
//     if (typeof this.focusedCell !== 'undefined') {
//       this.focusedCell.editable();
//       this.focusedCell.focusDiv();
//       this.editing = true;
//     }
//   }
//   endEdits(): void {
//     this.editing = false;
//   }
//   sortColAsc(col: number) {
//     this.sheet.sortByCol(col, true);
//   }
//   sortColDesc(col: number) {
//     this.sheet.sortByCol(col, false);
//   }

// }


// //act like model class
// class Spreadsheet extends SplitPanel {
//   private _columns: SplitPanel[];
//   private _cells: Cell[][];
//   private _labels: Label[];
//   private _cellVals: string[][];
//   private _selector: SelectionManager;
//   private _xVals: MutableNumber[];
//   private _yVals: MutableNumber[];

//   constructor(width: number, height: number) {
//     super(Orientation.Horizontal);
//     this._columns = new Array();
//     this._labels = new Array();

//     this.handleSize = 1;
//     this._cells = new Array();
//     this._cellVals = new Array();
//     this._xVals = new Array();
//     this._yVals = new Array();
//     var panel = new SplitPanel(Orientation.Vertical);
//     var label = new Label(true, null);
//     panel.addWidget(label);
//     this._labels.push(label);
//     for (var i = 1; i <= height; i++) {
//       this._yVals.push(new MutableNumber(i));
//       label = new Label(false, this._yVals[i - 1]);
//       panel.addWidget(label);
//       this._labels.push(label);
//     }
//     this.addWidget(panel);
//     this._columns.push(panel);

//     for (var i = 1; i <= width; i++) {
//       panel = new SplitPanel(Orientation.Vertical);
//       this._xVals.push(new MutableNumber(i));
//       this._cells.push(new Array());
//       this._cellVals.push(new Array());
//       label = new Label(true, this._xVals[i - 1]);
//       panel.addWidget(label);
//       this._labels.push(label);
//       for (var j = 1; j <= height; j++) {
//         this._cellVals[i - 1].push("");

//         var cell = new Cell(this, this._xVals[i - 1], this._yVals[j - 1]);
//         panel.addWidget(cell);
//         this._cells[i - 1].push(cell);
//       }
//       this.addWidget(panel);
//       this._columns.push(panel);
//     }

//     this._selector = new SelectionManager(this);
//   }
//   get selector(): SelectionManager {
//     return this._selector;
//   }
//   get label(): Label[] {
//     return this._labels;
//   }
//   delLabel(idx: number): void {
//     this._labels[idx].dispose();
//     this._labels.splice(idx, 1);
//   }

//   get cell(): Cell[][] {
//     return this._cells;
//   }
//   get cwidth(): number {
//     return this._cells.length;
//   }
//   get cheight(): number {
//     return this._cells[0].length;
//   }
//   get cellVal(): string[][] {
//     return this._cellVals;
//   }

//   updateCells(): void {
//     for (var i = 0; i < this.cwidth; i++) {
//       for (var j = 0; j < this.cheight; j++) {
//         console.log(i + " " + j);
//         this.cell[i][j].updateView();
//       }
//     }
//   }

//   insertRow(rowNum: number): void {
//     this._yVals.push(new MutableNumber(this._yVals.length + 1));
//     var label = new Label(false, this._yVals[this._yVals.length - 1]);
//     this._columns[0].addWidget(label);
//     this._labels.push(label);

//     for (var i = 1; i < this._columns.length; i++) {
//       this._cellVals[i - 1].splice(rowNum - 1, 0, "");
//       var cell = new Cell(this, this._xVals[i - 1], this._yVals[this._yVals.length - 1]);
//       this._cells[i - 1].push(cell);
//       this._columns[i].addWidget(cell);
//     }
//     this.updateCells();
//   }

//   insertCol(colNum: number): void {
//     var panel = new SplitPanel(Orientation.Vertical);
//     this.addWidget(panel);
//     this._xVals.push(new MutableNumber(this._xVals.length + 1));
//     var label = new Label(true, this._xVals[this._xVals.length - 1]);
//     panel.addWidget(label);
//     this._labels.push(label);
//     this._columns.push(panel);

//     var len = this._cells[0].length;
//     this._cells.push(new Array());
//     this._cellVals.splice(colNum - 1, 0, new Array());

//     for (var i = 0; i < len; i++) {
//       var cell = new Cell(this, this._xVals[this._xVals.length - 1], this._yVals[i]);
//       panel.addWidget(cell);
//       this._cellVals[colNum - 1].push("");
//       this._cells[this.cwidth - 1].push(cell);
//     }
//     this.updateCells();
//   }

//   deleteRow(rowNum: number): void {
//     for (var i = 0; i < this.cwidth; i++) {
//       this._cells[i][this.cheight - 1].dispose();
//       this._cells[i].splice(this.cheight - 1, 1);
//       this._cellVals[i].splice(rowNum - 1, 1);
//     }
//     for (var i = 0; i < this.label.length; i++) {
//       if (this.label[i].num == this._yVals[this._yVals.length - 1].num && !this.label[i].column) {
//         this.delLabel(i--);
//       }
//       else {
//         this.label[i].updateText();
//       }
//     }
//     this._yVals.splice(this.cheight - 1, 1);
//     this.updateCells();
//   }
//   deleteCol(colNum: number): void {
//     while (this._cells[this.cwidth - 1].length > 0) {
//       this._cells[this.cwidth - 1][0].dispose();
//       this._cells[this.cwidth - 1].splice(0, 1);
//       this._cellVals[colNum - 1].splice(0, 1);
//     }
//     for (var i = 0; i < this.label.length; i++) {
//       if (this.label[i].num == this._xVals[this._xVals.length - 1].num && this.label[i].column) {
//         this.delLabel(i--);
//       }
//       else {
//         this.label[i].updateText();
//       }
//     }
//     this._cells.splice(this.cwidth - 1, 1);

//     this._columns[this.cwidth + 1].dispose();
//     this._columns.splice(this.cwidth + 1, 1);

//     this._xVals.splice(this.cwidth - 1, 1);
//     this.updateCells();
//   }

//   sortByCol(colNum: number, ascending: boolean): void {
//     var nums: number[] = [];
//     for (var i = 0; i < this.cheight; i++) {
//       nums.push(i);
//     }
//     if (ascending) {
//       nums = this.sortCol(nums, this._cellVals[colNum - 1]);
//     }
//     else {
//       nums = this.sortCol(nums, this._cellVals[colNum - 1], function(a: string, b: string) {
//         return b < a;
//       });
//     }
//     console.log(nums);
//     var newVals: string[][] = [];
//     for (var i = 0; i < this.cwidth; i++) {
//       newVals.push([]);
//     }
//     for (var i = 0; i < this.cheight; i++) {
//       for (var j = 0; j < this.cwidth; j++) {
//         console.log(j + " " + i);
//         newVals[j][i] = this.cellVal[j][nums[i]];
//       }
//     }
//     this._cellVals = newVals;
//     for (var i = 0; i < this.cwidth; i++) {
//       for (var j = 0; j < this.cheight; j++) {
//         this._cells[i][j].updateView();
//       }
//     }
//     console.log(this._cellVals[colNum - 1]);
//   }
//   protected sortCol(nums: number[], vals: string[], sorter?: (a: string, b: string) => boolean): number[] {
//     if (vals.length == 0) {
//       return nums;
//     }
//     if (!sorter) {
//       console.log("No sort function passed");
//       sorter = function(a: string, b: string) {
//         return a < b;
//       }
//     }
//     var leftVals: string[] = [];
//     var leftNums: number[] = [];
//     var rightVals: string[] = [];
//     var rightNums: number[] = [];
//     var pivot = vals[0];

//     for (var i = 1; i < vals.length; i++) {
//       if ((sorter(vals[i], pivot) || pivot == "") && vals[i] != "") {
//         leftVals.push(vals[i]);
//         leftNums.push(nums[i]);
//       }
//       else {
//         rightVals.push(vals[i]);
//         rightNums.push(nums[i]);
//       }
//     }
//     return this.sortCol(leftNums, leftVals, sorter).concat(nums[0])
//       .concat(this.sortCol(rightNums, rightVals, sorter));
//   }

// }


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
  events: Object;
  eventManager: any;

  insertRow(rowNum: number): void;
  insertCol(colNum: number): void;
  mouseClicked(e: MouseEvent): void;
  clearSelections(): void;
  focusCell(cellX: number, cellY: number): void;
  clearCell(x: number, y: number): void;
  select(cellX: number, cellY: number): void;
  mouseSelectRange(cellX: number, cellY: number): void;
  selectArea(): void;
  focusChanged(): void;
  selectionChanged(): void;

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
}

interface ICell {
  _row: number;
  _col: number;
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
  getHTMLElement(): HTMLElement;
}

class HTMLLabel {
  public val: number;
  public isCol: boolean;
  public cell: HTMLTableCellElement;
  constructor(val: number, isCol: boolean, newCell: HTMLTableCellElement) {
    this.val = val;
    this.isCol = isCol;
    this.cell = newCell;
    this.cell.innerHTML = this.val.toString();
  }
}

class SpreadsheetEventObject {
  public mousedown;
  public mouseup;
}

class HTMLCell implements ICell {
  public _row: number;
  public _col: number;
  public _displayVal: string;  
  public parent: ISpreadsheetView;
  public div: HTMLDivElement;
  constructor(parent: ISpreadsheetView, row: number, col: number) {
    this.parent = parent;

    this.div = document.createElement("div");
    this.div.setAttribute("contenteditable", "false");
    this.div.classList.add("cell");

    this.row = row;
    this.col = col;
    this.displayVal = parent.mv.model.cellVals[col][row];
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
    var parentElement = <HTMLTableCellElement>this.div.parentElement;
    parentElement.classList.add("focusedtd");
    console.log(parentElement);
  }
  finishEdits() {
    this.div.setAttribute("contentEditable", "false");
    var parentElement = <HTMLTableCellElement>this.div.parentElement;
    parentElement.classList.remove("focusedtd");
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
    this._col = newVal;
    this.div.setAttribute("data-cellX", this._col.toString());
  }
  get col() {
    return this._col;
  }
  set row(newVal: number) {
    this._row = newVal;
    this.div.setAttribute("data-cellY", this._row.toString());
  }
  get row() {
    return this._row;
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
  getCell(x: number, y: number): string {
    return this.cellVals[x][y];
  }
  setCell(x: number, y: number, newCell: string) {
    this.cellVals[x][y] = newCell;

    var event = new CustomEvent("cellchanged", {'detail': {
      'cellx': x,
      'celly': y,
    }});
    dispatchEvent(event);
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
  public events: Object;

  public eventManager: any;

  insertRow(rowNum: number) {
    this.minX = 0;
    this.maxX = this.model.width - 1;
    this.minY = rowNum;
    this.maxY = rowNum;
    this.selectArea();
    this.model.insertRow(rowNum);
    this.focusCell(0, rowNum);
    this.mouseDown = false;
  }

  insertCol(colNum: number) {
    this.minY = 0;
    this.maxY = this.model.height - 1;
    this.minX = colNum;
    this.maxX = colNum;
    this.selectArea();
    this.model.insertRow(colNum);
    this.focusCell(colNum, 0);
    this.mouseDown = false;
  }  

  move(skipCheck: boolean, xAmount: number, yAmount: number): void {
    console.log("moving");
    if (this.focusedCellX + xAmount >= 0 &&
      this.focusedCellX + xAmount < this.model.width &&
      this.focusedCellY + yAmount >= 0 &&
      this.focusedCellY + yAmount < this.model.height) {
      console.log("past first check");
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
    cellX = <number>parseInt(<string>(<HTMLDivElement>e.target).dataset["cellx"]);
    cellY = <number>parseInt(<string>(<HTMLDivElement>e.target).dataset["celly"]);
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
        console.log("cell selected");
        this.highlightedCells[i][j] = true;
      }
    }//PUSH BACK SELECTION CHANGE
    this.selectionChanged();
  }

  focusChanged() {
    console.log("dispatching focus event");
    var event = new CustomEvent("focuschanged");
    dispatchEvent(event);
  }

  selectionChanged() {
    var event = new CustomEvent("selectionchanged");
    dispatchEvent(event);
  }
  beginEdits() {
    this.editing = true;
    console.log("edits = true");

    var event = new CustomEvent("beginedits");
    dispatchEvent(event);
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
          if ((<HTMLDivElement>e.target).dataset["cellx"] != undefined) {
            console.log("doubleclick");
            that.beginEdits();
          }
        },
        mouseClick: function(e: MouseEvent) {
          console.log(that);
          var cellX: number;
          var cellY: number;
          cellX = parseInt(<string>(<HTMLDivElement>e.target).dataset["cellx"]);
          cellY = parseInt((<HTMLDivElement>e.target).dataset["celly"]);
          if (!isNaN(cellX)) {
            that.mouseDown = true;
            if (!e.shiftKey) {
              that.clearSelections();
              that.focusCell(cellX, cellY);
            }
            else {
              that.mouseSelectRange(cellX, cellY);
            }
          }
        },

        mouseUp: function(e: MouseEvent) {
          console.log("mouse up");
          that.mouseDown = false;
        },
        mouseMoved: function(e: MouseEvent) {

          var cellX: number;
          var cellY: number;
          cellX = parseInt((<HTMLDivElement>e.target).dataset["cellx"]);
          cellY = parseInt((<HTMLDivElement>e.target).dataset["celly"]);
          if (that.mouseDown && !isNaN(cellX)) {
            console.log(cellX);
            that.mouseSelectRange(cellX, cellY);
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

    this.events = 
    {
      mousedown: eventGrabber.mouseClick,
      mouseup: eventGrabber.mouseUp,
      mousemove: eventGrabber.mouseMoved,
      doubleclick: eventGrabber.doubleClick,
      keypressed: eventGrabber.keyPressed,
      copy: eventGrabber.copy,
      paste: eventGrabber.paste
    }
  }
}



class HTMLSpreadsheetView extends Widget implements ISpreadsheetView {
  public columnLabels: HTMLLabel[];
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


    this.cells = new Array();

    for (var i = 0; i <= this.mv.model.height; i++) { //create height + 1 rows for labels and cells
      this.table.insertRow();
      if (i > 0) {
        this.cells[i - 1] = new Array();
      }
      var row = <HTMLTableRowElement>this.table.rows[i];
      for (var j = 0; j <= this.mv.model.width; j++) {
        var cell = <HTMLTableCellElement>row.insertCell();
        if (j > 0 && i > 0) {
          this.cells[i - 1][j - 1] = new HTMLCell(this, i - 1, j - 1); //fill in later
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

    console.log(this.mv.events)
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

        console.log("selection changed");

      });
      //this.table.
      addEventListener("focuschanged", function(e: CustomEvent) {
        console.log("got a focus change");
        that.updateFocus();

      });
      addEventListener("cellchanged", function(e: CustomEvent) {
        that.cells[e.detail.celly][e.detail.cellx]._displayVal = that.mv.model.cellVals[e.detail.cellx][e.detail.celly];
        console.log("got cell change");
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

  updateSelections() {
    console.log(this.cells);
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
      this.focusedCell.finishEdits();
      this.mv.editing = false;

    }
    this.focusedCell = this.cells[this.mv.focusedCellY][this.mv.focusedCellX];
    this.focusedCell.beginEdits();
  }

  attachCell(cell: ICell) {
    var row = <HTMLTableRowElement>this.table.rows[cell.getRow() + 1];
    var tableCell = (<HTMLTableRowElement>this.table.rows[cell.getRow() + 1]).cells[cell.getCol() + 1];
    tableCell.appendChild(cell.getHTMLElement());
  }
  addCallback(event: string, callback: EventListener, to: HTMLElement) {
    console.log("adding callback for " + event);
    console.log(event);
    console.log(callback);
    to.addEventListener(event, callback);
  }
  insertCol(colNum: number) {
    this.mv.model.insertCol(colNum);
    var row = <HTMLTableRowElement>this.table.rows[0];
    var cell = <HTMLTableCellElement>row.insertCell(colNum + 1);
    this.columnLabels.push(new HTMLLabel(colNum + 1, true, cell));

    for (var i = 0; i < this.mv.model.height; i++) {
      row = <HTMLTableRowElement>this.table.rows[i + 1];
      row.insertCell(colNum + 1);
      this.cells[i].splice(colNum, 0, new HTMLCell(this, i, colNum));
      this.attachCell(this.cells[i][colNum]);
    }
    this.mv.insertCol(colNum);
  }
  deleteCol(){
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].splice(this.cells[i].length - 1, 1);
    }
  }
  insertRow(rowNum: number) {
    this.mv.model.insertRow(rowNum);
    this.cells.splice(rowNum, 0, new Array());
    var row = <HTMLTableRowElement>this.table.insertRow(rowNum + 1);
    var label = <HTMLTableCellElement>row.insertCell();
    this.rowLabels.push(new HTMLLabel(rowNum + 1, false, label));
    for (var i = 0; i < this.mv.model.width; i++) {
      row.insertCell();
      this.cells[rowNum][i] = new HTMLCell(this, rowNum, i);
      this.attachCell(this.cells[rowNum][i]);
      for (var j = rowNum + 1; j < this.mv.model.height; j++) {
        if (i == 0) {
          this.rowLabels[j].val++;
        }
        this.cells[j][i].setRow(this.cells[j][i].getRow() + 1);

      }
    }

    this.mv.insertRow(rowNum);
  }
  deleteRow() {
    this.cells.splice(this.cells.length - 1, 1);
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
          //view.deleteRow(view.mv.focusedCellY - 1);
        },
        delCol: () => {
          console.log("Delete col");
          //view.deleteCol(view.mv.focusedCellX);
        },
        sortColAsc: () => {
          console.log("Sort col asc");
          //view.sortColAsc(view.mv.focusedCellX);
        },
        sortColDesc: () => {
          console.log("Sort col desc");
          //view.sortColDesc(view.mv.focusedCellX);
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

      rowBeforeItem.triggered.connect(handler.rowBefore);
      rowAfterItem.triggered.connect(handler.rowAfter);
      colBeforeItem.triggered.connect(handler.colBefore);
      colAfterItem.triggered.connect(handler.colAfter);
      delRowItem.triggered.connect(handler.delRow);
      delColItem.triggered.connect(handler.delCol);
      sortColAscItem.triggered.connect(handler.sortColAsc);
      sortColDescItem.triggered.connect(handler.sortColDesc);

      var rightClickMenu = new Menu([
        rowBeforeItem,
        rowAfterItem,
        colBeforeItem,
        colAfterItem,
        delRowItem,
        delColItem,
        sortColAscItem,
        sortColDescItem]);
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
}

window.onload = main;
