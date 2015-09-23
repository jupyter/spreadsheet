(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_menus_1 = require('phosphor-menus');
var phosphor_widget_1 = require('phosphor-widget');
function getCellX(cell) {
    return cell.cellIndex - 1;
}
function getCellY(cell) {
    return cell.parentElement.rowIndex - 1;
}
var CellChangeMessage = (function (_super) {
    __extends(CellChangeMessage, _super);
    function CellChangeMessage(cellX, cellY) {
        _super.call(this, "cellchanged");
        this._cellX = cellX;
        this._cellY = cellY;
    }
    Object.defineProperty(CellChangeMessage.prototype, "cellX", {
        get: function () {
            return this._cellX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellChangeMessage.prototype, "cellY", {
        get: function () {
            return this._cellY;
        },
        enumerable: true,
        configurable: true
    });
    return CellChangeMessage;
})(phosphor_messaging_1.Message);
var MutableNumber = (function () {
    function MutableNumber(val) {
        this.val = val;
    }
    return MutableNumber;
})();
var MSG_ON_FOCUS = new phosphor_messaging_1.Message("focuschanged");
var MSG_ON_SELECTION = new phosphor_messaging_1.Message("selectionchanged");
var MSG_ON_BEGIN_EDIT = new phosphor_messaging_1.Message("beginedits");
var HTMLLabel = (function () {
    function HTMLLabel(val, isCol, newCell) {
        this.val = val;
        this.isCol = isCol;
        this.div = document.createElement("div");
        newCell.appendChild(this.div);
        this.div.innerHTML = this.val.toString();
        this.div.setAttribute("data-type", "label");
        this.div.setAttribute("data-col", isCol.toString());
        this.div.setAttribute("data-num", val.toString());
    }
    return HTMLLabel;
})();
var SpreadsheetEventObject = (function () {
    function SpreadsheetEventObject() {
    }
    return SpreadsheetEventObject;
})();
var HTMLCell = (function () {
    function HTMLCell(parent, mutableRow, mutableCol) {
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
    HTMLCell.prototype.setDisplayVal = function (newVal) {
        this.displayVal = newVal;
    };
    HTMLCell.prototype.getDisplayVal = function () {
        return this._displayVal;
    };
    HTMLCell.prototype.setCol = function (newVal) {
        this.col = newVal;
    };
    HTMLCell.prototype.getCol = function () {
        return this.col;
    };
    HTMLCell.prototype.setRow = function (newVal) {
        this.row = newVal;
    };
    HTMLCell.prototype.getRow = function () {
        return this.row;
    };
    HTMLCell.prototype.beginEdits = function () {
        this.div.setAttribute("contentEditable", "true");
        this.div.focus();
    };
    HTMLCell.prototype.finishEdits = function () {
        this.div.setAttribute("contentEditable", "false");
        this.parent.mv.model.cellVals[this.col][this.row] = this.div.innerHTML.toString();
    };
    HTMLCell.prototype.select = function () {
        var container = this.div.parentElement;
        this.div.classList.add("selected");
        container.classList.add("selectedtd");
    };
    HTMLCell.prototype.deselect = function () {
        var container = this.div.parentElement;
        this.div.classList.remove("selected");
        container.classList.remove("selectedtd");
    };
    HTMLCell.prototype.startFocus = function () {
        var parentElement = this.div.parentElement;
        parentElement.classList.add("focusedtd");
    };
    HTMLCell.prototype.endFocus = function () {
        this.finishEdits();
        var parentElement = this.div.parentElement;
        parentElement.classList.remove("focusedtd");
    };
    HTMLCell.prototype.getHTMLElement = function () {
        return this.div;
    };
    Object.defineProperty(HTMLCell.prototype, "displayVal", {
        get: function () {
            return this._displayVal;
        },
        set: function (newVal) {
            this._displayVal = newVal;
            this.div.innerHTML = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLCell.prototype, "col", {
        get: function () {
            return this._col.val;
        },
        set: function (newVal) {
            this._col.val = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLCell.prototype, "row", {
        get: function () {
            return this._row.val;
        },
        set: function (newVal) {
            this._row.val = newVal;
        },
        enumerable: true,
        configurable: true
    });
    return HTMLCell;
})();
var HTMLSpreadsheetModel = (function () {
    function HTMLSpreadsheetModel(width, height) {
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
    HTMLSpreadsheetModel.prototype.processMessage = function (msg) { };
    HTMLSpreadsheetModel.prototype.getCell = function (x, y) {
        return this.cellVals[x][y];
    };
    HTMLSpreadsheetModel.prototype.setCell = function (x, y, newCell) {
        this.cellVals[x][y] = newCell;
        var event = new CustomEvent("cellchanged", { detail: {
                cellx: x,
                celly: y,
            } });
        dispatchEvent(event);
        var msg = new CellChangeMessage(x, y);
        phosphor_messaging_1.sendMessage(this, msg);
    };
    HTMLSpreadsheetModel.prototype.insertCol = function (colNum) {
        this.cellVals.splice(colNum, 0, new Array());
        for (var i = 0; i < this.height; i++) {
            this.cellVals[colNum][i] = "";
        }
        this.width++;
    };
    HTMLSpreadsheetModel.prototype.deleteCol = function (colNum) {
        this.cellVals.splice(colNum, 1);
        this.width--;
    };
    HTMLSpreadsheetModel.prototype.insertRow = function (rowNum) {
        for (var i = 0; i < this.width; i++) {
            this.cellVals[i].splice(rowNum, 0, "");
        }
        this.height++;
    };
    HTMLSpreadsheetModel.prototype.deleteRow = function (rowNum) {
        for (var i = 0; i < this.width; i++) {
            this.cellVals[i].splice(rowNum, 1);
        }
        this.height--;
    };
    HTMLSpreadsheetModel.prototype.clearCell = function (x, y) {
        this.setCell(x, y, "");
    };
    return HTMLSpreadsheetModel;
})();
var HTMLSpreadsheetViewModel = (function () {
    function HTMLSpreadsheetViewModel(model) {
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
        this.eventManager = function () {
            var that = this;
            return {
                doubleClick: function (e) {
                    if (e.target.dataset["type"] == "cell") {
                        console.log("doubleclick");
                        that.beginEdits();
                    }
                },
                mouseClick: function (e) {
                    if (e.target instanceof HTMLDivElement) {
                        var div = e.target;
                        var type = div.dataset["type"];
                        if (type === "cell") {
                            var cellX;
                            var cellY;
                            cellX = getCellX(div.parentElement);
                            cellY = getCellY(div.parentElement);
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
                mouseUp: function (e) {
                    console.log("mouse up");
                    that.mouseDown = false;
                },
                mouseMoved: function (e) {
                    //FIX ME, I WILL BREAK WHEN NOT OVER A DIV!
                    var cellX;
                    var cellY;
                    if (e.target.nodeName == "DIV") {
                        cellX = getCellX(e.target.parentElement);
                        cellY = getCellY(e.target.parentElement);
                        if (that.mouseDown) {
                            that.mouseSelectRange(cellX, cellY);
                        }
                    }
                },
                copy: function (e) {
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
                paste: function (e) {
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
                                }
                            }
                        }
                    }
                },
                keyPressed: function (e) {
                    console.log(e);
                    switch (e.keyCode) {
                        case 13:
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
                        case 37:
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
                        case 38:
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
                        case 39:
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
                        case 40:
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
                        case 9:
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
        };
        var eventGrabber = this.eventManager();
        this.events = new SpreadsheetEventObject();
        this.events.mousedown = eventGrabber.mouseClick,
            this.events.mouseup = eventGrabber.mouseUp,
            this.events.mousemove = eventGrabber.mouseMoved,
            this.events.doubleclick = eventGrabber.doubleClick,
            this.events.keypressed = eventGrabber.keyPressed,
            this.events.copy = eventGrabber.copy,
            this.events.paste = eventGrabber.paste;
    }
    HTMLSpreadsheetViewModel.prototype.insertRow = function (rowNum) {
        this.minX = 0;
        this.maxX = this.model.width - 1;
        this.minY = rowNum;
        this.maxY = rowNum;
        this.selectArea();
        this.model.insertRow(rowNum);
        this.focusCell(0, rowNum);
    };
    HTMLSpreadsheetViewModel.prototype.insertCol = function (colNum) {
        this.minY = 0;
        this.maxY = this.model.height - 1;
        this.minX = colNum;
        this.maxX = colNum;
        this.selectArea();
        this.focusCell(colNum, 0);
    };
    HTMLSpreadsheetViewModel.prototype.deleteRow = function (rowNum) {
        this.minX = 0;
        this.maxX = this.model.width - 1;
        this.minY = rowNum;
        this.maxY = rowNum;
        this.selectArea();
        this.focusCell(0, rowNum);
    };
    HTMLSpreadsheetViewModel.prototype.deleteCol = function (colNum) {
        this.minY = 0;
        this.maxY = this.model.height - 1;
        this.minX = colNum;
        this.maxX = colNum;
        this.selectArea();
        this.focusCell(colNum, 0);
    };
    HTMLSpreadsheetViewModel.prototype.move = function (skipCheck, xAmount, yAmount) {
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
    };
    HTMLSpreadsheetViewModel.prototype.mouseClicked = function (e) {
        console.log(this);
        this.mouseDown = true;
        var cellX;
        var cellY;
        cellX = getCellX(e.target.parentElement);
        cellY = getCellY(e.target.parentElement);
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
    };
    HTMLSpreadsheetViewModel.prototype.clearSelections = function () {
        this.highlightedCells = new Array();
        for (var i = 0; i < this.model.width; i++) {
            this.highlightedCells[i] = new Array();
            for (var j = 0; j < this.model.height; j++) {
                this.highlightedCells[i][j] = false;
            }
        }
    };
    HTMLSpreadsheetViewModel.prototype.focusCell = function (cellX, cellY) {
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
    };
    HTMLSpreadsheetViewModel.prototype.clearCell = function (x, y) {
        this.model.clearCell(x, y);
    };
    HTMLSpreadsheetViewModel.prototype.select = function (cellX, cellY) {
        this.highlightedCells[cellX][cellY] = true;
        this.selectionChanged();
        //THROW BACK SELECTION CHANGED EVENT
    };
    HTMLSpreadsheetViewModel.prototype.mouseSelectRange = function (cellX, cellY) {
        if (cellX == this.focusedCellX && cellY == this.focusedCellY) {
            document.getSelection().removeAllRanges();
        }
        this.minX = Math.min(cellX, this.focusedCellX);
        this.maxX = Math.max(cellX, this.focusedCellX);
        this.minY = Math.min(cellY, this.focusedCellY);
        this.maxY = Math.max(cellY, this.focusedCellY);
        this.selectArea();
    };
    HTMLSpreadsheetViewModel.prototype.selectArea = function () {
        this.clearSelections();
        for (var i = this.minX; i <= this.maxX; i++) {
            for (var j = this.minY; j <= this.maxY; j++) {
                this.highlightedCells[i][j] = true;
            }
        } //PUSH BACK SELECTION CHANGE
        this.selectionChanged();
    };
    HTMLSpreadsheetViewModel.prototype.focusChanged = function () {
        var event = new CustomEvent("focuschanged");
        dispatchEvent(event);
        phosphor_messaging_1.sendMessage(this, MSG_ON_FOCUS);
    };
    HTMLSpreadsheetViewModel.prototype.selectionChanged = function () {
        var event = new CustomEvent("selectionchanged");
        dispatchEvent(event);
        phosphor_messaging_1.sendMessage(this, MSG_ON_SELECTION);
    };
    HTMLSpreadsheetViewModel.prototype.beginEdits = function () {
        this.editing = true;
        console.log("edits = true");
        var event = new CustomEvent("beginedits");
        dispatchEvent(event);
        phosphor_messaging_1.sendMessage(this, MSG_ON_BEGIN_EDIT);
    };
    HTMLSpreadsheetViewModel.prototype.processMessage = function (msg) {
        console.log("mv");
        console.log(msg);
    };
    return HTMLSpreadsheetViewModel;
})();
var HTMLSpreadsheetView = (function (_super) {
    __extends(HTMLSpreadsheetView, _super);
    function HTMLSpreadsheetView(modelView) {
        _super.call(this);
        this.mv = modelView;
        this.table = document.createElement("table");
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
        for (var i = 0; i <= this.mv.model.height; i++) {
            this.table.insertRow();
            if (i > 0) {
                this.cells[i - 1] = new Array();
            }
            var row = this.table.rows[i];
            for (var j = 0; j <= this.mv.model.width; j++) {
                var cell = row.insertCell();
                if (j > 0 && i > 0) {
                    this.cells[i - 1][j - 1] = new HTMLCell(this, this.mutableRowVals[i - 1], this.mutableColVals[j - 1]); //fill in later
                    this.attachCell(this.cells[i - 1][j - 1]);
                }
            }
        }
        this.columnLabels = new Array();
        this.rowLabels = new Array();
        for (var i = 1; i <= this.mv.model.height; i++) {
            var row = this.table.rows[i];
            var cell = row.cells[0];
            this.rowLabels[i] = new HTMLLabel(i, false, cell);
        }
        for (var i = 1; i <= this.mv.model.width; i++) {
            var row = this.table.rows[0];
            var cell = row.cells[i];
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
        (function (that) {
            addEventListener("selectionchanged", function (e) {
                that.updateSelections();
            });
            //this.table.
            addEventListener("focuschanged", function (e) {
                that.updateFocus();
            });
            addEventListener("cellchanged", function (e) {
                that.cells[e.detail.celly][e.detail.cellx].setDisplayVal(that.mv.model.cellVals[e.detail.cellx][e.detail.celly]);
            });
            addEventListener("beginedits", function (e) {
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
    HTMLSpreadsheetView.prototype.processMessage = function (msg) {
        console.log(msg);
    };
    HTMLSpreadsheetView.prototype.updateSelections = function () {
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
    };
    HTMLSpreadsheetView.prototype.updateFocus = function () {
        if (this.focusedCell != undefined) {
            this.focusedCell.endFocus();
            this.mv.editing = false;
        }
        console.log(this.mv.focusedCellX);
        console.log(this.mv.focusedCellY);
        this.focusedCell = this.cells[this.mv.focusedCellY][this.mv.focusedCellX];
        this.focusedCell.startFocus();
    };
    HTMLSpreadsheetView.prototype.attachCell = function (cell) {
        var row = this.table.rows[cell.getRow() + 1];
        var tableCell = this.table.rows[cell.getRow() + 1].cells[cell.getCol() + 1];
        tableCell.appendChild(cell.getHTMLElement());
    };
    HTMLSpreadsheetView.prototype.addCallback = function (event, callback, to) {
        to.addEventListener(event, callback);
    };
    HTMLSpreadsheetView.prototype.insertCol = function (colNum) {
        this.mv.model.insertCol(colNum);
        var row = this.table.rows[0];
        var cell = row.insertCell(colNum + 1);
        this.columnLabels.splice(colNum, 0, new HTMLLabel(colNum + 1, true, cell));
        this.mutableColVals.splice(colNum, 0, new MutableNumber(colNum));
        for (var i = 0; i < this.mv.model.height; i++) {
            row = this.table.rows[i + 1];
            row.insertCell(colNum + 1);
            this.cells[i].splice(colNum, 0, new HTMLCell(this, this.mutableRowVals[i], this.mutableColVals[colNum]));
            this.attachCell(this.cells[i][colNum]);
        }
        for (var j = colNum + 2; j <= this.mv.model.width; j++) {
            this.columnLabels[j].val++;
            ;
            this.columnLabels[j].div.innerHTML = this.columnLabels[j].val.toString();
        }
        this.mv.insertCol(colNum);
    };
    HTMLSpreadsheetView.prototype.deleteCol = function (colNum) {
        this.mv.model.deleteCol(colNum);
        this.columnLabels.splice(colNum, 1);
        var row = this.table.rows[0];
        row.deleteCell(colNum + 1);
        for (var i = 0; i < this.mv.model.height; i++) {
            row = this.table.rows[i + 1];
            row.deleteCell(colNum + 1);
            this.cells[i].splice(colNum, 1);
            this.cells[i][0].setCol(this.cells[i][0].getCol() - 1);
        }
        for (var j = colNum + 1; j <= this.mv.model.width; j++) {
            this.columnLabels[j].val--;
            this.columnLabels[j].div.innerHTML = this.columnLabels[j].val.toString();
        }
        this.mv.deleteCol(colNum);
    };
    HTMLSpreadsheetView.prototype.insertRow = function (rowNum) {
        this.mv.model.insertRow(rowNum);
        this.cells.splice(rowNum, 0, new Array());
        var row = this.table.insertRow(rowNum + 1);
        var label = row.insertCell();
        this.rowLabels.splice(rowNum, 0, new HTMLLabel(rowNum + 1, false, label));
        this.mutableRowVals.splice(rowNum, 0, new MutableNumber(rowNum));
        for (var i = 0; i < this.mv.model.width; i++) {
            row.insertCell();
            this.cells[rowNum][i] = new HTMLCell(this, this.mutableRowVals[rowNum], this.mutableColVals[i]);
            this.attachCell(this.cells[rowNum][i]);
        }
        for (var j = rowNum + 2; j <= this.mv.model.height; j++) {
            this.rowLabels[j].val++;
            this.rowLabels[j].div.innerHTML = this.rowLabels[j].val.toString();
            this.cells[j][0].setRow(this.cells[j][0].getRow() + 1);
        }
        this.mv.insertRow(rowNum);
    };
    HTMLSpreadsheetView.prototype.deleteRow = function (rowNum) {
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
    };
    HTMLSpreadsheetView.prototype.sortColAsc = function (col) {
        this.sortByCol(col, true);
    };
    HTMLSpreadsheetView.prototype.sortColDesc = function (col) {
        this.sortByCol(col, false);
    };
    HTMLSpreadsheetView.prototype.sortByCol = function (colNum, ascending) {
        var nums = [];
        for (var i = 0; i < this.mv.model.height; i++) {
            nums.push(i);
        }
        console.log(this.mv.model.cellVals[colNum]);
        if (ascending) {
            nums = this.sortCol(nums, this.mv.model.cellVals[colNum]);
        }
        else {
            nums = this.sortCol(nums, this.mv.model.cellVals[colNum], function (a, b) {
                return b < a;
            });
        }
        console.log(nums);
        var newVals = [];
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
    };
    HTMLSpreadsheetView.prototype.sortCol = function (nums, vals, sorter) {
        if (vals.length == 0) {
            return nums;
        }
        if (!sorter) {
            console.log("No sort function passed");
            sorter = function (a, b) {
                return a < b;
            };
        }
        var leftVals = [];
        var leftNums = [];
        var rightVals = [];
        var rightNums = [];
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
    };
    HTMLSpreadsheetView.prototype.createMenu = function () {
        (function (view) {
            var handler = {
                rowBefore: function () {
                    console.log("Add row before");
                    view.insertRow(view.mv.focusedCellY);
                },
                rowAfter: function () {
                    console.log("Add row after");
                    view.insertRow(view.mv.focusedCellY + 1);
                },
                colBefore: function () {
                    console.log("Add col before");
                    view.insertCol(view.mv.focusedCellX);
                },
                colAfter: function () {
                    console.log("Add col after");
                    view.insertCol(view.mv.focusedCellX + 1);
                },
                delRow: function () {
                    console.log("Delete row");
                    view.deleteRow(view.mv.focusedCellY);
                },
                delCol: function () {
                    console.log("Delete col");
                    view.deleteCol(view.mv.focusedCellX);
                },
                sortColAsc: function () {
                    console.log("Sort col asc");
                    view.sortColAsc(view.mv.focusedCellX);
                },
                sortColDesc: function () {
                    console.log("Sort col desc");
                    view.sortColDesc(view.mv.focusedCellX);
                },
            };
            var rowBeforeItem = new phosphor_menus_1.MenuItem({
                text: "Insert Row Before",
                className: 'rowBefore'
            });
            var rowAfterItem = new phosphor_menus_1.MenuItem({
                text: "Insert Row After",
                className: 'rowAfter'
            });
            var colBeforeItem = new phosphor_menus_1.MenuItem({
                text: "Insert Column Before",
                className: 'colBefore'
            });
            var colAfterItem = new phosphor_menus_1.MenuItem({
                text: "Insert Column After",
                className: 'colAfter'
            });
            var delRowItem = new phosphor_menus_1.MenuItem({
                text: "Delete Row",
                className: 'delRow'
            });
            var delColItem = new phosphor_menus_1.MenuItem({
                text: "Delete Column",
                className: 'delCol'
            });
            var sortColAscItem = new phosphor_menus_1.MenuItem({
                text: "Sort By Column A-Z",
                className: 'sortAscCol'
            });
            var sortColDescItem = new phosphor_menus_1.MenuItem({
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
            var rightClickMenu = new phosphor_menus_1.Menu();
            rightClickMenu.items = [
                rowBeforeItem,
                rowAfterItem,
                colBeforeItem,
                colAfterItem,
                delRowItem,
                delColItem,
                sortColAscItem,
                sortColDescItem];
            document.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                var x = event.clientX;
                var y = event.clientY;
                rightClickMenu.popup(x, y);
            });
        })(this);
    };
    return HTMLSpreadsheetView;
})(phosphor_widget_1.Widget);
function main() {
    setup();
}
function setup() {
    //var spreadsheet = new Spreadsheet(27, 60);
    var spreadsheet2 = new HTMLSpreadsheetView(new HTMLSpreadsheetViewModel(new HTMLSpreadsheetModel(27, 60)));
    spreadsheet2.addClass("scroll");
    phosphor_widget_1.attachWidget(spreadsheet2, document.getElementById('main'));
    //spreadsheet.attach(document.getElementById('main'));
    //spCol.horizontalSizePolicy = SizePolicy.Fixed;
    //spreadsheet.fit();
    //spreadsheet2.fit();
    //window.onresize = () => spreadsheet.fit();
    window.onresize = function () { return spreadsheet2.update(); };
    console.log("blahh");
}
window.onload = main;

},{"phosphor-menus":8,"phosphor-messaging":13,"phosphor-widget":18}],2:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }
        
        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            head.appendChild(style);
        } else if (style.styleSheet) { // for IE8 and below
            head.appendChild(style);
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            head.appendChild(style);
        }
    }
};

},{}],3:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * Execute a callback for each element in an array.
 *
 * @param array - The array of values to iterate.
 *
 * @param callback - The callback to invoke for the array elements.
 *
 * @param fromIndex - The starting index for iteration.
 *
 * @param wrap - Whether iteration wraps around at the end of the array.
 *
 * @returns The first value returned by `callback` which is not
 *   equal to `undefined`, or `undefined` if the callback does
 *   not return a value or if the start index is out of range.
 *
 * #### Notes
 * It is not safe to modify the size of the array while iterating.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function logger(value: number): void {
 *   console.log(value);
 * }
 *
 * var data = [1, 2, 3, 4];
 * arrays.forEach(data, logger);           // logs 1, 2, 3, 4
 * arrays.forEach(data, logger, 2);        // logs 3, 4
 * arrays.forEach(data, logger, 2, true);  // logs 3, 4, 1, 2
 * arrays.forEach(data, (v, i) => {        // 2
 *   if (v === 3) return i;
 * });
 * ```
 *
 * **See also** [[rforEach]]
 */
function forEach(array, callback, fromIndex, wrap) {
    if (fromIndex === void 0) { fromIndex = 0; }
    if (wrap === void 0) { wrap = false; }
    var start = fromIndex | 0;
    if (start < 0 || start >= array.length) {
        return void 0;
    }
    if (wrap) {
        for (var i = 0, n = array.length; i < n; ++i) {
            var j = (start + i) % n;
            var result = callback(array[j], j);
            if (result !== void 0)
                return result;
        }
    }
    else {
        for (var i = start, n = array.length; i < n; ++i) {
            var result = callback(array[i], i);
            if (result !== void 0)
                return result;
        }
    }
    return void 0;
}
exports.forEach = forEach;
/**
 * Execute a callback for each element in an array, in reverse.
 *
 * @param array - The array of values to iterate.
 *
 * @param callback - The callback to invoke for the array elements.
 *
 * @param fromIndex - The starting index for iteration.
 *
 * @param wrap - Whether iteration wraps around at the end of the array.
 *
 * @returns The first value returned by `callback` which is not
 *   equal to `undefined`, or `undefined` if the callback does
 *   not return a value or if the start index is out of range.
 *
 * #### Notes
 * It is not safe to modify the size of the array while iterating.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function logger(value: number): void {
 *   console.log(value);
 * }
 *
 * var data = [1, 2, 3, 4];
 * arrays.rforEach(data, logger);           // logs 4, 3, 2, 1
 * arrays.rforEach(data, logger, 2);        // logs 3, 2, 1
 * arrays.rforEach(data, logger, 2, true);  // logs 3, 2, 1, 4
 * arrays.rforEach(data, (v, i) => {        // 2
 *   if (v === 3) return i;
 * });
 * ```
 * **See also** [[forEach]]
 */
function rforEach(array, callback, fromIndex, wrap) {
    if (fromIndex === void 0) { fromIndex = array.length - 1; }
    if (wrap === void 0) { wrap = false; }
    var start = fromIndex | 0;
    if (start < 0 || start >= array.length) {
        return void 0;
    }
    if (wrap) {
        for (var i = 0, n = array.length; i < n; ++i) {
            var j = (start - i + n) % n;
            var result = callback(array[j], j);
            if (result !== void 0)
                return result;
        }
    }
    else {
        for (var i = start; i >= 0; --i) {
            var result = callback(array[i], i);
            if (result !== void 0)
                return result;
        }
    }
    return void 0;
}
exports.rforEach = rforEach;
/**
 * Find the index of the first value which matches a predicate.
 *
 * @param array - The array of values to be searched.
 *
 * @param pred - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search.
 *
 * @param wrap - Whether the search wraps around at the end of the array.
 *
 * @returns The index of the first matching value, or `-1` if no value
 *   matches the predicate or if the start index is out of range.
 *
 * #### Notes
 * It is not safe to modify the size of the array while iterating.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * var data = [1, 2, 3, 4, 3, 2, 1];
 * arrays.findIndex(data, isEven);           // 1
 * arrays.findIndex(data, isEven, 4);        // 5
 * arrays.findIndex(data, isEven, 6);        // -1
 * arrays.findIndex(data, isEven, 6, true);  // 1
 * ```
 *
 * **See also** [[rfindIndex]].
 */
function findIndex(array, pred, fromIndex, wrap) {
    if (fromIndex === void 0) { fromIndex = 0; }
    if (wrap === void 0) { wrap = false; }
    var start = fromIndex | 0;
    if (start < 0 || start >= array.length) {
        return -1;
    }
    if (wrap) {
        for (var i = 0, n = array.length; i < n; ++i) {
            var j = (start + i) % n;
            if (pred(array[j], j))
                return j;
        }
    }
    else {
        for (var i = start, n = array.length; i < n; ++i) {
            if (pred(array[i], i))
                return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
/**
 * Find the index of the last value which matches a predicate.
 *
 * @param array - The array of values to be searched.
 *
 * @param pred - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search.
 *
 * @param wrap - Whether the search wraps around at the front of the array.
 *
 * @returns The index of the last matching value, or `-1` if no value
 *   matches the predicate or if the start index is out of range.
 *
 * #### Notes
 * It is not safe to modify the size of the array while iterating.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * var data = [1, 2, 3, 4, 3, 2, 1];
 * arrays.rfindIndex(data, isEven);           // 5
 * arrays.rfindIndex(data, isEven, 4);        // 3
 * arrays.rfindIndex(data, isEven, 0);        // -1
 * arrays.rfindIndex(data, isEven, 0, true);  // 5
 * ```
 *
 * **See also** [[findIndex]].
 */
function rfindIndex(array, pred, fromIndex, wrap) {
    if (fromIndex === void 0) { fromIndex = array.length - 1; }
    if (wrap === void 0) { wrap = false; }
    var start = fromIndex | 0;
    if (start < 0 || start >= array.length) {
        return -1;
    }
    if (wrap) {
        for (var i = 0, n = array.length; i < n; ++i) {
            var j = (start - i + n) % n;
            if (pred(array[j], j))
                return j;
        }
    }
    else {
        for (var i = start; i >= 0; --i) {
            if (pred(array[i], i))
                return i;
        }
    }
    return -1;
}
exports.rfindIndex = rfindIndex;
/**
 * Find the first value which matches a predicate.
 *
 * @param array - The array of values to be searched.
 *
 * @param pred - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search.
 *
 * @param wrap - Whether the search wraps around at the end of the array.
 *
 * @returns The first matching value, or `undefined` if no value matches
 *   the predicate or if the start index is out of range.
 *
 * #### Notes
 * It is not safe to modify the size of the array while iterating.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * var data = [1, 2, 3, 4, 3, 2, 1];
 * arrays.find(data, isEven);           // 2
 * arrays.find(data, isEven, 4);        // 2
 * arrays.find(data, isEven, 6);        // undefined
 * arrays.find(data, isEven, 6, true);  // 2
 * ```
 *
 * **See also** [[rfind]].
 */
function find(array, pred, fromIndex, wrap) {
    var i = findIndex(array, pred, fromIndex, wrap);
    return i !== -1 ? array[i] : void 0;
}
exports.find = find;
/**
 * Find the last value which matches a predicate.
 *
 * @param array - The array of values to be searched.
 *
 * @param pred - The predicate function to apply to the values.
 *
 * @param fromIndex - The starting index of the search.
 *
 * @param wrap - Whether the search wraps around at the front of the array.
 *
 * @returns The last matching value, or `undefined` if no value matches
 *   the predicate or if the start index is out of range.
 *
 * #### Notes
 * The range of visited indices is set before the first invocation of
 * `pred`. It is not safe for `pred` to change the length of `array`.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function isEven(value: number): boolean {
 *   return value % 2 === 0;
 * }
 *
 * var data = [1, 2, 3, 4, 3, 2, 1];
 * arrays.rfind(data, isEven);           // 2
 * arrays.rfind(data, isEven, 4);        // 4
 * arrays.rfind(data, isEven, 0);        // undefined
 * arrays.rfind(data, isEven, 0, true);  // 2
 * ```
 *
 * **See also** [[find]].
 */
function rfind(array, pred, fromIndex, wrap) {
    var i = rfindIndex(array, pred, fromIndex, wrap);
    return i !== -1 ? array[i] : void 0;
}
exports.rfind = rfind;
/**
 * Insert an element into an array at a specified index.
 *
 * @param array - The array of values to modify.
 *
 * @param index - The index at which to insert the value. This value
 *   is clamped to the bounds of the array.
 *
 * @param value - The value to insert into the array.
 *
 * @returns The index at which the value was inserted.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.insert(data, 0, 12);  // 0
 * arrays.insert(data, 3, 42);  // 3
 * arrays.insert(data, -9, 9);  // 0
 * arrays.insert(data, 12, 8);  // 8
 * console.log(data);           // [9, 12, 0, 1, 42, 2, 3, 4, 8]
 * ```
 *
 * **See also** [[removeAt]] and [[remove]]
 */
function insert(array, index, value) {
    var j = Math.max(0, Math.min(index | 0, array.length));
    for (var i = array.length; i > j; --i) {
        array[i] = array[i - 1];
    }
    array[j] = value;
    return j;
}
exports.insert = insert;
/**
 * Move an element in an array from one index to another.
 *
 * @param array - The array of values to modify.
 *
 * @param fromIndex - The index of the element to move.
 *
 * @param toIndex - The target index of the element.
 *
 * @returns `true` if the element was moved, or `false` if either
 *   index is out of range.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.move(data, 1, 2);   // true
 * arrays.move(data, -1, 0);  // false
 * arrays.move(data, 4, 2);   // true
 * arrays.move(data, 10, 0);  // false
 * console.log(data);         // [0, 2, 4, 1, 3]
 * ```
 */
function move(array, fromIndex, toIndex) {
    var j = fromIndex | 0;
    if (j < 0 || j >= array.length) {
        return false;
    }
    var k = toIndex | 0;
    if (k < 0 || k >= array.length) {
        return false;
    }
    var value = array[j];
    if (j > k) {
        for (var i = j; i > k; --i) {
            array[i] = array[i - 1];
        }
    }
    else if (j < k) {
        for (var i = j; i < k; ++i) {
            array[i] = array[i + 1];
        }
    }
    array[k] = value;
    return true;
}
exports.move = move;
/**
 * Remove an element from an array at a specified index.
 *
 * @param array - The array of values to modify.
 *
 * @param index - The index of the element to remove.
 *
 * @returns The removed value, or `undefined` if the index is out
 *   of range.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.removeAt(data, 1);   // 1
 * arrays.removeAt(data, 3);   // 4
 * arrays.removeAt(data, 10);  // undefined
 * console.log(data);          // [0, 2, 3]
 * ```
 *
 * **See also** [[remove]] and [[insert]]
 */
function removeAt(array, index) {
    var j = index | 0;
    if (j < 0 || j >= array.length) {
        return void 0;
    }
    var value = array[j];
    for (var i = j + 1, n = array.length; i < n; ++i) {
        array[i - 1] = array[i];
    }
    array.length -= 1;
    return value;
}
exports.removeAt = removeAt;
/**
 * Remove the first occurrence of a value from an array.
 *
 * @param array - The array of values to modify.
 *
 * @param value - The value to remove from the array.
 *
 * @returns The index where the value was located, or `-1` if the
 *   value is not the array.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.remove(data, 1);  // 1
 * arrays.remove(data, 3);  // 2
 * arrays.remove(data, 7);  // -1
 * console.log(data);       // [0, 2, 4]
 * ```
 *
 * **See also** [[removeAt]] and [[insert]]
 */
function remove(array, value) {
    var j = -1;
    for (var i = 0, n = array.length; i < n; ++i) {
        if (array[i] === value) {
            j = i;
            break;
        }
    }
    if (j === -1) {
        return -1;
    }
    for (var i = j + 1, n = array.length; i < n; ++i) {
        array[i - 1] = array[i];
    }
    array.length -= 1;
    return j;
}
exports.remove = remove;
/**
 * Reverse an array in-place subject to an optional range.
 *
 * @param array - The array to reverse.
 *
 * @param fromIndex - The index of the first element of the range.
 *   This value will be clamped to the array bounds.
 *
 * @param toIndex - The index of the last element of the range.
 *   This value will be clamped to the array bounds.
 *
 * @returns A reference to the original array.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.reverse(data, 1, 3);    // [0, 3, 2, 1, 4]
 * arrays.reverse(data, 3);       // [0, 3, 2, 4, 1]
 * arrays.reverse(data);          // [1, 4, 2, 3, 0]
 * ```
 *
 * **See also** [[rotate]]
 */
function reverse(array, fromIndex, toIndex) {
    if (fromIndex === void 0) { fromIndex = 0; }
    if (toIndex === void 0) { toIndex = array.length; }
    var i = Math.max(0, Math.min(fromIndex | 0, array.length - 1));
    var j = Math.max(0, Math.min(toIndex | 0, array.length - 1));
    if (j < i)
        i = j + (j = i, 0);
    while (i < j) {
        var tmpval = array[i];
        array[i++] = array[j];
        array[j--] = tmpval;
    }
    return array;
}
exports.reverse = reverse;
/**
 * Rotate the elements of an array by a positive or negative delta.
 *
 * @param array - The array to rotate.
 *
 * @param delta - The amount of rotation to apply to the elements. A
 *   positive delta will shift the elements to the left. A negative
 *   delta will shift the elements to the right.
 *
 * @returns A reference to the original array.
 *
 * #### Notes
 * This executes in `O(n)` time and `O(1)` space.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * var data = [0, 1, 2, 3, 4];
 * arrays.rotate(data, 2);    // [2, 3, 4, 0, 1]
 * arrays.rotate(data, -2);   // [0, 1, 2, 3, 4]
 * arrays.rotate(data, 10);   // [0, 1, 2, 3, 4]
 * arrays.rotate(data, 9);    // [4, 0, 1, 2, 3]
 * ```
 *
 * **See also** [[reverse]]
 */
function rotate(array, delta) {
    var n = array.length;
    if (n <= 1) {
        return array;
    }
    var d = delta | 0;
    if (d > 0) {
        d = d % n;
    }
    else if (d < 0) {
        d = ((d % n) + n) % n;
    }
    if (d === 0) {
        return array;
    }
    reverse(array, 0, d - 1);
    reverse(array, d, n - 1);
    reverse(array, 0, n - 1);
    return array;
}
exports.rotate = rotate;
/**
 * Using a binary search, find the index of the first element in an
 * array which compares `>=` to a value.
 *
 * @param array - The array of values to be searched. It must be sorted
 *   in ascending order.
 *
 * @param value - The value to locate in the array.
 *
 * @param cmp - The comparison function which returns `true` if an
 *   array element is less than the given value.
 *
 * @returns The index of the first element in `array` which compares
 *   `>=` to `value`, or `array.length` if there is no such element.
 *
 * #### Notes
 * It is not safe for the comparison function to modify the array.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function numberCmp(a: number, b: number): boolean {
 *   return a < b;
 * }
 *
 * var data = [0, 3, 4, 7, 7, 9];
 * arrays.lowerBound(data, 0, numberCmp);   // 0
 * arrays.lowerBound(data, 6, numberCmp);   // 3
 * arrays.lowerBound(data, 7, numberCmp);   // 3
 * arrays.lowerBound(data, -1, numberCmp);  // 0
 * arrays.lowerBound(data, 10, numberCmp);  // 6
 * ```
 *
 * **See also** [[upperBound]]
 */
function lowerBound(array, value, cmp) {
    var begin = 0;
    var half;
    var middle;
    var n = array.length;
    while (n > 0) {
        half = n >> 1;
        middle = begin + half;
        if (cmp(array[middle], value)) {
            begin = middle + 1;
            n -= half + 1;
        }
        else {
            n = half;
        }
    }
    return begin;
}
exports.lowerBound = lowerBound;
/**
 * Using a binary search, find the index of the first element in an
 * array which compares `>` than a value.
 *
 * @param array - The array of values to be searched. It must be sorted
 *   in ascending order.
 *
 * @param value - The value to locate in the array.
 *
 * @param cmp - The comparison function which returns `true` if the
 *   the given value is less than an array element.
 *
 * @returns The index of the first element in `array` which compares
 *   `>` than `value`, or `array.length` if there is no such element.
 *
 * #### Notes
 * It is not safe for the comparison function to modify the array.
 *
 * #### Example
 * ```typescript
 * import * as arrays from 'phosphor-arrays';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a < b;
 * }
 *
 * var data = [0, 3, 4, 7, 7, 9];
 * arrays.upperBound(data, 0, numberCmp);   // 1
 * arrays.upperBound(data, 6, numberCmp);   // 3
 * arrays.upperBound(data, 7, numberCmp);   // 5
 * arrays.upperBound(data, -1, numberCmp);  // 0
 * arrays.upperBound(data, 10, numberCmp);  // 6
 * ```
 *
 * **See also** [[lowerBound]]
 */
function upperBound(array, value, cmp) {
    var begin = 0;
    var half;
    var middle;
    var n = array.length;
    while (n > 0) {
        half = n >> 1;
        middle = begin + half;
        if (cmp(value, array[middle])) {
            n = half;
        }
        else {
            begin = middle + 1;
            n -= half + 1;
        }
    }
    return begin;
}
exports.upperBound = upperBound;

},{}],4:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * A disposable object which delegates to a callback.
 */
var DisposableDelegate = (function () {
    /**
     * Construct a new disposable delegate.
     *
     * @param callback - The function to invoke when the delegate is
     *   disposed.
     */
    function DisposableDelegate(callback) {
        this._callback = callback;
    }
    Object.defineProperty(DisposableDelegate.prototype, "isDisposed", {
        /**
         * Test whether the delegate has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         */
        get: function () {
            return !this._callback;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the delegate and invoke its callback.
     *
     * #### Notes
     * If this method is called more than once, all calls made after the
     * first will be a no-op.
     */
    DisposableDelegate.prototype.dispose = function () {
        var callback = this._callback;
        this._callback = null;
        if (callback)
            callback();
    };
    return DisposableDelegate;
})();
exports.DisposableDelegate = DisposableDelegate;
/**
 * An object which manages a collection of disposable items.
 */
var DisposableSet = (function () {
    /**
     * Construct a new disposable set.
     *
     * @param items - The initial disposable items for the set.
     */
    function DisposableSet(items) {
        var _this = this;
        this._set = new Set();
        if (items)
            items.forEach(function (item) { return _this._set.add(item); });
    }
    Object.defineProperty(DisposableSet.prototype, "isDisposed", {
        /**
         * Test whether the set has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         */
        get: function () {
            return !this._set;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispose of the set and dispose the items it contains.
     *
     * #### Notes
     * Items are disposed in the order they are added to the set.
     *
     * It is unsafe to use the set after it has been disposed.
     *
     * If this method is called more than once, all calls made after the
     * first will be a no-op.
     */
    DisposableSet.prototype.dispose = function () {
        var set = this._set;
        this._set = null;
        if (set)
            set.forEach(function (item) { return item.dispose(); });
    };
    /**
     * Add a disposable item to the set.
     *
     * @param item - The disposable item to add to the set. If the item
     *   is already contained in the set, this is a no-op.
     *
     * @throws Will throw an error if the set has been disposed.
     */
    DisposableSet.prototype.add = function (item) {
        if (!this._set) {
            throw new Error('object is disposed');
        }
        this._set.add(item);
    };
    /**
     * Remove a disposable item from the set.
     *
     * @param item - The disposable item to remove from the set. If the
     *   item does not exist in the set, this is a no-op.
     *
     * @throws Will throw an error if the set has been disposed.
     */
    DisposableSet.prototype.remove = function (item) {
        if (!this._set) {
            throw new Error('object is disposed');
        }
        this._set.delete(item);
    };
    /**
     * Clear all disposable items from the set.
     *
     * @throws Will throw an error if the set has been disposed.
     */
    DisposableSet.prototype.clear = function () {
        if (!this._set) {
            throw new Error('object is disposed');
        }
        this._set.clear();
    };
    return DisposableSet;
})();
exports.DisposableSet = DisposableSet;

},{}],5:[function(require,module,exports){
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\nbody.p-mod-override-cursor * {\n  cursor: inherit !important;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-domutil\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],6:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_disposable_1 = require('phosphor-disposable');
require('./index.css');
/**
 * `p-mod-override-cursor`: the class name added to the document body
 *   during cursor override.
 */
exports.OVERRIDE_CURSOR_CLASS = 'p-mod-override-cursor';
/**
 * The id for the active cursor override.
 */
var overrideID = 0;
/**
 * Override the cursor for the entire document.
 *
 * @param cursor - The string representing the cursor style.
 *
 * @returns A disposable which will clear the override when disposed.
 *
 * #### Notes
 * The most recent call to `overrideCursor` takes precendence. Disposing
 * an old override is a no-op and will not effect the current override.
 *
 * #### Example
 * ```typescript
 * import { overrideCursor } from 'phosphor-domutil';
 *
 * // force the cursor to be 'wait' for the entire document
 * var override = overrideCursor('wait');
 *
 * // clear the override by disposing the return value
 * override.dispose();
 * ```
 */
function overrideCursor(cursor) {
    var id = ++overrideID;
    var body = document.body;
    body.style.cursor = cursor;
    body.classList.add(exports.OVERRIDE_CURSOR_CLASS);
    return new phosphor_disposable_1.DisposableDelegate(function () {
        if (id === overrideID) {
            body.style.cursor = '';
            body.classList.remove(exports.OVERRIDE_CURSOR_CLASS);
        }
    });
}
exports.overrideCursor = overrideCursor;
/**
 * Test whether a client position lies within a node.
 *
 * @param node - The DOM node of interest.
 *
 * @param clientX - The client X coordinate of interest.
 *
 * @param clientY - The client Y coordinate of interest.
 *
 * @returns `true` if the node covers the position, `false` otherwise.
 *
 * #### Example
 * ```typescript
 * import { hitTest } from 'phosphor-domutil';
 *
 * var div = document.createElement('div');
 * div.style.position = 'absolute';
 * div.style.left = '0px';
 * div.style.top = '0px';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * hitTest(div, 50, 50);   // true
 * hitTest(div, 150, 150); // false
 * ```
 */
function hitTest(node, clientX, clientY) {
    var rect = node.getBoundingClientRect();
    return (clientX >= rect.left &&
        clientX < rect.right &&
        clientY >= rect.top &&
        clientY < rect.bottom);
}
exports.hitTest = hitTest;
/**
 * Compute the box sizing for a DOM node.
 *
 * @param node - The DOM node for which to compute the box sizing.
 *
 * @returns The box sizing data for the specified DOM node.
 *
 * #### Example
 * ```typescript
 * import { boxSizing } from 'phosphor-domutil';
 *
 * var div = document.createElement('div');
 * div.style.borderTop = 'solid 10px black';
 * document.body.appendChild(div);
 *
 * var sizing = boxSizing(div);
 * sizing.borderTop;    // 10
 * sizing.paddingLeft;  // 0
 * // etc...
 * ```
 */
function boxSizing(node) {
    var cstyle = window.getComputedStyle(node);
    var bt = parseInt(cstyle.borderTopWidth, 10) || 0;
    var bl = parseInt(cstyle.borderLeftWidth, 10) || 0;
    var br = parseInt(cstyle.borderRightWidth, 10) || 0;
    var bb = parseInt(cstyle.borderBottomWidth, 10) || 0;
    var pt = parseInt(cstyle.paddingTop, 10) || 0;
    var pl = parseInt(cstyle.paddingLeft, 10) || 0;
    var pr = parseInt(cstyle.paddingRight, 10) || 0;
    var pb = parseInt(cstyle.paddingBottom, 10) || 0;
    var hs = bl + pl + pr + br;
    var vs = bt + pt + pb + bb;
    return {
        borderTop: bt,
        borderLeft: bl,
        borderRight: br,
        borderBottom: bb,
        paddingTop: pt,
        paddingLeft: pl,
        paddingRight: pr,
        paddingBottom: pb,
        horizontalSum: hs,
        verticalSum: vs,
    };
}
exports.boxSizing = boxSizing;
/**
 * Compute the size limits for a DOM node.
 *
 * @param node - The node for which to compute the size limits.
 *
 * @returns The size limit data for the specified DOM node.
 *
 * #### Example
 * ```typescript
 * import { sizeLimits } from 'phosphor-domutil';
 *
 * var div = document.createElement('div');
 * div.style.minWidth = '90px';
 * document.body.appendChild(div);
 *
 * var limits = sizeLimits(div);
 * limits.minWidth;   // 90
 * limits.maxHeight;  // Infinity
 * // etc...
 * ```
 */
function sizeLimits(node) {
    var cstyle = window.getComputedStyle(node);
    return {
        minWidth: parseInt(cstyle.minWidth, 10) || 0,
        minHeight: parseInt(cstyle.minHeight, 10) || 0,
        maxWidth: parseInt(cstyle.maxWidth, 10) || Infinity,
        maxHeight: parseInt(cstyle.maxHeight, 10) || Infinity,
    };
}
exports.sizeLimits = sizeLimits;

},{"./index.css":5,"phosphor-disposable":4}],7:[function(require,module,exports){
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-Menu {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 3px 0px;\n  white-space: nowrap;\n  overflow-x: hidden;\n  overflow-y: auto;\n  z-index: 100000;\n}\n.p-Menu-content {\n  display: table;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  border-spacing: 0;\n}\n.p-Menu-item {\n  display: table-row;\n}\n.p-Menu-item.p-mod-hidden,\n.p-Menu-item.p-mod-force-hidden {\n  display: none;\n}\n.p-Menu-item > span {\n  display: table-cell;\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n.p-Menu-item-icon {\n  width: 21px;\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: center;\n}\n.p-Menu-item-text {\n  padding-left: 2px;\n  padding-right: 35px;\n}\n.p-Menu-item-shortcut {\n  text-align: right;\n}\n.p-Menu-item-submenu-icon {\n  width: 16px;\n  text-align: center;\n}\n.p-Menu-item.p-mod-separator-type > span {\n  padding: 0;\n  height: 9px;\n  line-height: 0;\n  text-indent: 100%;\n  overflow: hidden;\n  whitespace: nowrap;\n  vertical-align: top;\n  /* https://bugzilla.mozilla.org/show_bug.cgi?id=634489 */\n}\n.p-Menu-item.p-mod-separator-type > span::after {\n  content: '';\n  display: block;\n  position: relative;\n  top: 4px;\n}\n.p-MenuBar-content {\n  display: flex;\n  flex-direction: row;\n}\n.p-MenuBar-item {\n  box-sizing: border-box;\n}\n.p-MenuBar-item.p-mod-hidden,\n.p-MenuBar-item.p-mod-force-hidden {\n  display: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-menus\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],8:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./menu'));
__export(require('./menubar'));
__export(require('./menubase'));
__export(require('./menuitem'));
require('./index.css');

},{"./index.css":7,"./menu":9,"./menubar":10,"./menubase":11,"./menuitem":12}],9:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
var menubase_1 = require('./menubase');
var menuitem_1 = require('./menuitem');
/**
 * `p-Menu`: the class name added to Menu instances.
 */
exports.MENU_CLASS = 'p-Menu';
/**
 * `p-Menu-content`: the class name added to a menu content node.
 */
exports.CONTENT_CLASS = 'p-Menu-content';
/**
 * `p-Menu-item`: the class name assigned to a menu item.
 */
exports.MENU_ITEM_CLASS = 'p-Menu-item';
/**
 * `p-Menu-item-icon`: the class name added to a menu item icon cell.
 */
exports.ICON_CLASS = 'p-Menu-item-icon';
/**
 * `p-Menu-item-text`: the class name added to a menu item text cell.
 */
exports.TEXT_CLASS = 'p-Menu-item-text';
/**
 * `p-Menu-item-shortcut`: the class name added to a menu item shortcut cell.
 */
exports.SHORTCUT_CLASS = 'p-Menu-item-shortcut';
/**
 * `p-Menu-item-submenu-icon`: the class name added to a menu item submenu icon cell.
 */
exports.SUBMENU_ICON_CLASS = 'p-Menu-item-submenu-icon';
/**
 * `p-mod`: the class name added to a check type menu item.
 */
exports.CHECK_TYPE_CLASS = 'p-mod-check-type';
/**
 * `p-mod`: the class name added to a separator type menu item.
 */
exports.SEPARATOR_TYPE_CLASS = 'p-mod-separator-type';
/**
 * `p-mod`: the class name added to active menu items.
 */
exports.ACTIVE_CLASS = 'p-mod-active';
/**
 * `p-mod`: the class name added to a disabled menu item.
 */
exports.DISABLED_CLASS = 'p-mod-disabled';
/**
 * `p-mod`: the class name added to a hidden menu item.
 */
exports.HIDDEN_CLASS = 'p-mod-hidden';
/**
 * `p-mod`: the class name added to a force hidden menu item.
 */
exports.FORCE_HIDDEN_CLASS = 'p-mod-force-hidden';
/**
 * `p-mod`: the class name added to a checked menu item.
 */
exports.CHECKED_CLASS = 'p-mod-checked';
/**
 * `p-mod`: the class name added to a menu item with a submenu.
 */
exports.HAS_SUBMENU_CLASS = 'p-mod-has-submenu';
/**
 * The delay, in ms, for opening a submenu.
 */
var OPEN_DELAY = 300;
/**
 * The delay, in ms, for closing a submenu.
 */
var CLOSE_DELAY = 300;
/**
 * The horizontal overlap to use for submenus.
 */
var SUBMENU_OVERLAP = 3;
/**
 * A widget which displays menu items as a popup menu.
 *
 * #### Notes
 * A `Menu` widget does not support child widgets. Adding children
 * to a `Menu` will result in undefined behavior.
 */
var Menu = (function (_super) {
    __extends(Menu, _super);
    /**
     * Construct a new menu.
     */
    function Menu() {
        _super.call(this);
        this._openTimerId = 0;
        this._closeTimerId = 0;
        this._parentMenu = null;
        this._childMenu = null;
        this._childItem = null;
        this.addClass(exports.MENU_CLASS);
    }
    /**
     * Create the DOM node for a menu.
     */
    Menu.createNode = function () {
        var node = document.createElement('div');
        var content = document.createElement('div');
        content.className = exports.CONTENT_CLASS;
        node.appendChild(content);
        return node;
    };
    /**
     * A convenience method to create a menu from a template.
     *
     * @param array - The menu item templates for the menu.
     *
     * @returns A new menu created from the menu item templates.
     *
     * #### Notes
     * Submenu templates will be recursively created using the
     * `Menu.fromTemplate` method. If custom menus or menu items
     * are required, use the relevant constructors directly.
     */
    Menu.fromTemplate = function (array) {
        var menu = new Menu();
        menu.items = array.map(createMenuItem);
        return menu;
    };
    /**
     * Dispose of the resources held by the menu.
     */
    Menu.prototype.dispose = function () {
        this.close(true);
        _super.prototype.dispose.call(this);
    };
    Object.defineProperty(Menu.prototype, "closed", {
        /**
         * A signal emitted when the menu item is closed.
         *
         * #### Notes
         * This is a pure delegate to the [[closedSignal]].
         */
        get: function () {
            return Menu.closedSignal.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "parentMenu", {
        /**
         * Get the parent menu of the menu.
         *
         * #### Notes
         * This will be null if the menu is not an open submenu.
         */
        get: function () {
            return this._parentMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "childMenu", {
        /**
         * Get the child menu of the menu.
         *
         * #### Notes
         * This will be null if the menu does not have an open submenu.
         */
        get: function () {
            return this._childMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "rootMenu", {
        /**
         * Find the root menu of this menu hierarchy.
         */
        get: function () {
            var menu = this;
            while (menu._parentMenu) {
                menu = menu._parentMenu;
            }
            return menu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "leafMenu", {
        /**
         * Find the leaf menu of this menu hierarchy.
         */
        get: function () {
            var menu = this;
            while (menu._childMenu) {
                menu = menu._childMenu;
            }
            return menu;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Popup the menu at the specified location.
     *
     * The menu will be opened at the given location unless it will not
     * fully fit on the screen. If it will not fit, it will be adjusted
     * to fit naturally on the screen. The last two optional parameters
     * control whether the provided coordinate value must be obeyed.
     *
     * When the menu is opened as a popup menu, it will handle all key
     * events related to menu navigation as well as closing the menu
     * when the mouse is pressed outside of the menu hierarchy. To
     * prevent these actions, use the 'open' method instead.
     *
     * @param x - The client X coordinate of the popup location.
     *
     * @param y - The client Y coordinate of the popup location.
     *
     * @param forceX - Whether the X coordinate must be obeyed.
     *
     * @param forceY - Whether the Y coordinate must be obeyed.
     *
     * **See also:** [[open]]
     */
    Menu.prototype.popup = function (x, y, forceX, forceY) {
        if (forceX === void 0) { forceX = false; }
        if (forceY === void 0) { forceY = false; }
        if (!this.isAttached) {
            this.update(true);
            document.addEventListener('keydown', this, true);
            document.addEventListener('keypress', this, true);
            document.addEventListener('mousedown', this, true);
            openRootMenu(this, x, y, forceX, forceY);
        }
    };
    /**
     * Open the menu at the specified location.
     *
     * The menu will be opened at the given location unless it will not
     * fully fit on the screen. If it will not fit, it will be adjusted
     * to fit naturally on the screen. The last two optional parameters
     * control whether the provided coordinate value must be obeyed.
     *
     * When the menu is opened with this method, it will not handle key
     * events for navigation, nor will it close itself when the mouse is
     * pressed outside the menu hierarchy. This is useful when using the
     * menu from a menubar, where this menubar should handle these tasks.
     * Use the `popup` method for the alternative behavior.
     *
     * @param x - The client X coordinate of the popup location.
     *
     * @param y - The client Y coordinate of the popup location.
     *
     * @param forceX - Whether the X coordinate must be obeyed.
     *
     * @param forceY - Whether the Y coordinate must be obeyed.
     *
     * **See also:** [[popup]]
     */
    Menu.prototype.open = function (x, y, forceX, forceY) {
        if (forceX === void 0) { forceX = false; }
        if (forceY === void 0) { forceY = false; }
        if (!this.isAttached) {
            this.update(true);
            openRootMenu(this, x, y, forceX, forceY);
        }
    };
    /**
     * Handle the DOM events for the menu.
     *
     * @param event - The DOM event sent to the menu.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the menu's DOM nodes. It should
     * not be called directly by user code.
     */
    Menu.prototype.handleEvent = function (event) {
        switch (event.type) {
            case 'mouseenter':
                this._evtMouseEnter(event);
                break;
            case 'mouseleave':
                this._evtMouseLeave(event);
                break;
            case 'mousedown':
                this._evtMouseDown(event);
                break;
            case 'mouseup':
                this._evtMouseUp(event);
                break;
            case 'contextmenu':
                this._evtContextMenu(event);
                break;
            case 'keydown':
                this._evtKeyDown(event);
                break;
            case 'keypress':
                this._evtKeyPress(event);
                break;
        }
    };
    /**
     * A method invoked when the menu items change.
     */
    Menu.prototype.onItemsChanged = function (old, items) {
        this.close(true);
    };
    /**
     * A method invoked when the active index changes.
     */
    Menu.prototype.onActiveIndexChanged = function (old, index) {
        var oldNode = this._itemNodeAt(old);
        var newNode = this._itemNodeAt(index);
        if (oldNode)
            oldNode.classList.remove(exports.ACTIVE_CLASS);
        if (newNode)
            newNode.classList.add(exports.ACTIVE_CLASS);
    };
    /**
     * A method invoked when a menu item should be opened.
     */
    Menu.prototype.onOpenItem = function (index, item) {
        var node = this._itemNodeAt(index) || this.node;
        this._openChildMenu(item, node, false);
        this._childMenu.activateNextItem();
    };
    /**
     * A method invoked when a menu item should be triggered.
     */
    Menu.prototype.onTriggerItem = function (index, item) {
        this.rootMenu.close();
        var handler = item.handler;
        if (handler)
            handler(item);
    };
    /**
     * A message handler invoked on an `'after-attach'` message.
     */
    Menu.prototype.onAfterAttach = function (msg) {
        this.node.addEventListener('mouseup', this);
        this.node.addEventListener('mouseleave', this);
        this.node.addEventListener('contextmenu', this);
    };
    /**
     * A message handler invoked on a `'before-detach'` message.
     */
    Menu.prototype.onBeforeDetach = function (msg) {
        this.node.removeEventListener('mouseup', this);
        this.node.removeEventListener('mouseleave', this);
        this.node.removeEventListener('contextmenu', this);
        document.removeEventListener('keydown', this, true);
        document.removeEventListener('keypress', this, true);
        document.removeEventListener('mousedown', this, true);
    };
    /**
     * A handler invoked on an `'update-request'` message.
     */
    Menu.prototype.onUpdateRequest = function (msg) {
        // Create the nodes for the menu.
        var items = this.items;
        var count = items.length;
        var nodes = new Array(count);
        for (var i = 0; i < count; ++i) {
            var node = createItemNode(items[i]);
            node.addEventListener('mouseenter', this);
            nodes[i] = node;
        }
        // Force hide the leading visible separators.
        for (var k1 = 0; k1 < count; ++k1) {
            if (items[k1].hidden) {
                continue;
            }
            if (!items[k1].isSeparatorType) {
                break;
            }
            nodes[k1].classList.add(exports.FORCE_HIDDEN_CLASS);
        }
        // Force hide the trailing visible separators.
        for (var k2 = count - 1; k2 >= 0; --k2) {
            if (items[k2].hidden) {
                continue;
            }
            if (!items[k2].isSeparatorType) {
                break;
            }
            nodes[k2].classList.add(exports.FORCE_HIDDEN_CLASS);
        }
        // Force hide the remaining consecutive visible separators.
        var hide = false;
        while (++k1 < k2) {
            if (items[k1].hidden) {
                continue;
            }
            if (hide && items[k1].isSeparatorType) {
                nodes[k1].classList.add(exports.FORCE_HIDDEN_CLASS);
            }
            else {
                hide = items[k1].isSeparatorType;
            }
        }
        // Fetch the content node.
        var content = this.node.firstChild;
        // Refresh the content node's content.
        content.textContent = '';
        for (var i = 0; i < count; ++i) {
            content.appendChild(nodes[i]);
        }
    };
    /**
     * A message handler invoked on a `'close-request'` message.
     */
    Menu.prototype.onCloseRequest = function (msg) {
        // Reset the menu state.
        this._cancelPendingOpen();
        this._cancelPendingClose();
        this.activeIndex = -1;
        // Close any open child menu.
        var childMenu = this._childMenu;
        if (childMenu) {
            this._childMenu = null;
            this._childItem = null;
            childMenu.close(true);
        }
        // Remove this menu from any parent.
        var parentMenu = this._parentMenu;
        if (parentMenu) {
            this._parentMenu = null;
            parentMenu._cancelPendingOpen();
            parentMenu._cancelPendingClose();
            parentMenu._childMenu = null;
            parentMenu._childItem = null;
        }
        // Ensure this menu is detached.
        if (this.parent) {
            this.parent = null;
            this.closed.emit(void 0);
        }
        else if (this.isAttached) {
            phosphor_widget_1.detachWidget(this);
            this.closed.emit(void 0);
        }
        // Clear the content node.
        this.node.firstChild.textContent = '';
    };
    /**
     * Handle the `'mouseenter'` event for the menu.
     *
     * This event listener is attached to the child item nodes.
     */
    Menu.prototype._evtMouseEnter = function (event) {
        this._syncAncestors();
        this._closeChildMenu();
        this._cancelPendingOpen();
        var node = event.currentTarget;
        this.activeIndex = this._itemNodeIndex(node);
        var item = this.items[this.activeIndex];
        if (item && item.submenu) {
            if (item === this._childItem) {
                this._cancelPendingClose();
            }
            else {
                this._openChildMenu(item, node, true);
            }
        }
    };
    /**
     * Handle the `'mouseleave'` event for the menu.
     *
     * This event listener is only attached to the menu node.
     */
    Menu.prototype._evtMouseLeave = function (event) {
        this._cancelPendingOpen();
        var child = this._childMenu;
        if (!child || !phosphor_domutil_1.hitTest(child.node, event.clientX, event.clientY)) {
            this.activeIndex = -1;
            this._closeChildMenu();
        }
    };
    /**
     * Handle the `'mouseup'` event for the menu.
     *
     * This event listener is attached to the menu node.
     */
    Menu.prototype._evtMouseUp = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.button !== 0) {
            return;
        }
        var node = this._itemNodeAt(this.activeIndex);
        if (node && node.contains(event.target)) {
            this.triggerActiveItem();
        }
    };
    /**
     * Handle the `'contextmenu'` event for the menu bar.
     */
    Menu.prototype._evtContextMenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * Handle the `'mousedown'` event for the menu.
     *
     * This event listener is attached to the document for a popup menu.
     */
    Menu.prototype._evtMouseDown = function (event) {
        var menu = this;
        var hit = false;
        var x = event.clientX;
        var y = event.clientY;
        while (!hit && menu) {
            hit = phosphor_domutil_1.hitTest(menu.node, x, y);
            menu = menu._childMenu;
        }
        if (!hit)
            this.close(true);
    };
    /**
     * Handle the `'keydown'` event for the menu.
     *
     * This event listener is attached to the document for a popup menu.
     */
    Menu.prototype._evtKeyDown = function (event) {
        event.stopPropagation();
        var leaf = this.leafMenu;
        switch (event.keyCode) {
            case 13:
                event.preventDefault();
                leaf.triggerActiveItem();
                break;
            case 27:
                event.preventDefault();
                leaf.close(true);
                break;
            case 37:
                event.preventDefault();
                if (leaf !== this)
                    leaf.close(true);
                break;
            case 38:
                event.preventDefault();
                leaf.activatePreviousItem();
                break;
            case 39:
                event.preventDefault();
                leaf.openActiveItem();
                break;
            case 40:
                event.preventDefault();
                leaf.activateNextItem();
                break;
        }
    };
    /**
     * Handle the `'keypress'` event for the menu.
     *
     * This event listener is attached to the document for a popup menu.
     */
    Menu.prototype._evtKeyPress = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.leafMenu.activateMnemonicItem(String.fromCharCode(event.charCode));
    };
    /**
     * Synchronize the active item hierarchy starting with the parent.
     *
     * This ensures that the proper child items are activated for the
     * ancestor menu hierarchy and that any pending open or close
     * tasks are cleared.
     */
    Menu.prototype._syncAncestors = function () {
        var menu = this._parentMenu;
        while (menu) {
            menu._syncChildItem();
            menu = menu._parentMenu;
        }
    };
    /**
     * Synchronize the active index with the current child item.
     */
    Menu.prototype._syncChildItem = function () {
        this._cancelPendingOpen();
        this._cancelPendingClose();
        this.activeIndex = this.items.indexOf(this._childItem);
    };
    /**
     * Open the menu item's submenu using the node for location.
     *
     * If the given item is already open, this is a no-op.
     *
     * Any pending open operation will be cancelled before opening
     * the menu or queueing the delayed task to open the menu.
     */
    Menu.prototype._openChildMenu = function (item, node, delayed) {
        var _this = this;
        if (item === this._childItem) {
            return;
        }
        this._cancelPendingOpen();
        if (delayed) {
            this._openTimerId = setTimeout(function () {
                var menu = item.submenu;
                _this._openTimerId = 0;
                _this._childItem = item;
                _this._childMenu = menu;
                menu._parentMenu = _this;
                menu.update(true);
                openSubmenu(menu, node);
            }, OPEN_DELAY);
        }
        else {
            var menu = item.submenu;
            this._childItem = item;
            this._childMenu = menu;
            menu._parentMenu = this;
            menu.update(true);
            openSubmenu(menu, node);
        }
    };
    /**
     * Close the currently open child menu using a delayed task.
     *
     * If a task is pending or if there is no child menu, this is a no-op.
     */
    Menu.prototype._closeChildMenu = function () {
        var _this = this;
        if (this._closeTimerId || !this._childMenu) {
            return;
        }
        this._closeTimerId = setTimeout(function () {
            _this._closeTimerId = 0;
            if (_this._childMenu) {
                _this._childMenu.close(true);
                _this._childMenu = null;
                _this._childItem = null;
            }
        }, CLOSE_DELAY);
    };
    /**
     * Cancel any pending child menu open task.
     */
    Menu.prototype._cancelPendingOpen = function () {
        if (this._openTimerId) {
            clearTimeout(this._openTimerId);
            this._openTimerId = 0;
        }
    };
    /**
     * Cancel any pending child menu close task.
     */
    Menu.prototype._cancelPendingClose = function () {
        if (this._closeTimerId) {
            clearTimeout(this._closeTimerId);
            this._closeTimerId = 0;
        }
    };
    /**
     * Get the menu item node at the given index.
     *
     * This will return `undefined` if the index is out of range.
     */
    Menu.prototype._itemNodeAt = function (index) {
        var content = this.node.firstChild;
        return content.children[index];
    };
    /**
     * Get the index of the given menu item node.
     *
     * This will return `-1` if the menu item node is not found.
     */
    Menu.prototype._itemNodeIndex = function (node) {
        var content = this.node.firstChild;
        return Array.prototype.indexOf.call(content.children, node);
    };
    /**
     * A signal emitted when the menu is closed.
     *
     * **See also:** [[closed]]
     */
    Menu.closedSignal = new phosphor_signaling_1.Signal();
    return Menu;
})(menubase_1.MenuBase);
exports.Menu = Menu;
/**
 * Create a menu item from a template.
 */
function createMenuItem(template) {
    return menuitem_1.MenuItem.fromTemplate(template);
}
/**
 * Create the complete DOM node class name for a MenuItem.
 */
function createItemClassName(item) {
    var parts = [exports.MENU_ITEM_CLASS];
    if (item.isCheckType) {
        parts.push(exports.CHECK_TYPE_CLASS);
    }
    else if (item.isSeparatorType) {
        parts.push(exports.SEPARATOR_TYPE_CLASS);
    }
    if (item.checked) {
        parts.push(exports.CHECKED_CLASS);
    }
    if (item.disabled) {
        parts.push(exports.DISABLED_CLASS);
    }
    if (item.hidden) {
        parts.push(exports.HIDDEN_CLASS);
    }
    if (item.submenu) {
        parts.push(exports.HAS_SUBMENU_CLASS);
    }
    if (item.className) {
        parts.push(item.className);
    }
    return parts.join(' ');
}
/**
 * Create the DOM node for a MenuItem.
 */
function createItemNode(item) {
    var node = document.createElement('div');
    var icon = document.createElement('span');
    var text = document.createElement('span');
    var shortcut = document.createElement('span');
    var submenu = document.createElement('span');
    node.className = createItemClassName(item);
    icon.className = exports.ICON_CLASS;
    text.className = exports.TEXT_CLASS;
    shortcut.className = exports.SHORTCUT_CLASS;
    submenu.className = exports.SUBMENU_ICON_CLASS;
    if (!item.isSeparatorType) {
        text.textContent = item.text.replace(/&/g, '');
        shortcut.textContent = item.shortcut;
    }
    node.appendChild(icon);
    node.appendChild(text);
    node.appendChild(shortcut);
    node.appendChild(submenu);
    return node;
}
/**
 * Get the currently visible viewport rect in page coordinates.
 */
function clientViewportRect() {
    var elem = document.documentElement;
    var x = window.pageXOffset;
    var y = window.pageYOffset;
    var width = elem.clientWidth;
    var height = elem.clientHeight;
    return { x: x, y: y, width: width, height: height };
}
/**
 * Mount the menu as hidden and compute its optimal size.
 *
 * If the vertical scrollbar become visible, the menu will be expanded
 * by the scrollbar width to prevent clipping the contents of the menu.
 */
function mountAndMeasure(menu, maxHeight) {
    var node = menu.node;
    var style = node.style;
    style.top = '';
    style.left = '';
    style.width = '';
    style.height = '';
    style.visibility = 'hidden';
    style.maxHeight = maxHeight + 'px';
    phosphor_widget_1.attachWidget(menu, document.body);
    if (node.scrollHeight > maxHeight) {
        style.width = 2 * node.offsetWidth - node.clientWidth + 'px';
    }
    var rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}
/**
 * Show the menu at the specified position.
 */
function showMenu(menu, x, y) {
    var style = menu.node.style;
    style.top = Math.max(0, y) + 'px';
    style.left = Math.max(0, x) + 'px';
    style.visibility = '';
}
/**
 * Open the menu as a root menu at the target location.
 */
function openRootMenu(menu, x, y, forceX, forceY) {
    var rect = clientViewportRect();
    var size = mountAndMeasure(menu, rect.height - (forceY ? y : 0));
    if (!forceX && (x + size.width > rect.x + rect.width)) {
        x = rect.x + rect.width - size.width;
    }
    if (!forceY && (y + size.height > rect.y + rect.height)) {
        if (y > rect.y + rect.height) {
            y = rect.y + rect.height - size.height;
        }
        else {
            y = y - size.height;
        }
    }
    showMenu(menu, x, y);
}
/**
 * Open a the menu as a submenu using the item node for positioning.
 */
function openSubmenu(menu, item) {
    var rect = clientViewportRect();
    var size = mountAndMeasure(menu, rect.height);
    var box = phosphor_domutil_1.boxSizing(menu.node);
    var itemRect = item.getBoundingClientRect();
    var x = itemRect.right - SUBMENU_OVERLAP;
    var y = itemRect.top - box.borderTop - box.paddingTop;
    if (x + size.width > rect.x + rect.width) {
        x = itemRect.left + SUBMENU_OVERLAP - size.width;
    }
    if (y + size.height > rect.y + rect.height) {
        y = itemRect.bottom + box.borderBottom + box.paddingBottom - size.height;
    }
    showMenu(menu, x, y);
}

},{"./menubase":11,"./menuitem":12,"phosphor-domutil":6,"phosphor-signaling":16,"phosphor-widget":18}],10:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_properties_1 = require('phosphor-properties');
var menubase_1 = require('./menubase');
var menuitem_1 = require('./menuitem');
/**
 * `p-MenuBar`: the class name added to a menu bar widget.
 */
exports.MENU_BAR_CLASS = 'p-MenuBar';
/**
 * `p-MenuBar-content`: the class name assigned to a content node.
 */
exports.CONTENT_CLASS = 'p-MenuBar-content';
/**
 * `p-MenuBar-menu`: the class name added to an open menu.
 */
exports.MENU_CLASS = 'p-MenuBar-menu';
/**
 * `p-MenuBar-item`: the class name assigned to a menu item.
 */
exports.MENU_ITEM_CLASS = 'p-MenuBar-item';
/**
 * `p-MenuBar-item-icon`: the class name added to an item icon cell.
 */
exports.ICON_CLASS = 'p-MenuBar-item-icon';
/**
 * `p-MenuBar-item-text`: the class name added to an item text cell.
 */
exports.TEXT_CLASS = 'p-MenuBar-item-text';
/**
 * `p-mod-separator-type`: the class name added to a separator item.
 */
exports.SEPARATOR_TYPE_CLASS = 'p-mod-separator-type';
/**
 * `p-mod-active`: the class name added to an active menu bar and item.
 */
exports.ACTIVE_CLASS = 'p-mod-active';
/**
 * `p-mod-disabled`: the class name added to a disabled item.
 */
exports.DISABLED_CLASS = 'p-mod-disabled';
/**
 * `p-mod-hidden`: the class name added to a hidden item.
 */
exports.HIDDEN_CLASS = 'p-mod-hidden';
/**
 * `p-mod-force-hidden`: the class name added to a force hidden item.
 */
exports.FORCE_HIDDEN_CLASS = 'p-mod-force-hidden';
/**
 * A widget which displays menu items as a menu bar.
 *
 * #### Notes
 * A `MenuBar` widget does not support child widgets. Adding children
 * to a `MenuBar` will result in undefined behavior.
 */
var MenuBar = (function (_super) {
    __extends(MenuBar, _super);
    /**
     * Construct a new menu bar.
     */
    function MenuBar() {
        _super.call(this);
        this._active = false;
        this._childMenu = null;
        this.addClass(exports.MENU_BAR_CLASS);
    }
    /**
     * Create the DOM node for a menu bar.
     */
    MenuBar.createNode = function () {
        var node = document.createElement('div');
        var content = document.createElement('div');
        content.className = exports.CONTENT_CLASS;
        node.appendChild(content);
        return node;
    };
    /**
     * A convenience method to create a menu bar from a template.
     *
     * @param array - The menu item templates for the menu bar.
     *
     * @returns A new menu bar created from the menu item templates.
     *
     * #### Notes
     * Submenu templates will be recursively created using the
     * `Menu.fromTemplate` method. If custom menus or menu items
     * are required, use the relevant constructors directly.
     */
    MenuBar.fromTemplate = function (array) {
        var bar = new MenuBar();
        bar.items = array.map(createMenuItem);
        return bar;
    };
    /**
     * Dispose of the resources held by the panel.
     */
    MenuBar.prototype.dispose = function () {
        this._reset();
        _super.prototype.dispose.call(this);
    };
    Object.defineProperty(MenuBar.prototype, "childMenu", {
        /**
         * Get the child menu of the menu bar.
         *
         * #### Notes
         * This will be `null` if the menu bar does not have an open menu.
         */
        get: function () {
            return this._childMenu;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handle the DOM events for the menu bar.
     *
     * @param event - The DOM event sent to the menu bar.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the menu's DOM nodes. It should
     * not be called directly by user code.
     */
    MenuBar.prototype.handleEvent = function (event) {
        switch (event.type) {
            case 'mousedown':
                this._evtMouseDown(event);
                break;
            case 'mousemove':
                this._evtMouseMove(event);
                break;
            case 'mouseleave':
                this._evtMouseLeave(event);
                break;
            case 'contextmenu':
                this._evtContextMenu(event);
                break;
            case 'keydown':
                this._evtKeyDown(event);
                break;
            case 'keypress':
                this._evtKeyPress(event);
                break;
        }
    };
    /**
     * A method invoked when the menu items change.
     */
    MenuBar.prototype.onItemsChanged = function (old, items) {
        for (var i = 0, n = old.length; i < n; ++i) {
            phosphor_properties_1.Property.getChanged(old[i]).disconnect(this._onItemChanged, this);
        }
        for (var i = 0, n = items.length; i < n; ++i) {
            phosphor_properties_1.Property.getChanged(items[i]).connect(this._onItemChanged, this);
        }
        this.update(true);
    };
    /**
     * A method invoked when the active index changes.
     */
    MenuBar.prototype.onActiveIndexChanged = function (old, index) {
        var oldNode = this._itemNodeAt(old);
        var newNode = this._itemNodeAt(index);
        if (oldNode)
            oldNode.classList.remove(exports.ACTIVE_CLASS);
        if (newNode)
            newNode.classList.add(exports.ACTIVE_CLASS);
    };
    /**
     * A method invoked when a menu item should be opened.
     */
    MenuBar.prototype.onOpenItem = function (index, item) {
        var node = this._itemNodeAt(index) || this.node;
        this._activate();
        this._closeChildMenu();
        this._openChildMenu(item.submenu, node);
    };
    /**
     * A message handler invoked on an `'after-attach'` message.
     */
    MenuBar.prototype.onAfterAttach = function (msg) {
        this.node.addEventListener('mousedown', this);
        this.node.addEventListener('mousemove', this);
        this.node.addEventListener('mouseleave', this);
        this.node.addEventListener('contextmenu', this);
    };
    /**
     * A message handler invoked on a `'before-detach'` message.
     */
    MenuBar.prototype.onBeforeDetach = function (msg) {
        this.node.removeEventListener('mousedown', this);
        this.node.removeEventListener('mousemove', this);
        this.node.removeEventListener('mouseleave', this);
        this.node.removeEventListener('contextmenu', this);
    };
    /**
     * A handler invoked on an `'update-request'` message.
     */
    MenuBar.prototype.onUpdateRequest = function (msg) {
        // Reset the state of the menu bar.
        this._reset();
        // Create the nodes for the menu bar.
        var items = this.items;
        var count = items.length;
        var nodes = new Array(count);
        for (var i = 0; i < count; ++i) {
            nodes[i] = createItemNode(items[i]);
        }
        // Force hide the leading visible separators.
        for (var k1 = 0; k1 < count; ++k1) {
            if (items[k1].hidden) {
                continue;
            }
            if (!items[k1].isSeparatorType) {
                break;
            }
            nodes[k1].classList.add(exports.FORCE_HIDDEN_CLASS);
        }
        // Force hide the trailing visible separators.
        for (var k2 = count - 1; k2 >= 0; --k2) {
            if (items[k2].hidden) {
                continue;
            }
            if (!items[k2].isSeparatorType) {
                break;
            }
            nodes[k2].classList.add(exports.FORCE_HIDDEN_CLASS);
        }
        // Force hide the remaining consecutive visible separators.
        var hide = false;
        while (++k1 < k2) {
            if (items[k1].hidden) {
                continue;
            }
            if (hide && items[k1].isSeparatorType) {
                nodes[k1].classList.add(exports.FORCE_HIDDEN_CLASS);
            }
            else {
                hide = items[k1].isSeparatorType;
            }
        }
        // Fetch the content node.
        var content = this.node.firstChild;
        // Refresh the content node's content.
        content.textContent = '';
        for (var i = 0; i < count; ++i) {
            content.appendChild(nodes[i]);
        }
    };
    /**
     * A message handler invoked on a `'close-request'` message.
     */
    MenuBar.prototype.onCloseRequest = function (msg) {
        this._reset();
        _super.prototype.onCloseRequest.call(this, msg);
    };
    /**
     * Handle the `'mousedown'` event for the menu bar.
     */
    MenuBar.prototype._evtMouseDown = function (event) {
        var x = event.clientX;
        var y = event.clientY;
        // If the bar is active and the mouse press is on an open menu,
        // let that menu handle the press. The bar will reset when the
        // menu emits its `closed` signal.
        if (this._active && hitTestMenus(this._childMenu, x, y)) {
            return;
        }
        // Check if the mouse was pressed on one of the menu items.
        var i = this._hitTestItemNodes(x, y);
        // If the bar is active, deactivate it and close the child menu.
        // The active index is updated to reflect the mouse press, which
        // is either valid, or `-1`.
        if (this._active) {
            this._deactivate();
            this._closeChildMenu();
            this.activeIndex = i;
            return;
        }
        // At this point, the bar is not active. If the mouse press
        // was not on a menu item, clear the active index and return.
        if (i === -1) {
            this.activeIndex = -1;
            return;
        }
        // Otherwise, the press was on a menu item. Activate the bar,
        // update the active index, and open the menu item if possible.
        this._activate();
        this.activeIndex = i;
        this.openActiveItem();
    };
    /**
     * Handle the `'mousemove'` event for the menu bar.
     */
    MenuBar.prototype._evtMouseMove = function (event) {
        var x = event.clientX;
        var y = event.clientY;
        // Check if the mouse is over one of the menu items.
        var i = this._hitTestItemNodes(x, y);
        // Bail early if the active index will not change.
        if (i === this.activeIndex) {
            return;
        }
        // Bail early if the bar is active and the mouse is not over an
        // item. This allows the leading and trailing menus to be kept
        // open when the mouse is over the empty part of the menu bar.
        if (i === -1 && this._active) {
            return;
        }
        // Update the active index to the hovered item.
        this.activeIndex = i;
        // If the bar is not active, there's nothing more to do.
        if (!this._active) {
            return;
        }
        // Otherwise, close the current child menu and open the new one.
        this._closeChildMenu();
        this.openActiveItem();
    };
    /**
     * Handle the `'mouseleave'` event for the menu bar.
     */
    MenuBar.prototype._evtMouseLeave = function (event) {
        if (!this._active)
            this.activeIndex = -1;
    };
    /**
     * Handle the `'contextmenu'` event for the menu bar.
     */
    MenuBar.prototype._evtContextMenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * Handle the `'keydown'` event for the menu bar.
     */
    MenuBar.prototype._evtKeyDown = function (event) {
        event.stopPropagation();
        var menu = this._childMenu;
        var leaf = menu && menu.leafMenu;
        switch (event.keyCode) {
            case 13:
                event.preventDefault();
                if (leaf)
                    leaf.triggerActiveItem();
                break;
            case 27:
                event.preventDefault();
                if (leaf)
                    leaf.close(true);
                break;
            case 37:
                event.preventDefault();
                if (leaf && leaf !== menu) {
                    leaf.close(true);
                }
                else {
                    this._closeChildMenu();
                    this.activatePreviousItem();
                    this.openActiveItem();
                }
                break;
            case 38:
                event.preventDefault();
                if (leaf)
                    leaf.activatePreviousItem();
                break;
            case 39:
                event.preventDefault();
                if (leaf && activeHasMenu(leaf)) {
                    leaf.openActiveItem();
                }
                else {
                    this._closeChildMenu();
                    this.activateNextItem();
                    this.openActiveItem();
                }
                break;
            case 40:
                event.preventDefault();
                if (leaf)
                    leaf.activateNextItem();
                break;
        }
    };
    /**
     * Handle the `'keypress'` event for the menu bar.
     */
    MenuBar.prototype._evtKeyPress = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var str = String.fromCharCode(event.charCode);
        (this._childMenu || this).activateMnemonicItem(str);
    };
    /**
     * Open the child menu using the given item node for location.
     */
    MenuBar.prototype._openChildMenu = function (menu, node) {
        var rect = node.getBoundingClientRect();
        this._childMenu = menu;
        menu.addClass(exports.MENU_CLASS);
        menu.open(rect.left, rect.bottom, false, true);
        menu.closed.connect(this._onMenuClosed, this);
    };
    /**
     * Close the current child menu, if one exists.
     */
    MenuBar.prototype._closeChildMenu = function () {
        var menu = this._childMenu;
        if (menu) {
            this._childMenu = null;
            menu.closed.disconnect(this._onMenuClosed, this);
            menu.removeClass(exports.MENU_CLASS);
            menu.close(true);
        }
    };
    /**
     * Activate the menu bar and switch the mouse listeners to global.
     *
     * The listeners are switched after the current event dispatch is
     * complete. Otherwise, duplicate event notifications could occur.
     */
    MenuBar.prototype._activate = function () {
        var _this = this;
        if (this._active) {
            return;
        }
        this._active = true;
        this.addClass(exports.ACTIVE_CLASS);
        setTimeout(function () {
            _this.node.removeEventListener('mousedown', _this);
            document.addEventListener('mousedown', _this, true);
            document.addEventListener('keydown', _this, true);
            document.addEventListener('keypress', _this, true);
        }, 0);
    };
    /**
     * Deactivate the menu bar switch the mouse listeners to local.
     *
     * The listeners are switched after the current event dispatch is
     * complete. Otherwise, duplicate event notifications could occur.
     */
    MenuBar.prototype._deactivate = function () {
        var _this = this;
        if (!this._active) {
            return;
        }
        this._active = false;
        this.removeClass(exports.ACTIVE_CLASS);
        setTimeout(function () {
            _this.node.addEventListener('mousedown', _this);
            document.removeEventListener('mousedown', _this, true);
            document.removeEventListener('keydown', _this, true);
            document.removeEventListener('keypress', _this, true);
        }, 0);
    };
    /**
     * Reset the menu bar to its default state.
     */
    MenuBar.prototype._reset = function () {
        this._deactivate();
        this._closeChildMenu();
        this.activeIndex = -1;
    };
    /**
     * Get the menu item node at the given index.
     *
     * This will return `undefined` if the index is out of range.
     */
    MenuBar.prototype._itemNodeAt = function (index) {
        var content = this.node.firstChild;
        return content.children[index];
    };
    /**
     * Get the index of the menu item node at a client position.
     *
     * This will return `-1` if the menu item node is not found.
     */
    MenuBar.prototype._hitTestItemNodes = function (x, y) {
        var nodes = this.node.firstChild.children;
        for (var i = 0, n = nodes.length; i < n; ++i) {
            if (phosphor_domutil_1.hitTest(nodes[i], x, y))
                return i;
        }
        return -1;
    };
    /**
     * Handle the `closed` signal from the child menu.
     */
    MenuBar.prototype._onMenuClosed = function (sender) {
        sender.closed.disconnect(this._onMenuClosed, this);
        sender.removeClass(exports.MENU_CLASS);
        this._childMenu = null;
        this._reset();
    };
    /**
     * Handle the property changed signal from a menu item.
     */
    MenuBar.prototype._onItemChanged = function (sender) {
        this.update();
    };
    return MenuBar;
})(menubase_1.MenuBase);
exports.MenuBar = MenuBar;
/**
 * Create a menu item from a template.
 */
function createMenuItem(template) {
    return menuitem_1.MenuItem.fromTemplate(template);
}
/**
 * Create the complete DOM node class name for a MenuItem.
 */
function createItemClassName(item) {
    var parts = [exports.MENU_ITEM_CLASS];
    if (item.isSeparatorType) {
        parts.push(exports.SEPARATOR_TYPE_CLASS);
    }
    if (item.disabled) {
        parts.push(exports.DISABLED_CLASS);
    }
    if (item.hidden) {
        parts.push(exports.HIDDEN_CLASS);
    }
    if (item.className) {
        parts.push(item.className);
    }
    return parts.join(' ');
}
/**
 * Create the DOM node for a MenuItem.
 */
function createItemNode(item) {
    var node = document.createElement('div');
    var icon = document.createElement('span');
    var text = document.createElement('span');
    node.className = createItemClassName(item);
    icon.className = exports.ICON_CLASS;
    text.className = exports.TEXT_CLASS;
    if (!item.isSeparatorType) {
        text.textContent = item.text.replace(/&/g, '');
    }
    node.appendChild(icon);
    node.appendChild(text);
    return node;
}
/**
 * Test whether a menu's active item has a submenu.
 */
function activeHasMenu(menu) {
    var item = menu.items[menu.activeIndex];
    return !!(item && item.submenu);
}
/**
 * Hit test the chain menus for the given client position.
 */
function hitTestMenus(menu, x, y) {
    while (menu) {
        if (phosphor_domutil_1.hitTest(menu.node, x, y)) {
            return true;
        }
        menu = menu.childMenu;
    }
    return false;
}

},{"./menubase":11,"./menuitem":12,"phosphor-domutil":6,"phosphor-properties":14}],11:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');
/**
 * A base class for implementing widgets which display menu items.
 */
var MenuBase = (function (_super) {
    __extends(MenuBase, _super);
    function MenuBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(MenuBase.prototype, "items", {
        /**
         * Get the array of menu items.
         *
         * #### Notes
         * This is a pure delegate to the [[itemsProperty]].
         */
        get: function () {
            return MenuBase.itemsProperty.get(this);
        },
        /**
         * Set the array of menu items.
         *
         * #### Notes
         * This is a pure delegate to the [[itemsProperty]].
         */
        set: function (value) {
            MenuBase.itemsProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuBase.prototype, "activeIndex", {
        /**
         * Get index of the active menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[activeIndexProperty]].
         */
        get: function () {
            return MenuBase.activeIndexProperty.get(this);
        },
        /**
         * Set index of the active menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[activeIndexProperty]].
         */
        set: function (value) {
            MenuBase.activeIndexProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Activate the next selectable menu item.
     *
     * #### Notes
     * The search starts with the currently active item, and progresses
     * forward until the next selectable item is found. The search will
     * wrap around at the end of the menu.
     */
    MenuBase.prototype.activateNextItem = function () {
        var k = this.activeIndex + 1;
        var i = k >= this.items.length ? 0 : k;
        this.activeIndex = arrays.findIndex(this.items, isSelectable, i, true);
    };
    /**
     * Activate the previous selectable menu item.
     *
     * #### Notes
     * The search starts with the currently active item, and progresses
     * backward until the next selectable item is found. The search will
     * wrap around at the front of the menu.
     */
    MenuBase.prototype.activatePreviousItem = function () {
        var k = this.activeIndex;
        var i = k <= 0 ? this.items.length - 1 : k - 1;
        this.activeIndex = arrays.rfindIndex(this.items, isSelectable, i, true);
    };
    /**
     * Activate the next selectable menu item with the given mnemonic.
     *
     * #### Notes
     * The search starts with the currently active item, and progresses
     * forward until the next selectable item with the given mnemonic is
     * found. The search will wrap around at the end of the menu, and the
     * mnemonic matching is case-insensitive.
     */
    MenuBase.prototype.activateMnemonicItem = function (char) {
        var c = char.toUpperCase();
        var k = this.activeIndex + 1;
        var i = k >= this.items.length ? 0 : k;
        this.activeIndex = arrays.findIndex(this.items, function (item) {
            if (!isSelectable(item)) {
                return false;
            }
            var match = item.text.match(/&\w/);
            if (!match) {
                return false;
            }
            return match[0][1].toUpperCase() === c;
        }, i, true);
    };
    /**
     * Open the active menu item.
     *
     * #### Notes
     * This is a no-op if there is no active menu item, or if the active
     * menu item does not have a submenu.
     */
    MenuBase.prototype.openActiveItem = function () {
        var i = this.activeIndex;
        var item = this.items[i];
        if (item && item.submenu) {
            this.onOpenItem(i, item);
        }
    };
    /**
     * Trigger the active menu item.
     *
     * #### Notes
     * This is a no-op if there is no active menu item. If the active
     * menu item has a submenu, this is equivalent to `openActiveItem`.
     */
    MenuBase.prototype.triggerActiveItem = function () {
        var i = this.activeIndex;
        var item = this.items[i];
        if (item && item.submenu) {
            this.onOpenItem(i, item);
        }
        else if (item) {
            this.onTriggerItem(i, item);
        }
    };
    /**
     * The coerce handler for the [[activeIndexProperty]].
     *
     * #### Notes
     * Subclasses may reimplement this method as needed.
     */
    MenuBase.prototype.coerceActiveIndex = function (index) {
        var i = index | 0;
        var item = this.items[i];
        return (item && isSelectable(item)) ? i : -1;
    };
    /**
     * A method invoked when the menu items change.
     *
     * The default implementation of this method is a no-op.
     */
    MenuBase.prototype.onItemsChanged = function (old, items) { };
    /**
     * A method invoked when the active index changes.
     *
     * The default implementation of this method is a no-op.
     */
    MenuBase.prototype.onActiveIndexChanged = function (old, index) { };
    /**
     * A method invoked when a menu item should be opened.
     *
     * The default implementation of this handler is a no-op.
     */
    MenuBase.prototype.onOpenItem = function (index, item) { };
    /**
     * A method invoked when a menu item should be triggered.
     *
     * The default implementation of this handler is a no-op.
     */
    MenuBase.prototype.onTriggerItem = function (index, item) { };
    /**
     * The property descriptor for the menu items.
     *
     * This controls the items which are contained in the menu.
     *
     * #### Notes
     * In-place modifications to the array are not allowed.
     *
     * **See also:** [[items]]
     */
    MenuBase.itemsProperty = new phosphor_properties_1.Property({
        value: Object.freeze([]),
        coerce: function (owner, value) { return Object.freeze(value ? value.slice() : []); },
        changed: function (owner, old, value) { return owner.onItemsChanged(old, value); },
    });
    /**
     * The property descriptor for the active index.
     *
     * This controls which menu item is the active item.
     *
     * **See also:** [[activeIndex]]
     */
    MenuBase.activeIndexProperty = new phosphor_properties_1.Property({
        value: -1,
        coerce: function (owner, index) { return owner.coerceActiveIndex(index); },
        changed: function (owner, old, index) { return owner.onActiveIndexChanged(old, index); },
    });
    return MenuBase;
})(phosphor_widget_1.Widget);
exports.MenuBase = MenuBase;
/**
 * Test whether a menu item is selectable.
 */
function isSelectable(item) {
    return !item.hidden && !item.disabled && !item.isSeparatorType;
}

},{"phosphor-arrays":3,"phosphor-properties":14,"phosphor-widget":18}],12:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_properties_1 = require('phosphor-properties');
var menu_1 = require('./menu');
/**
 * An item which can be added to a menu or menu bar.
 */
var MenuItem = (function () {
    /**
     * Construct a new menu item.
     *
     * @param options - The initialization options for the menu item.
     */
    function MenuItem(options) {
        if (options)
            initFromOptions(this, options);
    }
    /**
     * Create a menu item from a template.
     *
     * @param template - The template object for the menu item.
     *
     * @returns A new menu item created from the template.
     *
     * #### Notes
     * If a submenu template is provided, the submenu will be created
     * by calling `Menu.fromTemplate`. If a custom menu is necessary,
     * use the `MenuItem` constructor directly.
     */
    MenuItem.fromTemplate = function (template) {
        var item = new MenuItem();
        initFromTemplate(item, template);
        return item;
    };
    Object.defineProperty(MenuItem.prototype, "type", {
        /**
         * Get the type of the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[typeProperty]].
         *
         * **See also:** [[isNormalType]], [[isCheckType]], [[isSeparatorType]]
         */
        get: function () {
            return MenuItem.typeProperty.get(this);
        },
        /**
         * Set the type of the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[typeProperty]].
         */
        set: function (value) {
            MenuItem.typeProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "text", {
        /**
         * Get the text for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[textProperty]].
         */
        get: function () {
            return MenuItem.textProperty.get(this);
        },
        /**
         * Set the text for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[textProperty]].
         */
        set: function (value) {
            MenuItem.textProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "shortcut", {
        /**
         * Get the shortcut key for the menu item (decoration only).
         *
         * #### Notes
         * This is a pure delegate to the [[shortcutProperty]].
         */
        get: function () {
            return MenuItem.shortcutProperty.get(this);
        },
        /**
         * Set the shortcut key for the menu item (decoration only).
         *
         * #### Notes
         * This is a pure delegate to the [[shortcutProperty]].
         */
        set: function (value) {
            MenuItem.shortcutProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "disabled", {
        /**
         * Get whether the menu item is disabled.
         *
         * #### Notes
         * This is a pure delegate to the [[disabledProperty]].
         */
        get: function () {
            return MenuItem.disabledProperty.get(this);
        },
        /**
         * Set whether the menu item is disabled.
         *
         * #### Notes
         * This is a pure delegate to the [[disabledProperty]].
         */
        set: function (value) {
            MenuItem.disabledProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "hidden", {
        /**
         * Get whether the menu item is hidden.
         *
         * #### Notes
         * This is a pure delegate to the [[hiddenProperty]].
         */
        get: function () {
            return MenuItem.hiddenProperty.get(this);
        },
        /**
         * Set whether the menu item is hidden.
         *
         * #### Notes
         * This is a pure delegate to the [[hiddenProperty]].
         */
        set: function (value) {
            MenuItem.hiddenProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "checked", {
        /**
         * Get whether the menu item is checked.
         *
         * #### Notes
         * This is a pure delegate to the [[checkedProperty]].
         */
        get: function () {
            return MenuItem.checkedProperty.get(this);
        },
        /**
         * Set whether the menu item is checked.
         *
         * #### Notes
         * This is a pure delegate to the [[checkedProperty]].
         */
        set: function (value) {
            MenuItem.checkedProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "className", {
        /**
         * Get the extra class name for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[classNameProperty]].
         */
        get: function () {
            return MenuItem.classNameProperty.get(this);
        },
        /**
         * Set the extra class name for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[classNameProperty]].
         */
        set: function (value) {
            MenuItem.classNameProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "handler", {
        /**
         * Get the handler for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[handlerProperty]].
         */
        get: function () {
            return MenuItem.handlerProperty.get(this);
        },
        /**
         * Set the handler for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[handlerProperty]].
         */
        set: function (value) {
            MenuItem.handlerProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "submenu", {
        /**
         * Get the submenu for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[submenuProperty]].
         */
        get: function () {
            return MenuItem.submenuProperty.get(this);
        },
        /**
         * Set the submenu for the menu item.
         *
         * #### Notes
         * This is a pure delegate to the [[submenuProperty]].
         */
        set: function (value) {
            MenuItem.submenuProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "isNormalType", {
        /**
         * Test whether the menu item is a `'normal'` type.
         *
         * #### Notes
         * This is a read-only property.
         *
         * **See also:** [[type]], [[isCheckType]], [[isSeparatorType]]
         */
        get: function () {
            return this.type === 'normal';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "isCheckType", {
        /**
         * Test whether the menu item is a `'check'` type.
         *
         * #### Notes
         * This is a read-only property.
         *
         * **See also:** [[type]], [[isNormalType]], [[isSeparatorType]]
         */
        get: function () {
            return this.type === 'check';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuItem.prototype, "isSeparatorType", {
        /**
         * Test whether the menu item is a `'separator'` type.
         *
         * #### Notes
         * This is a read-only property.
         *
         * **See also:** [[type]], [[isNormalType]], [[isCheckType]]
         */
        get: function () {
            return this.type === 'separator';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The property descriptor for the menu item type.
     *
     * Valid types are: `'normal'`, `'check'`, and `'separator'`.
     *
     * #### Notes
     * If an invalid type is provided, a warning will be logged and a
     * `'normal'` type will be used instead.
     *
     * The default value is `'normal'`.
     *
     * Using a string for this value instead of an enum makes it easier
     * to create menu items from a JSON specification. For the type-safe
     * crowd, read-only getters are provided to assert the item type.
     *
     * **See also:** [[type]]
     */
    MenuItem.typeProperty = new phosphor_properties_1.Property({
        value: 'normal',
        coerce: coerceMenuItemType,
        changed: function (owner) { return MenuItem.checkedProperty.coerce(owner); },
    });
    /**
     * The property descriptor for the menu item text.
     *
     * The text may have an ampersand `&` before the character
     * to use as the mnemonic for the menu item.
     *
     * **See also:** [[text]]
     */
    MenuItem.textProperty = new phosphor_properties_1.Property({
        value: '',
    });
    /**
     * The property descriptor for the menu item shortcut.
     *
     * **See also:** [[shortcut]]
     */
    MenuItem.shortcutProperty = new phosphor_properties_1.Property({
        value: '',
    });
    /**
     * The property descriptor controlling the menu item disabled state.
     *
     * **See also:** [[disabled]]
     */
    MenuItem.disabledProperty = new phosphor_properties_1.Property({
        value: false,
    });
    /**
     * The property descriptor controlling the menu item hidden state.
     *
     * **See also:** [[hidden]]
     */
    MenuItem.hiddenProperty = new phosphor_properties_1.Property({
        value: false,
    });
    /**
     * The property descriptor controlling the menu item checked state.
     *
     * #### Notes
     * Only a `'check'` type menu item can be checked.
     *
     * **See also:** [[checked]]
     */
    MenuItem.checkedProperty = new phosphor_properties_1.Property({
        value: false,
        coerce: function (owner, val) { return owner.type === 'check' ? val : false; },
    });
    /**
     * The property descriptor for the menu item class name.
     *
     * This is an extra class name which item renderers will add to
     * the DOM node which represents the menu item.
     *
     * **See also:** [[className]]
     */
    MenuItem.classNameProperty = new phosphor_properties_1.Property({
        value: '',
    });
    /**
     * The property descriptor for the item handler.
     *
     * This callback will be invoked when the menu item is triggered.
     *
     * **See also:** [[handler]]
     */
    MenuItem.handlerProperty = new phosphor_properties_1.Property({
        value: null,
        coerce: function (owner, value) { return value || null; },
    });
    /**
     * The property descriptor for the menu item submenu.
     *
     * **See also:** [[submenu]]
     */
    MenuItem.submenuProperty = new phosphor_properties_1.Property({
        value: null,
        coerce: function (owner, value) { return value || null; },
    });
    return MenuItem;
})();
exports.MenuItem = MenuItem;
/**
 * Initialize a menu item from a common options object.
 */
function initFromCommon(item, common) {
    if (common.type !== void 0) {
        item.type = common.type;
    }
    if (common.text !== void 0) {
        item.text = common.text;
    }
    if (common.shortcut !== void 0) {
        item.shortcut = common.shortcut;
    }
    if (common.disabled !== void 0) {
        item.disabled = common.disabled;
    }
    if (common.hidden !== void 0) {
        item.hidden = common.hidden;
    }
    if (common.checked !== void 0) {
        item.checked = common.checked;
    }
    if (common.className !== void 0) {
        item.className = common.className;
    }
    if (common.handler !== void 0) {
        item.handler = common.handler;
    }
}
/**
 * Initialize a menu item from a template object.
 */
function initFromTemplate(item, template) {
    initFromCommon(item, template);
    if (template.submenu !== void 0) {
        item.submenu = menu_1.Menu.fromTemplate(template.submenu);
    }
}
/**
 * Initialize a menu item from an options object.
 */
function initFromOptions(item, options) {
    initFromCommon(item, options);
    if (options.submenu !== void 0) {
        item.submenu = options.submenu;
    }
}
/**
 * The coerce handler for the menu item type.
 */
function coerceMenuItemType(item, value) {
    if (value === 'normal' || value === 'check' || value === 'separator') {
        return value;
    }
    console.warn('invalid menu item type:', value);
    return 'normal';
}

},{"./menu":9,"phosphor-properties":14}],13:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_queue_1 = require('phosphor-queue');
/**
 * A mesage which can be sent or posted to a message handler.
 *
 * #### Notes
 * This class may be subclassed to create complex message types.
 *
 * **See Also** [[postMessage]] and [[sendMessage]].
 */
var Message = (function () {
    /**
     * Construct a new message.
     *
     * @param type - The type of the message. Consumers of a message will
     *   use this value to cast the message to the appropriately derived
     *   message type.
     */
    function Message(type) {
        this._type = type;
    }
    Object.defineProperty(Message.prototype, "type", {
        /**
         * Get the type of the message.
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
})();
exports.Message = Message;
/**
 * Send a message to the message handler to process immediately.
 *
 * @param handler - The handler which should process the message.
 *
 * @param msg - The message to send to the handler.
 *
 * #### Notes
 * Unlike [[postMessage]], [[sendMessage]] delivers the message to
 * the handler immediately. The handler will not have the opportunity
 * to compress the message, however the message will still be sent
 * through any installed message filters.
 *
 * **See Also** [[postMessage]].
 */
function sendMessage(handler, msg) {
    getDispatcher(handler).sendMessage(handler, msg);
}
exports.sendMessage = sendMessage;
/**
 * Post a message to the message handler to process in the future.
 *
 * @param handler - The handler which should process the message.
 *
 * @param msg - The message to post to the handler.
 *
 * #### Notes
 * Unlike [[sendMessage]], [[postMessage]] will schedule the deliver of
 * the message for the next cycle of the event loop. The handler will
 * have the opportunity to compress the message in order to optimize
 * its handling of similar messages. The message will be sent through
 * any installed message filters before being delivered to the handler.
 *
 * **See Also** [[sendMessage]].
 */
function postMessage(handler, msg) {
    getDispatcher(handler).postMessage(handler, msg);
}
exports.postMessage = postMessage;
/**
 * Test whether a message handler has posted messages pending delivery.
 *
 * @param handler - The message handler of interest.
 *
 * @returns `true` if the handler has pending posted messages, `false`
 *   otherwise.
 *
 * **See Also** [[sendPendingMessage]].
 */
function hasPendingMessages(handler) {
    return getDispatcher(handler).hasPendingMessages();
}
exports.hasPendingMessages = hasPendingMessages;
/**
 * Send the first pending posted message to the message handler.
 *
 * @param handler - The message handler of interest.
 *
 * #### Notes
 * If the handler has no pending messages, this is a no-op.
 *
 * **See Also** [[hasPendingMessages]].
 */
function sendPendingMessage(handler) {
    getDispatcher(handler).sendPendingMessage(handler);
}
exports.sendPendingMessage = sendPendingMessage;
/**
 * Install a message filter for a message handler.
 *
 * A message filter is invoked before the message handler processes a
 * message. If the filter returns `true` from its [[filterMessage]] method,
 * no other filters will be invoked, and the message will not be delivered.
 *
 * The most recently installed message filter is executed first.
 *
 * @param handler - The handler whose messages should be filtered.
 *
 * @param filter - The filter to install for the handler.
 *
 * #### Notes
 * It is possible to install the same filter multiple times. If the
 * filter should be unique, call [[removeMessageFilter]] first.
 *
 * **See Also** [[removeMessageFilter]].
 */
function installMessageFilter(handler, filter) {
    getDispatcher(handler).installMessageFilter(filter);
}
exports.installMessageFilter = installMessageFilter;
/**
 * Remove a previously installed message filter for a message handler.
 *
 * @param handler - The handler for which the filter is installed.
 *
 * @param filter - The filter to remove.
 *
 * #### Notes
 * This will remove **all** occurrences of the filter. If the filter is
 * not installed, this is a no-op.
 *
 * It is safe to call this function while the filter is executing.
 *
 * **See Also** [[installMessageFilter]].
 */
function removeMessageFilter(handler, filter) {
    getDispatcher(handler).removeMessageFilter(filter);
}
exports.removeMessageFilter = removeMessageFilter;
/**
 * Clear all message data associated with the message handler.
 *
 * @param handler - The message handler for which to clear the data.
 *
 * #### Notes
 * This will remove all pending messages and filters for the handler.
 */
function clearMessageData(handler) {
    var dispatcher = dispatcherMap.get(handler);
    if (dispatcher)
        dispatcher.clear();
    dispatchQueue.removeAll(handler);
}
exports.clearMessageData = clearMessageData;
/**
 * The internal mapping of message handler to message dispatcher
 */
var dispatcherMap = new WeakMap();
/**
 * The internal queue of pending message handlers.
 */
var dispatchQueue = new phosphor_queue_1.Queue();
/**
 * The internal animation frame id for the message loop wake up call.
 */
var frameId = void 0;
/**
 * A local reference to an event loop hook.
 */
var raf;
if (typeof requestAnimationFrame === 'function') {
    raf = requestAnimationFrame;
}
else {
    raf = setImmediate;
}
/**
 * Get or create the message dispatcher for a message handler.
 */
function getDispatcher(handler) {
    var dispatcher = dispatcherMap.get(handler);
    if (dispatcher)
        return dispatcher;
    dispatcher = new MessageDispatcher();
    dispatcherMap.set(handler, dispatcher);
    return dispatcher;
}
/**
 * Wake up the message loop to process any pending dispatchers.
 *
 * This is a no-op if a wake up is not needed or is already pending.
 */
function wakeUpMessageLoop() {
    if (frameId === void 0 && !dispatchQueue.empty) {
        frameId = raf(runMessageLoop);
    }
}
/**
 * Run an iteration of the message loop.
 *
 * This will process all pending dispatchers in the queue. Dispatchers
 * which are added to the queue while the message loop is running will
 * be processed on the next message loop cycle.
 */
function runMessageLoop() {
    // Clear the frame id so the next wake up call can be scheduled.
    frameId = void 0;
    // If the queue is empty, there is nothing else to do.
    if (dispatchQueue.empty) {
        return;
    }
    // Add a null sentinel value to the end of the queue. The queue
    // will only be processed up to the first null value. This means
    // that messages posted during this cycle will execute on the next
    // cycle of the loop. If the last value in the array is null, it
    // means that an exception was thrown by a message handler and the
    // loop had to be restarted.
    if (dispatchQueue.back !== null) {
        dispatchQueue.push(null);
    }
    // The message dispatch loop. If the dispatcher is the null sentinel,
    // the processing of the current block of messages is complete and
    // another loop is scheduled. Otherwise, the pending message is
    // dispatched to the message handler.
    while (!dispatchQueue.empty) {
        var handler = dispatchQueue.pop();
        if (handler === null) {
            wakeUpMessageLoop();
            return;
        }
        dispatchMessage(dispatcherMap.get(handler), handler);
    }
}
/**
 * Safely process the pending handler message.
 *
 * If the message handler throws an exception, the message loop will
 * be restarted and the exception will be rethrown.
 */
function dispatchMessage(dispatcher, handler) {
    try {
        dispatcher.sendPendingMessage(handler);
    }
    catch (ex) {
        wakeUpMessageLoop();
        throw ex;
    }
}
/**
 * An internal class which manages message dispatching for a handler.
 */
var MessageDispatcher = (function () {
    function MessageDispatcher() {
        this._filters = null;
        this._messages = null;
    }
    /**
     * Send a message to the handler immediately.
     *
     * The message will first be sent through installed filters.
     */
    MessageDispatcher.prototype.sendMessage = function (handler, msg) {
        if (!this._filterMessage(handler, msg)) {
            handler.processMessage(msg);
        }
    };
    /**
     * Post a message for delivery in the future.
     *
     * The message will first be compressed if possible.
     */
    MessageDispatcher.prototype.postMessage = function (handler, msg) {
        if (!this._compressMessage(handler, msg)) {
            this._enqueueMessage(handler, msg);
        }
    };
    /**
     * Test whether the dispatcher has messages pending delivery.
     */
    MessageDispatcher.prototype.hasPendingMessages = function () {
        return !!(this._messages && !this._messages.empty);
    };
    /**
     * Send the first pending message to the message handler.
     */
    MessageDispatcher.prototype.sendPendingMessage = function (handler) {
        if (this._messages && !this._messages.empty) {
            this.sendMessage(handler, this._messages.pop());
        }
    };
    /**
     * Install a message filter for the dispatcher.
     */
    MessageDispatcher.prototype.installMessageFilter = function (filter) {
        this._filters = { next: this._filters, filter: filter };
    };
    /**
     * Remove all occurrences of a message filter from the dispatcher.
     */
    MessageDispatcher.prototype.removeMessageFilter = function (filter) {
        var link = this._filters;
        var prev = null;
        while (link !== null) {
            if (link.filter === filter) {
                link.filter = null;
            }
            else if (prev === null) {
                this._filters = link;
                prev = link;
            }
            else {
                prev.next = link;
                prev = link;
            }
            link = link.next;
        }
        if (!prev) {
            this._filters = null;
        }
        else {
            prev.next = null;
        }
    };
    /**
     * Clear all messages and filters from the dispatcher.
     */
    MessageDispatcher.prototype.clear = function () {
        if (this._messages) {
            this._messages.clear();
        }
        for (var link = this._filters; link !== null; link = link.next) {
            link.filter = null;
        }
        this._filters = null;
    };
    /**
     * Run the installed message filters for the handler.
     *
     * Returns `true` if the message was filtered, `false` otherwise.
     */
    MessageDispatcher.prototype._filterMessage = function (handler, msg) {
        for (var link = this._filters; link !== null; link = link.next) {
            if (link.filter && link.filter.filterMessage(handler, msg)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Compress the mssage for the given handler.
     *
     * Returns `true` if the message was compressed, `false` otherwise.
     */
    MessageDispatcher.prototype._compressMessage = function (handler, msg) {
        if (!handler.compressMessage) {
            return false;
        }
        if (!this._messages || this._messages.empty) {
            return false;
        }
        return handler.compressMessage(msg, this._messages);
    };
    /**
     * Enqueue the message for future delivery to the handler.
     */
    MessageDispatcher.prototype._enqueueMessage = function (handler, msg) {
        (this._messages || (this._messages = new phosphor_queue_1.Queue())).push(msg);
        dispatchQueue.push(handler);
        wakeUpMessageLoop();
    };
    return MessageDispatcher;
})();

},{"phosphor-queue":15}],14:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var phosphor_signaling_1 = require('phosphor-signaling');
/**
 * A property descriptor for a property on an object.
 *
 * Properties descriptors can be used to expose a rich interface for an
 * object which encapsulates value creation, coercion, and notification.
 * They can also be used to extend the state of an object with semantic
 * data from another class.
 *
 * #### Example
 * ```typescript
 * import { Property } from 'phosphor-properties';
 *
 * class MyClass {
 *
 *   static myValueProperty = new Property<MyClass, number>({
 *      value: 0,
 *      coerce: (owner, value) => Math.max(0, value),
 *      changed: (owner, oldValue, newValue) => { console.log(newValue); },
 *   });
 *
 *   get myValue(): number {
 *     return MyClass.myValueProperty.get(this);
 *   }
 *
 *   set myValue(value: number) {
 *     MyClass.myValueProperty.set(this, value);
 *   }
 * }
 * ```
 */
var Property = (function () {
    /**
     * Construct a new property descriptor.
     *
     * @param options - The options for initializing the property.
     */
    function Property(options) {
        if (options === void 0) { options = {}; }
        this._pid = nextPID();
        this._value = options.value;
        this._create = options.create;
        this._coerce = options.coerce;
        this._compare = options.compare;
        this._changed = options.changed;
    }
    /**
     * Get a bound [[changedSignal]] for a given property owner.
     *
     * @param owner - The object to bind to the changed signal.
     *
     * @returns The bound changed signal for the owner.
     *
     * #### Notes
     * This signal will be emitted whenever any property value
     * for the specified owner is changed.
     */
    Property.getChanged = function (owner) {
        return Property.changedSignal.bind(owner);
    };
    /**
     * Get the current value of the property for a given owner.
     *
     * @param owner - The property owner of interest.
     *
     * @returns The current value of the property.
     *
     * #### Notes
     * If the value has not yet been set, the default value will be
     * computed and assigned as the current value of the property.
     */
    Property.prototype.get = function (owner) {
        var value;
        var hash = lookupHash(owner);
        if (this._pid in hash) {
            value = hash[this._pid];
        }
        else {
            value = hash[this._pid] = this._createValue(owner);
        }
        return value;
    };
    /**
     * Set the current value of the property for a given owner.
     *
     * @param owner - The property owner of interest.
     *
     * @param value - The value for the property.
     *
     * #### Notes
     * If this operation causes the property value to change, the
     * [[changedSignal]] will be emitted with the owner as sender.
     *
     * If the value has not yet been set, the default value will be
     * computed and used as the previous value for the comparison.
     */
    Property.prototype.set = function (owner, value) {
        var oldValue;
        var hash = lookupHash(owner);
        if (this._pid in hash) {
            oldValue = hash[this._pid];
        }
        else {
            oldValue = hash[this._pid] = this._createValue(owner);
        }
        var newValue = this._coerceValue(owner, value);
        this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
    };
    /**
     * Explicitly coerce the current property value for a given owner.
     *
     * @param owner - The property owner of interest.
     *
     * #### Notes
     * If this operation causes the property value to change, the
     * [[changedSignal]] will be emitted with the owner as sender.
     *
     * If the value has not yet been set, the default value will be
     * computed and used as the previous value for the comparison.
     */
    Property.prototype.coerce = function (owner) {
        var oldValue;
        var hash = lookupHash(owner);
        if (this._pid in hash) {
            oldValue = hash[this._pid];
        }
        else {
            oldValue = hash[this._pid] = this._createValue(owner);
        }
        var newValue = this._coerceValue(owner, oldValue);
        this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
    };
    /**
     * Get or create the default value for the given owner.
     */
    Property.prototype._createValue = function (owner) {
        var create = this._create;
        return create ? create(owner) : this._value;
    };
    /**
     * Coerce the value for the given owner.
     */
    Property.prototype._coerceValue = function (owner, value) {
        var coerce = this._coerce;
        return coerce ? coerce(owner, value) : value;
    };
    /**
     * Compare the old value and new value for equality.
     */
    Property.prototype._compareValue = function (oldValue, newValue) {
        var compare = this._compare;
        return compare ? compare(oldValue, newValue) : oldValue === newValue;
    };
    /**
     * Run the change notification if the given values are different.
     */
    Property.prototype._maybeNotify = function (owner, oldValue, newValue) {
        if (!this._compareValue(oldValue, newValue)) {
            var changed = this._changed;
            if (changed)
                changed(owner, oldValue, newValue);
            Property.getChanged(owner).emit(changedArgs(this, oldValue, newValue));
        }
    };
    /**
     * A signal emitted when a property value changes.
     *
     * #### Notes
     * This is an attached signal which will be emitted using the
     * owner of the property value as the sender.
     *
     * **See also:** [[getChanged]]
     */
    Property.changedSignal = new phosphor_signaling_1.Signal();
    return Property;
})();
exports.Property = Property;
/**
 * Clear the stored property data for the given property owner.
 *
 * @param owner - The property owner of interest.
 *
 * #### Notes
 * This will clear all property values for the owner, but it will
 * **not** emit any change notifications.
 */
function clearPropertyData(owner) {
    ownerData.delete(owner);
}
exports.clearPropertyData = clearPropertyData;
/**
 * A weak mapping of property owner to property hash.
 */
var ownerData = new WeakMap();
/**
 * A function which computes successive unique property ids.
 */
var nextPID = (function () { var id = 0; return function () { return 'pid-' + id++; }; })();
/**
 * Create the changed args for the given property and values.
 */
function changedArgs(property, oldValue, newValue) {
    return { property: property, oldValue: oldValue, newValue: newValue };
}
/**
 * Lookup the data hash for the property owner.
 *
 * This will create the hash if one does not already exist.
 */
function lookupHash(owner) {
    var hash = ownerData.get(owner);
    if (hash !== void 0)
        return hash;
    hash = Object.create(null);
    ownerData.set(owner, hash);
    return hash;
}

},{"phosphor-signaling":16}],15:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * A generic FIFO queue data structure.
 *
 * #### Notes
 * This queue is implemented internally using a singly linked list and
 * can grow to arbitrary size.
 *
 * #### Example
 * ```typescript
 * var q = new Queue<number>([0, 1, 2]);
 * q.size;      // 3
 * q.empty;     // false
 * q.pop();     // 0
 * q.pop();     // 1
 * q.push(42);  // undefined
 * q.size;      // 2
 * q.pop();     // 2
 * q.pop();     // 42
 * q.pop();     // undefined
 * q.size;      // 0
 * q.empty;     // true
 * ```
 */
var Queue = (function () {
    /**
     * Construct a new queue.
     *
     * @param items - The initial items for the queue.
     */
    function Queue(items) {
        var _this = this;
        this._size = 0;
        this._front = null;
        this._back = null;
        if (items)
            items.forEach(function (item) { return _this.push(item); });
    }
    Object.defineProperty(Queue.prototype, "size", {
        /**
         * Get the number of elements in the queue.
         *
         * #### Notes
         * This has `O(1)` complexity.
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "empty", {
        /**
         * Test whether the queue is empty.
         *
         * #### Notes
         * This has `O(1)` complexity.
         */
        get: function () {
            return this._size === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "front", {
        /**
         * Get the value at the front of the queue.
         *
         * #### Notes
         * This has `O(1)` complexity.
         *
         * If the queue is empty, this value will be `undefined`.
         */
        get: function () {
            return this._front !== null ? this._front.value : void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "back", {
        /**
         * Get the value at the back of the queue.
         *
         * #### Notes
         * This has `O(1)` complexity.
         *
         * If the queue is empty, this value will be `undefined`.
         */
        get: function () {
            return this._back !== null ? this._back.value : void 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Push a value onto the back of the queue.
     *
     * @param value - The value to add to the queue.
     *
     * #### Notes
     * This has `O(1)` complexity.
     */
    Queue.prototype.push = function (value) {
        var link = { next: null, value: value };
        if (this._back === null) {
            this._front = link;
            this._back = link;
        }
        else {
            this._back.next = link;
            this._back = link;
        }
        this._size++;
    };
    /**
     * Pop and return the value at the front of the queue.
     *
     * @returns The value at the front of the queue.
     *
     * #### Notes
     * This has `O(1)` complexity.
     *
     * If the queue is empty, the return value will be `undefined`.
     */
    Queue.prototype.pop = function () {
        var link = this._front;
        if (link === null) {
            return void 0;
        }
        if (link.next === null) {
            this._front = null;
            this._back = null;
        }
        else {
            this._front = link.next;
        }
        this._size--;
        return link.value;
    };
    /**
     * Remove the first occurrence of a value from the queue.
     *
     * @param value - The value to remove from the queue.
     *
     * @returns `true` on success, `false` otherwise.
     *
     * #### Notes
     * This has `O(N)` complexity.
     */
    Queue.prototype.remove = function (value) {
        var link = this._front;
        var prev = null;
        while (link !== null) {
            if (link.value === value) {
                if (prev === null) {
                    this._front = link.next;
                }
                else {
                    prev.next = link.next;
                }
                if (link.next === null) {
                    this._back = prev;
                }
                this._size--;
                return true;
            }
            prev = link;
            link = link.next;
        }
        return false;
    };
    /**
     * Remove all occurrences of a value from the queue.
     *
     * @param value - The value to remove from the queue.
     *
     * @returns The number of occurrences removed.
     *
     * #### Notes
     * This has `O(N)` complexity.
     */
    Queue.prototype.removeAll = function (value) {
        var count = 0;
        var link = this._front;
        var prev = null;
        while (link !== null) {
            if (link.value === value) {
                count++;
                this._size--;
            }
            else if (prev === null) {
                this._front = link;
                prev = link;
            }
            else {
                prev.next = link;
                prev = link;
            }
            link = link.next;
        }
        if (!prev) {
            this._front = null;
            this._back = null;
        }
        else {
            prev.next = null;
            this._back = prev;
        }
        return count;
    };
    /**
     * Remove all values from the queue.
     *
     * #### Notes
     * This has `O(1)` complexity.
     */
    Queue.prototype.clear = function () {
        this._size = 0;
        this._front = null;
        this._back = null;
    };
    /**
     * Create an array from the values in the queue.
     *
     * @returns An array of all values in the queue.
     *
     * #### Notes
     * This has `O(N)` complexity.
     */
    Queue.prototype.toArray = function () {
        var result = new Array(this._size);
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            result[i] = link.value;
        }
        return result;
    };
    /**
     * Test whether any value in the queue passes a predicate function.
     *
     * @param pred - The predicate to apply to the values.
     *
     * @returns `true` if any value in the queue passes the predicate,
     *   or `false` otherwise.
     *
     * #### Notes
     * This has `O(N)` complexity.
     *
     * It is **not** safe for the predicate to modify the queue while
     * iterating.
     */
    Queue.prototype.some = function (pred) {
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            if (pred(link.value, i))
                return true;
        }
        return false;
    };
    /**
     * Test whether all values in the queue pass a predicate function.
     *
     * @param pred - The predicate to apply to the values.
     *
     * @returns `true` if all values in the queue pass the predicate,
     *   or `false` otherwise.
     *
     * #### Notes
     * This has `O(N)` complexity.
     *
     * It is **not** safe for the predicate to modify the queue while
     * iterating.
     */
    Queue.prototype.every = function (pred) {
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            if (!pred(link.value, i))
                return false;
        }
        return true;
    };
    /**
     * Create an array of the values which pass a predicate function.
     *
     * @param pred - The predicate to apply to the values.
     *
     * @returns The array of values which pass the predicate.
     *
     * #### Notes
     * This has `O(N)` complexity.
     *
     * It is **not** safe for the predicate to modify the queue while
     * iterating.
     */
    Queue.prototype.filter = function (pred) {
        var result = [];
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            if (pred(link.value, i))
                result.push(link.value);
        }
        return result;
    };
    /**
     * Create an array of mapped values for the values in the queue.
     *
     * @param callback - The map function to apply to the values.
     *
     * @returns The array of values returned by the map function.
     *
     * #### Notes
     * This has `O(N)` complexity.
     *
     * It is **not** safe for the callback to modify the queue while
     * iterating.
     */
    Queue.prototype.map = function (callback) {
        var result = new Array(this._size);
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            result[i] = callback(link.value, i);
        }
        return result;
    };
    /**
     * Execute a callback for each value in the queue.
     *
     * @param callback - The function to apply to the values.
     *
     * @returns The first value returned by the callback which is not
     *   `undefined`.
     *
     * #### Notes
     * This has `O(N)` complexity.
     *
     * Iteration will terminate immediately if the callback returns any
     * value other than `undefined`.
     *
     * It is **not** safe for the callback to modify the queue while
     * iterating.
     */
    Queue.prototype.forEach = function (callback) {
        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
            var result = callback(link.value, i);
            if (result !== void 0)
                return result;
        }
        return void 0;
    };
    return Queue;
})();
exports.Queue = Queue;

},{}],16:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * An object used for type-safe inter-object communication.
 *
 * Signals provide a type-safe implementation of the publish-subscribe
 * pattern. An object (publisher) declares which signals it will emit,
 * and consumers connect callbacks (subscribers) to those signals. The
 * subscribers are invoked whenever the publisher emits the signal.
 *
 * A `Signal` object must be bound to a sender in order to be useful.
 * A common pattern is to declare a `Signal` object as a static class
 * member, along with a convenience getter which binds the signal to
 * the `this` instance on-demand.
 *
 * #### Example
 * ```typescript
 * import { ISignal, Signal } from 'phosphor-signaling';
 *
 * class MyClass {
 *
 *   static valueChangedSignal = new Signal<MyClass, number>();
 *
 *   constructor(name: string) {
 *     this._name = name;
 *   }
 *
 *   get valueChanged(): ISignal<MyClass, number> {
 *     return MyClass.valueChangedSignal.bind(this);
 *   }
 *
 *   get name(): string {
 *     return this._name;
 *   }
 *
 *   get value(): number {
 *     return this._value;
 *   }
 *
 *   set value(value: number) {
 *     if (value !== this._value) {
 *       this._value = value;
 *       this.valueChanged.emit(value);
 *     }
 *   }
 *
 *   private _name: string;
 *   private _value = 0;
 * }
 *
 * function logger(sender: MyClass, value: number): void {
 *   console.log(sender.name, value);
 * }
 *
 * var m1 = new MyClass('foo');
 * var m2 = new MyClass('bar');
 *
 * m1.valueChanged.connect(logger);
 * m2.valueChanged.connect(logger);
 *
 * m1.value = 42;  // logs: foo 42
 * m2.value = 17;  // logs: bar 17
 * ```
 */
var Signal = (function () {
    function Signal() {
    }
    /**
     * Bind the signal to a specific sender.
     *
     * @param sender - The sender object to bind to the signal.
     *
     * @returns The bound signal object which can be used for connecting,
     *   disconnecting, and emitting the signal.
     */
    Signal.prototype.bind = function (sender) {
        return new BoundSignal(this, sender);
    };
    return Signal;
})();
exports.Signal = Signal;
/**
 * Remove all connections where the given object is the sender.
 *
 * @param sender - The sender object of interest.
 *
 * #### Example
 * ```typescript
 * disconnectSender(someObject);
 * ```
 */
function disconnectSender(sender) {
    var list = senderMap.get(sender);
    if (!list) {
        return;
    }
    var conn = list.first;
    while (conn !== null) {
        removeFromSendersList(conn);
        conn.callback = null;
        conn.thisArg = null;
        conn = conn.nextReceiver;
    }
    senderMap.delete(sender);
}
exports.disconnectSender = disconnectSender;
/**
 * Remove all connections where the given object is the receiver.
 *
 * @param receiver - The receiver object of interest.
 *
 * #### Notes
 * If a `thisArg` is provided when connecting a signal, that object
 * is considered the receiver. Otherwise, the `callback` is used as
 * the receiver.
 *
 * #### Example
 * ```typescript
 * // disconnect a regular object receiver
 * disconnectReceiver(myObject);
 *
 * // disconnect a plain callback receiver
 * disconnectReceiver(myCallback);
 * ```
 */
function disconnectReceiver(receiver) {
    var conn = receiverMap.get(receiver);
    if (!conn) {
        return;
    }
    while (conn !== null) {
        var next = conn.nextSender;
        conn.callback = null;
        conn.thisArg = null;
        conn.prevSender = null;
        conn.nextSender = null;
        conn = next;
    }
    receiverMap.delete(receiver);
}
exports.disconnectReceiver = disconnectReceiver;
/**
 * Clear all signal data associated with the given object.
 *
 * @param obj - The object for which the signal data should be cleared.
 *
 * #### Notes
 * This removes all signal connections where the object is used as
 * either the sender or the receiver.
 *
 * #### Example
 * ```typescript
 * clearSignalData(someObject);
 * ```
 */
function clearSignalData(obj) {
    disconnectSender(obj);
    disconnectReceiver(obj);
}
exports.clearSignalData = clearSignalData;
/**
 * A concrete implementation of ISignal.
 */
var BoundSignal = (function () {
    /**
     * Construct a new bound signal.
     */
    function BoundSignal(signal, sender) {
        this._signal = signal;
        this._sender = sender;
    }
    /**
     * Connect a callback to the signal.
     */
    BoundSignal.prototype.connect = function (callback, thisArg) {
        return connect(this._sender, this._signal, callback, thisArg);
    };
    /**
     * Disconnect a callback from the signal.
     */
    BoundSignal.prototype.disconnect = function (callback, thisArg) {
        return disconnect(this._sender, this._signal, callback, thisArg);
    };
    /**
     * Emit the signal and invoke the connected callbacks.
     */
    BoundSignal.prototype.emit = function (args) {
        emit(this._sender, this._signal, args);
    };
    return BoundSignal;
})();
/**
 * A struct which holds connection data.
 */
var Connection = (function () {
    function Connection() {
        /**
         * The signal for the connection.
         */
        this.signal = null;
        /**
         * The callback connected to the signal.
         */
        this.callback = null;
        /**
         * The `this` context for the callback.
         */
        this.thisArg = null;
        /**
         * The next connection in the singly linked receivers list.
         */
        this.nextReceiver = null;
        /**
         * The next connection in the doubly linked senders list.
         */
        this.nextSender = null;
        /**
         * The previous connection in the doubly linked senders list.
         */
        this.prevSender = null;
    }
    return Connection;
})();
/**
 * The list of receiver connections for a specific sender.
 */
var ConnectionList = (function () {
    function ConnectionList() {
        /**
         * The ref count for the list.
         */
        this.refs = 0;
        /**
         * The first connection in the list.
         */
        this.first = null;
        /**
         * The last connection in the list.
         */
        this.last = null;
    }
    return ConnectionList;
})();
/**
 * A mapping of sender object to its receiver connection list.
 */
var senderMap = new WeakMap();
/**
 * A mapping of receiver object to its sender connection list.
 */
var receiverMap = new WeakMap();
/**
 * Create a connection between a sender, signal, and callback.
 */
function connect(sender, signal, callback, thisArg) {
    // Coerce a `null` thisArg to `undefined`.
    thisArg = thisArg || void 0;
    // Search for an equivalent connection and bail if one exists.
    var list = senderMap.get(sender);
    if (list && findConnection(list, signal, callback, thisArg)) {
        return false;
    }
    // Create a new connection.
    var conn = new Connection();
    conn.signal = signal;
    conn.callback = callback;
    conn.thisArg = thisArg;
    // Add the connection to the receivers list.
    if (!list) {
        list = new ConnectionList();
        list.first = conn;
        list.last = conn;
        senderMap.set(sender, list);
    }
    else if (list.last === null) {
        list.first = conn;
        list.last = conn;
    }
    else {
        list.last.nextReceiver = conn;
        list.last = conn;
    }
    // Add the connection to the senders list.
    var receiver = thisArg || callback;
    var head = receiverMap.get(receiver);
    if (head) {
        head.prevSender = conn;
        conn.nextSender = head;
    }
    receiverMap.set(receiver, conn);
    return true;
}
/**
 * Break the connection between a sender, signal, and callback.
 */
function disconnect(sender, signal, callback, thisArg) {
    // Coerce a `null` thisArg to `undefined`.
    thisArg = thisArg || void 0;
    // Search for an equivalent connection and bail if none exists.
    var list = senderMap.get(sender);
    if (!list) {
        return false;
    }
    var conn = findConnection(list, signal, callback, thisArg);
    if (!conn) {
        return false;
    }
    // Remove the connection from the senders list. It will be removed
    // from the receivers list the next time the signal is emitted.
    removeFromSendersList(conn);
    // Clear the connection data so it becomes a dead connection.
    conn.callback = null;
    conn.thisArg = null;
    return true;
}
/**
 * Emit a signal and invoke the connected callbacks.
 */
function emit(sender, signal, args) {
    var list = senderMap.get(sender);
    if (!list) {
        return;
    }
    list.refs++;
    try {
        var dirty = invokeList(list, sender, signal, args);
    }
    finally {
        list.refs--;
    }
    if (dirty && list.refs === 0) {
        cleanList(list);
    }
}
/**
 * Find a matching connection in the given connection list.
 *
 * Returns `null` if no matching connection is found.
 */
function findConnection(list, signal, callback, thisArg) {
    var conn = list.first;
    while (conn !== null) {
        if (conn.signal === signal &&
            conn.callback === callback &&
            conn.thisArg === thisArg) {
            return conn;
        }
        conn = conn.nextReceiver;
    }
    return null;
}
/**
 * Invoke the callbacks for the matching signals in the list.
 *
 * Connections added during dispatch will not be invoked. This returns
 * `true` if there are dead connections in the list, `false` otherwise.
 */
function invokeList(list, sender, signal, args) {
    var dirty = false;
    var last = list.last;
    var conn = list.first;
    while (conn !== null) {
        if (!conn.callback) {
            dirty = true;
        }
        else if (conn.signal === signal) {
            conn.callback.call(conn.thisArg, sender, args);
        }
        if (conn === last) {
            break;
        }
        conn = conn.nextReceiver;
    }
    return dirty;
}
/**
 * Remove the dead connections from the given connection list.
 */
function cleanList(list) {
    var prev;
    var conn = list.first;
    while (conn !== null) {
        var next = conn.nextReceiver;
        if (!conn.callback) {
            conn.nextReceiver = null;
        }
        else if (!prev) {
            list.first = conn;
            prev = conn;
        }
        else {
            prev.nextReceiver = conn;
            prev = conn;
        }
        conn = next;
    }
    if (!prev) {
        list.first = null;
        list.last = null;
    }
    else {
        prev.nextReceiver = null;
        list.last = prev;
    }
}
/**
 * Remove a connection from the doubly linked list of senders.
 */
function removeFromSendersList(conn) {
    var receiver = conn.thisArg || conn.callback;
    var prev = conn.prevSender;
    var next = conn.nextSender;
    if (prev === null && next === null) {
        receiverMap.delete(receiver);
    }
    else if (prev === null) {
        receiverMap.set(receiver, next);
        next.prevSender = null;
    }
    else if (next === null) {
        prev.nextSender = null;
    }
    else {
        prev.nextSender = next;
        next.prevSender = prev;
    }
    conn.prevSender = null;
    conn.nextSender = null;
}

},{}],17:[function(require,module,exports){
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-Widget {\n  box-sizing: border-box;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  overflow: hidden;\n  cursor: default;\n}\n.p-Widget.p-mod-hidden {\n  display: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-widget\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],18:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
require('./index.css');
/**
 * `p-Widget`: the class name added to Widget instances.
 */
exports.WIDGET_CLASS = 'p-Widget';
/**
 * `p-mod-hidden`: the class name added to hidden widgets.
 */
exports.HIDDEN_CLASS = 'p-mod-hidden';
/**
 * A singleton `'update-request'` message.
 *
 * #### Notes
 * This message can be dispatched to supporting widgets in order to
 * update their content. Not all widgets will respond to messages of
 * this type.
 *
 * This message is typically used to update the position and size of
 * a widget's children, or to update a widget's content to reflect the
 * current state of the widget.
 *
 * Messages of this type are compressed by default.
 *
 * **See also:** [[update]], [[onUpdateRequest]]
 */
exports.MSG_UPDATE_REQUEST = new phosphor_messaging_1.Message('update-request');
/**
 * A singleton `'layout-request'` message.
 *
 * #### Notes
 * This message can be dispatched to supporting widgets in order to
 * update their layout. Not all widgets will respond to messages of
 * this type.
 *
 * This message is typically used to update the size contraints of
 * a widget and to update the position and size of its children.
 *
 * Messages of this type are compressed by default.
 *
 * **See also:** [[onLayoutRequest]]
 */
exports.MSG_LAYOUT_REQUEST = new phosphor_messaging_1.Message('layout-request');
/**
 * A singleton `'close-request'` message.
 *
 * #### Notes
 * This message should be dispatched to a widget when it should close
 * and remove itself from the widget hierarchy.
 *
 * Messages of this type are compressed by default.
 *
 * **See also:** [[close]], [[onCloseRequest]]
 */
exports.MSG_CLOSE_REQUEST = new phosphor_messaging_1.Message('close-request');
/**
 * A singleton `'after-show'` message.
 *
 * #### Notes
 * This message is sent to a widget when it becomes visible.
 *
 * This message is **not** sent when the widget is attached.
 *
 * **See also:** [[isVisible]], [[onAfterShow]]
 */
exports.MSG_AFTER_SHOW = new phosphor_messaging_1.Message('after-show');
/**
 * A singleton `'before-hide'` message.
 *
 * #### Notes
 * This message is sent to a widget when it becomes not-visible.
 *
 * This message is **not** sent when the widget is detached.
 *
 * **See also:** [[isVisible]], [[onBeforeHide]]
 */
exports.MSG_BEFORE_HIDE = new phosphor_messaging_1.Message('before-hide');
/**
 * A singleton `'after-attach'` message.
 *
 * #### Notes
 * This message is sent to a widget after it is attached to the DOM.
 *
 * **See also:** [[isAttached]], [[onAfterAttach]]
 */
exports.MSG_AFTER_ATTACH = new phosphor_messaging_1.Message('after-attach');
/**
 * A singleton `'before-detach'` message.
 *
 * #### Notes
 * This message is sent to a widget before it is detached from the DOM.
 *
 * **See also:** [[isAttached]], [[onBeforeDetach]]
 */
exports.MSG_BEFORE_DETACH = new phosphor_messaging_1.Message('before-detach');
/**
 * The base class of the Phosphor widget hierarchy.
 *
 * #### Notes
 * This class will typically be subclassed in order to create a useful
 * widget. However, it can be used by itself to host foreign content
 * such as a React or Bootstrap component. Simply instantiate an empty
 * widget and add the content directly to its [[node]]. The widget and
 * its content can then be embedded within a Phosphor widget hierarchy.
 */
var Widget = (function (_super) {
    __extends(Widget, _super);
    /**
     * Construct a new widget.
     *
     * #### Notes
     * The [[WIDGET_CLASS]] is added to the widget during construction.
     */
    function Widget() {
        _super.call(this);
        this._flags = 0;
        this._parent = null;
        this._children = [];
        this._box = null;
        this._rect = null;
        this._limits = null;
        this.addClass(exports.WIDGET_CLASS);
    }
    /**
     * Dispose of the widget and its descendant widgets.
     *
     * #### Notes
     * It is generally unsafe to use the widget after it has been
     * disposed.
     *
     * If this method is called more than once, all calls made after
     * the first will be a no-op.
     */
    Widget.prototype.dispose = function () {
        if (this.isDisposed) {
            return;
        }
        this._flags |= WidgetFlag.IsDisposed;
        this.disposed.emit(void 0);
        if (this._parent) {
            this._parent.removeChild(this);
        }
        else if (this.isAttached) {
            detachWidget(this);
        }
        while (this._children.length > 0) {
            var child = this._children.pop();
            child._parent = null;
            child.dispose();
        }
        phosphor_signaling_1.clearSignalData(this);
        phosphor_messaging_1.clearMessageData(this);
        phosphor_properties_1.clearPropertyData(this);
    };
    Object.defineProperty(Widget.prototype, "disposed", {
        /**
         * A signal emitted when the widget is disposed.
         *
         * #### Notes
         * This is a pure delegate to the [[disposedSignal]].
         */
        get: function () {
            return Widget.disposedSignal.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "isAttached", {
        /**
         * Test whether the widget's node is attached to the DOM.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         *
         * **See also:** [[attachWidget]], [[detachWidget]]
         */
        get: function () {
            return (this._flags & WidgetFlag.IsAttached) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "isDisposed", {
        /**
         * Test whether the widget has been disposed.
         *
         * #### Notes
         * This is a read-only property which is always safe to access.
         *
         * **See also:** [[disposed]]
         */
        get: function () {
            return (this._flags & WidgetFlag.IsDisposed) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "isVisible", {
        /**
         * Test whether the widget is visible.
         *
         * #### Notes
         * A widget is visible when it is attached to the DOM, is not
         * explicitly hidden, and has no explicitly hidden ancestors.
         *
         * This is a read-only property which is always safe to access.
         *
         * **See also:** [[hidden]]
         */
        get: function () {
            return (this._flags & WidgetFlag.IsVisible) !== 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "hidden", {
        /**
         * Get whether the widget is explicitly hidden.
         *
         * #### Notes
         * This is a pure delegate to the [[hiddenProperty]].
         *
         * **See also:** [[isVisible]]
         */
        get: function () {
            return Widget.hiddenProperty.get(this);
        },
        /**
         * Set whether the widget is explicitly hidden.
         *
         * #### Notes
         * This is a pure delegate to the [[hiddenProperty]].
         *
         * **See also:** [[isVisible]]
         */
        set: function (value) {
            Widget.hiddenProperty.set(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "boxSizing", {
        /**
         * Get the box sizing for the widget's DOM node.
         *
         * #### Notes
         * This value is computed once and then cached in order to avoid
         * excessive style recomputations. The cache can be cleared via
         * [[clearBoxSizing]].
         *
         * Layout widgets rely on this property when computing their layout.
         * If a layout widget's box sizing changes at runtime, the box sizing
         * cache should be cleared and the layout widget should be posted a
         *`'layout-request'` message.
         *
         * This is a read-only property.
         *
         * **See also:** [[clearBoxSizing]]
         */
        get: function () {
            if (this._box)
                return this._box;
            return this._box = Object.freeze(phosphor_domutil_1.boxSizing(this.node));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "sizeLimits", {
        /**
         * Get the size limits for the widget's DOM node.
         *
         * #### Notes
         * This value is computed once and then cached in order to avoid
         * excessive style recomputations. The cache can be cleared by
         * calling [[clearSizeLimits]].
         *
         * Layout widgets rely on this property of their child widgets when
         * computing the layout. If a child widget's size limits change at
         * runtime, the size limits should be cleared and the layout widget
         * should be posted a `'layout-request'` message.
         *
         * This is a read-only property.
         *
         * **See also:** [[setSizeLimits]], [[clearSizeLimits]]
         */
        get: function () {
            if (this._limits)
                return this._limits;
            return this._limits = Object.freeze(phosphor_domutil_1.sizeLimits(this.node));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "offsetRect", {
        /**
         * Get the current offset geometry rect for the widget.
         *
         * #### Notes
         * If the widget geometry has been set using [[setOffsetGeometry]],
         * those values will be used to populate the rect, and no data will
         * be read from the DOM. Otherwise, the offset geometry of the node
         * **will** be read from the DOM, which may cause a reflow.
         *
         * This is a read-only property.
         *
         * **See also:** [[setOffsetGeometry]], [[clearOffsetGeometry]]
         */
        get: function () {
            if (this._rect)
                return cloneOffsetRect(this._rect);
            return getOffsetRect(this.node);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "parent", {
        /**
         * Get the parent of the widget.
         *
         * #### Notes
         * This will be `null` if the widget does not have a parent.
         */
        get: function () {
            return this._parent;
        },
        /**
         * Set the parent of the widget.
         *
         * @throws Will throw an error if the widget is the parent.
         *
         * #### Notes
         * If the specified parent is the current parent, this is a no-op.
         *
         * If the specified parent is `null`, this is equivalent to the
         * expression `widget.parent.removeChild(widget)`, otherwise it
         * is equivalent to the expression `parent.addChild(widget)`.
         *
         * **See also:** [[addChild]], [[insertChild]], [[removeChild]]
         */
        set: function (parent) {
            if (parent && parent !== this._parent) {
                parent.addChild(this);
            }
            else if (!parent && this._parent) {
                this._parent.removeChild(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "children", {
        /**
         * Get a shallow copy of the array of child widgets.
         *
         * #### Notes
         * When only iterating over the children, it can be faster to use
         * the child query methods, which do not perform a copy.
         *
         * **See also:** [[childCount]], [[childAt]]
         */
        get: function () {
            return this._children.slice();
        },
        /**
         * Set the children of the widget.
         *
         * #### Notes
         * This will clear the current child widgets and add the specified
         * child widgets. Depending on the desired outcome, it can be more
         * efficient to use one of the child manipulation methods.
         *
         * **See also:** [[addChild]], [[insertChild]], [[removeChild]]
         */
        set: function (children) {
            var _this = this;
            this.clearChildren();
            children.forEach(function (child) { return _this.addChild(child); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "childCount", {
        /**
         * Get the number of children of the widget.
         *
         * #### Notes
         * This is a read-only property.
         *
         * **See also:** [[children]], [[childAt]]
         */
        get: function () {
            return this._children.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the child widget at a specific index.
     *
     * @param index - The index of the child of interest.
     *
     * @returns The child widget at the specified index, or `undefined`
     *  if the index is out of range.
     *
     * **See also:** [[childCount]], [[childIndex]]
     */
    Widget.prototype.childAt = function (index) {
        return this._children[index | 0];
    };
    /**
     * Get the index of a specific child widget.
     *
     * @param child - The child widget of interest.
     *
     * @returns The index of the specified child widget, or `-1` if
     *   the widget is not a child of this widget.
     *
     * **See also:** [[childCount]], [[childAt]]
     */
    Widget.prototype.childIndex = function (child) {
        return this._children.indexOf(child);
    };
    /**
     * Add a child widget to the end of the widget's children.
     *
     * @param child - The child widget to add to this widget.
     *
     * @returns The new index of the child.
     *
     * @throws Will throw an error if a widget is added to itself.
     *
     * #### Notes
     * The child will be automatically removed from its current parent
     * before being added to this widget.
     *
     * **See also:** [[insertChild]], [[moveChild]]
     */
    Widget.prototype.addChild = function (child) {
        return this.insertChild(this._children.length, child);
    };
    /**
     * Insert a child widget at a specific index.
     *
     * @param index - The target index for the widget. This will be
     *   clamped to the bounds of the children.
     *
     * @param child - The child widget to insert into the widget.
     *
     * @returns The new index of the child.
     *
     * @throws Will throw an error if a widget is inserted into itself.
     *
     * #### Notes
     * The child will be automatically removed from its current parent
     * before being added to this widget.
     *
     * **See also:** [[addChild]], [[moveChild]]
     */
    Widget.prototype.insertChild = function (index, child) {
        if (child === this) {
            throw new Error('invalid child widget');
        }
        if (child._parent) {
            child._parent.removeChild(child);
        }
        else if (child.isAttached) {
            detachWidget(child);
        }
        child._parent = this;
        var i = arrays.insert(this._children, index, child);
        phosphor_messaging_1.sendMessage(this, new ChildMessage('child-added', child, -1, i));
        return i;
    };
    /**
     * Move a child widget from one index to another.
     *
     * @param fromIndex - The index of the child of interest.
     *
     * @param toIndex - The target index for the child.
     *
     * @returns 'true' if the child was moved, or `false` if either
     *   of the given indices are out of range.
     *
     * #### Notes
     * This method can be more efficient than re-inserting an existing
     * child, as some widgets may be able to optimize child moves and
     * avoid making unnecessary changes to the DOM.
     *
     * **See also:** [[addChild]], [[insertChild]]
     */
    Widget.prototype.moveChild = function (fromIndex, toIndex) {
        var i = fromIndex | 0;
        var j = toIndex | 0;
        if (!arrays.move(this._children, i, j)) {
            return false;
        }
        if (i !== j) {
            var child = this._children[j];
            phosphor_messaging_1.sendMessage(this, new ChildMessage('child-moved', child, i, j));
        }
        return true;
    };
    /**
     * Remove the child widget at a specific index.
     *
     * @param index - The index of the child of interest.
     *
     * @returns The removed child widget, or `undefined` if the index
     *   is out of range.
     *
     * **See also:** [[removeChild]], [[clearChildren]]
     */
    Widget.prototype.removeChildAt = function (index) {
        var i = index | 0;
        var child = arrays.removeAt(this._children, i);
        if (child) {
            child._parent = null;
            phosphor_messaging_1.sendMessage(this, new ChildMessage('child-removed', child, i, -1));
        }
        return child;
    };
    /**
     * Remove a specific child widget from this widget.
     *
     * @param child - The child widget of interest.
     *
     * @returns The index which the child occupied, or `-1` if the
     *   child is not a child of this widget.
     *
     * **See also:** [[removeChildAt]], [[clearChildren]]
     */
    Widget.prototype.removeChild = function (child) {
        var i = this.childIndex(child);
        if (i !== -1)
            this.removeChildAt(i);
        return i;
    };
    /**
     * Remove all child widgets from the widget.
     *
     * #### Notes
     * This will continue to remove children until the `childCount`
     * reaches zero. It is therefore possible to enter an infinite
     * loop if a message handler causes a child widget to be added
     * in response to one being removed.
     *
     * **See also:** [[removeChild]], [[removeChildAt]]
     */
    Widget.prototype.clearChildren = function () {
        while (this.childCount > 0) {
            this.removeChildAt(this.childCount - 1);
        }
    };
    /**
     * Dispatch an `'update-request'` message to the widget.
     *
     * @param immediate - Whether to dispatch the message immediately
     *   (`true`) or in the future (`false`). The default is `false`.
     *
     * **See also:** [[MSG_UPDATE_REQUEST]], [[onUpdateRequest]]
     */
    Widget.prototype.update = function (immediate) {
        if (immediate === void 0) { immediate = false; }
        if (immediate) {
            phosphor_messaging_1.sendMessage(this, exports.MSG_UPDATE_REQUEST);
        }
        else {
            phosphor_messaging_1.postMessage(this, exports.MSG_UPDATE_REQUEST);
        }
    };
    /**
     * Dispatch a `'close-request'` message to the widget.
     *
     * @param immediate - Whether to dispatch the message immediately
     *   (`true`) or in the future (`false`). The default is `false`.
     *
     * **See also:** [[MSG_CLOSE_REQUEST]], [[onCloseRequest]]
     */
    Widget.prototype.close = function (immediate) {
        if (immediate === void 0) { immediate = false; }
        if (immediate) {
            phosphor_messaging_1.sendMessage(this, exports.MSG_CLOSE_REQUEST);
        }
        else {
            phosphor_messaging_1.postMessage(this, exports.MSG_CLOSE_REQUEST);
        }
    };
    /**
     * Clear the cached box sizing for the widget.
     *
     * #### Notes
     * This method does **not** read from the DOM.
     *
     * This method does **not** write to the DOM.
     *
     * **See also:** [[boxSizing]]
     */
    Widget.prototype.clearBoxSizing = function () {
        this._box = null;
    };
    /**
     * Set the size limits for the widget's DOM node.
     *
     * @param minWidth - The min width for the widget, in pixels.
     *
     * @param minHeight - The min height for the widget, in pixels.
     *
     * @param maxWidth - The max width for the widget, in pixels.
     *
     * @param maxHeight - The max height for the widget, in pixels.
     *
     * #### Notes
     * This method does **not** read from the DOM.
     *
     * **See also:** [[sizeLimits]], [[clearSizeLimits]]
     */
    Widget.prototype.setSizeLimits = function (minWidth, minHeight, maxWidth, maxHeight) {
        var minW = Math.max(0, minWidth);
        var minH = Math.max(0, minHeight);
        var maxW = Math.max(0, maxWidth);
        var maxH = Math.max(0, maxHeight);
        this._limits = Object.freeze({
            minWidth: minW,
            minHeight: minH,
            maxWidth: maxW,
            maxHeight: maxH,
        });
        var style = this.node.style;
        style.minWidth = minW + 'px';
        style.minHeight = minH + 'px';
        style.maxWidth = (maxW === Infinity) ? '' : maxW + 'px';
        style.maxHeight = (maxH === Infinity) ? '' : maxH + 'px';
    };
    /**
     * Clear the cached size limits for the widget.
     *
     * #### Notes
     * This method does **not** read from the DOM.
     *
     * **See also:** [[sizeLimits]], [[setSizeLimits]]
     */
    Widget.prototype.clearSizeLimits = function () {
        this._limits = null;
        var style = this.node.style;
        style.minWidth = '';
        style.maxWidth = '';
        style.minHeight = '';
        style.maxHeight = '';
    };
    /**
     * Set the offset geometry for the widget.
     *
     * @param left - The offset left edge of the widget, in pixels.
     *
     * @param top - The offset top edge of the widget, in pixels.
     *
     * @param width - The offset width of the widget, in pixels.
     *
     * @param height - The offset height of the widget, in pixels.
     *
     * #### Notes
     * This method is only useful when using absolute positioning to set
     * the layout geometry of the widget. It will update the inline style
     * of the widget with the specified values. If the width or height is
     * different from the previous value, a [[ResizeMessage]] will be sent
     * to the widget.
     *
     * This method does **not** take into account the size limits of the
     * widget. It is assumed that the specified width and height do not
     * violate the size constraints of the widget.
     *
     * This method does **not** read any data from the DOM.
     *
     * Code which uses this method to layout a widget is responsible for
     * calling [[clearOffsetGeometry]] when it is finished managing the
     * widget.
     *
     * **See also:** [[offsetRect]], [[clearOffsetGeometry]]
     */
    Widget.prototype.setOffsetGeometry = function (left, top, width, height) {
        var rect = this._rect || (this._rect = makeOffsetRect());
        var style = this.node.style;
        var resized = false;
        if (top !== rect.top) {
            rect.top = top;
            style.top = top + 'px';
        }
        if (left !== rect.left) {
            rect.left = left;
            style.left = left + 'px';
        }
        if (width !== rect.width) {
            resized = true;
            rect.width = width;
            style.width = width + 'px';
        }
        if (height !== rect.height) {
            resized = true;
            rect.height = height;
            style.height = height + 'px';
        }
        if (resized)
            phosphor_messaging_1.sendMessage(this, new ResizeMessage(width, height));
    };
    /**
     * Clear the offset geometry for the widget.
     *
     * #### Notes
     * This method is only useful when using absolute positioning to set
     * the layout geometry of the widget. It will reset the inline style
     * of the widget and clear the stored offset geometry values.
     *
     * This method will **not** dispatch a [[ResizeMessage]].
     *
     * This method does **not** read any data from the DOM.
     *
     * This method should be called by the widget's layout manager when
     * it no longer manages the widget. It allows the widget to be added
     * to another layout panel without conflict.
     *
     * **See also:** [[offsetRect]], [[setOffsetGeometry]]
     */
    Widget.prototype.clearOffsetGeometry = function () {
        if (!this._rect) {
            return;
        }
        this._rect = null;
        var style = this.node.style;
        style.top = '';
        style.left = '';
        style.width = '';
        style.height = '';
    };
    /**
     * Process a message sent to the widget.
     *
     * @param msg - The message sent to the widget.
     *
     * #### Notes
     * Subclasses may reimplement this method as needed.
     */
    Widget.prototype.processMessage = function (msg) {
        switch (msg.type) {
            case 'resize':
                this.onResize(msg);
                break;
            case 'update-request':
                this.onUpdateRequest(msg);
                break;
            case 'layout-request':
                this.onLayoutRequest(msg);
                break;
            case 'child-added':
                this.onChildAdded(msg);
                break;
            case 'child-removed':
                this.onChildRemoved(msg);
                break;
            case 'child-moved':
                this.onChildMoved(msg);
                break;
            case 'after-show':
                this._flags |= WidgetFlag.IsVisible;
                this.onAfterShow(msg);
                sendToShown(this._children, msg);
                break;
            case 'before-hide':
                this.onBeforeHide(msg);
                sendToShown(this._children, msg);
                this._flags &= ~WidgetFlag.IsVisible;
                break;
            case 'after-attach':
                var visible = !this.hidden && (!this._parent || this._parent.isVisible);
                if (visible)
                    this._flags |= WidgetFlag.IsVisible;
                this._flags |= WidgetFlag.IsAttached;
                this.onAfterAttach(msg);
                sendToAll(this._children, msg);
                break;
            case 'before-detach':
                this.onBeforeDetach(msg);
                sendToAll(this._children, msg);
                this._flags &= ~WidgetFlag.IsVisible;
                this._flags &= ~WidgetFlag.IsAttached;
                break;
            case 'child-shown':
                this.onChildShown(msg);
                break;
            case 'child-hidden':
                this.onChildHidden(msg);
                break;
            case 'close-request':
                this.onCloseRequest(msg);
                break;
        }
    };
    /**
     * Compress a message posted to the widget.
     *
     * @param msg - The message posted to the widget.
     *
     * @param pending - The queue of pending messages for the widget.
     *
     * @returns `true` if the message was compressed and should be
     *   dropped, or `false` if the message should be enqueued for
     *   delivery as normal.
     *
     * #### Notes
     * The default implementation compresses the following messages:
     * `'update-request'`, `'layout-request'`, and `'close-request'`.
     *
     * Subclasses may reimplement this method as needed.
     */
    Widget.prototype.compressMessage = function (msg, pending) {
        switch (msg.type) {
            case 'update-request':
            case 'layout-request':
            case 'close-request':
                return pending.some(function (other) { return other.type === msg.type; });
        }
        return false;
    };
    /**
     * A message handler invoked on a `'child-added'` message.
     *
     * #### Notes
     * The default implementation adds the child node to the widget
     * node at the proper location and dispatches an `'after-attach'`
     * message if appropriate.
     *
     * Subclasses may reimplement this method to control how the child
     * node is added, but they must dispatch an `'after-attach'` message
     * if appropriate.
     */
    Widget.prototype.onChildAdded = function (msg) {
        var next = this.childAt(msg.currentIndex + 1);
        this.node.insertBefore(msg.child.node, next && next.node);
        if (this.isAttached)
            phosphor_messaging_1.sendMessage(msg.child, exports.MSG_AFTER_ATTACH);
    };
    /**
     * A message handler invoked on a `'child-removed'` message.
     *
     * #### Notes
     * The default implementation removes the child node from the widget
     * node and dispatches a `'before-detach'` message if appropriate.
     *
     * Subclasses may reimplement this method to control how the child
     * node is removed, but they must  dispatch a `'before-detach'`
     * message if appropriate.
     */
    Widget.prototype.onChildRemoved = function (msg) {
        if (this.isAttached)
            phosphor_messaging_1.sendMessage(msg.child, exports.MSG_BEFORE_DETACH);
        this.node.removeChild(msg.child.node);
    };
    /**
     * A message handler invoked on a `'child-moved'` message.
     *
     * #### Notes
     * The default implementation moves the child node to the proper
     * location in the widget node and dispatches a `'before-detach'`
     * and `'after-attach'` message if appropriate.
     *
     * Subclasses may reimplement this method to control how the child
     * node is moved, but they must dispatch a `'before-detach'` and
     * `'after-attach'` message if appropriate.
     */
    Widget.prototype.onChildMoved = function (msg) {
        if (this.isAttached)
            phosphor_messaging_1.sendMessage(msg.child, exports.MSG_BEFORE_DETACH);
        var next = this.childAt(msg.currentIndex + 1);
        this.node.insertBefore(msg.child.node, next && next.node);
        if (this.isAttached)
            phosphor_messaging_1.sendMessage(msg.child, exports.MSG_AFTER_ATTACH);
    };
    /**
     * A message handler invoked on a `'resize'` message.
     *
     * #### Notes
     * The default implementation of this handler sends an [[UnknownSize]]
     * resize message to each child. This ensures that the resize messages
     * propagate through all widgets in the hierarchy.
     *
     * Subclasses may reimplement this method as needed, but they must
     * dispatch `'resize'` messages to their children as appropriate.
     */
    Widget.prototype.onResize = function (msg) {
        sendToAll(this._children, ResizeMessage.UnknownSize);
    };
    /**
     * A message handler invoked on an `'update-request'` message.
     *
     * #### Notes
     * The default implementation of this handler sends an [[UnknownSize]]
     * resize message to each child. This ensures that the resize messages
     * propagate through all widgets in the hierarchy.
     *
     * Subclass may reimplement this method as needed, but they should
     * dispatch `'resize'` messages to their children as appropriate.
     *
     * **See also:** [[update]], [[MSG_UPDATE_REQUEST]]
     */
    Widget.prototype.onUpdateRequest = function (msg) {
        sendToAll(this._children, ResizeMessage.UnknownSize);
    };
    /**
     * A message handler invoked on a `'close-request'` message.
     *
     * #### Notes
     * The default implementation of this handler will unparent or detach
     * the widget as appropriate. Subclasses may reimplement this handler
     * for custom close behavior.
     *
     * **See also:** [[close]], [[MSG_CLOSE_REQUEST]]
     */
    Widget.prototype.onCloseRequest = function (msg) {
        if (this._parent) {
            this._parent.removeChild(this);
        }
        else if (this.isAttached) {
            detachWidget(this);
        }
    };
    /**
     * A message handler invoked on a `'layout-request'` message.
     *
     * The default implementation of this handler is a no-op.
     *
     * **See also:** [[MSG_LAYOUT_REQUEST]]
     */
    Widget.prototype.onLayoutRequest = function (msg) { };
    /**
     * A message handler invoked on an `'after-show'` message.
     *
     * The default implementation of this handler is a no-op.
     *
     * **See also:** [[MSG_AFTER_SHOW]]
     */
    Widget.prototype.onAfterShow = function (msg) { };
    /**
     * A message handler invoked on a `'before-hide'` message.
     *
     * The default implementation of this handler is a no-op.
     *
     * **See also:** [[MSG_BEFORE_HIDE]]
     */
    Widget.prototype.onBeforeHide = function (msg) { };
    /**
     * A message handler invoked on an `'after-attach'` message.
     *
     * **See also:** [[MSG_AFTER_ATTACH]]
     */
    Widget.prototype.onAfterAttach = function (msg) { };
    /**
     * A message handler invoked on a `'before-detach'` message.
     *
     * **See also:** [[MSG_BEFORE_DETACH]]
     */
    Widget.prototype.onBeforeDetach = function (msg) { };
    /**
     * A message handler invoked on a `'child-shown'` message.
     *
     * The default implementation of this handler is a no-op.
     */
    Widget.prototype.onChildShown = function (msg) { };
    /**
     * A message handler invoked on a `'child-hidden'` message.
     *
     * The default implementation of this handler is a no-op.
     */
    Widget.prototype.onChildHidden = function (msg) { };
    /**
     * A signal emitted when the widget is disposed.
     *
     * **See also:** [[disposed]], [[isDisposed]]
     */
    Widget.disposedSignal = new phosphor_signaling_1.Signal();
    /**
     * A property descriptor which controls the hidden state of a widget.
     *
     * #### Notes
     * This property controls whether a widget is explicitly hidden.
     *
     * Hiding a widget will cause the widget and all of its descendants
     * to become not-visible.
     *
     * This property will toggle the presence of [[HIDDEN_CLASS]] on a
     * widget according to the property value. It will also dispatch
     * `'after-show'` and `'before-hide'` messages as appropriate.
     *
     * The default property value is `false`.
     *
     * **See also:** [[hidden]], [[isVisible]]
     */
    Widget.hiddenProperty = new phosphor_properties_1.Property({
        value: false,
        changed: onHiddenChanged,
    });
    return Widget;
})(phosphor_nodewrapper_1.NodeWrapper);
exports.Widget = Widget;
/**
 * Attach a widget to a host DOM node.
 *
 * @param widget - The widget to attach to the DOM.
 *
 * @param host - The node to use as the widget's host.
 *
 * @throws Will throw an error if the widget is not a root widget,
 *   if the widget is already attached to the DOM, or if the host
 *   is not attached to the DOM.
 *
 * #### Notes
 * This function ensures that an `'after-attach'` message is dispatched
 * to the hierarchy. It should be used in lieu of manual DOM attachment.
 */
function attachWidget(widget, host) {
    if (widget.parent) {
        throw new Error('only a root widget can be attached to the DOM');
    }
    if (widget.isAttached || document.body.contains(widget.node)) {
        throw new Error('widget is already attached to the DOM');
    }
    if (!document.body.contains(host)) {
        throw new Error('host is not attached to the DOM');
    }
    host.appendChild(widget.node);
    phosphor_messaging_1.sendMessage(widget, exports.MSG_AFTER_ATTACH);
}
exports.attachWidget = attachWidget;
/**
 * Detach a widget from its host DOM node.
 *
 * @param widget - The widget to detach from the DOM.
 *
 * @throws Will throw an error if the widget is not a root widget,
 *   or if the widget is not attached to the DOM.
 *
 * #### Notes
 * This function ensures that a `'before-detach'` message is dispatched
 * to the hierarchy. It should be used in lieu of manual DOM detachment.
 */
function detachWidget(widget) {
    if (widget.parent) {
        throw new Error('only a root widget can be detached from the DOM');
    }
    if (!widget.isAttached || !document.body.contains(widget.node)) {
        throw new Error('widget is not attached to the DOM');
    }
    phosphor_messaging_1.sendMessage(widget, exports.MSG_BEFORE_DETACH);
    widget.node.parentNode.removeChild(widget.node);
}
exports.detachWidget = detachWidget;
/**
 * A message class for child-related messages.
 */
var ChildMessage = (function (_super) {
    __extends(ChildMessage, _super);
    /**
     * Construct a new child message.
     *
     * @param type - The message type.
     *
     * @param child - The child widget for the message.
     *
     * @param previousIndex - The previous index of the child, if known.
     *   The default index is `-1` and indicates an unknown index.
     *
     * @param currentIndex - The current index of the child, if known.
     *   The default index is `-1` and indicates an unknown index.
     */
    function ChildMessage(type, child, previousIndex, currentIndex) {
        if (previousIndex === void 0) { previousIndex = -1; }
        if (currentIndex === void 0) { currentIndex = -1; }
        _super.call(this, type);
        this._child = child;
        this._currentIndex = currentIndex;
        this._previousIndex = previousIndex;
    }
    Object.defineProperty(ChildMessage.prototype, "child", {
        /**
         * The child widget for the message.
         *
         * #### Notes
         * This is a read-only property.
         */
        get: function () {
            return this._child;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChildMessage.prototype, "currentIndex", {
        /**
         * The current index of the child.
         *
         * #### Notes
         * This will be `-1` if the current index is unknown.
         *
         * This is a read-only property.
         */
        get: function () {
            return this._currentIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChildMessage.prototype, "previousIndex", {
        /**
         * The previous index of the child.
         *
         * #### Notes
         * This will be `-1` if the previous index is unknown.
         *
         * This is a read-only property.
         */
        get: function () {
            return this._previousIndex;
        },
        enumerable: true,
        configurable: true
    });
    return ChildMessage;
})(phosphor_messaging_1.Message);
exports.ChildMessage = ChildMessage;
/**
 * A message class for 'resize' messages.
 */
var ResizeMessage = (function (_super) {
    __extends(ResizeMessage, _super);
    /**
     * Construct a new resize message.
     *
     * @param width - The **offset width** of the widget, or `-1` if
     *   the width is not known.
     *
     * @param height - The **offset height** of the widget, or `-1` if
     *   the height is not known.
     */
    function ResizeMessage(width, height) {
        _super.call(this, 'resize');
        this._width = width;
        this._height = height;
    }
    Object.defineProperty(ResizeMessage.prototype, "width", {
        /**
         * The offset width of the widget.
         *
         * #### Notes
         * This will be `-1` if the width is unknown.
         *
         * This is a read-only property.
         */
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResizeMessage.prototype, "height", {
        /**
         * The offset height of the widget.
         *
         * #### Notes
         * This will be `-1` if the height is unknown.
         *
         * This is a read-only property.
         */
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * A singleton 'resize' message with an unknown size.
     */
    ResizeMessage.UnknownSize = new ResizeMessage(-1, -1);
    return ResizeMessage;
})(phosphor_messaging_1.Message);
exports.ResizeMessage = ResizeMessage;
/**
 * An enum of widget bit flags.
 */
var WidgetFlag;
(function (WidgetFlag) {
    /**
     * The widget is attached to the DOM.
     */
    WidgetFlag[WidgetFlag["IsAttached"] = 1] = "IsAttached";
    /**
     * The widget is visible.
     */
    WidgetFlag[WidgetFlag["IsVisible"] = 2] = "IsVisible";
    /**
     * The widget has been disposed.
     */
    WidgetFlag[WidgetFlag["IsDisposed"] = 4] = "IsDisposed";
})(WidgetFlag || (WidgetFlag = {}));
/**
 * Create a new offset rect full of NaN's.
 */
function makeOffsetRect() {
    return { top: NaN, left: NaN, width: NaN, height: NaN };
}
/**
 * Clone an offset rect object.
 */
function cloneOffsetRect(rect) {
    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };
}
/**
 * Get the offset rect for a DOM node.
 */
function getOffsetRect(node) {
    return {
        top: node.offsetTop,
        left: node.offsetLeft,
        width: node.offsetWidth,
        height: node.offsetHeight,
    };
}
/**
 * The change handler for the [[hiddenProperty]].
 */
function onHiddenChanged(owner, old, hidden) {
    if (hidden) {
        if (owner.isAttached && (!owner.parent || owner.parent.isVisible)) {
            phosphor_messaging_1.sendMessage(owner, exports.MSG_BEFORE_HIDE);
        }
        owner.addClass(exports.HIDDEN_CLASS);
        if (owner.parent) {
            phosphor_messaging_1.sendMessage(owner.parent, new ChildMessage('child-hidden', owner));
        }
    }
    else {
        owner.removeClass(exports.HIDDEN_CLASS);
        if (owner.isAttached && (!owner.parent || owner.parent.isVisible)) {
            phosphor_messaging_1.sendMessage(owner, exports.MSG_AFTER_SHOW);
        }
        if (owner.parent) {
            phosphor_messaging_1.sendMessage(owner.parent, new ChildMessage('child-shown', owner));
        }
    }
}
/**
 * Send a message to all widgets in an array.
 */
function sendToAll(array, msg) {
    for (var i = 0; i < array.length; ++i) {
        phosphor_messaging_1.sendMessage(array[i], msg);
    }
}
/**
 * Send a message to all non-hidden widgets in an array.
 */
function sendToShown(array, msg) {
    for (var i = 0; i < array.length; ++i) {
        if (!array[i].hidden)
            phosphor_messaging_1.sendMessage(array[i], msg);
    }
}

},{"./index.css":17,"phosphor-arrays":3,"phosphor-domutil":6,"phosphor-messaging":13,"phosphor-nodewrapper":19,"phosphor-properties":14,"phosphor-signaling":16}],19:[function(require,module,exports){
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
/**
 * A base class for creating objects which wrap a DOM node.
 */
var NodeWrapper = (function () {
    function NodeWrapper() {
        this._node = this.constructor.createNode();
    }
    /**
     * Create the DOM node for a new node wrapper instance.
     *
     * @returns The DOM node to use with the node wrapper instance.
     *
     * #### Notes
     * The default implementation creates an empty `<div>`.
     *
     * This may be reimplemented by a subclass to create a custom node.
     */
    NodeWrapper.createNode = function () {
        return document.createElement('div');
    };
    Object.defineProperty(NodeWrapper.prototype, "node", {
        /**
         * Get the DOM node managed by the wrapper.
         *
         * #### Notes
         * This property is read-only.
         */
        get: function () {
            return this._node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeWrapper.prototype, "id", {
        /**
         * Get the id of the wrapper's DOM node.
         */
        get: function () {
            return this._node.id;
        },
        /**
         * Set the id of the wrapper's DOM node.
         */
        set: function (value) {
            this._node.id = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Test whether the wrapper's DOM node has the given class name.
     *
     * @param name - The class name of interest.
     *
     * @returns `true` if the node has the class, `false` otherwise.
     */
    NodeWrapper.prototype.hasClass = function (name) {
        return this._node.classList.contains(name);
    };
    /**
     * Add a class name to the wrapper's DOM node.
     *
     * @param name - The class name to add to the node.
     *
     * #### Notes
     * If the class name is already added to the node, this is a no-op.
     */
    NodeWrapper.prototype.addClass = function (name) {
        this._node.classList.add(name);
    };
    /**
     * Remove a class name from the wrapper's DOM node.
     *
     * @param name - The class name to remove from the node.
     *
     * #### Notes
     * If the class name is not yet added to the node, this is a no-op.
     */
    NodeWrapper.prototype.removeClass = function (name) {
        this._node.classList.remove(name);
    };
    /**
     * Toggle a class name on the wrapper's DOM node.
     *
     * @param name - The class name to toggle on the node.
     *
     * @param force - Whether to force add the class (`true`) or force
     *   remove the class (`false`). If not provided, the presence of
     *   the class will be toggled from its current state.
     *
     * @returns `true` if the class is now present, `false` otherwise.
     */
    NodeWrapper.prototype.toggleClass = function (name, force) {
        var present;
        if (force === true) {
            this.addClass(name);
            present = true;
        }
        else if (force === false) {
            this.removeClass(name);
            present = false;
        }
        else if (this.hasClass(name)) {
            this.removeClass(name);
            present = false;
        }
        else {
            this.addClass(name);
            present = true;
        }
        return present;
    };
    return NodeWrapper;
})();
exports.NodeWrapper = NodeWrapper;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvc3ByZWFkc2hlZXQuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1hcnJheXMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLWRpc3Bvc2FibGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLWRvbXV0aWwvbGliL2luZGV4LmNzcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1kb211dGlsL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvaW5kZXguY3NzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLW1lbnVzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudS5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudWJhci5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudWJhc2UuanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItbWVudXMvbGliL21lbnVpdGVtLmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLW1lc3NhZ2luZy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItcHJvcGVydGllcy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItcXVldWUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLXNpZ25hbGluZy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3Itd2lkZ2V0L2xpYi9pbmRleC5jc3MiLCJub2RlX21vZHVsZXMvcGhvc3Bob3Itd2lkZ2V0L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci13aWRnZXQvbm9kZV9tb2R1bGVzL3Bob3NwaG9yLW5vZGV3cmFwcGVyL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ArQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuYkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3R3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgcGhvc3Bob3JfbWVzc2FnaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1tZXNzYWdpbmcnKTtcclxudmFyIHBob3NwaG9yX21lbnVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1tZW51cycpO1xyXG52YXIgcGhvc3Bob3Jfd2lkZ2V0XzEgPSByZXF1aXJlKCdwaG9zcGhvci13aWRnZXQnKTtcclxuZnVuY3Rpb24gZ2V0Q2VsbFgoY2VsbCkge1xyXG4gICAgcmV0dXJuIGNlbGwuY2VsbEluZGV4IC0gMTtcclxufVxyXG5mdW5jdGlvbiBnZXRDZWxsWShjZWxsKSB7XHJcbiAgICByZXR1cm4gY2VsbC5wYXJlbnRFbGVtZW50LnJvd0luZGV4IC0gMTtcclxufVxyXG52YXIgQ2VsbENoYW5nZU1lc3NhZ2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKENlbGxDaGFuZ2VNZXNzYWdlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQ2VsbENoYW5nZU1lc3NhZ2UoY2VsbFgsIGNlbGxZKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgXCJjZWxsY2hhbmdlZFwiKTtcclxuICAgICAgICB0aGlzLl9jZWxsWCA9IGNlbGxYO1xyXG4gICAgICAgIHRoaXMuX2NlbGxZID0gY2VsbFk7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2VsbENoYW5nZU1lc3NhZ2UucHJvdG90eXBlLCBcImNlbGxYXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxYO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENlbGxDaGFuZ2VNZXNzYWdlLnByb3RvdHlwZSwgXCJjZWxsWVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZWxsWTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBDZWxsQ2hhbmdlTWVzc2FnZTtcclxufSkocGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSk7XHJcbnZhciBNdXRhYmxlTnVtYmVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE11dGFibGVOdW1iZXIodmFsKSB7XHJcbiAgICAgICAgdGhpcy52YWwgPSB2YWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTXV0YWJsZU51bWJlcjtcclxufSkoKTtcclxudmFyIE1TR19PTl9GT0NVUyA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKFwiZm9jdXNjaGFuZ2VkXCIpO1xyXG52YXIgTVNHX09OX1NFTEVDVElPTiA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKFwic2VsZWN0aW9uY2hhbmdlZFwiKTtcclxudmFyIE1TR19PTl9CRUdJTl9FRElUID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoXCJiZWdpbmVkaXRzXCIpO1xyXG52YXIgSFRNTExhYmVsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEhUTUxMYWJlbCh2YWwsIGlzQ29sLCBuZXdDZWxsKSB7XHJcbiAgICAgICAgdGhpcy52YWwgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5pc0NvbCA9IGlzQ29sO1xyXG4gICAgICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBuZXdDZWxsLmFwcGVuZENoaWxkKHRoaXMuZGl2KTtcclxuICAgICAgICB0aGlzLmRpdi5pbm5lckhUTUwgPSB0aGlzLnZhbC50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtdHlwZVwiLCBcImxhYmVsXCIpO1xyXG4gICAgICAgIHRoaXMuZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtY29sXCIsIGlzQ29sLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtbnVtXCIsIHZhbC50b1N0cmluZygpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBIVE1MTGFiZWw7XHJcbn0pKCk7XHJcbnZhciBTcHJlYWRzaGVldEV2ZW50T2JqZWN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNwcmVhZHNoZWV0RXZlbnRPYmplY3QoKSB7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3ByZWFkc2hlZXRFdmVudE9iamVjdDtcclxufSkoKTtcclxudmFyIEhUTUxDZWxsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEhUTUxDZWxsKHBhcmVudCwgbXV0YWJsZVJvdywgbXV0YWJsZUNvbCkge1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoXCJjb250ZW50ZWRpdGFibGVcIiwgXCJmYWxzZVwiKTtcclxuICAgICAgICB0aGlzLmRpdi5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcclxuICAgICAgICB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiwgXCJjZWxsXCIpO1xyXG4gICAgICAgIHRoaXMuX3JvdyA9IG11dGFibGVSb3c7XHJcbiAgICAgICAgdGhpcy5fY29sID0gbXV0YWJsZUNvbDtcclxuICAgICAgICB0aGlzLnJvdyA9IG11dGFibGVSb3cudmFsO1xyXG4gICAgICAgIHRoaXMuY29sID0gbXV0YWJsZUNvbC52YWw7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5VmFsID0gcGFyZW50Lm12Lm1vZGVsLmNlbGxWYWxzW3RoaXMuY29sXVt0aGlzLnJvd107XHJcbiAgICB9XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuc2V0RGlzcGxheVZhbCA9IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLmRpc3BsYXlWYWwgPSBuZXdWYWw7XHJcbiAgICB9O1xyXG4gICAgSFRNTENlbGwucHJvdG90eXBlLmdldERpc3BsYXlWYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXlWYWw7XHJcbiAgICB9O1xyXG4gICAgSFRNTENlbGwucHJvdG90eXBlLnNldENvbCA9IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLmNvbCA9IG5ld1ZhbDtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuZ2V0Q29sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbDtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuc2V0Um93ID0gZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIHRoaXMucm93ID0gbmV3VmFsO1xyXG4gICAgfTtcclxuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5nZXRSb3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93O1xyXG4gICAgfTtcclxuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5iZWdpbkVkaXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGl2LnNldEF0dHJpYnV0ZShcImNvbnRlbnRFZGl0YWJsZVwiLCBcInRydWVcIik7XHJcbiAgICAgICAgdGhpcy5kaXYuZm9jdXMoKTtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuZmluaXNoRWRpdHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXYuc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQubXYubW9kZWwuY2VsbFZhbHNbdGhpcy5jb2xdW3RoaXMucm93XSA9IHRoaXMuZGl2LmlubmVySFRNTC50b1N0cmluZygpO1xyXG4gICAgfTtcclxuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZGl2LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5kaXYuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWR0ZFwiKTtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuZGVzZWxlY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZGl2LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5kaXYuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWR0ZFwiKTtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuc3RhcnRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGFyZW50RWxlbWVudCA9IHRoaXMuZGl2LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgcGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNlZHRkXCIpO1xyXG4gICAgfTtcclxuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5lbmRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmZpbmlzaEVkaXRzKCk7XHJcbiAgICAgICAgdmFyIHBhcmVudEVsZW1lbnQgPSB0aGlzLmRpdi5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIHBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImZvY3VzZWR0ZFwiKTtcclxuICAgIH07XHJcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuZ2V0SFRNTEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2O1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIVE1MQ2VsbC5wcm90b3R5cGUsIFwiZGlzcGxheVZhbFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXNwbGF5VmFsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlWYWwgPSBuZXdWYWw7XHJcbiAgICAgICAgICAgIHRoaXMuZGl2LmlubmVySFRNTCA9IG5ld1ZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIVE1MQ2VsbC5wcm90b3R5cGUsIFwiY29sXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbC52YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29sLnZhbCA9IG5ld1ZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIVE1MQ2VsbC5wcm90b3R5cGUsIFwicm93XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvdy52YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm93LnZhbCA9IG5ld1ZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBIVE1MQ2VsbDtcclxufSkoKTtcclxudmFyIEhUTUxTcHJlYWRzaGVldE1vZGVsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEhUTUxTcHJlYWRzaGVldE1vZGVsKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jZWxsVmFscyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxWYWxzW2ldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbFZhbHNbaV1bal0gPSBpICsgXCIgXCIgKyBqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLnByb2Nlc3NNZXNzYWdlID0gZnVuY3Rpb24gKG1zZykgeyB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLmdldENlbGwgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxWYWxzW3hdW3ldO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldE1vZGVsLnByb3RvdHlwZS5zZXRDZWxsID0gZnVuY3Rpb24gKHgsIHksIG5ld0NlbGwpIHtcclxuICAgICAgICB0aGlzLmNlbGxWYWxzW3hdW3ldID0gbmV3Q2VsbDtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJjZWxsY2hhbmdlZFwiLCB7IGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgY2VsbHg6IHgsXHJcbiAgICAgICAgICAgICAgICBjZWxseTogeSxcclxuICAgICAgICAgICAgfSB9KTtcclxuICAgICAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB2YXIgbXNnID0gbmV3IENlbGxDaGFuZ2VNZXNzYWdlKHgsIHkpO1xyXG4gICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIG1zZyk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLmluc2VydENvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcclxuICAgICAgICB0aGlzLmNlbGxWYWxzLnNwbGljZShjb2xOdW0sIDAsIG5ldyBBcnJheSgpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsc1tjb2xOdW1dW2ldID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53aWR0aCsrO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldE1vZGVsLnByb3RvdHlwZS5kZWxldGVDb2wgPSBmdW5jdGlvbiAoY29sTnVtKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsVmFscy5zcGxpY2UoY29sTnVtLCAxKTtcclxuICAgICAgICB0aGlzLndpZHRoLS07XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLmluc2VydFJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxWYWxzW2ldLnNwbGljZShyb3dOdW0sIDAsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmhlaWdodCsrO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldE1vZGVsLnByb3RvdHlwZS5kZWxldGVSb3cgPSBmdW5jdGlvbiAocm93TnVtKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsc1tpXS5zcGxpY2Uocm93TnVtLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5oZWlnaHQtLTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRNb2RlbC5wcm90b3R5cGUuY2xlYXJDZWxsID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnNldENlbGwoeCwgeSwgXCJcIik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEhUTUxTcHJlYWRzaGVldE1vZGVsO1xyXG59KSgpO1xyXG52YXIgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbChtb2RlbCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcclxuICAgICAgICB0aGlzLm1pblggPSAwO1xyXG4gICAgICAgIHRoaXMubWF4WCA9IDA7XHJcbiAgICAgICAgdGhpcy5taW5ZID0gMDtcclxuICAgICAgICB0aGlzLm1heFkgPSAwO1xyXG4gICAgICAgIHRoaXMuZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZENlbGxzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlbC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxsc1tpXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1vZGVsLmhlaWdodDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQ2VsbHNbaV1bal0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50TWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZG91YmxlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXRbXCJ0eXBlXCJdID09IFwiY2VsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG91YmxlY2xpY2tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuYmVnaW5FZGl0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb3VzZUNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxEaXZFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBkaXYuZGF0YXNldFtcInR5cGVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImNlbGxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxYO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbFggPSBnZXRDZWxsWChkaXYucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsWSA9IGdldENlbGxZKGRpdi5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW91c2VEb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY2xlYXJTZWxlY3Rpb25zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb2N1c0NlbGwoY2VsbFgsIGNlbGxZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW91c2VTZWxlY3RSYW5nZShjZWxsWCwgY2VsbFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImxhYmVsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUludChkaXYuZGF0YXNldFtcIm51bVwiXSkgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpdi5kYXRhc2V0W1wiY29sXCJdID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvY3VzQ2VsbChudW0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1pblggPSBudW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WCA9IG51bTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZID0gdGhhdC5tb2RlbC5oZWlnaHQgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWCA9IE1hdGgubWluKG51bSwgdGhhdC5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFggPSBNYXRoLm1heChudW0sIHRoYXQuZm9jdXNlZENlbGxYKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZID0gdGhhdC5tb2RlbC5oZWlnaHQgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5mb2N1c0NlbGwoMCwgbnVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5YID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhYID0gdGhhdC5tb2RlbC53aWR0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWSA9IG51bTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZID0gbnVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WCA9IHRoYXQubW9kZWwud2lkdGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1pblkgPSBNYXRoLm1pbihudW0sIHRoYXQuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZID0gTWF0aC5tYXgobnVtLCB0aGF0LmZvY3VzZWRDZWxsWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0QXJlYSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb3VzZVVwOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW91c2UgdXBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3VzZURvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtb3VzZU1vdmVkOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vRklYIE1FLCBJIFdJTEwgQlJFQUsgV0hFTiBOT1QgT1ZFUiBBIERJViFcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbFg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxZO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC5ub2RlTmFtZSA9PSBcIkRJVlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxYID0gZ2V0Q2VsbFgoZS50YXJnZXQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxZID0gZ2V0Q2VsbFkoZS50YXJnZXQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1vdXNlRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3VzZVNlbGVjdFJhbmdlKGNlbGxYLCBjZWxsWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29weTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhhdC5taW5ZOyBpIDw9IHRoYXQubWF4WTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSB0aGF0Lm1pblg7IGogPD0gdGhhdC5tYXhYOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIHRoYXQubW9kZWwuY2VsbFZhbHNbal1baV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IHRoYXQubWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArICdcXHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgdGhhdC5tYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyAnXFxyXFxuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlLmNsaXBib2FyZERhdGEuc2V0RGF0YSgndGV4dC9wbGFpbicsIHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBhc3RlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY2xlYXJTZWxlY3Rpb25zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwidGV4dC9wbGFpblwiKS5zcGxpdChcIlxcclxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heFcgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSBsaW5lc1tpXS5zcGxpdChcIlxcdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxscy5sZW5ndGggPiBtYXhXKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGNlbGxzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSBsaW5lc1tpXS5zcGxpdChcIlxcdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWF4VzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWluWCArIGogPD0gdGhhdC5tb2RlbC53aWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGF0Lm1pblkgKyBpIDw9IHRoYXQubW9kZWwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2VsbHNbal0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vZGVsLnNldENlbGwodGhhdC5taW5YICsgaiwgdGhhdC5taW5ZICsgaSwgY2VsbHNbal0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb2RlbC5zZXRDZWxsKHRoYXQubWluWCArIGosIHRoYXQubWluWSArIGksIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGtleVByZXNzZWQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKHRydWUsIDAsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZSh0cnVlLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmVkaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OiAvL2JhY2tzcGFjZS9kZWxldGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmFja3NwYWNlIHByZXNzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQuZWRpdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IGN1cnJlbnRseSBlZGl0aW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoYXQuc2VsZWN0ZWRDZWxscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGF0Lm1pblg7IGkgPD0gdGhhdC5tYXhYOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IHRoYXQubWluWTsgaiA8PSB0aGF0Lm1heFk7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbGVhckNlbGwoaSwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZShmYWxzZSwgLTEsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWF4WCA+IHRoYXQuZm9jdXNlZENlbGxYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFgtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0QXJlYSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWluWCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1pblgtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmVkaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwIGFycm93XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmUoZmFsc2UsIDAsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1heFkgPiB0aGF0LmZvY3VzZWRDZWxsWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RBcmVhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZShmYWxzZSwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5taW5YIDwgdGhhdC5mb2N1c2VkQ2VsbFgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RBcmVhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXhYIDwgdGhhdC5tb2RlbC53aWR0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmVkaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKGZhbHNlLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblkgPCB0aGF0LmZvY3VzZWRDZWxsWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1heFkgPCB0aGF0Lm1vZGVsLmhlaWdodCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDk6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vY2hlY2sgZm9jdXMgb24gdGhpcyBvbmUuLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKHRydWUsIC0xLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZSh0cnVlLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmVkaXRpbmcgJiYgZS5rZXlDb2RlID49IDMyICYmIGUua2V5Q29kZSAhPSAxMjdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAhZS5hbHRLZXkgJiYgIWUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUua2V5Q29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbGVhckNlbGwodGhhdC5mb2N1c2VkQ2VsbFgsIHRoYXQuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmJlZ2luRWRpdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZXZlbnRHcmFiYmVyID0gdGhpcy5ldmVudE1hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLmV2ZW50cyA9IG5ldyBTcHJlYWRzaGVldEV2ZW50T2JqZWN0KCk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMubW91c2Vkb3duID0gZXZlbnRHcmFiYmVyLm1vdXNlQ2xpY2ssXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm1vdXNldXAgPSBldmVudEdyYWJiZXIubW91c2VVcCxcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMubW91c2Vtb3ZlID0gZXZlbnRHcmFiYmVyLm1vdXNlTW92ZWQsXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmRvdWJsZWNsaWNrID0gZXZlbnRHcmFiYmVyLmRvdWJsZUNsaWNrLFxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5rZXlwcmVzc2VkID0gZXZlbnRHcmFiYmVyLmtleVByZXNzZWQsXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmNvcHkgPSBldmVudEdyYWJiZXIuY29weSxcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMucGFzdGUgPSBldmVudEdyYWJiZXIucGFzdGU7XHJcbiAgICB9XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmluc2VydFJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcclxuICAgICAgICB0aGlzLm1pblggPSAwO1xyXG4gICAgICAgIHRoaXMubWF4WCA9IHRoaXMubW9kZWwud2lkdGggLSAxO1xyXG4gICAgICAgIHRoaXMubWluWSA9IHJvd051bTtcclxuICAgICAgICB0aGlzLm1heFkgPSByb3dOdW07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5pbnNlcnRSb3cocm93TnVtKTtcclxuICAgICAgICB0aGlzLmZvY3VzQ2VsbCgwLCByb3dOdW0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuaW5zZXJ0Q29sID0gZnVuY3Rpb24gKGNvbE51bSkge1xyXG4gICAgICAgIHRoaXMubWluWSA9IDA7XHJcbiAgICAgICAgdGhpcy5tYXhZID0gdGhpcy5tb2RlbC5oZWlnaHQgLSAxO1xyXG4gICAgICAgIHRoaXMubWluWCA9IGNvbE51bTtcclxuICAgICAgICB0aGlzLm1heFggPSBjb2xOdW07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XHJcbiAgICAgICAgdGhpcy5mb2N1c0NlbGwoY29sTnVtLCAwKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmRlbGV0ZVJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcclxuICAgICAgICB0aGlzLm1pblggPSAwO1xyXG4gICAgICAgIHRoaXMubWF4WCA9IHRoaXMubW9kZWwud2lkdGggLSAxO1xyXG4gICAgICAgIHRoaXMubWluWSA9IHJvd051bTtcclxuICAgICAgICB0aGlzLm1heFkgPSByb3dOdW07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XHJcbiAgICAgICAgdGhpcy5mb2N1c0NlbGwoMCwgcm93TnVtKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmRlbGV0ZUNvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcclxuICAgICAgICB0aGlzLm1pblkgPSAwO1xyXG4gICAgICAgIHRoaXMubWF4WSA9IHRoaXMubW9kZWwuaGVpZ2h0IC0gMTtcclxuICAgICAgICB0aGlzLm1pblggPSBjb2xOdW07XHJcbiAgICAgICAgdGhpcy5tYXhYID0gY29sTnVtO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0QXJlYSgpO1xyXG4gICAgICAgIHRoaXMuZm9jdXNDZWxsKGNvbE51bSwgMCk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKHNraXBDaGVjaywgeEFtb3VudCwgeUFtb3VudCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZvY3VzZWRDZWxsWCArIHhBbW91bnQgPj0gMCAmJlxyXG4gICAgICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWCArIHhBbW91bnQgPCB0aGlzLm1vZGVsLndpZHRoICYmXHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXNlZENlbGxZICsgeUFtb3VudCA+PSAwICYmXHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXNlZENlbGxZICsgeUFtb3VudCA8IHRoaXMubW9kZWwuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5lZGl0aW5nIHx8IHNraXBDaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbFggKz0geEFtb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNlZENlbGxZICs9IHlBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c0NlbGwodGhpcy5mb2N1c2VkQ2VsbFgsIHRoaXMuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLm1vdXNlQ2xpY2tlZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xyXG4gICAgICAgIHZhciBjZWxsWDtcclxuICAgICAgICB2YXIgY2VsbFk7XHJcbiAgICAgICAgY2VsbFggPSBnZXRDZWxsWChlLnRhcmdldC5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICBjZWxsWSA9IGdldENlbGxZKGUudGFyZ2V0LnBhcmVudEVsZW1lbnQpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2VsbFggIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c0NlbGwoY2VsbFgsIGNlbGxZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VTZWxlY3RSYW5nZShjZWxsWCwgY2VsbFkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuY2xlYXJTZWxlY3Rpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxscyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tb2RlbC53aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxsc1tpXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubW9kZWwuaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxsc1tpXVtqXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuZm9jdXNDZWxsID0gZnVuY3Rpb24gKGNlbGxYLCBjZWxsWSkge1xyXG4gICAgICAgIHRoaXMubWluWCA9IGNlbGxYO1xyXG4gICAgICAgIHRoaXMubWF4WCA9IGNlbGxYO1xyXG4gICAgICAgIHRoaXMubWluWSA9IGNlbGxZO1xyXG4gICAgICAgIHRoaXMubWF4WSA9IGNlbGxZO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW4gZm9jdXNDZWxsXCIpO1xyXG4gICAgICAgIC8vY2VsbC5mb2N1cygpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNlbGxYKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjZWxsWSk7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbFggPSBjZWxsWDtcclxuICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWSA9IGNlbGxZO1xyXG4gICAgICAgIHRoaXMuZm9jdXNDaGFuZ2VkKCk7XHJcbiAgICAgICAgLy9pZiBub3Qgc2VsZWN0ZWQ/PyB0aGVuXHJcbiAgICAgICAgdGhpcy5zZWxlY3QoY2VsbFgsIGNlbGxZKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmNsZWFyQ2VsbCA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5jbGVhckNlbGwoeCwgeSk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoY2VsbFgsIGNlbGxZKSB7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZENlbGxzW2NlbGxYXVtjZWxsWV0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlZCgpO1xyXG4gICAgICAgIC8vVEhST1cgQkFDSyBTRUxFQ1RJT04gQ0hBTkdFRCBFVkVOVFxyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUubW91c2VTZWxlY3RSYW5nZSA9IGZ1bmN0aW9uIChjZWxsWCwgY2VsbFkpIHtcclxuICAgICAgICBpZiAoY2VsbFggPT0gdGhpcy5mb2N1c2VkQ2VsbFggJiYgY2VsbFkgPT0gdGhpcy5mb2N1c2VkQ2VsbFkpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWluWCA9IE1hdGgubWluKGNlbGxYLCB0aGlzLmZvY3VzZWRDZWxsWCk7XHJcbiAgICAgICAgdGhpcy5tYXhYID0gTWF0aC5tYXgoY2VsbFgsIHRoaXMuZm9jdXNlZENlbGxYKTtcclxuICAgICAgICB0aGlzLm1pblkgPSBNYXRoLm1pbihjZWxsWSwgdGhpcy5mb2N1c2VkQ2VsbFkpO1xyXG4gICAgICAgIHRoaXMubWF4WSA9IE1hdGgubWF4KGNlbGxZLCB0aGlzLmZvY3VzZWRDZWxsWSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5zZWxlY3RBcmVhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMubWluWDsgaSA8PSB0aGlzLm1heFg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gdGhpcy5taW5ZOyBqIDw9IHRoaXMubWF4WTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQ2VsbHNbaV1bal0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvL1BVU0ggQkFDSyBTRUxFQ1RJT04gQ0hBTkdFXHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VkKCk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5mb2N1c0NoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZm9jdXNjaGFuZ2VkXCIpO1xyXG4gICAgICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIE1TR19PTl9GT0NVUyk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5zZWxlY3Rpb25DaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcInNlbGVjdGlvbmNoYW5nZWRcIik7XHJcbiAgICAgICAgZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgTVNHX09OX1NFTEVDVElPTik7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5iZWdpbkVkaXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJlZGl0cyA9IHRydWVcIik7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiYmVnaW5lZGl0c1wiKTtcclxuICAgICAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZSh0aGlzLCBNU0dfT05fQkVHSU5fRURJVCk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5wcm9jZXNzTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm12XCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbDtcclxufSkoKTtcclxudmFyIEhUTUxTcHJlYWRzaGVldFZpZXcgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEhUTUxTcHJlYWRzaGVldFZpZXcsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBIVE1MU3ByZWFkc2hlZXRWaWV3KG1vZGVsVmlldykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubXYgPSBtb2RlbFZpZXc7XHJcbiAgICAgICAgdGhpcy50YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiKTtcclxuICAgICAgICB0aGlzLnRhYmxlLmNsYXNzTGlzdC5hZGQoXCJzcHJlYWRzaGVldFwiKTtcclxuICAgICAgICB0aGlzLm11dGFibGVDb2xWYWxzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlUm93VmFscyA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIHRoaXMuY2VsbHMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5tdXRhYmxlUm93VmFsc1tpXSA9IG5ldyBNdXRhYmxlTnVtYmVyKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubXYubW9kZWwud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLm11dGFibGVDb2xWYWxzW2ldID0gbmV3IE11dGFibGVOdW1iZXIoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5pbnNlcnRSb3coKTtcclxuICAgICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2kgLSAxXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IHRoaXMubXYubW9kZWwud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGogPiAwICYmIGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpIC0gMV1baiAtIDFdID0gbmV3IEhUTUxDZWxsKHRoaXMsIHRoaXMubXV0YWJsZVJvd1ZhbHNbaSAtIDFdLCB0aGlzLm11dGFibGVDb2xWYWxzW2ogLSAxXSk7IC8vZmlsbCBpbiBsYXRlclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoQ2VsbCh0aGlzLmNlbGxzW2kgLSAxXVtqIC0gMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29sdW1uTGFiZWxzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5yb3dMYWJlbHMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaV07XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gcm93LmNlbGxzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnJvd0xhYmVsc1tpXSA9IG5ldyBIVE1MTGFiZWwoaSwgZmFsc2UsIGNlbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB0aGlzLm12Lm1vZGVsLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGUucm93c1swXTtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSByb3cuY2VsbHNbaV07XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uTGFiZWxzW2ldID0gbmV3IEhUTUxMYWJlbChpLCB0cnVlLCBjZWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xyXG4gICAgICAgIGlmICh0aGlzLm12LmV2ZW50cy5tb3VzZWRvd24gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FsbGJhY2soXCJtb3VzZWRvd25cIiwgdGhpcy5tdi5ldmVudHMubW91c2Vkb3duLCB0aGlzLnRhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubXYuZXZlbnRzLm1vdXNldXAgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FsbGJhY2soXCJtb3VzZXVwXCIsIHRoaXMubXYuZXZlbnRzLm1vdXNldXAsIGRvY3VtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubXYuZXZlbnRzLm1vdXNlbW92ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDYWxsYmFjayhcIm1vdXNlbW92ZVwiLCB0aGlzLm12LmV2ZW50cy5tb3VzZW1vdmUsIGRvY3VtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubXYuZXZlbnRzLmRvdWJsZWNsaWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENhbGxiYWNrKFwiZGJsY2xpY2tcIiwgdGhpcy5tdi5ldmVudHMuZG91YmxlY2xpY2ssIHRoaXMudGFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tdi5ldmVudHMua2V5cHJlc3NlZCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDYWxsYmFjayhcImtleWRvd25cIiwgdGhpcy5tdi5ldmVudHMua2V5cHJlc3NlZCwgZG9jdW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tdi5ldmVudHMuY29weSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDYWxsYmFjayhcImNvcHlcIiwgdGhpcy5tdi5ldmVudHMuY29weSwgZG9jdW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoZnVuY3Rpb24gKHRoYXQpIHtcclxuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdGlvbmNoYW5nZWRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlU2VsZWN0aW9ucygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy90aGlzLnRhYmxlLlxyXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiZm9jdXNjaGFuZ2VkXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZUZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiY2VsbGNoYW5nZWRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2VsbHNbZS5kZXRhaWwuY2VsbHldW2UuZGV0YWlsLmNlbGx4XS5zZXREaXNwbGF5VmFsKHRoYXQubXYubW9kZWwuY2VsbFZhbHNbZS5kZXRhaWwuY2VsbHhdW2UuZGV0YWlsLmNlbGx5XSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiYmVnaW5lZGl0c1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5mb2N1c2VkQ2VsbC5iZWdpbkVkaXRzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGF0LnRhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbihlOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vICAgaWYgKCg8SFRNTERpdkVsZW1lbnQ+ZS50YXJnZXQpLmRhdGFzZXRbXCJjZWxseFwiXSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoYXQuZm9jdXNlZENlbGwuZGl2LnNldEF0dHJpYnV0ZShcImNvbnRlbnRFZGl0YWJsZVwiLCB0cnVlKTtcclxuICAgICAgICAgICAgLy8gICAgIHRoYXQuZm9jdXNlZENlbGwuZGl2LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9KSh0aGlzKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZU1lbnUoKTtcclxuICAgIH1cclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnByb2Nlc3NNZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlldy5wcm90b3R5cGUudXBkYXRlU2VsZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmNlbGxzWzBdLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tdi5oaWdobGlnaHRlZENlbGxzW2pdW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXS5zZWxlY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uZGVzZWxlY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS51cGRhdGVGb2N1cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5mb2N1c2VkQ2VsbCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbC5lbmRGb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLm12LmVkaXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tdi5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubXYuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICB0aGlzLmZvY3VzZWRDZWxsID0gdGhpcy5jZWxsc1t0aGlzLm12LmZvY3VzZWRDZWxsWV1bdGhpcy5tdi5mb2N1c2VkQ2VsbFhdO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZENlbGwuc3RhcnRGb2N1cygpO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmF0dGFjaENlbGwgPSBmdW5jdGlvbiAoY2VsbCkge1xyXG4gICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbY2VsbC5nZXRSb3coKSArIDFdO1xyXG4gICAgICAgIHZhciB0YWJsZUNlbGwgPSB0aGlzLnRhYmxlLnJvd3NbY2VsbC5nZXRSb3coKSArIDFdLmNlbGxzW2NlbGwuZ2V0Q29sKCkgKyAxXTtcclxuICAgICAgICB0YWJsZUNlbGwuYXBwZW5kQ2hpbGQoY2VsbC5nZXRIVE1MRWxlbWVudCgpKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5hZGRDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2ssIHRvKSB7XHJcbiAgICAgICAgdG8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmluc2VydENvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcclxuICAgICAgICB0aGlzLm12Lm1vZGVsLmluc2VydENvbChjb2xOdW0pO1xyXG4gICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbMF07XHJcbiAgICAgICAgdmFyIGNlbGwgPSByb3cuaW5zZXJ0Q2VsbChjb2xOdW0gKyAxKTtcclxuICAgICAgICB0aGlzLmNvbHVtbkxhYmVscy5zcGxpY2UoY29sTnVtLCAwLCBuZXcgSFRNTExhYmVsKGNvbE51bSArIDEsIHRydWUsIGNlbGwpKTtcclxuICAgICAgICB0aGlzLm11dGFibGVDb2xWYWxzLnNwbGljZShjb2xOdW0sIDAsIG5ldyBNdXRhYmxlTnVtYmVyKGNvbE51bSkpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaSArIDFdO1xyXG4gICAgICAgICAgICByb3cuaW5zZXJ0Q2VsbChjb2xOdW0gKyAxKTtcclxuICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS5zcGxpY2UoY29sTnVtLCAwLCBuZXcgSFRNTENlbGwodGhpcywgdGhpcy5tdXRhYmxlUm93VmFsc1tpXSwgdGhpcy5tdXRhYmxlQ29sVmFsc1tjb2xOdW1dKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoQ2VsbCh0aGlzLmNlbGxzW2ldW2NvbE51bV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBqID0gY29sTnVtICsgMjsgaiA8PSB0aGlzLm12Lm1vZGVsLndpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHNbal0udmFsKys7XHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHNbal0uZGl2LmlubmVySFRNTCA9IHRoaXMuY29sdW1uTGFiZWxzW2pdLnZhbC50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm12Lmluc2VydENvbChjb2xOdW0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmRlbGV0ZUNvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcclxuICAgICAgICB0aGlzLm12Lm1vZGVsLmRlbGV0ZUNvbChjb2xOdW0pO1xyXG4gICAgICAgIHRoaXMuY29sdW1uTGFiZWxzLnNwbGljZShjb2xOdW0sIDEpO1xyXG4gICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbMF07XHJcbiAgICAgICAgcm93LmRlbGV0ZUNlbGwoY29sTnVtICsgMSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJvdyA9IHRoaXMudGFibGUucm93c1tpICsgMV07XHJcbiAgICAgICAgICAgIHJvdy5kZWxldGVDZWxsKGNvbE51bSArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnNwbGljZShjb2xOdW0sIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldWzBdLnNldENvbCh0aGlzLmNlbGxzW2ldWzBdLmdldENvbCgpIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGogPSBjb2xOdW0gKyAxOyBqIDw9IHRoaXMubXYubW9kZWwud2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxhYmVsc1tqXS52YWwtLTtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHNbal0uZGl2LmlubmVySFRNTCA9IHRoaXMuY29sdW1uTGFiZWxzW2pdLnZhbC50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm12LmRlbGV0ZUNvbChjb2xOdW0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmluc2VydFJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcclxuICAgICAgICB0aGlzLm12Lm1vZGVsLmluc2VydFJvdyhyb3dOdW0pO1xyXG4gICAgICAgIHRoaXMuY2VsbHMuc3BsaWNlKHJvd051bSwgMCwgbmV3IEFycmF5KCkpO1xyXG4gICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLmluc2VydFJvdyhyb3dOdW0gKyAxKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSByb3cuaW5zZXJ0Q2VsbCgpO1xyXG4gICAgICAgIHRoaXMucm93TGFiZWxzLnNwbGljZShyb3dOdW0sIDAsIG5ldyBIVE1MTGFiZWwocm93TnVtICsgMSwgZmFsc2UsIGxhYmVsKSk7XHJcbiAgICAgICAgdGhpcy5tdXRhYmxlUm93VmFscy5zcGxpY2Uocm93TnVtLCAwLCBuZXcgTXV0YWJsZU51bWJlcihyb3dOdW0pKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubXYubW9kZWwud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzW3Jvd051bV1baV0gPSBuZXcgSFRNTENlbGwodGhpcywgdGhpcy5tdXRhYmxlUm93VmFsc1tyb3dOdW1dLCB0aGlzLm11dGFibGVDb2xWYWxzW2ldKTtcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2hDZWxsKHRoaXMuY2VsbHNbcm93TnVtXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGogPSByb3dOdW0gKyAyOyBqIDw9IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dMYWJlbHNbal0udmFsKys7XHJcbiAgICAgICAgICAgIHRoaXMucm93TGFiZWxzW2pdLmRpdi5pbm5lckhUTUwgPSB0aGlzLnJvd0xhYmVsc1tqXS52YWwudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy5jZWxsc1tqXVswXS5zZXRSb3codGhpcy5jZWxsc1tqXVswXS5nZXRSb3coKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm12Lmluc2VydFJvdyhyb3dOdW0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmRlbGV0ZVJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyb3dOdW0pO1xyXG4gICAgICAgIHRoaXMubXYubW9kZWwuZGVsZXRlUm93KHJvd051bSk7XHJcbiAgICAgICAgdGhpcy5jZWxscy5zcGxpY2Uocm93TnVtLCAxKTtcclxuICAgICAgICB0aGlzLnRhYmxlLmRlbGV0ZVJvdyhyb3dOdW0gKyAxKTtcclxuICAgICAgICB0aGlzLnJvd0xhYmVscy5zcGxpY2Uocm93TnVtLCAxKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubXYubW9kZWwud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gcm93TnVtOyBqIDw9IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd0xhYmVsc1tqXS52YWwtLTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd0xhYmVsc1tqXS5kaXYuaW5uZXJIVE1MID0gdGhpcy5yb3dMYWJlbHNbal0udmFsLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jZWxsc1swXVtpXS5zZXRSb3codGhpcy5jZWxsc1swXVtpXS5nZXRSb3coKSAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm12LmRlbGV0ZVJvdyhyb3dOdW0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnNvcnRDb2xBc2MgPSBmdW5jdGlvbiAoY29sKSB7XHJcbiAgICAgICAgdGhpcy5zb3J0QnlDb2woY29sLCB0cnVlKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5zb3J0Q29sRGVzYyA9IGZ1bmN0aW9uIChjb2wpIHtcclxuICAgICAgICB0aGlzLnNvcnRCeUNvbChjb2wsIGZhbHNlKTtcclxuICAgIH07XHJcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5zb3J0QnlDb2wgPSBmdW5jdGlvbiAoY29sTnVtLCBhc2NlbmRpbmcpIHtcclxuICAgICAgICB2YXIgbnVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC5oZWlnaHQ7IGkrKykge1xyXG4gICAgICAgICAgICBudW1zLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubXYubW9kZWwuY2VsbFZhbHNbY29sTnVtXSk7XHJcbiAgICAgICAgaWYgKGFzY2VuZGluZykge1xyXG4gICAgICAgICAgICBudW1zID0gdGhpcy5zb3J0Q29sKG51bXMsIHRoaXMubXYubW9kZWwuY2VsbFZhbHNbY29sTnVtXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBudW1zID0gdGhpcy5zb3J0Q29sKG51bXMsIHRoaXMubXYubW9kZWwuY2VsbFZhbHNbY29sTnVtXSwgZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiIDwgYTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKG51bXMpO1xyXG4gICAgICAgIHZhciBuZXdWYWxzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLndpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgbmV3VmFscy5wdXNoKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5tdi5tb2RlbC53aWR0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWxzW2pdW2ldID0gdGhpcy5tdi5tb2RlbC5jZWxsVmFsc1tqXVtudW1zW2ldXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhuZXdWYWxzKTtcclxuICAgICAgICB0aGlzLm12Lm1vZGVsLmNlbGxWYWxzID0gbmV3VmFscztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubXYubW9kZWwud2lkdGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbal1baV0uc2V0RGlzcGxheVZhbCh0aGlzLm12Lm1vZGVsLmNlbGxWYWxzW2ldW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm12Lm1vZGVsLmNlbGxWYWxzW2NvbE51bV0pO1xyXG4gICAgfTtcclxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnNvcnRDb2wgPSBmdW5jdGlvbiAobnVtcywgdmFscywgc29ydGVyKSB7XHJcbiAgICAgICAgaWYgKHZhbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc29ydGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc29ydCBmdW5jdGlvbiBwYXNzZWRcIik7XHJcbiAgICAgICAgICAgIHNvcnRlciA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYSA8IGI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZWZ0VmFscyA9IFtdO1xyXG4gICAgICAgIHZhciBsZWZ0TnVtcyA9IFtdO1xyXG4gICAgICAgIHZhciByaWdodFZhbHMgPSBbXTtcclxuICAgICAgICB2YXIgcmlnaHROdW1zID0gW107XHJcbiAgICAgICAgdmFyIHBpdm90ID0gdmFsc1swXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHZhbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKChzb3J0ZXIodmFsc1tpXSwgcGl2b3QpIHx8IHBpdm90ID09IFwiXCIpICYmIHZhbHNbaV0gIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgbGVmdFZhbHMucHVzaCh2YWxzW2ldKTtcclxuICAgICAgICAgICAgICAgIGxlZnROdW1zLnB1c2gobnVtc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByaWdodFZhbHMucHVzaCh2YWxzW2ldKTtcclxuICAgICAgICAgICAgICAgIHJpZ2h0TnVtcy5wdXNoKG51bXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnNvcnRDb2wobGVmdE51bXMsIGxlZnRWYWxzLCBzb3J0ZXIpLmNvbmNhdChudW1zWzBdKVxyXG4gICAgICAgICAgICAuY29uY2F0KHRoaXMuc29ydENvbChyaWdodE51bXMsIHJpZ2h0VmFscywgc29ydGVyKSk7XHJcbiAgICB9O1xyXG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlldy5wcm90b3R5cGUuY3JlYXRlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKHZpZXcpIHtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB7XHJcbiAgICAgICAgICAgICAgICByb3dCZWZvcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZCByb3cgYmVmb3JlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuaW5zZXJ0Um93KHZpZXcubXYuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByb3dBZnRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkIHJvdyBhZnRlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3Lmluc2VydFJvdyh2aWV3Lm12LmZvY3VzZWRDZWxsWSArIDEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbEJlZm9yZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkIGNvbCBiZWZvcmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5pbnNlcnRDb2wodmlldy5tdi5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbEFmdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGQgY29sIGFmdGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuaW5zZXJ0Q29sKHZpZXcubXYuZm9jdXNlZENlbGxYICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVsUm93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcm93XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuZGVsZXRlUm93KHZpZXcubXYuZm9jdXNlZENlbGxZKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWxDb2w6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZSBjb2xcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5kZWxldGVDb2wodmlldy5tdi5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNvcnRDb2xBc2M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNvcnQgY29sIGFzY1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNvcnRDb2xBc2Modmlldy5tdi5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNvcnRDb2xEZXNjOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTb3J0IGNvbCBkZXNjXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc29ydENvbERlc2Modmlldy5tdi5mb2N1c2VkQ2VsbFgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIHJvd0JlZm9yZUl0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIkluc2VydCBSb3cgQmVmb3JlXCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdyb3dCZWZvcmUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgcm93QWZ0ZXJJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJJbnNlcnQgUm93IEFmdGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdyb3dBZnRlcidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBjb2xCZWZvcmVJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogXCJJbnNlcnQgQ29sdW1uIEJlZm9yZVwiLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY29sQmVmb3JlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGNvbEFmdGVySXRlbSA9IG5ldyBwaG9zcGhvcl9tZW51c18xLk1lbnVJdGVtKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiSW5zZXJ0IENvbHVtbiBBZnRlclwiLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY29sQWZ0ZXInXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgZGVsUm93SXRlbSA9IG5ldyBwaG9zcGhvcl9tZW51c18xLk1lbnVJdGVtKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVsZXRlIFJvd1wiLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGVsUm93J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGRlbENvbEl0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlbGV0ZSBDb2x1bW5cIixcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2RlbENvbCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBzb3J0Q29sQXNjSXRlbSA9IG5ldyBwaG9zcGhvcl9tZW51c18xLk1lbnVJdGVtKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiU29ydCBCeSBDb2x1bW4gQS1aXCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdzb3J0QXNjQ29sJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIHNvcnRDb2xEZXNjSXRlbSA9IG5ldyBwaG9zcGhvcl9tZW51c18xLk1lbnVJdGVtKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiU29ydCBCeSBDb2x1bW4gWi1BXCIsXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdzb3J0RGVzY0NvbCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJvd0JlZm9yZUl0ZW0uaGFuZGxlciA9IGhhbmRsZXIucm93QmVmb3JlO1xyXG4gICAgICAgICAgICByb3dBZnRlckl0ZW0uaGFuZGxlciA9IGhhbmRsZXIucm93QWZ0ZXI7XHJcbiAgICAgICAgICAgIGNvbEJlZm9yZUl0ZW0uaGFuZGxlciA9IGhhbmRsZXIuY29sQmVmb3JlO1xyXG4gICAgICAgICAgICBjb2xBZnRlckl0ZW0uaGFuZGxlciA9IGhhbmRsZXIuY29sQWZ0ZXI7XHJcbiAgICAgICAgICAgIGRlbFJvd0l0ZW0uaGFuZGxlciA9IGhhbmRsZXIuZGVsUm93O1xyXG4gICAgICAgICAgICBkZWxDb2xJdGVtLmhhbmRsZXIgPSBoYW5kbGVyLmRlbENvbDtcclxuICAgICAgICAgICAgc29ydENvbEFzY0l0ZW0uaGFuZGxlciA9IGhhbmRsZXIuc29ydENvbEFzYztcclxuICAgICAgICAgICAgc29ydENvbERlc2NJdGVtLmhhbmRsZXIgPSBoYW5kbGVyLnNvcnRDb2xEZXNjO1xyXG4gICAgICAgICAgICB2YXIgcmlnaHRDbGlja01lbnUgPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51KCk7XHJcbiAgICAgICAgICAgIHJpZ2h0Q2xpY2tNZW51Lml0ZW1zID0gW1xyXG4gICAgICAgICAgICAgICAgcm93QmVmb3JlSXRlbSxcclxuICAgICAgICAgICAgICAgIHJvd0FmdGVySXRlbSxcclxuICAgICAgICAgICAgICAgIGNvbEJlZm9yZUl0ZW0sXHJcbiAgICAgICAgICAgICAgICBjb2xBZnRlckl0ZW0sXHJcbiAgICAgICAgICAgICAgICBkZWxSb3dJdGVtLFxyXG4gICAgICAgICAgICAgICAgZGVsQ29sSXRlbSxcclxuICAgICAgICAgICAgICAgIHNvcnRDb2xBc2NJdGVtLFxyXG4gICAgICAgICAgICAgICAgc29ydENvbERlc2NJdGVtXTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgICAgICAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgICAgICAgICByaWdodENsaWNrTWVudS5wb3B1cCh4LCB5KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEhUTUxTcHJlYWRzaGVldFZpZXc7XHJcbn0pKHBob3NwaG9yX3dpZGdldF8xLldpZGdldCk7XHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBzZXR1cCgpO1xyXG59XHJcbmZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgLy92YXIgc3ByZWFkc2hlZXQgPSBuZXcgU3ByZWFkc2hlZXQoMjcsIDYwKTtcclxuICAgIHZhciBzcHJlYWRzaGVldDIgPSBuZXcgSFRNTFNwcmVhZHNoZWV0VmlldyhuZXcgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsKG5ldyBIVE1MU3ByZWFkc2hlZXRNb2RlbCgyNywgNjApKSk7XHJcbiAgICBzcHJlYWRzaGVldDIuYWRkQ2xhc3MoXCJzY3JvbGxcIik7XHJcbiAgICBwaG9zcGhvcl93aWRnZXRfMS5hdHRhY2hXaWRnZXQoc3ByZWFkc2hlZXQyLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpKTtcclxuICAgIC8vc3ByZWFkc2hlZXQuYXR0YWNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpO1xyXG4gICAgLy9zcENvbC5ob3Jpem9udGFsU2l6ZVBvbGljeSA9IFNpemVQb2xpY3kuRml4ZWQ7XHJcbiAgICAvL3NwcmVhZHNoZWV0LmZpdCgpO1xyXG4gICAgLy9zcHJlYWRzaGVldDIuZml0KCk7XHJcbiAgICAvL3dpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHNwcmVhZHNoZWV0LmZpdCgpO1xyXG4gICAgd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc3ByZWFkc2hlZXQyLnVwZGF0ZSgpOyB9O1xyXG4gICAgY29uc29sZS5sb2coXCJibGFoaFwiKTtcclxufVxyXG53aW5kb3cub25sb2FkID0gbWFpbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3ByZWFkc2hlZXQuanMubWFwIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgYnJvd3NlciBmaWVsZCwgY2hlY2sgb3V0IHRoZSBicm93c2VyIGZpZWxkIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9icm93c2VyaWZ5LWhhbmRib29rI2Jyb3dzZXItZmllbGQuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIENyZWF0ZSBhIDxsaW5rPiB0YWcgd2l0aCBvcHRpb25hbCBkYXRhIGF0dHJpYnV0ZXNcbiAgICBjcmVhdGVMaW5rOiBmdW5jdGlvbihocmVmLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcblxuICAgICAgICBsaW5rLmhyZWYgPSBocmVmO1xuICAgICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCAhIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9LFxuICAgIC8vIENyZWF0ZSBhIDxzdHlsZT4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlU3R5bGU6IGZ1bmN0aW9uKGNzc1RleHQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0sXG4gICAgICAgICAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChzdHlsZS5zaGVldCkgeyAvLyBmb3IganNkb20gYW5kIElFOStcbiAgICAgICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBzdHlsZS5zaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHsgLy8gZm9yIElFOCBhbmQgYmVsb3dcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzVGV4dDtcbiAgICAgICAgfSBlbHNlIHsgLy8gZm9yIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaVxuICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG4vKipcbiAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBlbGVtZW50IGluIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gaXRlcmF0ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciB0aGUgYXJyYXkgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIGZyb21JbmRleCAtIFRoZSBzdGFydGluZyBpbmRleCBmb3IgaXRlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSB3cmFwIC0gV2hldGhlciBpdGVyYXRpb24gd3JhcHMgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICpcbiAqIEByZXR1cm5zIFRoZSBmaXJzdCB2YWx1ZSByZXR1cm5lZCBieSBgY2FsbGJhY2tgIHdoaWNoIGlzIG5vdFxuICogICBlcXVhbCB0byBgdW5kZWZpbmVkYCwgb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGNhbGxiYWNrIGRvZXNcbiAqICAgbm90IHJldHVybiBhIHZhbHVlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgdG8gbW9kaWZ5IHRoZSBzaXplIG9mIHRoZSBhcnJheSB3aGlsZSBpdGVyYXRpbmcuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBsb2dnZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMSwgMiwgMywgNF07XG4gKiBhcnJheXMuZm9yRWFjaChkYXRhLCBsb2dnZXIpOyAgICAgICAgICAgLy8gbG9ncyAxLCAyLCAzLCA0XG4gKiBhcnJheXMuZm9yRWFjaChkYXRhLCBsb2dnZXIsIDIpOyAgICAgICAgLy8gbG9ncyAzLCA0XG4gKiBhcnJheXMuZm9yRWFjaChkYXRhLCBsb2dnZXIsIDIsIHRydWUpOyAgLy8gbG9ncyAzLCA0LCAxLCAyXG4gKiBhcnJheXMuZm9yRWFjaChkYXRhLCAodiwgaSkgPT4geyAgICAgICAgLy8gMlxuICogICBpZiAodiA9PT0gMykgcmV0dXJuIGk7XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW3Jmb3JFYWNoXV1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChhcnJheSwgY2FsbGJhY2ssIGZyb21JbmRleCwgd3JhcCkge1xuICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSAwOyB9XG4gICAgaWYgKHdyYXAgPT09IHZvaWQgMCkgeyB3cmFwID0gZmFsc2U7IH1cbiAgICB2YXIgc3RhcnQgPSBmcm9tSW5kZXggfCAwO1xuICAgIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh3cmFwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgaiA9IChzdGFydCArIGkpICUgbjtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhhcnJheVtqXSwgaik7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB2b2lkIDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0LCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYXJyYXlbaV0sIGkpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZvaWQgMDtcbn1cbmV4cG9ydHMuZm9yRWFjaCA9IGZvckVhY2g7XG4vKipcbiAqIEV4ZWN1dGUgYSBjYWxsYmFjayBmb3IgZWFjaCBlbGVtZW50IGluIGFuIGFycmF5LCBpbiByZXZlcnNlLlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gaXRlcmF0ZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciB0aGUgYXJyYXkgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIGZyb21JbmRleCAtIFRoZSBzdGFydGluZyBpbmRleCBmb3IgaXRlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSB3cmFwIC0gV2hldGhlciBpdGVyYXRpb24gd3JhcHMgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICpcbiAqIEByZXR1cm5zIFRoZSBmaXJzdCB2YWx1ZSByZXR1cm5lZCBieSBgY2FsbGJhY2tgIHdoaWNoIGlzIG5vdFxuICogICBlcXVhbCB0byBgdW5kZWZpbmVkYCwgb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGNhbGxiYWNrIGRvZXNcbiAqICAgbm90IHJldHVybiBhIHZhbHVlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgdG8gbW9kaWZ5IHRoZSBzaXplIG9mIHRoZSBhcnJheSB3aGlsZSBpdGVyYXRpbmcuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBsb2dnZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMSwgMiwgMywgNF07XG4gKiBhcnJheXMucmZvckVhY2goZGF0YSwgbG9nZ2VyKTsgICAgICAgICAgIC8vIGxvZ3MgNCwgMywgMiwgMVxuICogYXJyYXlzLnJmb3JFYWNoKGRhdGEsIGxvZ2dlciwgMik7ICAgICAgICAvLyBsb2dzIDMsIDIsIDFcbiAqIGFycmF5cy5yZm9yRWFjaChkYXRhLCBsb2dnZXIsIDIsIHRydWUpOyAgLy8gbG9ncyAzLCAyLCAxLCA0XG4gKiBhcnJheXMucmZvckVhY2goZGF0YSwgKHYsIGkpID0+IHsgICAgICAgIC8vIDJcbiAqICAgaWYgKHYgPT09IDMpIHJldHVybiBpO1xuICogfSk7XG4gKiBgYGBcbiAqICoqU2VlIGFsc28qKiBbW2ZvckVhY2hdXVxuICovXG5mdW5jdGlvbiByZm9yRWFjaChhcnJheSwgY2FsbGJhY2ssIGZyb21JbmRleCwgd3JhcCkge1xuICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSBhcnJheS5sZW5ndGggLSAxOyB9XG4gICAgaWYgKHdyYXAgPT09IHZvaWQgMCkgeyB3cmFwID0gZmFsc2U7IH1cbiAgICB2YXIgc3RhcnQgPSBmcm9tSW5kZXggfCAwO1xuICAgIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh3cmFwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgaiA9IChzdGFydCAtIGkgKyBuKSAlIG47XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYXJyYXlbal0sIGopO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhhcnJheVtpXSwgaSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB2b2lkIDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdm9pZCAwO1xufVxuZXhwb3J0cy5yZm9yRWFjaCA9IHJmb3JFYWNoO1xuLyoqXG4gKiBGaW5kIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggbWF0Y2hlcyBhIHByZWRpY2F0ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLlxuICpcbiAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgdGhlIHNlYXJjaCB3cmFwcyBhcm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBtYXRjaGluZyB2YWx1ZSwgb3IgYC0xYCBpZiBubyB2YWx1ZVxuICogICBtYXRjaGVzIHRoZSBwcmVkaWNhdGUgb3IgaWYgdGhlIHN0YXJ0IGluZGV4IGlzIG91dCBvZiByYW5nZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBJdCBpcyBub3Qgc2FmZSB0byBtb2RpZnkgdGhlIHNpemUgb2YgdGhlIGFycmF5IHdoaWxlIGl0ZXJhdGluZy5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIGZ1bmN0aW9uIGlzRXZlbih2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gKiAgIHJldHVybiB2YWx1ZSAlIDIgPT09IDA7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMSwgMiwgMywgNCwgMywgMiwgMV07XG4gKiBhcnJheXMuZmluZEluZGV4KGRhdGEsIGlzRXZlbik7ICAgICAgICAgICAvLyAxXG4gKiBhcnJheXMuZmluZEluZGV4KGRhdGEsIGlzRXZlbiwgNCk7ICAgICAgICAvLyA1XG4gKiBhcnJheXMuZmluZEluZGV4KGRhdGEsIGlzRXZlbiwgNik7ICAgICAgICAvLyAtMVxuICogYXJyYXlzLmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDYsIHRydWUpOyAgLy8gMVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmZpbmRJbmRleF1dLlxuICovXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIHByZWQsIGZyb21JbmRleCwgd3JhcCkge1xuICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSAwOyB9XG4gICAgaWYgKHdyYXAgPT09IHZvaWQgMCkgeyB3cmFwID0gZmFsc2U7IH1cbiAgICB2YXIgc3RhcnQgPSBmcm9tSW5kZXggfCAwO1xuICAgIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBqID0gKHN0YXJ0ICsgaSkgJSBuO1xuICAgICAgICAgICAgaWYgKHByZWQoYXJyYXlbal0sIGopKVxuICAgICAgICAgICAgICAgIHJldHVybiBqO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChwcmVkKGFycmF5W2ldLCBpKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5leHBvcnRzLmZpbmRJbmRleCA9IGZpbmRJbmRleDtcbi8qKlxuICogRmluZCB0aGUgaW5kZXggb2YgdGhlIGxhc3QgdmFsdWUgd2hpY2ggbWF0Y2hlcyBhIHByZWRpY2F0ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLlxuICpcbiAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgdGhlIHNlYXJjaCB3cmFwcyBhcm91bmQgYXQgdGhlIGZyb250IG9mIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5kZXggb2YgdGhlIGxhc3QgbWF0Y2hpbmcgdmFsdWUsIG9yIGAtMWAgaWYgbm8gdmFsdWVcbiAqICAgbWF0Y2hlcyB0aGUgcHJlZGljYXRlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgdG8gbW9kaWZ5IHRoZSBzaXplIG9mIHRoZSBhcnJheSB3aGlsZSBpdGVyYXRpbmcuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBpc0V2ZW4odmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICogICByZXR1cm4gdmFsdWUgJSAyID09PSAwO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDQsIDMsIDIsIDFdO1xuICogYXJyYXlzLnJmaW5kSW5kZXgoZGF0YSwgaXNFdmVuKTsgICAgICAgICAgIC8vIDVcbiAqIGFycmF5cy5yZmluZEluZGV4KGRhdGEsIGlzRXZlbiwgNCk7ICAgICAgICAvLyAzXG4gKiBhcnJheXMucmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDApOyAgICAgICAgLy8gLTFcbiAqIGFycmF5cy5yZmluZEluZGV4KGRhdGEsIGlzRXZlbiwgMCwgdHJ1ZSk7ICAvLyA1XG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tmaW5kSW5kZXhdXS5cbiAqL1xuZnVuY3Rpb24gcmZpbmRJbmRleChhcnJheSwgcHJlZCwgZnJvbUluZGV4LCB3cmFwKSB7XG4gICAgaWYgKGZyb21JbmRleCA9PT0gdm9pZCAwKSB7IGZyb21JbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7IH1cbiAgICBpZiAod3JhcCA9PT0gdm9pZCAwKSB7IHdyYXAgPSBmYWxzZTsgfVxuICAgIHZhciBzdGFydCA9IGZyb21JbmRleCB8IDA7XG4gICAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSBhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBpZiAod3JhcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIGogPSAoc3RhcnQgLSBpICsgbikgJSBuO1xuICAgICAgICAgICAgaWYgKHByZWQoYXJyYXlbal0sIGopKVxuICAgICAgICAgICAgICAgIHJldHVybiBqO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBpZiAocHJlZChhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuZXhwb3J0cy5yZmluZEluZGV4ID0gcmZpbmRJbmRleDtcbi8qKlxuICogRmluZCB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggbWF0Y2hlcyBhIHByZWRpY2F0ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLlxuICpcbiAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgdGhlIHNlYXJjaCB3cmFwcyBhcm91bmQgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGZpcnN0IG1hdGNoaW5nIHZhbHVlLCBvciBgdW5kZWZpbmVkYCBpZiBubyB2YWx1ZSBtYXRjaGVzXG4gKiAgIHRoZSBwcmVkaWNhdGUgb3IgaWYgdGhlIHN0YXJ0IGluZGV4IGlzIG91dCBvZiByYW5nZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBJdCBpcyBub3Qgc2FmZSB0byBtb2RpZnkgdGhlIHNpemUgb2YgdGhlIGFycmF5IHdoaWxlIGl0ZXJhdGluZy5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIGZ1bmN0aW9uIGlzRXZlbih2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gKiAgIHJldHVybiB2YWx1ZSAlIDIgPT09IDA7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMSwgMiwgMywgNCwgMywgMiwgMV07XG4gKiBhcnJheXMuZmluZChkYXRhLCBpc0V2ZW4pOyAgICAgICAgICAgLy8gMlxuICogYXJyYXlzLmZpbmQoZGF0YSwgaXNFdmVuLCA0KTsgICAgICAgIC8vIDJcbiAqIGFycmF5cy5maW5kKGRhdGEsIGlzRXZlbiwgNik7ICAgICAgICAvLyB1bmRlZmluZWRcbiAqIGFycmF5cy5maW5kKGRhdGEsIGlzRXZlbiwgNiwgdHJ1ZSk7ICAvLyAyXG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tyZmluZF1dLlxuICovXG5mdW5jdGlvbiBmaW5kKGFycmF5LCBwcmVkLCBmcm9tSW5kZXgsIHdyYXApIHtcbiAgICB2YXIgaSA9IGZpbmRJbmRleChhcnJheSwgcHJlZCwgZnJvbUluZGV4LCB3cmFwKTtcbiAgICByZXR1cm4gaSAhPT0gLTEgPyBhcnJheVtpXSA6IHZvaWQgMDtcbn1cbmV4cG9ydHMuZmluZCA9IGZpbmQ7XG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgdmFsdWUgd2hpY2ggbWF0Y2hlcyBhIHByZWRpY2F0ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLlxuICpcbiAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgdGhlIHNlYXJjaCB3cmFwcyBhcm91bmQgYXQgdGhlIGZyb250IG9mIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgbGFzdCBtYXRjaGluZyB2YWx1ZSwgb3IgYHVuZGVmaW5lZGAgaWYgbm8gdmFsdWUgbWF0Y2hlc1xuICogICB0aGUgcHJlZGljYXRlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhlIHJhbmdlIG9mIHZpc2l0ZWQgaW5kaWNlcyBpcyBzZXQgYmVmb3JlIHRoZSBmaXJzdCBpbnZvY2F0aW9uIG9mXG4gKiBgcHJlZGAuIEl0IGlzIG5vdCBzYWZlIGZvciBgcHJlZGAgdG8gY2hhbmdlIHRoZSBsZW5ndGggb2YgYGFycmF5YC5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIGZ1bmN0aW9uIGlzRXZlbih2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gKiAgIHJldHVybiB2YWx1ZSAlIDIgPT09IDA7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMSwgMiwgMywgNCwgMywgMiwgMV07XG4gKiBhcnJheXMucmZpbmQoZGF0YSwgaXNFdmVuKTsgICAgICAgICAgIC8vIDJcbiAqIGFycmF5cy5yZmluZChkYXRhLCBpc0V2ZW4sIDQpOyAgICAgICAgLy8gNFxuICogYXJyYXlzLnJmaW5kKGRhdGEsIGlzRXZlbiwgMCk7ICAgICAgICAvLyB1bmRlZmluZWRcbiAqIGFycmF5cy5yZmluZChkYXRhLCBpc0V2ZW4sIDAsIHRydWUpOyAgLy8gMlxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbZmluZF1dLlxuICovXG5mdW5jdGlvbiByZmluZChhcnJheSwgcHJlZCwgZnJvbUluZGV4LCB3cmFwKSB7XG4gICAgdmFyIGkgPSByZmluZEluZGV4KGFycmF5LCBwcmVkLCBmcm9tSW5kZXgsIHdyYXApO1xuICAgIHJldHVybiBpICE9PSAtMSA/IGFycmF5W2ldIDogdm9pZCAwO1xufVxuZXhwb3J0cy5yZmluZCA9IHJmaW5kO1xuLyoqXG4gKiBJbnNlcnQgYW4gZWxlbWVudCBpbnRvIGFuIGFycmF5IGF0IGEgc3BlY2lmaWVkIGluZGV4LlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gbW9kaWZ5LlxuICpcbiAqIEBwYXJhbSBpbmRleCAtIFRoZSBpbmRleCBhdCB3aGljaCB0byBpbnNlcnQgdGhlIHZhbHVlLiBUaGlzIHZhbHVlXG4gKiAgIGlzIGNsYW1wZWQgdG8gdGhlIGJvdW5kcyBvZiB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGluc2VydCBpbnRvIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5kZXggYXQgd2hpY2ggdGhlIHZhbHVlIHdhcyBpbnNlcnRlZC5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIHZhciBkYXRhID0gWzAsIDEsIDIsIDMsIDRdO1xuICogYXJyYXlzLmluc2VydChkYXRhLCAwLCAxMik7ICAvLyAwXG4gKiBhcnJheXMuaW5zZXJ0KGRhdGEsIDMsIDQyKTsgIC8vIDNcbiAqIGFycmF5cy5pbnNlcnQoZGF0YSwgLTksIDkpOyAgLy8gMFxuICogYXJyYXlzLmluc2VydChkYXRhLCAxMiwgOCk7ICAvLyA4XG4gKiBjb25zb2xlLmxvZyhkYXRhKTsgICAgICAgICAgIC8vIFs5LCAxMiwgMCwgMSwgNDIsIDIsIDMsIDQsIDhdXG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tyZW1vdmVBdF1dIGFuZCBbW3JlbW92ZV1dXG4gKi9cbmZ1bmN0aW9uIGluc2VydChhcnJheSwgaW5kZXgsIHZhbHVlKSB7XG4gICAgdmFyIGogPSBNYXRoLm1heCgwLCBNYXRoLm1pbihpbmRleCB8IDAsIGFycmF5Lmxlbmd0aCkpO1xuICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGg7IGkgPiBqOyAtLWkpIHtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtpIC0gMV07XG4gICAgfVxuICAgIGFycmF5W2pdID0gdmFsdWU7XG4gICAgcmV0dXJuIGo7XG59XG5leHBvcnRzLmluc2VydCA9IGluc2VydDtcbi8qKlxuICogTW92ZSBhbiBlbGVtZW50IGluIGFuIGFycmF5IGZyb20gb25lIGluZGV4IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBtb2RpZnkuXG4gKlxuICogQHBhcmFtIGZyb21JbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCB0byBtb3ZlLlxuICpcbiAqIEBwYXJhbSB0b0luZGV4IC0gVGhlIHRhcmdldCBpbmRleCBvZiB0aGUgZWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVsZW1lbnQgd2FzIG1vdmVkLCBvciBgZmFsc2VgIGlmIGVpdGhlclxuICogICBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiB2YXIgZGF0YSA9IFswLCAxLCAyLCAzLCA0XTtcbiAqIGFycmF5cy5tb3ZlKGRhdGEsIDEsIDIpOyAgIC8vIHRydWVcbiAqIGFycmF5cy5tb3ZlKGRhdGEsIC0xLCAwKTsgIC8vIGZhbHNlXG4gKiBhcnJheXMubW92ZShkYXRhLCA0LCAyKTsgICAvLyB0cnVlXG4gKiBhcnJheXMubW92ZShkYXRhLCAxMCwgMCk7ICAvLyBmYWxzZVxuICogY29uc29sZS5sb2coZGF0YSk7ICAgICAgICAgLy8gWzAsIDIsIDQsIDEsIDNdXG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gbW92ZShhcnJheSwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gICAgdmFyIGogPSBmcm9tSW5kZXggfCAwO1xuICAgIGlmIChqIDwgMCB8fCBqID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBrID0gdG9JbmRleCB8IDA7XG4gICAgaWYgKGsgPCAwIHx8IGsgPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbal07XG4gICAgaWYgKGogPiBrKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBqOyBpID4gazsgLS1pKSB7XG4gICAgICAgICAgICBhcnJheVtpXSA9IGFycmF5W2kgLSAxXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChqIDwgaykge1xuICAgICAgICBmb3IgKHZhciBpID0gajsgaSA8IGs7ICsraSkge1xuICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtpICsgMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXJyYXlba10gPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMubW92ZSA9IG1vdmU7XG4vKipcbiAqIFJlbW92ZSBhbiBlbGVtZW50IGZyb20gYW4gYXJyYXkgYXQgYSBzcGVjaWZpZWQgaW5kZXguXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBtb2RpZnkuXG4gKlxuICogQHBhcmFtIGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJlbW92ZS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgcmVtb3ZlZCB2YWx1ZSwgb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGluZGV4IGlzIG91dFxuICogICBvZiByYW5nZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIHZhciBkYXRhID0gWzAsIDEsIDIsIDMsIDRdO1xuICogYXJyYXlzLnJlbW92ZUF0KGRhdGEsIDEpOyAgIC8vIDFcbiAqIGFycmF5cy5yZW1vdmVBdChkYXRhLCAzKTsgICAvLyA0XG4gKiBhcnJheXMucmVtb3ZlQXQoZGF0YSwgMTApOyAgLy8gdW5kZWZpbmVkXG4gKiBjb25zb2xlLmxvZyhkYXRhKTsgICAgICAgICAgLy8gWzAsIDIsIDNdXG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tyZW1vdmVdXSBhbmQgW1tpbnNlcnRdXVxuICovXG5mdW5jdGlvbiByZW1vdmVBdChhcnJheSwgaW5kZXgpIHtcbiAgICB2YXIgaiA9IGluZGV4IHwgMDtcbiAgICBpZiAoaiA8IDAgfHwgaiA+PSBhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbal07XG4gICAgZm9yICh2YXIgaSA9IGogKyAxLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGFycmF5W2kgLSAxXSA9IGFycmF5W2ldO1xuICAgIH1cbiAgICBhcnJheS5sZW5ndGggLT0gMTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5leHBvcnRzLnJlbW92ZUF0ID0gcmVtb3ZlQXQ7XG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHZhbHVlIGZyb20gYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBtb2RpZnkuXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHJlbW92ZSBmcm9tIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5kZXggd2hlcmUgdGhlIHZhbHVlIHdhcyBsb2NhdGVkLCBvciBgLTFgIGlmIHRoZVxuICogICB2YWx1ZSBpcyBub3QgdGhlIGFycmF5LlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogdmFyIGRhdGEgPSBbMCwgMSwgMiwgMywgNF07XG4gKiBhcnJheXMucmVtb3ZlKGRhdGEsIDEpOyAgLy8gMVxuICogYXJyYXlzLnJlbW92ZShkYXRhLCAzKTsgIC8vIDJcbiAqIGFycmF5cy5yZW1vdmUoZGF0YSwgNyk7ICAvLyAtMVxuICogY29uc29sZS5sb2coZGF0YSk7ICAgICAgIC8vIFswLCAyLCA0XVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmVtb3ZlQXRdXSBhbmQgW1tpbnNlcnRdXVxuICovXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIHZhbHVlKSB7XG4gICAgdmFyIGogPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBqID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChqID09PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBqICsgMSwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBhcnJheVtpIC0gMV0gPSBhcnJheVtpXTtcbiAgICB9XG4gICAgYXJyYXkubGVuZ3RoIC09IDE7XG4gICAgcmV0dXJuIGo7XG59XG5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZTtcbi8qKlxuICogUmV2ZXJzZSBhbiBhcnJheSBpbi1wbGFjZSBzdWJqZWN0IHRvIGFuIG9wdGlvbmFsIHJhbmdlLlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSB0byByZXZlcnNlLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIHJhbmdlLlxuICogICBUaGlzIHZhbHVlIHdpbGwgYmUgY2xhbXBlZCB0byB0aGUgYXJyYXkgYm91bmRzLlxuICpcbiAqIEBwYXJhbSB0b0luZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIHJhbmdlLlxuICogICBUaGlzIHZhbHVlIHdpbGwgYmUgY2xhbXBlZCB0byB0aGUgYXJyYXkgYm91bmRzLlxuICpcbiAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBhcnJheS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIHZhciBkYXRhID0gWzAsIDEsIDIsIDMsIDRdO1xuICogYXJyYXlzLnJldmVyc2UoZGF0YSwgMSwgMyk7ICAgIC8vIFswLCAzLCAyLCAxLCA0XVxuICogYXJyYXlzLnJldmVyc2UoZGF0YSwgMyk7ICAgICAgIC8vIFswLCAzLCAyLCA0LCAxXVxuICogYXJyYXlzLnJldmVyc2UoZGF0YSk7ICAgICAgICAgIC8vIFsxLCA0LCAyLCAzLCAwXVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcm90YXRlXV1cbiAqL1xuZnVuY3Rpb24gcmV2ZXJzZShhcnJheSwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gICAgaWYgKGZyb21JbmRleCA9PT0gdm9pZCAwKSB7IGZyb21JbmRleCA9IDA7IH1cbiAgICBpZiAodG9JbmRleCA9PT0gdm9pZCAwKSB7IHRvSW5kZXggPSBhcnJheS5sZW5ndGg7IH1cbiAgICB2YXIgaSA9IE1hdGgubWF4KDAsIE1hdGgubWluKGZyb21JbmRleCB8IDAsIGFycmF5Lmxlbmd0aCAtIDEpKTtcbiAgICB2YXIgaiA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRvSW5kZXggfCAwLCBhcnJheS5sZW5ndGggLSAxKSk7XG4gICAgaWYgKGogPCBpKVxuICAgICAgICBpID0gaiArIChqID0gaSwgMCk7XG4gICAgd2hpbGUgKGkgPCBqKSB7XG4gICAgICAgIHZhciB0bXB2YWwgPSBhcnJheVtpXTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGFycmF5W2pdO1xuICAgICAgICBhcnJheVtqLS1dID0gdG1wdmFsO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5leHBvcnRzLnJldmVyc2UgPSByZXZlcnNlO1xuLyoqXG4gKiBSb3RhdGUgdGhlIGVsZW1lbnRzIG9mIGFuIGFycmF5IGJ5IGEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgZGVsdGEuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IHRvIHJvdGF0ZS5cbiAqXG4gKiBAcGFyYW0gZGVsdGEgLSBUaGUgYW1vdW50IG9mIHJvdGF0aW9uIHRvIGFwcGx5IHRvIHRoZSBlbGVtZW50cy4gQVxuICogICBwb3NpdGl2ZSBkZWx0YSB3aWxsIHNoaWZ0IHRoZSBlbGVtZW50cyB0byB0aGUgbGVmdC4gQSBuZWdhdGl2ZVxuICogICBkZWx0YSB3aWxsIHNoaWZ0IHRoZSBlbGVtZW50cyB0byB0aGUgcmlnaHQuXG4gKlxuICogQHJldHVybnMgQSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIGFycmF5LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgZXhlY3V0ZXMgaW4gYE8obilgIHRpbWUgYW5kIGBPKDEpYCBzcGFjZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIHZhciBkYXRhID0gWzAsIDEsIDIsIDMsIDRdO1xuICogYXJyYXlzLnJvdGF0ZShkYXRhLCAyKTsgICAgLy8gWzIsIDMsIDQsIDAsIDFdXG4gKiBhcnJheXMucm90YXRlKGRhdGEsIC0yKTsgICAvLyBbMCwgMSwgMiwgMywgNF1cbiAqIGFycmF5cy5yb3RhdGUoZGF0YSwgMTApOyAgIC8vIFswLCAxLCAyLCAzLCA0XVxuICogYXJyYXlzLnJvdGF0ZShkYXRhLCA5KTsgICAgLy8gWzQsIDAsIDEsIDIsIDNdXG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tyZXZlcnNlXV1cbiAqL1xuZnVuY3Rpb24gcm90YXRlKGFycmF5LCBkZWx0YSkge1xuICAgIHZhciBuID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgICB2YXIgZCA9IGRlbHRhIHwgMDtcbiAgICBpZiAoZCA+IDApIHtcbiAgICAgICAgZCA9IGQgJSBuO1xuICAgIH1cbiAgICBlbHNlIGlmIChkIDwgMCkge1xuICAgICAgICBkID0gKChkICUgbikgKyBuKSAlIG47XG4gICAgfVxuICAgIGlmIChkID09PSAwKSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgcmV2ZXJzZShhcnJheSwgMCwgZCAtIDEpO1xuICAgIHJldmVyc2UoYXJyYXksIGQsIG4gLSAxKTtcbiAgICByZXZlcnNlKGFycmF5LCAwLCBuIC0gMSk7XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZXhwb3J0cy5yb3RhdGUgPSByb3RhdGU7XG4vKipcbiAqIFVzaW5nIGEgYmluYXJ5IHNlYXJjaCwgZmluZCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gYW5cbiAqIGFycmF5IHdoaWNoIGNvbXBhcmVzIGA+PWAgdG8gYSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLiBJdCBtdXN0IGJlIHNvcnRlZFxuICogICBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGxvY2F0ZSBpbiB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIGNtcCAtIFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYHRydWVgIGlmIGFuXG4gKiAgIGFycmF5IGVsZW1lbnQgaXMgbGVzcyB0aGFuIHRoZSBnaXZlbiB2YWx1ZS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gYGFycmF5YCB3aGljaCBjb21wYXJlc1xuICogICBgPj1gIHRvIGB2YWx1ZWAsIG9yIGBhcnJheS5sZW5ndGhgIGlmIHRoZXJlIGlzIG5vIHN1Y2ggZWxlbWVudC5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBJdCBpcyBub3Qgc2FmZSBmb3IgdGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gdG8gbW9kaWZ5IHRoZSBhcnJheS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIGZ1bmN0aW9uIG51bWJlckNtcChhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xuICogICByZXR1cm4gYSA8IGI7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMCwgMywgNCwgNywgNywgOV07XG4gKiBhcnJheXMubG93ZXJCb3VuZChkYXRhLCAwLCBudW1iZXJDbXApOyAgIC8vIDBcbiAqIGFycmF5cy5sb3dlckJvdW5kKGRhdGEsIDYsIG51bWJlckNtcCk7ICAgLy8gM1xuICogYXJyYXlzLmxvd2VyQm91bmQoZGF0YSwgNywgbnVtYmVyQ21wKTsgICAvLyAzXG4gKiBhcnJheXMubG93ZXJCb3VuZChkYXRhLCAtMSwgbnVtYmVyQ21wKTsgIC8vIDBcbiAqIGFycmF5cy5sb3dlckJvdW5kKGRhdGEsIDEwLCBudW1iZXJDbXApOyAgLy8gNlxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbdXBwZXJCb3VuZF1dXG4gKi9cbmZ1bmN0aW9uIGxvd2VyQm91bmQoYXJyYXksIHZhbHVlLCBjbXApIHtcbiAgICB2YXIgYmVnaW4gPSAwO1xuICAgIHZhciBoYWxmO1xuICAgIHZhciBtaWRkbGU7XG4gICAgdmFyIG4gPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIGhhbGYgPSBuID4+IDE7XG4gICAgICAgIG1pZGRsZSA9IGJlZ2luICsgaGFsZjtcbiAgICAgICAgaWYgKGNtcChhcnJheVttaWRkbGVdLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIGJlZ2luID0gbWlkZGxlICsgMTtcbiAgICAgICAgICAgIG4gLT0gaGFsZiArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuID0gaGFsZjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmVnaW47XG59XG5leHBvcnRzLmxvd2VyQm91bmQgPSBsb3dlckJvdW5kO1xuLyoqXG4gKiBVc2luZyBhIGJpbmFyeSBzZWFyY2gsIGZpbmQgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuXG4gKiBhcnJheSB3aGljaCBjb21wYXJlcyBgPmAgdGhhbiBhIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gYmUgc2VhcmNoZWQuIEl0IG11c3QgYmUgc29ydGVkXG4gKiAgIGluIGFzY2VuZGluZyBvcmRlci5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gbG9jYXRlIGluIHRoZSBhcnJheS5cbiAqXG4gKiBAcGFyYW0gY21wIC0gVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBgdHJ1ZWAgaWYgdGhlXG4gKiAgIHRoZSBnaXZlbiB2YWx1ZSBpcyBsZXNzIHRoYW4gYW4gYXJyYXkgZWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gYGFycmF5YCB3aGljaCBjb21wYXJlc1xuICogICBgPmAgdGhhbiBgdmFsdWVgLCBvciBgYXJyYXkubGVuZ3RoYCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnQuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgZm9yIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgYXJyYXkuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBudW1iZXJDbXAoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBudW1iZXIge1xuICogICByZXR1cm4gYSA8IGI7XG4gKiB9XG4gKlxuICogdmFyIGRhdGEgPSBbMCwgMywgNCwgNywgNywgOV07XG4gKiBhcnJheXMudXBwZXJCb3VuZChkYXRhLCAwLCBudW1iZXJDbXApOyAgIC8vIDFcbiAqIGFycmF5cy51cHBlckJvdW5kKGRhdGEsIDYsIG51bWJlckNtcCk7ICAgLy8gM1xuICogYXJyYXlzLnVwcGVyQm91bmQoZGF0YSwgNywgbnVtYmVyQ21wKTsgICAvLyA1XG4gKiBhcnJheXMudXBwZXJCb3VuZChkYXRhLCAtMSwgbnVtYmVyQ21wKTsgIC8vIDBcbiAqIGFycmF5cy51cHBlckJvdW5kKGRhdGEsIDEwLCBudW1iZXJDbXApOyAgLy8gNlxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbbG93ZXJCb3VuZF1dXG4gKi9cbmZ1bmN0aW9uIHVwcGVyQm91bmQoYXJyYXksIHZhbHVlLCBjbXApIHtcbiAgICB2YXIgYmVnaW4gPSAwO1xuICAgIHZhciBoYWxmO1xuICAgIHZhciBtaWRkbGU7XG4gICAgdmFyIG4gPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKG4gPiAwKSB7XG4gICAgICAgIGhhbGYgPSBuID4+IDE7XG4gICAgICAgIG1pZGRsZSA9IGJlZ2luICsgaGFsZjtcbiAgICAgICAgaWYgKGNtcCh2YWx1ZSwgYXJyYXlbbWlkZGxlXSkpIHtcbiAgICAgICAgICAgIG4gPSBoYWxmO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYmVnaW4gPSBtaWRkbGUgKyAxO1xuICAgICAgICAgICAgbiAtPSBoYWxmICsgMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmVnaW47XG59XG5leHBvcnRzLnVwcGVyQm91bmQgPSB1cHBlckJvdW5kO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG4vKipcbiAqIEEgZGlzcG9zYWJsZSBvYmplY3Qgd2hpY2ggZGVsZWdhdGVzIHRvIGEgY2FsbGJhY2suXG4gKi9cbnZhciBEaXNwb3NhYmxlRGVsZWdhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBkaXNwb3NhYmxlIGRlbGVnYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIGludm9rZSB3aGVuIHRoZSBkZWxlZ2F0ZSBpc1xuICAgICAqICAgZGlzcG9zZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRGlzcG9zYWJsZURlbGVnYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNwb3NhYmxlRGVsZWdhdGUucHJvdG90eXBlLCBcImlzRGlzcG9zZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSBkZWxlZ2F0ZSBoYXMgYmVlbiBkaXNwb3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5IHdoaWNoIGlzIGFsd2F5cyBzYWZlIHRvIGFjY2Vzcy5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogRGlzcG9zZSBvZiB0aGUgZGVsZWdhdGUgYW5kIGludm9rZSBpdHMgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBhbGwgY2FsbHMgbWFkZSBhZnRlciB0aGVcbiAgICAgKiBmaXJzdCB3aWxsIGJlIGEgbm8tb3AuXG4gICAgICovXG4gICAgRGlzcG9zYWJsZURlbGVnYXRlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLl9jYWxsYmFjaztcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICBpZiAoY2FsbGJhY2spXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgIH07XG4gICAgcmV0dXJuIERpc3Bvc2FibGVEZWxlZ2F0ZTtcbn0pKCk7XG5leHBvcnRzLkRpc3Bvc2FibGVEZWxlZ2F0ZSA9IERpc3Bvc2FibGVEZWxlZ2F0ZTtcbi8qKlxuICogQW4gb2JqZWN0IHdoaWNoIG1hbmFnZXMgYSBjb2xsZWN0aW9uIG9mIGRpc3Bvc2FibGUgaXRlbXMuXG4gKi9cbnZhciBEaXNwb3NhYmxlU2V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSBuZXcgZGlzcG9zYWJsZSBzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXRlbXMgLSBUaGUgaW5pdGlhbCBkaXNwb3NhYmxlIGl0ZW1zIGZvciB0aGUgc2V0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERpc3Bvc2FibGVTZXQoaXRlbXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICBpZiAoaXRlbXMpXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBfdGhpcy5fc2V0LmFkZChpdGVtKTsgfSk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEaXNwb3NhYmxlU2V0LnByb3RvdHlwZSwgXCJpc0Rpc3Bvc2VkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgc2V0IGhhcyBiZWVuIGRpc3Bvc2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkgd2hpY2ggaXMgYWx3YXlzIHNhZmUgdG8gYWNjZXNzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuX3NldDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogRGlzcG9zZSBvZiB0aGUgc2V0IGFuZCBkaXNwb3NlIHRoZSBpdGVtcyBpdCBjb250YWlucy5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJdGVtcyBhcmUgZGlzcG9zZWQgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBzZXQuXG4gICAgICpcbiAgICAgKiBJdCBpcyB1bnNhZmUgdG8gdXNlIHRoZSBzZXQgYWZ0ZXIgaXQgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICpcbiAgICAgKiBJZiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgbW9yZSB0aGFuIG9uY2UsIGFsbCBjYWxscyBtYWRlIGFmdGVyIHRoZVxuICAgICAqIGZpcnN0IHdpbGwgYmUgYSBuby1vcC5cbiAgICAgKi9cbiAgICBEaXNwb3NhYmxlU2V0LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2V0ID0gdGhpcy5fc2V0O1xuICAgICAgICB0aGlzLl9zZXQgPSBudWxsO1xuICAgICAgICBpZiAoc2V0KVxuICAgICAgICAgICAgc2V0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uZGlzcG9zZSgpOyB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGRpc3Bvc2FibGUgaXRlbSB0byB0aGUgc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW0gLSBUaGUgZGlzcG9zYWJsZSBpdGVtIHRvIGFkZCB0byB0aGUgc2V0LiBJZiB0aGUgaXRlbVxuICAgICAqICAgaXMgYWxyZWFkeSBjb250YWluZWQgaW4gdGhlIHNldCwgdGhpcyBpcyBhIG5vLW9wLlxuICAgICAqXG4gICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBzZXQgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICovXG4gICAgRGlzcG9zYWJsZVNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zZXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0IGlzIGRpc3Bvc2VkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0LmFkZChpdGVtKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGRpc3Bvc2FibGUgaXRlbSBmcm9tIHRoZSBzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXRlbSAtIFRoZSBkaXNwb3NhYmxlIGl0ZW0gdG8gcmVtb3ZlIGZyb20gdGhlIHNldC4gSWYgdGhlXG4gICAgICogICBpdGVtIGRvZXMgbm90IGV4aXN0IGluIHRoZSBzZXQsIHRoaXMgaXMgYSBuby1vcC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgc2V0IGhhcyBiZWVuIGRpc3Bvc2VkLlxuICAgICAqL1xuICAgIERpc3Bvc2FibGVTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmICghdGhpcy5fc2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBpcyBkaXNwb3NlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldC5kZWxldGUoaXRlbSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgZGlzcG9zYWJsZSBpdGVtcyBmcm9tIHRoZSBzZXQuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHNldCBoYXMgYmVlbiBkaXNwb3NlZC5cbiAgICAgKi9cbiAgICBEaXNwb3NhYmxlU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zZXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb2JqZWN0IGlzIGRpc3Bvc2VkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0LmNsZWFyKCk7XG4gICAgfTtcbiAgICByZXR1cm4gRGlzcG9zYWJsZVNldDtcbn0pKCk7XG5leHBvcnRzLkRpc3Bvc2FibGVTZXQgPSBEaXNwb3NhYmxlU2V0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwidmFyIGNzcyA9IFwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXFxufFxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cXG58XFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXFxuYm9keS5wLW1vZC1vdmVycmlkZS1jdXJzb3IgKiB7XFxuICBjdXJzb3I6IGluaGVyaXQgIWltcG9ydGFudDtcXG59XFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcIm5vZGVfbW9kdWxlc1xcXFxwaG9zcGhvci1kb211dGlsXFxcXGxpYlxcXFxpbmRleC5jc3NcIn0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgcGhvc3Bob3JfZGlzcG9zYWJsZV8xID0gcmVxdWlyZSgncGhvc3Bob3ItZGlzcG9zYWJsZScpO1xucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcbi8qKlxuICogYHAtbW9kLW92ZXJyaWRlLWN1cnNvcmA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIHRoZSBkb2N1bWVudCBib2R5XG4gKiAgIGR1cmluZyBjdXJzb3Igb3ZlcnJpZGUuXG4gKi9cbmV4cG9ydHMuT1ZFUlJJREVfQ1VSU09SX0NMQVNTID0gJ3AtbW9kLW92ZXJyaWRlLWN1cnNvcic7XG4vKipcbiAqIFRoZSBpZCBmb3IgdGhlIGFjdGl2ZSBjdXJzb3Igb3ZlcnJpZGUuXG4gKi9cbnZhciBvdmVycmlkZUlEID0gMDtcbi8qKlxuICogT3ZlcnJpZGUgdGhlIGN1cnNvciBmb3IgdGhlIGVudGlyZSBkb2N1bWVudC5cbiAqXG4gKiBAcGFyYW0gY3Vyc29yIC0gVGhlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnNvciBzdHlsZS5cbiAqXG4gKiBAcmV0dXJucyBBIGRpc3Bvc2FibGUgd2hpY2ggd2lsbCBjbGVhciB0aGUgb3ZlcnJpZGUgd2hlbiBkaXNwb3NlZC5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGUgbW9zdCByZWNlbnQgY2FsbCB0byBgb3ZlcnJpZGVDdXJzb3JgIHRha2VzIHByZWNlbmRlbmNlLiBEaXNwb3NpbmdcbiAqIGFuIG9sZCBvdmVycmlkZSBpcyBhIG5vLW9wIGFuZCB3aWxsIG5vdCBlZmZlY3QgdGhlIGN1cnJlbnQgb3ZlcnJpZGUuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvdmVycmlkZUN1cnNvciB9IGZyb20gJ3Bob3NwaG9yLWRvbXV0aWwnO1xuICpcbiAqIC8vIGZvcmNlIHRoZSBjdXJzb3IgdG8gYmUgJ3dhaXQnIGZvciB0aGUgZW50aXJlIGRvY3VtZW50XG4gKiB2YXIgb3ZlcnJpZGUgPSBvdmVycmlkZUN1cnNvcignd2FpdCcpO1xuICpcbiAqIC8vIGNsZWFyIHRoZSBvdmVycmlkZSBieSBkaXNwb3NpbmcgdGhlIHJldHVybiB2YWx1ZVxuICogb3ZlcnJpZGUuZGlzcG9zZSgpO1xuICogYGBgXG4gKi9cbmZ1bmN0aW9uIG92ZXJyaWRlQ3Vyc29yKGN1cnNvcikge1xuICAgIHZhciBpZCA9ICsrb3ZlcnJpZGVJRDtcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgYm9keS5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKGV4cG9ydHMuT1ZFUlJJREVfQ1VSU09SX0NMQVNTKTtcbiAgICByZXR1cm4gbmV3IHBob3NwaG9yX2Rpc3Bvc2FibGVfMS5EaXNwb3NhYmxlRGVsZWdhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaWQgPT09IG92ZXJyaWRlSUQpIHtcbiAgICAgICAgICAgIGJvZHkuc3R5bGUuY3Vyc29yID0gJyc7XG4gICAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoZXhwb3J0cy5PVkVSUklERV9DVVJTT1JfQ0xBU1MpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLm92ZXJyaWRlQ3Vyc29yID0gb3ZlcnJpZGVDdXJzb3I7XG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIGNsaWVudCBwb3NpdGlvbiBsaWVzIHdpdGhpbiBhIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGUgLSBUaGUgRE9NIG5vZGUgb2YgaW50ZXJlc3QuXG4gKlxuICogQHBhcmFtIGNsaWVudFggLSBUaGUgY2xpZW50IFggY29vcmRpbmF0ZSBvZiBpbnRlcmVzdC5cbiAqXG4gKiBAcGFyYW0gY2xpZW50WSAtIFRoZSBjbGllbnQgWSBjb29yZGluYXRlIG9mIGludGVyZXN0LlxuICpcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbm9kZSBjb3ZlcnMgdGhlIHBvc2l0aW9uLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IGhpdFRlc3QgfSBmcm9tICdwaG9zcGhvci1kb211dGlsJztcbiAqXG4gKiB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiBkaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICogZGl2LnN0eWxlLmxlZnQgPSAnMHB4JztcbiAqIGRpdi5zdHlsZS50b3AgPSAnMHB4JztcbiAqIGRpdi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gKiBkaXYuc3R5bGUuaGVpZ2h0ID0gJzEwMHB4JztcbiAqIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAqXG4gKiBoaXRUZXN0KGRpdiwgNTAsIDUwKTsgICAvLyB0cnVlXG4gKiBoaXRUZXN0KGRpdiwgMTUwLCAxNTApOyAvLyBmYWxzZVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGhpdFRlc3Qobm9kZSwgY2xpZW50WCwgY2xpZW50WSkge1xuICAgIHZhciByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKGNsaWVudFggPj0gcmVjdC5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPCByZWN0LnJpZ2h0ICYmXG4gICAgICAgIGNsaWVudFkgPj0gcmVjdC50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8IHJlY3QuYm90dG9tKTtcbn1cbmV4cG9ydHMuaGl0VGVzdCA9IGhpdFRlc3Q7XG4vKipcbiAqIENvbXB1dGUgdGhlIGJveCBzaXppbmcgZm9yIGEgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGUgLSBUaGUgRE9NIG5vZGUgZm9yIHdoaWNoIHRvIGNvbXB1dGUgdGhlIGJveCBzaXppbmcuXG4gKlxuICogQHJldHVybnMgVGhlIGJveCBzaXppbmcgZGF0YSBmb3IgdGhlIHNwZWNpZmllZCBET00gbm9kZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IGJveFNpemluZyB9IGZyb20gJ3Bob3NwaG9yLWRvbXV0aWwnO1xuICpcbiAqIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAqIGRpdi5zdHlsZS5ib3JkZXJUb3AgPSAnc29saWQgMTBweCBibGFjayc7XG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gKlxuICogdmFyIHNpemluZyA9IGJveFNpemluZyhkaXYpO1xuICogc2l6aW5nLmJvcmRlclRvcDsgICAgLy8gMTBcbiAqIHNpemluZy5wYWRkaW5nTGVmdDsgIC8vIDBcbiAqIC8vIGV0Yy4uLlxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGJveFNpemluZyhub2RlKSB7XG4gICAgdmFyIGNzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIHZhciBidCA9IHBhcnNlSW50KGNzdHlsZS5ib3JkZXJUb3BXaWR0aCwgMTApIHx8IDA7XG4gICAgdmFyIGJsID0gcGFyc2VJbnQoY3N0eWxlLmJvcmRlckxlZnRXaWR0aCwgMTApIHx8IDA7XG4gICAgdmFyIGJyID0gcGFyc2VJbnQoY3N0eWxlLmJvcmRlclJpZ2h0V2lkdGgsIDEwKSB8fCAwO1xuICAgIHZhciBiYiA9IHBhcnNlSW50KGNzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCwgMTApIHx8IDA7XG4gICAgdmFyIHB0ID0gcGFyc2VJbnQoY3N0eWxlLnBhZGRpbmdUb3AsIDEwKSB8fCAwO1xuICAgIHZhciBwbCA9IHBhcnNlSW50KGNzdHlsZS5wYWRkaW5nTGVmdCwgMTApIHx8IDA7XG4gICAgdmFyIHByID0gcGFyc2VJbnQoY3N0eWxlLnBhZGRpbmdSaWdodCwgMTApIHx8IDA7XG4gICAgdmFyIHBiID0gcGFyc2VJbnQoY3N0eWxlLnBhZGRpbmdCb3R0b20sIDEwKSB8fCAwO1xuICAgIHZhciBocyA9IGJsICsgcGwgKyBwciArIGJyO1xuICAgIHZhciB2cyA9IGJ0ICsgcHQgKyBwYiArIGJiO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJvcmRlclRvcDogYnQsXG4gICAgICAgIGJvcmRlckxlZnQ6IGJsLFxuICAgICAgICBib3JkZXJSaWdodDogYnIsXG4gICAgICAgIGJvcmRlckJvdHRvbTogYmIsXG4gICAgICAgIHBhZGRpbmdUb3A6IHB0LFxuICAgICAgICBwYWRkaW5nTGVmdDogcGwsXG4gICAgICAgIHBhZGRpbmdSaWdodDogcHIsXG4gICAgICAgIHBhZGRpbmdCb3R0b206IHBiLFxuICAgICAgICBob3Jpem9udGFsU3VtOiBocyxcbiAgICAgICAgdmVydGljYWxTdW06IHZzLFxuICAgIH07XG59XG5leHBvcnRzLmJveFNpemluZyA9IGJveFNpemluZztcbi8qKlxuICogQ29tcHV0ZSB0aGUgc2l6ZSBsaW1pdHMgZm9yIGEgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIG5vZGUgLSBUaGUgbm9kZSBmb3Igd2hpY2ggdG8gY29tcHV0ZSB0aGUgc2l6ZSBsaW1pdHMuXG4gKlxuICogQHJldHVybnMgVGhlIHNpemUgbGltaXQgZGF0YSBmb3IgdGhlIHNwZWNpZmllZCBET00gbm9kZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IHNpemVMaW1pdHMgfSBmcm9tICdwaG9zcGhvci1kb211dGlsJztcbiAqXG4gKiB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiBkaXYuc3R5bGUubWluV2lkdGggPSAnOTBweCc7XG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gKlxuICogdmFyIGxpbWl0cyA9IHNpemVMaW1pdHMoZGl2KTtcbiAqIGxpbWl0cy5taW5XaWR0aDsgICAvLyA5MFxuICogbGltaXRzLm1heEhlaWdodDsgIC8vIEluZmluaXR5XG4gKiAvLyBldGMuLi5cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBzaXplTGltaXRzKG5vZGUpIHtcbiAgICB2YXIgY3N0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWluV2lkdGg6IHBhcnNlSW50KGNzdHlsZS5taW5XaWR0aCwgMTApIHx8IDAsXG4gICAgICAgIG1pbkhlaWdodDogcGFyc2VJbnQoY3N0eWxlLm1pbkhlaWdodCwgMTApIHx8IDAsXG4gICAgICAgIG1heFdpZHRoOiBwYXJzZUludChjc3R5bGUubWF4V2lkdGgsIDEwKSB8fCBJbmZpbml0eSxcbiAgICAgICAgbWF4SGVpZ2h0OiBwYXJzZUludChjc3R5bGUubWF4SGVpZ2h0LCAxMCkgfHwgSW5maW5pdHksXG4gICAgfTtcbn1cbmV4cG9ydHMuc2l6ZUxpbWl0cyA9IHNpemVMaW1pdHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJ2YXIgY3NzID0gXCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcXG58XFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxcbnxcXG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxcbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cXG4ucC1NZW51IHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAzcHggMHB4O1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxuICB6LWluZGV4OiAxMDAwMDA7XFxufVxcbi5wLU1lbnUtY29udGVudCB7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cXG4ucC1NZW51LWl0ZW0ge1xcbiAgZGlzcGxheTogdGFibGUtcm93O1xcbn1cXG4ucC1NZW51LWl0ZW0ucC1tb2QtaGlkZGVuLFxcbi5wLU1lbnUtaXRlbS5wLW1vZC1mb3JjZS1oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuLnAtTWVudS1pdGVtID4gc3BhbiB7XFxuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xcbiAgcGFkZGluZy10b3A6IDRweDtcXG4gIHBhZGRpbmctYm90dG9tOiA0cHg7XFxufVxcbi5wLU1lbnUtaXRlbS1pY29uIHtcXG4gIHdpZHRoOiAyMXB4O1xcbiAgcGFkZGluZy1sZWZ0OiAycHg7XFxuICBwYWRkaW5nLXJpZ2h0OiAycHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcbi5wLU1lbnUtaXRlbS10ZXh0IHtcXG4gIHBhZGRpbmctbGVmdDogMnB4O1xcbiAgcGFkZGluZy1yaWdodDogMzVweDtcXG59XFxuLnAtTWVudS1pdGVtLXNob3J0Y3V0IHtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbn1cXG4ucC1NZW51LWl0ZW0tc3VibWVudS1pY29uIHtcXG4gIHdpZHRoOiAxNnB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4ucC1NZW51LWl0ZW0ucC1tb2Qtc2VwYXJhdG9yLXR5cGUgPiBzcGFuIHtcXG4gIHBhZGRpbmc6IDA7XFxuICBoZWlnaHQ6IDlweDtcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcbiAgdGV4dC1pbmRlbnQ6IDEwMCU7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgd2hpdGVzcGFjZTogbm93cmFwO1xcbiAgdmVydGljYWwtYWxpZ246IHRvcDtcXG4gIC8qIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYzNDQ4OSAqL1xcbn1cXG4ucC1NZW51LWl0ZW0ucC1tb2Qtc2VwYXJhdG9yLXR5cGUgPiBzcGFuOjphZnRlciB7XFxuICBjb250ZW50OiAnJztcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdG9wOiA0cHg7XFxufVxcbi5wLU1lbnVCYXItY29udGVudCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG59XFxuLnAtTWVudUJhci1pdGVtIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcbi5wLU1lbnVCYXItaXRlbS5wLW1vZC1oaWRkZW4sXFxuLnAtTWVudUJhci1pdGVtLnAtbW9kLWZvcmNlLWhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIjsgKHJlcXVpcmUoXCJicm93c2VyaWZ5LWNzc1wiKS5jcmVhdGVTdHlsZShjc3MsIHsgXCJocmVmXCI6IFwibm9kZV9tb2R1bGVzXFxcXHBob3NwaG9yLW1lbnVzXFxcXGxpYlxcXFxpbmRleC5jc3NcIn0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xufVxuX19leHBvcnQocmVxdWlyZSgnLi9tZW51JykpO1xuX19leHBvcnQocmVxdWlyZSgnLi9tZW51YmFyJykpO1xuX19leHBvcnQocmVxdWlyZSgnLi9tZW51YmFzZScpKTtcbl9fZXhwb3J0KHJlcXVpcmUoJy4vbWVudWl0ZW0nKSk7XG5yZXF1aXJlKCcuL2luZGV4LmNzcycpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBwaG9zcGhvcl9kb211dGlsXzEgPSByZXF1aXJlKCdwaG9zcGhvci1kb211dGlsJyk7XG52YXIgcGhvc3Bob3Jfc2lnbmFsaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1zaWduYWxpbmcnKTtcbnZhciBwaG9zcGhvcl93aWRnZXRfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXdpZGdldCcpO1xudmFyIG1lbnViYXNlXzEgPSByZXF1aXJlKCcuL21lbnViYXNlJyk7XG52YXIgbWVudWl0ZW1fMSA9IHJlcXVpcmUoJy4vbWVudWl0ZW0nKTtcbi8qKlxuICogYHAtTWVudWA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIE1lbnUgaW5zdGFuY2VzLlxuICovXG5leHBvcnRzLk1FTlVfQ0xBU1MgPSAncC1NZW51Jztcbi8qKlxuICogYHAtTWVudS1jb250ZW50YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGNvbnRlbnQgbm9kZS5cbiAqL1xuZXhwb3J0cy5DT05URU5UX0NMQVNTID0gJ3AtTWVudS1jb250ZW50Jztcbi8qKlxuICogYHAtTWVudS1pdGVtYDogdGhlIGNsYXNzIG5hbWUgYXNzaWduZWQgdG8gYSBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuTUVOVV9JVEVNX0NMQVNTID0gJ3AtTWVudS1pdGVtJztcbi8qKlxuICogYHAtTWVudS1pdGVtLWljb25gOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIG1lbnUgaXRlbSBpY29uIGNlbGwuXG4gKi9cbmV4cG9ydHMuSUNPTl9DTEFTUyA9ICdwLU1lbnUtaXRlbS1pY29uJztcbi8qKlxuICogYHAtTWVudS1pdGVtLXRleHRgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIG1lbnUgaXRlbSB0ZXh0IGNlbGwuXG4gKi9cbmV4cG9ydHMuVEVYVF9DTEFTUyA9ICdwLU1lbnUtaXRlbS10ZXh0Jztcbi8qKlxuICogYHAtTWVudS1pdGVtLXNob3J0Y3V0YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGl0ZW0gc2hvcnRjdXQgY2VsbC5cbiAqL1xuZXhwb3J0cy5TSE9SVENVVF9DTEFTUyA9ICdwLU1lbnUtaXRlbS1zaG9ydGN1dCc7XG4vKipcbiAqIGBwLU1lbnUtaXRlbS1zdWJtZW51LWljb25gOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIG1lbnUgaXRlbSBzdWJtZW51IGljb24gY2VsbC5cbiAqL1xuZXhwb3J0cy5TVUJNRU5VX0lDT05fQ0xBU1MgPSAncC1NZW51LWl0ZW0tc3VibWVudS1pY29uJztcbi8qKlxuICogYHAtbW9kYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBjaGVjayB0eXBlIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5DSEVDS19UWVBFX0NMQVNTID0gJ3AtbW9kLWNoZWNrLXR5cGUnO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIHNlcGFyYXRvciB0eXBlIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5TRVBBUkFUT1JfVFlQRV9DTEFTUyA9ICdwLW1vZC1zZXBhcmF0b3ItdHlwZSc7XG4vKipcbiAqIGBwLW1vZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGFjdGl2ZSBtZW51IGl0ZW1zLlxuICovXG5leHBvcnRzLkFDVElWRV9DTEFTUyA9ICdwLW1vZC1hY3RpdmUnO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIGRpc2FibGVkIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5ESVNBQkxFRF9DTEFTUyA9ICdwLW1vZC1kaXNhYmxlZCc7XG4vKipcbiAqIGBwLW1vZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgaGlkZGVuIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5ISURERU5fQ0xBU1MgPSAncC1tb2QtaGlkZGVuJztcbi8qKlxuICogYHAtbW9kYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBmb3JjZSBoaWRkZW4gbWVudSBpdGVtLlxuICovXG5leHBvcnRzLkZPUkNFX0hJRERFTl9DTEFTUyA9ICdwLW1vZC1mb3JjZS1oaWRkZW4nO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIGNoZWNrZWQgbWVudSBpdGVtLlxuICovXG5leHBvcnRzLkNIRUNLRURfQ0xBU1MgPSAncC1tb2QtY2hlY2tlZCc7XG4vKipcbiAqIGBwLW1vZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgbWVudSBpdGVtIHdpdGggYSBzdWJtZW51LlxuICovXG5leHBvcnRzLkhBU19TVUJNRU5VX0NMQVNTID0gJ3AtbW9kLWhhcy1zdWJtZW51Jztcbi8qKlxuICogVGhlIGRlbGF5LCBpbiBtcywgZm9yIG9wZW5pbmcgYSBzdWJtZW51LlxuICovXG52YXIgT1BFTl9ERUxBWSA9IDMwMDtcbi8qKlxuICogVGhlIGRlbGF5LCBpbiBtcywgZm9yIGNsb3NpbmcgYSBzdWJtZW51LlxuICovXG52YXIgQ0xPU0VfREVMQVkgPSAzMDA7XG4vKipcbiAqIFRoZSBob3Jpem9udGFsIG92ZXJsYXAgdG8gdXNlIGZvciBzdWJtZW51cy5cbiAqL1xudmFyIFNVQk1FTlVfT1ZFUkxBUCA9IDM7XG4vKipcbiAqIEEgd2lkZ2V0IHdoaWNoIGRpc3BsYXlzIG1lbnUgaXRlbXMgYXMgYSBwb3B1cCBtZW51LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEEgYE1lbnVgIHdpZGdldCBkb2VzIG5vdCBzdXBwb3J0IGNoaWxkIHdpZGdldHMuIEFkZGluZyBjaGlsZHJlblxuICogdG8gYSBgTWVudWAgd2lsbCByZXN1bHQgaW4gdW5kZWZpbmVkIGJlaGF2aW9yLlxuICovXG52YXIgTWVudSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1lbnUsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IG1lbnUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gTWVudSgpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuX29wZW5UaW1lcklkID0gMDtcbiAgICAgICAgdGhpcy5fY2xvc2VUaW1lcklkID0gMDtcbiAgICAgICAgdGhpcy5fcGFyZW50TWVudSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NoaWxkSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoZXhwb3J0cy5NRU5VX0NMQVNTKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRoZSBET00gbm9kZSBmb3IgYSBtZW51LlxuICAgICAqL1xuICAgIE1lbnUuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGVudC5jbGFzc05hbWUgPSBleHBvcnRzLkNPTlRFTlRfQ0xBU1M7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBjb252ZW5pZW5jZSBtZXRob2QgdG8gY3JlYXRlIGEgbWVudSBmcm9tIGEgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgLSBUaGUgbWVudSBpdGVtIHRlbXBsYXRlcyBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBtZW51IGNyZWF0ZWQgZnJvbSB0aGUgbWVudSBpdGVtIHRlbXBsYXRlcy5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBTdWJtZW51IHRlbXBsYXRlcyB3aWxsIGJlIHJlY3Vyc2l2ZWx5IGNyZWF0ZWQgdXNpbmcgdGhlXG4gICAgICogYE1lbnUuZnJvbVRlbXBsYXRlYCBtZXRob2QuIElmIGN1c3RvbSBtZW51cyBvciBtZW51IGl0ZW1zXG4gICAgICogYXJlIHJlcXVpcmVkLCB1c2UgdGhlIHJlbGV2YW50IGNvbnN0cnVjdG9ycyBkaXJlY3RseS5cbiAgICAgKi9cbiAgICBNZW51LmZyb21UZW1wbGF0ZSA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICB2YXIgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgICAgIG1lbnUuaXRlbXMgPSBhcnJheS5tYXAoY3JlYXRlTWVudUl0ZW0pO1xuICAgICAgICByZXR1cm4gbWVudTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERpc3Bvc2Ugb2YgdGhlIHJlc291cmNlcyBoZWxkIGJ5IHRoZSBtZW51LlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xvc2UodHJ1ZSk7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGlzcG9zZS5jYWxsKHRoaXMpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnUucHJvdG90eXBlLCBcImNsb3NlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHNpZ25hbCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBjbG9zZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbY2xvc2VkU2lnbmFsXV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51LmNsb3NlZFNpZ25hbC5iaW5kKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudS5wcm90b3R5cGUsIFwicGFyZW50TWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIHBhcmVudCBtZW51IG9mIHRoZSBtZW51LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBudWxsIGlmIHRoZSBtZW51IGlzIG5vdCBhbiBvcGVuIHN1Ym1lbnUuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRNZW51O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudS5wcm90b3R5cGUsIFwiY2hpbGRNZW51XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgY2hpbGQgbWVudSBvZiB0aGUgbWVudS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHdpbGwgYmUgbnVsbCBpZiB0aGUgbWVudSBkb2VzIG5vdCBoYXZlIGFuIG9wZW4gc3VibWVudS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkTWVudTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnUucHJvdG90eXBlLCBcInJvb3RNZW51XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmQgdGhlIHJvb3QgbWVudSBvZiB0aGlzIG1lbnUgaGllcmFyY2h5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWVudSA9IHRoaXM7XG4gICAgICAgICAgICB3aGlsZSAobWVudS5fcGFyZW50TWVudSkge1xuICAgICAgICAgICAgICAgIG1lbnUgPSBtZW51Ll9wYXJlbnRNZW51O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lbnU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51LnByb3RvdHlwZSwgXCJsZWFmTWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5kIHRoZSBsZWFmIG1lbnUgb2YgdGhpcyBtZW51IGhpZXJhcmNoeS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lbnUgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKG1lbnUuX2NoaWxkTWVudSkge1xuICAgICAgICAgICAgICAgIG1lbnUgPSBtZW51Ll9jaGlsZE1lbnU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVudTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogUG9wdXAgdGhlIG1lbnUgYXQgdGhlIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIFRoZSBtZW51IHdpbGwgYmUgb3BlbmVkIGF0IHRoZSBnaXZlbiBsb2NhdGlvbiB1bmxlc3MgaXQgd2lsbCBub3RcbiAgICAgKiBmdWxseSBmaXQgb24gdGhlIHNjcmVlbi4gSWYgaXQgd2lsbCBub3QgZml0LCBpdCB3aWxsIGJlIGFkanVzdGVkXG4gICAgICogdG8gZml0IG5hdHVyYWxseSBvbiB0aGUgc2NyZWVuLiBUaGUgbGFzdCB0d28gb3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgICAqIGNvbnRyb2wgd2hldGhlciB0aGUgcHJvdmlkZWQgY29vcmRpbmF0ZSB2YWx1ZSBtdXN0IGJlIG9iZXllZC5cbiAgICAgKlxuICAgICAqIFdoZW4gdGhlIG1lbnUgaXMgb3BlbmVkIGFzIGEgcG9wdXAgbWVudSwgaXQgd2lsbCBoYW5kbGUgYWxsIGtleVxuICAgICAqIGV2ZW50cyByZWxhdGVkIHRvIG1lbnUgbmF2aWdhdGlvbiBhcyB3ZWxsIGFzIGNsb3NpbmcgdGhlIG1lbnVcbiAgICAgKiB3aGVuIHRoZSBtb3VzZSBpcyBwcmVzc2VkIG91dHNpZGUgb2YgdGhlIG1lbnUgaGllcmFyY2h5LiBUb1xuICAgICAqIHByZXZlbnQgdGhlc2UgYWN0aW9ucywgdXNlIHRoZSAnb3BlbicgbWV0aG9kIGluc3RlYWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCAtIFRoZSBjbGllbnQgWCBjb29yZGluYXRlIG9mIHRoZSBwb3B1cCBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIGNsaWVudCBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvcHVwIGxvY2F0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlWCAtIFdoZXRoZXIgdGhlIFggY29vcmRpbmF0ZSBtdXN0IGJlIG9iZXllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZVkgLSBXaGV0aGVyIHRoZSBZIGNvb3JkaW5hdGUgbXVzdCBiZSBvYmV5ZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbb3Blbl1dXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUucG9wdXAgPSBmdW5jdGlvbiAoeCwgeSwgZm9yY2VYLCBmb3JjZVkpIHtcbiAgICAgICAgaWYgKGZvcmNlWCA9PT0gdm9pZCAwKSB7IGZvcmNlWCA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChmb3JjZVkgPT09IHZvaWQgMCkgeyBmb3JjZVkgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICBvcGVuUm9vdE1lbnUodGhpcywgeCwgeSwgZm9yY2VYLCBmb3JjZVkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBPcGVuIHRoZSBtZW51IGF0IHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGUgbWVudSB3aWxsIGJlIG9wZW5lZCBhdCB0aGUgZ2l2ZW4gbG9jYXRpb24gdW5sZXNzIGl0IHdpbGwgbm90XG4gICAgICogZnVsbHkgZml0IG9uIHRoZSBzY3JlZW4uIElmIGl0IHdpbGwgbm90IGZpdCwgaXQgd2lsbCBiZSBhZGp1c3RlZFxuICAgICAqIHRvIGZpdCBuYXR1cmFsbHkgb24gdGhlIHNjcmVlbi4gVGhlIGxhc3QgdHdvIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBjb250cm9sIHdoZXRoZXIgdGhlIHByb3ZpZGVkIGNvb3JkaW5hdGUgdmFsdWUgbXVzdCBiZSBvYmV5ZWQuXG4gICAgICpcbiAgICAgKiBXaGVuIHRoZSBtZW51IGlzIG9wZW5lZCB3aXRoIHRoaXMgbWV0aG9kLCBpdCB3aWxsIG5vdCBoYW5kbGUga2V5XG4gICAgICogZXZlbnRzIGZvciBuYXZpZ2F0aW9uLCBub3Igd2lsbCBpdCBjbG9zZSBpdHNlbGYgd2hlbiB0aGUgbW91c2UgaXNcbiAgICAgKiBwcmVzc2VkIG91dHNpZGUgdGhlIG1lbnUgaGllcmFyY2h5LiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHVzaW5nIHRoZVxuICAgICAqIG1lbnUgZnJvbSBhIG1lbnViYXIsIHdoZXJlIHRoaXMgbWVudWJhciBzaG91bGQgaGFuZGxlIHRoZXNlIHRhc2tzLlxuICAgICAqIFVzZSB0aGUgYHBvcHVwYCBtZXRob2QgZm9yIHRoZSBhbHRlcm5hdGl2ZSBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIGNsaWVudCBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvcHVwIGxvY2F0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHkgLSBUaGUgY2xpZW50IFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9wdXAgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9yY2VYIC0gV2hldGhlciB0aGUgWCBjb29yZGluYXRlIG11c3QgYmUgb2JleWVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlWSAtIFdoZXRoZXIgdGhlIFkgY29vcmRpbmF0ZSBtdXN0IGJlIG9iZXllZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1twb3B1cF1dXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICh4LCB5LCBmb3JjZVgsIGZvcmNlWSkge1xuICAgICAgICBpZiAoZm9yY2VYID09PSB2b2lkIDApIHsgZm9yY2VYID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGZvcmNlWSA9PT0gdm9pZCAwKSB7IGZvcmNlWSA9IGZhbHNlOyB9XG4gICAgICAgIGlmICghdGhpcy5pc0F0dGFjaGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIG9wZW5Sb290TWVudSh0aGlzLCB4LCB5LCBmb3JjZVgsIGZvcmNlWSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgRE9NIGV2ZW50cyBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgLSBUaGUgRE9NIGV2ZW50IHNlbnQgdG8gdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgaW1wbGVtZW50cyB0aGUgRE9NIGBFdmVudExpc3RlbmVyYCBpbnRlcmZhY2UgYW5kIGlzXG4gICAgICogY2FsbGVkIGluIHJlc3BvbnNlIHRvIGV2ZW50cyBvbiB0aGUgbWVudSdzIERPTSBub2Rlcy4gSXQgc2hvdWxkXG4gICAgICogbm90IGJlIGNhbGxlZCBkaXJlY3RseSBieSB1c2VyIGNvZGUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWVudGVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRNb3VzZUVudGVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbGVhdmUnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dE1vdXNlTGVhdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRNb3VzZURvd24oZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0TW91c2VVcChldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb250ZXh0bWVudSc6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0Q29udGV4dE1lbnUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0S2V5RG93bihldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdrZXlwcmVzcyc6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0S2V5UHJlc3MoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gdGhlIG1lbnUgaXRlbXMgY2hhbmdlLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLm9uSXRlbXNDaGFuZ2VkID0gZnVuY3Rpb24gKG9sZCwgaXRlbXMpIHtcbiAgICAgICAgdGhpcy5jbG9zZSh0cnVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiB0aGUgYWN0aXZlIGluZGV4IGNoYW5nZXMuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25BY3RpdmVJbmRleENoYW5nZWQgPSBmdW5jdGlvbiAob2xkLCBpbmRleCkge1xuICAgICAgICB2YXIgb2xkTm9kZSA9IHRoaXMuX2l0ZW1Ob2RlQXQob2xkKTtcbiAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLl9pdGVtTm9kZUF0KGluZGV4KTtcbiAgICAgICAgaWYgKG9sZE5vZGUpXG4gICAgICAgICAgICBvbGROb2RlLmNsYXNzTGlzdC5yZW1vdmUoZXhwb3J0cy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICBpZiAobmV3Tm9kZSlcbiAgICAgICAgICAgIG5ld05vZGUuY2xhc3NMaXN0LmFkZChleHBvcnRzLkFDVElWRV9DTEFTUyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gYSBtZW51IGl0ZW0gc2hvdWxkIGJlIG9wZW5lZC5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vbk9wZW5JdGVtID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5faXRlbU5vZGVBdChpbmRleCkgfHwgdGhpcy5ub2RlO1xuICAgICAgICB0aGlzLl9vcGVuQ2hpbGRNZW51KGl0ZW0sIG5vZGUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5fY2hpbGRNZW51LmFjdGl2YXRlTmV4dEl0ZW0oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiBhIG1lbnUgaXRlbSBzaG91bGQgYmUgdHJpZ2dlcmVkLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLm9uVHJpZ2dlckl0ZW0gPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgdGhpcy5yb290TWVudS5jbG9zZSgpO1xuICAgICAgICB2YXIgaGFuZGxlciA9IGl0ZW0uaGFuZGxlcjtcbiAgICAgICAgaWYgKGhhbmRsZXIpXG4gICAgICAgICAgICBoYW5kbGVyKGl0ZW0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhbiBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25BZnRlckF0dGFjaCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdiZWZvcmUtZGV0YWNoJ2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vbkJlZm9yZURldGFjaCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcyk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcywgdHJ1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIGhhbmRsZXIgaW52b2tlZCBvbiBhbiBgJ3VwZGF0ZS1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vblVwZGF0ZVJlcXVlc3QgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbm9kZXMgZm9yIHRoZSBtZW51LlxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgICB2YXIgY291bnQgPSBpdGVtcy5sZW5ndGg7XG4gICAgICAgIHZhciBub2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBjcmVhdGVJdGVtTm9kZShpdGVtc1tpXSk7XG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzKTtcbiAgICAgICAgICAgIG5vZGVzW2ldID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3JjZSBoaWRlIHRoZSBsZWFkaW5nIHZpc2libGUgc2VwYXJhdG9ycy5cbiAgICAgICAgZm9yICh2YXIgazEgPSAwOyBrMSA8IGNvdW50OyArK2sxKSB7XG4gICAgICAgICAgICBpZiAoaXRlbXNbazFdLmhpZGRlbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2Rlc1trMV0uY2xhc3NMaXN0LmFkZChleHBvcnRzLkZPUkNFX0hJRERFTl9DTEFTUyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yY2UgaGlkZSB0aGUgdHJhaWxpbmcgdmlzaWJsZSBzZXBhcmF0b3JzLlxuICAgICAgICBmb3IgKHZhciBrMiA9IGNvdW50IC0gMTsgazIgPj0gMDsgLS1rMikge1xuICAgICAgICAgICAgaWYgKGl0ZW1zW2syXS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXRlbXNbazJdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZXNbazJdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcmNlIGhpZGUgdGhlIHJlbWFpbmluZyBjb25zZWN1dGl2ZSB2aXNpYmxlIHNlcGFyYXRvcnMuXG4gICAgICAgIHZhciBoaWRlID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICgrK2sxIDwgazIpIHtcbiAgICAgICAgICAgIGlmIChpdGVtc1trMV0uaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGlkZSAmJiBpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgbm9kZXNbazFdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGlkZSA9IGl0ZW1zW2sxXS5pc1NlcGFyYXRvclR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmV0Y2ggdGhlIGNvbnRlbnQgbm9kZS5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgLy8gUmVmcmVzaCB0aGUgY29udGVudCBub2RlJ3MgY29udGVudC5cbiAgICAgICAgY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQobm9kZXNbaV0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdjbG9zZS1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vbkNsb3NlUmVxdWVzdCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgLy8gUmVzZXQgdGhlIG1lbnUgc3RhdGUuXG4gICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdPcGVuKCk7XG4gICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdDbG9zZSgpO1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gLTE7XG4gICAgICAgIC8vIENsb3NlIGFueSBvcGVuIGNoaWxkIG1lbnUuXG4gICAgICAgIHZhciBjaGlsZE1lbnUgPSB0aGlzLl9jaGlsZE1lbnU7XG4gICAgICAgIGlmIChjaGlsZE1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgY2hpbGRNZW51LmNsb3NlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIG1lbnUgZnJvbSBhbnkgcGFyZW50LlxuICAgICAgICB2YXIgcGFyZW50TWVudSA9IHRoaXMuX3BhcmVudE1lbnU7XG4gICAgICAgIGlmIChwYXJlbnRNZW51KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnRNZW51ID0gbnVsbDtcbiAgICAgICAgICAgIHBhcmVudE1lbnUuX2NhbmNlbFBlbmRpbmdPcGVuKCk7XG4gICAgICAgICAgICBwYXJlbnRNZW51Ll9jYW5jZWxQZW5kaW5nQ2xvc2UoKTtcbiAgICAgICAgICAgIHBhcmVudE1lbnUuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgICAgICBwYXJlbnRNZW51Ll9jaGlsZEl0ZW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGlzIG1lbnUgaXMgZGV0YWNoZWQuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgcGhvc3Bob3Jfd2lkZ2V0XzEuZGV0YWNoV2lkZ2V0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsZWFyIHRoZSBjb250ZW50IG5vZGUuXG4gICAgICAgIHRoaXMubm9kZS5maXJzdENoaWxkLnRleHRDb250ZW50ID0gJyc7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnbW91c2VlbnRlcidgIGV2ZW50IGZvciB0aGUgbWVudS5cbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIGNoaWxkIGl0ZW0gbm9kZXMuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dE1vdXNlRW50ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fc3luY0FuY2VzdG9ycygpO1xuICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nT3BlbigpO1xuICAgICAgICB2YXIgbm9kZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSB0aGlzLl9pdGVtTm9kZUluZGV4KG5vZGUpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5hY3RpdmVJbmRleF07XG4gICAgICAgIGlmIChpdGVtICYmIGl0ZW0uc3VibWVudSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuX2NoaWxkSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3BlbkNoaWxkTWVudShpdGVtLCBub2RlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNlbGVhdmUnYCBldmVudCBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGxpc3RlbmVyIGlzIG9ubHkgYXR0YWNoZWQgdG8gdGhlIG1lbnUgbm9kZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fZXZ0TW91c2VMZWF2ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nT3BlbigpO1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLl9jaGlsZE1lbnU7XG4gICAgICAgIGlmICghY2hpbGQgfHwgIXBob3NwaG9yX2RvbXV0aWxfMS5oaXRUZXN0KGNoaWxkLm5vZGUsIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gLTE7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnbW91c2V1cCdgIGV2ZW50IGZvciB0aGUgbWVudS5cbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIG1lbnUgbm9kZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fZXZ0TW91c2VVcCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5faXRlbU5vZGVBdCh0aGlzLmFjdGl2ZUluZGV4KTtcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBY3RpdmVJdGVtKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdjb250ZXh0bWVudSdgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dENvbnRleHRNZW51ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNlZG93bidgIGV2ZW50IGZvciB0aGUgbWVudS5cbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIGRvY3VtZW50IGZvciBhIHBvcHVwIG1lbnUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dE1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgbWVudSA9IHRoaXM7XG4gICAgICAgIHZhciBoaXQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgIHdoaWxlICghaGl0ICYmIG1lbnUpIHtcbiAgICAgICAgICAgIGhpdCA9IHBob3NwaG9yX2RvbXV0aWxfMS5oaXRUZXN0KG1lbnUubm9kZSwgeCwgeSk7XG4gICAgICAgICAgICBtZW51ID0gbWVudS5fY2hpbGRNZW51O1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGl0KVxuICAgICAgICAgICAgdGhpcy5jbG9zZSh0cnVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdrZXlkb3duJ2AgZXZlbnQgZm9yIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgZm9yIGEgcG9wdXAgbWVudS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fZXZ0S2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIGxlYWYgPSB0aGlzLmxlYWZNZW51O1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZWFmLnRyaWdnZXJBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGVhZi5jbG9zZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZiAhPT0gdGhpcylcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5jbG9zZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZWFmLmFjdGl2YXRlUHJldmlvdXNJdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGVhZi5vcGVuQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxlYWYuYWN0aXZhdGVOZXh0SXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAna2V5cHJlc3MnYCBldmVudCBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBmb3IgYSBwb3B1cCBtZW51LlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9ldnRLZXlQcmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5sZWFmTWVudS5hY3RpdmF0ZU1uZW1vbmljSXRlbShTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSB0aGUgYWN0aXZlIGl0ZW0gaGllcmFyY2h5IHN0YXJ0aW5nIHdpdGggdGhlIHBhcmVudC5cbiAgICAgKlxuICAgICAqIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBwcm9wZXIgY2hpbGQgaXRlbXMgYXJlIGFjdGl2YXRlZCBmb3IgdGhlXG4gICAgICogYW5jZXN0b3IgbWVudSBoaWVyYXJjaHkgYW5kIHRoYXQgYW55IHBlbmRpbmcgb3BlbiBvciBjbG9zZVxuICAgICAqIHRhc2tzIGFyZSBjbGVhcmVkLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9zeW5jQW5jZXN0b3JzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWVudSA9IHRoaXMuX3BhcmVudE1lbnU7XG4gICAgICAgIHdoaWxlIChtZW51KSB7XG4gICAgICAgICAgICBtZW51Ll9zeW5jQ2hpbGRJdGVtKCk7XG4gICAgICAgICAgICBtZW51ID0gbWVudS5fcGFyZW50TWVudTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgdGhlIGFjdGl2ZSBpbmRleCB3aXRoIHRoZSBjdXJyZW50IGNoaWxkIGl0ZW0uXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX3N5bmNDaGlsZEl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdPcGVuKCk7XG4gICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdDbG9zZSgpO1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKHRoaXMuX2NoaWxkSXRlbSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBPcGVuIHRoZSBtZW51IGl0ZW0ncyBzdWJtZW51IHVzaW5nIHRoZSBub2RlIGZvciBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIElmIHRoZSBnaXZlbiBpdGVtIGlzIGFscmVhZHkgb3BlbiwgdGhpcyBpcyBhIG5vLW9wLlxuICAgICAqXG4gICAgICogQW55IHBlbmRpbmcgb3BlbiBvcGVyYXRpb24gd2lsbCBiZSBjYW5jZWxsZWQgYmVmb3JlIG9wZW5pbmdcbiAgICAgKiB0aGUgbWVudSBvciBxdWV1ZWluZyB0aGUgZGVsYXllZCB0YXNrIHRvIG9wZW4gdGhlIG1lbnUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX29wZW5DaGlsZE1lbnUgPSBmdW5jdGlvbiAoaXRlbSwgbm9kZSwgZGVsYXllZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoaXRlbSA9PT0gdGhpcy5fY2hpbGRJdGVtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FuY2VsUGVuZGluZ09wZW4oKTtcbiAgICAgICAgaWYgKGRlbGF5ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX29wZW5UaW1lcklkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lbnUgPSBpdGVtLnN1Ym1lbnU7XG4gICAgICAgICAgICAgICAgX3RoaXMuX29wZW5UaW1lcklkID0gMDtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRNZW51ID0gbWVudTtcbiAgICAgICAgICAgICAgICBtZW51Ll9wYXJlbnRNZW51ID0gX3RoaXM7XG4gICAgICAgICAgICAgICAgbWVudS51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgb3BlblN1Ym1lbnUobWVudSwgbm9kZSk7XG4gICAgICAgICAgICB9LCBPUEVOX0RFTEFZKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtZW51ID0gaXRlbS5zdWJtZW51O1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG1lbnU7XG4gICAgICAgICAgICBtZW51Ll9wYXJlbnRNZW51ID0gdGhpcztcbiAgICAgICAgICAgIG1lbnUudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgb3BlblN1Ym1lbnUobWVudSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBjdXJyZW50bHkgb3BlbiBjaGlsZCBtZW51IHVzaW5nIGEgZGVsYXllZCB0YXNrLlxuICAgICAqXG4gICAgICogSWYgYSB0YXNrIGlzIHBlbmRpbmcgb3IgaWYgdGhlcmUgaXMgbm8gY2hpbGQgbWVudSwgdGhpcyBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9jbG9zZUNoaWxkTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuX2Nsb3NlVGltZXJJZCB8fCAhdGhpcy5fY2hpbGRNZW51KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2xvc2VUaW1lcklkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5fY2xvc2VUaW1lcklkID0gMDtcbiAgICAgICAgICAgIGlmIChfdGhpcy5fY2hpbGRNZW51KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkTWVudS5jbG9zZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRNZW51ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgQ0xPU0VfREVMQVkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2FuY2VsIGFueSBwZW5kaW5nIGNoaWxkIG1lbnUgb3BlbiB0YXNrLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9jYW5jZWxQZW5kaW5nT3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX29wZW5UaW1lcklkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fb3BlblRpbWVySWQpO1xuICAgICAgICAgICAgdGhpcy5fb3BlblRpbWVySWQgPSAwO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDYW5jZWwgYW55IHBlbmRpbmcgY2hpbGQgbWVudSBjbG9zZSB0YXNrLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9jYW5jZWxQZW5kaW5nQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jbG9zZVRpbWVySWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jbG9zZVRpbWVySWQpO1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VUaW1lcklkID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtZW51IGl0ZW0gbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXguXG4gICAgICpcbiAgICAgKiBUaGlzIHdpbGwgcmV0dXJuIGB1bmRlZmluZWRgIGlmIHRoZSBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2l0ZW1Ob2RlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQuY2hpbGRyZW5baW5kZXhdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbmRleCBvZiB0aGUgZ2l2ZW4gbWVudSBpdGVtIG5vZGUuXG4gICAgICpcbiAgICAgKiBUaGlzIHdpbGwgcmV0dXJuIGAtMWAgaWYgdGhlIG1lbnUgaXRlbSBub2RlIGlzIG5vdCBmb3VuZC5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5faXRlbU5vZGVJbmRleCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGNvbnRlbnQuY2hpbGRyZW4sIG5vZGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBzaWduYWwgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tjbG9zZWRdXVxuICAgICAqL1xuICAgIE1lbnUuY2xvc2VkU2lnbmFsID0gbmV3IHBob3NwaG9yX3NpZ25hbGluZ18xLlNpZ25hbCgpO1xuICAgIHJldHVybiBNZW51O1xufSkobWVudWJhc2VfMS5NZW51QmFzZSk7XG5leHBvcnRzLk1lbnUgPSBNZW51O1xuLyoqXG4gKiBDcmVhdGUgYSBtZW51IGl0ZW0gZnJvbSBhIHRlbXBsYXRlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVNZW51SXRlbSh0ZW1wbGF0ZSkge1xuICAgIHJldHVybiBtZW51aXRlbV8xLk1lbnVJdGVtLmZyb21UZW1wbGF0ZSh0ZW1wbGF0ZSk7XG59XG4vKipcbiAqIENyZWF0ZSB0aGUgY29tcGxldGUgRE9NIG5vZGUgY2xhc3MgbmFtZSBmb3IgYSBNZW51SXRlbS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSXRlbUNsYXNzTmFtZShpdGVtKSB7XG4gICAgdmFyIHBhcnRzID0gW2V4cG9ydHMuTUVOVV9JVEVNX0NMQVNTXTtcbiAgICBpZiAoaXRlbS5pc0NoZWNrVHlwZSkge1xuICAgICAgICBwYXJ0cy5wdXNoKGV4cG9ydHMuQ0hFQ0tfVFlQRV9DTEFTUyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGl0ZW0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5TRVBBUkFUT1JfVFlQRV9DTEFTUyk7XG4gICAgfVxuICAgIGlmIChpdGVtLmNoZWNrZWQpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkNIRUNLRURfQ0xBU1MpO1xuICAgIH1cbiAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICBwYXJ0cy5wdXNoKGV4cG9ydHMuRElTQUJMRURfQ0xBU1MpO1xuICAgIH1cbiAgICBpZiAoaXRlbS5oaWRkZW4pIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkhJRERFTl9DTEFTUyk7XG4gICAgfVxuICAgIGlmIChpdGVtLnN1Ym1lbnUpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkhBU19TVUJNRU5VX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uY2xhc3NOYW1lKSB7XG4gICAgICAgIHBhcnRzLnB1c2goaXRlbS5jbGFzc05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xufVxuLyoqXG4gKiBDcmVhdGUgdGhlIERPTSBub2RlIGZvciBhIE1lbnVJdGVtLlxuICovXG5mdW5jdGlvbiBjcmVhdGVJdGVtTm9kZShpdGVtKSB7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgc2hvcnRjdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIHN1Ym1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbm9kZS5jbGFzc05hbWUgPSBjcmVhdGVJdGVtQ2xhc3NOYW1lKGl0ZW0pO1xuICAgIGljb24uY2xhc3NOYW1lID0gZXhwb3J0cy5JQ09OX0NMQVNTO1xuICAgIHRleHQuY2xhc3NOYW1lID0gZXhwb3J0cy5URVhUX0NMQVNTO1xuICAgIHNob3J0Y3V0LmNsYXNzTmFtZSA9IGV4cG9ydHMuU0hPUlRDVVRfQ0xBU1M7XG4gICAgc3VibWVudS5jbGFzc05hbWUgPSBleHBvcnRzLlNVQk1FTlVfSUNPTl9DTEFTUztcbiAgICBpZiAoIWl0ZW0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBpdGVtLnRleHQucmVwbGFjZSgvJi9nLCAnJyk7XG4gICAgICAgIHNob3J0Y3V0LnRleHRDb250ZW50ID0gaXRlbS5zaG9ydGN1dDtcbiAgICB9XG4gICAgbm9kZS5hcHBlbmRDaGlsZChpY29uKTtcbiAgICBub2RlLmFwcGVuZENoaWxkKHRleHQpO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc2hvcnRjdXQpO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3VibWVudSk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG4vKipcbiAqIEdldCB0aGUgY3VycmVudGx5IHZpc2libGUgdmlld3BvcnQgcmVjdCBpbiBwYWdlIGNvb3JkaW5hdGVzLlxuICovXG5mdW5jdGlvbiBjbGllbnRWaWV3cG9ydFJlY3QoKSB7XG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdmFyIHggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgdmFyIHkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdmFyIHdpZHRoID0gZWxlbS5jbGllbnRXaWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gZWxlbS5jbGllbnRIZWlnaHQ7XG4gICAgcmV0dXJuIHsgeDogeCwgeTogeSwgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xufVxuLyoqXG4gKiBNb3VudCB0aGUgbWVudSBhcyBoaWRkZW4gYW5kIGNvbXB1dGUgaXRzIG9wdGltYWwgc2l6ZS5cbiAqXG4gKiBJZiB0aGUgdmVydGljYWwgc2Nyb2xsYmFyIGJlY29tZSB2aXNpYmxlLCB0aGUgbWVudSB3aWxsIGJlIGV4cGFuZGVkXG4gKiBieSB0aGUgc2Nyb2xsYmFyIHdpZHRoIHRvIHByZXZlbnQgY2xpcHBpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBtZW51LlxuICovXG5mdW5jdGlvbiBtb3VudEFuZE1lYXN1cmUobWVudSwgbWF4SGVpZ2h0KSB7XG4gICAgdmFyIG5vZGUgPSBtZW51Lm5vZGU7XG4gICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZTtcbiAgICBzdHlsZS50b3AgPSAnJztcbiAgICBzdHlsZS5sZWZ0ID0gJyc7XG4gICAgc3R5bGUud2lkdGggPSAnJztcbiAgICBzdHlsZS5oZWlnaHQgPSAnJztcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgc3R5bGUubWF4SGVpZ2h0ID0gbWF4SGVpZ2h0ICsgJ3B4JztcbiAgICBwaG9zcGhvcl93aWRnZXRfMS5hdHRhY2hXaWRnZXQobWVudSwgZG9jdW1lbnQuYm9keSk7XG4gICAgaWYgKG5vZGUuc2Nyb2xsSGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgIHN0eWxlLndpZHRoID0gMiAqIG5vZGUub2Zmc2V0V2lkdGggLSBub2RlLmNsaWVudFdpZHRoICsgJ3B4JztcbiAgICB9XG4gICAgdmFyIHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7IHdpZHRoOiByZWN0LndpZHRoLCBoZWlnaHQ6IHJlY3QuaGVpZ2h0IH07XG59XG4vKipcbiAqIFNob3cgdGhlIG1lbnUgYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lbnUobWVudSwgeCwgeSkge1xuICAgIHZhciBzdHlsZSA9IG1lbnUubm9kZS5zdHlsZTtcbiAgICBzdHlsZS50b3AgPSBNYXRoLm1heCgwLCB5KSArICdweCc7XG4gICAgc3R5bGUubGVmdCA9IE1hdGgubWF4KDAsIHgpICsgJ3B4JztcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJyc7XG59XG4vKipcbiAqIE9wZW4gdGhlIG1lbnUgYXMgYSByb290IG1lbnUgYXQgdGhlIHRhcmdldCBsb2NhdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3BlblJvb3RNZW51KG1lbnUsIHgsIHksIGZvcmNlWCwgZm9yY2VZKSB7XG4gICAgdmFyIHJlY3QgPSBjbGllbnRWaWV3cG9ydFJlY3QoKTtcbiAgICB2YXIgc2l6ZSA9IG1vdW50QW5kTWVhc3VyZShtZW51LCByZWN0LmhlaWdodCAtIChmb3JjZVkgPyB5IDogMCkpO1xuICAgIGlmICghZm9yY2VYICYmICh4ICsgc2l6ZS53aWR0aCA+IHJlY3QueCArIHJlY3Qud2lkdGgpKSB7XG4gICAgICAgIHggPSByZWN0LnggKyByZWN0LndpZHRoIC0gc2l6ZS53aWR0aDtcbiAgICB9XG4gICAgaWYgKCFmb3JjZVkgJiYgKHkgKyBzaXplLmhlaWdodCA+IHJlY3QueSArIHJlY3QuaGVpZ2h0KSkge1xuICAgICAgICBpZiAoeSA+IHJlY3QueSArIHJlY3QuaGVpZ2h0KSB7XG4gICAgICAgICAgICB5ID0gcmVjdC55ICsgcmVjdC5oZWlnaHQgLSBzaXplLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHkgPSB5IC0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd01lbnUobWVudSwgeCwgeSk7XG59XG4vKipcbiAqIE9wZW4gYSB0aGUgbWVudSBhcyBhIHN1Ym1lbnUgdXNpbmcgdGhlIGl0ZW0gbm9kZSBmb3IgcG9zaXRpb25pbmcuXG4gKi9cbmZ1bmN0aW9uIG9wZW5TdWJtZW51KG1lbnUsIGl0ZW0pIHtcbiAgICB2YXIgcmVjdCA9IGNsaWVudFZpZXdwb3J0UmVjdCgpO1xuICAgIHZhciBzaXplID0gbW91bnRBbmRNZWFzdXJlKG1lbnUsIHJlY3QuaGVpZ2h0KTtcbiAgICB2YXIgYm94ID0gcGhvc3Bob3JfZG9tdXRpbF8xLmJveFNpemluZyhtZW51Lm5vZGUpO1xuICAgIHZhciBpdGVtUmVjdCA9IGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdmFyIHggPSBpdGVtUmVjdC5yaWdodCAtIFNVQk1FTlVfT1ZFUkxBUDtcbiAgICB2YXIgeSA9IGl0ZW1SZWN0LnRvcCAtIGJveC5ib3JkZXJUb3AgLSBib3gucGFkZGluZ1RvcDtcbiAgICBpZiAoeCArIHNpemUud2lkdGggPiByZWN0LnggKyByZWN0LndpZHRoKSB7XG4gICAgICAgIHggPSBpdGVtUmVjdC5sZWZ0ICsgU1VCTUVOVV9PVkVSTEFQIC0gc2l6ZS53aWR0aDtcbiAgICB9XG4gICAgaWYgKHkgKyBzaXplLmhlaWdodCA+IHJlY3QueSArIHJlY3QuaGVpZ2h0KSB7XG4gICAgICAgIHkgPSBpdGVtUmVjdC5ib3R0b20gKyBib3guYm9yZGVyQm90dG9tICsgYm94LnBhZGRpbmdCb3R0b20gLSBzaXplLmhlaWdodDtcbiAgICB9XG4gICAgc2hvd01lbnUobWVudSwgeCwgeSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZW51LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgcGhvc3Bob3JfZG9tdXRpbF8xID0gcmVxdWlyZSgncGhvc3Bob3ItZG9tdXRpbCcpO1xudmFyIHBob3NwaG9yX3Byb3BlcnRpZXNfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXByb3BlcnRpZXMnKTtcbnZhciBtZW51YmFzZV8xID0gcmVxdWlyZSgnLi9tZW51YmFzZScpO1xudmFyIG1lbnVpdGVtXzEgPSByZXF1aXJlKCcuL21lbnVpdGVtJyk7XG4vKipcbiAqIGBwLU1lbnVCYXJgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIG1lbnUgYmFyIHdpZGdldC5cbiAqL1xuZXhwb3J0cy5NRU5VX0JBUl9DTEFTUyA9ICdwLU1lbnVCYXInO1xuLyoqXG4gKiBgcC1NZW51QmFyLWNvbnRlbnRgOiB0aGUgY2xhc3MgbmFtZSBhc3NpZ25lZCB0byBhIGNvbnRlbnQgbm9kZS5cbiAqL1xuZXhwb3J0cy5DT05URU5UX0NMQVNTID0gJ3AtTWVudUJhci1jb250ZW50Jztcbi8qKlxuICogYHAtTWVudUJhci1tZW51YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYW4gb3BlbiBtZW51LlxuICovXG5leHBvcnRzLk1FTlVfQ0xBU1MgPSAncC1NZW51QmFyLW1lbnUnO1xuLyoqXG4gKiBgcC1NZW51QmFyLWl0ZW1gOiB0aGUgY2xhc3MgbmFtZSBhc3NpZ25lZCB0byBhIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5NRU5VX0lURU1fQ0xBU1MgPSAncC1NZW51QmFyLWl0ZW0nO1xuLyoqXG4gKiBgcC1NZW51QmFyLWl0ZW0taWNvbmA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGFuIGl0ZW0gaWNvbiBjZWxsLlxuICovXG5leHBvcnRzLklDT05fQ0xBU1MgPSAncC1NZW51QmFyLWl0ZW0taWNvbic7XG4vKipcbiAqIGBwLU1lbnVCYXItaXRlbS10ZXh0YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYW4gaXRlbSB0ZXh0IGNlbGwuXG4gKi9cbmV4cG9ydHMuVEVYVF9DTEFTUyA9ICdwLU1lbnVCYXItaXRlbS10ZXh0Jztcbi8qKlxuICogYHAtbW9kLXNlcGFyYXRvci10eXBlYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBzZXBhcmF0b3IgaXRlbS5cbiAqL1xuZXhwb3J0cy5TRVBBUkFUT1JfVFlQRV9DTEFTUyA9ICdwLW1vZC1zZXBhcmF0b3ItdHlwZSc7XG4vKipcbiAqIGBwLW1vZC1hY3RpdmVgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhbiBhY3RpdmUgbWVudSBiYXIgYW5kIGl0ZW0uXG4gKi9cbmV4cG9ydHMuQUNUSVZFX0NMQVNTID0gJ3AtbW9kLWFjdGl2ZSc7XG4vKipcbiAqIGBwLW1vZC1kaXNhYmxlZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgZGlzYWJsZWQgaXRlbS5cbiAqL1xuZXhwb3J0cy5ESVNBQkxFRF9DTEFTUyA9ICdwLW1vZC1kaXNhYmxlZCc7XG4vKipcbiAqIGBwLW1vZC1oaWRkZW5gOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIGhpZGRlbiBpdGVtLlxuICovXG5leHBvcnRzLkhJRERFTl9DTEFTUyA9ICdwLW1vZC1oaWRkZW4nO1xuLyoqXG4gKiBgcC1tb2QtZm9yY2UtaGlkZGVuYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBmb3JjZSBoaWRkZW4gaXRlbS5cbiAqL1xuZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MgPSAncC1tb2QtZm9yY2UtaGlkZGVuJztcbi8qKlxuICogQSB3aWRnZXQgd2hpY2ggZGlzcGxheXMgbWVudSBpdGVtcyBhcyBhIG1lbnUgYmFyLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEEgYE1lbnVCYXJgIHdpZGdldCBkb2VzIG5vdCBzdXBwb3J0IGNoaWxkIHdpZGdldHMuIEFkZGluZyBjaGlsZHJlblxuICogdG8gYSBgTWVudUJhcmAgd2lsbCByZXN1bHQgaW4gdW5kZWZpbmVkIGJlaGF2aW9yLlxuICovXG52YXIgTWVudUJhciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1lbnVCYXIsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IG1lbnUgYmFyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE1lbnVCYXIoKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY2hpbGRNZW51ID0gbnVsbDtcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhleHBvcnRzLk1FTlVfQkFSX0NMQVNTKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRoZSBET00gbm9kZSBmb3IgYSBtZW51IGJhci5cbiAgICAgKi9cbiAgICBNZW51QmFyLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gZXhwb3J0cy5DT05URU5UX0NMQVNTO1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgY29udmVuaWVuY2UgbWV0aG9kIHRvIGNyZWF0ZSBhIG1lbnUgYmFyIGZyb20gYSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSAtIFRoZSBtZW51IGl0ZW0gdGVtcGxhdGVzIGZvciB0aGUgbWVudSBiYXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBtZW51IGJhciBjcmVhdGVkIGZyb20gdGhlIG1lbnUgaXRlbSB0ZW1wbGF0ZXMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogU3VibWVudSB0ZW1wbGF0ZXMgd2lsbCBiZSByZWN1cnNpdmVseSBjcmVhdGVkIHVzaW5nIHRoZVxuICAgICAqIGBNZW51LmZyb21UZW1wbGF0ZWAgbWV0aG9kLiBJZiBjdXN0b20gbWVudXMgb3IgbWVudSBpdGVtc1xuICAgICAqIGFyZSByZXF1aXJlZCwgdXNlIHRoZSByZWxldmFudCBjb25zdHJ1Y3RvcnMgZGlyZWN0bHkuXG4gICAgICovXG4gICAgTWVudUJhci5mcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgdmFyIGJhciA9IG5ldyBNZW51QmFyKCk7XG4gICAgICAgIGJhci5pdGVtcyA9IGFycmF5Lm1hcChjcmVhdGVNZW51SXRlbSk7XG4gICAgICAgIHJldHVybiBiYXI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNwb3NlIG9mIHRoZSByZXNvdXJjZXMgaGVsZCBieSB0aGUgcGFuZWwuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kaXNwb3NlLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUJhci5wcm90b3R5cGUsIFwiY2hpbGRNZW51XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgY2hpbGQgbWVudSBvZiB0aGUgbWVudSBiYXIuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGJlIGBudWxsYCBpZiB0aGUgbWVudSBiYXIgZG9lcyBub3QgaGF2ZSBhbiBvcGVuIG1lbnUuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZE1lbnU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgRE9NIGV2ZW50cyBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IC0gVGhlIERPTSBldmVudCBzZW50IHRvIHRoZSBtZW51IGJhci5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIG1ldGhvZCBpbXBsZW1lbnRzIHRoZSBET00gYEV2ZW50TGlzdGVuZXJgIGludGVyZmFjZSBhbmQgaXNcbiAgICAgKiBjYWxsZWQgaW4gcmVzcG9uc2UgdG8gZXZlbnRzIG9uIHRoZSBtZW51J3MgRE9NIG5vZGVzLiBJdCBzaG91bGRcbiAgICAgKiBub3QgYmUgY2FsbGVkIGRpcmVjdGx5IGJ5IHVzZXIgY29kZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0TW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0TW91c2VNb3ZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbGVhdmUnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dE1vdXNlTGVhdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29udGV4dG1lbnUnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dENvbnRleHRNZW51KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dEtleURvd24oZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5cHJlc3MnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dEtleVByZXNzKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIHRoZSBtZW51IGl0ZW1zIGNoYW5nZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5vbkl0ZW1zQ2hhbmdlZCA9IGZ1bmN0aW9uIChvbGQsIGl0ZW1zKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gb2xkLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5LmdldENoYW5nZWQob2xkW2ldKS5kaXNjb25uZWN0KHRoaXMuX29uSXRlbUNoYW5nZWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gaXRlbXMubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkuZ2V0Q2hhbmdlZChpdGVtc1tpXSkuY29ubmVjdCh0aGlzLl9vbkl0ZW1DaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiB0aGUgYWN0aXZlIGluZGV4IGNoYW5nZXMuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25BY3RpdmVJbmRleENoYW5nZWQgPSBmdW5jdGlvbiAob2xkLCBpbmRleCkge1xuICAgICAgICB2YXIgb2xkTm9kZSA9IHRoaXMuX2l0ZW1Ob2RlQXQob2xkKTtcbiAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLl9pdGVtTm9kZUF0KGluZGV4KTtcbiAgICAgICAgaWYgKG9sZE5vZGUpXG4gICAgICAgICAgICBvbGROb2RlLmNsYXNzTGlzdC5yZW1vdmUoZXhwb3J0cy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICBpZiAobmV3Tm9kZSlcbiAgICAgICAgICAgIG5ld05vZGUuY2xhc3NMaXN0LmFkZChleHBvcnRzLkFDVElWRV9DTEFTUyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gYSBtZW51IGl0ZW0gc2hvdWxkIGJlIG9wZW5lZC5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5vbk9wZW5JdGVtID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5faXRlbU5vZGVBdChpbmRleCkgfHwgdGhpcy5ub2RlO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICB0aGlzLl9vcGVuQ2hpbGRNZW51KGl0ZW0uc3VibWVudSwgbm9kZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGFuIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5vbkFmdGVyQXR0YWNoID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdiZWZvcmUtZGV0YWNoJ2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5vbkJlZm9yZURldGFjaCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBoYW5kbGVyIGludm9rZWQgb24gYW4gYCd1cGRhdGUtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25VcGRhdGVSZXF1ZXN0ID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAvLyBSZXNldCB0aGUgc3RhdGUgb2YgdGhlIG1lbnUgYmFyLlxuICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG5vZGVzIGZvciB0aGUgbWVudSBiYXIuXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIHZhciBjb3VudCA9IGl0ZW1zLmxlbmd0aDtcbiAgICAgICAgdmFyIG5vZGVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICBub2Rlc1tpXSA9IGNyZWF0ZUl0ZW1Ob2RlKGl0ZW1zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3JjZSBoaWRlIHRoZSBsZWFkaW5nIHZpc2libGUgc2VwYXJhdG9ycy5cbiAgICAgICAgZm9yICh2YXIgazEgPSAwOyBrMSA8IGNvdW50OyArK2sxKSB7XG4gICAgICAgICAgICBpZiAoaXRlbXNbazFdLmhpZGRlbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2Rlc1trMV0uY2xhc3NMaXN0LmFkZChleHBvcnRzLkZPUkNFX0hJRERFTl9DTEFTUyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yY2UgaGlkZSB0aGUgdHJhaWxpbmcgdmlzaWJsZSBzZXBhcmF0b3JzLlxuICAgICAgICBmb3IgKHZhciBrMiA9IGNvdW50IC0gMTsgazIgPj0gMDsgLS1rMikge1xuICAgICAgICAgICAgaWYgKGl0ZW1zW2syXS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXRlbXNbazJdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZXNbazJdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcmNlIGhpZGUgdGhlIHJlbWFpbmluZyBjb25zZWN1dGl2ZSB2aXNpYmxlIHNlcGFyYXRvcnMuXG4gICAgICAgIHZhciBoaWRlID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICgrK2sxIDwgazIpIHtcbiAgICAgICAgICAgIGlmIChpdGVtc1trMV0uaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGlkZSAmJiBpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgbm9kZXNbazFdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGlkZSA9IGl0ZW1zW2sxXS5pc1NlcGFyYXRvclR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmV0Y2ggdGhlIGNvbnRlbnQgbm9kZS5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgLy8gUmVmcmVzaCB0aGUgY29udGVudCBub2RlJ3MgY29udGVudC5cbiAgICAgICAgY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQobm9kZXNbaV0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdjbG9zZS1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5vbkNsb3NlUmVxdWVzdCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbkNsb3NlUmVxdWVzdC5jYWxsKHRoaXMsIG1zZyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnbW91c2Vkb3duJ2AgZXZlbnQgZm9yIHRoZSBtZW51IGJhci5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fZXZ0TW91c2VEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgdmFyIHkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICAvLyBJZiB0aGUgYmFyIGlzIGFjdGl2ZSBhbmQgdGhlIG1vdXNlIHByZXNzIGlzIG9uIGFuIG9wZW4gbWVudSxcbiAgICAgICAgLy8gbGV0IHRoYXQgbWVudSBoYW5kbGUgdGhlIHByZXNzLiBUaGUgYmFyIHdpbGwgcmVzZXQgd2hlbiB0aGVcbiAgICAgICAgLy8gbWVudSBlbWl0cyBpdHMgYGNsb3NlZGAgc2lnbmFsLlxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlICYmIGhpdFRlc3RNZW51cyh0aGlzLl9jaGlsZE1lbnUsIHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIG1vdXNlIHdhcyBwcmVzc2VkIG9uIG9uZSBvZiB0aGUgbWVudSBpdGVtcy5cbiAgICAgICAgdmFyIGkgPSB0aGlzLl9oaXRUZXN0SXRlbU5vZGVzKHgsIHkpO1xuICAgICAgICAvLyBJZiB0aGUgYmFyIGlzIGFjdGl2ZSwgZGVhY3RpdmF0ZSBpdCBhbmQgY2xvc2UgdGhlIGNoaWxkIG1lbnUuXG4gICAgICAgIC8vIFRoZSBhY3RpdmUgaW5kZXggaXMgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBtb3VzZSBwcmVzcywgd2hpY2hcbiAgICAgICAgLy8gaXMgZWl0aGVyIHZhbGlkLCBvciBgLTFgLlxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIGJhciBpcyBub3QgYWN0aXZlLiBJZiB0aGUgbW91c2UgcHJlc3NcbiAgICAgICAgLy8gd2FzIG5vdCBvbiBhIG1lbnUgaXRlbSwgY2xlYXIgdGhlIGFjdGl2ZSBpbmRleCBhbmQgcmV0dXJuLlxuICAgICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSAtMTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UsIHRoZSBwcmVzcyB3YXMgb24gYSBtZW51IGl0ZW0uIEFjdGl2YXRlIHRoZSBiYXIsXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgYWN0aXZlIGluZGV4LCBhbmQgb3BlbiB0aGUgbWVudSBpdGVtIGlmIHBvc3NpYmxlLlxuICAgICAgICB0aGlzLl9hY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5vcGVuQWN0aXZlSXRlbSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNlbW92ZSdgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2V2dE1vdXNlTW92ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIHZhciB5ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIG1vdXNlIGlzIG92ZXIgb25lIG9mIHRoZSBtZW51IGl0ZW1zLlxuICAgICAgICB2YXIgaSA9IHRoaXMuX2hpdFRlc3RJdGVtTm9kZXMoeCwgeSk7XG4gICAgICAgIC8vIEJhaWwgZWFybHkgaWYgdGhlIGFjdGl2ZSBpbmRleCB3aWxsIG5vdCBjaGFuZ2UuXG4gICAgICAgIGlmIChpID09PSB0aGlzLmFjdGl2ZUluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQmFpbCBlYXJseSBpZiB0aGUgYmFyIGlzIGFjdGl2ZSBhbmQgdGhlIG1vdXNlIGlzIG5vdCBvdmVyIGFuXG4gICAgICAgIC8vIGl0ZW0uIFRoaXMgYWxsb3dzIHRoZSBsZWFkaW5nIGFuZCB0cmFpbGluZyBtZW51cyB0byBiZSBrZXB0XG4gICAgICAgIC8vIG9wZW4gd2hlbiB0aGUgbW91c2UgaXMgb3ZlciB0aGUgZW1wdHkgcGFydCBvZiB0aGUgbWVudSBiYXIuXG4gICAgICAgIGlmIChpID09PSAtMSAmJiB0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIGFjdGl2ZSBpbmRleCB0byB0aGUgaG92ZXJlZCBpdGVtLlxuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gaTtcbiAgICAgICAgLy8gSWYgdGhlIGJhciBpcyBub3QgYWN0aXZlLCB0aGVyZSdzIG5vdGhpbmcgbW9yZSB0byBkby5cbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UsIGNsb3NlIHRoZSBjdXJyZW50IGNoaWxkIG1lbnUgYW5kIG9wZW4gdGhlIG5ldyBvbmUuXG4gICAgICAgIHRoaXMuX2Nsb3NlQ2hpbGRNZW51KCk7XG4gICAgICAgIHRoaXMub3BlbkFjdGl2ZUl0ZW0oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdtb3VzZWxlYXZlJ2AgZXZlbnQgZm9yIHRoZSBtZW51IGJhci5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fZXZ0TW91c2VMZWF2ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZSlcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSAtMTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdjb250ZXh0bWVudSdgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2V2dENvbnRleHRNZW51ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ2tleWRvd24nYCBldmVudCBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9ldnRLZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB2YXIgbWVudSA9IHRoaXMuX2NoaWxkTWVudTtcbiAgICAgICAgdmFyIGxlYWYgPSBtZW51ICYmIG1lbnUubGVhZk1lbnU7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFmKVxuICAgICAgICAgICAgICAgICAgICBsZWFmLnRyaWdnZXJBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWYpXG4gICAgICAgICAgICAgICAgICAgIGxlYWYuY2xvc2UodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWYgJiYgbGVhZiAhPT0gbWVudSkge1xuICAgICAgICAgICAgICAgICAgICBsZWFmLmNsb3NlKHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5BY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFmKVxuICAgICAgICAgICAgICAgICAgICBsZWFmLmFjdGl2YXRlUHJldmlvdXNJdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWYgJiYgYWN0aXZlSGFzTWVudShsZWFmKSkge1xuICAgICAgICAgICAgICAgICAgICBsZWFmLm9wZW5BY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlTmV4dEl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZilcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5hY3RpdmF0ZU5leHRJdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdrZXlwcmVzcydgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2V2dEtleVByZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB2YXIgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XG4gICAgICAgICh0aGlzLl9jaGlsZE1lbnUgfHwgdGhpcykuYWN0aXZhdGVNbmVtb25pY0l0ZW0oc3RyKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE9wZW4gdGhlIGNoaWxkIG1lbnUgdXNpbmcgdGhlIGdpdmVuIGl0ZW0gbm9kZSBmb3IgbG9jYXRpb24uXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX29wZW5DaGlsZE1lbnUgPSBmdW5jdGlvbiAobWVudSwgbm9kZSkge1xuICAgICAgICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG1lbnU7XG4gICAgICAgIG1lbnUuYWRkQ2xhc3MoZXhwb3J0cy5NRU5VX0NMQVNTKTtcbiAgICAgICAgbWVudS5vcGVuKHJlY3QubGVmdCwgcmVjdC5ib3R0b20sIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgbWVudS5jbG9zZWQuY29ubmVjdCh0aGlzLl9vbk1lbnVDbG9zZWQsIHRoaXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGN1cnJlbnQgY2hpbGQgbWVudSwgaWYgb25lIGV4aXN0cy5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fY2xvc2VDaGlsZE1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtZW51ID0gdGhpcy5fY2hpbGRNZW51O1xuICAgICAgICBpZiAobWVudSkge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRNZW51ID0gbnVsbDtcbiAgICAgICAgICAgIG1lbnUuY2xvc2VkLmRpc2Nvbm5lY3QodGhpcy5fb25NZW51Q2xvc2VkLCB0aGlzKTtcbiAgICAgICAgICAgIG1lbnUucmVtb3ZlQ2xhc3MoZXhwb3J0cy5NRU5VX0NMQVNTKTtcbiAgICAgICAgICAgIG1lbnUuY2xvc2UodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFjdGl2YXRlIHRoZSBtZW51IGJhciBhbmQgc3dpdGNoIHRoZSBtb3VzZSBsaXN0ZW5lcnMgdG8gZ2xvYmFsLlxuICAgICAqXG4gICAgICogVGhlIGxpc3RlbmVycyBhcmUgc3dpdGNoZWQgYWZ0ZXIgdGhlIGN1cnJlbnQgZXZlbnQgZGlzcGF0Y2ggaXNcbiAgICAgKiBjb21wbGV0ZS4gT3RoZXJ3aXNlLCBkdXBsaWNhdGUgZXZlbnQgbm90aWZpY2F0aW9ucyBjb3VsZCBvY2N1ci5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFkZENsYXNzKGV4cG9ydHMuQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF90aGlzKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF90aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIF90aGlzLCB0cnVlKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEZWFjdGl2YXRlIHRoZSBtZW51IGJhciBzd2l0Y2ggdGhlIG1vdXNlIGxpc3RlbmVycyB0byBsb2NhbC5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0ZW5lcnMgYXJlIHN3aXRjaGVkIGFmdGVyIHRoZSBjdXJyZW50IGV2ZW50IGRpc3BhdGNoIGlzXG4gICAgICogY29tcGxldGUuIE90aGVyd2lzZSwgZHVwbGljYXRlIGV2ZW50IG5vdGlmaWNhdGlvbnMgY291bGQgb2NjdXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2RlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoZXhwb3J0cy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX3RoaXMpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX3RoaXMsIHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIF90aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgX3RoaXMsIHRydWUpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBtZW51IGJhciB0byBpdHMgZGVmYXVsdCBzdGF0ZS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2RlYWN0aXZhdGUoKTtcbiAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtZW51IGl0ZW0gbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXguXG4gICAgICpcbiAgICAgKiBUaGlzIHdpbGwgcmV0dXJuIGB1bmRlZmluZWRgIGlmIHRoZSBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2l0ZW1Ob2RlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQuY2hpbGRyZW5baW5kZXhdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbmRleCBvZiB0aGUgbWVudSBpdGVtIG5vZGUgYXQgYSBjbGllbnQgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIHdpbGwgcmV0dXJuIGAtMWAgaWYgdGhlIG1lbnUgaXRlbSBub2RlIGlzIG5vdCBmb3VuZC5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5faGl0VGVzdEl0ZW1Ob2RlcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMubm9kZS5maXJzdENoaWxkLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IG5vZGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgaWYgKHBob3NwaG9yX2RvbXV0aWxfMS5oaXRUZXN0KG5vZGVzW2ldLCB4LCB5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGBjbG9zZWRgIHNpZ25hbCBmcm9tIHRoZSBjaGlsZCBtZW51LlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9vbk1lbnVDbG9zZWQgPSBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICAgIHNlbmRlci5jbG9zZWQuZGlzY29ubmVjdCh0aGlzLl9vbk1lbnVDbG9zZWQsIHRoaXMpO1xuICAgICAgICBzZW5kZXIucmVtb3ZlQ2xhc3MoZXhwb3J0cy5NRU5VX0NMQVNTKTtcbiAgICAgICAgdGhpcy5fY2hpbGRNZW51ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgcHJvcGVydHkgY2hhbmdlZCBzaWduYWwgZnJvbSBhIG1lbnUgaXRlbS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9O1xuICAgIHJldHVybiBNZW51QmFyO1xufSkobWVudWJhc2VfMS5NZW51QmFzZSk7XG5leHBvcnRzLk1lbnVCYXIgPSBNZW51QmFyO1xuLyoqXG4gKiBDcmVhdGUgYSBtZW51IGl0ZW0gZnJvbSBhIHRlbXBsYXRlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVNZW51SXRlbSh0ZW1wbGF0ZSkge1xuICAgIHJldHVybiBtZW51aXRlbV8xLk1lbnVJdGVtLmZyb21UZW1wbGF0ZSh0ZW1wbGF0ZSk7XG59XG4vKipcbiAqIENyZWF0ZSB0aGUgY29tcGxldGUgRE9NIG5vZGUgY2xhc3MgbmFtZSBmb3IgYSBNZW51SXRlbS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSXRlbUNsYXNzTmFtZShpdGVtKSB7XG4gICAgdmFyIHBhcnRzID0gW2V4cG9ydHMuTUVOVV9JVEVNX0NMQVNTXTtcbiAgICBpZiAoaXRlbS5pc1NlcGFyYXRvclR5cGUpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLlNFUEFSQVRPUl9UWVBFX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkRJU0FCTEVEX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uaGlkZGVuKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5ISURERU5fQ0xBU1MpO1xuICAgIH1cbiAgICBpZiAoaXRlbS5jbGFzc05hbWUpIHtcbiAgICAgICAgcGFydHMucHVzaChpdGVtLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cy5qb2luKCcgJyk7XG59XG4vKipcbiAqIENyZWF0ZSB0aGUgRE9NIG5vZGUgZm9yIGEgTWVudUl0ZW0uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW1Ob2RlKGl0ZW0pIHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG5vZGUuY2xhc3NOYW1lID0gY3JlYXRlSXRlbUNsYXNzTmFtZShpdGVtKTtcbiAgICBpY29uLmNsYXNzTmFtZSA9IGV4cG9ydHMuSUNPTl9DTEFTUztcbiAgICB0ZXh0LmNsYXNzTmFtZSA9IGV4cG9ydHMuVEVYVF9DTEFTUztcbiAgICBpZiAoIWl0ZW0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgIHRleHQudGV4dENvbnRlbnQgPSBpdGVtLnRleHQucmVwbGFjZSgvJi9nLCAnJyk7XG4gICAgfVxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgbm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICByZXR1cm4gbm9kZTtcbn1cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgbWVudSdzIGFjdGl2ZSBpdGVtIGhhcyBhIHN1Ym1lbnUuXG4gKi9cbmZ1bmN0aW9uIGFjdGl2ZUhhc01lbnUobWVudSkge1xuICAgIHZhciBpdGVtID0gbWVudS5pdGVtc1ttZW51LmFjdGl2ZUluZGV4XTtcbiAgICByZXR1cm4gISEoaXRlbSAmJiBpdGVtLnN1Ym1lbnUpO1xufVxuLyoqXG4gKiBIaXQgdGVzdCB0aGUgY2hhaW4gbWVudXMgZm9yIHRoZSBnaXZlbiBjbGllbnQgcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGhpdFRlc3RNZW51cyhtZW51LCB4LCB5KSB7XG4gICAgd2hpbGUgKG1lbnUpIHtcbiAgICAgICAgaWYgKHBob3NwaG9yX2RvbXV0aWxfMS5oaXRUZXN0KG1lbnUubm9kZSwgeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG1lbnUgPSBtZW51LmNoaWxkTWVudTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVudWJhci5qcy5tYXAiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGFycmF5cyA9IHJlcXVpcmUoJ3Bob3NwaG9yLWFycmF5cycpO1xudmFyIHBob3NwaG9yX3Byb3BlcnRpZXNfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXByb3BlcnRpZXMnKTtcbnZhciBwaG9zcGhvcl93aWRnZXRfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXdpZGdldCcpO1xuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGltcGxlbWVudGluZyB3aWRnZXRzIHdoaWNoIGRpc3BsYXkgbWVudSBpdGVtcy5cbiAqL1xudmFyIE1lbnVCYXNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWVudUJhc2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWVudUJhc2UoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUJhc2UucHJvdG90eXBlLCBcIml0ZW1zXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgYXJyYXkgb2YgbWVudSBpdGVtcy5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tpdGVtc1Byb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51QmFzZS5pdGVtc1Byb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgYXJyYXkgb2YgbWVudSBpdGVtcy5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tpdGVtc1Byb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUJhc2UuaXRlbXNQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUJhc2UucHJvdG90eXBlLCBcImFjdGl2ZUluZGV4XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBpbmRleCBvZiB0aGUgYWN0aXZlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1thY3RpdmVJbmRleFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51QmFzZS5hY3RpdmVJbmRleFByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCBpbmRleCBvZiB0aGUgYWN0aXZlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1thY3RpdmVJbmRleFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUJhc2UuYWN0aXZlSW5kZXhQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0ZSB0aGUgbmV4dCBzZWxlY3RhYmxlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgc2VhcmNoIHN0YXJ0cyB3aXRoIHRoZSBjdXJyZW50bHkgYWN0aXZlIGl0ZW0sIGFuZCBwcm9ncmVzc2VzXG4gICAgICogZm9yd2FyZCB1bnRpbCB0aGUgbmV4dCBzZWxlY3RhYmxlIGl0ZW0gaXMgZm91bmQuIFRoZSBzZWFyY2ggd2lsbFxuICAgICAqIHdyYXAgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIG1lbnUuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLmFjdGl2YXRlTmV4dEl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBrID0gdGhpcy5hY3RpdmVJbmRleCArIDE7XG4gICAgICAgIHZhciBpID0gayA+PSB0aGlzLml0ZW1zLmxlbmd0aCA/IDAgOiBrO1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gYXJyYXlzLmZpbmRJbmRleCh0aGlzLml0ZW1zLCBpc1NlbGVjdGFibGUsIGksIHRydWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWN0aXZhdGUgdGhlIHByZXZpb3VzIHNlbGVjdGFibGUgbWVudSBpdGVtLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBzZWFyY2ggc3RhcnRzIHdpdGggdGhlIGN1cnJlbnRseSBhY3RpdmUgaXRlbSwgYW5kIHByb2dyZXNzZXNcbiAgICAgKiBiYWNrd2FyZCB1bnRpbCB0aGUgbmV4dCBzZWxlY3RhYmxlIGl0ZW0gaXMgZm91bmQuIFRoZSBzZWFyY2ggd2lsbFxuICAgICAqIHdyYXAgYXJvdW5kIGF0IHRoZSBmcm9udCBvZiB0aGUgbWVudS5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUuYWN0aXZhdGVQcmV2aW91c0l0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBrID0gdGhpcy5hY3RpdmVJbmRleDtcbiAgICAgICAgdmFyIGkgPSBrIDw9IDAgPyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgOiBrIC0gMTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGFycmF5cy5yZmluZEluZGV4KHRoaXMuaXRlbXMsIGlzU2VsZWN0YWJsZSwgaSwgdHJ1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0ZSB0aGUgbmV4dCBzZWxlY3RhYmxlIG1lbnUgaXRlbSB3aXRoIHRoZSBnaXZlbiBtbmVtb25pYy5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgc2VhcmNoIHN0YXJ0cyB3aXRoIHRoZSBjdXJyZW50bHkgYWN0aXZlIGl0ZW0sIGFuZCBwcm9ncmVzc2VzXG4gICAgICogZm9yd2FyZCB1bnRpbCB0aGUgbmV4dCBzZWxlY3RhYmxlIGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gbW5lbW9uaWMgaXNcbiAgICAgKiBmb3VuZC4gVGhlIHNlYXJjaCB3aWxsIHdyYXAgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIG1lbnUsIGFuZCB0aGVcbiAgICAgKiBtbmVtb25pYyBtYXRjaGluZyBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICAgICAqL1xuICAgIE1lbnVCYXNlLnByb3RvdHlwZS5hY3RpdmF0ZU1uZW1vbmljSXRlbSA9IGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgICAgIHZhciBjID0gY2hhci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB2YXIgayA9IHRoaXMuYWN0aXZlSW5kZXggKyAxO1xuICAgICAgICB2YXIgaSA9IGsgPj0gdGhpcy5pdGVtcy5sZW5ndGggPyAwIDogaztcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGFycmF5cy5maW5kSW5kZXgodGhpcy5pdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICghaXNTZWxlY3RhYmxlKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hdGNoID0gaXRlbS50ZXh0Lm1hdGNoKC8mXFx3Lyk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzBdWzFdLnRvVXBwZXJDYXNlKCkgPT09IGM7XG4gICAgICAgIH0sIGksIHRydWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogT3BlbiB0aGUgYWN0aXZlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGlzIGEgbm8tb3AgaWYgdGhlcmUgaXMgbm8gYWN0aXZlIG1lbnUgaXRlbSwgb3IgaWYgdGhlIGFjdGl2ZVxuICAgICAqIG1lbnUgaXRlbSBkb2VzIG5vdCBoYXZlIGEgc3VibWVudS5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUub3BlbkFjdGl2ZUl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5hY3RpdmVJbmRleDtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLnN1Ym1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuSXRlbShpLCBpdGVtKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciB0aGUgYWN0aXZlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGlzIGEgbm8tb3AgaWYgdGhlcmUgaXMgbm8gYWN0aXZlIG1lbnUgaXRlbS4gSWYgdGhlIGFjdGl2ZVxuICAgICAqIG1lbnUgaXRlbSBoYXMgYSBzdWJtZW51LCB0aGlzIGlzIGVxdWl2YWxlbnQgdG8gYG9wZW5BY3RpdmVJdGVtYC5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUudHJpZ2dlckFjdGl2ZUl0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5hY3RpdmVJbmRleDtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLnN1Ym1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMub25PcGVuSXRlbShpLCBpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLm9uVHJpZ2dlckl0ZW0oaSwgaXRlbSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBjb2VyY2UgaGFuZGxlciBmb3IgdGhlIFtbYWN0aXZlSW5kZXhQcm9wZXJ0eV1dLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFN1YmNsYXNzZXMgbWF5IHJlaW1wbGVtZW50IHRoaXMgbWV0aG9kIGFzIG5lZWRlZC5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUuY29lcmNlQWN0aXZlSW5kZXggPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGkgPSBpbmRleCB8IDA7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIGlzU2VsZWN0YWJsZShpdGVtKSkgPyBpIDogLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gdGhlIG1lbnUgaXRlbXMgY2hhbmdlLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUub25JdGVtc0NoYW5nZWQgPSBmdW5jdGlvbiAob2xkLCBpdGVtcykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiB0aGUgYWN0aXZlIGluZGV4IGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIE1lbnVCYXNlLnByb3RvdHlwZS5vbkFjdGl2ZUluZGV4Q2hhbmdlZCA9IGZ1bmN0aW9uIChvbGQsIGluZGV4KSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIGEgbWVudSBpdGVtIHNob3VsZCBiZSBvcGVuZWQuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGhhbmRsZXIgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUub25PcGVuSXRlbSA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiBhIG1lbnUgaXRlbSBzaG91bGQgYmUgdHJpZ2dlcmVkLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLm9uVHJpZ2dlckl0ZW0gPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHsgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIG1lbnUgaXRlbXMuXG4gICAgICpcbiAgICAgKiBUaGlzIGNvbnRyb2xzIHRoZSBpdGVtcyB3aGljaCBhcmUgY29udGFpbmVkIGluIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIEluLXBsYWNlIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGFycmF5IGFyZSBub3QgYWxsb3dlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tpdGVtc11dXG4gICAgICovXG4gICAgTWVudUJhc2UuaXRlbXNQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogT2JqZWN0LmZyZWV6ZShbXSksXG4gICAgICAgIGNvZXJjZTogZnVuY3Rpb24gKG93bmVyLCB2YWx1ZSkgeyByZXR1cm4gT2JqZWN0LmZyZWV6ZSh2YWx1ZSA/IHZhbHVlLnNsaWNlKCkgOiBbXSk7IH0sXG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChvd25lciwgb2xkLCB2YWx1ZSkgeyByZXR1cm4gb3duZXIub25JdGVtc0NoYW5nZWQob2xkLCB2YWx1ZSk7IH0sXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSBhY3RpdmUgaW5kZXguXG4gICAgICpcbiAgICAgKiBUaGlzIGNvbnRyb2xzIHdoaWNoIG1lbnUgaXRlbSBpcyB0aGUgYWN0aXZlIGl0ZW0uXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbYWN0aXZlSW5kZXhdXVxuICAgICAqL1xuICAgIE1lbnVCYXNlLmFjdGl2ZUluZGV4UHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6IC0xLFxuICAgICAgICBjb2VyY2U6IGZ1bmN0aW9uIChvd25lciwgaW5kZXgpIHsgcmV0dXJuIG93bmVyLmNvZXJjZUFjdGl2ZUluZGV4KGluZGV4KTsgfSxcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKG93bmVyLCBvbGQsIGluZGV4KSB7IHJldHVybiBvd25lci5vbkFjdGl2ZUluZGV4Q2hhbmdlZChvbGQsIGluZGV4KTsgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gTWVudUJhc2U7XG59KShwaG9zcGhvcl93aWRnZXRfMS5XaWRnZXQpO1xuZXhwb3J0cy5NZW51QmFzZSA9IE1lbnVCYXNlO1xuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBtZW51IGl0ZW0gaXMgc2VsZWN0YWJsZS5cbiAqL1xuZnVuY3Rpb24gaXNTZWxlY3RhYmxlKGl0ZW0pIHtcbiAgICByZXR1cm4gIWl0ZW0uaGlkZGVuICYmICFpdGVtLmRpc2FibGVkICYmICFpdGVtLmlzU2VwYXJhdG9yVHlwZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnViYXNlLmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHBob3NwaG9yX3Byb3BlcnRpZXNfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXByb3BlcnRpZXMnKTtcbnZhciBtZW51XzEgPSByZXF1aXJlKCcuL21lbnUnKTtcbi8qKlxuICogQW4gaXRlbSB3aGljaCBjYW4gYmUgYWRkZWQgdG8gYSBtZW51IG9yIG1lbnUgYmFyLlxuICovXG52YXIgTWVudUl0ZW0gPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBpbml0aWFsaXphdGlvbiBvcHRpb25zIGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE1lbnVJdGVtKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMpXG4gICAgICAgICAgICBpbml0RnJvbU9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG1lbnUgaXRlbSBmcm9tIGEgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGUgLSBUaGUgdGVtcGxhdGUgb2JqZWN0IGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBuZXcgbWVudSBpdGVtIGNyZWF0ZWQgZnJvbSB0aGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgYSBzdWJtZW51IHRlbXBsYXRlIGlzIHByb3ZpZGVkLCB0aGUgc3VibWVudSB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBieSBjYWxsaW5nIGBNZW51LmZyb21UZW1wbGF0ZWAuIElmIGEgY3VzdG9tIG1lbnUgaXMgbmVjZXNzYXJ5LFxuICAgICAqIHVzZSB0aGUgYE1lbnVJdGVtYCBjb25zdHJ1Y3RvciBkaXJlY3RseS5cbiAgICAgKi9cbiAgICBNZW51SXRlbS5mcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTWVudUl0ZW0oKTtcbiAgICAgICAgaW5pdEZyb21UZW1wbGF0ZShpdGVtLCB0ZW1wbGF0ZSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJ0eXBlXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgdHlwZSBvZiB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3R5cGVQcm9wZXJ0eV1dLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbaXNOb3JtYWxUeXBlXV0sIFtbaXNDaGVja1R5cGVdXSwgW1tpc1NlcGFyYXRvclR5cGVdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0udHlwZVByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgdHlwZSBvZiB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3R5cGVQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLnR5cGVQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcInRleHRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSB0ZXh0IGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3RleHRQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0udGV4dFByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgdGV4dCBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1t0ZXh0UHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBNZW51SXRlbS50ZXh0UHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJzaG9ydGN1dFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIHNob3J0Y3V0IGtleSBmb3IgdGhlIG1lbnUgaXRlbSAoZGVjb3JhdGlvbiBvbmx5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tzaG9ydGN1dFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5zaG9ydGN1dFByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgc2hvcnRjdXQga2V5IGZvciB0aGUgbWVudSBpdGVtIChkZWNvcmF0aW9uIG9ubHkpLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3Nob3J0Y3V0UHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBNZW51SXRlbS5zaG9ydGN1dFByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiZGlzYWJsZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBkaXNhYmxlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tkaXNhYmxlZFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5kaXNhYmxlZFByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgZGlzYWJsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbZGlzYWJsZWRQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLmRpc2FibGVkUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJoaWRkZW5cIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBoaWRkZW4uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaGlkZGVuUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLmhpZGRlblByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgaGlkZGVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2hpZGRlblByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0uaGlkZGVuUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJjaGVja2VkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgY2hlY2tlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tjaGVja2VkUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLmNoZWNrZWRQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGNoZWNrZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbY2hlY2tlZFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0uY2hlY2tlZFByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiY2xhc3NOYW1lXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgZXh0cmEgY2xhc3MgbmFtZSBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tjbGFzc05hbWVQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0uY2xhc3NOYW1lUHJvcGVydHkuZ2V0KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBleHRyYSBjbGFzcyBuYW1lIGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2NsYXNzTmFtZVByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0uY2xhc3NOYW1lUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJoYW5kbGVyXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgaGFuZGxlciBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1toYW5kbGVyUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLmhhbmRsZXJQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIGhhbmRsZXIgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaGFuZGxlclByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0uaGFuZGxlclByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwic3VibWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIHN1Ym1lbnUgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbc3VibWVudVByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5zdWJtZW51UHJvcGVydHkuZ2V0KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBzdWJtZW51IGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3N1Ym1lbnVQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLnN1Ym1lbnVQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcImlzTm9ybWFsVHlwZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXN0IHdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBhIGAnbm9ybWFsJ2AgdHlwZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbdHlwZV1dLCBbW2lzQ2hlY2tUeXBlXV0sIFtbaXNTZXBhcmF0b3JUeXBlXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ25vcm1hbCc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiaXNDaGVja1R5cGVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgYSBgJ2NoZWNrJ2AgdHlwZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbdHlwZV1dLCBbW2lzTm9ybWFsVHlwZV1dLCBbW2lzU2VwYXJhdG9yVHlwZV1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdjaGVjayc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiaXNTZXBhcmF0b3JUeXBlXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGEgYCdzZXBhcmF0b3InYCB0eXBlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1t0eXBlXV0sIFtbaXNOb3JtYWxUeXBlXV0sIFtbaXNDaGVja1R5cGVdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnc2VwYXJhdG9yJztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSBtZW51IGl0ZW0gdHlwZS5cbiAgICAgKlxuICAgICAqIFZhbGlkIHR5cGVzIGFyZTogYCdub3JtYWwnYCwgYCdjaGVjaydgLCBhbmQgYCdzZXBhcmF0b3InYC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJZiBhbiBpbnZhbGlkIHR5cGUgaXMgcHJvdmlkZWQsIGEgd2FybmluZyB3aWxsIGJlIGxvZ2dlZCBhbmQgYVxuICAgICAqIGAnbm9ybWFsJ2AgdHlwZSB3aWxsIGJlIHVzZWQgaW5zdGVhZC5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGAnbm9ybWFsJ2AuXG4gICAgICpcbiAgICAgKiBVc2luZyBhIHN0cmluZyBmb3IgdGhpcyB2YWx1ZSBpbnN0ZWFkIG9mIGFuIGVudW0gbWFrZXMgaXQgZWFzaWVyXG4gICAgICogdG8gY3JlYXRlIG1lbnUgaXRlbXMgZnJvbSBhIEpTT04gc3BlY2lmaWNhdGlvbi4gRm9yIHRoZSB0eXBlLXNhZmVcbiAgICAgKiBjcm93ZCwgcmVhZC1vbmx5IGdldHRlcnMgYXJlIHByb3ZpZGVkIHRvIGFzc2VydCB0aGUgaXRlbSB0eXBlLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3R5cGVdXVxuICAgICAqL1xuICAgIE1lbnVJdGVtLnR5cGVQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogJ25vcm1hbCcsXG4gICAgICAgIGNvZXJjZTogY29lcmNlTWVudUl0ZW1UeXBlLFxuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAob3duZXIpIHsgcmV0dXJuIE1lbnVJdGVtLmNoZWNrZWRQcm9wZXJ0eS5jb2VyY2Uob3duZXIpOyB9LFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgbWVudSBpdGVtIHRleHQuXG4gICAgICpcbiAgICAgKiBUaGUgdGV4dCBtYXkgaGF2ZSBhbiBhbXBlcnNhbmQgYCZgIGJlZm9yZSB0aGUgY2hhcmFjdGVyXG4gICAgICogdG8gdXNlIGFzIHRoZSBtbmVtb25pYyBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1t0ZXh0XV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS50ZXh0UHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgbWVudSBpdGVtIHNob3J0Y3V0LlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3Nob3J0Y3V0XV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5zaG9ydGN1dFByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBjb250cm9sbGluZyB0aGUgbWVudSBpdGVtIGRpc2FibGVkIHN0YXRlLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2Rpc2FibGVkXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5kaXNhYmxlZFByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBjb250cm9sbGluZyB0aGUgbWVudSBpdGVtIGhpZGRlbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1toaWRkZW5dXVxuICAgICAqL1xuICAgIE1lbnVJdGVtLmhpZGRlblByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBjb250cm9sbGluZyB0aGUgbWVudSBpdGVtIGNoZWNrZWQgc3RhdGUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogT25seSBhIGAnY2hlY2snYCB0eXBlIG1lbnUgaXRlbSBjYW4gYmUgY2hlY2tlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tjaGVja2VkXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5jaGVja2VkUHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICBjb2VyY2U6IGZ1bmN0aW9uIChvd25lciwgdmFsKSB7IHJldHVybiBvd25lci50eXBlID09PSAnY2hlY2snID8gdmFsIDogZmFsc2U7IH0sXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSBtZW51IGl0ZW0gY2xhc3MgbmFtZS5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgYW4gZXh0cmEgY2xhc3MgbmFtZSB3aGljaCBpdGVtIHJlbmRlcmVycyB3aWxsIGFkZCB0b1xuICAgICAqIHRoZSBET00gbm9kZSB3aGljaCByZXByZXNlbnRzIHRoZSBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2xhc3NOYW1lXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5jbGFzc05hbWVQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSBpdGVtIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBUaGlzIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBtZW51IGl0ZW0gaXMgdHJpZ2dlcmVkLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2hhbmRsZXJdXVxuICAgICAqL1xuICAgIE1lbnVJdGVtLmhhbmRsZXJQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgY29lcmNlOiBmdW5jdGlvbiAob3duZXIsIHZhbHVlKSB7IHJldHVybiB2YWx1ZSB8fCBudWxsOyB9LFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgbWVudSBpdGVtIHN1Ym1lbnUuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbc3VibWVudV1dXG4gICAgICovXG4gICAgTWVudUl0ZW0uc3VibWVudVByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICBjb2VyY2U6IGZ1bmN0aW9uIChvd25lciwgdmFsdWUpIHsgcmV0dXJuIHZhbHVlIHx8IG51bGw7IH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIE1lbnVJdGVtO1xufSkoKTtcbmV4cG9ydHMuTWVudUl0ZW0gPSBNZW51SXRlbTtcbi8qKlxuICogSW5pdGlhbGl6ZSBhIG1lbnUgaXRlbSBmcm9tIGEgY29tbW9uIG9wdGlvbnMgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbml0RnJvbUNvbW1vbihpdGVtLCBjb21tb24pIHtcbiAgICBpZiAoY29tbW9uLnR5cGUgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLnR5cGUgPSBjb21tb24udHlwZTtcbiAgICB9XG4gICAgaWYgKGNvbW1vbi50ZXh0ICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS50ZXh0ID0gY29tbW9uLnRleHQ7XG4gICAgfVxuICAgIGlmIChjb21tb24uc2hvcnRjdXQgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLnNob3J0Y3V0ID0gY29tbW9uLnNob3J0Y3V0O1xuICAgIH1cbiAgICBpZiAoY29tbW9uLmRpc2FibGVkICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS5kaXNhYmxlZCA9IGNvbW1vbi5kaXNhYmxlZDtcbiAgICB9XG4gICAgaWYgKGNvbW1vbi5oaWRkZW4gIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLmhpZGRlbiA9IGNvbW1vbi5oaWRkZW47XG4gICAgfVxuICAgIGlmIChjb21tb24uY2hlY2tlZCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0uY2hlY2tlZCA9IGNvbW1vbi5jaGVja2VkO1xuICAgIH1cbiAgICBpZiAoY29tbW9uLmNsYXNzTmFtZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gY29tbW9uLmNsYXNzTmFtZTtcbiAgICB9XG4gICAgaWYgKGNvbW1vbi5oYW5kbGVyICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS5oYW5kbGVyID0gY29tbW9uLmhhbmRsZXI7XG4gICAgfVxufVxuLyoqXG4gKiBJbml0aWFsaXplIGEgbWVudSBpdGVtIGZyb20gYSB0ZW1wbGF0ZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGluaXRGcm9tVGVtcGxhdGUoaXRlbSwgdGVtcGxhdGUpIHtcbiAgICBpbml0RnJvbUNvbW1vbihpdGVtLCB0ZW1wbGF0ZSk7XG4gICAgaWYgKHRlbXBsYXRlLnN1Ym1lbnUgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLnN1Ym1lbnUgPSBtZW51XzEuTWVudS5mcm9tVGVtcGxhdGUodGVtcGxhdGUuc3VibWVudSk7XG4gICAgfVxufVxuLyoqXG4gKiBJbml0aWFsaXplIGEgbWVudSBpdGVtIGZyb20gYW4gb3B0aW9ucyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGluaXRGcm9tT3B0aW9ucyhpdGVtLCBvcHRpb25zKSB7XG4gICAgaW5pdEZyb21Db21tb24oaXRlbSwgb3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMuc3VibWVudSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0uc3VibWVudSA9IG9wdGlvbnMuc3VibWVudTtcbiAgICB9XG59XG4vKipcbiAqIFRoZSBjb2VyY2UgaGFuZGxlciBmb3IgdGhlIG1lbnUgaXRlbSB0eXBlLlxuICovXG5mdW5jdGlvbiBjb2VyY2VNZW51SXRlbVR5cGUoaXRlbSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdub3JtYWwnIHx8IHZhbHVlID09PSAnY2hlY2snIHx8IHZhbHVlID09PSAnc2VwYXJhdG9yJykge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGNvbnNvbGUud2FybignaW52YWxpZCBtZW51IGl0ZW0gdHlwZTonLCB2YWx1ZSk7XG4gICAgcmV0dXJuICdub3JtYWwnO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVudWl0ZW0uanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgcGhvc3Bob3JfcXVldWVfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXF1ZXVlJyk7XG4vKipcbiAqIEEgbWVzYWdlIHdoaWNoIGNhbiBiZSBzZW50IG9yIHBvc3RlZCB0byBhIG1lc3NhZ2UgaGFuZGxlci5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIGNsYXNzIG1heSBiZSBzdWJjbGFzc2VkIHRvIGNyZWF0ZSBjb21wbGV4IG1lc3NhZ2UgdHlwZXMuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbcG9zdE1lc3NhZ2VdXSBhbmQgW1tzZW5kTWVzc2FnZV1dLlxuICovXG52YXIgTWVzc2FnZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBtZXNzYWdlLiBDb25zdW1lcnMgb2YgYSBtZXNzYWdlIHdpbGxcbiAgICAgKiAgIHVzZSB0aGlzIHZhbHVlIHRvIGNhc3QgdGhlIG1lc3NhZ2UgdG8gdGhlIGFwcHJvcHJpYXRlbHkgZGVyaXZlZFxuICAgICAqICAgbWVzc2FnZSB0eXBlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE1lc3NhZ2UodHlwZSkge1xuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lc3NhZ2UucHJvdG90eXBlLCBcInR5cGVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSB0eXBlIG9mIHRoZSBtZXNzYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIE1lc3NhZ2U7XG59KSgpO1xuZXhwb3J0cy5NZXNzYWdlID0gTWVzc2FnZTtcbi8qKlxuICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIG1lc3NhZ2UgaGFuZGxlciB0byBwcm9jZXNzIGltbWVkaWF0ZWx5LlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyIC0gVGhlIGhhbmRsZXIgd2hpY2ggc2hvdWxkIHByb2Nlc3MgdGhlIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIHNlbmQgdG8gdGhlIGhhbmRsZXIuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVW5saWtlIFtbcG9zdE1lc3NhZ2VdXSwgW1tzZW5kTWVzc2FnZV1dIGRlbGl2ZXJzIHRoZSBtZXNzYWdlIHRvXG4gKiB0aGUgaGFuZGxlciBpbW1lZGlhdGVseS4gVGhlIGhhbmRsZXIgd2lsbCBub3QgaGF2ZSB0aGUgb3Bwb3J0dW5pdHlcbiAqIHRvIGNvbXByZXNzIHRoZSBtZXNzYWdlLCBob3dldmVyIHRoZSBtZXNzYWdlIHdpbGwgc3RpbGwgYmUgc2VudFxuICogdGhyb3VnaCBhbnkgaW5zdGFsbGVkIG1lc3NhZ2UgZmlsdGVycy5cbiAqXG4gKiAqKlNlZSBBbHNvKiogW1twb3N0TWVzc2FnZV1dLlxuICovXG5mdW5jdGlvbiBzZW5kTWVzc2FnZShoYW5kbGVyLCBtc2cpIHtcbiAgICBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLnNlbmRNZXNzYWdlKGhhbmRsZXIsIG1zZyk7XG59XG5leHBvcnRzLnNlbmRNZXNzYWdlID0gc2VuZE1lc3NhZ2U7XG4vKipcbiAqIFBvc3QgYSBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlIGhhbmRsZXIgdG8gcHJvY2VzcyBpbiB0aGUgZnV0dXJlLlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyIC0gVGhlIGhhbmRsZXIgd2hpY2ggc2hvdWxkIHByb2Nlc3MgdGhlIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIHBvc3QgdG8gdGhlIGhhbmRsZXIuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVW5saWtlIFtbc2VuZE1lc3NhZ2VdXSwgW1twb3N0TWVzc2FnZV1dIHdpbGwgc2NoZWR1bGUgdGhlIGRlbGl2ZXIgb2ZcbiAqIHRoZSBtZXNzYWdlIGZvciB0aGUgbmV4dCBjeWNsZSBvZiB0aGUgZXZlbnQgbG9vcC4gVGhlIGhhbmRsZXIgd2lsbFxuICogaGF2ZSB0aGUgb3Bwb3J0dW5pdHkgdG8gY29tcHJlc3MgdGhlIG1lc3NhZ2UgaW4gb3JkZXIgdG8gb3B0aW1pemVcbiAqIGl0cyBoYW5kbGluZyBvZiBzaW1pbGFyIG1lc3NhZ2VzLiBUaGUgbWVzc2FnZSB3aWxsIGJlIHNlbnQgdGhyb3VnaFxuICogYW55IGluc3RhbGxlZCBtZXNzYWdlIGZpbHRlcnMgYmVmb3JlIGJlaW5nIGRlbGl2ZXJlZCB0byB0aGUgaGFuZGxlci5cbiAqXG4gKiAqKlNlZSBBbHNvKiogW1tzZW5kTWVzc2FnZV1dLlxuICovXG5mdW5jdGlvbiBwb3N0TWVzc2FnZShoYW5kbGVyLCBtc2cpIHtcbiAgICBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLnBvc3RNZXNzYWdlKGhhbmRsZXIsIG1zZyk7XG59XG5leHBvcnRzLnBvc3RNZXNzYWdlID0gcG9zdE1lc3NhZ2U7XG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIG1lc3NhZ2UgaGFuZGxlciBoYXMgcG9zdGVkIG1lc3NhZ2VzIHBlbmRpbmcgZGVsaXZlcnkuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgLSBUaGUgbWVzc2FnZSBoYW5kbGVyIG9mIGludGVyZXN0LlxuICpcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaGFuZGxlciBoYXMgcGVuZGluZyBwb3N0ZWQgbWVzc2FnZXMsIGBmYWxzZWBcbiAqICAgb3RoZXJ3aXNlLlxuICpcbiAqICoqU2VlIEFsc28qKiBbW3NlbmRQZW5kaW5nTWVzc2FnZV1dLlxuICovXG5mdW5jdGlvbiBoYXNQZW5kaW5nTWVzc2FnZXMoaGFuZGxlcikge1xuICAgIHJldHVybiBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLmhhc1BlbmRpbmdNZXNzYWdlcygpO1xufVxuZXhwb3J0cy5oYXNQZW5kaW5nTWVzc2FnZXMgPSBoYXNQZW5kaW5nTWVzc2FnZXM7XG4vKipcbiAqIFNlbmQgdGhlIGZpcnN0IHBlbmRpbmcgcG9zdGVkIG1lc3NhZ2UgdG8gdGhlIG1lc3NhZ2UgaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciAtIFRoZSBtZXNzYWdlIGhhbmRsZXIgb2YgaW50ZXJlc3QuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSWYgdGhlIGhhbmRsZXIgaGFzIG5vIHBlbmRpbmcgbWVzc2FnZXMsIHRoaXMgaXMgYSBuby1vcC5cbiAqXG4gKiAqKlNlZSBBbHNvKiogW1toYXNQZW5kaW5nTWVzc2FnZXNdXS5cbiAqL1xuZnVuY3Rpb24gc2VuZFBlbmRpbmdNZXNzYWdlKGhhbmRsZXIpIHtcbiAgICBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLnNlbmRQZW5kaW5nTWVzc2FnZShoYW5kbGVyKTtcbn1cbmV4cG9ydHMuc2VuZFBlbmRpbmdNZXNzYWdlID0gc2VuZFBlbmRpbmdNZXNzYWdlO1xuLyoqXG4gKiBJbnN0YWxsIGEgbWVzc2FnZSBmaWx0ZXIgZm9yIGEgbWVzc2FnZSBoYW5kbGVyLlxuICpcbiAqIEEgbWVzc2FnZSBmaWx0ZXIgaXMgaW52b2tlZCBiZWZvcmUgdGhlIG1lc3NhZ2UgaGFuZGxlciBwcm9jZXNzZXMgYVxuICogbWVzc2FnZS4gSWYgdGhlIGZpbHRlciByZXR1cm5zIGB0cnVlYCBmcm9tIGl0cyBbW2ZpbHRlck1lc3NhZ2VdXSBtZXRob2QsXG4gKiBubyBvdGhlciBmaWx0ZXJzIHdpbGwgYmUgaW52b2tlZCwgYW5kIHRoZSBtZXNzYWdlIHdpbGwgbm90IGJlIGRlbGl2ZXJlZC5cbiAqXG4gKiBUaGUgbW9zdCByZWNlbnRseSBpbnN0YWxsZWQgbWVzc2FnZSBmaWx0ZXIgaXMgZXhlY3V0ZWQgZmlyc3QuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgLSBUaGUgaGFuZGxlciB3aG9zZSBtZXNzYWdlcyBzaG91bGQgYmUgZmlsdGVyZWQuXG4gKlxuICogQHBhcmFtIGZpbHRlciAtIFRoZSBmaWx0ZXIgdG8gaW5zdGFsbCBmb3IgdGhlIGhhbmRsZXIuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgcG9zc2libGUgdG8gaW5zdGFsbCB0aGUgc2FtZSBmaWx0ZXIgbXVsdGlwbGUgdGltZXMuIElmIHRoZVxuICogZmlsdGVyIHNob3VsZCBiZSB1bmlxdWUsIGNhbGwgW1tyZW1vdmVNZXNzYWdlRmlsdGVyXV0gZmlyc3QuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbcmVtb3ZlTWVzc2FnZUZpbHRlcl1dLlxuICovXG5mdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUZpbHRlcihoYW5kbGVyLCBmaWx0ZXIpIHtcbiAgICBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLmluc3RhbGxNZXNzYWdlRmlsdGVyKGZpbHRlcik7XG59XG5leHBvcnRzLmluc3RhbGxNZXNzYWdlRmlsdGVyID0gaW5zdGFsbE1lc3NhZ2VGaWx0ZXI7XG4vKipcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgaW5zdGFsbGVkIG1lc3NhZ2UgZmlsdGVyIGZvciBhIG1lc3NhZ2UgaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciAtIFRoZSBoYW5kbGVyIGZvciB3aGljaCB0aGUgZmlsdGVyIGlzIGluc3RhbGxlZC5cbiAqXG4gKiBAcGFyYW0gZmlsdGVyIC0gVGhlIGZpbHRlciB0byByZW1vdmUuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyB3aWxsIHJlbW92ZSAqKmFsbCoqIG9jY3VycmVuY2VzIG9mIHRoZSBmaWx0ZXIuIElmIHRoZSBmaWx0ZXIgaXNcbiAqIG5vdCBpbnN0YWxsZWQsIHRoaXMgaXMgYSBuby1vcC5cbiAqXG4gKiBJdCBpcyBzYWZlIHRvIGNhbGwgdGhpcyBmdW5jdGlvbiB3aGlsZSB0aGUgZmlsdGVyIGlzIGV4ZWN1dGluZy5cbiAqXG4gKiAqKlNlZSBBbHNvKiogW1tpbnN0YWxsTWVzc2FnZUZpbHRlcl1dLlxuICovXG5mdW5jdGlvbiByZW1vdmVNZXNzYWdlRmlsdGVyKGhhbmRsZXIsIGZpbHRlcikge1xuICAgIGdldERpc3BhdGNoZXIoaGFuZGxlcikucmVtb3ZlTWVzc2FnZUZpbHRlcihmaWx0ZXIpO1xufVxuZXhwb3J0cy5yZW1vdmVNZXNzYWdlRmlsdGVyID0gcmVtb3ZlTWVzc2FnZUZpbHRlcjtcbi8qKlxuICogQ2xlYXIgYWxsIG1lc3NhZ2UgZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhlIG1lc3NhZ2UgaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciAtIFRoZSBtZXNzYWdlIGhhbmRsZXIgZm9yIHdoaWNoIHRvIGNsZWFyIHRoZSBkYXRhLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgd2lsbCByZW1vdmUgYWxsIHBlbmRpbmcgbWVzc2FnZXMgYW5kIGZpbHRlcnMgZm9yIHRoZSBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiBjbGVhck1lc3NhZ2VEYXRhKGhhbmRsZXIpIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXJNYXAuZ2V0KGhhbmRsZXIpO1xuICAgIGlmIChkaXNwYXRjaGVyKVxuICAgICAgICBkaXNwYXRjaGVyLmNsZWFyKCk7XG4gICAgZGlzcGF0Y2hRdWV1ZS5yZW1vdmVBbGwoaGFuZGxlcik7XG59XG5leHBvcnRzLmNsZWFyTWVzc2FnZURhdGEgPSBjbGVhck1lc3NhZ2VEYXRhO1xuLyoqXG4gKiBUaGUgaW50ZXJuYWwgbWFwcGluZyBvZiBtZXNzYWdlIGhhbmRsZXIgdG8gbWVzc2FnZSBkaXNwYXRjaGVyXG4gKi9cbnZhciBkaXNwYXRjaGVyTWFwID0gbmV3IFdlYWtNYXAoKTtcbi8qKlxuICogVGhlIGludGVybmFsIHF1ZXVlIG9mIHBlbmRpbmcgbWVzc2FnZSBoYW5kbGVycy5cbiAqL1xudmFyIGRpc3BhdGNoUXVldWUgPSBuZXcgcGhvc3Bob3JfcXVldWVfMS5RdWV1ZSgpO1xuLyoqXG4gKiBUaGUgaW50ZXJuYWwgYW5pbWF0aW9uIGZyYW1lIGlkIGZvciB0aGUgbWVzc2FnZSBsb29wIHdha2UgdXAgY2FsbC5cbiAqL1xudmFyIGZyYW1lSWQgPSB2b2lkIDA7XG4vKipcbiAqIEEgbG9jYWwgcmVmZXJlbmNlIHRvIGFuIGV2ZW50IGxvb3AgaG9vay5cbiAqL1xudmFyIHJhZjtcbmlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xufVxuZWxzZSB7XG4gICAgcmFmID0gc2V0SW1tZWRpYXRlO1xufVxuLyoqXG4gKiBHZXQgb3IgY3JlYXRlIHRoZSBtZXNzYWdlIGRpc3BhdGNoZXIgZm9yIGEgbWVzc2FnZSBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiBnZXREaXNwYXRjaGVyKGhhbmRsZXIpIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXJNYXAuZ2V0KGhhbmRsZXIpO1xuICAgIGlmIChkaXNwYXRjaGVyKVxuICAgICAgICByZXR1cm4gZGlzcGF0Y2hlcjtcbiAgICBkaXNwYXRjaGVyID0gbmV3IE1lc3NhZ2VEaXNwYXRjaGVyKCk7XG4gICAgZGlzcGF0Y2hlck1hcC5zZXQoaGFuZGxlciwgZGlzcGF0Y2hlcik7XG4gICAgcmV0dXJuIGRpc3BhdGNoZXI7XG59XG4vKipcbiAqIFdha2UgdXAgdGhlIG1lc3NhZ2UgbG9vcCB0byBwcm9jZXNzIGFueSBwZW5kaW5nIGRpc3BhdGNoZXJzLlxuICpcbiAqIFRoaXMgaXMgYSBuby1vcCBpZiBhIHdha2UgdXAgaXMgbm90IG5lZWRlZCBvciBpcyBhbHJlYWR5IHBlbmRpbmcuXG4gKi9cbmZ1bmN0aW9uIHdha2VVcE1lc3NhZ2VMb29wKCkge1xuICAgIGlmIChmcmFtZUlkID09PSB2b2lkIDAgJiYgIWRpc3BhdGNoUXVldWUuZW1wdHkpIHtcbiAgICAgICAgZnJhbWVJZCA9IHJhZihydW5NZXNzYWdlTG9vcCk7XG4gICAgfVxufVxuLyoqXG4gKiBSdW4gYW4gaXRlcmF0aW9uIG9mIHRoZSBtZXNzYWdlIGxvb3AuXG4gKlxuICogVGhpcyB3aWxsIHByb2Nlc3MgYWxsIHBlbmRpbmcgZGlzcGF0Y2hlcnMgaW4gdGhlIHF1ZXVlLiBEaXNwYXRjaGVyc1xuICogd2hpY2ggYXJlIGFkZGVkIHRvIHRoZSBxdWV1ZSB3aGlsZSB0aGUgbWVzc2FnZSBsb29wIGlzIHJ1bm5pbmcgd2lsbFxuICogYmUgcHJvY2Vzc2VkIG9uIHRoZSBuZXh0IG1lc3NhZ2UgbG9vcCBjeWNsZS5cbiAqL1xuZnVuY3Rpb24gcnVuTWVzc2FnZUxvb3AoKSB7XG4gICAgLy8gQ2xlYXIgdGhlIGZyYW1lIGlkIHNvIHRoZSBuZXh0IHdha2UgdXAgY2FsbCBjYW4gYmUgc2NoZWR1bGVkLlxuICAgIGZyYW1lSWQgPSB2b2lkIDA7XG4gICAgLy8gSWYgdGhlIHF1ZXVlIGlzIGVtcHR5LCB0aGVyZSBpcyBub3RoaW5nIGVsc2UgdG8gZG8uXG4gICAgaWYgKGRpc3BhdGNoUXVldWUuZW1wdHkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBBZGQgYSBudWxsIHNlbnRpbmVsIHZhbHVlIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlLiBUaGUgcXVldWVcbiAgICAvLyB3aWxsIG9ubHkgYmUgcHJvY2Vzc2VkIHVwIHRvIHRoZSBmaXJzdCBudWxsIHZhbHVlLiBUaGlzIG1lYW5zXG4gICAgLy8gdGhhdCBtZXNzYWdlcyBwb3N0ZWQgZHVyaW5nIHRoaXMgY3ljbGUgd2lsbCBleGVjdXRlIG9uIHRoZSBuZXh0XG4gICAgLy8gY3ljbGUgb2YgdGhlIGxvb3AuIElmIHRoZSBsYXN0IHZhbHVlIGluIHRoZSBhcnJheSBpcyBudWxsLCBpdFxuICAgIC8vIG1lYW5zIHRoYXQgYW4gZXhjZXB0aW9uIHdhcyB0aHJvd24gYnkgYSBtZXNzYWdlIGhhbmRsZXIgYW5kIHRoZVxuICAgIC8vIGxvb3AgaGFkIHRvIGJlIHJlc3RhcnRlZC5cbiAgICBpZiAoZGlzcGF0Y2hRdWV1ZS5iYWNrICE9PSBudWxsKSB7XG4gICAgICAgIGRpc3BhdGNoUXVldWUucHVzaChudWxsKTtcbiAgICB9XG4gICAgLy8gVGhlIG1lc3NhZ2UgZGlzcGF0Y2ggbG9vcC4gSWYgdGhlIGRpc3BhdGNoZXIgaXMgdGhlIG51bGwgc2VudGluZWwsXG4gICAgLy8gdGhlIHByb2Nlc3Npbmcgb2YgdGhlIGN1cnJlbnQgYmxvY2sgb2YgbWVzc2FnZXMgaXMgY29tcGxldGUgYW5kXG4gICAgLy8gYW5vdGhlciBsb29wIGlzIHNjaGVkdWxlZC4gT3RoZXJ3aXNlLCB0aGUgcGVuZGluZyBtZXNzYWdlIGlzXG4gICAgLy8gZGlzcGF0Y2hlZCB0byB0aGUgbWVzc2FnZSBoYW5kbGVyLlxuICAgIHdoaWxlICghZGlzcGF0Y2hRdWV1ZS5lbXB0eSkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGRpc3BhdGNoUXVldWUucG9wKCk7XG4gICAgICAgIGlmIChoYW5kbGVyID09PSBudWxsKSB7XG4gICAgICAgICAgICB3YWtlVXBNZXNzYWdlTG9vcCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BhdGNoTWVzc2FnZShkaXNwYXRjaGVyTWFwLmdldChoYW5kbGVyKSwgaGFuZGxlcik7XG4gICAgfVxufVxuLyoqXG4gKiBTYWZlbHkgcHJvY2VzcyB0aGUgcGVuZGluZyBoYW5kbGVyIG1lc3NhZ2UuXG4gKlxuICogSWYgdGhlIG1lc3NhZ2UgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLCB0aGUgbWVzc2FnZSBsb29wIHdpbGxcbiAqIGJlIHJlc3RhcnRlZCBhbmQgdGhlIGV4Y2VwdGlvbiB3aWxsIGJlIHJldGhyb3duLlxuICovXG5mdW5jdGlvbiBkaXNwYXRjaE1lc3NhZ2UoZGlzcGF0Y2hlciwgaGFuZGxlcikge1xuICAgIHRyeSB7XG4gICAgICAgIGRpc3BhdGNoZXIuc2VuZFBlbmRpbmdNZXNzYWdlKGhhbmRsZXIpO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgd2FrZVVwTWVzc2FnZUxvb3AoKTtcbiAgICAgICAgdGhyb3cgZXg7XG4gICAgfVxufVxuLyoqXG4gKiBBbiBpbnRlcm5hbCBjbGFzcyB3aGljaCBtYW5hZ2VzIG1lc3NhZ2UgZGlzcGF0Y2hpbmcgZm9yIGEgaGFuZGxlci5cbiAqL1xudmFyIE1lc3NhZ2VEaXNwYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNZXNzYWdlRGlzcGF0Y2hlcigpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VzID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIGhhbmRsZXIgaW1tZWRpYXRlbHkuXG4gICAgICpcbiAgICAgKiBUaGUgbWVzc2FnZSB3aWxsIGZpcnN0IGJlIHNlbnQgdGhyb3VnaCBpbnN0YWxsZWQgZmlsdGVycy5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlciwgbXNnKSB7XG4gICAgICAgIGlmICghdGhpcy5fZmlsdGVyTWVzc2FnZShoYW5kbGVyLCBtc2cpKSB7XG4gICAgICAgICAgICBoYW5kbGVyLnByb2Nlc3NNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBvc3QgYSBtZXNzYWdlIGZvciBkZWxpdmVyeSBpbiB0aGUgZnV0dXJlLlxuICAgICAqXG4gICAgICogVGhlIG1lc3NhZ2Ugd2lsbCBmaXJzdCBiZSBjb21wcmVzc2VkIGlmIHBvc3NpYmxlLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBtc2cpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb21wcmVzc01lc3NhZ2UoaGFuZGxlciwgbXNnKSkge1xuICAgICAgICAgICAgdGhpcy5fZW5xdWV1ZU1lc3NhZ2UoaGFuZGxlciwgbXNnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGVzdCB3aGV0aGVyIHRoZSBkaXNwYXRjaGVyIGhhcyBtZXNzYWdlcyBwZW5kaW5nIGRlbGl2ZXJ5LlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5oYXNQZW5kaW5nTWVzc2FnZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLl9tZXNzYWdlcyAmJiAhdGhpcy5fbWVzc2FnZXMuZW1wdHkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2VuZCB0aGUgZmlyc3QgcGVuZGluZyBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlIGhhbmRsZXIuXG4gICAgICovXG4gICAgTWVzc2FnZURpc3BhdGNoZXIucHJvdG90eXBlLnNlbmRQZW5kaW5nTWVzc2FnZSA9IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9tZXNzYWdlcyAmJiAhdGhpcy5fbWVzc2FnZXMuZW1wdHkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaGFuZGxlciwgdGhpcy5fbWVzc2FnZXMucG9wKCkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnN0YWxsIGEgbWVzc2FnZSBmaWx0ZXIgZm9yIHRoZSBkaXNwYXRjaGVyLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5pbnN0YWxsTWVzc2FnZUZpbHRlciA9IGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVycyA9IHsgbmV4dDogdGhpcy5fZmlsdGVycywgZmlsdGVyOiBmaWx0ZXIgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgb2NjdXJyZW5jZXMgb2YgYSBtZXNzYWdlIGZpbHRlciBmcm9tIHRoZSBkaXNwYXRjaGVyLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVNZXNzYWdlRmlsdGVyID0gZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICB2YXIgbGluayA9IHRoaXMuX2ZpbHRlcnM7XG4gICAgICAgIHZhciBwcmV2ID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChsaW5rLmZpbHRlciA9PT0gZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgbGluay5maWx0ZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbHRlcnMgPSBsaW5rO1xuICAgICAgICAgICAgICAgIHByZXYgPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJldi5uZXh0ID0gbGluaztcbiAgICAgICAgICAgICAgICBwcmV2ID0gbGluaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmsgPSBsaW5rLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2KSB7XG4gICAgICAgICAgICB0aGlzLl9maWx0ZXJzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByZXYubmV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsZWFyIGFsbCBtZXNzYWdlcyBhbmQgZmlsdGVycyBmcm9tIHRoZSBkaXNwYXRjaGVyLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX21lc3NhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGxpbmsgPSB0aGlzLl9maWx0ZXJzOyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0KSB7XG4gICAgICAgICAgICBsaW5rLmZpbHRlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZmlsdGVycyA9IG51bGw7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGluc3RhbGxlZCBtZXNzYWdlIGZpbHRlcnMgZm9yIHRoZSBoYW5kbGVyLlxuICAgICAqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1lc3NhZ2Ugd2FzIGZpbHRlcmVkLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2ZpbHRlck1lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlciwgbXNnKSB7XG4gICAgICAgIGZvciAodmFyIGxpbmsgPSB0aGlzLl9maWx0ZXJzOyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0KSB7XG4gICAgICAgICAgICBpZiAobGluay5maWx0ZXIgJiYgbGluay5maWx0ZXIuZmlsdGVyTWVzc2FnZShoYW5kbGVyLCBtc2cpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ29tcHJlc3MgdGhlIG1zc2FnZSBmb3IgdGhlIGdpdmVuIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWVzc2FnZSB3YXMgY29tcHJlc3NlZCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgTWVzc2FnZURpc3BhdGNoZXIucHJvdG90eXBlLl9jb21wcmVzc01lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlciwgbXNnKSB7XG4gICAgICAgIGlmICghaGFuZGxlci5jb21wcmVzc01lc3NhZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX21lc3NhZ2VzIHx8IHRoaXMuX21lc3NhZ2VzLmVtcHR5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZXIuY29tcHJlc3NNZXNzYWdlKG1zZywgdGhpcy5fbWVzc2FnZXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRW5xdWV1ZSB0aGUgbWVzc2FnZSBmb3IgZnV0dXJlIGRlbGl2ZXJ5IHRvIHRoZSBoYW5kbGVyLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5fZW5xdWV1ZU1lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlciwgbXNnKSB7XG4gICAgICAgICh0aGlzLl9tZXNzYWdlcyB8fCAodGhpcy5fbWVzc2FnZXMgPSBuZXcgcGhvc3Bob3JfcXVldWVfMS5RdWV1ZSgpKSkucHVzaChtc2cpO1xuICAgICAgICBkaXNwYXRjaFF1ZXVlLnB1c2goaGFuZGxlcik7XG4gICAgICAgIHdha2VVcE1lc3NhZ2VMb29wKCk7XG4gICAgfTtcbiAgICByZXR1cm4gTWVzc2FnZURpc3BhdGNoZXI7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgcGhvc3Bob3Jfc2lnbmFsaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1zaWduYWxpbmcnKTtcbi8qKlxuICogQSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC5cbiAqXG4gKiBQcm9wZXJ0aWVzIGRlc2NyaXB0b3JzIGNhbiBiZSB1c2VkIHRvIGV4cG9zZSBhIHJpY2ggaW50ZXJmYWNlIGZvciBhblxuICogb2JqZWN0IHdoaWNoIGVuY2Fwc3VsYXRlcyB2YWx1ZSBjcmVhdGlvbiwgY29lcmNpb24sIGFuZCBub3RpZmljYXRpb24uXG4gKiBUaGV5IGNhbiBhbHNvIGJlIHVzZWQgdG8gZXh0ZW5kIHRoZSBzdGF0ZSBvZiBhbiBvYmplY3Qgd2l0aCBzZW1hbnRpY1xuICogZGF0YSBmcm9tIGFub3RoZXIgY2xhc3MuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gJ3Bob3NwaG9yLXByb3BlcnRpZXMnO1xuICpcbiAqIGNsYXNzIE15Q2xhc3Mge1xuICpcbiAqICAgc3RhdGljIG15VmFsdWVQcm9wZXJ0eSA9IG5ldyBQcm9wZXJ0eTxNeUNsYXNzLCBudW1iZXI+KHtcbiAqICAgICAgdmFsdWU6IDAsXG4gKiAgICAgIGNvZXJjZTogKG93bmVyLCB2YWx1ZSkgPT4gTWF0aC5tYXgoMCwgdmFsdWUpLFxuICogICAgICBjaGFuZ2VkOiAob3duZXIsIG9sZFZhbHVlLCBuZXdWYWx1ZSkgPT4geyBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7IH0sXG4gKiAgIH0pO1xuICpcbiAqICAgZ2V0IG15VmFsdWUoKTogbnVtYmVyIHtcbiAqICAgICByZXR1cm4gTXlDbGFzcy5teVZhbHVlUHJvcGVydHkuZ2V0KHRoaXMpO1xuICogICB9XG4gKlxuICogICBzZXQgbXlWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XG4gKiAgICAgTXlDbGFzcy5teVZhbHVlUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbnZhciBQcm9wZXJ0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IHByb3BlcnR5IGRlc2NyaXB0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIGZvciBpbml0aWFsaXppbmcgdGhlIHByb3BlcnR5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFByb3BlcnR5KG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICAgICAgdGhpcy5fcGlkID0gbmV4dFBJRCgpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG9wdGlvbnMudmFsdWU7XG4gICAgICAgIHRoaXMuX2NyZWF0ZSA9IG9wdGlvbnMuY3JlYXRlO1xuICAgICAgICB0aGlzLl9jb2VyY2UgPSBvcHRpb25zLmNvZXJjZTtcbiAgICAgICAgdGhpcy5fY29tcGFyZSA9IG9wdGlvbnMuY29tcGFyZTtcbiAgICAgICAgdGhpcy5fY2hhbmdlZCA9IG9wdGlvbnMuY2hhbmdlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGEgYm91bmQgW1tjaGFuZ2VkU2lnbmFsXV0gZm9yIGEgZ2l2ZW4gcHJvcGVydHkgb3duZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3duZXIgLSBUaGUgb2JqZWN0IHRvIGJpbmQgdG8gdGhlIGNoYW5nZWQgc2lnbmFsLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGJvdW5kIGNoYW5nZWQgc2lnbmFsIGZvciB0aGUgb3duZXIuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBzaWduYWwgd2lsbCBiZSBlbWl0dGVkIHdoZW5ldmVyIGFueSBwcm9wZXJ0eSB2YWx1ZVxuICAgICAqIGZvciB0aGUgc3BlY2lmaWVkIG93bmVyIGlzIGNoYW5nZWQuXG4gICAgICovXG4gICAgUHJvcGVydHkuZ2V0Q2hhbmdlZCA9IGZ1bmN0aW9uIChvd25lcikge1xuICAgICAgICByZXR1cm4gUHJvcGVydHkuY2hhbmdlZFNpZ25hbC5iaW5kKG93bmVyKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgZm9yIGEgZ2l2ZW4gb3duZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3duZXIgLSBUaGUgcHJvcGVydHkgb3duZXIgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgdGhlIHZhbHVlIGhhcyBub3QgeWV0IGJlZW4gc2V0LCB0aGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlXG4gICAgICogY29tcHV0ZWQgYW5kIGFzc2lnbmVkIGFzIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgKi9cbiAgICBQcm9wZXJ0eS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG93bmVyKSB7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIGhhc2ggPSBsb29rdXBIYXNoKG93bmVyKTtcbiAgICAgICAgaWYgKHRoaXMuX3BpZCBpbiBoYXNoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGhhc2hbdGhpcy5fcGlkXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaGFzaFt0aGlzLl9waWRdID0gdGhpcy5fY3JlYXRlVmFsdWUob3duZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgZm9yIGEgZ2l2ZW4gb3duZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3duZXIgLSBUaGUgcHJvcGVydHkgb3duZXIgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBUaGUgdmFsdWUgZm9yIHRoZSBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJZiB0aGlzIG9wZXJhdGlvbiBjYXVzZXMgdGhlIHByb3BlcnR5IHZhbHVlIHRvIGNoYW5nZSwgdGhlXG4gICAgICogW1tjaGFuZ2VkU2lnbmFsXV0gd2lsbCBiZSBlbWl0dGVkIHdpdGggdGhlIG93bmVyIGFzIHNlbmRlci5cbiAgICAgKlxuICAgICAqIElmIHRoZSB2YWx1ZSBoYXMgbm90IHlldCBiZWVuIHNldCwgdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZVxuICAgICAqIGNvbXB1dGVkIGFuZCB1c2VkIGFzIHRoZSBwcmV2aW91cyB2YWx1ZSBmb3IgdGhlIGNvbXBhcmlzb24uXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChvd25lciwgdmFsdWUpIHtcbiAgICAgICAgdmFyIG9sZFZhbHVlO1xuICAgICAgICB2YXIgaGFzaCA9IGxvb2t1cEhhc2gob3duZXIpO1xuICAgICAgICBpZiAodGhpcy5fcGlkIGluIGhhc2gpIHtcbiAgICAgICAgICAgIG9sZFZhbHVlID0gaGFzaFt0aGlzLl9waWRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb2xkVmFsdWUgPSBoYXNoW3RoaXMuX3BpZF0gPSB0aGlzLl9jcmVhdGVWYWx1ZShvd25lcik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5fY29lcmNlVmFsdWUob3duZXIsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWF5YmVOb3RpZnkob3duZXIsIG9sZFZhbHVlLCBoYXNoW3RoaXMuX3BpZF0gPSBuZXdWYWx1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeHBsaWNpdGx5IGNvZXJjZSB0aGUgY3VycmVudCBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBnaXZlbiBvd25lci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvd25lciAtIFRoZSBwcm9wZXJ0eSBvd25lciBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJZiB0aGlzIG9wZXJhdGlvbiBjYXVzZXMgdGhlIHByb3BlcnR5IHZhbHVlIHRvIGNoYW5nZSwgdGhlXG4gICAgICogW1tjaGFuZ2VkU2lnbmFsXV0gd2lsbCBiZSBlbWl0dGVkIHdpdGggdGhlIG93bmVyIGFzIHNlbmRlci5cbiAgICAgKlxuICAgICAqIElmIHRoZSB2YWx1ZSBoYXMgbm90IHlldCBiZWVuIHNldCwgdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZVxuICAgICAqIGNvbXB1dGVkIGFuZCB1c2VkIGFzIHRoZSBwcmV2aW91cyB2YWx1ZSBmb3IgdGhlIGNvbXBhcmlzb24uXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLmNvZXJjZSA9IGZ1bmN0aW9uIChvd25lcikge1xuICAgICAgICB2YXIgb2xkVmFsdWU7XG4gICAgICAgIHZhciBoYXNoID0gbG9va3VwSGFzaChvd25lcik7XG4gICAgICAgIGlmICh0aGlzLl9waWQgaW4gaGFzaCkge1xuICAgICAgICAgICAgb2xkVmFsdWUgPSBoYXNoW3RoaXMuX3BpZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbGRWYWx1ZSA9IGhhc2hbdGhpcy5fcGlkXSA9IHRoaXMuX2NyZWF0ZVZhbHVlKG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLl9jb2VyY2VWYWx1ZShvd25lciwgb2xkVmFsdWUpO1xuICAgICAgICB0aGlzLl9tYXliZU5vdGlmeShvd25lciwgb2xkVmFsdWUsIGhhc2hbdGhpcy5fcGlkXSA9IG5ld1ZhbHVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBvciBjcmVhdGUgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoZSBnaXZlbiBvd25lci5cbiAgICAgKi9cbiAgICBQcm9wZXJ0eS5wcm90b3R5cGUuX2NyZWF0ZVZhbHVlID0gZnVuY3Rpb24gKG93bmVyKSB7XG4gICAgICAgIHZhciBjcmVhdGUgPSB0aGlzLl9jcmVhdGU7XG4gICAgICAgIHJldHVybiBjcmVhdGUgPyBjcmVhdGUob3duZXIpIDogdGhpcy5fdmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDb2VyY2UgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4gb3duZXIuXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLl9jb2VyY2VWYWx1ZSA9IGZ1bmN0aW9uIChvd25lciwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGNvZXJjZSA9IHRoaXMuX2NvZXJjZTtcbiAgICAgICAgcmV0dXJuIGNvZXJjZSA/IGNvZXJjZShvd25lciwgdmFsdWUpIDogdmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHRoZSBvbGQgdmFsdWUgYW5kIG5ldyB2YWx1ZSBmb3IgZXF1YWxpdHkuXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLl9jb21wYXJlVmFsdWUgPSBmdW5jdGlvbiAob2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyZTtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmUgPyBjb21wYXJlKG9sZFZhbHVlLCBuZXdWYWx1ZSkgOiBvbGRWYWx1ZSA9PT0gbmV3VmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGNoYW5nZSBub3RpZmljYXRpb24gaWYgdGhlIGdpdmVuIHZhbHVlcyBhcmUgZGlmZmVyZW50LlxuICAgICAqL1xuICAgIFByb3BlcnR5LnByb3RvdHlwZS5fbWF5YmVOb3RpZnkgPSBmdW5jdGlvbiAob3duZXIsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbXBhcmVWYWx1ZShvbGRWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IHRoaXMuX2NoYW5nZWQ7XG4gICAgICAgICAgICBpZiAoY2hhbmdlZClcbiAgICAgICAgICAgICAgICBjaGFuZ2VkKG93bmVyLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgUHJvcGVydHkuZ2V0Q2hhbmdlZChvd25lcikuZW1pdChjaGFuZ2VkQXJncyh0aGlzLCBvbGRWYWx1ZSwgbmV3VmFsdWUpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBzaWduYWwgZW1pdHRlZCB3aGVuIGEgcHJvcGVydHkgdmFsdWUgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGlzIGFuIGF0dGFjaGVkIHNpZ25hbCB3aGljaCB3aWxsIGJlIGVtaXR0ZWQgdXNpbmcgdGhlXG4gICAgICogb3duZXIgb2YgdGhlIHByb3BlcnR5IHZhbHVlIGFzIHRoZSBzZW5kZXIuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbZ2V0Q2hhbmdlZF1dXG4gICAgICovXG4gICAgUHJvcGVydHkuY2hhbmdlZFNpZ25hbCA9IG5ldyBwaG9zcGhvcl9zaWduYWxpbmdfMS5TaWduYWwoKTtcbiAgICByZXR1cm4gUHJvcGVydHk7XG59KSgpO1xuZXhwb3J0cy5Qcm9wZXJ0eSA9IFByb3BlcnR5O1xuLyoqXG4gKiBDbGVhciB0aGUgc3RvcmVkIHByb3BlcnR5IGRhdGEgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSBvd25lci5cbiAqXG4gKiBAcGFyYW0gb3duZXIgLSBUaGUgcHJvcGVydHkgb3duZXIgb2YgaW50ZXJlc3QuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyB3aWxsIGNsZWFyIGFsbCBwcm9wZXJ0eSB2YWx1ZXMgZm9yIHRoZSBvd25lciwgYnV0IGl0IHdpbGxcbiAqICoqbm90KiogZW1pdCBhbnkgY2hhbmdlIG5vdGlmaWNhdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGNsZWFyUHJvcGVydHlEYXRhKG93bmVyKSB7XG4gICAgb3duZXJEYXRhLmRlbGV0ZShvd25lcik7XG59XG5leHBvcnRzLmNsZWFyUHJvcGVydHlEYXRhID0gY2xlYXJQcm9wZXJ0eURhdGE7XG4vKipcbiAqIEEgd2VhayBtYXBwaW5nIG9mIHByb3BlcnR5IG93bmVyIHRvIHByb3BlcnR5IGhhc2guXG4gKi9cbnZhciBvd25lckRhdGEgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBBIGZ1bmN0aW9uIHdoaWNoIGNvbXB1dGVzIHN1Y2Nlc3NpdmUgdW5pcXVlIHByb3BlcnR5IGlkcy5cbiAqL1xudmFyIG5leHRQSUQgPSAoZnVuY3Rpb24gKCkgeyB2YXIgaWQgPSAwOyByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ3BpZC0nICsgaWQrKzsgfTsgfSkoKTtcbi8qKlxuICogQ3JlYXRlIHRoZSBjaGFuZ2VkIGFyZ3MgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBjaGFuZ2VkQXJncyhwcm9wZXJ0eSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgcmV0dXJuIHsgcHJvcGVydHk6IHByb3BlcnR5LCBvbGRWYWx1ZTogb2xkVmFsdWUsIG5ld1ZhbHVlOiBuZXdWYWx1ZSB9O1xufVxuLyoqXG4gKiBMb29rdXAgdGhlIGRhdGEgaGFzaCBmb3IgdGhlIHByb3BlcnR5IG93bmVyLlxuICpcbiAqIFRoaXMgd2lsbCBjcmVhdGUgdGhlIGhhc2ggaWYgb25lIGRvZXMgbm90IGFscmVhZHkgZXhpc3QuXG4gKi9cbmZ1bmN0aW9uIGxvb2t1cEhhc2gob3duZXIpIHtcbiAgICB2YXIgaGFzaCA9IG93bmVyRGF0YS5nZXQob3duZXIpO1xuICAgIGlmIChoYXNoICE9PSB2b2lkIDApXG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgIGhhc2ggPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIG93bmVyRGF0YS5zZXQob3duZXIsIGhhc2gpO1xuICAgIHJldHVybiBoYXNoO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG4vKipcbiAqIEEgZ2VuZXJpYyBGSUZPIHF1ZXVlIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgcXVldWUgaXMgaW1wbGVtZW50ZWQgaW50ZXJuYWxseSB1c2luZyBhIHNpbmdseSBsaW5rZWQgbGlzdCBhbmRcbiAqIGNhbiBncm93IHRvIGFyYml0cmFyeSBzaXplLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogdmFyIHEgPSBuZXcgUXVldWU8bnVtYmVyPihbMCwgMSwgMl0pO1xuICogcS5zaXplOyAgICAgIC8vIDNcbiAqIHEuZW1wdHk7ICAgICAvLyBmYWxzZVxuICogcS5wb3AoKTsgICAgIC8vIDBcbiAqIHEucG9wKCk7ICAgICAvLyAxXG4gKiBxLnB1c2goNDIpOyAgLy8gdW5kZWZpbmVkXG4gKiBxLnNpemU7ICAgICAgLy8gMlxuICogcS5wb3AoKTsgICAgIC8vIDJcbiAqIHEucG9wKCk7ICAgICAvLyA0MlxuICogcS5wb3AoKTsgICAgIC8vIHVuZGVmaW5lZFxuICogcS5zaXplOyAgICAgIC8vIDBcbiAqIHEuZW1wdHk7ICAgICAvLyB0cnVlXG4gKiBgYGBcbiAqL1xudmFyIFF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSBuZXcgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXRlbXMgLSBUaGUgaW5pdGlhbCBpdGVtcyBmb3IgdGhlIHF1ZXVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFF1ZXVlKGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3NpemUgPSAwO1xuICAgICAgICB0aGlzLl9mcm9udCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2JhY2sgPSBudWxsO1xuICAgICAgICBpZiAoaXRlbXMpXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBfdGhpcy5wdXNoKGl0ZW0pOyB9KTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1ZXVlLnByb3RvdHlwZSwgXCJzaXplXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBxdWV1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGhhcyBgTygxKWAgY29tcGxleGl0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWV1ZS5wcm90b3R5cGUsIFwiZW1wdHlcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGhhcyBgTygxKWAgY29tcGxleGl0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemUgPT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWV1ZS5wcm90b3R5cGUsIFwiZnJvbnRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSB2YWx1ZSBhdCB0aGUgZnJvbnQgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaGFzIGBPKDEpYCBjb21wbGV4aXR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgcXVldWUgaXMgZW1wdHksIHRoaXMgdmFsdWUgd2lsbCBiZSBgdW5kZWZpbmVkYC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb250ICE9PSBudWxsID8gdGhpcy5fZnJvbnQudmFsdWUgOiB2b2lkIDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWV1ZS5wcm90b3R5cGUsIFwiYmFja1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIHZhbHVlIGF0IHRoZSBiYWNrIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGhhcyBgTygxKWAgY29tcGxleGl0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIHF1ZXVlIGlzIGVtcHR5LCB0aGlzIHZhbHVlIHdpbGwgYmUgYHVuZGVmaW5lZGAuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrICE9PSBudWxsID8gdGhpcy5fYmFjay52YWx1ZSA6IHZvaWQgMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogUHVzaCBhIHZhbHVlIG9udG8gdGhlIGJhY2sgb2YgdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGFkZCB0byB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGxpbmsgPSB7IG5leHQ6IG51bGwsIHZhbHVlOiB2YWx1ZSB9O1xuICAgICAgICBpZiAodGhpcy5fYmFjayA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fZnJvbnQgPSBsaW5rO1xuICAgICAgICAgICAgdGhpcy5fYmFjayA9IGxpbms7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9iYWNrLm5leHQgPSBsaW5rO1xuICAgICAgICAgICAgdGhpcy5fYmFjayA9IGxpbms7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2l6ZSsrO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUG9wIGFuZCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoZSBmcm9udCBvZiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgYXQgdGhlIGZyb250IG9mIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTygxKWAgY29tcGxleGl0eS5cbiAgICAgKlxuICAgICAqIElmIHRoZSBxdWV1ZSBpcyBlbXB0eSwgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIGB1bmRlZmluZWRgLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaW5rID0gdGhpcy5fZnJvbnQ7XG4gICAgICAgIGlmIChsaW5rID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5rLm5leHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZnJvbnQgPSBsaW5rLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2l6ZS0tO1xuICAgICAgICByZXR1cm4gbGluay52YWx1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHZhbHVlIGZyb20gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHJlbW92ZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBvbiBzdWNjZXNzLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTyhOKWAgY29tcGxleGl0eS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBsaW5rID0gdGhpcy5fZnJvbnQ7XG4gICAgICAgIHZhciBwcmV2ID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChsaW5rLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbGluay5uZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldi5uZXh0ID0gbGluay5uZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluay5uZXh0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBwcmV2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplLS07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2ID0gbGluaztcbiAgICAgICAgICAgIGxpbmsgPSBsaW5rLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBvY2N1cnJlbmNlcyBvZiBhIHZhbHVlIGZyb20gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIHJlbW92ZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBudW1iZXIgb2Ygb2NjdXJyZW5jZXMgcmVtb3ZlZC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTyhOKWAgY29tcGxleGl0eS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgIHZhciBsaW5rID0gdGhpcy5fZnJvbnQ7XG4gICAgICAgIHZhciBwcmV2ID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChsaW5rLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZS0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbGluaztcbiAgICAgICAgICAgICAgICBwcmV2ID0gbGluaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZXYubmV4dCA9IGxpbms7XG4gICAgICAgICAgICAgICAgcHJldiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5rID0gbGluay5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldikge1xuICAgICAgICAgICAgdGhpcy5fZnJvbnQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fYmFjayA9IHByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCB2YWx1ZXMgZnJvbSB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zaXplID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9iYWNrID0gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBhcnJheSBmcm9tIHRoZSB2YWx1ZXMgaW4gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgYWxsIHZhbHVlcyBpbiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5fc2l6ZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsaW5rID0gdGhpcy5fZnJvbnQ7IGxpbmsgIT09IG51bGw7IGxpbmsgPSBsaW5rLm5leHQsICsraSkge1xuICAgICAgICAgICAgcmVzdWx0W2ldID0gbGluay52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGVzdCB3aGV0aGVyIGFueSB2YWx1ZSBpbiB0aGUgcXVldWUgcGFzc2VzIGEgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHByZWQgLSBUaGUgcHJlZGljYXRlIHRvIGFwcGx5IHRvIHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYW55IHZhbHVlIGluIHRoZSBxdWV1ZSBwYXNzZXMgdGhlIHByZWRpY2F0ZSxcbiAgICAgKiAgIG9yIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKE4pYCBjb21wbGV4aXR5LlxuICAgICAqXG4gICAgICogSXQgaXMgKipub3QqKiBzYWZlIGZvciB0aGUgcHJlZGljYXRlIHRvIG1vZGlmeSB0aGUgcXVldWUgd2hpbGVcbiAgICAgKiBpdGVyYXRpbmcuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnNvbWUgPSBmdW5jdGlvbiAocHJlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGluayA9IHRoaXMuX2Zyb250OyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0LCArK2kpIHtcbiAgICAgICAgICAgIGlmIChwcmVkKGxpbmsudmFsdWUsIGkpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRlc3Qgd2hldGhlciBhbGwgdmFsdWVzIGluIHRoZSBxdWV1ZSBwYXNzIGEgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHByZWQgLSBUaGUgcHJlZGljYXRlIHRvIGFwcGx5IHRvIHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYWxsIHZhbHVlcyBpbiB0aGUgcXVldWUgcGFzcyB0aGUgcHJlZGljYXRlLFxuICAgICAqICAgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICpcbiAgICAgKiBJdCBpcyAqKm5vdCoqIHNhZmUgZm9yIHRoZSBwcmVkaWNhdGUgdG8gbW9kaWZ5IHRoZSBxdWV1ZSB3aGlsZVxuICAgICAqIGl0ZXJhdGluZy5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuZXZlcnkgPSBmdW5jdGlvbiAocHJlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGluayA9IHRoaXMuX2Zyb250OyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0LCArK2kpIHtcbiAgICAgICAgICAgIGlmICghcHJlZChsaW5rLnZhbHVlLCBpKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gYXJyYXkgb2YgdGhlIHZhbHVlcyB3aGljaCBwYXNzIGEgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHByZWQgLSBUaGUgcHJlZGljYXRlIHRvIGFwcGx5IHRvIHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgYXJyYXkgb2YgdmFsdWVzIHdoaWNoIHBhc3MgdGhlIHByZWRpY2F0ZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTyhOKWAgY29tcGxleGl0eS5cbiAgICAgKlxuICAgICAqIEl0IGlzICoqbm90Kiogc2FmZSBmb3IgdGhlIHByZWRpY2F0ZSB0byBtb2RpZnkgdGhlIHF1ZXVlIHdoaWxlXG4gICAgICogaXRlcmF0aW5nLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbiAocHJlZCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsaW5rID0gdGhpcy5fZnJvbnQ7IGxpbmsgIT09IG51bGw7IGxpbmsgPSBsaW5rLm5leHQsICsraSkge1xuICAgICAgICAgICAgaWYgKHByZWQobGluay52YWx1ZSwgaSkpXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGluay52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBhcnJheSBvZiBtYXBwZWQgdmFsdWVzIGZvciB0aGUgdmFsdWVzIGluIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBtYXAgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIG1hcCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTyhOKWAgY29tcGxleGl0eS5cbiAgICAgKlxuICAgICAqIEl0IGlzICoqbm90Kiogc2FmZSBmb3IgdGhlIGNhbGxiYWNrIHRvIG1vZGlmeSB0aGUgcXVldWUgd2hpbGVcbiAgICAgKiBpdGVyYXRpbmcuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMuX3NpemUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGluayA9IHRoaXMuX2Zyb250OyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0LCArK2kpIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IGNhbGxiYWNrKGxpbmsudmFsdWUsIGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggdmFsdWUgaW4gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgZmlyc3QgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIHdoaWNoIGlzIG5vdFxuICAgICAqICAgYHVuZGVmaW5lZGAuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICpcbiAgICAgKiBJdGVyYXRpb24gd2lsbCB0ZXJtaW5hdGUgaW1tZWRpYXRlbHkgaWYgdGhlIGNhbGxiYWNrIHJldHVybnMgYW55XG4gICAgICogdmFsdWUgb3RoZXIgdGhhbiBgdW5kZWZpbmVkYC5cbiAgICAgKlxuICAgICAqIEl0IGlzICoqbm90Kiogc2FmZSBmb3IgdGhlIGNhbGxiYWNrIHRvIG1vZGlmeSB0aGUgcXVldWUgd2hpbGVcbiAgICAgKiBpdGVyYXRpbmcuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmsgPSB0aGlzLl9mcm9udDsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCwgKytpKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2sobGluay52YWx1ZSwgaSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSB2b2lkIDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH07XG4gICAgcmV0dXJuIFF1ZXVlO1xufSkoKTtcbmV4cG9ydHMuUXVldWUgPSBRdWV1ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBbiBvYmplY3QgdXNlZCBmb3IgdHlwZS1zYWZlIGludGVyLW9iamVjdCBjb21tdW5pY2F0aW9uLlxuICpcbiAqIFNpZ25hbHMgcHJvdmlkZSBhIHR5cGUtc2FmZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgcHVibGlzaC1zdWJzY3JpYmVcbiAqIHBhdHRlcm4uIEFuIG9iamVjdCAocHVibGlzaGVyKSBkZWNsYXJlcyB3aGljaCBzaWduYWxzIGl0IHdpbGwgZW1pdCxcbiAqIGFuZCBjb25zdW1lcnMgY29ubmVjdCBjYWxsYmFja3MgKHN1YnNjcmliZXJzKSB0byB0aG9zZSBzaWduYWxzLiBUaGVcbiAqIHN1YnNjcmliZXJzIGFyZSBpbnZva2VkIHdoZW5ldmVyIHRoZSBwdWJsaXNoZXIgZW1pdHMgdGhlIHNpZ25hbC5cbiAqXG4gKiBBIGBTaWduYWxgIG9iamVjdCBtdXN0IGJlIGJvdW5kIHRvIGEgc2VuZGVyIGluIG9yZGVyIHRvIGJlIHVzZWZ1bC5cbiAqIEEgY29tbW9uIHBhdHRlcm4gaXMgdG8gZGVjbGFyZSBhIGBTaWduYWxgIG9iamVjdCBhcyBhIHN0YXRpYyBjbGFzc1xuICogbWVtYmVyLCBhbG9uZyB3aXRoIGEgY29udmVuaWVuY2UgZ2V0dGVyIHdoaWNoIGJpbmRzIHRoZSBzaWduYWwgdG9cbiAqIHRoZSBgdGhpc2AgaW5zdGFuY2Ugb24tZGVtYW5kLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgSVNpZ25hbCwgU2lnbmFsIH0gZnJvbSAncGhvc3Bob3Itc2lnbmFsaW5nJztcbiAqXG4gKiBjbGFzcyBNeUNsYXNzIHtcbiAqXG4gKiAgIHN0YXRpYyB2YWx1ZUNoYW5nZWRTaWduYWwgPSBuZXcgU2lnbmFsPE15Q2xhc3MsIG51bWJlcj4oKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICogICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICogICB9XG4gKlxuICogICBnZXQgdmFsdWVDaGFuZ2VkKCk6IElTaWduYWw8TXlDbGFzcywgbnVtYmVyPiB7XG4gKiAgICAgcmV0dXJuIE15Q2xhc3MudmFsdWVDaGFuZ2VkU2lnbmFsLmJpbmQodGhpcyk7XG4gKiAgIH1cbiAqXG4gKiAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gKiAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gKiAgIH1cbiAqXG4gKiAgIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICogICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAqICAgfVxuICpcbiAqICAgc2V0IHZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAqICAgICBpZiAodmFsdWUgIT09IHRoaXMuX3ZhbHVlKSB7XG4gKiAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICogICAgICAgdGhpcy52YWx1ZUNoYW5nZWQuZW1pdCh2YWx1ZSk7XG4gKiAgICAgfVxuICogICB9XG4gKlxuICogICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XG4gKiAgIHByaXZhdGUgX3ZhbHVlID0gMDtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBsb2dnZXIoc2VuZGVyOiBNeUNsYXNzLCB2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gKiAgIGNvbnNvbGUubG9nKHNlbmRlci5uYW1lLCB2YWx1ZSk7XG4gKiB9XG4gKlxuICogdmFyIG0xID0gbmV3IE15Q2xhc3MoJ2ZvbycpO1xuICogdmFyIG0yID0gbmV3IE15Q2xhc3MoJ2JhcicpO1xuICpcbiAqIG0xLnZhbHVlQ2hhbmdlZC5jb25uZWN0KGxvZ2dlcik7XG4gKiBtMi52YWx1ZUNoYW5nZWQuY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIG0xLnZhbHVlID0gNDI7ICAvLyBsb2dzOiBmb28gNDJcbiAqIG0yLnZhbHVlID0gMTc7ICAvLyBsb2dzOiBiYXIgMTdcbiAqIGBgYFxuICovXG52YXIgU2lnbmFsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaWduYWwoKSB7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJpbmQgdGhlIHNpZ25hbCB0byBhIHNwZWNpZmljIHNlbmRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdCB0byBiaW5kIHRvIHRoZSBzaWduYWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgYm91bmQgc2lnbmFsIG9iamVjdCB3aGljaCBjYW4gYmUgdXNlZCBmb3IgY29ubmVjdGluZyxcbiAgICAgKiAgIGRpc2Nvbm5lY3RpbmcsIGFuZCBlbWl0dGluZyB0aGUgc2lnbmFsLlxuICAgICAqL1xuICAgIFNpZ25hbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZFNpZ25hbCh0aGlzLCBzZW5kZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIFNpZ25hbDtcbn0pKCk7XG5leHBvcnRzLlNpZ25hbCA9IFNpZ25hbDtcbi8qKlxuICogUmVtb3ZlIGFsbCBjb25uZWN0aW9ucyB3aGVyZSB0aGUgZ2l2ZW4gb2JqZWN0IGlzIHRoZSBzZW5kZXIuXG4gKlxuICogQHBhcmFtIHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0IG9mIGludGVyZXN0LlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogZGlzY29ubmVjdFNlbmRlcihzb21lT2JqZWN0KTtcbiAqIGBgYFxuICovXG5mdW5jdGlvbiBkaXNjb25uZWN0U2VuZGVyKHNlbmRlcikge1xuICAgIHZhciBsaXN0ID0gc2VuZGVyTWFwLmdldChzZW5kZXIpO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBjb25uID0gbGlzdC5maXJzdDtcbiAgICB3aGlsZSAoY29ubiAhPT0gbnVsbCkge1xuICAgICAgICByZW1vdmVGcm9tU2VuZGVyc0xpc3QoY29ubik7XG4gICAgICAgIGNvbm4uY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICBjb25uLnRoaXNBcmcgPSBudWxsO1xuICAgICAgICBjb25uID0gY29ubi5uZXh0UmVjZWl2ZXI7XG4gICAgfVxuICAgIHNlbmRlck1hcC5kZWxldGUoc2VuZGVyKTtcbn1cbmV4cG9ydHMuZGlzY29ubmVjdFNlbmRlciA9IGRpc2Nvbm5lY3RTZW5kZXI7XG4vKipcbiAqIFJlbW92ZSBhbGwgY29ubmVjdGlvbnMgd2hlcmUgdGhlIGdpdmVuIG9iamVjdCBpcyB0aGUgcmVjZWl2ZXIuXG4gKlxuICogQHBhcmFtIHJlY2VpdmVyIC0gVGhlIHJlY2VpdmVyIG9iamVjdCBvZiBpbnRlcmVzdC5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBJZiBhIGB0aGlzQXJnYCBpcyBwcm92aWRlZCB3aGVuIGNvbm5lY3RpbmcgYSBzaWduYWwsIHRoYXQgb2JqZWN0XG4gKiBpcyBjb25zaWRlcmVkIHRoZSByZWNlaXZlci4gT3RoZXJ3aXNlLCB0aGUgYGNhbGxiYWNrYCBpcyB1c2VkIGFzXG4gKiB0aGUgcmVjZWl2ZXIuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBkaXNjb25uZWN0IGEgcmVndWxhciBvYmplY3QgcmVjZWl2ZXJcbiAqIGRpc2Nvbm5lY3RSZWNlaXZlcihteU9iamVjdCk7XG4gKlxuICogLy8gZGlzY29ubmVjdCBhIHBsYWluIGNhbGxiYWNrIHJlY2VpdmVyXG4gKiBkaXNjb25uZWN0UmVjZWl2ZXIobXlDYWxsYmFjayk7XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gZGlzY29ubmVjdFJlY2VpdmVyKHJlY2VpdmVyKSB7XG4gICAgdmFyIGNvbm4gPSByZWNlaXZlck1hcC5nZXQocmVjZWl2ZXIpO1xuICAgIGlmICghY29ubikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHdoaWxlIChjb25uICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBuZXh0ID0gY29ubi5uZXh0U2VuZGVyO1xuICAgICAgICBjb25uLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgY29ubi50aGlzQXJnID0gbnVsbDtcbiAgICAgICAgY29ubi5wcmV2U2VuZGVyID0gbnVsbDtcbiAgICAgICAgY29ubi5uZXh0U2VuZGVyID0gbnVsbDtcbiAgICAgICAgY29ubiA9IG5leHQ7XG4gICAgfVxuICAgIHJlY2VpdmVyTWFwLmRlbGV0ZShyZWNlaXZlcik7XG59XG5leHBvcnRzLmRpc2Nvbm5lY3RSZWNlaXZlciA9IGRpc2Nvbm5lY3RSZWNlaXZlcjtcbi8qKlxuICogQ2xlYXIgYWxsIHNpZ25hbCBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBvYmogLSBUaGUgb2JqZWN0IGZvciB3aGljaCB0aGUgc2lnbmFsIGRhdGEgc2hvdWxkIGJlIGNsZWFyZWQuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyByZW1vdmVzIGFsbCBzaWduYWwgY29ubmVjdGlvbnMgd2hlcmUgdGhlIG9iamVjdCBpcyB1c2VkIGFzXG4gKiBlaXRoZXIgdGhlIHNlbmRlciBvciB0aGUgcmVjZWl2ZXIuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGVhclNpZ25hbERhdGEoc29tZU9iamVjdCk7XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gY2xlYXJTaWduYWxEYXRhKG9iaikge1xuICAgIGRpc2Nvbm5lY3RTZW5kZXIob2JqKTtcbiAgICBkaXNjb25uZWN0UmVjZWl2ZXIob2JqKTtcbn1cbmV4cG9ydHMuY2xlYXJTaWduYWxEYXRhID0gY2xlYXJTaWduYWxEYXRhO1xuLyoqXG4gKiBBIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uIG9mIElTaWduYWwuXG4gKi9cbnZhciBCb3VuZFNpZ25hbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IGJvdW5kIHNpZ25hbC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBCb3VuZFNpZ25hbChzaWduYWwsIHNlbmRlcikge1xuICAgICAgICB0aGlzLl9zaWduYWwgPSBzaWduYWw7XG4gICAgICAgIHRoaXMuX3NlbmRlciA9IHNlbmRlcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29ubmVjdCBhIGNhbGxiYWNrIHRvIHRoZSBzaWduYWwuXG4gICAgICovXG4gICAgQm91bmRTaWduYWwucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgcmV0dXJuIGNvbm5lY3QodGhpcy5fc2VuZGVyLCB0aGlzLl9zaWduYWwsIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3QgYSBjYWxsYmFjayBmcm9tIHRoZSBzaWduYWwuXG4gICAgICovXG4gICAgQm91bmRTaWduYWwucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgICAgcmV0dXJuIGRpc2Nvbm5lY3QodGhpcy5fc2VuZGVyLCB0aGlzLl9zaWduYWwsIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVtaXQgdGhlIHNpZ25hbCBhbmQgaW52b2tlIHRoZSBjb25uZWN0ZWQgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIEJvdW5kU2lnbmFsLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgZW1pdCh0aGlzLl9zZW5kZXIsIHRoaXMuX3NpZ25hbCwgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gQm91bmRTaWduYWw7XG59KSgpO1xuLyoqXG4gKiBBIHN0cnVjdCB3aGljaCBob2xkcyBjb25uZWN0aW9uIGRhdGEuXG4gKi9cbnZhciBDb25uZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25uZWN0aW9uKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNpZ25hbCBmb3IgdGhlIGNvbm5lY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNpZ25hbCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY2FsbGJhY2sgY29ubmVjdGVkIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBgdGhpc2AgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50aGlzQXJnID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuZXh0IGNvbm5lY3Rpb24gaW4gdGhlIHNpbmdseSBsaW5rZWQgcmVjZWl2ZXJzIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5leHRSZWNlaXZlciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmV4dCBjb25uZWN0aW9uIGluIHRoZSBkb3VibHkgbGlua2VkIHNlbmRlcnMgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmV4dFNlbmRlciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJldmlvdXMgY29ubmVjdGlvbiBpbiB0aGUgZG91Ymx5IGxpbmtlZCBzZW5kZXJzIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByZXZTZW5kZXIgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gQ29ubmVjdGlvbjtcbn0pKCk7XG4vKipcbiAqIFRoZSBsaXN0IG9mIHJlY2VpdmVyIGNvbm5lY3Rpb25zIGZvciBhIHNwZWNpZmljIHNlbmRlci5cbiAqL1xudmFyIENvbm5lY3Rpb25MaXN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb25uZWN0aW9uTGlzdCgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWYgY291bnQgZm9yIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZWZzID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmaXJzdCBjb25uZWN0aW9uIGluIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJzdCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGFzdCBjb25uZWN0aW9uIGluIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5sYXN0ID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIENvbm5lY3Rpb25MaXN0O1xufSkoKTtcbi8qKlxuICogQSBtYXBwaW5nIG9mIHNlbmRlciBvYmplY3QgdG8gaXRzIHJlY2VpdmVyIGNvbm5lY3Rpb24gbGlzdC5cbiAqL1xudmFyIHNlbmRlck1hcCA9IG5ldyBXZWFrTWFwKCk7XG4vKipcbiAqIEEgbWFwcGluZyBvZiByZWNlaXZlciBvYmplY3QgdG8gaXRzIHNlbmRlciBjb25uZWN0aW9uIGxpc3QuXG4gKi9cbnZhciByZWNlaXZlck1hcCA9IG5ldyBXZWFrTWFwKCk7XG4vKipcbiAqIENyZWF0ZSBhIGNvbm5lY3Rpb24gYmV0d2VlbiBhIHNlbmRlciwgc2lnbmFsLCBhbmQgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGNvbm5lY3Qoc2VuZGVyLCBzaWduYWwsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgLy8gQ29lcmNlIGEgYG51bGxgIHRoaXNBcmcgdG8gYHVuZGVmaW5lZGAuXG4gICAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgdm9pZCAwO1xuICAgIC8vIFNlYXJjaCBmb3IgYW4gZXF1aXZhbGVudCBjb25uZWN0aW9uIGFuZCBiYWlsIGlmIG9uZSBleGlzdHMuXG4gICAgdmFyIGxpc3QgPSBzZW5kZXJNYXAuZ2V0KHNlbmRlcik7XG4gICAgaWYgKGxpc3QgJiYgZmluZENvbm5lY3Rpb24obGlzdCwgc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgYSBuZXcgY29ubmVjdGlvbi5cbiAgICB2YXIgY29ubiA9IG5ldyBDb25uZWN0aW9uKCk7XG4gICAgY29ubi5zaWduYWwgPSBzaWduYWw7XG4gICAgY29ubi5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIGNvbm4udGhpc0FyZyA9IHRoaXNBcmc7XG4gICAgLy8gQWRkIHRoZSBjb25uZWN0aW9uIHRvIHRoZSByZWNlaXZlcnMgbGlzdC5cbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgICAgbGlzdCA9IG5ldyBDb25uZWN0aW9uTGlzdCgpO1xuICAgICAgICBsaXN0LmZpcnN0ID0gY29ubjtcbiAgICAgICAgbGlzdC5sYXN0ID0gY29ubjtcbiAgICAgICAgc2VuZGVyTWFwLnNldChzZW5kZXIsIGxpc3QpO1xuICAgIH1cbiAgICBlbHNlIGlmIChsaXN0Lmxhc3QgPT09IG51bGwpIHtcbiAgICAgICAgbGlzdC5maXJzdCA9IGNvbm47XG4gICAgICAgIGxpc3QubGFzdCA9IGNvbm47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsaXN0Lmxhc3QubmV4dFJlY2VpdmVyID0gY29ubjtcbiAgICAgICAgbGlzdC5sYXN0ID0gY29ubjtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZW5kZXJzIGxpc3QuXG4gICAgdmFyIHJlY2VpdmVyID0gdGhpc0FyZyB8fCBjYWxsYmFjaztcbiAgICB2YXIgaGVhZCA9IHJlY2VpdmVyTWFwLmdldChyZWNlaXZlcik7XG4gICAgaWYgKGhlYWQpIHtcbiAgICAgICAgaGVhZC5wcmV2U2VuZGVyID0gY29ubjtcbiAgICAgICAgY29ubi5uZXh0U2VuZGVyID0gaGVhZDtcbiAgICB9XG4gICAgcmVjZWl2ZXJNYXAuc2V0KHJlY2VpdmVyLCBjb25uKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogQnJlYWsgdGhlIGNvbm5lY3Rpb24gYmV0d2VlbiBhIHNlbmRlciwgc2lnbmFsLCBhbmQgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGRpc2Nvbm5lY3Qoc2VuZGVyLCBzaWduYWwsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgLy8gQ29lcmNlIGEgYG51bGxgIHRoaXNBcmcgdG8gYHVuZGVmaW5lZGAuXG4gICAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgdm9pZCAwO1xuICAgIC8vIFNlYXJjaCBmb3IgYW4gZXF1aXZhbGVudCBjb25uZWN0aW9uIGFuZCBiYWlsIGlmIG5vbmUgZXhpc3RzLlxuICAgIHZhciBsaXN0ID0gc2VuZGVyTWFwLmdldChzZW5kZXIpO1xuICAgIGlmICghbGlzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBjb25uID0gZmluZENvbm5lY3Rpb24obGlzdCwgc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgaWYgKCFjb25uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBjb25uZWN0aW9uIGZyb20gdGhlIHNlbmRlcnMgbGlzdC4gSXQgd2lsbCBiZSByZW1vdmVkXG4gICAgLy8gZnJvbSB0aGUgcmVjZWl2ZXJzIGxpc3QgdGhlIG5leHQgdGltZSB0aGUgc2lnbmFsIGlzIGVtaXR0ZWQuXG4gICAgcmVtb3ZlRnJvbVNlbmRlcnNMaXN0KGNvbm4pO1xuICAgIC8vIENsZWFyIHRoZSBjb25uZWN0aW9uIGRhdGEgc28gaXQgYmVjb21lcyBhIGRlYWQgY29ubmVjdGlvbi5cbiAgICBjb25uLmNhbGxiYWNrID0gbnVsbDtcbiAgICBjb25uLnRoaXNBcmcgPSBudWxsO1xuICAgIHJldHVybiB0cnVlO1xufVxuLyoqXG4gKiBFbWl0IGEgc2lnbmFsIGFuZCBpbnZva2UgdGhlIGNvbm5lY3RlZCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIGVtaXQoc2VuZGVyLCBzaWduYWwsIGFyZ3MpIHtcbiAgICB2YXIgbGlzdCA9IHNlbmRlck1hcC5nZXQoc2VuZGVyKTtcbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsaXN0LnJlZnMrKztcbiAgICB0cnkge1xuICAgICAgICB2YXIgZGlydHkgPSBpbnZva2VMaXN0KGxpc3QsIHNlbmRlciwgc2lnbmFsLCBhcmdzKTtcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIGxpc3QucmVmcy0tO1xuICAgIH1cbiAgICBpZiAoZGlydHkgJiYgbGlzdC5yZWZzID09PSAwKSB7XG4gICAgICAgIGNsZWFuTGlzdChsaXN0KTtcbiAgICB9XG59XG4vKipcbiAqIEZpbmQgYSBtYXRjaGluZyBjb25uZWN0aW9uIGluIHRoZSBnaXZlbiBjb25uZWN0aW9uIGxpc3QuXG4gKlxuICogUmV0dXJucyBgbnVsbGAgaWYgbm8gbWF0Y2hpbmcgY29ubmVjdGlvbiBpcyBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZENvbm5lY3Rpb24obGlzdCwgc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciBjb25uID0gbGlzdC5maXJzdDtcbiAgICB3aGlsZSAoY29ubiAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoY29ubi5zaWduYWwgPT09IHNpZ25hbCAmJlxuICAgICAgICAgICAgY29ubi5jYWxsYmFjayA9PT0gY2FsbGJhY2sgJiZcbiAgICAgICAgICAgIGNvbm4udGhpc0FyZyA9PT0gdGhpc0FyZykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbm47XG4gICAgICAgIH1cbiAgICAgICAgY29ubiA9IGNvbm4ubmV4dFJlY2VpdmVyO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFja3MgZm9yIHRoZSBtYXRjaGluZyBzaWduYWxzIGluIHRoZSBsaXN0LlxuICpcbiAqIENvbm5lY3Rpb25zIGFkZGVkIGR1cmluZyBkaXNwYXRjaCB3aWxsIG5vdCBiZSBpbnZva2VkLiBUaGlzIHJldHVybnNcbiAqIGB0cnVlYCBpZiB0aGVyZSBhcmUgZGVhZCBjb25uZWN0aW9ucyBpbiB0aGUgbGlzdCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGludm9rZUxpc3QobGlzdCwgc2VuZGVyLCBzaWduYWwsIGFyZ3MpIHtcbiAgICB2YXIgZGlydHkgPSBmYWxzZTtcbiAgICB2YXIgbGFzdCA9IGxpc3QubGFzdDtcbiAgICB2YXIgY29ubiA9IGxpc3QuZmlyc3Q7XG4gICAgd2hpbGUgKGNvbm4gIT09IG51bGwpIHtcbiAgICAgICAgaWYgKCFjb25uLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29ubi5zaWduYWwgPT09IHNpZ25hbCkge1xuICAgICAgICAgICAgY29ubi5jYWxsYmFjay5jYWxsKGNvbm4udGhpc0FyZywgc2VuZGVyLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ubiA9PT0gbGFzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29ubiA9IGNvbm4ubmV4dFJlY2VpdmVyO1xuICAgIH1cbiAgICByZXR1cm4gZGlydHk7XG59XG4vKipcbiAqIFJlbW92ZSB0aGUgZGVhZCBjb25uZWN0aW9ucyBmcm9tIHRoZSBnaXZlbiBjb25uZWN0aW9uIGxpc3QuXG4gKi9cbmZ1bmN0aW9uIGNsZWFuTGlzdChsaXN0KSB7XG4gICAgdmFyIHByZXY7XG4gICAgdmFyIGNvbm4gPSBsaXN0LmZpcnN0O1xuICAgIHdoaWxlIChjb25uICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBuZXh0ID0gY29ubi5uZXh0UmVjZWl2ZXI7XG4gICAgICAgIGlmICghY29ubi5jYWxsYmFjaykge1xuICAgICAgICAgICAgY29ubi5uZXh0UmVjZWl2ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFwcmV2KSB7XG4gICAgICAgICAgICBsaXN0LmZpcnN0ID0gY29ubjtcbiAgICAgICAgICAgIHByZXYgPSBjb25uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJldi5uZXh0UmVjZWl2ZXIgPSBjb25uO1xuICAgICAgICAgICAgcHJldiA9IGNvbm47XG4gICAgICAgIH1cbiAgICAgICAgY29ubiA9IG5leHQ7XG4gICAgfVxuICAgIGlmICghcHJldikge1xuICAgICAgICBsaXN0LmZpcnN0ID0gbnVsbDtcbiAgICAgICAgbGlzdC5sYXN0ID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByZXYubmV4dFJlY2VpdmVyID0gbnVsbDtcbiAgICAgICAgbGlzdC5sYXN0ID0gcHJldjtcbiAgICB9XG59XG4vKipcbiAqIFJlbW92ZSBhIGNvbm5lY3Rpb24gZnJvbSB0aGUgZG91Ymx5IGxpbmtlZCBsaXN0IG9mIHNlbmRlcnMuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZyb21TZW5kZXJzTGlzdChjb25uKSB7XG4gICAgdmFyIHJlY2VpdmVyID0gY29ubi50aGlzQXJnIHx8IGNvbm4uY2FsbGJhY2s7XG4gICAgdmFyIHByZXYgPSBjb25uLnByZXZTZW5kZXI7XG4gICAgdmFyIG5leHQgPSBjb25uLm5leHRTZW5kZXI7XG4gICAgaWYgKHByZXYgPT09IG51bGwgJiYgbmV4dCA9PT0gbnVsbCkge1xuICAgICAgICByZWNlaXZlck1hcC5kZWxldGUocmVjZWl2ZXIpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgICAgIHJlY2VpdmVyTWFwLnNldChyZWNlaXZlciwgbmV4dCk7XG4gICAgICAgIG5leHQucHJldlNlbmRlciA9IG51bGw7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgICAgcHJldi5uZXh0U2VuZGVyID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByZXYubmV4dFNlbmRlciA9IG5leHQ7XG4gICAgICAgIG5leHQucHJldlNlbmRlciA9IHByZXY7XG4gICAgfVxuICAgIGNvbm4ucHJldlNlbmRlciA9IG51bGw7XG4gICAgY29ubi5uZXh0U2VuZGVyID0gbnVsbDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsInZhciBjc3MgPSBcIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xcbnxcXG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXFxufFxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXFxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xcbi5wLVdpZGdldCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBjdXJzb3I6IGRlZmF1bHQ7XFxufVxcbi5wLVdpZGdldC5wLW1vZC1oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcIm5vZGVfbW9kdWxlc1xcXFxwaG9zcGhvci13aWRnZXRcXFxcbGliXFxcXGluZGV4LmNzc1wifSkpOyBtb2R1bGUuZXhwb3J0cyA9IGNzczsiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGFycmF5cyA9IHJlcXVpcmUoJ3Bob3NwaG9yLWFycmF5cycpO1xudmFyIHBob3NwaG9yX2RvbXV0aWxfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLWRvbXV0aWwnKTtcbnZhciBwaG9zcGhvcl9tZXNzYWdpbmdfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLW1lc3NhZ2luZycpO1xudmFyIHBob3NwaG9yX25vZGV3cmFwcGVyXzEgPSByZXF1aXJlKCdwaG9zcGhvci1ub2Rld3JhcHBlcicpO1xudmFyIHBob3NwaG9yX3Byb3BlcnRpZXNfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXByb3BlcnRpZXMnKTtcbnZhciBwaG9zcGhvcl9zaWduYWxpbmdfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLXNpZ25hbGluZycpO1xucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcbi8qKlxuICogYHAtV2lkZ2V0YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gV2lkZ2V0IGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0cy5XSURHRVRfQ0xBU1MgPSAncC1XaWRnZXQnO1xuLyoqXG4gKiBgcC1tb2QtaGlkZGVuYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gaGlkZGVuIHdpZGdldHMuXG4gKi9cbmV4cG9ydHMuSElEREVOX0NMQVNTID0gJ3AtbW9kLWhpZGRlbic7XG4vKipcbiAqIEEgc2luZ2xldG9uIGAndXBkYXRlLXJlcXVlc3QnYCBtZXNzYWdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgbWVzc2FnZSBjYW4gYmUgZGlzcGF0Y2hlZCB0byBzdXBwb3J0aW5nIHdpZGdldHMgaW4gb3JkZXIgdG9cbiAqIHVwZGF0ZSB0aGVpciBjb250ZW50LiBOb3QgYWxsIHdpZGdldHMgd2lsbCByZXNwb25kIHRvIG1lc3NhZ2VzIG9mXG4gKiB0aGlzIHR5cGUuXG4gKlxuICogVGhpcyBtZXNzYWdlIGlzIHR5cGljYWxseSB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9zaXRpb24gYW5kIHNpemUgb2ZcbiAqIGEgd2lkZ2V0J3MgY2hpbGRyZW4sIG9yIHRvIHVwZGF0ZSBhIHdpZGdldCdzIGNvbnRlbnQgdG8gcmVmbGVjdCB0aGVcbiAqIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHdpZGdldC5cbiAqXG4gKiBNZXNzYWdlcyBvZiB0aGlzIHR5cGUgYXJlIGNvbXByZXNzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbdXBkYXRlXV0sIFtbb25VcGRhdGVSZXF1ZXN0XV1cbiAqL1xuZXhwb3J0cy5NU0dfVVBEQVRFX1JFUVVFU1QgPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSgndXBkYXRlLXJlcXVlc3QnKTtcbi8qKlxuICogQSBzaW5nbGV0b24gYCdsYXlvdXQtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBtZXNzYWdlIGNhbiBiZSBkaXNwYXRjaGVkIHRvIHN1cHBvcnRpbmcgd2lkZ2V0cyBpbiBvcmRlciB0b1xuICogdXBkYXRlIHRoZWlyIGxheW91dC4gTm90IGFsbCB3aWRnZXRzIHdpbGwgcmVzcG9uZCB0byBtZXNzYWdlcyBvZlxuICogdGhpcyB0eXBlLlxuICpcbiAqIFRoaXMgbWVzc2FnZSBpcyB0eXBpY2FsbHkgdXNlZCB0byB1cGRhdGUgdGhlIHNpemUgY29udHJhaW50cyBvZlxuICogYSB3aWRnZXQgYW5kIHRvIHVwZGF0ZSB0aGUgcG9zaXRpb24gYW5kIHNpemUgb2YgaXRzIGNoaWxkcmVuLlxuICpcbiAqIE1lc3NhZ2VzIG9mIHRoaXMgdHlwZSBhcmUgY29tcHJlc3NlZCBieSBkZWZhdWx0LlxuICpcbiAqICoqU2VlIGFsc286KiogW1tvbkxheW91dFJlcXVlc3RdXVxuICovXG5leHBvcnRzLk1TR19MQVlPVVRfUkVRVUVTVCA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKCdsYXlvdXQtcmVxdWVzdCcpO1xuLyoqXG4gKiBBIHNpbmdsZXRvbiBgJ2Nsb3NlLXJlcXVlc3QnYCBtZXNzYWdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgbWVzc2FnZSBzaG91bGQgYmUgZGlzcGF0Y2hlZCB0byBhIHdpZGdldCB3aGVuIGl0IHNob3VsZCBjbG9zZVxuICogYW5kIHJlbW92ZSBpdHNlbGYgZnJvbSB0aGUgd2lkZ2V0IGhpZXJhcmNoeS5cbiAqXG4gKiBNZXNzYWdlcyBvZiB0aGlzIHR5cGUgYXJlIGNvbXByZXNzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbY2xvc2VdXSwgW1tvbkNsb3NlUmVxdWVzdF1dXG4gKi9cbmV4cG9ydHMuTVNHX0NMT1NFX1JFUVVFU1QgPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSgnY2xvc2UtcmVxdWVzdCcpO1xuLyoqXG4gKiBBIHNpbmdsZXRvbiBgJ2FmdGVyLXNob3cnYCBtZXNzYWdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgbWVzc2FnZSBpcyBzZW50IHRvIGEgd2lkZ2V0IHdoZW4gaXQgYmVjb21lcyB2aXNpYmxlLlxuICpcbiAqIFRoaXMgbWVzc2FnZSBpcyAqKm5vdCoqIHNlbnQgd2hlbiB0aGUgd2lkZ2V0IGlzIGF0dGFjaGVkLlxuICpcbiAqICoqU2VlIGFsc286KiogW1tpc1Zpc2libGVdXSwgW1tvbkFmdGVyU2hvd11dXG4gKi9cbmV4cG9ydHMuTVNHX0FGVEVSX1NIT1cgPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSgnYWZ0ZXItc2hvdycpO1xuLyoqXG4gKiBBIHNpbmdsZXRvbiBgJ2JlZm9yZS1oaWRlJ2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2UgaXMgc2VudCB0byBhIHdpZGdldCB3aGVuIGl0IGJlY29tZXMgbm90LXZpc2libGUuXG4gKlxuICogVGhpcyBtZXNzYWdlIGlzICoqbm90Kiogc2VudCB3aGVuIHRoZSB3aWRnZXQgaXMgZGV0YWNoZWQuXG4gKlxuICogKipTZWUgYWxzbzoqKiBbW2lzVmlzaWJsZV1dLCBbW29uQmVmb3JlSGlkZV1dXG4gKi9cbmV4cG9ydHMuTVNHX0JFRk9SRV9ISURFID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoJ2JlZm9yZS1oaWRlJyk7XG4vKipcbiAqIEEgc2luZ2xldG9uIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2UgaXMgc2VudCB0byBhIHdpZGdldCBhZnRlciBpdCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICpcbiAqICoqU2VlIGFsc286KiogW1tpc0F0dGFjaGVkXV0sIFtbb25BZnRlckF0dGFjaF1dXG4gKi9cbmV4cG9ydHMuTVNHX0FGVEVSX0FUVEFDSCA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKCdhZnRlci1hdHRhY2gnKTtcbi8qKlxuICogQSBzaW5nbGV0b24gYCdiZWZvcmUtZGV0YWNoJ2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2UgaXMgc2VudCB0byBhIHdpZGdldCBiZWZvcmUgaXQgaXMgZGV0YWNoZWQgZnJvbSB0aGUgRE9NLlxuICpcbiAqICoqU2VlIGFsc286KiogW1tpc0F0dGFjaGVkXV0sIFtbb25CZWZvcmVEZXRhY2hdXVxuICovXG5leHBvcnRzLk1TR19CRUZPUkVfREVUQUNIID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoJ2JlZm9yZS1kZXRhY2gnKTtcbi8qKlxuICogVGhlIGJhc2UgY2xhc3Mgb2YgdGhlIFBob3NwaG9yIHdpZGdldCBoaWVyYXJjaHkuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBjbGFzcyB3aWxsIHR5cGljYWxseSBiZSBzdWJjbGFzc2VkIGluIG9yZGVyIHRvIGNyZWF0ZSBhIHVzZWZ1bFxuICogd2lkZ2V0LiBIb3dldmVyLCBpdCBjYW4gYmUgdXNlZCBieSBpdHNlbGYgdG8gaG9zdCBmb3JlaWduIGNvbnRlbnRcbiAqIHN1Y2ggYXMgYSBSZWFjdCBvciBCb290c3RyYXAgY29tcG9uZW50LiBTaW1wbHkgaW5zdGFudGlhdGUgYW4gZW1wdHlcbiAqIHdpZGdldCBhbmQgYWRkIHRoZSBjb250ZW50IGRpcmVjdGx5IHRvIGl0cyBbW25vZGVdXS4gVGhlIHdpZGdldCBhbmRcbiAqIGl0cyBjb250ZW50IGNhbiB0aGVuIGJlIGVtYmVkZGVkIHdpdGhpbiBhIFBob3NwaG9yIHdpZGdldCBoaWVyYXJjaHkuXG4gKi9cbnZhciBXaWRnZXQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhXaWRnZXQsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgW1tXSURHRVRfQ0xBU1NdXSBpcyBhZGRlZCB0byB0aGUgd2lkZ2V0IGR1cmluZyBjb25zdHJ1Y3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gV2lkZ2V0KCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5fZmxhZ3MgPSAwO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLl9ib3ggPSBudWxsO1xuICAgICAgICB0aGlzLl9yZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGltaXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhleHBvcnRzLldJREdFVF9DTEFTUyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERpc3Bvc2Ugb2YgdGhlIHdpZGdldCBhbmQgaXRzIGRlc2NlbmRhbnQgd2lkZ2V0cy5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJdCBpcyBnZW5lcmFsbHkgdW5zYWZlIHRvIHVzZSB0aGUgd2lkZ2V0IGFmdGVyIGl0IGhhcyBiZWVuXG4gICAgICogZGlzcG9zZWQuXG4gICAgICpcbiAgICAgKiBJZiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgbW9yZSB0aGFuIG9uY2UsIGFsbCBjYWxscyBtYWRlIGFmdGVyXG4gICAgICogdGhlIGZpcnN0IHdpbGwgYmUgYSBuby1vcC5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mbGFncyB8PSBXaWRnZXRGbGFnLklzRGlzcG9zZWQ7XG4gICAgICAgIHRoaXMuZGlzcG9zZWQuZW1pdCh2b2lkIDApO1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0F0dGFjaGVkKSB7XG4gICAgICAgICAgICBkZXRhY2hXaWRnZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuX2NoaWxkcmVuLnBvcCgpO1xuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IG51bGw7XG4gICAgICAgICAgICBjaGlsZC5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcGhvc3Bob3Jfc2lnbmFsaW5nXzEuY2xlYXJTaWduYWxEYXRhKHRoaXMpO1xuICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5jbGVhck1lc3NhZ2VEYXRhKHRoaXMpO1xuICAgICAgICBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuY2xlYXJQcm9wZXJ0eURhdGEodGhpcyk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJkaXNwb3NlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHNpZ25hbCBlbWl0dGVkIHdoZW4gdGhlIHdpZGdldCBpcyBkaXNwb3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tkaXNwb3NlZFNpZ25hbF1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gV2lkZ2V0LmRpc3Bvc2VkU2lnbmFsLmJpbmQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcImlzQXR0YWNoZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSB3aWRnZXQncyBub2RlIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eSB3aGljaCBpcyBhbHdheXMgc2FmZSB0byBhY2Nlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1thdHRhY2hXaWRnZXRdXSwgW1tkZXRhY2hXaWRnZXRdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZsYWdzICYgV2lkZ2V0RmxhZy5Jc0F0dGFjaGVkKSAhPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwiaXNEaXNwb3NlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXN0IHdoZXRoZXIgdGhlIHdpZGdldCBoYXMgYmVlbiBkaXNwb3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5IHdoaWNoIGlzIGFsd2F5cyBzYWZlIHRvIGFjY2Vzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2Rpc3Bvc2VkXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9mbGFncyAmIFdpZGdldEZsYWcuSXNEaXNwb3NlZCkgIT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcImlzVmlzaWJsZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXN0IHdoZXRoZXIgdGhlIHdpZGdldCBpcyB2aXNpYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIEEgd2lkZ2V0IGlzIHZpc2libGUgd2hlbiBpdCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLCBpcyBub3RcbiAgICAgICAgICogZXhwbGljaXRseSBoaWRkZW4sIGFuZCBoYXMgbm8gZXhwbGljaXRseSBoaWRkZW4gYW5jZXN0b3JzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5IHdoaWNoIGlzIGFsd2F5cyBzYWZlIHRvIGFjY2Vzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2hpZGRlbl1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmxhZ3MgJiBXaWRnZXRGbGFnLklzVmlzaWJsZSkgIT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcImhpZGRlblwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgd2hldGhlciB0aGUgd2lkZ2V0IGlzIGV4cGxpY2l0bHkgaGlkZGVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2hpZGRlblByb3BlcnR5XV0uXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tpc1Zpc2libGVdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gV2lkZ2V0LmhpZGRlblByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB3aGV0aGVyIHRoZSB3aWRnZXQgaXMgZXhwbGljaXRseSBoaWRkZW4uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaGlkZGVuUHJvcGVydHldXS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2lzVmlzaWJsZV1dXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgV2lkZ2V0LmhpZGRlblByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcImJveFNpemluZ1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGJveCBzaXppbmcgZm9yIHRoZSB3aWRnZXQncyBET00gbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHZhbHVlIGlzIGNvbXB1dGVkIG9uY2UgYW5kIHRoZW4gY2FjaGVkIGluIG9yZGVyIHRvIGF2b2lkXG4gICAgICAgICAqIGV4Y2Vzc2l2ZSBzdHlsZSByZWNvbXB1dGF0aW9ucy4gVGhlIGNhY2hlIGNhbiBiZSBjbGVhcmVkIHZpYVxuICAgICAgICAgKiBbW2NsZWFyQm94U2l6aW5nXV0uXG4gICAgICAgICAqXG4gICAgICAgICAqIExheW91dCB3aWRnZXRzIHJlbHkgb24gdGhpcyBwcm9wZXJ0eSB3aGVuIGNvbXB1dGluZyB0aGVpciBsYXlvdXQuXG4gICAgICAgICAqIElmIGEgbGF5b3V0IHdpZGdldCdzIGJveCBzaXppbmcgY2hhbmdlcyBhdCBydW50aW1lLCB0aGUgYm94IHNpemluZ1xuICAgICAgICAgKiBjYWNoZSBzaG91bGQgYmUgY2xlYXJlZCBhbmQgdGhlIGxheW91dCB3aWRnZXQgc2hvdWxkIGJlIHBvc3RlZCBhXG4gICAgICAgICAqYCdsYXlvdXQtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tjbGVhckJveFNpemluZ11dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9ib3gpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JveDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3ggPSBPYmplY3QuZnJlZXplKHBob3NwaG9yX2RvbXV0aWxfMS5ib3hTaXppbmcodGhpcy5ub2RlKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcInNpemVMaW1pdHNcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBzaXplIGxpbWl0cyBmb3IgdGhlIHdpZGdldCdzIERPTSBub2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgdmFsdWUgaXMgY29tcHV0ZWQgb25jZSBhbmQgdGhlbiBjYWNoZWQgaW4gb3JkZXIgdG8gYXZvaWRcbiAgICAgICAgICogZXhjZXNzaXZlIHN0eWxlIHJlY29tcHV0YXRpb25zLiBUaGUgY2FjaGUgY2FuIGJlIGNsZWFyZWQgYnlcbiAgICAgICAgICogY2FsbGluZyBbW2NsZWFyU2l6ZUxpbWl0c11dLlxuICAgICAgICAgKlxuICAgICAgICAgKiBMYXlvdXQgd2lkZ2V0cyByZWx5IG9uIHRoaXMgcHJvcGVydHkgb2YgdGhlaXIgY2hpbGQgd2lkZ2V0cyB3aGVuXG4gICAgICAgICAqIGNvbXB1dGluZyB0aGUgbGF5b3V0LiBJZiBhIGNoaWxkIHdpZGdldCdzIHNpemUgbGltaXRzIGNoYW5nZSBhdFxuICAgICAgICAgKiBydW50aW1lLCB0aGUgc2l6ZSBsaW1pdHMgc2hvdWxkIGJlIGNsZWFyZWQgYW5kIHRoZSBsYXlvdXQgd2lkZ2V0XG4gICAgICAgICAqIHNob3VsZCBiZSBwb3N0ZWQgYSBgJ2xheW91dC1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW3NldFNpemVMaW1pdHNdXSwgW1tjbGVhclNpemVMaW1pdHNdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGltaXRzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW1pdHM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGltaXRzID0gT2JqZWN0LmZyZWV6ZShwaG9zcGhvcl9kb211dGlsXzEuc2l6ZUxpbWl0cyh0aGlzLm5vZGUpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwib2Zmc2V0UmVjdFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGN1cnJlbnQgb2Zmc2V0IGdlb21ldHJ5IHJlY3QgZm9yIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogSWYgdGhlIHdpZGdldCBnZW9tZXRyeSBoYXMgYmVlbiBzZXQgdXNpbmcgW1tzZXRPZmZzZXRHZW9tZXRyeV1dLFxuICAgICAgICAgKiB0aG9zZSB2YWx1ZXMgd2lsbCBiZSB1c2VkIHRvIHBvcHVsYXRlIHRoZSByZWN0LCBhbmQgbm8gZGF0YSB3aWxsXG4gICAgICAgICAqIGJlIHJlYWQgZnJvbSB0aGUgRE9NLiBPdGhlcndpc2UsIHRoZSBvZmZzZXQgZ2VvbWV0cnkgb2YgdGhlIG5vZGVcbiAgICAgICAgICogKip3aWxsKiogYmUgcmVhZCBmcm9tIHRoZSBET00sIHdoaWNoIG1heSBjYXVzZSBhIHJlZmxvdy5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW3NldE9mZnNldEdlb21ldHJ5XV0sIFtbY2xlYXJPZmZzZXRHZW9tZXRyeV1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWN0KVxuICAgICAgICAgICAgICAgIHJldHVybiBjbG9uZU9mZnNldFJlY3QodGhpcy5fcmVjdCk7XG4gICAgICAgICAgICByZXR1cm4gZ2V0T2Zmc2V0UmVjdCh0aGlzLm5vZGUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJwYXJlbnRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBwYXJlbnQgb2YgdGhlIHdpZGdldC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHdpbGwgYmUgYG51bGxgIGlmIHRoZSB3aWRnZXQgZG9lcyBub3QgaGF2ZSBhIHBhcmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgcGFyZW50IG9mIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgd2lkZ2V0IGlzIHRoZSBwYXJlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogSWYgdGhlIHNwZWNpZmllZCBwYXJlbnQgaXMgdGhlIGN1cnJlbnQgcGFyZW50LCB0aGlzIGlzIGEgbm8tb3AuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBzcGVjaWZpZWQgcGFyZW50IGlzIGBudWxsYCwgdGhpcyBpcyBlcXVpdmFsZW50IHRvIHRoZVxuICAgICAgICAgKiBleHByZXNzaW9uIGB3aWRnZXQucGFyZW50LnJlbW92ZUNoaWxkKHdpZGdldClgLCBvdGhlcndpc2UgaXRcbiAgICAgICAgICogaXMgZXF1aXZhbGVudCB0byB0aGUgZXhwcmVzc2lvbiBgcGFyZW50LmFkZENoaWxkKHdpZGdldClgLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbYWRkQ2hpbGRdXSwgW1tpbnNlcnRDaGlsZF1dLCBbW3JlbW92ZUNoaWxkXV1cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKHBhcmVudCAmJiBwYXJlbnQgIT09IHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFwYXJlbnQgJiYgdGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJjaGlsZHJlblwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgYSBzaGFsbG93IGNvcHkgb2YgdGhlIGFycmF5IG9mIGNoaWxkIHdpZGdldHMuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogV2hlbiBvbmx5IGl0ZXJhdGluZyBvdmVyIHRoZSBjaGlsZHJlbiwgaXQgY2FuIGJlIGZhc3RlciB0byB1c2VcbiAgICAgICAgICogdGhlIGNoaWxkIHF1ZXJ5IG1ldGhvZHMsIHdoaWNoIGRvIG5vdCBwZXJmb3JtIGEgY29weS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2NoaWxkQ291bnRdXSwgW1tjaGlsZEF0XV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuLnNsaWNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIGNoaWxkcmVuIG9mIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGNsZWFyIHRoZSBjdXJyZW50IGNoaWxkIHdpZGdldHMgYW5kIGFkZCB0aGUgc3BlY2lmaWVkXG4gICAgICAgICAqIGNoaWxkIHdpZGdldHMuIERlcGVuZGluZyBvbiB0aGUgZGVzaXJlZCBvdXRjb21lLCBpdCBjYW4gYmUgbW9yZVxuICAgICAgICAgKiBlZmZpY2llbnQgdG8gdXNlIG9uZSBvZiB0aGUgY2hpbGQgbWFuaXB1bGF0aW9uIG1ldGhvZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1thZGRDaGlsZF1dLCBbW2luc2VydENoaWxkXV0sIFtbcmVtb3ZlQ2hpbGRdXVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBfdGhpcy5hZGRDaGlsZChjaGlsZCk7IH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJjaGlsZENvdW50XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2NoaWxkcmVuXV0sIFtbY2hpbGRBdF1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY2hpbGQgd2lkZ2V0IGF0IGEgc3BlY2lmaWMgaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGNoaWxkIG9mIGludGVyZXN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGNoaWxkIHdpZGdldCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LCBvciBgdW5kZWZpbmVkYFxuICAgICAqICBpZiB0aGUgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2NoaWxkQ291bnRdXSwgW1tjaGlsZEluZGV4XV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNoaWxkQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuW2luZGV4IHwgMF07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGluZGV4IG9mIGEgc3BlY2lmaWMgY2hpbGQgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkIC0gVGhlIGNoaWxkIHdpZGdldCBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBpbmRleCBvZiB0aGUgc3BlY2lmaWVkIGNoaWxkIHdpZGdldCwgb3IgYC0xYCBpZlxuICAgICAqICAgdGhlIHdpZGdldCBpcyBub3QgYSBjaGlsZCBvZiB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tjaGlsZENvdW50XV0sIFtbY2hpbGRBdF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jaGlsZEluZGV4ID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5pbmRleE9mKGNoaWxkKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGNoaWxkIHdpZGdldCB0byB0aGUgZW5kIG9mIHRoZSB3aWRnZXQncyBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZCAtIFRoZSBjaGlsZCB3aWRnZXQgdG8gYWRkIHRvIHRoaXMgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIG5ldyBpbmRleCBvZiB0aGUgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYSB3aWRnZXQgaXMgYWRkZWQgdG8gaXRzZWxmLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBjaGlsZCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50IHBhcmVudFxuICAgICAqIGJlZm9yZSBiZWluZyBhZGRlZCB0byB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tpbnNlcnRDaGlsZF1dLCBbW21vdmVDaGlsZF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRDaGlsZCh0aGlzLl9jaGlsZHJlbi5sZW5ndGgsIGNoaWxkKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluc2VydCBhIGNoaWxkIHdpZGdldCBhdCBhIHNwZWNpZmljIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IC0gVGhlIHRhcmdldCBpbmRleCBmb3IgdGhlIHdpZGdldC4gVGhpcyB3aWxsIGJlXG4gICAgICogICBjbGFtcGVkIHRvIHRoZSBib3VuZHMgb2YgdGhlIGNoaWxkcmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkIC0gVGhlIGNoaWxkIHdpZGdldCB0byBpbnNlcnQgaW50byB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIG5ldyBpbmRleCBvZiB0aGUgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYSB3aWRnZXQgaXMgaW5zZXJ0ZWQgaW50byBpdHNlbGYuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIGNoaWxkIHdpbGwgYmUgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIGN1cnJlbnQgcGFyZW50XG4gICAgICogYmVmb3JlIGJlaW5nIGFkZGVkIHRvIHRoaXMgd2lkZ2V0LlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2FkZENoaWxkXV0sIFtbbW92ZUNoaWxkXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmluc2VydENoaWxkID0gZnVuY3Rpb24gKGluZGV4LCBjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaGlsZCB3aWRnZXQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hpbGQuX3BhcmVudCkge1xuICAgICAgICAgICAgY2hpbGQuX3BhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGQuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgZGV0YWNoV2lkZ2V0KGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZC5fcGFyZW50ID0gdGhpcztcbiAgICAgICAgdmFyIGkgPSBhcnJheXMuaW5zZXJ0KHRoaXMuX2NoaWxkcmVuLCBpbmRleCwgY2hpbGQpO1xuICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZSh0aGlzLCBuZXcgQ2hpbGRNZXNzYWdlKCdjaGlsZC1hZGRlZCcsIGNoaWxkLCAtMSwgaSkpO1xuICAgICAgICByZXR1cm4gaTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1vdmUgYSBjaGlsZCB3aWRnZXQgZnJvbSBvbmUgaW5kZXggdG8gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGNoaWxkIG9mIGludGVyZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHRvSW5kZXggLSBUaGUgdGFyZ2V0IGluZGV4IGZvciB0aGUgY2hpbGQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyAndHJ1ZScgaWYgdGhlIGNoaWxkIHdhcyBtb3ZlZCwgb3IgYGZhbHNlYCBpZiBlaXRoZXJcbiAgICAgKiAgIG9mIHRoZSBnaXZlbiBpbmRpY2VzIGFyZSBvdXQgb2YgcmFuZ2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgY2FuIGJlIG1vcmUgZWZmaWNpZW50IHRoYW4gcmUtaW5zZXJ0aW5nIGFuIGV4aXN0aW5nXG4gICAgICogY2hpbGQsIGFzIHNvbWUgd2lkZ2V0cyBtYXkgYmUgYWJsZSB0byBvcHRpbWl6ZSBjaGlsZCBtb3ZlcyBhbmRcbiAgICAgKiBhdm9pZCBtYWtpbmcgdW5uZWNlc3NhcnkgY2hhbmdlcyB0byB0aGUgRE9NLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2FkZENoaWxkXV0sIFtbaW5zZXJ0Q2hpbGRdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUubW92ZUNoaWxkID0gZnVuY3Rpb24gKGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgICAgICB2YXIgaSA9IGZyb21JbmRleCB8IDA7XG4gICAgICAgIHZhciBqID0gdG9JbmRleCB8IDA7XG4gICAgICAgIGlmICghYXJyYXlzLm1vdmUodGhpcy5fY2hpbGRyZW4sIGksIGopKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgIT09IGopIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuX2NoaWxkcmVuW2pdO1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgbmV3IENoaWxkTWVzc2FnZSgnY2hpbGQtbW92ZWQnLCBjaGlsZCwgaSwgaikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBjaGlsZCB3aWRnZXQgYXQgYSBzcGVjaWZpYyBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgY2hpbGQgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgcmVtb3ZlZCBjaGlsZCB3aWRnZXQsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBpbmRleFxuICAgICAqICAgaXMgb3V0IG9mIHJhbmdlLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3JlbW92ZUNoaWxkXV0sIFtbY2xlYXJDaGlsZHJlbl1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5yZW1vdmVDaGlsZEF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXggfCAwO1xuICAgICAgICB2YXIgY2hpbGQgPSBhcnJheXMucmVtb3ZlQXQodGhpcy5fY2hpbGRyZW4sIGkpO1xuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgbmV3IENoaWxkTWVzc2FnZSgnY2hpbGQtcmVtb3ZlZCcsIGNoaWxkLCBpLCAtMSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIHNwZWNpZmljIGNoaWxkIHdpZGdldCBmcm9tIHRoaXMgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkIC0gVGhlIGNoaWxkIHdpZGdldCBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBpbmRleCB3aGljaCB0aGUgY2hpbGQgb2NjdXBpZWQsIG9yIGAtMWAgaWYgdGhlXG4gICAgICogICBjaGlsZCBpcyBub3QgYSBjaGlsZCBvZiB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tyZW1vdmVDaGlsZEF0XV0sIFtbY2xlYXJDaGlsZHJlbl1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuY2hpbGRJbmRleChjaGlsZCk7XG4gICAgICAgIGlmIChpICE9PSAtMSlcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdChpKTtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGNoaWxkIHdpZGdldHMgZnJvbSB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgd2lsbCBjb250aW51ZSB0byByZW1vdmUgY2hpbGRyZW4gdW50aWwgdGhlIGBjaGlsZENvdW50YFxuICAgICAqIHJlYWNoZXMgemVyby4gSXQgaXMgdGhlcmVmb3JlIHBvc3NpYmxlIHRvIGVudGVyIGFuIGluZmluaXRlXG4gICAgICogbG9vcCBpZiBhIG1lc3NhZ2UgaGFuZGxlciBjYXVzZXMgYSBjaGlsZCB3aWRnZXQgdG8gYmUgYWRkZWRcbiAgICAgKiBpbiByZXNwb25zZSB0byBvbmUgYmVpbmcgcmVtb3ZlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tyZW1vdmVDaGlsZF1dLCBbW3JlbW92ZUNoaWxkQXRdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuY2xlYXJDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuY2hpbGRDb3VudCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdCh0aGlzLmNoaWxkQ291bnQgLSAxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2ggYW4gYCd1cGRhdGUtcmVxdWVzdCdgIG1lc3NhZ2UgdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbW1lZGlhdGUgLSBXaGV0aGVyIHRvIGRpc3BhdGNoIHRoZSBtZXNzYWdlIGltbWVkaWF0ZWx5XG4gICAgICogICAoYHRydWVgKSBvciBpbiB0aGUgZnV0dXJlIChgZmFsc2VgKS4gVGhlIGRlZmF1bHQgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tNU0dfVVBEQVRFX1JFUVVFU1RdXSwgW1tvblVwZGF0ZVJlcXVlc3RdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGltbWVkaWF0ZSkge1xuICAgICAgICBpZiAoaW1tZWRpYXRlID09PSB2b2lkIDApIHsgaW1tZWRpYXRlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgZXhwb3J0cy5NU0dfVVBEQVRFX1JFUVVFU1QpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEucG9zdE1lc3NhZ2UodGhpcywgZXhwb3J0cy5NU0dfVVBEQVRFX1JFUVVFU1QpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaCBhIGAnY2xvc2UtcmVxdWVzdCdgIG1lc3NhZ2UgdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbW1lZGlhdGUgLSBXaGV0aGVyIHRvIGRpc3BhdGNoIHRoZSBtZXNzYWdlIGltbWVkaWF0ZWx5XG4gICAgICogICAoYHRydWVgKSBvciBpbiB0aGUgZnV0dXJlIChgZmFsc2VgKS4gVGhlIGRlZmF1bHQgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tNU0dfQ0xPU0VfUkVRVUVTVF1dLCBbW29uQ2xvc2VSZXF1ZXN0XV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGltbWVkaWF0ZSkge1xuICAgICAgICBpZiAoaW1tZWRpYXRlID09PSB2b2lkIDApIHsgaW1tZWRpYXRlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgZXhwb3J0cy5NU0dfQ0xPU0VfUkVRVUVTVCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5wb3N0TWVzc2FnZSh0aGlzLCBleHBvcnRzLk1TR19DTE9TRV9SRVFVRVNUKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIGNhY2hlZCBib3ggc2l6aW5nIGZvciB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiByZWFkIGZyb20gdGhlIERPTS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiB3cml0ZSB0byB0aGUgRE9NLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2JveFNpemluZ11dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jbGVhckJveFNpemluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fYm94ID0gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCB0aGUgc2l6ZSBsaW1pdHMgZm9yIHRoZSB3aWRnZXQncyBET00gbm9kZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtaW5XaWR0aCAtIFRoZSBtaW4gd2lkdGggZm9yIHRoZSB3aWRnZXQsIGluIHBpeGVscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtaW5IZWlnaHQgLSBUaGUgbWluIGhlaWdodCBmb3IgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1heFdpZHRoIC0gVGhlIG1heCB3aWR0aCBmb3IgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1heEhlaWdodCAtIFRoZSBtYXggaGVpZ2h0IGZvciB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgZG9lcyAqKm5vdCoqIHJlYWQgZnJvbSB0aGUgRE9NLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3NpemVMaW1pdHNdXSwgW1tjbGVhclNpemVMaW1pdHNdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuc2V0U2l6ZUxpbWl0cyA9IGZ1bmN0aW9uIChtaW5XaWR0aCwgbWluSGVpZ2h0LCBtYXhXaWR0aCwgbWF4SGVpZ2h0KSB7XG4gICAgICAgIHZhciBtaW5XID0gTWF0aC5tYXgoMCwgbWluV2lkdGgpO1xuICAgICAgICB2YXIgbWluSCA9IE1hdGgubWF4KDAsIG1pbkhlaWdodCk7XG4gICAgICAgIHZhciBtYXhXID0gTWF0aC5tYXgoMCwgbWF4V2lkdGgpO1xuICAgICAgICB2YXIgbWF4SCA9IE1hdGgubWF4KDAsIG1heEhlaWdodCk7XG4gICAgICAgIHRoaXMuX2xpbWl0cyA9IE9iamVjdC5mcmVlemUoe1xuICAgICAgICAgICAgbWluV2lkdGg6IG1pblcsXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IG1pbkgsXG4gICAgICAgICAgICBtYXhXaWR0aDogbWF4VyxcbiAgICAgICAgICAgIG1heEhlaWdodDogbWF4SCxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMubm9kZS5zdHlsZTtcbiAgICAgICAgc3R5bGUubWluV2lkdGggPSBtaW5XICsgJ3B4JztcbiAgICAgICAgc3R5bGUubWluSGVpZ2h0ID0gbWluSCArICdweCc7XG4gICAgICAgIHN0eWxlLm1heFdpZHRoID0gKG1heFcgPT09IEluZmluaXR5KSA/ICcnIDogbWF4VyArICdweCc7XG4gICAgICAgIHN0eWxlLm1heEhlaWdodCA9IChtYXhIID09PSBJbmZpbml0eSkgPyAnJyA6IG1heEggKyAncHgnO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIGNhY2hlZCBzaXplIGxpbWl0cyBmb3IgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90KiogcmVhZCBmcm9tIHRoZSBET00uXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbc2l6ZUxpbWl0c11dLCBbW3NldFNpemVMaW1pdHNdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuY2xlYXJTaXplTGltaXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9saW1pdHMgPSBudWxsO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLm5vZGUuc3R5bGU7XG4gICAgICAgIHN0eWxlLm1pbldpZHRoID0gJyc7XG4gICAgICAgIHN0eWxlLm1heFdpZHRoID0gJyc7XG4gICAgICAgIHN0eWxlLm1pbkhlaWdodCA9ICcnO1xuICAgICAgICBzdHlsZS5tYXhIZWlnaHQgPSAnJztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCB0aGUgb2Zmc2V0IGdlb21ldHJ5IGZvciB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGxlZnQgLSBUaGUgb2Zmc2V0IGxlZnQgZWRnZSBvZiB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdG9wIC0gVGhlIG9mZnNldCB0b3AgZWRnZSBvZiB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gd2lkdGggLSBUaGUgb2Zmc2V0IHdpZHRoIG9mIHRoZSB3aWRnZXQsIGluIHBpeGVscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBoZWlnaHQgLSBUaGUgb2Zmc2V0IGhlaWdodCBvZiB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgaXMgb25seSB1c2VmdWwgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbmluZyB0byBzZXRcbiAgICAgKiB0aGUgbGF5b3V0IGdlb21ldHJ5IG9mIHRoZSB3aWRnZXQuIEl0IHdpbGwgdXBkYXRlIHRoZSBpbmxpbmUgc3R5bGVcbiAgICAgKiBvZiB0aGUgd2lkZ2V0IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZXMuIElmIHRoZSB3aWR0aCBvciBoZWlnaHQgaXNcbiAgICAgKiBkaWZmZXJlbnQgZnJvbSB0aGUgcHJldmlvdXMgdmFsdWUsIGEgW1tSZXNpemVNZXNzYWdlXV0gd2lsbCBiZSBzZW50XG4gICAgICogdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiB0YWtlIGludG8gYWNjb3VudCB0aGUgc2l6ZSBsaW1pdHMgb2YgdGhlXG4gICAgICogd2lkZ2V0LiBJdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHNwZWNpZmllZCB3aWR0aCBhbmQgaGVpZ2h0IGRvIG5vdFxuICAgICAqIHZpb2xhdGUgdGhlIHNpemUgY29uc3RyYWludHMgb2YgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiByZWFkIGFueSBkYXRhIGZyb20gdGhlIERPTS5cbiAgICAgKlxuICAgICAqIENvZGUgd2hpY2ggdXNlcyB0aGlzIG1ldGhvZCB0byBsYXlvdXQgYSB3aWRnZXQgaXMgcmVzcG9uc2libGUgZm9yXG4gICAgICogY2FsbGluZyBbW2NsZWFyT2Zmc2V0R2VvbWV0cnldXSB3aGVuIGl0IGlzIGZpbmlzaGVkIG1hbmFnaW5nIHRoZVxuICAgICAqIHdpZGdldC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tvZmZzZXRSZWN0XV0sIFtbY2xlYXJPZmZzZXRHZW9tZXRyeV1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5zZXRPZmZzZXRHZW9tZXRyeSA9IGZ1bmN0aW9uIChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSB0aGlzLl9yZWN0IHx8ICh0aGlzLl9yZWN0ID0gbWFrZU9mZnNldFJlY3QoKSk7XG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMubm9kZS5zdHlsZTtcbiAgICAgICAgdmFyIHJlc2l6ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRvcCAhPT0gcmVjdC50b3ApIHtcbiAgICAgICAgICAgIHJlY3QudG9wID0gdG9wO1xuICAgICAgICAgICAgc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGVmdCAhPT0gcmVjdC5sZWZ0KSB7XG4gICAgICAgICAgICByZWN0LmxlZnQgPSBsZWZ0O1xuICAgICAgICAgICAgc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aWR0aCAhPT0gcmVjdC53aWR0aCkge1xuICAgICAgICAgICAgcmVzaXplZCA9IHRydWU7XG4gICAgICAgICAgICByZWN0LndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICBzdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGVpZ2h0ICE9PSByZWN0LmhlaWdodCkge1xuICAgICAgICAgICAgcmVzaXplZCA9IHRydWU7XG4gICAgICAgICAgICByZWN0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc2l6ZWQpXG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZSh0aGlzLCBuZXcgUmVzaXplTWVzc2FnZSh3aWR0aCwgaGVpZ2h0KSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDbGVhciB0aGUgb2Zmc2V0IGdlb21ldHJ5IGZvciB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGlzIG9ubHkgdXNlZnVsIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb25pbmcgdG8gc2V0XG4gICAgICogdGhlIGxheW91dCBnZW9tZXRyeSBvZiB0aGUgd2lkZ2V0LiBJdCB3aWxsIHJlc2V0IHRoZSBpbmxpbmUgc3R5bGVcbiAgICAgKiBvZiB0aGUgd2lkZ2V0IGFuZCBjbGVhciB0aGUgc3RvcmVkIG9mZnNldCBnZW9tZXRyeSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsICoqbm90KiogZGlzcGF0Y2ggYSBbW1Jlc2l6ZU1lc3NhZ2VdXS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiByZWFkIGFueSBkYXRhIGZyb20gdGhlIERPTS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgYnkgdGhlIHdpZGdldCdzIGxheW91dCBtYW5hZ2VyIHdoZW5cbiAgICAgKiBpdCBubyBsb25nZXIgbWFuYWdlcyB0aGUgd2lkZ2V0LiBJdCBhbGxvd3MgdGhlIHdpZGdldCB0byBiZSBhZGRlZFxuICAgICAqIHRvIGFub3RoZXIgbGF5b3V0IHBhbmVsIHdpdGhvdXQgY29uZmxpY3QuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbb2Zmc2V0UmVjdF1dLCBbW3NldE9mZnNldEdlb21ldHJ5XV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNsZWFyT2Zmc2V0R2VvbWV0cnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlY3QgPSBudWxsO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLm5vZGUuc3R5bGU7XG4gICAgICAgIHN0eWxlLnRvcCA9ICcnO1xuICAgICAgICBzdHlsZS5sZWZ0ID0gJyc7XG4gICAgICAgIHN0eWxlLndpZHRoID0gJyc7XG4gICAgICAgIHN0eWxlLmhlaWdodCA9ICcnO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUHJvY2VzcyBhIG1lc3NhZ2Ugc2VudCB0byB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHNlbnQgdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCBhcyBuZWVkZWQuXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5wcm9jZXNzTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAncmVzaXplJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVzaXplKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1cGRhdGUtcmVxdWVzdCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vblVwZGF0ZVJlcXVlc3QobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xheW91dC1yZXF1ZXN0JzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGF5b3V0UmVxdWVzdChtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hpbGQtYWRkZWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25DaGlsZEFkZGVkKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjaGlsZC1yZW1vdmVkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hpbGRSZW1vdmVkKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjaGlsZC1tb3ZlZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoaWxkTW92ZWQobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FmdGVyLXNob3cnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IFdpZGdldEZsYWcuSXNWaXNpYmxlO1xuICAgICAgICAgICAgICAgIHRoaXMub25BZnRlclNob3cobXNnKTtcbiAgICAgICAgICAgICAgICBzZW5kVG9TaG93bih0aGlzLl9jaGlsZHJlbiwgbXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JlZm9yZS1oaWRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlSGlkZShtc2cpO1xuICAgICAgICAgICAgICAgIHNlbmRUb1Nob3duKHRoaXMuX2NoaWxkcmVuLCBtc2cpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzICY9IH5XaWRnZXRGbGFnLklzVmlzaWJsZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FmdGVyLWF0dGFjaCc6XG4gICAgICAgICAgICAgICAgdmFyIHZpc2libGUgPSAhdGhpcy5oaWRkZW4gJiYgKCF0aGlzLl9wYXJlbnQgfHwgdGhpcy5fcGFyZW50LmlzVmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZpc2libGUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IFdpZGdldEZsYWcuSXNWaXNpYmxlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IFdpZGdldEZsYWcuSXNBdHRhY2hlZDtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJBdHRhY2gobXNnKTtcbiAgICAgICAgICAgICAgICBzZW5kVG9BbGwodGhpcy5fY2hpbGRyZW4sIG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdiZWZvcmUtZGV0YWNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlRGV0YWNoKG1zZyk7XG4gICAgICAgICAgICAgICAgc2VuZFRvQWxsKHRoaXMuX2NoaWxkcmVuLCBtc2cpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzICY9IH5XaWRnZXRGbGFnLklzVmlzaWJsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+V2lkZ2V0RmxhZy5Jc0F0dGFjaGVkO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hpbGQtc2hvd24nOlxuICAgICAgICAgICAgICAgIHRoaXMub25DaGlsZFNob3duKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjaGlsZC1oaWRkZW4nOlxuICAgICAgICAgICAgICAgIHRoaXMub25DaGlsZEhpZGRlbihtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2xvc2UtcmVxdWVzdCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlUmVxdWVzdChtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDb21wcmVzcyBhIG1lc3NhZ2UgcG9zdGVkIHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgcG9zdGVkIHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGVuZGluZyAtIFRoZSBxdWV1ZSBvZiBwZW5kaW5nIG1lc3NhZ2VzIGZvciB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXNzYWdlIHdhcyBjb21wcmVzc2VkIGFuZCBzaG91bGQgYmVcbiAgICAgKiAgIGRyb3BwZWQsIG9yIGBmYWxzZWAgaWYgdGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGVucXVldWVkIGZvclxuICAgICAqICAgZGVsaXZlcnkgYXMgbm9ybWFsLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGNvbXByZXNzZXMgdGhlIGZvbGxvd2luZyBtZXNzYWdlczpcbiAgICAgKiBgJ3VwZGF0ZS1yZXF1ZXN0J2AsIGAnbGF5b3V0LXJlcXVlc3QnYCwgYW5kIGAnY2xvc2UtcmVxdWVzdCdgLlxuICAgICAqXG4gICAgICogU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBtZXRob2QgYXMgbmVlZGVkLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuY29tcHJlc3NNZXNzYWdlID0gZnVuY3Rpb24gKG1zZywgcGVuZGluZykge1xuICAgICAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICd1cGRhdGUtcmVxdWVzdCc6XG4gICAgICAgICAgICBjYXNlICdsYXlvdXQtcmVxdWVzdCc6XG4gICAgICAgICAgICBjYXNlICdjbG9zZS1yZXF1ZXN0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGVuZGluZy5zb21lKGZ1bmN0aW9uIChvdGhlcikgeyByZXR1cm4gb3RoZXIudHlwZSA9PT0gbXNnLnR5cGU7IH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2NoaWxkLWFkZGVkJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBhZGRzIHRoZSBjaGlsZCBub2RlIHRvIHRoZSB3aWRnZXRcbiAgICAgKiBub2RlIGF0IHRoZSBwcm9wZXIgbG9jYXRpb24gYW5kIGRpc3BhdGNoZXMgYW4gYCdhZnRlci1hdHRhY2gnYFxuICAgICAqIG1lc3NhZ2UgaWYgYXBwcm9wcmlhdGUuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCB0byBjb250cm9sIGhvdyB0aGUgY2hpbGRcbiAgICAgKiBub2RlIGlzIGFkZGVkLCBidXQgdGhleSBtdXN0IGRpc3BhdGNoIGFuIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZVxuICAgICAqIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25DaGlsZEFkZGVkID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICB2YXIgbmV4dCA9IHRoaXMuY2hpbGRBdChtc2cuY3VycmVudEluZGV4ICsgMSk7XG4gICAgICAgIHRoaXMubm9kZS5pbnNlcnRCZWZvcmUobXNnLmNoaWxkLm5vZGUsIG5leHQgJiYgbmV4dC5ub2RlKTtcbiAgICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZClcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKG1zZy5jaGlsZCwgZXhwb3J0cy5NU0dfQUZURVJfQVRUQUNIKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2NoaWxkLXJlbW92ZWQnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHJlbW92ZXMgdGhlIGNoaWxkIG5vZGUgZnJvbSB0aGUgd2lkZ2V0XG4gICAgICogbm9kZSBhbmQgZGlzcGF0Y2hlcyBhIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UgaWYgYXBwcm9wcmlhdGUuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCB0byBjb250cm9sIGhvdyB0aGUgY2hpbGRcbiAgICAgKiBub2RlIGlzIHJlbW92ZWQsIGJ1dCB0aGV5IG11c3QgIGRpc3BhdGNoIGEgYCdiZWZvcmUtZGV0YWNoJ2BcbiAgICAgKiBtZXNzYWdlIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25DaGlsZFJlbW92ZWQgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQXR0YWNoZWQpXG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShtc2cuY2hpbGQsIGV4cG9ydHMuTVNHX0JFRk9SRV9ERVRBQ0gpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQobXNnLmNoaWxkLm5vZGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2hpbGQtbW92ZWQnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG1vdmVzIHRoZSBjaGlsZCBub2RlIHRvIHRoZSBwcm9wZXJcbiAgICAgKiBsb2NhdGlvbiBpbiB0aGUgd2lkZ2V0IG5vZGUgYW5kIGRpc3BhdGNoZXMgYSBgJ2JlZm9yZS1kZXRhY2gnYFxuICAgICAqIGFuZCBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2UgaWYgYXBwcm9wcmlhdGUuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCB0byBjb250cm9sIGhvdyB0aGUgY2hpbGRcbiAgICAgKiBub2RlIGlzIG1vdmVkLCBidXQgdGhleSBtdXN0IGRpc3BhdGNoIGEgYCdiZWZvcmUtZGV0YWNoJ2AgYW5kXG4gICAgICogYCdhZnRlci1hdHRhY2gnYCBtZXNzYWdlIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25DaGlsZE1vdmVkID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKVxuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UobXNnLmNoaWxkLCBleHBvcnRzLk1TR19CRUZPUkVfREVUQUNIKTtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLmNoaWxkQXQobXNnLmN1cnJlbnRJbmRleCArIDEpO1xuICAgICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKG1zZy5jaGlsZC5ub2RlLCBuZXh0ICYmIG5leHQubm9kZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQXR0YWNoZWQpXG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShtc2cuY2hpbGQsIGV4cG9ydHMuTVNHX0FGVEVSX0FUVEFDSCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdyZXNpemUnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBzZW5kcyBhbiBbW1Vua25vd25TaXplXV1cbiAgICAgKiByZXNpemUgbWVzc2FnZSB0byBlYWNoIGNoaWxkLiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgcmVzaXplIG1lc3NhZ2VzXG4gICAgICogcHJvcGFnYXRlIHRocm91Z2ggYWxsIHdpZGdldHMgaW4gdGhlIGhpZXJhcmNoeS5cbiAgICAgKlxuICAgICAqIFN1YmNsYXNzZXMgbWF5IHJlaW1wbGVtZW50IHRoaXMgbWV0aG9kIGFzIG5lZWRlZCwgYnV0IHRoZXkgbXVzdFxuICAgICAqIGRpc3BhdGNoIGAncmVzaXplJ2AgbWVzc2FnZXMgdG8gdGhlaXIgY2hpbGRyZW4gYXMgYXBwcm9wcmlhdGUuXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgc2VuZFRvQWxsKHRoaXMuX2NoaWxkcmVuLCBSZXNpemVNZXNzYWdlLlVua25vd25TaXplKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYW4gYCd1cGRhdGUtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIHNlbmRzIGFuIFtbVW5rbm93blNpemVdXVxuICAgICAqIHJlc2l6ZSBtZXNzYWdlIHRvIGVhY2ggY2hpbGQuIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSByZXNpemUgbWVzc2FnZXNcbiAgICAgKiBwcm9wYWdhdGUgdGhyb3VnaCBhbGwgd2lkZ2V0cyBpbiB0aGUgaGllcmFyY2h5LlxuICAgICAqXG4gICAgICogU3ViY2xhc3MgbWF5IHJlaW1wbGVtZW50IHRoaXMgbWV0aG9kIGFzIG5lZWRlZCwgYnV0IHRoZXkgc2hvdWxkXG4gICAgICogZGlzcGF0Y2ggYCdyZXNpemUnYCBtZXNzYWdlcyB0byB0aGVpciBjaGlsZHJlbiBhcyBhcHByb3ByaWF0ZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1t1cGRhdGVdXSwgW1tNU0dfVVBEQVRFX1JFUVVFU1RdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25VcGRhdGVSZXF1ZXN0ID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBzZW5kVG9BbGwodGhpcy5fY2hpbGRyZW4sIFJlc2l6ZU1lc3NhZ2UuVW5rbm93blNpemUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2xvc2UtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIHdpbGwgdW5wYXJlbnQgb3IgZGV0YWNoXG4gICAgICogdGhlIHdpZGdldCBhcyBhcHByb3ByaWF0ZS4gU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBoYW5kbGVyXG4gICAgICogZm9yIGN1c3RvbSBjbG9zZSBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tjbG9zZV1dLCBbW01TR19DTE9TRV9SRVFVRVNUXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQ2xvc2VSZXF1ZXN0ID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc0F0dGFjaGVkKSB7XG4gICAgICAgICAgICBkZXRhY2hXaWRnZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2xheW91dC1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW01TR19MQVlPVVRfUkVRVUVTVF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vbkxheW91dFJlcXVlc3QgPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhbiBgJ2FmdGVyLXNob3cnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIGlzIGEgbm8tb3AuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX0FGVEVSX1NIT1ddXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25BZnRlclNob3cgPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnYmVmb3JlLWhpZGUnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIGlzIGEgbm8tb3AuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX0JFRk9SRV9ISURFXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQmVmb3JlSGlkZSA9IGZ1bmN0aW9uIChtc2cpIHsgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGFuIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tNU0dfQUZURVJfQVRUQUNIXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQWZ0ZXJBdHRhY2ggPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX0JFRk9SRV9ERVRBQ0hdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25CZWZvcmVEZXRhY2ggPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2hpbGQtc2hvd24nYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vbkNoaWxkU2hvd24gPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2hpbGQtaGlkZGVuJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25DaGlsZEhpZGRlbiA9IGZ1bmN0aW9uIChtc2cpIHsgfTtcbiAgICAvKipcbiAgICAgKiBBIHNpZ25hbCBlbWl0dGVkIHdoZW4gdGhlIHdpZGdldCBpcyBkaXNwb3NlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tkaXNwb3NlZF1dLCBbW2lzRGlzcG9zZWRdXVxuICAgICAqL1xuICAgIFdpZGdldC5kaXNwb3NlZFNpZ25hbCA9IG5ldyBwaG9zcGhvcl9zaWduYWxpbmdfMS5TaWduYWwoKTtcbiAgICAvKipcbiAgICAgKiBBIHByb3BlcnR5IGRlc2NyaXB0b3Igd2hpY2ggY29udHJvbHMgdGhlIGhpZGRlbiBzdGF0ZSBvZiBhIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIHByb3BlcnR5IGNvbnRyb2xzIHdoZXRoZXIgYSB3aWRnZXQgaXMgZXhwbGljaXRseSBoaWRkZW4uXG4gICAgICpcbiAgICAgKiBIaWRpbmcgYSB3aWRnZXQgd2lsbCBjYXVzZSB0aGUgd2lkZ2V0IGFuZCBhbGwgb2YgaXRzIGRlc2NlbmRhbnRzXG4gICAgICogdG8gYmVjb21lIG5vdC12aXNpYmxlLlxuICAgICAqXG4gICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIHRvZ2dsZSB0aGUgcHJlc2VuY2Ugb2YgW1tISURERU5fQ0xBU1NdXSBvbiBhXG4gICAgICogd2lkZ2V0IGFjY29yZGluZyB0byB0aGUgcHJvcGVydHkgdmFsdWUuIEl0IHdpbGwgYWxzbyBkaXNwYXRjaFxuICAgICAqIGAnYWZ0ZXItc2hvdydgIGFuZCBgJ2JlZm9yZS1oaWRlJ2AgbWVzc2FnZXMgYXMgYXBwcm9wcmlhdGUuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2hpZGRlbl1dLCBbW2lzVmlzaWJsZV1dXG4gICAgICovXG4gICAgV2lkZ2V0LmhpZGRlblByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgY2hhbmdlZDogb25IaWRkZW5DaGFuZ2VkLFxuICAgIH0pO1xuICAgIHJldHVybiBXaWRnZXQ7XG59KShwaG9zcGhvcl9ub2Rld3JhcHBlcl8xLk5vZGVXcmFwcGVyKTtcbmV4cG9ydHMuV2lkZ2V0ID0gV2lkZ2V0O1xuLyoqXG4gKiBBdHRhY2ggYSB3aWRnZXQgdG8gYSBob3N0IERPTSBub2RlLlxuICpcbiAqIEBwYXJhbSB3aWRnZXQgLSBUaGUgd2lkZ2V0IHRvIGF0dGFjaCB0byB0aGUgRE9NLlxuICpcbiAqIEBwYXJhbSBob3N0IC0gVGhlIG5vZGUgdG8gdXNlIGFzIHRoZSB3aWRnZXQncyBob3N0LlxuICpcbiAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgd2lkZ2V0IGlzIG5vdCBhIHJvb3Qgd2lkZ2V0LFxuICogICBpZiB0aGUgd2lkZ2V0IGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gdGhlIERPTSwgb3IgaWYgdGhlIGhvc3RcbiAqICAgaXMgbm90IGF0dGFjaGVkIHRvIHRoZSBET00uXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgYW4gYCdhZnRlci1hdHRhY2gnYCBtZXNzYWdlIGlzIGRpc3BhdGNoZWRcbiAqIHRvIHRoZSBoaWVyYXJjaHkuIEl0IHNob3VsZCBiZSB1c2VkIGluIGxpZXUgb2YgbWFudWFsIERPTSBhdHRhY2htZW50LlxuICovXG5mdW5jdGlvbiBhdHRhY2hXaWRnZXQod2lkZ2V0LCBob3N0KSB7XG4gICAgaWYgKHdpZGdldC5wYXJlbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbmx5IGEgcm9vdCB3aWRnZXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00nKTtcbiAgICB9XG4gICAgaWYgKHdpZGdldC5pc0F0dGFjaGVkIHx8IGRvY3VtZW50LmJvZHkuY29udGFpbnMod2lkZ2V0Lm5vZGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignd2lkZ2V0IGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gdGhlIERPTScpO1xuICAgIH1cbiAgICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaG9zdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdob3N0IGlzIG5vdCBhdHRhY2hlZCB0byB0aGUgRE9NJyk7XG4gICAgfVxuICAgIGhvc3QuYXBwZW5kQ2hpbGQod2lkZ2V0Lm5vZGUpO1xuICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHdpZGdldCwgZXhwb3J0cy5NU0dfQUZURVJfQVRUQUNIKTtcbn1cbmV4cG9ydHMuYXR0YWNoV2lkZ2V0ID0gYXR0YWNoV2lkZ2V0O1xuLyoqXG4gKiBEZXRhY2ggYSB3aWRnZXQgZnJvbSBpdHMgaG9zdCBET00gbm9kZS5cbiAqXG4gKiBAcGFyYW0gd2lkZ2V0IC0gVGhlIHdpZGdldCB0byBkZXRhY2ggZnJvbSB0aGUgRE9NLlxuICpcbiAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgd2lkZ2V0IGlzIG5vdCBhIHJvb3Qgd2lkZ2V0LFxuICogICBvciBpZiB0aGUgd2lkZ2V0IGlzIG5vdCBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGEgYCdiZWZvcmUtZGV0YWNoJ2AgbWVzc2FnZSBpcyBkaXNwYXRjaGVkXG4gKiB0byB0aGUgaGllcmFyY2h5LiBJdCBzaG91bGQgYmUgdXNlZCBpbiBsaWV1IG9mIG1hbnVhbCBET00gZGV0YWNobWVudC5cbiAqL1xuZnVuY3Rpb24gZGV0YWNoV2lkZ2V0KHdpZGdldCkge1xuICAgIGlmICh3aWRnZXQucGFyZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignb25seSBhIHJvb3Qgd2lkZ2V0IGNhbiBiZSBkZXRhY2hlZCBmcm9tIHRoZSBET00nKTtcbiAgICB9XG4gICAgaWYgKCF3aWRnZXQuaXNBdHRhY2hlZCB8fCAhZG9jdW1lbnQuYm9keS5jb250YWlucyh3aWRnZXQubm9kZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3aWRnZXQgaXMgbm90IGF0dGFjaGVkIHRvIHRoZSBET00nKTtcbiAgICB9XG4gICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2Uod2lkZ2V0LCBleHBvcnRzLk1TR19CRUZPUkVfREVUQUNIKTtcbiAgICB3aWRnZXQubm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdpZGdldC5ub2RlKTtcbn1cbmV4cG9ydHMuZGV0YWNoV2lkZ2V0ID0gZGV0YWNoV2lkZ2V0O1xuLyoqXG4gKiBBIG1lc3NhZ2UgY2xhc3MgZm9yIGNoaWxkLXJlbGF0ZWQgbWVzc2FnZXMuXG4gKi9cbnZhciBDaGlsZE1lc3NhZ2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDaGlsZE1lc3NhZ2UsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IGNoaWxkIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSBtZXNzYWdlIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGQgLSBUaGUgY2hpbGQgd2lkZ2V0IGZvciB0aGUgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcmV2aW91c0luZGV4IC0gVGhlIHByZXZpb3VzIGluZGV4IG9mIHRoZSBjaGlsZCwgaWYga25vd24uXG4gICAgICogICBUaGUgZGVmYXVsdCBpbmRleCBpcyBgLTFgIGFuZCBpbmRpY2F0ZXMgYW4gdW5rbm93biBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjdXJyZW50SW5kZXggLSBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgY2hpbGQsIGlmIGtub3duLlxuICAgICAqICAgVGhlIGRlZmF1bHQgaW5kZXggaXMgYC0xYCBhbmQgaW5kaWNhdGVzIGFuIHVua25vd24gaW5kZXguXG4gICAgICovXG4gICAgZnVuY3Rpb24gQ2hpbGRNZXNzYWdlKHR5cGUsIGNoaWxkLCBwcmV2aW91c0luZGV4LCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgaWYgKHByZXZpb3VzSW5kZXggPT09IHZvaWQgMCkgeyBwcmV2aW91c0luZGV4ID0gLTE7IH1cbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gdm9pZCAwKSB7IGN1cnJlbnRJbmRleCA9IC0xOyB9XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHR5cGUpO1xuICAgICAgICB0aGlzLl9jaGlsZCA9IGNoaWxkO1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSBjdXJyZW50SW5kZXg7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzSW5kZXggPSBwcmV2aW91c0luZGV4O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2hpbGRNZXNzYWdlLnByb3RvdHlwZSwgXCJjaGlsZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY2hpbGQgd2lkZ2V0IGZvciB0aGUgbWVzc2FnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaGlsZE1lc3NhZ2UucHJvdG90eXBlLCBcImN1cnJlbnRJbmRleFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY3VycmVudCBpbmRleCBvZiB0aGUgY2hpbGQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGJlIGAtMWAgaWYgdGhlIGN1cnJlbnQgaW5kZXggaXMgdW5rbm93bi5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRJbmRleDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENoaWxkTWVzc2FnZS5wcm90b3R5cGUsIFwicHJldmlvdXNJbmRleFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJldmlvdXMgaW5kZXggb2YgdGhlIGNoaWxkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBgLTFgIGlmIHRoZSBwcmV2aW91cyBpbmRleCBpcyB1bmtub3duLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNJbmRleDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIENoaWxkTWVzc2FnZTtcbn0pKHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UpO1xuZXhwb3J0cy5DaGlsZE1lc3NhZ2UgPSBDaGlsZE1lc3NhZ2U7XG4vKipcbiAqIEEgbWVzc2FnZSBjbGFzcyBmb3IgJ3Jlc2l6ZScgbWVzc2FnZXMuXG4gKi9cbnZhciBSZXNpemVNZXNzYWdlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVzaXplTWVzc2FnZSwgX3N1cGVyKTtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSBuZXcgcmVzaXplIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gd2lkdGggLSBUaGUgKipvZmZzZXQgd2lkdGgqKiBvZiB0aGUgd2lkZ2V0LCBvciBgLTFgIGlmXG4gICAgICogICB0aGUgd2lkdGggaXMgbm90IGtub3duLlxuICAgICAqXG4gICAgICogQHBhcmFtIGhlaWdodCAtIFRoZSAqKm9mZnNldCBoZWlnaHQqKiBvZiB0aGUgd2lkZ2V0LCBvciBgLTFgIGlmXG4gICAgICogICB0aGUgaGVpZ2h0IGlzIG5vdCBrbm93bi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZXNpemVNZXNzYWdlKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgJ3Jlc2l6ZScpO1xuICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZXNpemVNZXNzYWdlLnByb3RvdHlwZSwgXCJ3aWR0aFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgb2Zmc2V0IHdpZHRoIG9mIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGJlIGAtMWAgaWYgdGhlIHdpZHRoIGlzIHVua25vd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlc2l6ZU1lc3NhZ2UucHJvdG90eXBlLCBcImhlaWdodFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgb2Zmc2V0IGhlaWdodCBvZiB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBgLTFgIGlmIHRoZSBoZWlnaHQgaXMgdW5rbm93bi5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQSBzaW5nbGV0b24gJ3Jlc2l6ZScgbWVzc2FnZSB3aXRoIGFuIHVua25vd24gc2l6ZS5cbiAgICAgKi9cbiAgICBSZXNpemVNZXNzYWdlLlVua25vd25TaXplID0gbmV3IFJlc2l6ZU1lc3NhZ2UoLTEsIC0xKTtcbiAgICByZXR1cm4gUmVzaXplTWVzc2FnZTtcbn0pKHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UpO1xuZXhwb3J0cy5SZXNpemVNZXNzYWdlID0gUmVzaXplTWVzc2FnZTtcbi8qKlxuICogQW4gZW51bSBvZiB3aWRnZXQgYml0IGZsYWdzLlxuICovXG52YXIgV2lkZ2V0RmxhZztcbihmdW5jdGlvbiAoV2lkZ2V0RmxhZykge1xuICAgIC8qKlxuICAgICAqIFRoZSB3aWRnZXQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICAgKi9cbiAgICBXaWRnZXRGbGFnW1dpZGdldEZsYWdbXCJJc0F0dGFjaGVkXCJdID0gMV0gPSBcIklzQXR0YWNoZWRcIjtcbiAgICAvKipcbiAgICAgKiBUaGUgd2lkZ2V0IGlzIHZpc2libGUuXG4gICAgICovXG4gICAgV2lkZ2V0RmxhZ1tXaWRnZXRGbGFnW1wiSXNWaXNpYmxlXCJdID0gMl0gPSBcIklzVmlzaWJsZVwiO1xuICAgIC8qKlxuICAgICAqIFRoZSB3aWRnZXQgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICovXG4gICAgV2lkZ2V0RmxhZ1tXaWRnZXRGbGFnW1wiSXNEaXNwb3NlZFwiXSA9IDRdID0gXCJJc0Rpc3Bvc2VkXCI7XG59KShXaWRnZXRGbGFnIHx8IChXaWRnZXRGbGFnID0ge30pKTtcbi8qKlxuICogQ3JlYXRlIGEgbmV3IG9mZnNldCByZWN0IGZ1bGwgb2YgTmFOJ3MuXG4gKi9cbmZ1bmN0aW9uIG1ha2VPZmZzZXRSZWN0KCkge1xuICAgIHJldHVybiB7IHRvcDogTmFOLCBsZWZ0OiBOYU4sIHdpZHRoOiBOYU4sIGhlaWdodDogTmFOIH07XG59XG4vKipcbiAqIENsb25lIGFuIG9mZnNldCByZWN0IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVPZmZzZXRSZWN0KHJlY3QpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHJlY3QudG9wLFxuICAgICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gICAgfTtcbn1cbi8qKlxuICogR2V0IHRoZSBvZmZzZXQgcmVjdCBmb3IgYSBET00gbm9kZS5cbiAqL1xuZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdChub2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBub2RlLm9mZnNldFRvcCxcbiAgICAgICAgbGVmdDogbm9kZS5vZmZzZXRMZWZ0LFxuICAgICAgICB3aWR0aDogbm9kZS5vZmZzZXRXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBub2RlLm9mZnNldEhlaWdodCxcbiAgICB9O1xufVxuLyoqXG4gKiBUaGUgY2hhbmdlIGhhbmRsZXIgZm9yIHRoZSBbW2hpZGRlblByb3BlcnR5XV0uXG4gKi9cbmZ1bmN0aW9uIG9uSGlkZGVuQ2hhbmdlZChvd25lciwgb2xkLCBoaWRkZW4pIHtcbiAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgIGlmIChvd25lci5pc0F0dGFjaGVkICYmICghb3duZXIucGFyZW50IHx8IG93bmVyLnBhcmVudC5pc1Zpc2libGUpKSB7XG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShvd25lciwgZXhwb3J0cy5NU0dfQkVGT1JFX0hJREUpO1xuICAgICAgICB9XG4gICAgICAgIG93bmVyLmFkZENsYXNzKGV4cG9ydHMuSElEREVOX0NMQVNTKTtcbiAgICAgICAgaWYgKG93bmVyLnBhcmVudCkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2Uob3duZXIucGFyZW50LCBuZXcgQ2hpbGRNZXNzYWdlKCdjaGlsZC1oaWRkZW4nLCBvd25lcikpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvd25lci5yZW1vdmVDbGFzcyhleHBvcnRzLkhJRERFTl9DTEFTUyk7XG4gICAgICAgIGlmIChvd25lci5pc0F0dGFjaGVkICYmICghb3duZXIucGFyZW50IHx8IG93bmVyLnBhcmVudC5pc1Zpc2libGUpKSB7XG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShvd25lciwgZXhwb3J0cy5NU0dfQUZURVJfU0hPVyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG93bmVyLnBhcmVudCkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2Uob3duZXIucGFyZW50LCBuZXcgQ2hpbGRNZXNzYWdlKCdjaGlsZC1zaG93bicsIG93bmVyKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIFNlbmQgYSBtZXNzYWdlIHRvIGFsbCB3aWRnZXRzIGluIGFuIGFycmF5LlxuICovXG5mdW5jdGlvbiBzZW5kVG9BbGwoYXJyYXksIG1zZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UoYXJyYXlbaV0sIG1zZyk7XG4gICAgfVxufVxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSB0byBhbGwgbm9uLWhpZGRlbiB3aWRnZXRzIGluIGFuIGFycmF5LlxuICovXG5mdW5jdGlvbiBzZW5kVG9TaG93bihhcnJheSwgbXNnKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoIWFycmF5W2ldLmhpZGRlbilcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKGFycmF5W2ldLCBtc2cpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGNyZWF0aW5nIG9iamVjdHMgd2hpY2ggd3JhcCBhIERPTSBub2RlLlxuICovXG52YXIgTm9kZVdyYXBwZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vZGVXcmFwcGVyKCkge1xuICAgICAgICB0aGlzLl9ub2RlID0gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVOb2RlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0aGUgRE9NIG5vZGUgZm9yIGEgbmV3IG5vZGUgd3JhcHBlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBET00gbm9kZSB0byB1c2Ugd2l0aCB0aGUgbm9kZSB3cmFwcGVyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGNyZWF0ZXMgYW4gZW1wdHkgYDxkaXY+YC5cbiAgICAgKlxuICAgICAqIFRoaXMgbWF5IGJlIHJlaW1wbGVtZW50ZWQgYnkgYSBzdWJjbGFzcyB0byBjcmVhdGUgYSBjdXN0b20gbm9kZS5cbiAgICAgKi9cbiAgICBOb2RlV3JhcHBlci5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZVdyYXBwZXIucHJvdG90eXBlLCBcIm5vZGVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBET00gbm9kZSBtYW5hZ2VkIGJ5IHRoZSB3cmFwcGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgcHJvcGVydHkgaXMgcmVhZC1vbmx5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbm9kZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGVXcmFwcGVyLnByb3RvdHlwZSwgXCJpZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGlkIG9mIHRoZSB3cmFwcGVyJ3MgRE9NIG5vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ub2RlLmlkO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBpZCBvZiB0aGUgd3JhcHBlcidzIERPTSBub2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX25vZGUuaWQgPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGVzdCB3aGV0aGVyIHRoZSB3cmFwcGVyJ3MgRE9NIG5vZGUgaGFzIHRoZSBnaXZlbiBjbGFzcyBuYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgLSBUaGUgY2xhc3MgbmFtZSBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbm9kZSBoYXMgdGhlIGNsYXNzLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBOb2RlV3JhcHBlci5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgYSBjbGFzcyBuYW1lIHRvIHRoZSB3cmFwcGVyJ3MgRE9NIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBjbGFzcyBuYW1lIHRvIGFkZCB0byB0aGUgbm9kZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJZiB0aGUgY2xhc3MgbmFtZSBpcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBub2RlLCB0aGlzIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgTm9kZVdyYXBwZXIucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fbm9kZS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY2xhc3MgbmFtZSBmcm9tIHRoZSB3cmFwcGVyJ3MgRE9NIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBjbGFzcyBuYW1lIHRvIHJlbW92ZSBmcm9tIHRoZSBub2RlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIElmIHRoZSBjbGFzcyBuYW1lIGlzIG5vdCB5ZXQgYWRkZWQgdG8gdGhlIG5vZGUsIHRoaXMgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBOb2RlV3JhcHBlci5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB0aGlzLl9ub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUb2dnbGUgYSBjbGFzcyBuYW1lIG9uIHRoZSB3cmFwcGVyJ3MgRE9NIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBjbGFzcyBuYW1lIHRvIHRvZ2dsZSBvbiB0aGUgbm9kZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZSAtIFdoZXRoZXIgdG8gZm9yY2UgYWRkIHRoZSBjbGFzcyAoYHRydWVgKSBvciBmb3JjZVxuICAgICAqICAgcmVtb3ZlIHRoZSBjbGFzcyAoYGZhbHNlYCkuIElmIG5vdCBwcm92aWRlZCwgdGhlIHByZXNlbmNlIG9mXG4gICAgICogICB0aGUgY2xhc3Mgd2lsbCBiZSB0b2dnbGVkIGZyb20gaXRzIGN1cnJlbnQgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGNsYXNzIGlzIG5vdyBwcmVzZW50LCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBOb2RlV3JhcHBlci5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiAobmFtZSwgZm9yY2UpIHtcbiAgICAgICAgdmFyIHByZXNlbnQ7XG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcyhuYW1lKTtcbiAgICAgICAgICAgIHByZXNlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZvcmNlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcyhuYW1lKTtcbiAgICAgICAgICAgIHByZXNlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmhhc0NsYXNzKG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKG5hbWUpO1xuICAgICAgICAgICAgcHJlc2VudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcyhuYW1lKTtcbiAgICAgICAgICAgIHByZXNlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVzZW50O1xuICAgIH07XG4gICAgcmV0dXJuIE5vZGVXcmFwcGVyO1xufSkoKTtcbmV4cG9ydHMuTm9kZVdyYXBwZXIgPSBOb2RlV3JhcHBlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdfQ==
