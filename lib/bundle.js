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
var phosphor_signaling_1 = require('phosphor-signaling');
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
    HTMLSpreadsheetViewModel.valueChangedSignal = new phosphor_signaling_1.Signal();
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
}
window.onload = main;

},{"phosphor-menus":8,"phosphor-messaging":13,"phosphor-signaling":16,"phosphor-widget":18}],2:[function(require,module,exports){
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
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\nbody.p-mod-override-cursor * {\n  cursor: inherit !important;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules/phosphor-domutil/lib/index.css"})); module.exports = css;
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
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-Menu {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 3px 0px;\n  white-space: nowrap;\n  overflow-x: hidden;\n  overflow-y: auto;\n  z-index: 100000;\n}\n.p-Menu-content {\n  display: table;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  border-spacing: 0;\n}\n.p-Menu-item {\n  display: table-row;\n}\n.p-Menu-item.p-mod-hidden,\n.p-Menu-item.p-mod-force-hidden {\n  display: none;\n}\n.p-Menu-item > span {\n  display: table-cell;\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n.p-Menu-item-icon {\n  width: 21px;\n  padding-left: 2px;\n  padding-right: 2px;\n  text-align: center;\n}\n.p-Menu-item-text {\n  padding-left: 2px;\n  padding-right: 35px;\n}\n.p-Menu-item-shortcut {\n  text-align: right;\n}\n.p-Menu-item-submenu-icon {\n  width: 16px;\n  text-align: center;\n}\n.p-Menu-item.p-mod-separator-type > span {\n  padding: 0;\n  height: 9px;\n  line-height: 0;\n  text-indent: 100%;\n  overflow: hidden;\n  whitespace: nowrap;\n  vertical-align: top;\n  /* https://bugzilla.mozilla.org/show_bug.cgi?id=634489 */\n}\n.p-Menu-item.p-mod-separator-type > span::after {\n  content: '';\n  display: block;\n  position: relative;\n  top: 4px;\n}\n.p-MenuBar-content {\n  display: flex;\n  flex-direction: row;\n}\n.p-MenuBar-item {\n  box-sizing: border-box;\n}\n.p-MenuBar-item.p-mod-hidden,\n.p-MenuBar-item.p-mod-force-hidden {\n  display: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules/phosphor-menus/lib/index.css"})); module.exports = css;
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
var css = "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-Widget {\n  box-sizing: border-box;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  overflow: hidden;\n  cursor: default;\n}\n.p-Widget.p-mod-hidden {\n  display: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "node_modules/phosphor-widget/lib/index.css"})); module.exports = css;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvc3ByZWFkc2hlZXQuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS1jc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1hcnJheXMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLWRpc3Bvc2FibGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLWRvbXV0aWwvbGliL2luZGV4LmNzcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1kb211dGlsL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvaW5kZXguY3NzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLW1lbnVzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudS5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudWJhci5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvbWVudWJhc2UuanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItbWVudXMvbGliL21lbnVpdGVtLmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLW1lc3NhZ2luZy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItcHJvcGVydGllcy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3ItcXVldWUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Bob3NwaG9yLXNpZ25hbGluZy9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGhvc3Bob3Itd2lkZ2V0L2xpYi9pbmRleC5jc3MiLCJub2RlX21vZHVsZXMvcGhvc3Bob3Itd2lkZ2V0L2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9waG9zcGhvci13aWRnZXQvbm9kZV9tb2R1bGVzL3Bob3NwaG9yLW5vZGV3cmFwcGVyL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcitCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2owQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9YQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25iQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBwaG9zcGhvcl9tZXNzYWdpbmdfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLW1lc3NhZ2luZycpO1xudmFyIHBob3NwaG9yX21lbnVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1tZW51cycpO1xudmFyIHBob3NwaG9yX3dpZGdldF8xID0gcmVxdWlyZSgncGhvc3Bob3Itd2lkZ2V0Jyk7XG52YXIgcGhvc3Bob3Jfc2lnbmFsaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1zaWduYWxpbmcnKTtcbmZ1bmN0aW9uIGdldENlbGxYKGNlbGwpIHtcbiAgICByZXR1cm4gY2VsbC5jZWxsSW5kZXggLSAxO1xufVxuZnVuY3Rpb24gZ2V0Q2VsbFkoY2VsbCkge1xuICAgIHJldHVybiBjZWxsLnBhcmVudEVsZW1lbnQucm93SW5kZXggLSAxO1xufVxudmFyIENlbGxDaGFuZ2VNZXNzYWdlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2VsbENoYW5nZU1lc3NhZ2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2VsbENoYW5nZU1lc3NhZ2UoY2VsbFgsIGNlbGxZKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIFwiY2VsbGNoYW5nZWRcIik7XG4gICAgICAgIHRoaXMuX2NlbGxYID0gY2VsbFg7XG4gICAgICAgIHRoaXMuX2NlbGxZID0gY2VsbFk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDZWxsQ2hhbmdlTWVzc2FnZS5wcm90b3R5cGUsIFwiY2VsbFhcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZWxsWDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENlbGxDaGFuZ2VNZXNzYWdlLnByb3RvdHlwZSwgXCJjZWxsWVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxZO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gQ2VsbENoYW5nZU1lc3NhZ2U7XG59KShwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKTtcbnZhciBNdXRhYmxlTnVtYmVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNdXRhYmxlTnVtYmVyKHZhbCkge1xuICAgICAgICB0aGlzLnZhbCA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIE11dGFibGVOdW1iZXI7XG59KSgpO1xudmFyIE1TR19PTl9GT0NVUyA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKFwiZm9jdXNjaGFuZ2VkXCIpO1xudmFyIE1TR19PTl9TRUxFQ1RJT04gPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZShcInNlbGVjdGlvbmNoYW5nZWRcIik7XG52YXIgTVNHX09OX0JFR0lOX0VESVQgPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZShcImJlZ2luZWRpdHNcIik7XG52YXIgSFRNTExhYmVsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIVE1MTGFiZWwodmFsLCBpc0NvbCwgbmV3Q2VsbCkge1xuICAgICAgICB0aGlzLnZhbCA9IHZhbDtcbiAgICAgICAgdGhpcy5pc0NvbCA9IGlzQ29sO1xuICAgICAgICB0aGlzLmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG5ld0NlbGwuYXBwZW5kQ2hpbGQodGhpcy5kaXYpO1xuICAgICAgICB0aGlzLmRpdi5pbm5lckhUTUwgPSB0aGlzLnZhbC50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiwgXCJsYWJlbFwiKTtcbiAgICAgICAgdGhpcy5kaXYuc2V0QXR0cmlidXRlKFwiZGF0YS1jb2xcIiwgaXNDb2wudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuZGl2LnNldEF0dHJpYnV0ZShcImRhdGEtbnVtXCIsIHZhbC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIEhUTUxMYWJlbDtcbn0pKCk7XG52YXIgU3ByZWFkc2hlZXRFdmVudE9iamVjdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ByZWFkc2hlZXRFdmVudE9iamVjdCgpIHtcbiAgICB9XG4gICAgcmV0dXJuIFNwcmVhZHNoZWV0RXZlbnRPYmplY3Q7XG59KSgpO1xudmFyIEhUTUxDZWxsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBIVE1MQ2VsbChwYXJlbnQsIG11dGFibGVSb3csIG11dGFibGVDb2wpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kaXYuc2V0QXR0cmlidXRlKFwiY29udGVudGVkaXRhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgIHRoaXMuZGl2LmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIiwgXCJjZWxsXCIpO1xuICAgICAgICB0aGlzLl9yb3cgPSBtdXRhYmxlUm93O1xuICAgICAgICB0aGlzLl9jb2wgPSBtdXRhYmxlQ29sO1xuICAgICAgICB0aGlzLnJvdyA9IG11dGFibGVSb3cudmFsO1xuICAgICAgICB0aGlzLmNvbCA9IG11dGFibGVDb2wudmFsO1xuICAgICAgICB0aGlzLmRpc3BsYXlWYWwgPSBwYXJlbnQubXYubW9kZWwuY2VsbFZhbHNbdGhpcy5jb2xdW3RoaXMucm93XTtcbiAgICB9XG4gICAgSFRNTENlbGwucHJvdG90eXBlLnNldERpc3BsYXlWYWwgPSBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheVZhbCA9IG5ld1ZhbDtcbiAgICB9O1xuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5nZXREaXNwbGF5VmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzcGxheVZhbDtcbiAgICB9O1xuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5zZXRDb2wgPSBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgIHRoaXMuY29sID0gbmV3VmFsO1xuICAgIH07XG4gICAgSFRNTENlbGwucHJvdG90eXBlLmdldENvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sO1xuICAgIH07XG4gICAgSFRNTENlbGwucHJvdG90eXBlLnNldFJvdyA9IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgdGhpcy5yb3cgPSBuZXdWYWw7XG4gICAgfTtcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuZ2V0Um93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3c7XG4gICAgfTtcbiAgICBIVE1MQ2VsbC5wcm90b3R5cGUuYmVnaW5FZGl0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaXYuc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgdGhpcy5kaXYuZm9jdXMoKTtcbiAgICB9O1xuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5maW5pc2hFZGl0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaXYuc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICAgIHRoaXMucGFyZW50Lm12Lm1vZGVsLmNlbGxWYWxzW3RoaXMuY29sXVt0aGlzLnJvd10gPSB0aGlzLmRpdi5pbm5lckhUTUwudG9TdHJpbmcoKTtcbiAgICB9O1xuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmRpdi5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLmRpdi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWR0ZFwiKTtcbiAgICB9O1xuICAgIEhUTUxDZWxsLnByb3RvdHlwZS5kZXNlbGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZGl2LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZHRkXCIpO1xuICAgIH07XG4gICAgSFRNTENlbGwucHJvdG90eXBlLnN0YXJ0Rm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXJlbnRFbGVtZW50ID0gdGhpcy5kaXYucGFyZW50RWxlbWVudDtcbiAgICAgICAgcGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNlZHRkXCIpO1xuICAgIH07XG4gICAgSFRNTENlbGwucHJvdG90eXBlLmVuZEZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZpbmlzaEVkaXRzKCk7XG4gICAgICAgIHZhciBwYXJlbnRFbGVtZW50ID0gdGhpcy5kaXYucGFyZW50RWxlbWVudDtcbiAgICAgICAgcGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNlZHRkXCIpO1xuICAgIH07XG4gICAgSFRNTENlbGwucHJvdG90eXBlLmdldEhUTUxFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXY7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENlbGwucHJvdG90eXBlLCBcImRpc3BsYXlWYWxcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXNwbGF5VmFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlWYWwgPSBuZXdWYWw7XG4gICAgICAgICAgICB0aGlzLmRpdi5pbm5lckhUTUwgPSBuZXdWYWw7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIVE1MQ2VsbC5wcm90b3R5cGUsIFwiY29sXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sLnZhbDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2wudmFsID0gbmV3VmFsO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENlbGwucHJvdG90eXBlLCBcInJvd1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvdy52YWw7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICAgICAgdGhpcy5fcm93LnZhbCA9IG5ld1ZhbDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIEhUTUxDZWxsO1xufSkoKTtcbnZhciBIVE1MU3ByZWFkc2hlZXRNb2RlbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSFRNTFNwcmVhZHNoZWV0TW9kZWwod2lkdGgsIGhlaWdodCkge1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLmNlbGxWYWxzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jZWxsVmFsc1tpXSA9IG5ldyBBcnJheSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbFZhbHNbaV1bal0gPSBpICsgXCIgXCIgKyBqO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIEhUTUxTcHJlYWRzaGVldE1vZGVsLnByb3RvdHlwZS5wcm9jZXNzTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2cpIHsgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRNb2RlbC5wcm90b3R5cGUuZ2V0Q2VsbCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxWYWxzW3hdW3ldO1xuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLnNldENlbGwgPSBmdW5jdGlvbiAoeCwgeSwgbmV3Q2VsbCkge1xuICAgICAgICB0aGlzLmNlbGxWYWxzW3hdW3ldID0gbmV3Q2VsbDtcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2VsbGNoYW5nZWRcIiwgeyBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICBjZWxseDogeCxcbiAgICAgICAgICAgICAgICBjZWxseTogeSxcbiAgICAgICAgICAgIH0gfSk7XG4gICAgICAgIGRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB2YXIgbXNnID0gbmV3IENlbGxDaGFuZ2VNZXNzYWdlKHgsIHkpO1xuICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZSh0aGlzLCBtc2cpO1xuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLmluc2VydENvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcbiAgICAgICAgdGhpcy5jZWxsVmFscy5zcGxpY2UoY29sTnVtLCAwLCBuZXcgQXJyYXkoKSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jZWxsVmFsc1tjb2xOdW1dW2ldID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndpZHRoKys7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRNb2RlbC5wcm90b3R5cGUuZGVsZXRlQ29sID0gZnVuY3Rpb24gKGNvbE51bSkge1xuICAgICAgICB0aGlzLmNlbGxWYWxzLnNwbGljZShjb2xOdW0sIDEpO1xuICAgICAgICB0aGlzLndpZHRoLS07XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRNb2RlbC5wcm90b3R5cGUuaW5zZXJ0Um93ID0gZnVuY3Rpb24gKHJvd051bSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jZWxsVmFsc1tpXS5zcGxpY2Uocm93TnVtLCAwLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlaWdodCsrO1xuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0TW9kZWwucHJvdG90eXBlLmRlbGV0ZVJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2VsbFZhbHNbaV0uc3BsaWNlKHJvd051bSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oZWlnaHQtLTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldE1vZGVsLnByb3RvdHlwZS5jbGVhckNlbGwgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB0aGlzLnNldENlbGwoeCwgeSwgXCJcIik7XG4gICAgfTtcbiAgICByZXR1cm4gSFRNTFNwcmVhZHNoZWV0TW9kZWw7XG59KSgpO1xudmFyIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsKG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5taW5YID0gMDtcbiAgICAgICAgdGhpcy5tYXhYID0gMDtcbiAgICAgICAgdGhpcy5taW5ZID0gMDtcbiAgICAgICAgdGhpcy5tYXhZID0gMDtcbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxscyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGVsLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxsc1tpXSA9IG5ldyBBcnJheSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtb2RlbC5oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxsc1tpXVtqXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb3VibGVDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXRbXCJ0eXBlXCJdID09IFwiY2VsbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvdWJsZWNsaWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5iZWdpbkVkaXRzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vdXNlQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGRpdi5kYXRhc2V0W1widHlwZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBcImNlbGxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsWDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbFk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbFggPSBnZXRDZWxsWChkaXYucGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbFkgPSBnZXRDZWxsWShkaXYucGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNsZWFyU2VsZWN0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvY3VzQ2VsbChjZWxsWCwgY2VsbFkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3VzZVNlbGVjdFJhbmdlKGNlbGxYLCBjZWxsWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwibGFiZWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW0gPSBwYXJzZUludChkaXYuZGF0YXNldFtcIm51bVwiXSkgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXYuZGF0YXNldFtcImNvbFwiXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvY3VzQ2VsbChudW0sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5YID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhYID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WSA9IHRoYXQubW9kZWwuaGVpZ2h0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0QXJlYSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5YID0gTWF0aC5taW4obnVtLCB0aGF0LmZvY3VzZWRDZWxsWCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFggPSBNYXRoLm1heChudW0sIHRoYXQuZm9jdXNlZENlbGxYKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFkgPSB0aGF0Lm1vZGVsLmhlaWdodCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZvY3VzQ2VsbCgwLCBudW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5YID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WCA9IHRoYXQubW9kZWwud2lkdGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5taW5ZID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhZID0gbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RBcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1pblggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXhYID0gdGhhdC5tb2RlbC53aWR0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1pblkgPSBNYXRoLm1pbihudW0sIHRoYXQuZm9jdXNlZENlbGxZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WSA9IE1hdGgubWF4KG51bSwgdGhhdC5mb2N1c2VkQ2VsbFkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RBcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vdXNlVXA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW91c2UgdXBcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtb3VzZU1vdmVkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvL0ZJWCBNRSwgSSBXSUxMIEJSRUFLIFdIRU4gTk9UIE9WRVIgQSBESVYhXG4gICAgICAgICAgICAgICAgICAgIHZhciBjZWxsWDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxZO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQubm9kZU5hbWUgPT0gXCJESVZcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbFggPSBnZXRDZWxsWChlLnRhcmdldC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxZID0gZ2V0Q2VsbFkoZS50YXJnZXQucGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5tb3VzZURvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdXNlU2VsZWN0UmFuZ2UoY2VsbFgsIGNlbGxZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29weTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGF0Lm1pblk7IGkgPD0gdGhhdC5tYXhZOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSB0aGF0Lm1pblg7IGogPD0gdGhhdC5tYXhYOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyB0aGF0Lm1vZGVsLmNlbGxWYWxzW2pdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqIDwgdGhhdC5tYXhYKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArICdcXHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgdGhhdC5tYXhZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyICsgJ1xcclxcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZS5jbGlwYm9hcmREYXRhLnNldERhdGEoJ3RleHQvcGxhaW4nLCBzdHIpO1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXN0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0LmVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY2xlYXJTZWxlY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBlLmNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHQvcGxhaW5cIikuc3BsaXQoXCJcXHJcXG5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4VyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gbGluZXNbaV0uc3BsaXQoXCJcXHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGxzLmxlbmd0aCA+IG1heFcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4VyA9IGNlbGxzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gbGluZXNbaV0uc3BsaXQoXCJcXHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXhXOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWluWCArIGogPD0gdGhhdC5tb2RlbC53aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhhdC5taW5ZICsgaSA8PSB0aGF0Lm1vZGVsLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjZWxsc1tqXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vZGVsLnNldENlbGwodGhhdC5taW5YICsgaiwgdGhhdC5taW5ZICsgaSwgY2VsbHNbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb2RlbC5zZXRDZWxsKHRoYXQubWluWCArIGosIHRoYXQubWluWSArIGksIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBrZXlQcmVzc2VkOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKHRydWUsIDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZSh0cnVlLCAwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuZWRpdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OiAvL2JhY2tzcGFjZS9kZWxldGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJiYWNrc3BhY2UgcHJlc3NlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQuZWRpdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdCBjdXJyZW50bHkgZWRpdGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhhdC5zZWxlY3RlZENlbGxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhhdC5taW5YOyBpIDw9IHRoYXQubWF4WDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gdGhhdC5taW5ZOyBqIDw9IHRoYXQubWF4WTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbGVhckNlbGwoaSwgaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKGZhbHNlLCAtMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXhYID4gdGhhdC5mb2N1c2VkQ2VsbFgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXAgYXJyb3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKGZhbHNlLCAwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXhZID4gdGhhdC5mb2N1c2VkQ2VsbFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKGZhbHNlLCAxLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblggPCB0aGF0LmZvY3VzZWRDZWxsWCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0QXJlYSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWF4WCA8IHRoYXQubW9kZWwud2lkdGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWF4WCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZlKGZhbHNlLCAwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1pblkgPCB0aGF0LmZvY3VzZWRDZWxsWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubWluWSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0QXJlYSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWF4WSA8IHRoYXQubW9kZWwuaGVpZ2h0IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1heFkrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RBcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy9jaGVjayBmb2N1cyBvbiB0aGlzIG9uZS4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubW92ZSh0cnVlLCAtMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmUodHJ1ZSwgMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQuZWRpdGluZyAmJiBlLmtleUNvZGUgPj0gMzIgJiYgZS5rZXlDb2RlICE9IDEyN1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAhZS5hbHRLZXkgJiYgIWUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLmtleUNvZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNsZWFyQ2VsbCh0aGF0LmZvY3VzZWRDZWxsWCwgdGhhdC5mb2N1c2VkQ2VsbFkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmJlZ2luRWRpdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZXZlbnRHcmFiYmVyID0gdGhpcy5ldmVudE1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgU3ByZWFkc2hlZXRFdmVudE9iamVjdCgpO1xuICAgICAgICB0aGlzLmV2ZW50cy5tb3VzZWRvd24gPSBldmVudEdyYWJiZXIubW91c2VDbGljayxcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm1vdXNldXAgPSBldmVudEdyYWJiZXIubW91c2VVcCxcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm1vdXNlbW92ZSA9IGV2ZW50R3JhYmJlci5tb3VzZU1vdmVkLFxuICAgICAgICAgICAgdGhpcy5ldmVudHMuZG91YmxlY2xpY2sgPSBldmVudEdyYWJiZXIuZG91YmxlQ2xpY2ssXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5rZXlwcmVzc2VkID0gZXZlbnRHcmFiYmVyLmtleVByZXNzZWQsXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5jb3B5ID0gZXZlbnRHcmFiYmVyLmNvcHksXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5wYXN0ZSA9IGV2ZW50R3JhYmJlci5wYXN0ZTtcbiAgICB9XG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5pbnNlcnRSb3cgPSBmdW5jdGlvbiAocm93TnVtKSB7XG4gICAgICAgIHRoaXMubWluWCA9IDA7XG4gICAgICAgIHRoaXMubWF4WCA9IHRoaXMubW9kZWwud2lkdGggLSAxO1xuICAgICAgICB0aGlzLm1pblkgPSByb3dOdW07XG4gICAgICAgIHRoaXMubWF4WSA9IHJvd051bTtcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XG4gICAgICAgIHRoaXMubW9kZWwuaW5zZXJ0Um93KHJvd051bSk7XG4gICAgICAgIHRoaXMuZm9jdXNDZWxsKDAsIHJvd051bSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmluc2VydENvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcbiAgICAgICAgdGhpcy5taW5ZID0gMDtcbiAgICAgICAgdGhpcy5tYXhZID0gdGhpcy5tb2RlbC5oZWlnaHQgLSAxO1xuICAgICAgICB0aGlzLm1pblggPSBjb2xOdW07XG4gICAgICAgIHRoaXMubWF4WCA9IGNvbE51bTtcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XG4gICAgICAgIHRoaXMuZm9jdXNDZWxsKGNvbE51bSwgMCk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmRlbGV0ZVJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcbiAgICAgICAgdGhpcy5taW5YID0gMDtcbiAgICAgICAgdGhpcy5tYXhYID0gdGhpcy5tb2RlbC53aWR0aCAtIDE7XG4gICAgICAgIHRoaXMubWluWSA9IHJvd051bTtcbiAgICAgICAgdGhpcy5tYXhZID0gcm93TnVtO1xuICAgICAgICB0aGlzLnNlbGVjdEFyZWEoKTtcbiAgICAgICAgdGhpcy5mb2N1c0NlbGwoMCwgcm93TnVtKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuZGVsZXRlQ29sID0gZnVuY3Rpb24gKGNvbE51bSkge1xuICAgICAgICB0aGlzLm1pblkgPSAwO1xuICAgICAgICB0aGlzLm1heFkgPSB0aGlzLm1vZGVsLmhlaWdodCAtIDE7XG4gICAgICAgIHRoaXMubWluWCA9IGNvbE51bTtcbiAgICAgICAgdGhpcy5tYXhYID0gY29sTnVtO1xuICAgICAgICB0aGlzLnNlbGVjdEFyZWEoKTtcbiAgICAgICAgdGhpcy5mb2N1c0NlbGwoY29sTnVtLCAwKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uIChza2lwQ2hlY2ssIHhBbW91bnQsIHlBbW91bnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNlZENlbGxYICsgeEFtb3VudCA+PSAwICYmXG4gICAgICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWCArIHhBbW91bnQgPCB0aGlzLm1vZGVsLndpZHRoICYmXG4gICAgICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWSArIHlBbW91bnQgPj0gMCAmJlxuICAgICAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbFkgKyB5QW1vdW50IDwgdGhpcy5tb2RlbC5oZWlnaHQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5lZGl0aW5nIHx8IHNraXBDaGVjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNlZENlbGxYICs9IHhBbW91bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbFkgKz0geUFtb3VudDtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNDZWxsKHRoaXMuZm9jdXNlZENlbGxYLCB0aGlzLmZvY3VzZWRDZWxsWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUubW91c2VDbGlja2VkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNlbGxYO1xuICAgICAgICB2YXIgY2VsbFk7XG4gICAgICAgIGNlbGxYID0gZ2V0Q2VsbFgoZS50YXJnZXQucGFyZW50RWxlbWVudCk7XG4gICAgICAgIGNlbGxZID0gZ2V0Q2VsbFkoZS50YXJnZXQucGFyZW50RWxlbWVudCk7XG4gICAgICAgIGlmICh0eXBlb2YgY2VsbFggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNDZWxsKGNlbGxYLCBjZWxsWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlU2VsZWN0UmFuZ2UoY2VsbFgsIGNlbGxZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5jbGVhclNlbGVjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRDZWxscyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubW9kZWwud2lkdGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRlZENlbGxzW2ldID0gbmV3IEFycmF5KCk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubW9kZWwuaGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQ2VsbHNbaV1bal0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5mb2N1c0NlbGwgPSBmdW5jdGlvbiAoY2VsbFgsIGNlbGxZKSB7XG4gICAgICAgIHRoaXMubWluWCA9IGNlbGxYO1xuICAgICAgICB0aGlzLm1heFggPSBjZWxsWDtcbiAgICAgICAgdGhpcy5taW5ZID0gY2VsbFk7XG4gICAgICAgIHRoaXMubWF4WSA9IGNlbGxZO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluIGZvY3VzQ2VsbFwiKTtcbiAgICAgICAgLy9jZWxsLmZvY3VzKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGNlbGxYKTtcbiAgICAgICAgY29uc29sZS5sb2coY2VsbFkpO1xuICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWCA9IGNlbGxYO1xuICAgICAgICB0aGlzLmZvY3VzZWRDZWxsWSA9IGNlbGxZO1xuICAgICAgICB0aGlzLmZvY3VzQ2hhbmdlZCgpO1xuICAgICAgICAvL2lmIG5vdCBzZWxlY3RlZD8/IHRoZW5cbiAgICAgICAgdGhpcy5zZWxlY3QoY2VsbFgsIGNlbGxZKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuY2xlYXJDZWxsID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdGhpcy5tb2RlbC5jbGVhckNlbGwoeCwgeSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChjZWxsWCwgY2VsbFkpIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZENlbGxzW2NlbGxYXVtjZWxsWV0gPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZWQoKTtcbiAgICAgICAgLy9USFJPVyBCQUNLIFNFTEVDVElPTiBDSEFOR0VEIEVWRU5UXG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLm1vdXNlU2VsZWN0UmFuZ2UgPSBmdW5jdGlvbiAoY2VsbFgsIGNlbGxZKSB7XG4gICAgICAgIGlmIChjZWxsWCA9PSB0aGlzLmZvY3VzZWRDZWxsWCAmJiBjZWxsWSA9PSB0aGlzLmZvY3VzZWRDZWxsWSkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5taW5YID0gTWF0aC5taW4oY2VsbFgsIHRoaXMuZm9jdXNlZENlbGxYKTtcbiAgICAgICAgdGhpcy5tYXhYID0gTWF0aC5tYXgoY2VsbFgsIHRoaXMuZm9jdXNlZENlbGxYKTtcbiAgICAgICAgdGhpcy5taW5ZID0gTWF0aC5taW4oY2VsbFksIHRoaXMuZm9jdXNlZENlbGxZKTtcbiAgICAgICAgdGhpcy5tYXhZID0gTWF0aC5tYXgoY2VsbFksIHRoaXMuZm9jdXNlZENlbGxZKTtcbiAgICAgICAgdGhpcy5zZWxlY3RBcmVhKCk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLnNlbGVjdEFyZWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb25zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLm1pblg7IGkgPD0gdGhpcy5tYXhYOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSB0aGlzLm1pblk7IGogPD0gdGhpcy5tYXhZOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodGVkQ2VsbHNbaV1bal0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IC8vUFVTSCBCQUNLIFNFTEVDVElPTiBDSEFOR0VcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VkKCk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwucHJvdG90eXBlLmZvY3VzQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZm9jdXNjaGFuZ2VkXCIpO1xuICAgICAgICBkaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgTVNHX09OX0ZPQ1VTKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUuc2VsZWN0aW9uQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwic2VsZWN0aW9uY2hhbmdlZFwiKTtcbiAgICAgICAgZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIE1TR19PTl9TRUxFQ1RJT04pO1xuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsLnByb3RvdHlwZS5iZWdpbkVkaXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhcImVkaXRzID0gdHJ1ZVwiKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiYmVnaW5lZGl0c1wiKTtcbiAgICAgICAgZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIE1TR19PTl9CRUdJTl9FRElUKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXdNb2RlbC5wcm90b3R5cGUucHJvY2Vzc01lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibXZcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWwudmFsdWVDaGFuZ2VkU2lnbmFsID0gbmV3IHBob3NwaG9yX3NpZ25hbGluZ18xLlNpZ25hbCgpO1xuICAgIHJldHVybiBIVE1MU3ByZWFkc2hlZXRWaWV3TW9kZWw7XG59KSgpO1xudmFyIEhUTUxTcHJlYWRzaGVldFZpZXcgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhIVE1MU3ByZWFkc2hlZXRWaWV3LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEhUTUxTcHJlYWRzaGVldFZpZXcobW9kZWxWaWV3KSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLm12ID0gbW9kZWxWaWV3O1xuICAgICAgICB0aGlzLnRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgICAgICB0aGlzLnRhYmxlLmNsYXNzTGlzdC5hZGQoXCJzcHJlYWRzaGVldFwiKTtcbiAgICAgICAgdGhpcy5tdXRhYmxlQ29sVmFscyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLm11dGFibGVSb3dWYWxzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHRoaXMuY2VsbHMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm11dGFibGVSb3dWYWxzW2ldID0gbmV3IE11dGFibGVOdW1iZXIoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubXV0YWJsZUNvbFZhbHNbaV0gPSBuZXcgTXV0YWJsZU51bWJlcihpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLmluc2VydFJvdygpO1xuICAgICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpIC0gMV0gPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8PSB0aGlzLm12Lm1vZGVsLndpZHRoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGogPiAwICYmIGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaSAtIDFdW2ogLSAxXSA9IG5ldyBIVE1MQ2VsbCh0aGlzLCB0aGlzLm11dGFibGVSb3dWYWxzW2kgLSAxXSwgdGhpcy5tdXRhYmxlQ29sVmFsc1tqIC0gMV0pOyAvL2ZpbGwgaW4gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hDZWxsKHRoaXMuY2VsbHNbaSAtIDFdW2ogLSAxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29sdW1uTGFiZWxzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHRoaXMucm93TGFiZWxzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBpKyspIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaV07XG4gICAgICAgICAgICB2YXIgY2VsbCA9IHJvdy5jZWxsc1swXTtcbiAgICAgICAgICAgIHRoaXMucm93TGFiZWxzW2ldID0gbmV3IEhUTUxMYWJlbChpLCBmYWxzZSwgY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5tdi5tb2RlbC53aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZS5yb3dzWzBdO1xuICAgICAgICAgICAgdmFyIGNlbGwgPSByb3cuY2VsbHNbaV07XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxhYmVsc1tpXSA9IG5ldyBIVE1MTGFiZWwoaSwgdHJ1ZSwgY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHRoaXMudGFibGUpO1xuICAgICAgICBpZiAodGhpcy5tdi5ldmVudHMubW91c2Vkb3duICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRDYWxsYmFjayhcIm1vdXNlZG93blwiLCB0aGlzLm12LmV2ZW50cy5tb3VzZWRvd24sIHRoaXMudGFibGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm12LmV2ZW50cy5tb3VzZXVwICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRDYWxsYmFjayhcIm1vdXNldXBcIiwgdGhpcy5tdi5ldmVudHMubW91c2V1cCwgZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm12LmV2ZW50cy5tb3VzZW1vdmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENhbGxiYWNrKFwibW91c2Vtb3ZlXCIsIHRoaXMubXYuZXZlbnRzLm1vdXNlbW92ZSwgZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm12LmV2ZW50cy5kb3VibGVjbGljayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FsbGJhY2soXCJkYmxjbGlja1wiLCB0aGlzLm12LmV2ZW50cy5kb3VibGVjbGljaywgdGhpcy50YWJsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXYuZXZlbnRzLmtleXByZXNzZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENhbGxiYWNrKFwia2V5ZG93blwiLCB0aGlzLm12LmV2ZW50cy5rZXlwcmVzc2VkLCBkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXYuZXZlbnRzLmNvcHkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENhbGxiYWNrKFwiY29weVwiLCB0aGlzLm12LmV2ZW50cy5jb3B5LCBkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwic2VsZWN0aW9uY2hhbmdlZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlU2VsZWN0aW9ucygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3RoaXMudGFibGUuXG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiZm9jdXNjaGFuZ2VkXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC51cGRhdGVGb2N1cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiY2VsbGNoYW5nZWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0LmNlbGxzW2UuZGV0YWlsLmNlbGx5XVtlLmRldGFpbC5jZWxseF0uc2V0RGlzcGxheVZhbCh0aGF0Lm12Lm1vZGVsLmNlbGxWYWxzW2UuZGV0YWlsLmNlbGx4XVtlLmRldGFpbC5jZWxseV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKFwiYmVnaW5lZGl0c1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHRoYXQuZm9jdXNlZENlbGwuYmVnaW5FZGl0cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0aGF0LnRhYmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbihlOiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAvLyAgIGlmICgoPEhUTUxEaXZFbGVtZW50PmUudGFyZ2V0KS5kYXRhc2V0W1wiY2VsbHhcIl0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyAgICAgdGhhdC5mb2N1c2VkQ2VsbC5kaXYuc2V0QXR0cmlidXRlKFwiY29udGVudEVkaXRhYmxlXCIsIHRydWUpO1xuICAgICAgICAgICAgLy8gICAgIHRoYXQuZm9jdXNlZENlbGwuZGl2LmZvY3VzKCk7XG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICB9KSh0aGlzKTtcbiAgICAgICAgdGhpcy5jcmVhdGVNZW51KCk7XG4gICAgfVxuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnByb2Nlc3NNZXNzYWdlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH07XG4gICAgSFRNTFNwcmVhZHNoZWV0Vmlldy5wcm90b3R5cGUudXBkYXRlU2VsZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuY2VsbHNbMF0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tdi5oaWdobGlnaHRlZENlbGxzW2pdW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV1bal0uc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2ldW2pdLmRlc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS51cGRhdGVGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNlZENlbGwgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzZWRDZWxsLmVuZEZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLm12LmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm12LmZvY3VzZWRDZWxsWCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubXYuZm9jdXNlZENlbGxZKTtcbiAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbCA9IHRoaXMuY2VsbHNbdGhpcy5tdi5mb2N1c2VkQ2VsbFldW3RoaXMubXYuZm9jdXNlZENlbGxYXTtcbiAgICAgICAgdGhpcy5mb2N1c2VkQ2VsbC5zdGFydEZvY3VzKCk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5hdHRhY2hDZWxsID0gZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGUucm93c1tjZWxsLmdldFJvdygpICsgMV07XG4gICAgICAgIHZhciB0YWJsZUNlbGwgPSB0aGlzLnRhYmxlLnJvd3NbY2VsbC5nZXRSb3coKSArIDFdLmNlbGxzW2NlbGwuZ2V0Q29sKCkgKyAxXTtcbiAgICAgICAgdGFibGVDZWxsLmFwcGVuZENoaWxkKGNlbGwuZ2V0SFRNTEVsZW1lbnQoKSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5hZGRDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2ssIHRvKSB7XG4gICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmluc2VydENvbCA9IGZ1bmN0aW9uIChjb2xOdW0pIHtcbiAgICAgICAgdGhpcy5tdi5tb2RlbC5pbnNlcnRDb2woY29sTnVtKTtcbiAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGUucm93c1swXTtcbiAgICAgICAgdmFyIGNlbGwgPSByb3cuaW5zZXJ0Q2VsbChjb2xOdW0gKyAxKTtcbiAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHMuc3BsaWNlKGNvbE51bSwgMCwgbmV3IEhUTUxMYWJlbChjb2xOdW0gKyAxLCB0cnVlLCBjZWxsKSk7XG4gICAgICAgIHRoaXMubXV0YWJsZUNvbFZhbHMuc3BsaWNlKGNvbE51bSwgMCwgbmV3IE11dGFibGVOdW1iZXIoY29sTnVtKSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgcm93ID0gdGhpcy50YWJsZS5yb3dzW2kgKyAxXTtcbiAgICAgICAgICAgIHJvdy5pbnNlcnRDZWxsKGNvbE51bSArIDEpO1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS5zcGxpY2UoY29sTnVtLCAwLCBuZXcgSFRNTENlbGwodGhpcywgdGhpcy5tdXRhYmxlUm93VmFsc1tpXSwgdGhpcy5tdXRhYmxlQ29sVmFsc1tjb2xOdW1dKSk7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaENlbGwodGhpcy5jZWxsc1tpXVtjb2xOdW1dKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gY29sTnVtICsgMjsgaiA8PSB0aGlzLm12Lm1vZGVsLndpZHRoOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uTGFiZWxzW2pdLnZhbCsrO1xuICAgICAgICAgICAgO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHNbal0uZGl2LmlubmVySFRNTCA9IHRoaXMuY29sdW1uTGFiZWxzW2pdLnZhbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubXYuaW5zZXJ0Q29sKGNvbE51bSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5kZWxldGVDb2wgPSBmdW5jdGlvbiAoY29sTnVtKSB7XG4gICAgICAgIHRoaXMubXYubW9kZWwuZGVsZXRlQ29sKGNvbE51bSk7XG4gICAgICAgIHRoaXMuY29sdW1uTGFiZWxzLnNwbGljZShjb2xOdW0sIDEpO1xuICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZS5yb3dzWzBdO1xuICAgICAgICByb3cuZGVsZXRlQ2VsbChjb2xOdW0gKyAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLnRhYmxlLnJvd3NbaSArIDFdO1xuICAgICAgICAgICAgcm93LmRlbGV0ZUNlbGwoY29sTnVtICsgMSk7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnNwbGljZShjb2xOdW0sIDEpO1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVswXS5zZXRDb2wodGhpcy5jZWxsc1tpXVswXS5nZXRDb2woKSAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSBjb2xOdW0gKyAxOyBqIDw9IHRoaXMubXYubW9kZWwud2lkdGg7IGorKykge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5MYWJlbHNbal0udmFsLS07XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxhYmVsc1tqXS5kaXYuaW5uZXJIVE1MID0gdGhpcy5jb2x1bW5MYWJlbHNbal0udmFsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tdi5kZWxldGVDb2woY29sTnVtKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmluc2VydFJvdyA9IGZ1bmN0aW9uIChyb3dOdW0pIHtcbiAgICAgICAgdGhpcy5tdi5tb2RlbC5pbnNlcnRSb3cocm93TnVtKTtcbiAgICAgICAgdGhpcy5jZWxscy5zcGxpY2Uocm93TnVtLCAwLCBuZXcgQXJyYXkoKSk7XG4gICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlLmluc2VydFJvdyhyb3dOdW0gKyAxKTtcbiAgICAgICAgdmFyIGxhYmVsID0gcm93Lmluc2VydENlbGwoKTtcbiAgICAgICAgdGhpcy5yb3dMYWJlbHMuc3BsaWNlKHJvd051bSwgMCwgbmV3IEhUTUxMYWJlbChyb3dOdW0gKyAxLCBmYWxzZSwgbGFiZWwpKTtcbiAgICAgICAgdGhpcy5tdXRhYmxlUm93VmFscy5zcGxpY2Uocm93TnVtLCAwLCBuZXcgTXV0YWJsZU51bWJlcihyb3dOdW0pKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW3Jvd051bV1baV0gPSBuZXcgSFRNTENlbGwodGhpcywgdGhpcy5tdXRhYmxlUm93VmFsc1tyb3dOdW1dLCB0aGlzLm11dGFibGVDb2xWYWxzW2ldKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoQ2VsbCh0aGlzLmNlbGxzW3Jvd051bV1baV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSByb3dOdW0gKyAyOyBqIDw9IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgIHRoaXMucm93TGFiZWxzW2pdLnZhbCsrO1xuICAgICAgICAgICAgdGhpcy5yb3dMYWJlbHNbal0uZGl2LmlubmVySFRNTCA9IHRoaXMucm93TGFiZWxzW2pdLnZhbC50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tqXVswXS5zZXRSb3codGhpcy5jZWxsc1tqXVswXS5nZXRSb3coKSArIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubXYuaW5zZXJ0Um93KHJvd051bSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5kZWxldGVSb3cgPSBmdW5jdGlvbiAocm93TnVtKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJvd051bSk7XG4gICAgICAgIHRoaXMubXYubW9kZWwuZGVsZXRlUm93KHJvd051bSk7XG4gICAgICAgIHRoaXMuY2VsbHMuc3BsaWNlKHJvd051bSwgMSk7XG4gICAgICAgIHRoaXMudGFibGUuZGVsZXRlUm93KHJvd051bSArIDEpO1xuICAgICAgICB0aGlzLnJvd0xhYmVscy5zcGxpY2Uocm93TnVtLCAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLndpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSByb3dOdW07IGogPD0gdGhpcy5tdi5tb2RlbC5oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dMYWJlbHNbal0udmFsLS07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93TGFiZWxzW2pdLmRpdi5pbm5lckhUTUwgPSB0aGlzLnJvd0xhYmVsc1tqXS52YWwudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNlbGxzWzBdW2ldLnNldFJvdyh0aGlzLmNlbGxzWzBdW2ldLmdldFJvdygpIC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tdi5kZWxldGVSb3cocm93TnVtKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnNvcnRDb2xBc2MgPSBmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgIHRoaXMuc29ydEJ5Q29sKGNvbCwgdHJ1ZSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5zb3J0Q29sRGVzYyA9IGZ1bmN0aW9uIChjb2wpIHtcbiAgICAgICAgdGhpcy5zb3J0QnlDb2woY29sLCBmYWxzZSk7XG4gICAgfTtcbiAgICBIVE1MU3ByZWFkc2hlZXRWaWV3LnByb3RvdHlwZS5zb3J0QnlDb2wgPSBmdW5jdGlvbiAoY29sTnVtLCBhc2NlbmRpbmcpIHtcbiAgICAgICAgdmFyIG51bXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm12Lm1vZGVsLmhlaWdodDsgaSsrKSB7XG4gICAgICAgICAgICBudW1zLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tdi5tb2RlbC5jZWxsVmFsc1tjb2xOdW1dKTtcbiAgICAgICAgaWYgKGFzY2VuZGluZykge1xuICAgICAgICAgICAgbnVtcyA9IHRoaXMuc29ydENvbChudW1zLCB0aGlzLm12Lm1vZGVsLmNlbGxWYWxzW2NvbE51bV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbnVtcyA9IHRoaXMuc29ydENvbChudW1zLCB0aGlzLm12Lm1vZGVsLmNlbGxWYWxzW2NvbE51bV0sIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgPCBhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobnVtcyk7XG4gICAgICAgIHZhciBuZXdWYWxzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC53aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdWYWxzLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC5oZWlnaHQ7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm12Lm1vZGVsLndpZHRoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBuZXdWYWxzW2pdW2ldID0gdGhpcy5tdi5tb2RlbC5jZWxsVmFsc1tqXVtudW1zW2ldXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhuZXdWYWxzKTtcbiAgICAgICAgdGhpcy5tdi5tb2RlbC5jZWxsVmFscyA9IG5ld1ZhbHM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdi5tb2RlbC53aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMubXYubW9kZWwuaGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW2pdW2ldLnNldERpc3BsYXlWYWwodGhpcy5tdi5tb2RlbC5jZWxsVmFsc1tpXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tdi5tb2RlbC5jZWxsVmFsc1tjb2xOdW1dKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLnNvcnRDb2wgPSBmdW5jdGlvbiAobnVtcywgdmFscywgc29ydGVyKSB7XG4gICAgICAgIGlmICh2YWxzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNvcnRlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBzb3J0IGZ1bmN0aW9uIHBhc3NlZFwiKTtcbiAgICAgICAgICAgIHNvcnRlciA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgPCBiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVmdFZhbHMgPSBbXTtcbiAgICAgICAgdmFyIGxlZnROdW1zID0gW107XG4gICAgICAgIHZhciByaWdodFZhbHMgPSBbXTtcbiAgICAgICAgdmFyIHJpZ2h0TnVtcyA9IFtdO1xuICAgICAgICB2YXIgcGl2b3QgPSB2YWxzWzBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoc29ydGVyKHZhbHNbaV0sIHBpdm90KSB8fCBwaXZvdCA9PSBcIlwiKSAmJiB2YWxzW2ldICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBsZWZ0VmFscy5wdXNoKHZhbHNbaV0pO1xuICAgICAgICAgICAgICAgIGxlZnROdW1zLnB1c2gobnVtc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByaWdodFZhbHMucHVzaCh2YWxzW2ldKTtcbiAgICAgICAgICAgICAgICByaWdodE51bXMucHVzaChudW1zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3J0Q29sKGxlZnROdW1zLCBsZWZ0VmFscywgc29ydGVyKS5jb25jYXQobnVtc1swXSlcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5zb3J0Q29sKHJpZ2h0TnVtcywgcmlnaHRWYWxzLCBzb3J0ZXIpKTtcbiAgICB9O1xuICAgIEhUTUxTcHJlYWRzaGVldFZpZXcucHJvdG90eXBlLmNyZWF0ZU1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB7XG4gICAgICAgICAgICAgICAgcm93QmVmb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkIHJvdyBiZWZvcmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuaW5zZXJ0Um93KHZpZXcubXYuZm9jdXNlZENlbGxZKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJvd0FmdGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkIHJvdyBhZnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5pbnNlcnRSb3codmlldy5tdi5mb2N1c2VkQ2VsbFkgKyAxKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbEJlZm9yZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZCBjb2wgYmVmb3JlXCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3Lmluc2VydENvbCh2aWV3Lm12LmZvY3VzZWRDZWxsWCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb2xBZnRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZCBjb2wgYWZ0ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIHZpZXcuaW5zZXJ0Q29sKHZpZXcubXYuZm9jdXNlZENlbGxYICsgMSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxSb3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcm93XCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LmRlbGV0ZVJvdyh2aWV3Lm12LmZvY3VzZWRDZWxsWSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxDb2w6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgY29sXCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LmRlbGV0ZUNvbCh2aWV3Lm12LmZvY3VzZWRDZWxsWCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzb3J0Q29sQXNjOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU29ydCBjb2wgYXNjXCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNvcnRDb2xBc2Modmlldy5tdi5mb2N1c2VkQ2VsbFgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc29ydENvbERlc2M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTb3J0IGNvbCBkZXNjXCIpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnNvcnRDb2xEZXNjKHZpZXcubXYuZm9jdXNlZENlbGxYKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByb3dCZWZvcmVJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiSW5zZXJ0IFJvdyBCZWZvcmVcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdyb3dCZWZvcmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciByb3dBZnRlckl0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJJbnNlcnQgUm93IEFmdGVyXCIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncm93QWZ0ZXInXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjb2xCZWZvcmVJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiSW5zZXJ0IENvbHVtbiBCZWZvcmVcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdjb2xCZWZvcmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjb2xBZnRlckl0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJJbnNlcnQgQ29sdW1uIEFmdGVyXCIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY29sQWZ0ZXInXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBkZWxSb3dJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVsZXRlIFJvd1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2RlbFJvdydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGRlbENvbEl0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJEZWxldGUgQ29sdW1uXCIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZGVsQ29sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc29ydENvbEFzY0l0ZW0gPSBuZXcgcGhvc3Bob3JfbWVudXNfMS5NZW51SXRlbSh7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJTb3J0IEJ5IENvbHVtbiBBLVpcIixcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdzb3J0QXNjQ29sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc29ydENvbERlc2NJdGVtID0gbmV3IHBob3NwaG9yX21lbnVzXzEuTWVudUl0ZW0oe1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiU29ydCBCeSBDb2x1bW4gWi1BXCIsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnc29ydERlc2NDb2wnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvd0JlZm9yZUl0ZW0uaGFuZGxlciA9IGhhbmRsZXIucm93QmVmb3JlO1xuICAgICAgICAgICAgcm93QWZ0ZXJJdGVtLmhhbmRsZXIgPSBoYW5kbGVyLnJvd0FmdGVyO1xuICAgICAgICAgICAgY29sQmVmb3JlSXRlbS5oYW5kbGVyID0gaGFuZGxlci5jb2xCZWZvcmU7XG4gICAgICAgICAgICBjb2xBZnRlckl0ZW0uaGFuZGxlciA9IGhhbmRsZXIuY29sQWZ0ZXI7XG4gICAgICAgICAgICBkZWxSb3dJdGVtLmhhbmRsZXIgPSBoYW5kbGVyLmRlbFJvdztcbiAgICAgICAgICAgIGRlbENvbEl0ZW0uaGFuZGxlciA9IGhhbmRsZXIuZGVsQ29sO1xuICAgICAgICAgICAgc29ydENvbEFzY0l0ZW0uaGFuZGxlciA9IGhhbmRsZXIuc29ydENvbEFzYztcbiAgICAgICAgICAgIHNvcnRDb2xEZXNjSXRlbS5oYW5kbGVyID0gaGFuZGxlci5zb3J0Q29sRGVzYztcbiAgICAgICAgICAgIHZhciByaWdodENsaWNrTWVudSA9IG5ldyBwaG9zcGhvcl9tZW51c18xLk1lbnUoKTtcbiAgICAgICAgICAgIHJpZ2h0Q2xpY2tNZW51Lml0ZW1zID0gW1xuICAgICAgICAgICAgICAgIHJvd0JlZm9yZUl0ZW0sXG4gICAgICAgICAgICAgICAgcm93QWZ0ZXJJdGVtLFxuICAgICAgICAgICAgICAgIGNvbEJlZm9yZUl0ZW0sXG4gICAgICAgICAgICAgICAgY29sQWZ0ZXJJdGVtLFxuICAgICAgICAgICAgICAgIGRlbFJvd0l0ZW0sXG4gICAgICAgICAgICAgICAgZGVsQ29sSXRlbSxcbiAgICAgICAgICAgICAgICBzb3J0Q29sQXNjSXRlbSxcbiAgICAgICAgICAgICAgICBzb3J0Q29sRGVzY0l0ZW1dO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgICAgICAgcmlnaHRDbGlja01lbnUucG9wdXAoeCwgeSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkodGhpcyk7XG4gICAgfTtcbiAgICByZXR1cm4gSFRNTFNwcmVhZHNoZWV0Vmlldztcbn0pKHBob3NwaG9yX3dpZGdldF8xLldpZGdldCk7XG5mdW5jdGlvbiBtYWluKCkge1xuICAgIHNldHVwKCk7XG59XG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvL3ZhciBzcHJlYWRzaGVldCA9IG5ldyBTcHJlYWRzaGVldCgyNywgNjApO1xuICAgIHZhciBzcHJlYWRzaGVldDIgPSBuZXcgSFRNTFNwcmVhZHNoZWV0VmlldyhuZXcgSFRNTFNwcmVhZHNoZWV0Vmlld01vZGVsKG5ldyBIVE1MU3ByZWFkc2hlZXRNb2RlbCgyNywgNjApKSk7XG4gICAgc3ByZWFkc2hlZXQyLmFkZENsYXNzKFwic2Nyb2xsXCIpO1xuICAgIHBob3NwaG9yX3dpZGdldF8xLmF0dGFjaFdpZGdldChzcHJlYWRzaGVldDIsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpO1xuICAgIC8vc3ByZWFkc2hlZXQuYXR0YWNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpO1xuICAgIC8vc3BDb2wuaG9yaXpvbnRhbFNpemVQb2xpY3kgPSBTaXplUG9saWN5LkZpeGVkO1xuICAgIC8vc3ByZWFkc2hlZXQuZml0KCk7XG4gICAgLy9zcHJlYWRzaGVldDIuZml0KCk7XG4gICAgLy93aW5kb3cub25yZXNpemUgPSAoKSA9PiBzcHJlYWRzaGVldC5maXQoKTtcbiAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzcHJlYWRzaGVldDIudXBkYXRlKCk7IH07XG59XG53aW5kb3cub25sb2FkID0gbWFpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwcmVhZHNoZWV0LmpzLm1hcCIsIid1c2Ugc3RyaWN0Jztcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGJyb3dzZXIgZmllbGQsIGNoZWNrIG91dCB0aGUgYnJvd3NlciBmaWVsZCBhdCBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svYnJvd3NlcmlmeS1oYW5kYm9vayNicm93c2VyLWZpZWxkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBDcmVhdGUgYSA8bGluaz4gdGFnIHdpdGggb3B0aW9uYWwgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY3JlYXRlTGluazogZnVuY3Rpb24oaHJlZiwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICggISBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfSxcbiAgICAvLyBDcmVhdGUgYSA8c3R5bGU+IHRhZyB3aXRoIG9wdGlvbmFsIGRhdGEgYXR0cmlidXRlc1xuICAgIGNyZWF0ZVN0eWxlOiBmdW5jdGlvbihjc3NUZXh0LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAoICEgYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3R5bGUuc2hlZXQpIHsgLy8gZm9yIGpzZG9tIGFuZCBJRTkrXG4gICAgICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3NUZXh0O1xuICAgICAgICAgICAgc3R5bGUuc2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7IC8vIGZvciBJRTggYW5kIGJlbG93XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmlcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggZWxlbWVudCBpbiBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGl0ZXJhdGUuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgdGhlIGFycmF5IGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggZm9yIGl0ZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgaXRlcmF0aW9uIHdyYXBzIGFyb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZmlyc3QgdmFsdWUgcmV0dXJuZWQgYnkgYGNhbGxiYWNrYCB3aGljaCBpcyBub3RcbiAqICAgZXF1YWwgdG8gYHVuZGVmaW5lZGAsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBjYWxsYmFjayBkb2VzXG4gKiAgIG5vdCByZXR1cm4gYSB2YWx1ZSBvciBpZiB0aGUgc3RhcnQgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEl0IGlzIG5vdCBzYWZlIHRvIG1vZGlmeSB0aGUgc2l6ZSBvZiB0aGUgYXJyYXkgd2hpbGUgaXRlcmF0aW5nLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogZnVuY3Rpb24gbG9nZ2VyKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDRdO1xuICogYXJyYXlzLmZvckVhY2goZGF0YSwgbG9nZ2VyKTsgICAgICAgICAgIC8vIGxvZ3MgMSwgMiwgMywgNFxuICogYXJyYXlzLmZvckVhY2goZGF0YSwgbG9nZ2VyLCAyKTsgICAgICAgIC8vIGxvZ3MgMywgNFxuICogYXJyYXlzLmZvckVhY2goZGF0YSwgbG9nZ2VyLCAyLCB0cnVlKTsgIC8vIGxvZ3MgMywgNCwgMSwgMlxuICogYXJyYXlzLmZvckVhY2goZGF0YSwgKHYsIGkpID0+IHsgICAgICAgIC8vIDJcbiAqICAgaWYgKHYgPT09IDMpIHJldHVybiBpO1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAqKlNlZSBhbHNvKiogW1tyZm9yRWFjaF1dXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goYXJyYXksIGNhbGxiYWNrLCBmcm9tSW5kZXgsIHdyYXApIHtcbiAgICBpZiAoZnJvbUluZGV4ID09PSB2b2lkIDApIHsgZnJvbUluZGV4ID0gMDsgfVxuICAgIGlmICh3cmFwID09PSB2b2lkIDApIHsgd3JhcCA9IGZhbHNlOyB9XG4gICAgdmFyIHN0YXJ0ID0gZnJvbUluZGV4IHwgMDtcbiAgICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAod3JhcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIGogPSAoc3RhcnQgKyBpKSAlIG47XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYXJyYXlbal0sIGopO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKGFycmF5W2ldLCBpKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IHZvaWQgMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2b2lkIDA7XG59XG5leHBvcnRzLmZvckVhY2ggPSBmb3JFYWNoO1xuLyoqXG4gKiBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGVhY2ggZWxlbWVudCBpbiBhbiBhcnJheSwgaW4gcmV2ZXJzZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGl0ZXJhdGUuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgdGhlIGFycmF5IGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgc3RhcnRpbmcgaW5kZXggZm9yIGl0ZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0gd3JhcCAtIFdoZXRoZXIgaXRlcmF0aW9uIHdyYXBzIGFyb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZmlyc3QgdmFsdWUgcmV0dXJuZWQgYnkgYGNhbGxiYWNrYCB3aGljaCBpcyBub3RcbiAqICAgZXF1YWwgdG8gYHVuZGVmaW5lZGAsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBjYWxsYmFjayBkb2VzXG4gKiAgIG5vdCByZXR1cm4gYSB2YWx1ZSBvciBpZiB0aGUgc3RhcnQgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEl0IGlzIG5vdCBzYWZlIHRvIG1vZGlmeSB0aGUgc2l6ZSBvZiB0aGUgYXJyYXkgd2hpbGUgaXRlcmF0aW5nLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogZnVuY3Rpb24gbG9nZ2VyKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDRdO1xuICogYXJyYXlzLnJmb3JFYWNoKGRhdGEsIGxvZ2dlcik7ICAgICAgICAgICAvLyBsb2dzIDQsIDMsIDIsIDFcbiAqIGFycmF5cy5yZm9yRWFjaChkYXRhLCBsb2dnZXIsIDIpOyAgICAgICAgLy8gbG9ncyAzLCAyLCAxXG4gKiBhcnJheXMucmZvckVhY2goZGF0YSwgbG9nZ2VyLCAyLCB0cnVlKTsgIC8vIGxvZ3MgMywgMiwgMSwgNFxuICogYXJyYXlzLnJmb3JFYWNoKGRhdGEsICh2LCBpKSA9PiB7ICAgICAgICAvLyAyXG4gKiAgIGlmICh2ID09PSAzKSByZXR1cm4gaTtcbiAqIH0pO1xuICogYGBgXG4gKiAqKlNlZSBhbHNvKiogW1tmb3JFYWNoXV1cbiAqL1xuZnVuY3Rpb24gcmZvckVhY2goYXJyYXksIGNhbGxiYWNrLCBmcm9tSW5kZXgsIHdyYXApIHtcbiAgICBpZiAoZnJvbUluZGV4ID09PSB2b2lkIDApIHsgZnJvbUluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTsgfVxuICAgIGlmICh3cmFwID09PSB2b2lkIDApIHsgd3JhcCA9IGZhbHNlOyB9XG4gICAgdmFyIHN0YXJ0ID0gZnJvbUluZGV4IHwgMDtcbiAgICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAod3JhcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgdmFyIGogPSAoc3RhcnQgLSBpICsgbikgJSBuO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKGFycmF5W2pdLCBqKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IHZvaWQgMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYXJyYXlbaV0sIGkpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZvaWQgMDtcbn1cbmV4cG9ydHMucmZvckVhY2ggPSByZm9yRWFjaDtcbi8qKlxuICogRmluZCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZhbHVlIHdoaWNoIG1hdGNoZXMgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBiZSBzZWFyY2hlZC5cbiAqXG4gKiBAcGFyYW0gcHJlZCAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSBzZWFyY2guXG4gKlxuICogQHBhcmFtIHdyYXAgLSBXaGV0aGVyIHRoZSBzZWFyY2ggd3JhcHMgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICpcbiAqIEByZXR1cm5zIFRoZSBpbmRleCBvZiB0aGUgZmlyc3QgbWF0Y2hpbmcgdmFsdWUsIG9yIGAtMWAgaWYgbm8gdmFsdWVcbiAqICAgbWF0Y2hlcyB0aGUgcHJlZGljYXRlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgdG8gbW9kaWZ5IHRoZSBzaXplIG9mIHRoZSBhcnJheSB3aGlsZSBpdGVyYXRpbmcuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBpc0V2ZW4odmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICogICByZXR1cm4gdmFsdWUgJSAyID09PSAwO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDQsIDMsIDIsIDFdO1xuICogYXJyYXlzLmZpbmRJbmRleChkYXRhLCBpc0V2ZW4pOyAgICAgICAgICAgLy8gMVxuICogYXJyYXlzLmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDQpOyAgICAgICAgLy8gNVxuICogYXJyYXlzLmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDYpOyAgICAgICAgLy8gLTFcbiAqIGFycmF5cy5maW5kSW5kZXgoZGF0YSwgaXNFdmVuLCA2LCB0cnVlKTsgIC8vIDFcbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW3JmaW5kSW5kZXhdXS5cbiAqL1xuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkLCBmcm9tSW5kZXgsIHdyYXApIHtcbiAgICBpZiAoZnJvbUluZGV4ID09PSB2b2lkIDApIHsgZnJvbUluZGV4ID0gMDsgfVxuICAgIGlmICh3cmFwID09PSB2b2lkIDApIHsgd3JhcCA9IGZhbHNlOyB9XG4gICAgdmFyIHN0YXJ0ID0gZnJvbUluZGV4IHwgMDtcbiAgICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGlmICh3cmFwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgaiA9IChzdGFydCArIGkpICUgbjtcbiAgICAgICAgICAgIGlmIChwcmVkKGFycmF5W2pdLCBqKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gajtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0LCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICBpZiAocHJlZChhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuZXhwb3J0cy5maW5kSW5kZXggPSBmaW5kSW5kZXg7XG4vKipcbiAqIEZpbmQgdGhlIGluZGV4IG9mIHRoZSBsYXN0IHZhbHVlIHdoaWNoIG1hdGNoZXMgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBiZSBzZWFyY2hlZC5cbiAqXG4gKiBAcGFyYW0gcHJlZCAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSBzZWFyY2guXG4gKlxuICogQHBhcmFtIHdyYXAgLSBXaGV0aGVyIHRoZSBzZWFyY2ggd3JhcHMgYXJvdW5kIGF0IHRoZSBmcm9udCBvZiB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IG9mIHRoZSBsYXN0IG1hdGNoaW5nIHZhbHVlLCBvciBgLTFgIGlmIG5vIHZhbHVlXG4gKiAgIG1hdGNoZXMgdGhlIHByZWRpY2F0ZSBvciBpZiB0aGUgc3RhcnQgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEl0IGlzIG5vdCBzYWZlIHRvIG1vZGlmeSB0aGUgc2l6ZSBvZiB0aGUgYXJyYXkgd2hpbGUgaXRlcmF0aW5nLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogZnVuY3Rpb24gaXNFdmVuKHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAqICAgcmV0dXJuIHZhbHVlICUgMiA9PT0gMDtcbiAqIH1cbiAqXG4gKiB2YXIgZGF0YSA9IFsxLCAyLCAzLCA0LCAzLCAyLCAxXTtcbiAqIGFycmF5cy5yZmluZEluZGV4KGRhdGEsIGlzRXZlbik7ICAgICAgICAgICAvLyA1XG4gKiBhcnJheXMucmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDQpOyAgICAgICAgLy8gM1xuICogYXJyYXlzLnJmaW5kSW5kZXgoZGF0YSwgaXNFdmVuLCAwKTsgICAgICAgIC8vIC0xXG4gKiBhcnJheXMucmZpbmRJbmRleChkYXRhLCBpc0V2ZW4sIDAsIHRydWUpOyAgLy8gNVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbZmluZEluZGV4XV0uXG4gKi9cbmZ1bmN0aW9uIHJmaW5kSW5kZXgoYXJyYXksIHByZWQsIGZyb21JbmRleCwgd3JhcCkge1xuICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSBhcnJheS5sZW5ndGggLSAxOyB9XG4gICAgaWYgKHdyYXAgPT09IHZvaWQgMCkgeyB3cmFwID0gZmFsc2U7IH1cbiAgICB2YXIgc3RhcnQgPSBmcm9tSW5kZXggfCAwO1xuICAgIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBqID0gKHN0YXJ0IC0gaSArIG4pICUgbjtcbiAgICAgICAgICAgIGlmIChwcmVkKGFycmF5W2pdLCBqKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gajtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgaWYgKHByZWQoYXJyYXlbaV0sIGkpKVxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmV4cG9ydHMucmZpbmRJbmRleCA9IHJmaW5kSW5kZXg7XG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IHZhbHVlIHdoaWNoIG1hdGNoZXMgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBiZSBzZWFyY2hlZC5cbiAqXG4gKiBAcGFyYW0gcHJlZCAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSBzZWFyY2guXG4gKlxuICogQHBhcmFtIHdyYXAgLSBXaGV0aGVyIHRoZSBzZWFyY2ggd3JhcHMgYXJvdW5kIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICpcbiAqIEByZXR1cm5zIFRoZSBmaXJzdCBtYXRjaGluZyB2YWx1ZSwgb3IgYHVuZGVmaW5lZGAgaWYgbm8gdmFsdWUgbWF0Y2hlc1xuICogICB0aGUgcHJlZGljYXRlIG9yIGlmIHRoZSBzdGFydCBpbmRleCBpcyBvdXQgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgdG8gbW9kaWZ5IHRoZSBzaXplIG9mIHRoZSBhcnJheSB3aGlsZSBpdGVyYXRpbmcuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBpc0V2ZW4odmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICogICByZXR1cm4gdmFsdWUgJSAyID09PSAwO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDQsIDMsIDIsIDFdO1xuICogYXJyYXlzLmZpbmQoZGF0YSwgaXNFdmVuKTsgICAgICAgICAgIC8vIDJcbiAqIGFycmF5cy5maW5kKGRhdGEsIGlzRXZlbiwgNCk7ICAgICAgICAvLyAyXG4gKiBhcnJheXMuZmluZChkYXRhLCBpc0V2ZW4sIDYpOyAgICAgICAgLy8gdW5kZWZpbmVkXG4gKiBhcnJheXMuZmluZChkYXRhLCBpc0V2ZW4sIDYsIHRydWUpOyAgLy8gMlxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmZpbmRdXS5cbiAqL1xuZnVuY3Rpb24gZmluZChhcnJheSwgcHJlZCwgZnJvbUluZGV4LCB3cmFwKSB7XG4gICAgdmFyIGkgPSBmaW5kSW5kZXgoYXJyYXksIHByZWQsIGZyb21JbmRleCwgd3JhcCk7XG4gICAgcmV0dXJuIGkgIT09IC0xID8gYXJyYXlbaV0gOiB2b2lkIDA7XG59XG5leHBvcnRzLmZpbmQgPSBmaW5kO1xuLyoqXG4gKiBGaW5kIHRoZSBsYXN0IHZhbHVlIHdoaWNoIG1hdGNoZXMgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBiZSBzZWFyY2hlZC5cbiAqXG4gKiBAcGFyYW0gcHJlZCAtIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSBzZWFyY2guXG4gKlxuICogQHBhcmFtIHdyYXAgLSBXaGV0aGVyIHRoZSBzZWFyY2ggd3JhcHMgYXJvdW5kIGF0IHRoZSBmcm9udCBvZiB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGxhc3QgbWF0Y2hpbmcgdmFsdWUsIG9yIGB1bmRlZmluZWRgIGlmIG5vIHZhbHVlIG1hdGNoZXNcbiAqICAgdGhlIHByZWRpY2F0ZSBvciBpZiB0aGUgc3RhcnQgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoZSByYW5nZSBvZiB2aXNpdGVkIGluZGljZXMgaXMgc2V0IGJlZm9yZSB0aGUgZmlyc3QgaW52b2NhdGlvbiBvZlxuICogYHByZWRgLiBJdCBpcyBub3Qgc2FmZSBmb3IgYHByZWRgIHRvIGNoYW5nZSB0aGUgbGVuZ3RoIG9mIGBhcnJheWAuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBpc0V2ZW4odmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICogICByZXR1cm4gdmFsdWUgJSAyID09PSAwO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzEsIDIsIDMsIDQsIDMsIDIsIDFdO1xuICogYXJyYXlzLnJmaW5kKGRhdGEsIGlzRXZlbik7ICAgICAgICAgICAvLyAyXG4gKiBhcnJheXMucmZpbmQoZGF0YSwgaXNFdmVuLCA0KTsgICAgICAgIC8vIDRcbiAqIGFycmF5cy5yZmluZChkYXRhLCBpc0V2ZW4sIDApOyAgICAgICAgLy8gdW5kZWZpbmVkXG4gKiBhcnJheXMucmZpbmQoZGF0YSwgaXNFdmVuLCAwLCB0cnVlKTsgIC8vIDJcbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW2ZpbmRdXS5cbiAqL1xuZnVuY3Rpb24gcmZpbmQoYXJyYXksIHByZWQsIGZyb21JbmRleCwgd3JhcCkge1xuICAgIHZhciBpID0gcmZpbmRJbmRleChhcnJheSwgcHJlZCwgZnJvbUluZGV4LCB3cmFwKTtcbiAgICByZXR1cm4gaSAhPT0gLTEgPyBhcnJheVtpXSA6IHZvaWQgMDtcbn1cbmV4cG9ydHMucmZpbmQgPSByZmluZDtcbi8qKlxuICogSW5zZXJ0IGFuIGVsZW1lbnQgaW50byBhbiBhcnJheSBhdCBhIHNwZWNpZmllZCBpbmRleC5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIG1vZGlmeS5cbiAqXG4gKiBAcGFyYW0gaW5kZXggLSBUaGUgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSB2YWx1ZS4gVGhpcyB2YWx1ZVxuICogICBpcyBjbGFtcGVkIHRvIHRoZSBib3VuZHMgb2YgdGhlIGFycmF5LlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBpbnNlcnQgaW50byB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IGF0IHdoaWNoIHRoZSB2YWx1ZSB3YXMgaW5zZXJ0ZWQuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiB2YXIgZGF0YSA9IFswLCAxLCAyLCAzLCA0XTtcbiAqIGFycmF5cy5pbnNlcnQoZGF0YSwgMCwgMTIpOyAgLy8gMFxuICogYXJyYXlzLmluc2VydChkYXRhLCAzLCA0Mik7ICAvLyAzXG4gKiBhcnJheXMuaW5zZXJ0KGRhdGEsIC05LCA5KTsgIC8vIDBcbiAqIGFycmF5cy5pbnNlcnQoZGF0YSwgMTIsIDgpOyAgLy8gOFxuICogY29uc29sZS5sb2coZGF0YSk7ICAgICAgICAgICAvLyBbOSwgMTIsIDAsIDEsIDQyLCAyLCAzLCA0LCA4XVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmVtb3ZlQXRdXSBhbmQgW1tyZW1vdmVdXVxuICovXG5mdW5jdGlvbiBpbnNlcnQoYXJyYXksIGluZGV4LCB2YWx1ZSkge1xuICAgIHZhciBqID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaW5kZXggfCAwLCBhcnJheS5sZW5ndGgpKTtcbiAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoOyBpID4gajsgLS1pKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlbaSAtIDFdO1xuICAgIH1cbiAgICBhcnJheVtqXSA9IHZhbHVlO1xuICAgIHJldHVybiBqO1xufVxuZXhwb3J0cy5pbnNlcnQgPSBpbnNlcnQ7XG4vKipcbiAqIE1vdmUgYW4gZWxlbWVudCBpbiBhbiBhcnJheSBmcm9tIG9uZSBpbmRleCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gbW9kaWZ5LlxuICpcbiAqIEBwYXJhbSBmcm9tSW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gbW92ZS5cbiAqXG4gKiBAcGFyYW0gdG9JbmRleCAtIFRoZSB0YXJnZXQgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gKlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBlbGVtZW50IHdhcyBtb3ZlZCwgb3IgYGZhbHNlYCBpZiBlaXRoZXJcbiAqICAgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogdmFyIGRhdGEgPSBbMCwgMSwgMiwgMywgNF07XG4gKiBhcnJheXMubW92ZShkYXRhLCAxLCAyKTsgICAvLyB0cnVlXG4gKiBhcnJheXMubW92ZShkYXRhLCAtMSwgMCk7ICAvLyBmYWxzZVxuICogYXJyYXlzLm1vdmUoZGF0YSwgNCwgMik7ICAgLy8gdHJ1ZVxuICogYXJyYXlzLm1vdmUoZGF0YSwgMTAsIDApOyAgLy8gZmFsc2VcbiAqIGNvbnNvbGUubG9nKGRhdGEpOyAgICAgICAgIC8vIFswLCAyLCA0LCAxLCAzXVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIG1vdmUoYXJyYXksIGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgIHZhciBqID0gZnJvbUluZGV4IHwgMDtcbiAgICBpZiAoaiA8IDAgfHwgaiA+PSBhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgayA9IHRvSW5kZXggfCAwO1xuICAgIGlmIChrIDwgMCB8fCBrID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB2YWx1ZSA9IGFycmF5W2pdO1xuICAgIGlmIChqID4gaykge1xuICAgICAgICBmb3IgKHZhciBpID0gajsgaSA+IGs7IC0taSkge1xuICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtpIC0gMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaiA8IGspIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IGo7IGkgPCBrOyArK2kpIHtcbiAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbaSArIDFdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFycmF5W2tdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLm1vdmUgPSBtb3ZlO1xuLyoqXG4gKiBSZW1vdmUgYW4gZWxlbWVudCBmcm9tIGFuIGFycmF5IGF0IGEgc3BlY2lmaWVkIGluZGV4LlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gbW9kaWZ5LlxuICpcbiAqIEBwYXJhbSBpbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCB0byByZW1vdmUuXG4gKlxuICogQHJldHVybnMgVGhlIHJlbW92ZWQgdmFsdWUsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBpbmRleCBpcyBvdXRcbiAqICAgb2YgcmFuZ2UuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiB2YXIgZGF0YSA9IFswLCAxLCAyLCAzLCA0XTtcbiAqIGFycmF5cy5yZW1vdmVBdChkYXRhLCAxKTsgICAvLyAxXG4gKiBhcnJheXMucmVtb3ZlQXQoZGF0YSwgMyk7ICAgLy8gNFxuICogYXJyYXlzLnJlbW92ZUF0KGRhdGEsIDEwKTsgIC8vIHVuZGVmaW5lZFxuICogY29uc29sZS5sb2coZGF0YSk7ICAgICAgICAgIC8vIFswLCAyLCAzXVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmVtb3ZlXV0gYW5kIFtbaW5zZXJ0XV1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXQoYXJyYXksIGluZGV4KSB7XG4gICAgdmFyIGogPSBpbmRleCB8IDA7XG4gICAgaWYgKGogPCAwIHx8IGogPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuICAgIHZhciB2YWx1ZSA9IGFycmF5W2pdO1xuICAgIGZvciAodmFyIGkgPSBqICsgMSwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBhcnJheVtpIC0gMV0gPSBhcnJheVtpXTtcbiAgICB9XG4gICAgYXJyYXkubGVuZ3RoIC09IDE7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0cy5yZW1vdmVBdCA9IHJlbW92ZUF0O1xuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYSB2YWx1ZSBmcm9tIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gbW9kaWZ5LlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byByZW1vdmUgZnJvbSB0aGUgYXJyYXkuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IHdoZXJlIHRoZSB2YWx1ZSB3YXMgbG9jYXRlZCwgb3IgYC0xYCBpZiB0aGVcbiAqICAgdmFsdWUgaXMgbm90IHRoZSBhcnJheS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGFycmF5cyBmcm9tICdwaG9zcGhvci1hcnJheXMnO1xuICpcbiAqIHZhciBkYXRhID0gWzAsIDEsIDIsIDMsIDRdO1xuICogYXJyYXlzLnJlbW92ZShkYXRhLCAxKTsgIC8vIDFcbiAqIGFycmF5cy5yZW1vdmUoZGF0YSwgMyk7ICAvLyAyXG4gKiBhcnJheXMucmVtb3ZlKGRhdGEsIDcpOyAgLy8gLTFcbiAqIGNvbnNvbGUubG9nKGRhdGEpOyAgICAgICAvLyBbMCwgMiwgNF1cbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW3JlbW92ZUF0XV0gYW5kIFtbaW5zZXJ0XV1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCB2YWx1ZSkge1xuICAgIHZhciBqID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgaiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gaiArIDEsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgYXJyYXlbaSAtIDFdID0gYXJyYXlbaV07XG4gICAgfVxuICAgIGFycmF5Lmxlbmd0aCAtPSAxO1xuICAgIHJldHVybiBqO1xufVxuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG4vKipcbiAqIFJldmVyc2UgYW4gYXJyYXkgaW4tcGxhY2Ugc3ViamVjdCB0byBhbiBvcHRpb25hbCByYW5nZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgdG8gcmV2ZXJzZS5cbiAqXG4gKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSByYW5nZS5cbiAqICAgVGhpcyB2YWx1ZSB3aWxsIGJlIGNsYW1wZWQgdG8gdGhlIGFycmF5IGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0gdG9JbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgbGFzdCBlbGVtZW50IG9mIHRoZSByYW5nZS5cbiAqICAgVGhpcyB2YWx1ZSB3aWxsIGJlIGNsYW1wZWQgdG8gdGhlIGFycmF5IGJvdW5kcy5cbiAqXG4gKiBAcmV0dXJucyBBIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgYXJyYXkuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiB2YXIgZGF0YSA9IFswLCAxLCAyLCAzLCA0XTtcbiAqIGFycmF5cy5yZXZlcnNlKGRhdGEsIDEsIDMpOyAgICAvLyBbMCwgMywgMiwgMSwgNF1cbiAqIGFycmF5cy5yZXZlcnNlKGRhdGEsIDMpOyAgICAgICAvLyBbMCwgMywgMiwgNCwgMV1cbiAqIGFycmF5cy5yZXZlcnNlKGRhdGEpOyAgICAgICAgICAvLyBbMSwgNCwgMiwgMywgMF1cbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW3JvdGF0ZV1dXG4gKi9cbmZ1bmN0aW9uIHJldmVyc2UoYXJyYXksIGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgIGlmIChmcm9tSW5kZXggPT09IHZvaWQgMCkgeyBmcm9tSW5kZXggPSAwOyB9XG4gICAgaWYgKHRvSW5kZXggPT09IHZvaWQgMCkgeyB0b0luZGV4ID0gYXJyYXkubGVuZ3RoOyB9XG4gICAgdmFyIGkgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihmcm9tSW5kZXggfCAwLCBhcnJheS5sZW5ndGggLSAxKSk7XG4gICAgdmFyIGogPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0b0luZGV4IHwgMCwgYXJyYXkubGVuZ3RoIC0gMSkpO1xuICAgIGlmIChqIDwgaSlcbiAgICAgICAgaSA9IGogKyAoaiA9IGksIDApO1xuICAgIHdoaWxlIChpIDwgaikge1xuICAgICAgICB2YXIgdG1wdmFsID0gYXJyYXlbaV07XG4gICAgICAgIGFycmF5W2krK10gPSBhcnJheVtqXTtcbiAgICAgICAgYXJyYXlbai0tXSA9IHRtcHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZXhwb3J0cy5yZXZlcnNlID0gcmV2ZXJzZTtcbi8qKlxuICogUm90YXRlIHRoZSBlbGVtZW50cyBvZiBhbiBhcnJheSBieSBhIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGRlbHRhLlxuICpcbiAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSB0byByb3RhdGUuXG4gKlxuICogQHBhcmFtIGRlbHRhIC0gVGhlIGFtb3VudCBvZiByb3RhdGlvbiB0byBhcHBseSB0byB0aGUgZWxlbWVudHMuIEFcbiAqICAgcG9zaXRpdmUgZGVsdGEgd2lsbCBzaGlmdCB0aGUgZWxlbWVudHMgdG8gdGhlIGxlZnQuIEEgbmVnYXRpdmVcbiAqICAgZGVsdGEgd2lsbCBzaGlmdCB0aGUgZWxlbWVudHMgdG8gdGhlIHJpZ2h0LlxuICpcbiAqIEByZXR1cm5zIEEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBhcnJheS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIGV4ZWN1dGVzIGluIGBPKG4pYCB0aW1lIGFuZCBgTygxKWAgc3BhY2UuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiB2YXIgZGF0YSA9IFswLCAxLCAyLCAzLCA0XTtcbiAqIGFycmF5cy5yb3RhdGUoZGF0YSwgMik7ICAgIC8vIFsyLCAzLCA0LCAwLCAxXVxuICogYXJyYXlzLnJvdGF0ZShkYXRhLCAtMik7ICAgLy8gWzAsIDEsIDIsIDMsIDRdXG4gKiBhcnJheXMucm90YXRlKGRhdGEsIDEwKTsgICAvLyBbMCwgMSwgMiwgMywgNF1cbiAqIGFycmF5cy5yb3RhdGUoZGF0YSwgOSk7ICAgIC8vIFs0LCAwLCAxLCAyLCAzXVxuICogYGBgXG4gKlxuICogKipTZWUgYWxzbyoqIFtbcmV2ZXJzZV1dXG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZShhcnJheSwgZGVsdGEpIHtcbiAgICB2YXIgbiA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgdmFyIGQgPSBkZWx0YSB8IDA7XG4gICAgaWYgKGQgPiAwKSB7XG4gICAgICAgIGQgPSBkICUgbjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZCA8IDApIHtcbiAgICAgICAgZCA9ICgoZCAlIG4pICsgbikgJSBuO1xuICAgIH1cbiAgICBpZiAoZCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICAgIHJldmVyc2UoYXJyYXksIDAsIGQgLSAxKTtcbiAgICByZXZlcnNlKGFycmF5LCBkLCBuIC0gMSk7XG4gICAgcmV2ZXJzZShhcnJheSwgMCwgbiAtIDEpO1xuICAgIHJldHVybiBhcnJheTtcbn1cbmV4cG9ydHMucm90YXRlID0gcm90YXRlO1xuLyoqXG4gKiBVc2luZyBhIGJpbmFyeSBzZWFyY2gsIGZpbmQgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuXG4gKiBhcnJheSB3aGljaCBjb21wYXJlcyBgPj1gIHRvIGEgdmFsdWUuXG4gKlxuICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBiZSBzZWFyY2hlZC4gSXQgbXVzdCBiZSBzb3J0ZWRcbiAqICAgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBsb2NhdGUgaW4gdGhlIGFycmF5LlxuICpcbiAqIEBwYXJhbSBjbXAgLSBUaGUgY29tcGFyaXNvbiBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGB0cnVlYCBpZiBhblxuICogICBhcnJheSBlbGVtZW50IGlzIGxlc3MgdGhhbiB0aGUgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IGluIGBhcnJheWAgd2hpY2ggY29tcGFyZXNcbiAqICAgYD49YCB0byBgdmFsdWVgLCBvciBgYXJyYXkubGVuZ3RoYCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnQuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSXQgaXMgbm90IHNhZmUgZm9yIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgYXJyYXkuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBhcnJheXMgZnJvbSAncGhvc3Bob3ItYXJyYXlzJztcbiAqXG4gKiBmdW5jdGlvbiBudW1iZXJDbXAoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBib29sZWFuIHtcbiAqICAgcmV0dXJuIGEgPCBiO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzAsIDMsIDQsIDcsIDcsIDldO1xuICogYXJyYXlzLmxvd2VyQm91bmQoZGF0YSwgMCwgbnVtYmVyQ21wKTsgICAvLyAwXG4gKiBhcnJheXMubG93ZXJCb3VuZChkYXRhLCA2LCBudW1iZXJDbXApOyAgIC8vIDNcbiAqIGFycmF5cy5sb3dlckJvdW5kKGRhdGEsIDcsIG51bWJlckNtcCk7ICAgLy8gM1xuICogYXJyYXlzLmxvd2VyQm91bmQoZGF0YSwgLTEsIG51bWJlckNtcCk7ICAvLyAwXG4gKiBhcnJheXMubG93ZXJCb3VuZChkYXRhLCAxMCwgbnVtYmVyQ21wKTsgIC8vIDZcbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW3VwcGVyQm91bmRdXVxuICovXG5mdW5jdGlvbiBsb3dlckJvdW5kKGFycmF5LCB2YWx1ZSwgY21wKSB7XG4gICAgdmFyIGJlZ2luID0gMDtcbiAgICB2YXIgaGFsZjtcbiAgICB2YXIgbWlkZGxlO1xuICAgIHZhciBuID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChuID4gMCkge1xuICAgICAgICBoYWxmID0gbiA+PiAxO1xuICAgICAgICBtaWRkbGUgPSBiZWdpbiArIGhhbGY7XG4gICAgICAgIGlmIChjbXAoYXJyYXlbbWlkZGxlXSwgdmFsdWUpKSB7XG4gICAgICAgICAgICBiZWdpbiA9IG1pZGRsZSArIDE7XG4gICAgICAgICAgICBuIC09IGhhbGYgKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbiA9IGhhbGY7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJlZ2luO1xufVxuZXhwb3J0cy5sb3dlckJvdW5kID0gbG93ZXJCb3VuZDtcbi8qKlxuICogVXNpbmcgYSBiaW5hcnkgc2VhcmNoLCBmaW5kIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgZWxlbWVudCBpbiBhblxuICogYXJyYXkgd2hpY2ggY29tcGFyZXMgYD5gIHRoYW4gYSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgb2YgdmFsdWVzIHRvIGJlIHNlYXJjaGVkLiBJdCBtdXN0IGJlIHNvcnRlZFxuICogICBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIHRvIGxvY2F0ZSBpbiB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIGNtcCAtIFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYHRydWVgIGlmIHRoZVxuICogICB0aGUgZ2l2ZW4gdmFsdWUgaXMgbGVzcyB0aGFuIGFuIGFycmF5IGVsZW1lbnQuXG4gKlxuICogQHJldHVybnMgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IGluIGBhcnJheWAgd2hpY2ggY29tcGFyZXNcbiAqICAgYD5gIHRoYW4gYHZhbHVlYCwgb3IgYGFycmF5Lmxlbmd0aGAgaWYgdGhlcmUgaXMgbm8gc3VjaCBlbGVtZW50LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEl0IGlzIG5vdCBzYWZlIGZvciB0aGUgY29tcGFyaXNvbiBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIGFycmF5LlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0ICogYXMgYXJyYXlzIGZyb20gJ3Bob3NwaG9yLWFycmF5cyc7XG4gKlxuICogZnVuY3Rpb24gbnVtYmVyQ21wKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAqICAgcmV0dXJuIGEgPCBiO1xuICogfVxuICpcbiAqIHZhciBkYXRhID0gWzAsIDMsIDQsIDcsIDcsIDldO1xuICogYXJyYXlzLnVwcGVyQm91bmQoZGF0YSwgMCwgbnVtYmVyQ21wKTsgICAvLyAxXG4gKiBhcnJheXMudXBwZXJCb3VuZChkYXRhLCA2LCBudW1iZXJDbXApOyAgIC8vIDNcbiAqIGFycmF5cy51cHBlckJvdW5kKGRhdGEsIDcsIG51bWJlckNtcCk7ICAgLy8gNVxuICogYXJyYXlzLnVwcGVyQm91bmQoZGF0YSwgLTEsIG51bWJlckNtcCk7ICAvLyAwXG4gKiBhcnJheXMudXBwZXJCb3VuZChkYXRhLCAxMCwgbnVtYmVyQ21wKTsgIC8vIDZcbiAqIGBgYFxuICpcbiAqICoqU2VlIGFsc28qKiBbW2xvd2VyQm91bmRdXVxuICovXG5mdW5jdGlvbiB1cHBlckJvdW5kKGFycmF5LCB2YWx1ZSwgY21wKSB7XG4gICAgdmFyIGJlZ2luID0gMDtcbiAgICB2YXIgaGFsZjtcbiAgICB2YXIgbWlkZGxlO1xuICAgIHZhciBuID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChuID4gMCkge1xuICAgICAgICBoYWxmID0gbiA+PiAxO1xuICAgICAgICBtaWRkbGUgPSBiZWdpbiArIGhhbGY7XG4gICAgICAgIGlmIChjbXAodmFsdWUsIGFycmF5W21pZGRsZV0pKSB7XG4gICAgICAgICAgICBuID0gaGFsZjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2luID0gbWlkZGxlICsgMTtcbiAgICAgICAgICAgIG4gLT0gaGFsZiArIDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJlZ2luO1xufVxuZXhwb3J0cy51cHBlckJvdW5kID0gdXBwZXJCb3VuZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIGRpc3Bvc2FibGUgb2JqZWN0IHdoaWNoIGRlbGVnYXRlcyB0byBhIGNhbGxiYWNrLlxuICovXG52YXIgRGlzcG9zYWJsZURlbGVnYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSBuZXcgZGlzcG9zYWJsZSBkZWxlZ2F0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgZGVsZWdhdGUgaXNcbiAgICAgKiAgIGRpc3Bvc2VkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERpc3Bvc2FibGVEZWxlZ2F0ZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzcG9zYWJsZURlbGVnYXRlLnByb3RvdHlwZSwgXCJpc0Rpc3Bvc2VkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgZGVsZWdhdGUgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eSB3aGljaCBpcyBhbHdheXMgc2FmZSB0byBhY2Nlc3MuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5fY2FsbGJhY2s7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIERpc3Bvc2Ugb2YgdGhlIGRlbGVnYXRlIGFuZCBpbnZva2UgaXRzIGNhbGxiYWNrLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIElmIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBtb3JlIHRoYW4gb25jZSwgYWxsIGNhbGxzIG1hZGUgYWZ0ZXIgdGhlXG4gICAgICogZmlyc3Qgd2lsbCBiZSBhIG5vLW9wLlxuICAgICAqL1xuICAgIERpc3Bvc2FibGVEZWxlZ2F0ZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5fY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgaWYgKGNhbGxiYWNrKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9O1xuICAgIHJldHVybiBEaXNwb3NhYmxlRGVsZWdhdGU7XG59KSgpO1xuZXhwb3J0cy5EaXNwb3NhYmxlRGVsZWdhdGUgPSBEaXNwb3NhYmxlRGVsZWdhdGU7XG4vKipcbiAqIEFuIG9iamVjdCB3aGljaCBtYW5hZ2VzIGEgY29sbGVjdGlvbiBvZiBkaXNwb3NhYmxlIGl0ZW1zLlxuICovXG52YXIgRGlzcG9zYWJsZVNldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IGRpc3Bvc2FibGUgc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW1zIC0gVGhlIGluaXRpYWwgZGlzcG9zYWJsZSBpdGVtcyBmb3IgdGhlIHNldC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEaXNwb3NhYmxlU2V0KGl0ZW1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3NldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgaWYgKGl0ZW1zKVxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gX3RoaXMuX3NldC5hZGQoaXRlbSk7IH0pO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGlzcG9zYWJsZVNldC5wcm90b3R5cGUsIFwiaXNEaXNwb3NlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXN0IHdoZXRoZXIgdGhlIHNldCBoYXMgYmVlbiBkaXNwb3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5IHdoaWNoIGlzIGFsd2F5cyBzYWZlIHRvIGFjY2Vzcy5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLl9zZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIERpc3Bvc2Ugb2YgdGhlIHNldCBhbmQgZGlzcG9zZSB0aGUgaXRlbXMgaXQgY29udGFpbnMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSXRlbXMgYXJlIGRpc3Bvc2VkIGluIHRoZSBvcmRlciB0aGV5IGFyZSBhZGRlZCB0byB0aGUgc2V0LlxuICAgICAqXG4gICAgICogSXQgaXMgdW5zYWZlIHRvIHVzZSB0aGUgc2V0IGFmdGVyIGl0IGhhcyBiZWVuIGRpc3Bvc2VkLlxuICAgICAqXG4gICAgICogSWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBhbGwgY2FsbHMgbWFkZSBhZnRlciB0aGVcbiAgICAgKiBmaXJzdCB3aWxsIGJlIGEgbm8tb3AuXG4gICAgICovXG4gICAgRGlzcG9zYWJsZVNldC5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldCA9IHRoaXMuX3NldDtcbiAgICAgICAgdGhpcy5fc2V0ID0gbnVsbDtcbiAgICAgICAgaWYgKHNldClcbiAgICAgICAgICAgIHNldC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLmRpc3Bvc2UoKTsgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgYSBkaXNwb3NhYmxlIGl0ZW0gdG8gdGhlIHNldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpdGVtIC0gVGhlIGRpc3Bvc2FibGUgaXRlbSB0byBhZGQgdG8gdGhlIHNldC4gSWYgdGhlIGl0ZW1cbiAgICAgKiAgIGlzIGFscmVhZHkgY29udGFpbmVkIGluIHRoZSBzZXQsIHRoaXMgaXMgYSBuby1vcC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgc2V0IGhhcyBiZWVuIGRpc3Bvc2VkLlxuICAgICAqL1xuICAgIERpc3Bvc2FibGVTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmICghdGhpcy5fc2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBpcyBkaXNwb3NlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldC5hZGQoaXRlbSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBkaXNwb3NhYmxlIGl0ZW0gZnJvbSB0aGUgc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW0gLSBUaGUgZGlzcG9zYWJsZSBpdGVtIHRvIHJlbW92ZSBmcm9tIHRoZSBzZXQuIElmIHRoZVxuICAgICAqICAgaXRlbSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc2V0LCB0aGlzIGlzIGEgbm8tb3AuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHNldCBoYXMgYmVlbiBkaXNwb3NlZC5cbiAgICAgKi9cbiAgICBEaXNwb3NhYmxlU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoIXRoaXMuX3NldCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvYmplY3QgaXMgZGlzcG9zZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXQuZGVsZXRlKGl0ZW0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIGRpc3Bvc2FibGUgaXRlbXMgZnJvbSB0aGUgc2V0LlxuICAgICAqXG4gICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBzZXQgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICovXG4gICAgRGlzcG9zYWJsZVNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fc2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCBpcyBkaXNwb3NlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldC5jbGVhcigpO1xuICAgIH07XG4gICAgcmV0dXJuIERpc3Bvc2FibGVTZXQ7XG59KSgpO1xuZXhwb3J0cy5EaXNwb3NhYmxlU2V0ID0gRGlzcG9zYWJsZVNldDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsInZhciBjc3MgPSBcIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xcbnxcXG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXFxufFxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXFxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xcbmJvZHkucC1tb2Qtb3ZlcnJpZGUtY3Vyc29yICoge1xcbiAgY3Vyc29yOiBpbmhlcml0ICFpbXBvcnRhbnQ7XFxufVxcblwiOyAocmVxdWlyZShcImJyb3dzZXJpZnktY3NzXCIpLmNyZWF0ZVN0eWxlKGNzcywgeyBcImhyZWZcIjogXCJub2RlX21vZHVsZXMvcGhvc3Bob3ItZG9tdXRpbC9saWIvaW5kZXguY3NzXCJ9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHBob3NwaG9yX2Rpc3Bvc2FibGVfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLWRpc3Bvc2FibGUnKTtcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XG4vKipcbiAqIGBwLW1vZC1vdmVycmlkZS1jdXJzb3JgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byB0aGUgZG9jdW1lbnQgYm9keVxuICogICBkdXJpbmcgY3Vyc29yIG92ZXJyaWRlLlxuICovXG5leHBvcnRzLk9WRVJSSURFX0NVUlNPUl9DTEFTUyA9ICdwLW1vZC1vdmVycmlkZS1jdXJzb3InO1xuLyoqXG4gKiBUaGUgaWQgZm9yIHRoZSBhY3RpdmUgY3Vyc29yIG92ZXJyaWRlLlxuICovXG52YXIgb3ZlcnJpZGVJRCA9IDA7XG4vKipcbiAqIE92ZXJyaWRlIHRoZSBjdXJzb3IgZm9yIHRoZSBlbnRpcmUgZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIGN1cnNvciAtIFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJzb3Igc3R5bGUuXG4gKlxuICogQHJldHVybnMgQSBkaXNwb3NhYmxlIHdoaWNoIHdpbGwgY2xlYXIgdGhlIG92ZXJyaWRlIHdoZW4gZGlzcG9zZWQuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhlIG1vc3QgcmVjZW50IGNhbGwgdG8gYG92ZXJyaWRlQ3Vyc29yYCB0YWtlcyBwcmVjZW5kZW5jZS4gRGlzcG9zaW5nXG4gKiBhbiBvbGQgb3ZlcnJpZGUgaXMgYSBuby1vcCBhbmQgd2lsbCBub3QgZWZmZWN0IHRoZSBjdXJyZW50IG92ZXJyaWRlLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgb3ZlcnJpZGVDdXJzb3IgfSBmcm9tICdwaG9zcGhvci1kb211dGlsJztcbiAqXG4gKiAvLyBmb3JjZSB0aGUgY3Vyc29yIHRvIGJlICd3YWl0JyBmb3IgdGhlIGVudGlyZSBkb2N1bWVudFxuICogdmFyIG92ZXJyaWRlID0gb3ZlcnJpZGVDdXJzb3IoJ3dhaXQnKTtcbiAqXG4gKiAvLyBjbGVhciB0aGUgb3ZlcnJpZGUgYnkgZGlzcG9zaW5nIHRoZSByZXR1cm4gdmFsdWVcbiAqIG92ZXJyaWRlLmRpc3Bvc2UoKTtcbiAqIGBgYFxuICovXG5mdW5jdGlvbiBvdmVycmlkZUN1cnNvcihjdXJzb3IpIHtcbiAgICB2YXIgaWQgPSArK292ZXJyaWRlSUQ7XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIGJvZHkuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZChleHBvcnRzLk9WRVJSSURFX0NVUlNPUl9DTEFTUyk7XG4gICAgcmV0dXJuIG5ldyBwaG9zcGhvcl9kaXNwb3NhYmxlXzEuRGlzcG9zYWJsZURlbGVnYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlkID09PSBvdmVycmlkZUlEKSB7XG4gICAgICAgICAgICBib2R5LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKGV4cG9ydHMuT1ZFUlJJREVfQ1VSU09SX0NMQVNTKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5vdmVycmlkZUN1cnNvciA9IG92ZXJyaWRlQ3Vyc29yO1xuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBjbGllbnQgcG9zaXRpb24gbGllcyB3aXRoaW4gYSBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlIC0gVGhlIERPTSBub2RlIG9mIGludGVyZXN0LlxuICpcbiAqIEBwYXJhbSBjbGllbnRYIC0gVGhlIGNsaWVudCBYIGNvb3JkaW5hdGUgb2YgaW50ZXJlc3QuXG4gKlxuICogQHBhcmFtIGNsaWVudFkgLSBUaGUgY2xpZW50IFkgY29vcmRpbmF0ZSBvZiBpbnRlcmVzdC5cbiAqXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgY292ZXJzIHRoZSBwb3NpdGlvbiwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBoaXRUZXN0IH0gZnJvbSAncGhvc3Bob3ItZG9tdXRpbCc7XG4gKlxuICogdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICogZGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAqIGRpdi5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gKiBkaXYuc3R5bGUudG9wID0gJzBweCc7XG4gKiBkaXYuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xuICogZGl2LnN0eWxlLmhlaWdodCA9ICcxMDBweCc7XG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gKlxuICogaGl0VGVzdChkaXYsIDUwLCA1MCk7ICAgLy8gdHJ1ZVxuICogaGl0VGVzdChkaXYsIDE1MCwgMTUwKTsgLy8gZmFsc2VcbiAqIGBgYFxuICovXG5mdW5jdGlvbiBoaXRUZXN0KG5vZGUsIGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChjbGllbnRYID49IHJlY3QubGVmdCAmJlxuICAgICAgICBjbGllbnRYIDwgcmVjdC5yaWdodCAmJlxuICAgICAgICBjbGllbnRZID49IHJlY3QudG9wICYmXG4gICAgICAgIGNsaWVudFkgPCByZWN0LmJvdHRvbSk7XG59XG5leHBvcnRzLmhpdFRlc3QgPSBoaXRUZXN0O1xuLyoqXG4gKiBDb21wdXRlIHRoZSBib3ggc2l6aW5nIGZvciBhIERPTSBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlIC0gVGhlIERPTSBub2RlIGZvciB3aGljaCB0byBjb21wdXRlIHRoZSBib3ggc2l6aW5nLlxuICpcbiAqIEByZXR1cm5zIFRoZSBib3ggc2l6aW5nIGRhdGEgZm9yIHRoZSBzcGVjaWZpZWQgRE9NIG5vZGUuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBib3hTaXppbmcgfSBmcm9tICdwaG9zcGhvci1kb211dGlsJztcbiAqXG4gKiB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiBkaXYuc3R5bGUuYm9yZGVyVG9wID0gJ3NvbGlkIDEwcHggYmxhY2snO1xuICogZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICpcbiAqIHZhciBzaXppbmcgPSBib3hTaXppbmcoZGl2KTtcbiAqIHNpemluZy5ib3JkZXJUb3A7ICAgIC8vIDEwXG4gKiBzaXppbmcucGFkZGluZ0xlZnQ7ICAvLyAwXG4gKiAvLyBldGMuLi5cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBib3hTaXppbmcobm9kZSkge1xuICAgIHZhciBjc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICB2YXIgYnQgPSBwYXJzZUludChjc3R5bGUuYm9yZGVyVG9wV2lkdGgsIDEwKSB8fCAwO1xuICAgIHZhciBibCA9IHBhcnNlSW50KGNzdHlsZS5ib3JkZXJMZWZ0V2lkdGgsIDEwKSB8fCAwO1xuICAgIHZhciBiciA9IHBhcnNlSW50KGNzdHlsZS5ib3JkZXJSaWdodFdpZHRoLCAxMCkgfHwgMDtcbiAgICB2YXIgYmIgPSBwYXJzZUludChjc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgsIDEwKSB8fCAwO1xuICAgIHZhciBwdCA9IHBhcnNlSW50KGNzdHlsZS5wYWRkaW5nVG9wLCAxMCkgfHwgMDtcbiAgICB2YXIgcGwgPSBwYXJzZUludChjc3R5bGUucGFkZGluZ0xlZnQsIDEwKSB8fCAwO1xuICAgIHZhciBwciA9IHBhcnNlSW50KGNzdHlsZS5wYWRkaW5nUmlnaHQsIDEwKSB8fCAwO1xuICAgIHZhciBwYiA9IHBhcnNlSW50KGNzdHlsZS5wYWRkaW5nQm90dG9tLCAxMCkgfHwgMDtcbiAgICB2YXIgaHMgPSBibCArIHBsICsgcHIgKyBicjtcbiAgICB2YXIgdnMgPSBidCArIHB0ICsgcGIgKyBiYjtcbiAgICByZXR1cm4ge1xuICAgICAgICBib3JkZXJUb3A6IGJ0LFxuICAgICAgICBib3JkZXJMZWZ0OiBibCxcbiAgICAgICAgYm9yZGVyUmlnaHQ6IGJyLFxuICAgICAgICBib3JkZXJCb3R0b206IGJiLFxuICAgICAgICBwYWRkaW5nVG9wOiBwdCxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IHBsLFxuICAgICAgICBwYWRkaW5nUmlnaHQ6IHByLFxuICAgICAgICBwYWRkaW5nQm90dG9tOiBwYixcbiAgICAgICAgaG9yaXpvbnRhbFN1bTogaHMsXG4gICAgICAgIHZlcnRpY2FsU3VtOiB2cyxcbiAgICB9O1xufVxuZXhwb3J0cy5ib3hTaXppbmcgPSBib3hTaXppbmc7XG4vKipcbiAqIENvbXB1dGUgdGhlIHNpemUgbGltaXRzIGZvciBhIERPTSBub2RlLlxuICpcbiAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgZm9yIHdoaWNoIHRvIGNvbXB1dGUgdGhlIHNpemUgbGltaXRzLlxuICpcbiAqIEByZXR1cm5zIFRoZSBzaXplIGxpbWl0IGRhdGEgZm9yIHRoZSBzcGVjaWZpZWQgRE9NIG5vZGUuXG4gKlxuICogIyMjIyBFeGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBzaXplTGltaXRzIH0gZnJvbSAncGhvc3Bob3ItZG9tdXRpbCc7XG4gKlxuICogdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICogZGl2LnN0eWxlLm1pbldpZHRoID0gJzkwcHgnO1xuICogZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICpcbiAqIHZhciBsaW1pdHMgPSBzaXplTGltaXRzKGRpdik7XG4gKiBsaW1pdHMubWluV2lkdGg7ICAgLy8gOTBcbiAqIGxpbWl0cy5tYXhIZWlnaHQ7ICAvLyBJbmZpbml0eVxuICogLy8gZXRjLi4uXG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gc2l6ZUxpbWl0cyhub2RlKSB7XG4gICAgdmFyIGNzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG1pbldpZHRoOiBwYXJzZUludChjc3R5bGUubWluV2lkdGgsIDEwKSB8fCAwLFxuICAgICAgICBtaW5IZWlnaHQ6IHBhcnNlSW50KGNzdHlsZS5taW5IZWlnaHQsIDEwKSB8fCAwLFxuICAgICAgICBtYXhXaWR0aDogcGFyc2VJbnQoY3N0eWxlLm1heFdpZHRoLCAxMCkgfHwgSW5maW5pdHksXG4gICAgICAgIG1heEhlaWdodDogcGFyc2VJbnQoY3N0eWxlLm1heEhlaWdodCwgMTApIHx8IEluZmluaXR5LFxuICAgIH07XG59XG5leHBvcnRzLnNpemVMaW1pdHMgPSBzaXplTGltaXRzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwidmFyIGNzcyA9IFwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXFxufFxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cXG58XFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXFxuLnAtTWVudSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogM3B4IDBweDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICBvdmVyZmxvdy14OiBoaWRkZW47XFxuICBvdmVyZmxvdy15OiBhdXRvO1xcbiAgei1pbmRleDogMTAwMDAwO1xcbn1cXG4ucC1NZW51LWNvbnRlbnQge1xcbiAgZGlzcGxheTogdGFibGU7XFxuICB3aWR0aDogMTAwJTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuLnAtTWVudS1pdGVtIHtcXG4gIGRpc3BsYXk6IHRhYmxlLXJvdztcXG59XFxuLnAtTWVudS1pdGVtLnAtbW9kLWhpZGRlbixcXG4ucC1NZW51LWl0ZW0ucC1tb2QtZm9yY2UtaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi5wLU1lbnUtaXRlbSA+IHNwYW4ge1xcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcXG4gIHBhZGRpbmctdG9wOiA0cHg7XFxuICBwYWRkaW5nLWJvdHRvbTogNHB4O1xcbn1cXG4ucC1NZW51LWl0ZW0taWNvbiB7XFxuICB3aWR0aDogMjFweDtcXG4gIHBhZGRpbmctbGVmdDogMnB4O1xcbiAgcGFkZGluZy1yaWdodDogMnB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4ucC1NZW51LWl0ZW0tdGV4dCB7XFxuICBwYWRkaW5nLWxlZnQ6IDJweDtcXG4gIHBhZGRpbmctcmlnaHQ6IDM1cHg7XFxufVxcbi5wLU1lbnUtaXRlbS1zaG9ydGN1dCB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG59XFxuLnAtTWVudS1pdGVtLXN1Ym1lbnUtaWNvbiB7XFxuICB3aWR0aDogMTZweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLnAtTWVudS1pdGVtLnAtbW9kLXNlcGFyYXRvci10eXBlID4gc3BhbiB7XFxuICBwYWRkaW5nOiAwO1xcbiAgaGVpZ2h0OiA5cHg7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIHRleHQtaW5kZW50OiAxMDAlO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHdoaXRlc3BhY2U6IG5vd3JhcDtcXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxuICAvKiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02MzQ0ODkgKi9cXG59XFxuLnAtTWVudS1pdGVtLnAtbW9kLXNlcGFyYXRvci10eXBlID4gc3Bhbjo6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHRvcDogNHB4O1xcbn1cXG4ucC1NZW51QmFyLWNvbnRlbnQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcbi5wLU1lbnVCYXItaXRlbSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG4ucC1NZW51QmFyLWl0ZW0ucC1tb2QtaGlkZGVuLFxcbi5wLU1lbnVCYXItaXRlbS5wLW1vZC1mb3JjZS1oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCI7IChyZXF1aXJlKFwiYnJvd3NlcmlmeS1jc3NcIikuY3JlYXRlU3R5bGUoY3NzLCB7IFwiaHJlZlwiOiBcIm5vZGVfbW9kdWxlcy9waG9zcGhvci1tZW51cy9saWIvaW5kZXguY3NzXCJ9KSk7IG1vZHVsZS5leHBvcnRzID0gY3NzOyIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuZnVuY3Rpb24gX19leHBvcnQobSkge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcbn1cbl9fZXhwb3J0KHJlcXVpcmUoJy4vbWVudScpKTtcbl9fZXhwb3J0KHJlcXVpcmUoJy4vbWVudWJhcicpKTtcbl9fZXhwb3J0KHJlcXVpcmUoJy4vbWVudWJhc2UnKSk7XG5fX2V4cG9ydChyZXF1aXJlKCcuL21lbnVpdGVtJykpO1xucmVxdWlyZSgnLi9pbmRleC5jc3MnKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgcGhvc3Bob3JfZG9tdXRpbF8xID0gcmVxdWlyZSgncGhvc3Bob3ItZG9tdXRpbCcpO1xudmFyIHBob3NwaG9yX3NpZ25hbGluZ18xID0gcmVxdWlyZSgncGhvc3Bob3Itc2lnbmFsaW5nJyk7XG52YXIgcGhvc3Bob3Jfd2lkZ2V0XzEgPSByZXF1aXJlKCdwaG9zcGhvci13aWRnZXQnKTtcbnZhciBtZW51YmFzZV8xID0gcmVxdWlyZSgnLi9tZW51YmFzZScpO1xudmFyIG1lbnVpdGVtXzEgPSByZXF1aXJlKCcuL21lbnVpdGVtJyk7XG4vKipcbiAqIGBwLU1lbnVgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBNZW51IGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0cy5NRU5VX0NMQVNTID0gJ3AtTWVudSc7XG4vKipcbiAqIGBwLU1lbnUtY29udGVudGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgbWVudSBjb250ZW50IG5vZGUuXG4gKi9cbmV4cG9ydHMuQ09OVEVOVF9DTEFTUyA9ICdwLU1lbnUtY29udGVudCc7XG4vKipcbiAqIGBwLU1lbnUtaXRlbWA6IHRoZSBjbGFzcyBuYW1lIGFzc2lnbmVkIHRvIGEgbWVudSBpdGVtLlxuICovXG5leHBvcnRzLk1FTlVfSVRFTV9DTEFTUyA9ICdwLU1lbnUtaXRlbSc7XG4vKipcbiAqIGBwLU1lbnUtaXRlbS1pY29uYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGl0ZW0gaWNvbiBjZWxsLlxuICovXG5leHBvcnRzLklDT05fQ0xBU1MgPSAncC1NZW51LWl0ZW0taWNvbic7XG4vKipcbiAqIGBwLU1lbnUtaXRlbS10ZXh0YDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGl0ZW0gdGV4dCBjZWxsLlxuICovXG5leHBvcnRzLlRFWFRfQ0xBU1MgPSAncC1NZW51LWl0ZW0tdGV4dCc7XG4vKipcbiAqIGBwLU1lbnUtaXRlbS1zaG9ydGN1dGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgbWVudSBpdGVtIHNob3J0Y3V0IGNlbGwuXG4gKi9cbmV4cG9ydHMuU0hPUlRDVVRfQ0xBU1MgPSAncC1NZW51LWl0ZW0tc2hvcnRjdXQnO1xuLyoqXG4gKiBgcC1NZW51LWl0ZW0tc3VibWVudS1pY29uYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGl0ZW0gc3VibWVudSBpY29uIGNlbGwuXG4gKi9cbmV4cG9ydHMuU1VCTUVOVV9JQ09OX0NMQVNTID0gJ3AtTWVudS1pdGVtLXN1Ym1lbnUtaWNvbic7XG4vKipcbiAqIGBwLW1vZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgY2hlY2sgdHlwZSBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuQ0hFQ0tfVFlQRV9DTEFTUyA9ICdwLW1vZC1jaGVjay10eXBlJztcbi8qKlxuICogYHAtbW9kYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBzZXBhcmF0b3IgdHlwZSBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuU0VQQVJBVE9SX1RZUEVfQ0xBU1MgPSAncC1tb2Qtc2VwYXJhdG9yLXR5cGUnO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhY3RpdmUgbWVudSBpdGVtcy5cbiAqL1xuZXhwb3J0cy5BQ1RJVkVfQ0xBU1MgPSAncC1tb2QtYWN0aXZlJztcbi8qKlxuICogYHAtbW9kYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBkaXNhYmxlZCBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuRElTQUJMRURfQ0xBU1MgPSAncC1tb2QtZGlzYWJsZWQnO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIGhpZGRlbiBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuSElEREVOX0NMQVNTID0gJ3AtbW9kLWhpZGRlbic7XG4vKipcbiAqIGBwLW1vZGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgZm9yY2UgaGlkZGVuIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MgPSAncC1tb2QtZm9yY2UtaGlkZGVuJztcbi8qKlxuICogYHAtbW9kYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBjaGVja2VkIG1lbnUgaXRlbS5cbiAqL1xuZXhwb3J0cy5DSEVDS0VEX0NMQVNTID0gJ3AtbW9kLWNoZWNrZWQnO1xuLyoqXG4gKiBgcC1tb2RgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIG1lbnUgaXRlbSB3aXRoIGEgc3VibWVudS5cbiAqL1xuZXhwb3J0cy5IQVNfU1VCTUVOVV9DTEFTUyA9ICdwLW1vZC1oYXMtc3VibWVudSc7XG4vKipcbiAqIFRoZSBkZWxheSwgaW4gbXMsIGZvciBvcGVuaW5nIGEgc3VibWVudS5cbiAqL1xudmFyIE9QRU5fREVMQVkgPSAzMDA7XG4vKipcbiAqIFRoZSBkZWxheSwgaW4gbXMsIGZvciBjbG9zaW5nIGEgc3VibWVudS5cbiAqL1xudmFyIENMT1NFX0RFTEFZID0gMzAwO1xuLyoqXG4gKiBUaGUgaG9yaXpvbnRhbCBvdmVybGFwIHRvIHVzZSBmb3Igc3VibWVudXMuXG4gKi9cbnZhciBTVUJNRU5VX09WRVJMQVAgPSAzO1xuLyoqXG4gKiBBIHdpZGdldCB3aGljaCBkaXNwbGF5cyBtZW51IGl0ZW1zIGFzIGEgcG9wdXAgbWVudS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBBIGBNZW51YCB3aWRnZXQgZG9lcyBub3Qgc3VwcG9ydCBjaGlsZCB3aWRnZXRzLiBBZGRpbmcgY2hpbGRyZW5cbiAqIHRvIGEgYE1lbnVgIHdpbGwgcmVzdWx0IGluIHVuZGVmaW5lZCBiZWhhdmlvci5cbiAqL1xudmFyIE1lbnUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNZW51LCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBtZW51LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLl9vcGVuVGltZXJJZCA9IDA7XG4gICAgICAgIHRoaXMuX2Nsb3NlVGltZXJJZCA9IDA7XG4gICAgICAgIHRoaXMuX3BhcmVudE1lbnUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jaGlsZE1lbnUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jaGlsZEl0ZW0gPSBudWxsO1xuICAgICAgICB0aGlzLmFkZENsYXNzKGV4cG9ydHMuTUVOVV9DTEFTUyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0aGUgRE9NIG5vZGUgZm9yIGEgbWVudS5cbiAgICAgKi9cbiAgICBNZW51LmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gZXhwb3J0cy5DT05URU5UX0NMQVNTO1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgY29udmVuaWVuY2UgbWV0aG9kIHRvIGNyZWF0ZSBhIG1lbnUgZnJvbSBhIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IC0gVGhlIG1lbnUgaXRlbSB0ZW1wbGF0ZXMgZm9yIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBuZXcgbWVudSBjcmVhdGVkIGZyb20gdGhlIG1lbnUgaXRlbSB0ZW1wbGF0ZXMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogU3VibWVudSB0ZW1wbGF0ZXMgd2lsbCBiZSByZWN1cnNpdmVseSBjcmVhdGVkIHVzaW5nIHRoZVxuICAgICAqIGBNZW51LmZyb21UZW1wbGF0ZWAgbWV0aG9kLiBJZiBjdXN0b20gbWVudXMgb3IgbWVudSBpdGVtc1xuICAgICAqIGFyZSByZXF1aXJlZCwgdXNlIHRoZSByZWxldmFudCBjb25zdHJ1Y3RvcnMgZGlyZWN0bHkuXG4gICAgICovXG4gICAgTWVudS5mcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgdmFyIG1lbnUgPSBuZXcgTWVudSgpO1xuICAgICAgICBtZW51Lml0ZW1zID0gYXJyYXkubWFwKGNyZWF0ZU1lbnVJdGVtKTtcbiAgICAgICAgcmV0dXJuIG1lbnU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNwb3NlIG9mIHRoZSByZXNvdXJjZXMgaGVsZCBieSB0aGUgbWVudS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsb3NlKHRydWUpO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRpc3Bvc2UuY2FsbCh0aGlzKTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51LnByb3RvdHlwZSwgXCJjbG9zZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBzaWduYWwgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGl0ZW0gaXMgY2xvc2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2Nsb3NlZFNpZ25hbF1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudS5jbG9zZWRTaWduYWwuYmluZCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnUucHJvdG90eXBlLCBcInBhcmVudE1lbnVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBwYXJlbnQgbWVudSBvZiB0aGUgbWVudS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHdpbGwgYmUgbnVsbCBpZiB0aGUgbWVudSBpcyBub3QgYW4gb3BlbiBzdWJtZW51LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50TWVudTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnUucHJvdG90eXBlLCBcImNoaWxkTWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGNoaWxkIG1lbnUgb2YgdGhlIG1lbnUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGJlIG51bGwgaWYgdGhlIG1lbnUgZG9lcyBub3QgaGF2ZSBhbiBvcGVuIHN1Ym1lbnUuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZE1lbnU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51LnByb3RvdHlwZSwgXCJyb290TWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5kIHRoZSByb290IG1lbnUgb2YgdGhpcyBtZW51IGhpZXJhcmNoeS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lbnUgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKG1lbnUuX3BhcmVudE1lbnUpIHtcbiAgICAgICAgICAgICAgICBtZW51ID0gbWVudS5fcGFyZW50TWVudTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZW51O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudS5wcm90b3R5cGUsIFwibGVhZk1lbnVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogRmluZCB0aGUgbGVhZiBtZW51IG9mIHRoaXMgbWVudSBoaWVyYXJjaHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtZW51ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlIChtZW51Ll9jaGlsZE1lbnUpIHtcbiAgICAgICAgICAgICAgICBtZW51ID0gbWVudS5fY2hpbGRNZW51O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lbnU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFBvcHVwIHRoZSBtZW51IGF0IHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGUgbWVudSB3aWxsIGJlIG9wZW5lZCBhdCB0aGUgZ2l2ZW4gbG9jYXRpb24gdW5sZXNzIGl0IHdpbGwgbm90XG4gICAgICogZnVsbHkgZml0IG9uIHRoZSBzY3JlZW4uIElmIGl0IHdpbGwgbm90IGZpdCwgaXQgd2lsbCBiZSBhZGp1c3RlZFxuICAgICAqIHRvIGZpdCBuYXR1cmFsbHkgb24gdGhlIHNjcmVlbi4gVGhlIGxhc3QgdHdvIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBjb250cm9sIHdoZXRoZXIgdGhlIHByb3ZpZGVkIGNvb3JkaW5hdGUgdmFsdWUgbXVzdCBiZSBvYmV5ZWQuXG4gICAgICpcbiAgICAgKiBXaGVuIHRoZSBtZW51IGlzIG9wZW5lZCBhcyBhIHBvcHVwIG1lbnUsIGl0IHdpbGwgaGFuZGxlIGFsbCBrZXlcbiAgICAgKiBldmVudHMgcmVsYXRlZCB0byBtZW51IG5hdmlnYXRpb24gYXMgd2VsbCBhcyBjbG9zaW5nIHRoZSBtZW51XG4gICAgICogd2hlbiB0aGUgbW91c2UgaXMgcHJlc3NlZCBvdXRzaWRlIG9mIHRoZSBtZW51IGhpZXJhcmNoeS4gVG9cbiAgICAgKiBwcmV2ZW50IHRoZXNlIGFjdGlvbnMsIHVzZSB0aGUgJ29wZW4nIG1ldGhvZCBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHggLSBUaGUgY2xpZW50IFggY29vcmRpbmF0ZSBvZiB0aGUgcG9wdXAgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geSAtIFRoZSBjbGllbnQgWSBjb29yZGluYXRlIG9mIHRoZSBwb3B1cCBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZVggLSBXaGV0aGVyIHRoZSBYIGNvb3JkaW5hdGUgbXVzdCBiZSBvYmV5ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9yY2VZIC0gV2hldGhlciB0aGUgWSBjb29yZGluYXRlIG11c3QgYmUgb2JleWVkLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW29wZW5dXVxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLnBvcHVwID0gZnVuY3Rpb24gKHgsIHksIGZvcmNlWCwgZm9yY2VZKSB7XG4gICAgICAgIGlmIChmb3JjZVggPT09IHZvaWQgMCkgeyBmb3JjZVggPSBmYWxzZTsgfVxuICAgICAgICBpZiAoZm9yY2VZID09PSB2b2lkIDApIHsgZm9yY2VZID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKCF0aGlzLmlzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgb3BlblJvb3RNZW51KHRoaXMsIHgsIHksIGZvcmNlWCwgZm9yY2VZKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogT3BlbiB0aGUgbWVudSBhdCB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLlxuICAgICAqXG4gICAgICogVGhlIG1lbnUgd2lsbCBiZSBvcGVuZWQgYXQgdGhlIGdpdmVuIGxvY2F0aW9uIHVubGVzcyBpdCB3aWxsIG5vdFxuICAgICAqIGZ1bGx5IGZpdCBvbiB0aGUgc2NyZWVuLiBJZiBpdCB3aWxsIG5vdCBmaXQsIGl0IHdpbGwgYmUgYWRqdXN0ZWRcbiAgICAgKiB0byBmaXQgbmF0dXJhbGx5IG9uIHRoZSBzY3JlZW4uIFRoZSBsYXN0IHR3byBvcHRpb25hbCBwYXJhbWV0ZXJzXG4gICAgICogY29udHJvbCB3aGV0aGVyIHRoZSBwcm92aWRlZCBjb29yZGluYXRlIHZhbHVlIG11c3QgYmUgb2JleWVkLlxuICAgICAqXG4gICAgICogV2hlbiB0aGUgbWVudSBpcyBvcGVuZWQgd2l0aCB0aGlzIG1ldGhvZCwgaXQgd2lsbCBub3QgaGFuZGxlIGtleVxuICAgICAqIGV2ZW50cyBmb3IgbmF2aWdhdGlvbiwgbm9yIHdpbGwgaXQgY2xvc2UgaXRzZWxmIHdoZW4gdGhlIG1vdXNlIGlzXG4gICAgICogcHJlc3NlZCBvdXRzaWRlIHRoZSBtZW51IGhpZXJhcmNoeS4gVGhpcyBpcyB1c2VmdWwgd2hlbiB1c2luZyB0aGVcbiAgICAgKiBtZW51IGZyb20gYSBtZW51YmFyLCB3aGVyZSB0aGlzIG1lbnViYXIgc2hvdWxkIGhhbmRsZSB0aGVzZSB0YXNrcy5cbiAgICAgKiBVc2UgdGhlIGBwb3B1cGAgbWV0aG9kIGZvciB0aGUgYWx0ZXJuYXRpdmUgYmVoYXZpb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCAtIFRoZSBjbGllbnQgWCBjb29yZGluYXRlIG9mIHRoZSBwb3B1cCBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIGNsaWVudCBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvcHVwIGxvY2F0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlWCAtIFdoZXRoZXIgdGhlIFggY29vcmRpbmF0ZSBtdXN0IGJlIG9iZXllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZVkgLSBXaGV0aGVyIHRoZSBZIGNvb3JkaW5hdGUgbXVzdCBiZSBvYmV5ZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbcG9wdXBdXVxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoeCwgeSwgZm9yY2VYLCBmb3JjZVkpIHtcbiAgICAgICAgaWYgKGZvcmNlWCA9PT0gdm9pZCAwKSB7IGZvcmNlWCA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChmb3JjZVkgPT09IHZvaWQgMCkgeyBmb3JjZVkgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoIXRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICBvcGVuUm9vdE1lbnUodGhpcywgeCwgeSwgZm9yY2VYLCBmb3JjZVkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIERPTSBldmVudHMgZm9yIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IC0gVGhlIERPTSBldmVudCBzZW50IHRvIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGltcGxlbWVudHMgdGhlIERPTSBgRXZlbnRMaXN0ZW5lcmAgaW50ZXJmYWNlIGFuZCBpc1xuICAgICAqIGNhbGxlZCBpbiByZXNwb25zZSB0byBldmVudHMgb24gdGhlIG1lbnUncyBET00gbm9kZXMuIEl0IHNob3VsZFxuICAgICAqIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgYnkgdXNlciBjb2RlLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbW91c2VlbnRlcic6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0TW91c2VFbnRlcihldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWxlYXZlJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRNb3VzZUxlYXZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZ0TW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dE1vdXNlVXAoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29udGV4dG1lbnUnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dENvbnRleHRNZW51KGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dEtleURvd24oZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5cHJlc3MnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dEtleVByZXNzKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIHRoZSBtZW51IGl0ZW1zIGNoYW5nZS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vbkl0ZW1zQ2hhbmdlZCA9IGZ1bmN0aW9uIChvbGQsIGl0ZW1zKSB7XG4gICAgICAgIHRoaXMuY2xvc2UodHJ1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gdGhlIGFjdGl2ZSBpbmRleCBjaGFuZ2VzLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLm9uQWN0aXZlSW5kZXhDaGFuZ2VkID0gZnVuY3Rpb24gKG9sZCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIG9sZE5vZGUgPSB0aGlzLl9pdGVtTm9kZUF0KG9sZCk7XG4gICAgICAgIHZhciBuZXdOb2RlID0gdGhpcy5faXRlbU5vZGVBdChpbmRleCk7XG4gICAgICAgIGlmIChvbGROb2RlKVxuICAgICAgICAgICAgb2xkTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGV4cG9ydHMuQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgaWYgKG5ld05vZGUpXG4gICAgICAgICAgICBuZXdOb2RlLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5BQ1RJVkVfQ0xBU1MpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIGEgbWVudSBpdGVtIHNob3VsZCBiZSBvcGVuZWQuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25PcGVuSXRlbSA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2l0ZW1Ob2RlQXQoaW5kZXgpIHx8IHRoaXMubm9kZTtcbiAgICAgICAgdGhpcy5fb3BlbkNoaWxkTWVudShpdGVtLCBub2RlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX2NoaWxkTWVudS5hY3RpdmF0ZU5leHRJdGVtKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gYSBtZW51IGl0ZW0gc2hvdWxkIGJlIHRyaWdnZXJlZC5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5vblRyaWdnZXJJdGVtID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgIHRoaXMucm9vdE1lbnUuY2xvc2UoKTtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBpdGVtLmhhbmRsZXI7XG4gICAgICAgIGlmIChoYW5kbGVyKVxuICAgICAgICAgICAgaGFuZGxlcihpdGVtKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYW4gYCdhZnRlci1hdHRhY2gnYCBtZXNzYWdlLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLm9uQWZ0ZXJBdHRhY2ggPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25CZWZvcmVEZXRhY2ggPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcywgdHJ1ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgdGhpcywgdHJ1ZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMsIHRydWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBoYW5kbGVyIGludm9rZWQgb24gYW4gYCd1cGRhdGUtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25VcGRhdGVSZXF1ZXN0ID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG5vZGVzIGZvciB0aGUgbWVudS5cbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5pdGVtcztcbiAgICAgICAgdmFyIGNvdW50ID0gaXRlbXMubGVuZ3RoO1xuICAgICAgICB2YXIgbm9kZXMgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gY3JlYXRlSXRlbU5vZGUoaXRlbXNbaV0pO1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcyk7XG4gICAgICAgICAgICBub2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yY2UgaGlkZSB0aGUgbGVhZGluZyB2aXNpYmxlIHNlcGFyYXRvcnMuXG4gICAgICAgIGZvciAodmFyIGsxID0gMDsgazEgPCBjb3VudDsgKytrMSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1zW2sxXS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXRlbXNbazFdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZXNbazFdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcmNlIGhpZGUgdGhlIHRyYWlsaW5nIHZpc2libGUgc2VwYXJhdG9ycy5cbiAgICAgICAgZm9yICh2YXIgazIgPSBjb3VudCAtIDE7IGsyID49IDA7IC0tazIpIHtcbiAgICAgICAgICAgIGlmIChpdGVtc1trMl0uaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWl0ZW1zW2syXS5pc1NlcGFyYXRvclR5cGUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVzW2syXS5jbGFzc0xpc3QuYWRkKGV4cG9ydHMuRk9SQ0VfSElEREVOX0NMQVNTKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3JjZSBoaWRlIHRoZSByZW1haW5pbmcgY29uc2VjdXRpdmUgdmlzaWJsZSBzZXBhcmF0b3JzLlxuICAgICAgICB2YXIgaGlkZSA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoKytrMSA8IGsyKSB7XG4gICAgICAgICAgICBpZiAoaXRlbXNbazFdLmhpZGRlbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpZGUgJiYgaXRlbXNbazFdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIG5vZGVzW2sxXS5jbGFzc0xpc3QuYWRkKGV4cG9ydHMuRk9SQ0VfSElEREVOX0NMQVNTKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpZGUgPSBpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZldGNoIHRoZSBjb250ZW50IG5vZGUuXG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIC8vIFJlZnJlc2ggdGhlIGNvbnRlbnQgbm9kZSdzIGNvbnRlbnQuXG4gICAgICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKG5vZGVzW2ldKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2xvc2UtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUub25DbG9zZVJlcXVlc3QgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIC8vIFJlc2V0IHRoZSBtZW51IHN0YXRlLlxuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nT3BlbigpO1xuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nQ2xvc2UoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IC0xO1xuICAgICAgICAvLyBDbG9zZSBhbnkgb3BlbiBjaGlsZCBtZW51LlxuICAgICAgICB2YXIgY2hpbGRNZW51ID0gdGhpcy5fY2hpbGRNZW51O1xuICAgICAgICBpZiAoY2hpbGRNZW51KSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZE1lbnUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY2hpbGRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIGNoaWxkTWVudS5jbG9zZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBtZW51IGZyb20gYW55IHBhcmVudC5cbiAgICAgICAgdmFyIHBhcmVudE1lbnUgPSB0aGlzLl9wYXJlbnRNZW51O1xuICAgICAgICBpZiAocGFyZW50TWVudSkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50TWVudSA9IG51bGw7XG4gICAgICAgICAgICBwYXJlbnRNZW51Ll9jYW5jZWxQZW5kaW5nT3BlbigpO1xuICAgICAgICAgICAgcGFyZW50TWVudS5fY2FuY2VsUGVuZGluZ0Nsb3NlKCk7XG4gICAgICAgICAgICBwYXJlbnRNZW51Ll9jaGlsZE1lbnUgPSBudWxsO1xuICAgICAgICAgICAgcGFyZW50TWVudS5fY2hpbGRJdGVtID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgdGhpcyBtZW51IGlzIGRldGFjaGVkLlxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQodm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX3dpZGdldF8xLmRldGFjaFdpZGdldCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQodm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbGVhciB0aGUgY29udGVudCBub2RlLlxuICAgICAgICB0aGlzLm5vZGUuZmlyc3RDaGlsZC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNlZW50ZXInYCBldmVudCBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSBjaGlsZCBpdGVtIG5vZGVzLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9ldnRNb3VzZUVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3N5bmNBbmNlc3RvcnMoKTtcbiAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgdGhpcy5fY2FuY2VsUGVuZGluZ09wZW4oKTtcbiAgICAgICAgdmFyIG5vZGUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gdGhpcy5faXRlbU5vZGVJbmRleChub2RlKTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuYWN0aXZlSW5kZXhdO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLnN1Ym1lbnUpIHtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSB0aGlzLl9jaGlsZEl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX29wZW5DaGlsZE1lbnUoaXRlbSwgbm9kZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdtb3VzZWxlYXZlJ2AgZXZlbnQgZm9yIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBsaXN0ZW5lciBpcyBvbmx5IGF0dGFjaGVkIHRvIHRoZSBtZW51IG5vZGUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dE1vdXNlTGVhdmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fY2FuY2VsUGVuZGluZ09wZW4oKTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5fY2hpbGRNZW51O1xuICAgICAgICBpZiAoIWNoaWxkIHx8ICFwaG9zcGhvcl9kb211dGlsXzEuaGl0VGVzdChjaGlsZC5ub2RlLCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IC0xO1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNldXAnYCBldmVudCBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSBtZW51IG5vZGUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dE1vdXNlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2l0ZW1Ob2RlQXQodGhpcy5hY3RpdmVJbmRleCk7XG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQWN0aXZlSXRlbSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnY29udGV4dG1lbnUnYCBldmVudCBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9ldnRDb250ZXh0TWVudSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdtb3VzZWRvd24nYCBldmVudCBmb3IgdGhlIG1lbnUuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBmb3IgYSBwb3B1cCBtZW51LlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9ldnRNb3VzZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIG1lbnUgPSB0aGlzO1xuICAgICAgICB2YXIgaGl0ID0gZmFsc2U7XG4gICAgICAgIHZhciB4ID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgdmFyIHkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICB3aGlsZSAoIWhpdCAmJiBtZW51KSB7XG4gICAgICAgICAgICBoaXQgPSBwaG9zcGhvcl9kb211dGlsXzEuaGl0VGVzdChtZW51Lm5vZGUsIHgsIHkpO1xuICAgICAgICAgICAgbWVudSA9IG1lbnUuX2NoaWxkTWVudTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhpdClcbiAgICAgICAgICAgIHRoaXMuY2xvc2UodHJ1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAna2V5ZG93bidgIGV2ZW50IGZvciB0aGUgbWVudS5cbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIGRvY3VtZW50IGZvciBhIHBvcHVwIG1lbnUuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2V2dEtleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHZhciBsZWFmID0gdGhpcy5sZWFmTWVudTtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGVhZi50cmlnZ2VyQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxlYWYuY2xvc2UodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWYgIT09IHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIGxlYWYuY2xvc2UodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGVhZi5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxlYWYub3BlbkFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZWFmLmFjdGl2YXRlTmV4dEl0ZW0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ2tleXByZXNzJ2AgZXZlbnQgZm9yIHRoZSBtZW51LlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgZm9yIGEgcG9wdXAgbWVudS5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fZXZ0S2V5UHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMubGVhZk1lbnUuYWN0aXZhdGVNbmVtb25pY0l0ZW0oU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgdGhlIGFjdGl2ZSBpdGVtIGhpZXJhcmNoeSBzdGFydGluZyB3aXRoIHRoZSBwYXJlbnQuXG4gICAgICpcbiAgICAgKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgcHJvcGVyIGNoaWxkIGl0ZW1zIGFyZSBhY3RpdmF0ZWQgZm9yIHRoZVxuICAgICAqIGFuY2VzdG9yIG1lbnUgaGllcmFyY2h5IGFuZCB0aGF0IGFueSBwZW5kaW5nIG9wZW4gb3IgY2xvc2VcbiAgICAgKiB0YXNrcyBhcmUgY2xlYXJlZC5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fc3luY0FuY2VzdG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lbnUgPSB0aGlzLl9wYXJlbnRNZW51O1xuICAgICAgICB3aGlsZSAobWVudSkge1xuICAgICAgICAgICAgbWVudS5fc3luY0NoaWxkSXRlbSgpO1xuICAgICAgICAgICAgbWVudSA9IG1lbnUuX3BhcmVudE1lbnU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplIHRoZSBhY3RpdmUgaW5kZXggd2l0aCB0aGUgY3VycmVudCBjaGlsZCBpdGVtLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9zeW5jQ2hpbGRJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nT3BlbigpO1xuICAgICAgICB0aGlzLl9jYW5jZWxQZW5kaW5nQ2xvc2UoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0aGlzLl9jaGlsZEl0ZW0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogT3BlbiB0aGUgbWVudSBpdGVtJ3Mgc3VibWVudSB1c2luZyB0aGUgbm9kZSBmb3IgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBJZiB0aGUgZ2l2ZW4gaXRlbSBpcyBhbHJlYWR5IG9wZW4sIHRoaXMgaXMgYSBuby1vcC5cbiAgICAgKlxuICAgICAqIEFueSBwZW5kaW5nIG9wZW4gb3BlcmF0aW9uIHdpbGwgYmUgY2FuY2VsbGVkIGJlZm9yZSBvcGVuaW5nXG4gICAgICogdGhlIG1lbnUgb3IgcXVldWVpbmcgdGhlIGRlbGF5ZWQgdGFzayB0byBvcGVuIHRoZSBtZW51LlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9vcGVuQ2hpbGRNZW51ID0gZnVuY3Rpb24gKGl0ZW0sIG5vZGUsIGRlbGF5ZWQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuX2NoaWxkSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhbmNlbFBlbmRpbmdPcGVuKCk7XG4gICAgICAgIGlmIChkZWxheWVkKSB7XG4gICAgICAgICAgICB0aGlzLl9vcGVuVGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBtZW51ID0gaXRlbS5zdWJtZW51O1xuICAgICAgICAgICAgICAgIF90aGlzLl9vcGVuVGltZXJJZCA9IDA7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkTWVudSA9IG1lbnU7XG4gICAgICAgICAgICAgICAgbWVudS5fcGFyZW50TWVudSA9IF90aGlzO1xuICAgICAgICAgICAgICAgIG1lbnUudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgICAgIG9wZW5TdWJtZW51KG1lbnUsIG5vZGUpO1xuICAgICAgICAgICAgfSwgT1BFTl9ERUxBWSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbWVudSA9IGl0ZW0uc3VibWVudTtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICB0aGlzLl9jaGlsZE1lbnUgPSBtZW51O1xuICAgICAgICAgICAgbWVudS5fcGFyZW50TWVudSA9IHRoaXM7XG4gICAgICAgICAgICBtZW51LnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIG9wZW5TdWJtZW51KG1lbnUsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgY3VycmVudGx5IG9wZW4gY2hpbGQgbWVudSB1c2luZyBhIGRlbGF5ZWQgdGFzay5cbiAgICAgKlxuICAgICAqIElmIGEgdGFzayBpcyBwZW5kaW5nIG9yIGlmIHRoZXJlIGlzIG5vIGNoaWxkIG1lbnUsIHRoaXMgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fY2xvc2VDaGlsZE1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLl9jbG9zZVRpbWVySWQgfHwgIXRoaXMuX2NoaWxkTWVudSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Nsb3NlVGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuX2Nsb3NlVGltZXJJZCA9IDA7XG4gICAgICAgICAgICBpZiAoX3RoaXMuX2NoaWxkTWVudSkge1xuICAgICAgICAgICAgICAgIF90aGlzLl9jaGlsZE1lbnUuY2xvc2UodHJ1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIENMT1NFX0RFTEFZKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENhbmNlbCBhbnkgcGVuZGluZyBjaGlsZCBtZW51IG9wZW4gdGFzay5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fY2FuY2VsUGVuZGluZ09wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9vcGVuVGltZXJJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX29wZW5UaW1lcklkKTtcbiAgICAgICAgICAgIHRoaXMuX29wZW5UaW1lcklkID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2FuY2VsIGFueSBwZW5kaW5nIGNoaWxkIG1lbnUgY2xvc2UgdGFzay5cbiAgICAgKi9cbiAgICBNZW51LnByb3RvdHlwZS5fY2FuY2VsUGVuZGluZ0Nsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fY2xvc2VUaW1lcklkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY2xvc2VUaW1lcklkKTtcbiAgICAgICAgICAgIHRoaXMuX2Nsb3NlVGltZXJJZCA9IDA7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbWVudSBpdGVtIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIHJldHVybiBgdW5kZWZpbmVkYCBpZiB0aGUgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICAgICAqL1xuICAgIE1lbnUucHJvdG90eXBlLl9pdGVtTm9kZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHJldHVybiBjb250ZW50LmNoaWxkcmVuW2luZGV4XTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIG1lbnUgaXRlbSBub2RlLlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIHJldHVybiBgLTFgIGlmIHRoZSBtZW51IGl0ZW0gbm9kZSBpcyBub3QgZm91bmQuXG4gICAgICovXG4gICAgTWVudS5wcm90b3R5cGUuX2l0ZW1Ob2RlSW5kZXggPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubm9kZS5maXJzdENoaWxkO1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChjb250ZW50LmNoaWxkcmVuLCBub2RlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgc2lnbmFsIGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2xvc2VkXV1cbiAgICAgKi9cbiAgICBNZW51LmNsb3NlZFNpZ25hbCA9IG5ldyBwaG9zcGhvcl9zaWduYWxpbmdfMS5TaWduYWwoKTtcbiAgICByZXR1cm4gTWVudTtcbn0pKG1lbnViYXNlXzEuTWVudUJhc2UpO1xuZXhwb3J0cy5NZW51ID0gTWVudTtcbi8qKlxuICogQ3JlYXRlIGEgbWVudSBpdGVtIGZyb20gYSB0ZW1wbGF0ZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVudUl0ZW0odGVtcGxhdGUpIHtcbiAgICByZXR1cm4gbWVudWl0ZW1fMS5NZW51SXRlbS5mcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xufVxuLyoqXG4gKiBDcmVhdGUgdGhlIGNvbXBsZXRlIERPTSBub2RlIGNsYXNzIG5hbWUgZm9yIGEgTWVudUl0ZW0uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW1DbGFzc05hbWUoaXRlbSkge1xuICAgIHZhciBwYXJ0cyA9IFtleHBvcnRzLk1FTlVfSVRFTV9DTEFTU107XG4gICAgaWYgKGl0ZW0uaXNDaGVja1R5cGUpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkNIRUNLX1RZUEVfQ0xBU1MpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpdGVtLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICBwYXJ0cy5wdXNoKGV4cG9ydHMuU0VQQVJBVE9SX1RZUEVfQ0xBU1MpO1xuICAgIH1cbiAgICBpZiAoaXRlbS5jaGVja2VkKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5DSEVDS0VEX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgcGFydHMucHVzaChleHBvcnRzLkRJU0FCTEVEX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uaGlkZGVuKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5ISURERU5fQ0xBU1MpO1xuICAgIH1cbiAgICBpZiAoaXRlbS5zdWJtZW51KSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5IQVNfU1VCTUVOVV9DTEFTUyk7XG4gICAgfVxuICAgIGlmIChpdGVtLmNsYXNzTmFtZSkge1xuICAgICAgICBwYXJ0cy5wdXNoKGl0ZW0uY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJyAnKTtcbn1cbi8qKlxuICogQ3JlYXRlIHRoZSBET00gbm9kZSBmb3IgYSBNZW51SXRlbS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSXRlbU5vZGUoaXRlbSkge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIHNob3J0Y3V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHZhciBzdWJtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIG5vZGUuY2xhc3NOYW1lID0gY3JlYXRlSXRlbUNsYXNzTmFtZShpdGVtKTtcbiAgICBpY29uLmNsYXNzTmFtZSA9IGV4cG9ydHMuSUNPTl9DTEFTUztcbiAgICB0ZXh0LmNsYXNzTmFtZSA9IGV4cG9ydHMuVEVYVF9DTEFTUztcbiAgICBzaG9ydGN1dC5jbGFzc05hbWUgPSBleHBvcnRzLlNIT1JUQ1VUX0NMQVNTO1xuICAgIHN1Ym1lbnUuY2xhc3NOYW1lID0gZXhwb3J0cy5TVUJNRU5VX0lDT05fQ0xBU1M7XG4gICAgaWYgKCFpdGVtLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gaXRlbS50ZXh0LnJlcGxhY2UoLyYvZywgJycpO1xuICAgICAgICBzaG9ydGN1dC50ZXh0Q29udGVudCA9IGl0ZW0uc2hvcnRjdXQ7XG4gICAgfVxuICAgIG5vZGUuYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgbm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBub2RlLmFwcGVuZENoaWxkKHNob3J0Y3V0KTtcbiAgICBub2RlLmFwcGVuZENoaWxkKHN1Ym1lbnUpO1xuICAgIHJldHVybiBub2RlO1xufVxuLyoqXG4gKiBHZXQgdGhlIGN1cnJlbnRseSB2aXNpYmxlIHZpZXdwb3J0IHJlY3QgaW4gcGFnZSBjb29yZGluYXRlcy5cbiAqL1xuZnVuY3Rpb24gY2xpZW50Vmlld3BvcnRSZWN0KCkge1xuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciB4ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgIHZhciB5ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIHZhciB3aWR0aCA9IGVsZW0uY2xpZW50V2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IGVsZW0uY2xpZW50SGVpZ2h0O1xuICAgIHJldHVybiB7IHg6IHgsIHk6IHksIHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfTtcbn1cbi8qKlxuICogTW91bnQgdGhlIG1lbnUgYXMgaGlkZGVuIGFuZCBjb21wdXRlIGl0cyBvcHRpbWFsIHNpemUuXG4gKlxuICogSWYgdGhlIHZlcnRpY2FsIHNjcm9sbGJhciBiZWNvbWUgdmlzaWJsZSwgdGhlIG1lbnUgd2lsbCBiZSBleHBhbmRlZFxuICogYnkgdGhlIHNjcm9sbGJhciB3aWR0aCB0byBwcmV2ZW50IGNsaXBwaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgbWVudS5cbiAqL1xuZnVuY3Rpb24gbW91bnRBbmRNZWFzdXJlKG1lbnUsIG1heEhlaWdodCkge1xuICAgIHZhciBub2RlID0gbWVudS5ub2RlO1xuICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG4gICAgc3R5bGUudG9wID0gJyc7XG4gICAgc3R5bGUubGVmdCA9ICcnO1xuICAgIHN0eWxlLndpZHRoID0gJyc7XG4gICAgc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIHN0eWxlLm1heEhlaWdodCA9IG1heEhlaWdodCArICdweCc7XG4gICAgcGhvc3Bob3Jfd2lkZ2V0XzEuYXR0YWNoV2lkZ2V0KG1lbnUsIGRvY3VtZW50LmJvZHkpO1xuICAgIGlmIChub2RlLnNjcm9sbEhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgICBzdHlsZS53aWR0aCA9IDIgKiBub2RlLm9mZnNldFdpZHRoIC0gbm9kZS5jbGllbnRXaWR0aCArICdweCc7XG4gICAgfVxuICAgIHZhciByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4geyB3aWR0aDogcmVjdC53aWR0aCwgaGVpZ2h0OiByZWN0LmhlaWdodCB9O1xufVxuLyoqXG4gKiBTaG93IHRoZSBtZW51IGF0IHRoZSBzcGVjaWZpZWQgcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3dNZW51KG1lbnUsIHgsIHkpIHtcbiAgICB2YXIgc3R5bGUgPSBtZW51Lm5vZGUuc3R5bGU7XG4gICAgc3R5bGUudG9wID0gTWF0aC5tYXgoMCwgeSkgKyAncHgnO1xuICAgIHN0eWxlLmxlZnQgPSBNYXRoLm1heCgwLCB4KSArICdweCc7XG4gICAgc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xufVxuLyoqXG4gKiBPcGVuIHRoZSBtZW51IGFzIGEgcm9vdCBtZW51IGF0IHRoZSB0YXJnZXQgbG9jYXRpb24uXG4gKi9cbmZ1bmN0aW9uIG9wZW5Sb290TWVudShtZW51LCB4LCB5LCBmb3JjZVgsIGZvcmNlWSkge1xuICAgIHZhciByZWN0ID0gY2xpZW50Vmlld3BvcnRSZWN0KCk7XG4gICAgdmFyIHNpemUgPSBtb3VudEFuZE1lYXN1cmUobWVudSwgcmVjdC5oZWlnaHQgLSAoZm9yY2VZID8geSA6IDApKTtcbiAgICBpZiAoIWZvcmNlWCAmJiAoeCArIHNpemUud2lkdGggPiByZWN0LnggKyByZWN0LndpZHRoKSkge1xuICAgICAgICB4ID0gcmVjdC54ICsgcmVjdC53aWR0aCAtIHNpemUud2lkdGg7XG4gICAgfVxuICAgIGlmICghZm9yY2VZICYmICh5ICsgc2l6ZS5oZWlnaHQgPiByZWN0LnkgKyByZWN0LmhlaWdodCkpIHtcbiAgICAgICAgaWYgKHkgPiByZWN0LnkgKyByZWN0LmhlaWdodCkge1xuICAgICAgICAgICAgeSA9IHJlY3QueSArIHJlY3QuaGVpZ2h0IC0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5ID0geSAtIHNpemUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dNZW51KG1lbnUsIHgsIHkpO1xufVxuLyoqXG4gKiBPcGVuIGEgdGhlIG1lbnUgYXMgYSBzdWJtZW51IHVzaW5nIHRoZSBpdGVtIG5vZGUgZm9yIHBvc2l0aW9uaW5nLlxuICovXG5mdW5jdGlvbiBvcGVuU3VibWVudShtZW51LCBpdGVtKSB7XG4gICAgdmFyIHJlY3QgPSBjbGllbnRWaWV3cG9ydFJlY3QoKTtcbiAgICB2YXIgc2l6ZSA9IG1vdW50QW5kTWVhc3VyZShtZW51LCByZWN0LmhlaWdodCk7XG4gICAgdmFyIGJveCA9IHBob3NwaG9yX2RvbXV0aWxfMS5ib3hTaXppbmcobWVudS5ub2RlKTtcbiAgICB2YXIgaXRlbVJlY3QgPSBpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciB4ID0gaXRlbVJlY3QucmlnaHQgLSBTVUJNRU5VX09WRVJMQVA7XG4gICAgdmFyIHkgPSBpdGVtUmVjdC50b3AgLSBib3guYm9yZGVyVG9wIC0gYm94LnBhZGRpbmdUb3A7XG4gICAgaWYgKHggKyBzaXplLndpZHRoID4gcmVjdC54ICsgcmVjdC53aWR0aCkge1xuICAgICAgICB4ID0gaXRlbVJlY3QubGVmdCArIFNVQk1FTlVfT1ZFUkxBUCAtIHNpemUud2lkdGg7XG4gICAgfVxuICAgIGlmICh5ICsgc2l6ZS5oZWlnaHQgPiByZWN0LnkgKyByZWN0LmhlaWdodCkge1xuICAgICAgICB5ID0gaXRlbVJlY3QuYm90dG9tICsgYm94LmJvcmRlckJvdHRvbSArIGJveC5wYWRkaW5nQm90dG9tIC0gc2l6ZS5oZWlnaHQ7XG4gICAgfVxuICAgIHNob3dNZW51KG1lbnUsIHgsIHkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVudS5qcy5tYXAiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIHBob3NwaG9yX2RvbXV0aWxfMSA9IHJlcXVpcmUoJ3Bob3NwaG9yLWRvbXV0aWwnKTtcbnZhciBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1wcm9wZXJ0aWVzJyk7XG52YXIgbWVudWJhc2VfMSA9IHJlcXVpcmUoJy4vbWVudWJhc2UnKTtcbnZhciBtZW51aXRlbV8xID0gcmVxdWlyZSgnLi9tZW51aXRlbScpO1xuLyoqXG4gKiBgcC1NZW51QmFyYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBtZW51IGJhciB3aWRnZXQuXG4gKi9cbmV4cG9ydHMuTUVOVV9CQVJfQ0xBU1MgPSAncC1NZW51QmFyJztcbi8qKlxuICogYHAtTWVudUJhci1jb250ZW50YDogdGhlIGNsYXNzIG5hbWUgYXNzaWduZWQgdG8gYSBjb250ZW50IG5vZGUuXG4gKi9cbmV4cG9ydHMuQ09OVEVOVF9DTEFTUyA9ICdwLU1lbnVCYXItY29udGVudCc7XG4vKipcbiAqIGBwLU1lbnVCYXItbWVudWA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGFuIG9wZW4gbWVudS5cbiAqL1xuZXhwb3J0cy5NRU5VX0NMQVNTID0gJ3AtTWVudUJhci1tZW51Jztcbi8qKlxuICogYHAtTWVudUJhci1pdGVtYDogdGhlIGNsYXNzIG5hbWUgYXNzaWduZWQgdG8gYSBtZW51IGl0ZW0uXG4gKi9cbmV4cG9ydHMuTUVOVV9JVEVNX0NMQVNTID0gJ3AtTWVudUJhci1pdGVtJztcbi8qKlxuICogYHAtTWVudUJhci1pdGVtLWljb25gOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhbiBpdGVtIGljb24gY2VsbC5cbiAqL1xuZXhwb3J0cy5JQ09OX0NMQVNTID0gJ3AtTWVudUJhci1pdGVtLWljb24nO1xuLyoqXG4gKiBgcC1NZW51QmFyLWl0ZW0tdGV4dGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGFuIGl0ZW0gdGV4dCBjZWxsLlxuICovXG5leHBvcnRzLlRFWFRfQ0xBU1MgPSAncC1NZW51QmFyLWl0ZW0tdGV4dCc7XG4vKipcbiAqIGBwLW1vZC1zZXBhcmF0b3ItdHlwZWA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgc2VwYXJhdG9yIGl0ZW0uXG4gKi9cbmV4cG9ydHMuU0VQQVJBVE9SX1RZUEVfQ0xBU1MgPSAncC1tb2Qtc2VwYXJhdG9yLXR5cGUnO1xuLyoqXG4gKiBgcC1tb2QtYWN0aXZlYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYW4gYWN0aXZlIG1lbnUgYmFyIGFuZCBpdGVtLlxuICovXG5leHBvcnRzLkFDVElWRV9DTEFTUyA9ICdwLW1vZC1hY3RpdmUnO1xuLyoqXG4gKiBgcC1tb2QtZGlzYWJsZWRgOiB0aGUgY2xhc3MgbmFtZSBhZGRlZCB0byBhIGRpc2FibGVkIGl0ZW0uXG4gKi9cbmV4cG9ydHMuRElTQUJMRURfQ0xBU1MgPSAncC1tb2QtZGlzYWJsZWQnO1xuLyoqXG4gKiBgcC1tb2QtaGlkZGVuYDogdGhlIGNsYXNzIG5hbWUgYWRkZWQgdG8gYSBoaWRkZW4gaXRlbS5cbiAqL1xuZXhwb3J0cy5ISURERU5fQ0xBU1MgPSAncC1tb2QtaGlkZGVuJztcbi8qKlxuICogYHAtbW9kLWZvcmNlLWhpZGRlbmA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGEgZm9yY2UgaGlkZGVuIGl0ZW0uXG4gKi9cbmV4cG9ydHMuRk9SQ0VfSElEREVOX0NMQVNTID0gJ3AtbW9kLWZvcmNlLWhpZGRlbic7XG4vKipcbiAqIEEgd2lkZ2V0IHdoaWNoIGRpc3BsYXlzIG1lbnUgaXRlbXMgYXMgYSBtZW51IGJhci5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBBIGBNZW51QmFyYCB3aWRnZXQgZG9lcyBub3Qgc3VwcG9ydCBjaGlsZCB3aWRnZXRzLiBBZGRpbmcgY2hpbGRyZW5cbiAqIHRvIGEgYE1lbnVCYXJgIHdpbGwgcmVzdWx0IGluIHVuZGVmaW5lZCBiZWhhdmlvci5cbiAqL1xudmFyIE1lbnVCYXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNZW51QmFyLCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBtZW51IGJhci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBNZW51QmFyKCkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoZXhwb3J0cy5NRU5VX0JBUl9DTEFTUyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0aGUgRE9NIG5vZGUgZm9yIGEgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250ZW50LmNsYXNzTmFtZSA9IGV4cG9ydHMuQ09OVEVOVF9DTEFTUztcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBtZW51IGJhciBmcm9tIGEgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgLSBUaGUgbWVudSBpdGVtIHRlbXBsYXRlcyBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBuZXcgbWVudSBiYXIgY3JlYXRlZCBmcm9tIHRoZSBtZW51IGl0ZW0gdGVtcGxhdGVzLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFN1Ym1lbnUgdGVtcGxhdGVzIHdpbGwgYmUgcmVjdXJzaXZlbHkgY3JlYXRlZCB1c2luZyB0aGVcbiAgICAgKiBgTWVudS5mcm9tVGVtcGxhdGVgIG1ldGhvZC4gSWYgY3VzdG9tIG1lbnVzIG9yIG1lbnUgaXRlbXNcbiAgICAgKiBhcmUgcmVxdWlyZWQsIHVzZSB0aGUgcmVsZXZhbnQgY29uc3RydWN0b3JzIGRpcmVjdGx5LlxuICAgICAqL1xuICAgIE1lbnVCYXIuZnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgIHZhciBiYXIgPSBuZXcgTWVudUJhcigpO1xuICAgICAgICBiYXIuaXRlbXMgPSBhcnJheS5tYXAoY3JlYXRlTWVudUl0ZW0pO1xuICAgICAgICByZXR1cm4gYmFyO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRGlzcG9zZSBvZiB0aGUgcmVzb3VyY2VzIGhlbGQgYnkgdGhlIHBhbmVsLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGlzcG9zZS5jYWxsKHRoaXMpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVCYXIucHJvdG90eXBlLCBcImNoaWxkTWVudVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGNoaWxkIG1lbnUgb2YgdGhlIG1lbnUgYmFyLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBgbnVsbGAgaWYgdGhlIG1lbnUgYmFyIGRvZXMgbm90IGhhdmUgYW4gb3BlbiBtZW51LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRNZW51O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIERPTSBldmVudHMgZm9yIHRoZSBtZW51IGJhci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCAtIFRoZSBET00gZXZlbnQgc2VudCB0byB0aGUgbWVudSBiYXIuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgaW1wbGVtZW50cyB0aGUgRE9NIGBFdmVudExpc3RlbmVyYCBpbnRlcmZhY2UgYW5kIGlzXG4gICAgICogY2FsbGVkIGluIHJlc3BvbnNlIHRvIGV2ZW50cyBvbiB0aGUgbWVudSdzIERPTSBub2Rlcy4gSXQgc2hvdWxkXG4gICAgICogbm90IGJlIGNhbGxlZCBkaXJlY3RseSBieSB1c2VyIGNvZGUuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dE1vdXNlRG93bihldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2dE1vdXNlTW92ZShldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWxlYXZlJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRNb3VzZUxlYXZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbnRleHRtZW51JzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRDb250ZXh0TWVudShldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRLZXlEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleXByZXNzJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldnRLZXlQcmVzcyhldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiB0aGUgbWVudSBpdGVtcyBjaGFuZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25JdGVtc0NoYW5nZWQgPSBmdW5jdGlvbiAob2xkLCBpdGVtcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IG9sZC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eS5nZXRDaGFuZ2VkKG9sZFtpXSkuZGlzY29ubmVjdCh0aGlzLl9vbkl0ZW1DaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGl0ZW1zLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5LmdldENoYW5nZWQoaXRlbXNbaV0pLmNvbm5lY3QodGhpcy5fb25JdGVtQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gdGhlIGFjdGl2ZSBpbmRleCBjaGFuZ2VzLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLm9uQWN0aXZlSW5kZXhDaGFuZ2VkID0gZnVuY3Rpb24gKG9sZCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIG9sZE5vZGUgPSB0aGlzLl9pdGVtTm9kZUF0KG9sZCk7XG4gICAgICAgIHZhciBuZXdOb2RlID0gdGhpcy5faXRlbU5vZGVBdChpbmRleCk7XG4gICAgICAgIGlmIChvbGROb2RlKVxuICAgICAgICAgICAgb2xkTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGV4cG9ydHMuQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgaWYgKG5ld05vZGUpXG4gICAgICAgICAgICBuZXdOb2RlLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5BQ1RJVkVfQ0xBU1MpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIGEgbWVudSBpdGVtIHNob3VsZCBiZSBvcGVuZWQuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25PcGVuSXRlbSA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2l0ZW1Ob2RlQXQoaW5kZXgpIHx8IHRoaXMubm9kZTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcbiAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgdGhpcy5fb3BlbkNoaWxkTWVudShpdGVtLnN1Ym1lbnUsIG5vZGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhbiBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25BZnRlckF0dGFjaCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25CZWZvcmVEZXRhY2ggPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCB0aGlzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgaGFuZGxlciBpbnZva2VkIG9uIGFuIGAndXBkYXRlLXJlcXVlc3QnYCBtZXNzYWdlLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLm9uVXBkYXRlUmVxdWVzdCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgLy8gUmVzZXQgdGhlIHN0YXRlIG9mIHRoZSBtZW51IGJhci5cbiAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBub2RlcyBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgICB2YXIgY291bnQgPSBpdGVtcy5sZW5ndGg7XG4gICAgICAgIHZhciBub2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICAgICAgbm9kZXNbaV0gPSBjcmVhdGVJdGVtTm9kZShpdGVtc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yY2UgaGlkZSB0aGUgbGVhZGluZyB2aXNpYmxlIHNlcGFyYXRvcnMuXG4gICAgICAgIGZvciAodmFyIGsxID0gMDsgazEgPCBjb3VudDsgKytrMSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1zW2sxXS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXRlbXNbazFdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZXNbazFdLmNsYXNzTGlzdC5hZGQoZXhwb3J0cy5GT1JDRV9ISURERU5fQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcmNlIGhpZGUgdGhlIHRyYWlsaW5nIHZpc2libGUgc2VwYXJhdG9ycy5cbiAgICAgICAgZm9yICh2YXIgazIgPSBjb3VudCAtIDE7IGsyID49IDA7IC0tazIpIHtcbiAgICAgICAgICAgIGlmIChpdGVtc1trMl0uaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWl0ZW1zW2syXS5pc1NlcGFyYXRvclR5cGUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGVzW2syXS5jbGFzc0xpc3QuYWRkKGV4cG9ydHMuRk9SQ0VfSElEREVOX0NMQVNTKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3JjZSBoaWRlIHRoZSByZW1haW5pbmcgY29uc2VjdXRpdmUgdmlzaWJsZSBzZXBhcmF0b3JzLlxuICAgICAgICB2YXIgaGlkZSA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoKytrMSA8IGsyKSB7XG4gICAgICAgICAgICBpZiAoaXRlbXNbazFdLmhpZGRlbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhpZGUgJiYgaXRlbXNbazFdLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgIG5vZGVzW2sxXS5jbGFzc0xpc3QuYWRkKGV4cG9ydHMuRk9SQ0VfSElEREVOX0NMQVNTKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpZGUgPSBpdGVtc1trMV0uaXNTZXBhcmF0b3JUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZldGNoIHRoZSBjb250ZW50IG5vZGUuXG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIC8vIFJlZnJlc2ggdGhlIGNvbnRlbnQgbm9kZSdzIGNvbnRlbnQuXG4gICAgICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKG5vZGVzW2ldKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAnY2xvc2UtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUub25DbG9zZVJlcXVlc3QgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUub25DbG9zZVJlcXVlc3QuY2FsbCh0aGlzLCBtc2cpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgJ21vdXNlZG93bidgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2V2dE1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIHZhciB5ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgLy8gSWYgdGhlIGJhciBpcyBhY3RpdmUgYW5kIHRoZSBtb3VzZSBwcmVzcyBpcyBvbiBhbiBvcGVuIG1lbnUsXG4gICAgICAgIC8vIGxldCB0aGF0IG1lbnUgaGFuZGxlIHRoZSBwcmVzcy4gVGhlIGJhciB3aWxsIHJlc2V0IHdoZW4gdGhlXG4gICAgICAgIC8vIG1lbnUgZW1pdHMgaXRzIGBjbG9zZWRgIHNpZ25hbC5cbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSAmJiBoaXRUZXN0TWVudXModGhpcy5fY2hpbGRNZW51LCB4LCB5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBtb3VzZSB3YXMgcHJlc3NlZCBvbiBvbmUgb2YgdGhlIG1lbnUgaXRlbXMuXG4gICAgICAgIHZhciBpID0gdGhpcy5faGl0VGVzdEl0ZW1Ob2Rlcyh4LCB5KTtcbiAgICAgICAgLy8gSWYgdGhlIGJhciBpcyBhY3RpdmUsIGRlYWN0aXZhdGUgaXQgYW5kIGNsb3NlIHRoZSBjaGlsZCBtZW51LlxuICAgICAgICAvLyBUaGUgYWN0aXZlIGluZGV4IGlzIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgbW91c2UgcHJlc3MsIHdoaWNoXG4gICAgICAgIC8vIGlzIGVpdGhlciB2YWxpZCwgb3IgYC0xYC5cbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBiYXIgaXMgbm90IGFjdGl2ZS4gSWYgdGhlIG1vdXNlIHByZXNzXG4gICAgICAgIC8vIHdhcyBub3Qgb24gYSBtZW51IGl0ZW0sIGNsZWFyIHRoZSBhY3RpdmUgaW5kZXggYW5kIHJldHVybi5cbiAgICAgICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gLTE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB0aGUgcHJlc3Mgd2FzIG9uIGEgbWVudSBpdGVtLiBBY3RpdmF0ZSB0aGUgYmFyLFxuICAgICAgICAvLyB1cGRhdGUgdGhlIGFjdGl2ZSBpbmRleCwgYW5kIG9wZW4gdGhlIG1lbnUgaXRlbSBpZiBwb3NzaWJsZS5cbiAgICAgICAgdGhpcy5fYWN0aXZhdGUoKTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGk7XG4gICAgICAgIHRoaXMub3BlbkFjdGl2ZUl0ZW0oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdtb3VzZW1vdmUnYCBldmVudCBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9ldnRNb3VzZU1vdmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICB2YXIgeSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBtb3VzZSBpcyBvdmVyIG9uZSBvZiB0aGUgbWVudSBpdGVtcy5cbiAgICAgICAgdmFyIGkgPSB0aGlzLl9oaXRUZXN0SXRlbU5vZGVzKHgsIHkpO1xuICAgICAgICAvLyBCYWlsIGVhcmx5IGlmIHRoZSBhY3RpdmUgaW5kZXggd2lsbCBub3QgY2hhbmdlLlxuICAgICAgICBpZiAoaSA9PT0gdGhpcy5hY3RpdmVJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJhaWwgZWFybHkgaWYgdGhlIGJhciBpcyBhY3RpdmUgYW5kIHRoZSBtb3VzZSBpcyBub3Qgb3ZlciBhblxuICAgICAgICAvLyBpdGVtLiBUaGlzIGFsbG93cyB0aGUgbGVhZGluZyBhbmQgdHJhaWxpbmcgbWVudXMgdG8gYmUga2VwdFxuICAgICAgICAvLyBvcGVuIHdoZW4gdGhlIG1vdXNlIGlzIG92ZXIgdGhlIGVtcHR5IHBhcnQgb2YgdGhlIG1lbnUgYmFyLlxuICAgICAgICBpZiAoaSA9PT0gLTEgJiYgdGhpcy5fYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBhY3RpdmUgaW5kZXggdG8gdGhlIGhvdmVyZWQgaXRlbS5cbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGk7XG4gICAgICAgIC8vIElmIHRoZSBiYXIgaXMgbm90IGFjdGl2ZSwgdGhlcmUncyBub3RoaW5nIG1vcmUgdG8gZG8uXG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjbG9zZSB0aGUgY3VycmVudCBjaGlsZCBtZW51IGFuZCBvcGVuIHRoZSBuZXcgb25lLlxuICAgICAgICB0aGlzLl9jbG9zZUNoaWxkTWVudSgpO1xuICAgICAgICB0aGlzLm9wZW5BY3RpdmVJdGVtKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnbW91c2VsZWF2ZSdgIGV2ZW50IGZvciB0aGUgbWVudSBiYXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2V2dE1vdXNlTGVhdmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmUpXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAnY29udGV4dG1lbnUnYCBldmVudCBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9ldnRDb250ZXh0TWVudSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgYCdrZXlkb3duJ2AgZXZlbnQgZm9yIHRoZSBtZW51IGJhci5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fZXZ0S2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIG1lbnUgPSB0aGlzLl9jaGlsZE1lbnU7XG4gICAgICAgIHZhciBsZWFmID0gbWVudSAmJiBtZW51LmxlYWZNZW51O1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZilcbiAgICAgICAgICAgICAgICAgICAgbGVhZi50cmlnZ2VyQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFmKVxuICAgICAgICAgICAgICAgICAgICBsZWFmLmNsb3NlKHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFmICYmIGxlYWYgIT09IG1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5jbG9zZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Nsb3NlQ2hpbGRNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVQcmV2aW91c0l0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAobGVhZilcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChsZWFmICYmIGFjdGl2ZUhhc01lbnUobGVhZikpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZi5vcGVuQWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xvc2VDaGlsZE1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZU5leHRJdGVtKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWYpXG4gICAgICAgICAgICAgICAgICAgIGxlYWYuYWN0aXZhdGVOZXh0SXRlbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGAna2V5cHJlc3MnYCBldmVudCBmb3IgdGhlIG1lbnUgYmFyLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9ldnRLZXlQcmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIHN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xuICAgICAgICAodGhpcy5fY2hpbGRNZW51IHx8IHRoaXMpLmFjdGl2YXRlTW5lbW9uaWNJdGVtKHN0cik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBPcGVuIHRoZSBjaGlsZCBtZW51IHVzaW5nIHRoZSBnaXZlbiBpdGVtIG5vZGUgZm9yIGxvY2F0aW9uLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9vcGVuQ2hpbGRNZW51ID0gZnVuY3Rpb24gKG1lbnUsIG5vZGUpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLl9jaGlsZE1lbnUgPSBtZW51O1xuICAgICAgICBtZW51LmFkZENsYXNzKGV4cG9ydHMuTUVOVV9DTEFTUyk7XG4gICAgICAgIG1lbnUub3BlbihyZWN0LmxlZnQsIHJlY3QuYm90dG9tLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIG1lbnUuY2xvc2VkLmNvbm5lY3QodGhpcy5fb25NZW51Q2xvc2VkLCB0aGlzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBjdXJyZW50IGNoaWxkIG1lbnUsIGlmIG9uZSBleGlzdHMuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2Nsb3NlQ2hpbGRNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWVudSA9IHRoaXMuX2NoaWxkTWVudTtcbiAgICAgICAgaWYgKG1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgICAgICBtZW51LmNsb3NlZC5kaXNjb25uZWN0KHRoaXMuX29uTWVudUNsb3NlZCwgdGhpcyk7XG4gICAgICAgICAgICBtZW51LnJlbW92ZUNsYXNzKGV4cG9ydHMuTUVOVV9DTEFTUyk7XG4gICAgICAgICAgICBtZW51LmNsb3NlKHRydWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0ZSB0aGUgbWVudSBiYXIgYW5kIHN3aXRjaCB0aGUgbW91c2UgbGlzdGVuZXJzIHRvIGdsb2JhbC5cbiAgICAgKlxuICAgICAqIFRoZSBsaXN0ZW5lcnMgYXJlIHN3aXRjaGVkIGFmdGVyIHRoZSBjdXJyZW50IGV2ZW50IGRpc3BhdGNoIGlzXG4gICAgICogY29tcGxldGUuIE90aGVyd2lzZSwgZHVwbGljYXRlIGV2ZW50IG5vdGlmaWNhdGlvbnMgY291bGQgb2NjdXIuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2FjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhleHBvcnRzLkFDVElWRV9DTEFTUyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfdGhpcyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgX3RoaXMsIHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBfdGhpcywgdHJ1ZSk7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRGVhY3RpdmF0ZSB0aGUgbWVudSBiYXIgc3dpdGNoIHRoZSBtb3VzZSBsaXN0ZW5lcnMgdG8gbG9jYWwuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdGVuZXJzIGFyZSBzd2l0Y2hlZCBhZnRlciB0aGUgY3VycmVudCBldmVudCBkaXNwYXRjaCBpc1xuICAgICAqIGNvbXBsZXRlLiBPdGhlcndpc2UsIGR1cGxpY2F0ZSBldmVudCBub3RpZmljYXRpb25zIGNvdWxkIG9jY3VyLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGV4cG9ydHMuQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF90aGlzKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF90aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfdGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIF90aGlzLCB0cnVlKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgbWVudSBiYXIgdG8gaXRzIGRlZmF1bHQgc3RhdGUuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX3Jlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlKCk7XG4gICAgICAgIHRoaXMuX2Nsb3NlQ2hpbGRNZW51KCk7XG4gICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSAtMTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbWVudSBpdGVtIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIHJldHVybiBgdW5kZWZpbmVkYCBpZiB0aGUgaW5kZXggaXMgb3V0IG9mIHJhbmdlLlxuICAgICAqL1xuICAgIE1lbnVCYXIucHJvdG90eXBlLl9pdGVtTm9kZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHJldHVybiBjb250ZW50LmNoaWxkcmVuW2luZGV4XTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgaW5kZXggb2YgdGhlIG1lbnUgaXRlbSBub2RlIGF0IGEgY2xpZW50IHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogVGhpcyB3aWxsIHJldHVybiBgLTFgIGlmIHRoZSBtZW51IGl0ZW0gbm9kZSBpcyBub3QgZm91bmQuXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX2hpdFRlc3RJdGVtTm9kZXMgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZC5jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChwaG9zcGhvcl9kb211dGlsXzEuaGl0VGVzdChub2Rlc1tpXSwgeCwgeSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBgY2xvc2VkYCBzaWduYWwgZnJvbSB0aGUgY2hpbGQgbWVudS5cbiAgICAgKi9cbiAgICBNZW51QmFyLnByb3RvdHlwZS5fb25NZW51Q2xvc2VkID0gZnVuY3Rpb24gKHNlbmRlcikge1xuICAgICAgICBzZW5kZXIuY2xvc2VkLmRpc2Nvbm5lY3QodGhpcy5fb25NZW51Q2xvc2VkLCB0aGlzKTtcbiAgICAgICAgc2VuZGVyLnJlbW92ZUNsYXNzKGV4cG9ydHMuTUVOVV9DTEFTUyk7XG4gICAgICAgIHRoaXMuX2NoaWxkTWVudSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIHByb3BlcnR5IGNoYW5nZWQgc2lnbmFsIGZyb20gYSBtZW51IGl0ZW0uXG4gICAgICovXG4gICAgTWVudUJhci5wcm90b3R5cGUuX29uSXRlbUNoYW5nZWQgPSBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gTWVudUJhcjtcbn0pKG1lbnViYXNlXzEuTWVudUJhc2UpO1xuZXhwb3J0cy5NZW51QmFyID0gTWVudUJhcjtcbi8qKlxuICogQ3JlYXRlIGEgbWVudSBpdGVtIGZyb20gYSB0ZW1wbGF0ZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVudUl0ZW0odGVtcGxhdGUpIHtcbiAgICByZXR1cm4gbWVudWl0ZW1fMS5NZW51SXRlbS5mcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xufVxuLyoqXG4gKiBDcmVhdGUgdGhlIGNvbXBsZXRlIERPTSBub2RlIGNsYXNzIG5hbWUgZm9yIGEgTWVudUl0ZW0uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW1DbGFzc05hbWUoaXRlbSkge1xuICAgIHZhciBwYXJ0cyA9IFtleHBvcnRzLk1FTlVfSVRFTV9DTEFTU107XG4gICAgaWYgKGl0ZW0uaXNTZXBhcmF0b3JUeXBlKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5TRVBBUkFUT1JfVFlQRV9DTEFTUyk7XG4gICAgfVxuICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZXhwb3J0cy5ESVNBQkxFRF9DTEFTUyk7XG4gICAgfVxuICAgIGlmIChpdGVtLmhpZGRlbikge1xuICAgICAgICBwYXJ0cy5wdXNoKGV4cG9ydHMuSElEREVOX0NMQVNTKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0uY2xhc3NOYW1lKSB7XG4gICAgICAgIHBhcnRzLnB1c2goaXRlbS5jbGFzc05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xufVxuLyoqXG4gKiBDcmVhdGUgdGhlIERPTSBub2RlIGZvciBhIE1lbnVJdGVtLlxuICovXG5mdW5jdGlvbiBjcmVhdGVJdGVtTm9kZShpdGVtKSB7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBub2RlLmNsYXNzTmFtZSA9IGNyZWF0ZUl0ZW1DbGFzc05hbWUoaXRlbSk7XG4gICAgaWNvbi5jbGFzc05hbWUgPSBleHBvcnRzLklDT05fQ0xBU1M7XG4gICAgdGV4dC5jbGFzc05hbWUgPSBleHBvcnRzLlRFWFRfQ0xBU1M7XG4gICAgaWYgKCFpdGVtLmlzU2VwYXJhdG9yVHlwZSkge1xuICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gaXRlbS50ZXh0LnJlcGxhY2UoLyYvZywgJycpO1xuICAgIH1cbiAgICBub2RlLmFwcGVuZENoaWxkKGljb24pO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgcmV0dXJuIG5vZGU7XG59XG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIG1lbnUncyBhY3RpdmUgaXRlbSBoYXMgYSBzdWJtZW51LlxuICovXG5mdW5jdGlvbiBhY3RpdmVIYXNNZW51KG1lbnUpIHtcbiAgICB2YXIgaXRlbSA9IG1lbnUuaXRlbXNbbWVudS5hY3RpdmVJbmRleF07XG4gICAgcmV0dXJuICEhKGl0ZW0gJiYgaXRlbS5zdWJtZW51KTtcbn1cbi8qKlxuICogSGl0IHRlc3QgdGhlIGNoYWluIG1lbnVzIGZvciB0aGUgZ2l2ZW4gY2xpZW50IHBvc2l0aW9uLlxuICovXG5mdW5jdGlvbiBoaXRUZXN0TWVudXMobWVudSwgeCwgeSkge1xuICAgIHdoaWxlIChtZW51KSB7XG4gICAgICAgIGlmIChwaG9zcGhvcl9kb211dGlsXzEuaGl0VGVzdChtZW51Lm5vZGUsIHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBtZW51ID0gbWVudS5jaGlsZE1lbnU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnViYXIuanMubWFwIiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCdwaG9zcGhvci1hcnJheXMnKTtcbnZhciBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1wcm9wZXJ0aWVzJyk7XG52YXIgcGhvc3Bob3Jfd2lkZ2V0XzEgPSByZXF1aXJlKCdwaG9zcGhvci13aWRnZXQnKTtcbi8qKlxuICogQSBiYXNlIGNsYXNzIGZvciBpbXBsZW1lbnRpbmcgd2lkZ2V0cyB3aGljaCBkaXNwbGF5IG1lbnUgaXRlbXMuXG4gKi9cbnZhciBNZW51QmFzZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1lbnVCYXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1lbnVCYXNlKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVCYXNlLnByb3RvdHlwZSwgXCJpdGVtc1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGFycmF5IG9mIG1lbnUgaXRlbXMuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaXRlbXNQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUJhc2UuaXRlbXNQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIGFycmF5IG9mIG1lbnUgaXRlbXMuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaXRlbXNQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVCYXNlLml0ZW1zUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVCYXNlLnByb3RvdHlwZSwgXCJhY3RpdmVJbmRleFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgaW5kZXggb2YgdGhlIGFjdGl2ZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbYWN0aXZlSW5kZXhQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUJhc2UuYWN0aXZlSW5kZXhQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgaW5kZXggb2YgdGhlIGFjdGl2ZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbYWN0aXZlSW5kZXhQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVCYXNlLmFjdGl2ZUluZGV4UHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQWN0aXZhdGUgdGhlIG5leHQgc2VsZWN0YWJsZSBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIHNlYXJjaCBzdGFydHMgd2l0aCB0aGUgY3VycmVudGx5IGFjdGl2ZSBpdGVtLCBhbmQgcHJvZ3Jlc3Nlc1xuICAgICAqIGZvcndhcmQgdW50aWwgdGhlIG5leHQgc2VsZWN0YWJsZSBpdGVtIGlzIGZvdW5kLiBUaGUgc2VhcmNoIHdpbGxcbiAgICAgKiB3cmFwIGFyb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBtZW51LlxuICAgICAqL1xuICAgIE1lbnVCYXNlLnByb3RvdHlwZS5hY3RpdmF0ZU5leHRJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgayA9IHRoaXMuYWN0aXZlSW5kZXggKyAxO1xuICAgICAgICB2YXIgaSA9IGsgPj0gdGhpcy5pdGVtcy5sZW5ndGggPyAwIDogaztcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGFycmF5cy5maW5kSW5kZXgodGhpcy5pdGVtcywgaXNTZWxlY3RhYmxlLCBpLCB0cnVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFjdGl2YXRlIHRoZSBwcmV2aW91cyBzZWxlY3RhYmxlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgc2VhcmNoIHN0YXJ0cyB3aXRoIHRoZSBjdXJyZW50bHkgYWN0aXZlIGl0ZW0sIGFuZCBwcm9ncmVzc2VzXG4gICAgICogYmFja3dhcmQgdW50aWwgdGhlIG5leHQgc2VsZWN0YWJsZSBpdGVtIGlzIGZvdW5kLiBUaGUgc2VhcmNoIHdpbGxcbiAgICAgKiB3cmFwIGFyb3VuZCBhdCB0aGUgZnJvbnQgb2YgdGhlIG1lbnUuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLmFjdGl2YXRlUHJldmlvdXNJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgayA9IHRoaXMuYWN0aXZlSW5kZXg7XG4gICAgICAgIHZhciBpID0gayA8PSAwID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogayAtIDE7XG4gICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBhcnJheXMucmZpbmRJbmRleCh0aGlzLml0ZW1zLCBpc1NlbGVjdGFibGUsIGksIHRydWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWN0aXZhdGUgdGhlIG5leHQgc2VsZWN0YWJsZSBtZW51IGl0ZW0gd2l0aCB0aGUgZ2l2ZW4gbW5lbW9uaWMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIHNlYXJjaCBzdGFydHMgd2l0aCB0aGUgY3VycmVudGx5IGFjdGl2ZSBpdGVtLCBhbmQgcHJvZ3Jlc3Nlc1xuICAgICAqIGZvcndhcmQgdW50aWwgdGhlIG5leHQgc2VsZWN0YWJsZSBpdGVtIHdpdGggdGhlIGdpdmVuIG1uZW1vbmljIGlzXG4gICAgICogZm91bmQuIFRoZSBzZWFyY2ggd2lsbCB3cmFwIGFyb3VuZCBhdCB0aGUgZW5kIG9mIHRoZSBtZW51LCBhbmQgdGhlXG4gICAgICogbW5lbW9uaWMgbWF0Y2hpbmcgaXMgY2FzZS1pbnNlbnNpdGl2ZS5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUuYWN0aXZhdGVNbmVtb25pY0l0ZW0gPSBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICB2YXIgYyA9IGNoYXIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgdmFyIGsgPSB0aGlzLmFjdGl2ZUluZGV4ICsgMTtcbiAgICAgICAgdmFyIGkgPSBrID49IHRoaXMuaXRlbXMubGVuZ3RoID8gMCA6IGs7XG4gICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBhcnJheXMuZmluZEluZGV4KHRoaXMuaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoIWlzU2VsZWN0YWJsZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGl0ZW0udGV4dC5tYXRjaCgvJlxcdy8pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXRjaFswXVsxXS50b1VwcGVyQ2FzZSgpID09PSBjO1xuICAgICAgICB9LCBpLCB0cnVlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE9wZW4gdGhlIGFjdGl2ZSBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBpcyBhIG5vLW9wIGlmIHRoZXJlIGlzIG5vIGFjdGl2ZSBtZW51IGl0ZW0sIG9yIGlmIHRoZSBhY3RpdmVcbiAgICAgKiBtZW51IGl0ZW0gZG9lcyBub3QgaGF2ZSBhIHN1Ym1lbnUuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLm9wZW5BY3RpdmVJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuYWN0aXZlSW5kZXg7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5zdWJtZW51KSB7XG4gICAgICAgICAgICB0aGlzLm9uT3Blbkl0ZW0oaSwgaXRlbSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgdGhlIGFjdGl2ZSBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBpcyBhIG5vLW9wIGlmIHRoZXJlIGlzIG5vIGFjdGl2ZSBtZW51IGl0ZW0uIElmIHRoZSBhY3RpdmVcbiAgICAgKiBtZW51IGl0ZW0gaGFzIGEgc3VibWVudSwgdGhpcyBpcyBlcXVpdmFsZW50IHRvIGBvcGVuQWN0aXZlSXRlbWAuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLnRyaWdnZXJBY3RpdmVJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSA9IHRoaXMuYWN0aXZlSW5kZXg7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5zdWJtZW51KSB7XG4gICAgICAgICAgICB0aGlzLm9uT3Blbkl0ZW0oaSwgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5vblRyaWdnZXJJdGVtKGksIGl0ZW0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgY29lcmNlIGhhbmRsZXIgZm9yIHRoZSBbW2FjdGl2ZUluZGV4UHJvcGVydHldXS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCBhcyBuZWVkZWQuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLmNvZXJjZUFjdGl2ZUluZGV4ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBpID0gaW5kZXggfCAwO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbXNbaV07XG4gICAgICAgIHJldHVybiAoaXRlbSAmJiBpc1NlbGVjdGFibGUoaXRlbSkpID8gaSA6IC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCB3aGVuIHRoZSBtZW51IGl0ZW1zIGNoYW5nZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLm9uSXRlbXNDaGFuZ2VkID0gZnVuY3Rpb24gKG9sZCwgaXRlbXMpIHsgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gdGhlIGFjdGl2ZSBpbmRleCBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBNZW51QmFzZS5wcm90b3R5cGUub25BY3RpdmVJbmRleENoYW5nZWQgPSBmdW5jdGlvbiAob2xkLCBpbmRleCkgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWV0aG9kIGludm9rZWQgd2hlbiBhIG1lbnUgaXRlbSBzaG91bGQgYmUgb3BlbmVkLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBoYW5kbGVyIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgTWVudUJhc2UucHJvdG90eXBlLm9uT3Blbkl0ZW0gPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHsgfTtcbiAgICAvKipcbiAgICAgKiBBIG1ldGhvZCBpbnZva2VkIHdoZW4gYSBtZW51IGl0ZW0gc2hvdWxkIGJlIHRyaWdnZXJlZC5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIE1lbnVCYXNlLnByb3RvdHlwZS5vblRyaWdnZXJJdGVtID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7IH07XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSBtZW51IGl0ZW1zLlxuICAgICAqXG4gICAgICogVGhpcyBjb250cm9scyB0aGUgaXRlbXMgd2hpY2ggYXJlIGNvbnRhaW5lZCBpbiB0aGUgbWVudS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJbi1wbGFjZSBtb2RpZmljYXRpb25zIHRvIHRoZSBhcnJheSBhcmUgbm90IGFsbG93ZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbaXRlbXNdXVxuICAgICAqL1xuICAgIE1lbnVCYXNlLml0ZW1zUHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5mcmVlemUoW10pLFxuICAgICAgICBjb2VyY2U6IGZ1bmN0aW9uIChvd25lciwgdmFsdWUpIHsgcmV0dXJuIE9iamVjdC5mcmVlemUodmFsdWUgPyB2YWx1ZS5zbGljZSgpIDogW10pOyB9LFxuICAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAob3duZXIsIG9sZCwgdmFsdWUpIHsgcmV0dXJuIG93bmVyLm9uSXRlbXNDaGFuZ2VkKG9sZCwgdmFsdWUpOyB9LFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgYWN0aXZlIGluZGV4LlxuICAgICAqXG4gICAgICogVGhpcyBjb250cm9scyB3aGljaCBtZW51IGl0ZW0gaXMgdGhlIGFjdGl2ZSBpdGVtLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2FjdGl2ZUluZGV4XV1cbiAgICAgKi9cbiAgICBNZW51QmFzZS5hY3RpdmVJbmRleFByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiAtMSxcbiAgICAgICAgY29lcmNlOiBmdW5jdGlvbiAob3duZXIsIGluZGV4KSB7IHJldHVybiBvd25lci5jb2VyY2VBY3RpdmVJbmRleChpbmRleCk7IH0sXG4gICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChvd25lciwgb2xkLCBpbmRleCkgeyByZXR1cm4gb3duZXIub25BY3RpdmVJbmRleENoYW5nZWQob2xkLCBpbmRleCk7IH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIE1lbnVCYXNlO1xufSkocGhvc3Bob3Jfd2lkZ2V0XzEuV2lkZ2V0KTtcbmV4cG9ydHMuTWVudUJhc2UgPSBNZW51QmFzZTtcbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgbWVudSBpdGVtIGlzIHNlbGVjdGFibGUuXG4gKi9cbmZ1bmN0aW9uIGlzU2VsZWN0YWJsZShpdGVtKSB7XG4gICAgcmV0dXJuICFpdGVtLmhpZGRlbiAmJiAhaXRlbS5kaXNhYmxlZCAmJiAhaXRlbS5pc1NlcGFyYXRvclR5cGU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZW51YmFzZS5qcy5tYXAiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0JztcbnZhciBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1wcm9wZXJ0aWVzJyk7XG52YXIgbWVudV8xID0gcmVxdWlyZSgnLi9tZW51Jyk7XG4vKipcbiAqIEFuIGl0ZW0gd2hpY2ggY2FuIGJlIGFkZGVkIHRvIGEgbWVudSBvciBtZW51IGJhci5cbiAqL1xudmFyIE1lbnVJdGVtID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3QgYSBuZXcgbWVudSBpdGVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgaW5pdGlhbGl6YXRpb24gb3B0aW9ucyBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBNZW51SXRlbShvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zKVxuICAgICAgICAgICAgaW5pdEZyb21PcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBtZW51IGl0ZW0gZnJvbSBhIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRlbXBsYXRlIC0gVGhlIHRlbXBsYXRlIG9iamVjdCBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgbmV3IG1lbnUgaXRlbSBjcmVhdGVkIGZyb20gdGhlIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIElmIGEgc3VibWVudSB0ZW1wbGF0ZSBpcyBwcm92aWRlZCwgdGhlIHN1Ym1lbnUgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogYnkgY2FsbGluZyBgTWVudS5mcm9tVGVtcGxhdGVgLiBJZiBhIGN1c3RvbSBtZW51IGlzIG5lY2Vzc2FyeSxcbiAgICAgKiB1c2UgdGhlIGBNZW51SXRlbWAgY29uc3RydWN0b3IgZGlyZWN0bHkuXG4gICAgICovXG4gICAgTWVudUl0ZW0uZnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIHZhciBpdGVtID0gbmV3IE1lbnVJdGVtKCk7XG4gICAgICAgIGluaXRGcm9tVGVtcGxhdGUoaXRlbSwgdGVtcGxhdGUpO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwidHlwZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIHR5cGUgb2YgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1t0eXBlUHJvcGVydHldXS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2lzTm9ybWFsVHlwZV1dLCBbW2lzQ2hlY2tUeXBlXV0sIFtbaXNTZXBhcmF0b3JUeXBlXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLnR5cGVQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHR5cGUgb2YgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1t0eXBlUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBNZW51SXRlbS50eXBlUHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJ0ZXh0XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgdGV4dCBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1t0ZXh0UHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLnRleHRQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHRleHQgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbdGV4dFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0udGV4dFByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwic2hvcnRjdXRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBzaG9ydGN1dCBrZXkgZm9yIHRoZSBtZW51IGl0ZW0gKGRlY29yYXRpb24gb25seSkuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbc2hvcnRjdXRQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0uc2hvcnRjdXRQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHNob3J0Y3V0IGtleSBmb3IgdGhlIG1lbnUgaXRlbSAoZGVjb3JhdGlvbiBvbmx5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tzaG9ydGN1dFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgTWVudUl0ZW0uc2hvcnRjdXRQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcImRpc2FibGVkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgZGlzYWJsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbZGlzYWJsZWRQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0uZGlzYWJsZWRQcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGRpc2FibGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2Rpc2FibGVkUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBNZW51SXRlbS5kaXNhYmxlZFByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiaGlkZGVuXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgaGlkZGVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2hpZGRlblByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5oaWRkZW5Qcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGhpZGRlbi5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1toaWRkZW5Qcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLmhpZGRlblByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiY2hlY2tlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGNoZWNrZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbY2hlY2tlZFByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5jaGVja2VkUHJvcGVydHkuZ2V0KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBjaGVja2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2NoZWNrZWRQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLmNoZWNrZWRQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcImNsYXNzTmFtZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGV4dHJhIGNsYXNzIG5hbWUgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbY2xhc3NOYW1lUHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1lbnVJdGVtLmNsYXNzTmFtZVByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgZXh0cmEgY2xhc3MgbmFtZSBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tjbGFzc05hbWVQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLmNsYXNzTmFtZVByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZW51SXRlbS5wcm90b3R5cGUsIFwiaGFuZGxlclwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGhhbmRsZXIgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbaGFuZGxlclByb3BlcnR5XV0uXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNZW51SXRlbS5oYW5kbGVyUHJvcGVydHkuZ2V0KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBoYW5kbGVyIGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2hhbmRsZXJQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIE1lbnVJdGVtLmhhbmRsZXJQcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcInN1Ym1lbnVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBzdWJtZW51IGZvciB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW3N1Ym1lbnVQcm9wZXJ0eV1dLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWVudUl0ZW0uc3VibWVudVByb3BlcnR5LmdldCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgc3VibWVudSBmb3IgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1tzdWJtZW51UHJvcGVydHldXS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBNZW51SXRlbS5zdWJtZW51UHJvcGVydHkuc2V0KHRoaXMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1lbnVJdGVtLnByb3RvdHlwZSwgXCJpc05vcm1hbFR5cGVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgYSBgJ25vcm1hbCdgIHR5cGUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW3R5cGVdXSwgW1tpc0NoZWNrVHlwZV1dLCBbW2lzU2VwYXJhdG9yVHlwZV1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdub3JtYWwnO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcImlzQ2hlY2tUeXBlXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGEgYCdjaGVjaydgIHR5cGUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW3R5cGVdXSwgW1tpc05vcm1hbFR5cGVdXSwgW1tpc1NlcGFyYXRvclR5cGVdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnY2hlY2snO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWVudUl0ZW0ucHJvdG90eXBlLCBcImlzU2VwYXJhdG9yVHlwZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZXN0IHdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBhIGAnc2VwYXJhdG9yJ2AgdHlwZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbdHlwZV1dLCBbW2lzTm9ybWFsVHlwZV1dLCBbW2lzQ2hlY2tUeXBlXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3NlcGFyYXRvcic7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgbWVudSBpdGVtIHR5cGUuXG4gICAgICpcbiAgICAgKiBWYWxpZCB0eXBlcyBhcmU6IGAnbm9ybWFsJ2AsIGAnY2hlY2snYCwgYW5kIGAnc2VwYXJhdG9yJ2AuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgYW4gaW52YWxpZCB0eXBlIGlzIHByb3ZpZGVkLCBhIHdhcm5pbmcgd2lsbCBiZSBsb2dnZWQgYW5kIGFcbiAgICAgKiBgJ25vcm1hbCdgIHR5cGUgd2lsbCBiZSB1c2VkIGluc3RlYWQuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBgJ25vcm1hbCdgLlxuICAgICAqXG4gICAgICogVXNpbmcgYSBzdHJpbmcgZm9yIHRoaXMgdmFsdWUgaW5zdGVhZCBvZiBhbiBlbnVtIG1ha2VzIGl0IGVhc2llclxuICAgICAqIHRvIGNyZWF0ZSBtZW51IGl0ZW1zIGZyb20gYSBKU09OIHNwZWNpZmljYXRpb24uIEZvciB0aGUgdHlwZS1zYWZlXG4gICAgICogY3Jvd2QsIHJlYWQtb25seSBnZXR0ZXJzIGFyZSBwcm92aWRlZCB0byBhc3NlcnQgdGhlIGl0ZW0gdHlwZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1t0eXBlXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS50eXBlUHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6ICdub3JtYWwnLFxuICAgICAgICBjb2VyY2U6IGNvZXJjZU1lbnVJdGVtVHlwZSxcbiAgICAgICAgY2hhbmdlZDogZnVuY3Rpb24gKG93bmVyKSB7IHJldHVybiBNZW51SXRlbS5jaGVja2VkUHJvcGVydHkuY29lcmNlKG93bmVyKTsgfSxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIG1lbnUgaXRlbSB0ZXh0LlxuICAgICAqXG4gICAgICogVGhlIHRleHQgbWF5IGhhdmUgYW4gYW1wZXJzYW5kIGAmYCBiZWZvcmUgdGhlIGNoYXJhY3RlclxuICAgICAqIHRvIHVzZSBhcyB0aGUgbW5lbW9uaWMgZm9yIHRoZSBtZW51IGl0ZW0uXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbdGV4dF1dXG4gICAgICovXG4gICAgTWVudUl0ZW0udGV4dFByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIG1lbnUgaXRlbSBzaG9ydGN1dC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tzaG9ydGN1dF1dXG4gICAgICovXG4gICAgTWVudUl0ZW0uc2hvcnRjdXRQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgY29udHJvbGxpbmcgdGhlIG1lbnUgaXRlbSBkaXNhYmxlZCBzdGF0ZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tkaXNhYmxlZF1dXG4gICAgICovXG4gICAgTWVudUl0ZW0uZGlzYWJsZWRQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgY29udHJvbGxpbmcgdGhlIG1lbnUgaXRlbSBoaWRkZW4gc3RhdGUuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbaGlkZGVuXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5oaWRkZW5Qcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgY29udHJvbGxpbmcgdGhlIG1lbnUgaXRlbSBjaGVja2VkIHN0YXRlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIE9ubHkgYSBgJ2NoZWNrJ2AgdHlwZSBtZW51IGl0ZW0gY2FuIGJlIGNoZWNrZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2hlY2tlZF1dXG4gICAgICovXG4gICAgTWVudUl0ZW0uY2hlY2tlZFByb3BlcnR5ID0gbmV3IHBob3NwaG9yX3Byb3BlcnRpZXNfMS5Qcm9wZXJ0eSh7XG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgY29lcmNlOiBmdW5jdGlvbiAob3duZXIsIHZhbCkgeyByZXR1cm4gb3duZXIudHlwZSA9PT0gJ2NoZWNrJyA/IHZhbCA6IGZhbHNlOyB9LFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgbWVudSBpdGVtIGNsYXNzIG5hbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGFuIGV4dHJhIGNsYXNzIG5hbWUgd2hpY2ggaXRlbSByZW5kZXJlcnMgd2lsbCBhZGQgdG9cbiAgICAgKiB0aGUgRE9NIG5vZGUgd2hpY2ggcmVwcmVzZW50cyB0aGUgbWVudSBpdGVtLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2NsYXNzTmFtZV1dXG4gICAgICovXG4gICAgTWVudUl0ZW0uY2xhc3NOYW1lUHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciB0aGUgaXRlbSBoYW5kbGVyLlxuICAgICAqXG4gICAgICogVGhpcyBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgbWVudSBpdGVtIGlzIHRyaWdnZXJlZC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1toYW5kbGVyXV1cbiAgICAgKi9cbiAgICBNZW51SXRlbS5oYW5kbGVyUHJvcGVydHkgPSBuZXcgcGhvc3Bob3JfcHJvcGVydGllc18xLlByb3BlcnR5KHtcbiAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgIGNvZXJjZTogZnVuY3Rpb24gKG93bmVyLCB2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfHwgbnVsbDsgfSxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIG1lbnUgaXRlbSBzdWJtZW51LlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3N1Ym1lbnVdXVxuICAgICAqL1xuICAgIE1lbnVJdGVtLnN1Ym1lbnVQcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgY29lcmNlOiBmdW5jdGlvbiAob3duZXIsIHZhbHVlKSB7IHJldHVybiB2YWx1ZSB8fCBudWxsOyB9LFxuICAgIH0pO1xuICAgIHJldHVybiBNZW51SXRlbTtcbn0pKCk7XG5leHBvcnRzLk1lbnVJdGVtID0gTWVudUl0ZW07XG4vKipcbiAqIEluaXRpYWxpemUgYSBtZW51IGl0ZW0gZnJvbSBhIGNvbW1vbiBvcHRpb25zIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gaW5pdEZyb21Db21tb24oaXRlbSwgY29tbW9uKSB7XG4gICAgaWYgKGNvbW1vbi50eXBlICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS50eXBlID0gY29tbW9uLnR5cGU7XG4gICAgfVxuICAgIGlmIChjb21tb24udGV4dCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0udGV4dCA9IGNvbW1vbi50ZXh0O1xuICAgIH1cbiAgICBpZiAoY29tbW9uLnNob3J0Y3V0ICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS5zaG9ydGN1dCA9IGNvbW1vbi5zaG9ydGN1dDtcbiAgICB9XG4gICAgaWYgKGNvbW1vbi5kaXNhYmxlZCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0uZGlzYWJsZWQgPSBjb21tb24uZGlzYWJsZWQ7XG4gICAgfVxuICAgIGlmIChjb21tb24uaGlkZGVuICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS5oaWRkZW4gPSBjb21tb24uaGlkZGVuO1xuICAgIH1cbiAgICBpZiAoY29tbW9uLmNoZWNrZWQgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLmNoZWNrZWQgPSBjb21tb24uY2hlY2tlZDtcbiAgICB9XG4gICAgaWYgKGNvbW1vbi5jbGFzc05hbWUgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGNvbW1vbi5jbGFzc05hbWU7XG4gICAgfVxuICAgIGlmIChjb21tb24uaGFuZGxlciAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGl0ZW0uaGFuZGxlciA9IGNvbW1vbi5oYW5kbGVyO1xuICAgIH1cbn1cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG1lbnUgaXRlbSBmcm9tIGEgdGVtcGxhdGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbml0RnJvbVRlbXBsYXRlKGl0ZW0sIHRlbXBsYXRlKSB7XG4gICAgaW5pdEZyb21Db21tb24oaXRlbSwgdGVtcGxhdGUpO1xuICAgIGlmICh0ZW1wbGF0ZS5zdWJtZW51ICE9PSB2b2lkIDApIHtcbiAgICAgICAgaXRlbS5zdWJtZW51ID0gbWVudV8xLk1lbnUuZnJvbVRlbXBsYXRlKHRlbXBsYXRlLnN1Ym1lbnUpO1xuICAgIH1cbn1cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG1lbnUgaXRlbSBmcm9tIGFuIG9wdGlvbnMgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbml0RnJvbU9wdGlvbnMoaXRlbSwgb3B0aW9ucykge1xuICAgIGluaXRGcm9tQ29tbW9uKGl0ZW0sIG9wdGlvbnMpO1xuICAgIGlmIChvcHRpb25zLnN1Ym1lbnUgIT09IHZvaWQgMCkge1xuICAgICAgICBpdGVtLnN1Ym1lbnUgPSBvcHRpb25zLnN1Ym1lbnU7XG4gICAgfVxufVxuLyoqXG4gKiBUaGUgY29lcmNlIGhhbmRsZXIgZm9yIHRoZSBtZW51IGl0ZW0gdHlwZS5cbiAqL1xuZnVuY3Rpb24gY29lcmNlTWVudUl0ZW1UeXBlKGl0ZW0sIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnbm9ybWFsJyB8fCB2YWx1ZSA9PT0gJ2NoZWNrJyB8fCB2YWx1ZSA9PT0gJ3NlcGFyYXRvcicpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgbWVudSBpdGVtIHR5cGU6JywgdmFsdWUpO1xuICAgIHJldHVybiAnbm9ybWFsJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnVpdGVtLmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHBob3NwaG9yX3F1ZXVlXzEgPSByZXF1aXJlKCdwaG9zcGhvci1xdWV1ZScpO1xuLyoqXG4gKiBBIG1lc2FnZSB3aGljaCBjYW4gYmUgc2VudCBvciBwb3N0ZWQgdG8gYSBtZXNzYWdlIGhhbmRsZXIuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBjbGFzcyBtYXkgYmUgc3ViY2xhc3NlZCB0byBjcmVhdGUgY29tcGxleCBtZXNzYWdlIHR5cGVzLlxuICpcbiAqICoqU2VlIEFsc28qKiBbW3Bvc3RNZXNzYWdlXV0gYW5kIFtbc2VuZE1lc3NhZ2VdXS5cbiAqL1xudmFyIE1lc3NhZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgbWVzc2FnZS4gQ29uc3VtZXJzIG9mIGEgbWVzc2FnZSB3aWxsXG4gICAgICogICB1c2UgdGhpcyB2YWx1ZSB0byBjYXN0IHRoZSBtZXNzYWdlIHRvIHRoZSBhcHByb3ByaWF0ZWx5IGRlcml2ZWRcbiAgICAgKiAgIG1lc3NhZ2UgdHlwZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBNZXNzYWdlKHR5cGUpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlLnByb3RvdHlwZSwgXCJ0eXBlXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgdHlwZSBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBNZXNzYWdlO1xufSkoKTtcbmV4cG9ydHMuTWVzc2FnZSA9IE1lc3NhZ2U7XG4vKipcbiAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlIGhhbmRsZXIgdG8gcHJvY2VzcyBpbW1lZGlhdGVseS5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciAtIFRoZSBoYW5kbGVyIHdoaWNoIHNob3VsZCBwcm9jZXNzIHRoZSBtZXNzYWdlLlxuICpcbiAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBzZW5kIHRvIHRoZSBoYW5kbGVyLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFVubGlrZSBbW3Bvc3RNZXNzYWdlXV0sIFtbc2VuZE1lc3NhZ2VdXSBkZWxpdmVycyB0aGUgbWVzc2FnZSB0b1xuICogdGhlIGhhbmRsZXIgaW1tZWRpYXRlbHkuIFRoZSBoYW5kbGVyIHdpbGwgbm90IGhhdmUgdGhlIG9wcG9ydHVuaXR5XG4gKiB0byBjb21wcmVzcyB0aGUgbWVzc2FnZSwgaG93ZXZlciB0aGUgbWVzc2FnZSB3aWxsIHN0aWxsIGJlIHNlbnRcbiAqIHRocm91Z2ggYW55IGluc3RhbGxlZCBtZXNzYWdlIGZpbHRlcnMuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbcG9zdE1lc3NhZ2VdXS5cbiAqL1xuZnVuY3Rpb24gc2VuZE1lc3NhZ2UoaGFuZGxlciwgbXNnKSB7XG4gICAgZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKS5zZW5kTWVzc2FnZShoYW5kbGVyLCBtc2cpO1xufVxuZXhwb3J0cy5zZW5kTWVzc2FnZSA9IHNlbmRNZXNzYWdlO1xuLyoqXG4gKiBQb3N0IGEgbWVzc2FnZSB0byB0aGUgbWVzc2FnZSBoYW5kbGVyIHRvIHByb2Nlc3MgaW4gdGhlIGZ1dHVyZS5cbiAqXG4gKiBAcGFyYW0gaGFuZGxlciAtIFRoZSBoYW5kbGVyIHdoaWNoIHNob3VsZCBwcm9jZXNzIHRoZSBtZXNzYWdlLlxuICpcbiAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBwb3N0IHRvIHRoZSBoYW5kbGVyLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFVubGlrZSBbW3NlbmRNZXNzYWdlXV0sIFtbcG9zdE1lc3NhZ2VdXSB3aWxsIHNjaGVkdWxlIHRoZSBkZWxpdmVyIG9mXG4gKiB0aGUgbWVzc2FnZSBmb3IgdGhlIG5leHQgY3ljbGUgb2YgdGhlIGV2ZW50IGxvb3AuIFRoZSBoYW5kbGVyIHdpbGxcbiAqIGhhdmUgdGhlIG9wcG9ydHVuaXR5IHRvIGNvbXByZXNzIHRoZSBtZXNzYWdlIGluIG9yZGVyIHRvIG9wdGltaXplXG4gKiBpdHMgaGFuZGxpbmcgb2Ygc2ltaWxhciBtZXNzYWdlcy4gVGhlIG1lc3NhZ2Ugd2lsbCBiZSBzZW50IHRocm91Z2hcbiAqIGFueSBpbnN0YWxsZWQgbWVzc2FnZSBmaWx0ZXJzIGJlZm9yZSBiZWluZyBkZWxpdmVyZWQgdG8gdGhlIGhhbmRsZXIuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbc2VuZE1lc3NhZ2VdXS5cbiAqL1xuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoaGFuZGxlciwgbXNnKSB7XG4gICAgZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKS5wb3N0TWVzc2FnZShoYW5kbGVyLCBtc2cpO1xufVxuZXhwb3J0cy5wb3N0TWVzc2FnZSA9IHBvc3RNZXNzYWdlO1xuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBtZXNzYWdlIGhhbmRsZXIgaGFzIHBvc3RlZCBtZXNzYWdlcyBwZW5kaW5nIGRlbGl2ZXJ5LlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyIC0gVGhlIG1lc3NhZ2UgaGFuZGxlciBvZiBpbnRlcmVzdC5cbiAqXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGhhbmRsZXIgaGFzIHBlbmRpbmcgcG9zdGVkIG1lc3NhZ2VzLCBgZmFsc2VgXG4gKiAgIG90aGVyd2lzZS5cbiAqXG4gKiAqKlNlZSBBbHNvKiogW1tzZW5kUGVuZGluZ01lc3NhZ2VdXS5cbiAqL1xuZnVuY3Rpb24gaGFzUGVuZGluZ01lc3NhZ2VzKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKS5oYXNQZW5kaW5nTWVzc2FnZXMoKTtcbn1cbmV4cG9ydHMuaGFzUGVuZGluZ01lc3NhZ2VzID0gaGFzUGVuZGluZ01lc3NhZ2VzO1xuLyoqXG4gKiBTZW5kIHRoZSBmaXJzdCBwZW5kaW5nIHBvc3RlZCBtZXNzYWdlIHRvIHRoZSBtZXNzYWdlIGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgLSBUaGUgbWVzc2FnZSBoYW5kbGVyIG9mIGludGVyZXN0LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIElmIHRoZSBoYW5kbGVyIGhhcyBubyBwZW5kaW5nIG1lc3NhZ2VzLCB0aGlzIGlzIGEgbm8tb3AuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbaGFzUGVuZGluZ01lc3NhZ2VzXV0uXG4gKi9cbmZ1bmN0aW9uIHNlbmRQZW5kaW5nTWVzc2FnZShoYW5kbGVyKSB7XG4gICAgZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKS5zZW5kUGVuZGluZ01lc3NhZ2UoaGFuZGxlcik7XG59XG5leHBvcnRzLnNlbmRQZW5kaW5nTWVzc2FnZSA9IHNlbmRQZW5kaW5nTWVzc2FnZTtcbi8qKlxuICogSW5zdGFsbCBhIG1lc3NhZ2UgZmlsdGVyIGZvciBhIG1lc3NhZ2UgaGFuZGxlci5cbiAqXG4gKiBBIG1lc3NhZ2UgZmlsdGVyIGlzIGludm9rZWQgYmVmb3JlIHRoZSBtZXNzYWdlIGhhbmRsZXIgcHJvY2Vzc2VzIGFcbiAqIG1lc3NhZ2UuIElmIHRoZSBmaWx0ZXIgcmV0dXJucyBgdHJ1ZWAgZnJvbSBpdHMgW1tmaWx0ZXJNZXNzYWdlXV0gbWV0aG9kLFxuICogbm8gb3RoZXIgZmlsdGVycyB3aWxsIGJlIGludm9rZWQsIGFuZCB0aGUgbWVzc2FnZSB3aWxsIG5vdCBiZSBkZWxpdmVyZWQuXG4gKlxuICogVGhlIG1vc3QgcmVjZW50bHkgaW5zdGFsbGVkIG1lc3NhZ2UgZmlsdGVyIGlzIGV4ZWN1dGVkIGZpcnN0LlxuICpcbiAqIEBwYXJhbSBoYW5kbGVyIC0gVGhlIGhhbmRsZXIgd2hvc2UgbWVzc2FnZXMgc2hvdWxkIGJlIGZpbHRlcmVkLlxuICpcbiAqIEBwYXJhbSBmaWx0ZXIgLSBUaGUgZmlsdGVyIHRvIGluc3RhbGwgZm9yIHRoZSBoYW5kbGVyLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIEl0IGlzIHBvc3NpYmxlIHRvIGluc3RhbGwgdGhlIHNhbWUgZmlsdGVyIG11bHRpcGxlIHRpbWVzLiBJZiB0aGVcbiAqIGZpbHRlciBzaG91bGQgYmUgdW5pcXVlLCBjYWxsIFtbcmVtb3ZlTWVzc2FnZUZpbHRlcl1dIGZpcnN0LlxuICpcbiAqICoqU2VlIEFsc28qKiBbW3JlbW92ZU1lc3NhZ2VGaWx0ZXJdXS5cbiAqL1xuZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VGaWx0ZXIoaGFuZGxlciwgZmlsdGVyKSB7XG4gICAgZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKS5pbnN0YWxsTWVzc2FnZUZpbHRlcihmaWx0ZXIpO1xufVxuZXhwb3J0cy5pbnN0YWxsTWVzc2FnZUZpbHRlciA9IGluc3RhbGxNZXNzYWdlRmlsdGVyO1xuLyoqXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IGluc3RhbGxlZCBtZXNzYWdlIGZpbHRlciBmb3IgYSBtZXNzYWdlIGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgLSBUaGUgaGFuZGxlciBmb3Igd2hpY2ggdGhlIGZpbHRlciBpcyBpbnN0YWxsZWQuXG4gKlxuICogQHBhcmFtIGZpbHRlciAtIFRoZSBmaWx0ZXIgdG8gcmVtb3ZlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgd2lsbCByZW1vdmUgKiphbGwqKiBvY2N1cnJlbmNlcyBvZiB0aGUgZmlsdGVyLiBJZiB0aGUgZmlsdGVyIGlzXG4gKiBub3QgaW5zdGFsbGVkLCB0aGlzIGlzIGEgbm8tb3AuXG4gKlxuICogSXQgaXMgc2FmZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24gd2hpbGUgdGhlIGZpbHRlciBpcyBleGVjdXRpbmcuXG4gKlxuICogKipTZWUgQWxzbyoqIFtbaW5zdGFsbE1lc3NhZ2VGaWx0ZXJdXS5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTWVzc2FnZUZpbHRlcihoYW5kbGVyLCBmaWx0ZXIpIHtcbiAgICBnZXREaXNwYXRjaGVyKGhhbmRsZXIpLnJlbW92ZU1lc3NhZ2VGaWx0ZXIoZmlsdGVyKTtcbn1cbmV4cG9ydHMucmVtb3ZlTWVzc2FnZUZpbHRlciA9IHJlbW92ZU1lc3NhZ2VGaWx0ZXI7XG4vKipcbiAqIENsZWFyIGFsbCBtZXNzYWdlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBtZXNzYWdlIGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgLSBUaGUgbWVzc2FnZSBoYW5kbGVyIGZvciB3aGljaCB0byBjbGVhciB0aGUgZGF0YS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIHdpbGwgcmVtb3ZlIGFsbCBwZW5kaW5nIG1lc3NhZ2VzIGFuZCBmaWx0ZXJzIGZvciB0aGUgaGFuZGxlci5cbiAqL1xuZnVuY3Rpb24gY2xlYXJNZXNzYWdlRGF0YShoYW5kbGVyKSB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyTWFwLmdldChoYW5kbGVyKTtcbiAgICBpZiAoZGlzcGF0Y2hlcilcbiAgICAgICAgZGlzcGF0Y2hlci5jbGVhcigpO1xuICAgIGRpc3BhdGNoUXVldWUucmVtb3ZlQWxsKGhhbmRsZXIpO1xufVxuZXhwb3J0cy5jbGVhck1lc3NhZ2VEYXRhID0gY2xlYXJNZXNzYWdlRGF0YTtcbi8qKlxuICogVGhlIGludGVybmFsIG1hcHBpbmcgb2YgbWVzc2FnZSBoYW5kbGVyIHRvIG1lc3NhZ2UgZGlzcGF0Y2hlclxuICovXG52YXIgZGlzcGF0Y2hlck1hcCA9IG5ldyBXZWFrTWFwKCk7XG4vKipcbiAqIFRoZSBpbnRlcm5hbCBxdWV1ZSBvZiBwZW5kaW5nIG1lc3NhZ2UgaGFuZGxlcnMuXG4gKi9cbnZhciBkaXNwYXRjaFF1ZXVlID0gbmV3IHBob3NwaG9yX3F1ZXVlXzEuUXVldWUoKTtcbi8qKlxuICogVGhlIGludGVybmFsIGFuaW1hdGlvbiBmcmFtZSBpZCBmb3IgdGhlIG1lc3NhZ2UgbG9vcCB3YWtlIHVwIGNhbGwuXG4gKi9cbnZhciBmcmFtZUlkID0gdm9pZCAwO1xuLyoqXG4gKiBBIGxvY2FsIHJlZmVyZW5jZSB0byBhbiBldmVudCBsb29wIGhvb2suXG4gKi9cbnZhciByYWY7XG5pZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbn1cbmVsc2Uge1xuICAgIHJhZiA9IHNldEltbWVkaWF0ZTtcbn1cbi8qKlxuICogR2V0IG9yIGNyZWF0ZSB0aGUgbWVzc2FnZSBkaXNwYXRjaGVyIGZvciBhIG1lc3NhZ2UgaGFuZGxlci5cbiAqL1xuZnVuY3Rpb24gZ2V0RGlzcGF0Y2hlcihoYW5kbGVyKSB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyTWFwLmdldChoYW5kbGVyKTtcbiAgICBpZiAoZGlzcGF0Y2hlcilcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoZXI7XG4gICAgZGlzcGF0Y2hlciA9IG5ldyBNZXNzYWdlRGlzcGF0Y2hlcigpO1xuICAgIGRpc3BhdGNoZXJNYXAuc2V0KGhhbmRsZXIsIGRpc3BhdGNoZXIpO1xuICAgIHJldHVybiBkaXNwYXRjaGVyO1xufVxuLyoqXG4gKiBXYWtlIHVwIHRoZSBtZXNzYWdlIGxvb3AgdG8gcHJvY2VzcyBhbnkgcGVuZGluZyBkaXNwYXRjaGVycy5cbiAqXG4gKiBUaGlzIGlzIGEgbm8tb3AgaWYgYSB3YWtlIHVwIGlzIG5vdCBuZWVkZWQgb3IgaXMgYWxyZWFkeSBwZW5kaW5nLlxuICovXG5mdW5jdGlvbiB3YWtlVXBNZXNzYWdlTG9vcCgpIHtcbiAgICBpZiAoZnJhbWVJZCA9PT0gdm9pZCAwICYmICFkaXNwYXRjaFF1ZXVlLmVtcHR5KSB7XG4gICAgICAgIGZyYW1lSWQgPSByYWYocnVuTWVzc2FnZUxvb3ApO1xuICAgIH1cbn1cbi8qKlxuICogUnVuIGFuIGl0ZXJhdGlvbiBvZiB0aGUgbWVzc2FnZSBsb29wLlxuICpcbiAqIFRoaXMgd2lsbCBwcm9jZXNzIGFsbCBwZW5kaW5nIGRpc3BhdGNoZXJzIGluIHRoZSBxdWV1ZS4gRGlzcGF0Y2hlcnNcbiAqIHdoaWNoIGFyZSBhZGRlZCB0byB0aGUgcXVldWUgd2hpbGUgdGhlIG1lc3NhZ2UgbG9vcCBpcyBydW5uaW5nIHdpbGxcbiAqIGJlIHByb2Nlc3NlZCBvbiB0aGUgbmV4dCBtZXNzYWdlIGxvb3AgY3ljbGUuXG4gKi9cbmZ1bmN0aW9uIHJ1bk1lc3NhZ2VMb29wKCkge1xuICAgIC8vIENsZWFyIHRoZSBmcmFtZSBpZCBzbyB0aGUgbmV4dCB3YWtlIHVwIGNhbGwgY2FuIGJlIHNjaGVkdWxlZC5cbiAgICBmcmFtZUlkID0gdm9pZCAwO1xuICAgIC8vIElmIHRoZSBxdWV1ZSBpcyBlbXB0eSwgdGhlcmUgaXMgbm90aGluZyBlbHNlIHRvIGRvLlxuICAgIGlmIChkaXNwYXRjaFF1ZXVlLmVtcHR5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gQWRkIGEgbnVsbCBzZW50aW5lbCB2YWx1ZSB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZS4gVGhlIHF1ZXVlXG4gICAgLy8gd2lsbCBvbmx5IGJlIHByb2Nlc3NlZCB1cCB0byB0aGUgZmlyc3QgbnVsbCB2YWx1ZS4gVGhpcyBtZWFuc1xuICAgIC8vIHRoYXQgbWVzc2FnZXMgcG9zdGVkIGR1cmluZyB0aGlzIGN5Y2xlIHdpbGwgZXhlY3V0ZSBvbiB0aGUgbmV4dFxuICAgIC8vIGN5Y2xlIG9mIHRoZSBsb29wLiBJZiB0aGUgbGFzdCB2YWx1ZSBpbiB0aGUgYXJyYXkgaXMgbnVsbCwgaXRcbiAgICAvLyBtZWFucyB0aGF0IGFuIGV4Y2VwdGlvbiB3YXMgdGhyb3duIGJ5IGEgbWVzc2FnZSBoYW5kbGVyIGFuZCB0aGVcbiAgICAvLyBsb29wIGhhZCB0byBiZSByZXN0YXJ0ZWQuXG4gICAgaWYgKGRpc3BhdGNoUXVldWUuYmFjayAhPT0gbnVsbCkge1xuICAgICAgICBkaXNwYXRjaFF1ZXVlLnB1c2gobnVsbCk7XG4gICAgfVxuICAgIC8vIFRoZSBtZXNzYWdlIGRpc3BhdGNoIGxvb3AuIElmIHRoZSBkaXNwYXRjaGVyIGlzIHRoZSBudWxsIHNlbnRpbmVsLFxuICAgIC8vIHRoZSBwcm9jZXNzaW5nIG9mIHRoZSBjdXJyZW50IGJsb2NrIG9mIG1lc3NhZ2VzIGlzIGNvbXBsZXRlIGFuZFxuICAgIC8vIGFub3RoZXIgbG9vcCBpcyBzY2hlZHVsZWQuIE90aGVyd2lzZSwgdGhlIHBlbmRpbmcgbWVzc2FnZSBpc1xuICAgIC8vIGRpc3BhdGNoZWQgdG8gdGhlIG1lc3NhZ2UgaGFuZGxlci5cbiAgICB3aGlsZSAoIWRpc3BhdGNoUXVldWUuZW1wdHkpIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBkaXNwYXRjaFF1ZXVlLnBvcCgpO1xuICAgICAgICBpZiAoaGFuZGxlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2FrZVVwTWVzc2FnZUxvb3AoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwYXRjaE1lc3NhZ2UoZGlzcGF0Y2hlck1hcC5nZXQoaGFuZGxlciksIGhhbmRsZXIpO1xuICAgIH1cbn1cbi8qKlxuICogU2FmZWx5IHByb2Nlc3MgdGhlIHBlbmRpbmcgaGFuZGxlciBtZXNzYWdlLlxuICpcbiAqIElmIHRoZSBtZXNzYWdlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgdGhlIG1lc3NhZ2UgbG9vcCB3aWxsXG4gKiBiZSByZXN0YXJ0ZWQgYW5kIHRoZSBleGNlcHRpb24gd2lsbCBiZSByZXRocm93bi5cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2hNZXNzYWdlKGRpc3BhdGNoZXIsIGhhbmRsZXIpIHtcbiAgICB0cnkge1xuICAgICAgICBkaXNwYXRjaGVyLnNlbmRQZW5kaW5nTWVzc2FnZShoYW5kbGVyKTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIHdha2VVcE1lc3NhZ2VMb29wKCk7XG4gICAgICAgIHRocm93IGV4O1xuICAgIH1cbn1cbi8qKlxuICogQW4gaW50ZXJuYWwgY2xhc3Mgd2hpY2ggbWFuYWdlcyBtZXNzYWdlIGRpc3BhdGNoaW5nIGZvciBhIGhhbmRsZXIuXG4gKi9cbnZhciBNZXNzYWdlRGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWVzc2FnZURpc3BhdGNoZXIoKSB7XG4gICAgICAgIHRoaXMuX2ZpbHRlcnMgPSBudWxsO1xuICAgICAgICB0aGlzLl9tZXNzYWdlcyA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBoYW5kbGVyIGltbWVkaWF0ZWx5LlxuICAgICAqXG4gICAgICogVGhlIG1lc3NhZ2Ugd2lsbCBmaXJzdCBiZSBzZW50IHRocm91Z2ggaW5zdGFsbGVkIGZpbHRlcnMuXG4gICAgICovXG4gICAgTWVzc2FnZURpc3BhdGNoZXIucHJvdG90eXBlLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24gKGhhbmRsZXIsIG1zZykge1xuICAgICAgICBpZiAoIXRoaXMuX2ZpbHRlck1lc3NhZ2UoaGFuZGxlciwgbXNnKSkge1xuICAgICAgICAgICAgaGFuZGxlci5wcm9jZXNzTWVzc2FnZShtc2cpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQb3N0IGEgbWVzc2FnZSBmb3IgZGVsaXZlcnkgaW4gdGhlIGZ1dHVyZS5cbiAgICAgKlxuICAgICAqIFRoZSBtZXNzYWdlIHdpbGwgZmlyc3QgYmUgY29tcHJlc3NlZCBpZiBwb3NzaWJsZS5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUucG9zdE1lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlciwgbXNnKSB7XG4gICAgICAgIGlmICghdGhpcy5fY29tcHJlc3NNZXNzYWdlKGhhbmRsZXIsIG1zZykpIHtcbiAgICAgICAgICAgIHRoaXMuX2VucXVldWVNZXNzYWdlKGhhbmRsZXIsIG1zZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRlc3Qgd2hldGhlciB0aGUgZGlzcGF0Y2hlciBoYXMgbWVzc2FnZXMgcGVuZGluZyBkZWxpdmVyeS5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuaGFzUGVuZGluZ01lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gISEodGhpcy5fbWVzc2FnZXMgJiYgIXRoaXMuX21lc3NhZ2VzLmVtcHR5KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNlbmQgdGhlIGZpcnN0IHBlbmRpbmcgbWVzc2FnZSB0byB0aGUgbWVzc2FnZSBoYW5kbGVyLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5zZW5kUGVuZGluZ01lc3NhZ2UgPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICBpZiAodGhpcy5fbWVzc2FnZXMgJiYgIXRoaXMuX21lc3NhZ2VzLmVtcHR5KSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGhhbmRsZXIsIHRoaXMuX21lc3NhZ2VzLnBvcCgpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSW5zdGFsbCBhIG1lc3NhZ2UgZmlsdGVyIGZvciB0aGUgZGlzcGF0Y2hlci5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuaW5zdGFsbE1lc3NhZ2VGaWx0ZXIgPSBmdW5jdGlvbiAoZmlsdGVyKSB7XG4gICAgICAgIHRoaXMuX2ZpbHRlcnMgPSB7IG5leHQ6IHRoaXMuX2ZpbHRlcnMsIGZpbHRlcjogZmlsdGVyIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIG9jY3VycmVuY2VzIG9mIGEgbWVzc2FnZSBmaWx0ZXIgZnJvbSB0aGUgZGlzcGF0Y2hlci5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUucmVtb3ZlTWVzc2FnZUZpbHRlciA9IGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgdmFyIGxpbmsgPSB0aGlzLl9maWx0ZXJzO1xuICAgICAgICB2YXIgcHJldiA9IG51bGw7XG4gICAgICAgIHdoaWxlIChsaW5rICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobGluay5maWx0ZXIgPT09IGZpbHRlcikge1xuICAgICAgICAgICAgICAgIGxpbmsuZmlsdGVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWx0ZXJzID0gbGluaztcbiAgICAgICAgICAgICAgICBwcmV2ID0gbGluaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByZXYubmV4dCA9IGxpbms7XG4gICAgICAgICAgICAgICAgcHJldiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5rID0gbGluay5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldikge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVycyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgbWVzc2FnZXMgYW5kIGZpbHRlcnMgZnJvbSB0aGUgZGlzcGF0Y2hlci5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9tZXNzYWdlcykge1xuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZXMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBsaW5rID0gdGhpcy5fZmlsdGVyczsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCkge1xuICAgICAgICAgICAgbGluay5maWx0ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2ZpbHRlcnMgPSBudWxsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBpbnN0YWxsZWQgbWVzc2FnZSBmaWx0ZXJzIGZvciB0aGUgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBtZXNzYWdlIHdhcyBmaWx0ZXJlZCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgTWVzc2FnZURpc3BhdGNoZXIucHJvdG90eXBlLl9maWx0ZXJNZXNzYWdlID0gZnVuY3Rpb24gKGhhbmRsZXIsIG1zZykge1xuICAgICAgICBmb3IgKHZhciBsaW5rID0gdGhpcy5fZmlsdGVyczsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCkge1xuICAgICAgICAgICAgaWYgKGxpbmsuZmlsdGVyICYmIGxpbmsuZmlsdGVyLmZpbHRlck1lc3NhZ2UoaGFuZGxlciwgbXNnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENvbXByZXNzIHRoZSBtc3NhZ2UgZm9yIHRoZSBnaXZlbiBoYW5kbGVyLlxuICAgICAqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1lc3NhZ2Ugd2FzIGNvbXByZXNzZWQsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIE1lc3NhZ2VEaXNwYXRjaGVyLnByb3RvdHlwZS5fY29tcHJlc3NNZXNzYWdlID0gZnVuY3Rpb24gKGhhbmRsZXIsIG1zZykge1xuICAgICAgICBpZiAoIWhhbmRsZXIuY29tcHJlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9tZXNzYWdlcyB8fCB0aGlzLl9tZXNzYWdlcy5lbXB0eSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmNvbXByZXNzTWVzc2FnZShtc2csIHRoaXMuX21lc3NhZ2VzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEVucXVldWUgdGhlIG1lc3NhZ2UgZm9yIGZ1dHVyZSBkZWxpdmVyeSB0byB0aGUgaGFuZGxlci5cbiAgICAgKi9cbiAgICBNZXNzYWdlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2VucXVldWVNZXNzYWdlID0gZnVuY3Rpb24gKGhhbmRsZXIsIG1zZykge1xuICAgICAgICAodGhpcy5fbWVzc2FnZXMgfHwgKHRoaXMuX21lc3NhZ2VzID0gbmV3IHBob3NwaG9yX3F1ZXVlXzEuUXVldWUoKSkpLnB1c2gobXNnKTtcbiAgICAgICAgZGlzcGF0Y2hRdWV1ZS5wdXNoKGhhbmRsZXIpO1xuICAgICAgICB3YWtlVXBNZXNzYWdlTG9vcCgpO1xuICAgIH07XG4gICAgcmV0dXJuIE1lc3NhZ2VEaXNwYXRjaGVyO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHBob3NwaG9yX3NpZ25hbGluZ18xID0gcmVxdWlyZSgncGhvc3Bob3Itc2lnbmFsaW5nJyk7XG4vKipcbiAqIEEgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuXG4gKlxuICogUHJvcGVydGllcyBkZXNjcmlwdG9ycyBjYW4gYmUgdXNlZCB0byBleHBvc2UgYSByaWNoIGludGVyZmFjZSBmb3IgYW5cbiAqIG9iamVjdCB3aGljaCBlbmNhcHN1bGF0ZXMgdmFsdWUgY3JlYXRpb24sIGNvZXJjaW9uLCBhbmQgbm90aWZpY2F0aW9uLlxuICogVGhleSBjYW4gYWxzbyBiZSB1c2VkIHRvIGV4dGVuZCB0aGUgc3RhdGUgb2YgYW4gb2JqZWN0IHdpdGggc2VtYW50aWNcbiAqIGRhdGEgZnJvbSBhbm90aGVyIGNsYXNzLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgUHJvcGVydHkgfSBmcm9tICdwaG9zcGhvci1wcm9wZXJ0aWVzJztcbiAqXG4gKiBjbGFzcyBNeUNsYXNzIHtcbiAqXG4gKiAgIHN0YXRpYyBteVZhbHVlUHJvcGVydHkgPSBuZXcgUHJvcGVydHk8TXlDbGFzcywgbnVtYmVyPih7XG4gKiAgICAgIHZhbHVlOiAwLFxuICogICAgICBjb2VyY2U6IChvd25lciwgdmFsdWUpID0+IE1hdGgubWF4KDAsIHZhbHVlKSxcbiAqICAgICAgY2hhbmdlZDogKG93bmVyLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID0+IHsgY29uc29sZS5sb2cobmV3VmFsdWUpOyB9LFxuICogICB9KTtcbiAqXG4gKiAgIGdldCBteVZhbHVlKCk6IG51bWJlciB7XG4gKiAgICAgcmV0dXJuIE15Q2xhc3MubXlWYWx1ZVByb3BlcnR5LmdldCh0aGlzKTtcbiAqICAgfVxuICpcbiAqICAgc2V0IG15VmFsdWUodmFsdWU6IG51bWJlcikge1xuICogICAgIE15Q2xhc3MubXlWYWx1ZVByb3BlcnR5LnNldCh0aGlzLCB2YWx1ZSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG52YXIgUHJvcGVydHkgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBwcm9wZXJ0eSBkZXNjcmlwdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBmb3IgaW5pdGlhbGl6aW5nIHRoZSBwcm9wZXJ0eS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBQcm9wZXJ0eShvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgICAgIHRoaXMuX3BpZCA9IG5leHRQSUQoKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBvcHRpb25zLnZhbHVlO1xuICAgICAgICB0aGlzLl9jcmVhdGUgPSBvcHRpb25zLmNyZWF0ZTtcbiAgICAgICAgdGhpcy5fY29lcmNlID0gb3B0aW9ucy5jb2VyY2U7XG4gICAgICAgIHRoaXMuX2NvbXBhcmUgPSBvcHRpb25zLmNvbXBhcmU7XG4gICAgICAgIHRoaXMuX2NoYW5nZWQgPSBvcHRpb25zLmNoYW5nZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCBhIGJvdW5kIFtbY2hhbmdlZFNpZ25hbF1dIGZvciBhIGdpdmVuIHByb3BlcnR5IG93bmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIG93bmVyIC0gVGhlIG9iamVjdCB0byBiaW5kIHRvIHRoZSBjaGFuZ2VkIHNpZ25hbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBib3VuZCBjaGFuZ2VkIHNpZ25hbCBmb3IgdGhlIG93bmVyLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgc2lnbmFsIHdpbGwgYmUgZW1pdHRlZCB3aGVuZXZlciBhbnkgcHJvcGVydHkgdmFsdWVcbiAgICAgKiBmb3IgdGhlIHNwZWNpZmllZCBvd25lciBpcyBjaGFuZ2VkLlxuICAgICAqL1xuICAgIFByb3BlcnR5LmdldENoYW5nZWQgPSBmdW5jdGlvbiAob3duZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb3BlcnR5LmNoYW5nZWRTaWduYWwuYmluZChvd25lcik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHByb3BlcnR5IGZvciBhIGdpdmVuIG93bmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIG93bmVyIC0gVGhlIHByb3BlcnR5IG93bmVyIG9mIGludGVyZXN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIElmIHRoZSB2YWx1ZSBoYXMgbm90IHlldCBiZWVuIHNldCwgdGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZVxuICAgICAqIGNvbXB1dGVkIGFuZCBhc3NpZ25lZCBhcyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvd25lcikge1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIHZhciBoYXNoID0gbG9va3VwSGFzaChvd25lcik7XG4gICAgICAgIGlmICh0aGlzLl9waWQgaW4gaGFzaCkge1xuICAgICAgICAgICAgdmFsdWUgPSBoYXNoW3RoaXMuX3BpZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGhhc2hbdGhpcy5fcGlkXSA9IHRoaXMuX2NyZWF0ZVZhbHVlKG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHByb3BlcnR5IGZvciBhIGdpdmVuIG93bmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIG93bmVyIC0gVGhlIHByb3BlcnR5IG93bmVyIG9mIGludGVyZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgdGhpcyBvcGVyYXRpb24gY2F1c2VzIHRoZSBwcm9wZXJ0eSB2YWx1ZSB0byBjaGFuZ2UsIHRoZVxuICAgICAqIFtbY2hhbmdlZFNpZ25hbF1dIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRoZSBvd25lciBhcyBzZW5kZXIuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgdmFsdWUgaGFzIG5vdCB5ZXQgYmVlbiBzZXQsIHRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmVcbiAgICAgKiBjb21wdXRlZCBhbmQgdXNlZCBhcyB0aGUgcHJldmlvdXMgdmFsdWUgZm9yIHRoZSBjb21wYXJpc29uLlxuICAgICAqL1xuICAgIFByb3BlcnR5LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAob3duZXIsIHZhbHVlKSB7XG4gICAgICAgIHZhciBvbGRWYWx1ZTtcbiAgICAgICAgdmFyIGhhc2ggPSBsb29rdXBIYXNoKG93bmVyKTtcbiAgICAgICAgaWYgKHRoaXMuX3BpZCBpbiBoYXNoKSB7XG4gICAgICAgICAgICBvbGRWYWx1ZSA9IGhhc2hbdGhpcy5fcGlkXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9sZFZhbHVlID0gaGFzaFt0aGlzLl9waWRdID0gdGhpcy5fY3JlYXRlVmFsdWUob3duZXIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuX2NvZXJjZVZhbHVlKG93bmVyLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX21heWJlTm90aWZ5KG93bmVyLCBvbGRWYWx1ZSwgaGFzaFt0aGlzLl9waWRdID0gbmV3VmFsdWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhwbGljaXRseSBjb2VyY2UgdGhlIGN1cnJlbnQgcHJvcGVydHkgdmFsdWUgZm9yIGEgZ2l2ZW4gb3duZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3duZXIgLSBUaGUgcHJvcGVydHkgb3duZXIgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgdGhpcyBvcGVyYXRpb24gY2F1c2VzIHRoZSBwcm9wZXJ0eSB2YWx1ZSB0byBjaGFuZ2UsIHRoZVxuICAgICAqIFtbY2hhbmdlZFNpZ25hbF1dIHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRoZSBvd25lciBhcyBzZW5kZXIuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgdmFsdWUgaGFzIG5vdCB5ZXQgYmVlbiBzZXQsIHRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmVcbiAgICAgKiBjb21wdXRlZCBhbmQgdXNlZCBhcyB0aGUgcHJldmlvdXMgdmFsdWUgZm9yIHRoZSBjb21wYXJpc29uLlxuICAgICAqL1xuICAgIFByb3BlcnR5LnByb3RvdHlwZS5jb2VyY2UgPSBmdW5jdGlvbiAob3duZXIpIHtcbiAgICAgICAgdmFyIG9sZFZhbHVlO1xuICAgICAgICB2YXIgaGFzaCA9IGxvb2t1cEhhc2gob3duZXIpO1xuICAgICAgICBpZiAodGhpcy5fcGlkIGluIGhhc2gpIHtcbiAgICAgICAgICAgIG9sZFZhbHVlID0gaGFzaFt0aGlzLl9waWRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb2xkVmFsdWUgPSBoYXNoW3RoaXMuX3BpZF0gPSB0aGlzLl9jcmVhdGVWYWx1ZShvd25lcik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5fY29lcmNlVmFsdWUob3duZXIsIG9sZFZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWF5YmVOb3RpZnkob3duZXIsIG9sZFZhbHVlLCBoYXNoW3RoaXMuX3BpZF0gPSBuZXdWYWx1ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgb3IgY3JlYXRlIHRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZ2l2ZW4gb3duZXIuXG4gICAgICovXG4gICAgUHJvcGVydHkucHJvdG90eXBlLl9jcmVhdGVWYWx1ZSA9IGZ1bmN0aW9uIChvd25lcikge1xuICAgICAgICB2YXIgY3JlYXRlID0gdGhpcy5fY3JlYXRlO1xuICAgICAgICByZXR1cm4gY3JlYXRlID8gY3JlYXRlKG93bmVyKSA6IHRoaXMuX3ZhbHVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ29lcmNlIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIG93bmVyLlxuICAgICAqL1xuICAgIFByb3BlcnR5LnByb3RvdHlwZS5fY29lcmNlVmFsdWUgPSBmdW5jdGlvbiAob3duZXIsIHZhbHVlKSB7XG4gICAgICAgIHZhciBjb2VyY2UgPSB0aGlzLl9jb2VyY2U7XG4gICAgICAgIHJldHVybiBjb2VyY2UgPyBjb2VyY2Uob3duZXIsIHZhbHVlKSA6IHZhbHVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ29tcGFyZSB0aGUgb2xkIHZhbHVlIGFuZCBuZXcgdmFsdWUgZm9yIGVxdWFsaXR5LlxuICAgICAqL1xuICAgIFByb3BlcnR5LnByb3RvdHlwZS5fY29tcGFyZVZhbHVlID0gZnVuY3Rpb24gKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmU7XG4gICAgICAgIHJldHVybiBjb21wYXJlID8gY29tcGFyZShvbGRWYWx1ZSwgbmV3VmFsdWUpIDogb2xkVmFsdWUgPT09IG5ld1ZhbHVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBjaGFuZ2Ugbm90aWZpY2F0aW9uIGlmIHRoZSBnaXZlbiB2YWx1ZXMgYXJlIGRpZmZlcmVudC5cbiAgICAgKi9cbiAgICBQcm9wZXJ0eS5wcm90b3R5cGUuX21heWJlTm90aWZ5ID0gZnVuY3Rpb24gKG93bmVyLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb21wYXJlVmFsdWUob2xkVmFsdWUsIG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSB0aGlzLl9jaGFuZ2VkO1xuICAgICAgICAgICAgaWYgKGNoYW5nZWQpXG4gICAgICAgICAgICAgICAgY2hhbmdlZChvd25lciwgb2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIFByb3BlcnR5LmdldENoYW5nZWQob3duZXIpLmVtaXQoY2hhbmdlZEFyZ3ModGhpcywgb2xkVmFsdWUsIG5ld1ZhbHVlKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgc2lnbmFsIGVtaXR0ZWQgd2hlbiBhIHByb3BlcnR5IHZhbHVlIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBpcyBhbiBhdHRhY2hlZCBzaWduYWwgd2hpY2ggd2lsbCBiZSBlbWl0dGVkIHVzaW5nIHRoZVxuICAgICAqIG93bmVyIG9mIHRoZSBwcm9wZXJ0eSB2YWx1ZSBhcyB0aGUgc2VuZGVyLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW2dldENoYW5nZWRdXVxuICAgICAqL1xuICAgIFByb3BlcnR5LmNoYW5nZWRTaWduYWwgPSBuZXcgcGhvc3Bob3Jfc2lnbmFsaW5nXzEuU2lnbmFsKCk7XG4gICAgcmV0dXJuIFByb3BlcnR5O1xufSkoKTtcbmV4cG9ydHMuUHJvcGVydHkgPSBQcm9wZXJ0eTtcbi8qKlxuICogQ2xlYXIgdGhlIHN0b3JlZCBwcm9wZXJ0eSBkYXRhIGZvciB0aGUgZ2l2ZW4gcHJvcGVydHkgb3duZXIuXG4gKlxuICogQHBhcmFtIG93bmVyIC0gVGhlIHByb3BlcnR5IG93bmVyIG9mIGludGVyZXN0LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgd2lsbCBjbGVhciBhbGwgcHJvcGVydHkgdmFsdWVzIGZvciB0aGUgb3duZXIsIGJ1dCBpdCB3aWxsXG4gKiAqKm5vdCoqIGVtaXQgYW55IGNoYW5nZSBub3RpZmljYXRpb25zLlxuICovXG5mdW5jdGlvbiBjbGVhclByb3BlcnR5RGF0YShvd25lcikge1xuICAgIG93bmVyRGF0YS5kZWxldGUob3duZXIpO1xufVxuZXhwb3J0cy5jbGVhclByb3BlcnR5RGF0YSA9IGNsZWFyUHJvcGVydHlEYXRhO1xuLyoqXG4gKiBBIHdlYWsgbWFwcGluZyBvZiBwcm9wZXJ0eSBvd25lciB0byBwcm9wZXJ0eSBoYXNoLlxuICovXG52YXIgb3duZXJEYXRhID0gbmV3IFdlYWtNYXAoKTtcbi8qKlxuICogQSBmdW5jdGlvbiB3aGljaCBjb21wdXRlcyBzdWNjZXNzaXZlIHVuaXF1ZSBwcm9wZXJ0eSBpZHMuXG4gKi9cbnZhciBuZXh0UElEID0gKGZ1bmN0aW9uICgpIHsgdmFyIGlkID0gMDsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdwaWQtJyArIGlkKys7IH07IH0pKCk7XG4vKipcbiAqIENyZWF0ZSB0aGUgY2hhbmdlZCBhcmdzIGZvciB0aGUgZ2l2ZW4gcHJvcGVydHkgYW5kIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gY2hhbmdlZEFyZ3MocHJvcGVydHksIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgIHJldHVybiB7IHByb3BlcnR5OiBwcm9wZXJ0eSwgb2xkVmFsdWU6IG9sZFZhbHVlLCBuZXdWYWx1ZTogbmV3VmFsdWUgfTtcbn1cbi8qKlxuICogTG9va3VwIHRoZSBkYXRhIGhhc2ggZm9yIHRoZSBwcm9wZXJ0eSBvd25lci5cbiAqXG4gKiBUaGlzIHdpbGwgY3JlYXRlIHRoZSBoYXNoIGlmIG9uZSBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICovXG5mdW5jdGlvbiBsb29rdXBIYXNoKG93bmVyKSB7XG4gICAgdmFyIGhhc2ggPSBvd25lckRhdGEuZ2V0KG93bmVyKTtcbiAgICBpZiAoaGFzaCAhPT0gdm9pZCAwKVxuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICBoYXNoID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBvd25lckRhdGEuc2V0KG93bmVyLCBoYXNoKTtcbiAgICByZXR1cm4gaGFzaDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnwgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIFBob3NwaG9ySlMgQ29udHJpYnV0b3JzXG58XG58IERpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQlNEIDMtQ2xhdXNlIExpY2Vuc2UuXG58XG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxufC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBBIGdlbmVyaWMgRklGTyBxdWV1ZSBkYXRhIHN0cnVjdHVyZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIHF1ZXVlIGlzIGltcGxlbWVudGVkIGludGVybmFsbHkgdXNpbmcgYSBzaW5nbHkgbGlua2VkIGxpc3QgYW5kXG4gKiBjYW4gZ3JvdyB0byBhcmJpdHJhcnkgc2l6ZS5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHZhciBxID0gbmV3IFF1ZXVlPG51bWJlcj4oWzAsIDEsIDJdKTtcbiAqIHEuc2l6ZTsgICAgICAvLyAzXG4gKiBxLmVtcHR5OyAgICAgLy8gZmFsc2VcbiAqIHEucG9wKCk7ICAgICAvLyAwXG4gKiBxLnBvcCgpOyAgICAgLy8gMVxuICogcS5wdXNoKDQyKTsgIC8vIHVuZGVmaW5lZFxuICogcS5zaXplOyAgICAgIC8vIDJcbiAqIHEucG9wKCk7ICAgICAvLyAyXG4gKiBxLnBvcCgpOyAgICAgLy8gNDJcbiAqIHEucG9wKCk7ICAgICAvLyB1bmRlZmluZWRcbiAqIHEuc2l6ZTsgICAgICAvLyAwXG4gKiBxLmVtcHR5OyAgICAgLy8gdHJ1ZVxuICogYGBgXG4gKi9cbnZhciBRdWV1ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IHF1ZXVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW1zIC0gVGhlIGluaXRpYWwgaXRlbXMgZm9yIHRoZSBxdWV1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBRdWV1ZShpdGVtcykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9zaXplID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9iYWNrID0gbnVsbDtcbiAgICAgICAgaWYgKGl0ZW1zKVxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gX3RoaXMucHVzaChpdGVtKTsgfSk7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWV1ZS5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcXVldWUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVldWUucHJvdG90eXBlLCBcImVtcHR5XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgcXVldWUgaXMgZW1wdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplID09PSAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVldWUucHJvdG90eXBlLCBcImZyb250XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgdmFsdWUgYXQgdGhlIGZyb250IG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGhhcyBgTygxKWAgY29tcGxleGl0eS5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIHF1ZXVlIGlzIGVtcHR5LCB0aGlzIHZhbHVlIHdpbGwgYmUgYHVuZGVmaW5lZGAuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcm9udCAhPT0gbnVsbCA/IHRoaXMuX2Zyb250LnZhbHVlIDogdm9pZCAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVldWUucHJvdG90eXBlLCBcImJhY2tcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSB2YWx1ZSBhdCB0aGUgYmFjayBvZiB0aGUgcXVldWUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBxdWV1ZSBpcyBlbXB0eSwgdGhpcyB2YWx1ZSB3aWxsIGJlIGB1bmRlZmluZWRgLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFjayAhPT0gbnVsbCA/IHRoaXMuX2JhY2sudmFsdWUgOiB2b2lkIDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFB1c2ggYSB2YWx1ZSBvbnRvIHRoZSBiYWNrIG9mIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBhZGQgdG8gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKDEpYCBjb21wbGV4aXR5LlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBsaW5rID0geyBuZXh0OiBudWxsLCB2YWx1ZTogdmFsdWUgfTtcbiAgICAgICAgaWYgKHRoaXMuX2JhY2sgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBsaW5rO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYmFjay5uZXh0ID0gbGluaztcbiAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBsaW5rO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NpemUrKztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBvcCBhbmQgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGUgZnJvbnQgb2YgdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIHZhbHVlIGF0IHRoZSBmcm9udCBvZiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oMSlgIGNvbXBsZXhpdHkuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgcXVldWUgaXMgZW1wdHksIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBgdW5kZWZpbmVkYC5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGluayA9IHRoaXMuX2Zyb250O1xuICAgICAgICBpZiAobGluayA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGluay5uZXh0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9mcm9udCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9iYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbGluay5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NpemUtLTtcbiAgICAgICAgcmV0dXJuIGxpbmsudmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYSB2YWx1ZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byByZW1vdmUgZnJvbSB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgb24gc3VjY2VzcywgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgbGluayA9IHRoaXMuX2Zyb250O1xuICAgICAgICB2YXIgcHJldiA9IG51bGw7XG4gICAgICAgIHdoaWxlIChsaW5rICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobGluay52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm9udCA9IGxpbmsubmV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXYubmV4dCA9IGxpbmsubmV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpbmsubmV4dCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iYWNrID0gcHJldjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZS0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldiA9IGxpbms7XG4gICAgICAgICAgICBsaW5rID0gbGluay5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgb2NjdXJyZW5jZXMgb2YgYSB2YWx1ZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byByZW1vdmUgZnJvbSB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgbnVtYmVyIG9mIG9jY3VycmVuY2VzIHJlbW92ZWQuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICB2YXIgbGluayA9IHRoaXMuX2Zyb250O1xuICAgICAgICB2YXIgcHJldiA9IG51bGw7XG4gICAgICAgIHdoaWxlIChsaW5rICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobGluay52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NpemUtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcm9udCA9IGxpbms7XG4gICAgICAgICAgICAgICAgcHJldiA9IGxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmV2Lm5leHQgPSBsaW5rO1xuICAgICAgICAgICAgICAgIHByZXYgPSBsaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluayA9IGxpbmsubmV4dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXYpIHtcbiAgICAgICAgICAgIHRoaXMuX2Zyb250ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJldi5uZXh0ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2JhY2sgPSBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgdmFsdWVzIGZyb20gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKDEpYCBjb21wbGV4aXR5LlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb250ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYmFjayA9IG51bGw7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gYXJyYXkgZnJvbSB0aGUgdmFsdWVzIGluIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGFsbCB2YWx1ZXMgaW4gdGhlIHF1ZXVlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKE4pYCBjb21wbGV4aXR5LlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMuX3NpemUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGluayA9IHRoaXMuX2Zyb250OyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0LCArK2kpIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IGxpbmsudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRlc3Qgd2hldGhlciBhbnkgdmFsdWUgaW4gdGhlIHF1ZXVlIHBhc3NlcyBhIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIGFueSB2YWx1ZSBpbiB0aGUgcXVldWUgcGFzc2VzIHRoZSBwcmVkaWNhdGUsXG4gICAgICogICBvciBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIGhhcyBgTyhOKWAgY29tcGxleGl0eS5cbiAgICAgKlxuICAgICAqIEl0IGlzICoqbm90Kiogc2FmZSBmb3IgdGhlIHByZWRpY2F0ZSB0byBtb2RpZnkgdGhlIHF1ZXVlIHdoaWxlXG4gICAgICogaXRlcmF0aW5nLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5zb21lID0gZnVuY3Rpb24gKHByZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmsgPSB0aGlzLl9mcm9udDsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCwgKytpKSB7XG4gICAgICAgICAgICBpZiAocHJlZChsaW5rLnZhbHVlLCBpKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUZXN0IHdoZXRoZXIgYWxsIHZhbHVlcyBpbiB0aGUgcXVldWUgcGFzcyBhIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIGFsbCB2YWx1ZXMgaW4gdGhlIHF1ZXVlIHBhc3MgdGhlIHByZWRpY2F0ZSxcbiAgICAgKiAgIG9yIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKE4pYCBjb21wbGV4aXR5LlxuICAgICAqXG4gICAgICogSXQgaXMgKipub3QqKiBzYWZlIGZvciB0aGUgcHJlZGljYXRlIHRvIG1vZGlmeSB0aGUgcXVldWUgd2hpbGVcbiAgICAgKiBpdGVyYXRpbmcuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmV2ZXJ5ID0gZnVuY3Rpb24gKHByZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmsgPSB0aGlzLl9mcm9udDsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCwgKytpKSB7XG4gICAgICAgICAgICBpZiAoIXByZWQobGluay52YWx1ZSwgaSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIGFycmF5IG9mIHRoZSB2YWx1ZXMgd2hpY2ggcGFzcyBhIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwcmVkIC0gVGhlIHByZWRpY2F0ZSB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGFycmF5IG9mIHZhbHVlcyB3aGljaCBwYXNzIHRoZSBwcmVkaWNhdGUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICpcbiAgICAgKiBJdCBpcyAqKm5vdCoqIHNhZmUgZm9yIHRoZSBwcmVkaWNhdGUgdG8gbW9kaWZ5IHRoZSBxdWV1ZSB3aGlsZVxuICAgICAqIGl0ZXJhdGluZy5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gKHByZWQpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGluayA9IHRoaXMuX2Zyb250OyBsaW5rICE9PSBudWxsOyBsaW5rID0gbGluay5uZXh0LCArK2kpIHtcbiAgICAgICAgICAgIGlmIChwcmVkKGxpbmsudmFsdWUsIGkpKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpbmsudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gYXJyYXkgb2YgbWFwcGVkIHZhbHVlcyBmb3IgdGhlIHZhbHVlcyBpbiB0aGUgcXVldWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgbWFwIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIHRoZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBtYXAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBoYXMgYE8oTilgIGNvbXBsZXhpdHkuXG4gICAgICpcbiAgICAgKiBJdCBpcyAqKm5vdCoqIHNhZmUgZm9yIHRoZSBjYWxsYmFjayB0byBtb2RpZnkgdGhlIHF1ZXVlIHdoaWxlXG4gICAgICogaXRlcmF0aW5nLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSh0aGlzLl9zaXplKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmsgPSB0aGlzLl9mcm9udDsgbGluayAhPT0gbnVsbDsgbGluayA9IGxpbmsubmV4dCwgKytpKSB7XG4gICAgICAgICAgICByZXN1bHRbaV0gPSBjYWxsYmFjayhsaW5rLnZhbHVlLCBpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhIGNhbGxiYWNrIGZvciBlYWNoIHZhbHVlIGluIHRoZSBxdWV1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBmdW5jdGlvbiB0byBhcHBseSB0byB0aGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGZpcnN0IHZhbHVlIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayB3aGljaCBpcyBub3RcbiAgICAgKiAgIGB1bmRlZmluZWRgLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgaGFzIGBPKE4pYCBjb21wbGV4aXR5LlxuICAgICAqXG4gICAgICogSXRlcmF0aW9uIHdpbGwgdGVybWluYXRlIGltbWVkaWF0ZWx5IGlmIHRoZSBjYWxsYmFjayByZXR1cm5zIGFueVxuICAgICAqIHZhbHVlIG90aGVyIHRoYW4gYHVuZGVmaW5lZGAuXG4gICAgICpcbiAgICAgKiBJdCBpcyAqKm5vdCoqIHNhZmUgZm9yIHRoZSBjYWxsYmFjayB0byBtb2RpZnkgdGhlIHF1ZXVlIHdoaWxlXG4gICAgICogaXRlcmF0aW5nLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsaW5rID0gdGhpcy5fZnJvbnQ7IGxpbmsgIT09IG51bGw7IGxpbmsgPSBsaW5rLm5leHQsICsraSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKGxpbmsudmFsdWUsIGkpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9O1xuICAgIHJldHVybiBRdWV1ZTtcbn0pKCk7XG5leHBvcnRzLlF1ZXVlID0gUXVldWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQW4gb2JqZWN0IHVzZWQgZm9yIHR5cGUtc2FmZSBpbnRlci1vYmplY3QgY29tbXVuaWNhdGlvbi5cbiAqXG4gKiBTaWduYWxzIHByb3ZpZGUgYSB0eXBlLXNhZmUgaW1wbGVtZW50YXRpb24gb2YgdGhlIHB1Ymxpc2gtc3Vic2NyaWJlXG4gKiBwYXR0ZXJuLiBBbiBvYmplY3QgKHB1Ymxpc2hlcikgZGVjbGFyZXMgd2hpY2ggc2lnbmFscyBpdCB3aWxsIGVtaXQsXG4gKiBhbmQgY29uc3VtZXJzIGNvbm5lY3QgY2FsbGJhY2tzIChzdWJzY3JpYmVycykgdG8gdGhvc2Ugc2lnbmFscy4gVGhlXG4gKiBzdWJzY3JpYmVycyBhcmUgaW52b2tlZCB3aGVuZXZlciB0aGUgcHVibGlzaGVyIGVtaXRzIHRoZSBzaWduYWwuXG4gKlxuICogQSBgU2lnbmFsYCBvYmplY3QgbXVzdCBiZSBib3VuZCB0byBhIHNlbmRlciBpbiBvcmRlciB0byBiZSB1c2VmdWwuXG4gKiBBIGNvbW1vbiBwYXR0ZXJuIGlzIHRvIGRlY2xhcmUgYSBgU2lnbmFsYCBvYmplY3QgYXMgYSBzdGF0aWMgY2xhc3NcbiAqIG1lbWJlciwgYWxvbmcgd2l0aCBhIGNvbnZlbmllbmNlIGdldHRlciB3aGljaCBiaW5kcyB0aGUgc2lnbmFsIHRvXG4gKiB0aGUgYHRoaXNgIGluc3RhbmNlIG9uLWRlbWFuZC5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IElTaWduYWwsIFNpZ25hbCB9IGZyb20gJ3Bob3NwaG9yLXNpZ25hbGluZyc7XG4gKlxuICogY2xhc3MgTXlDbGFzcyB7XG4gKlxuICogICBzdGF0aWMgdmFsdWVDaGFuZ2VkU2lnbmFsID0gbmV3IFNpZ25hbDxNeUNsYXNzLCBudW1iZXI+KCk7XG4gKlxuICogICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAqICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAqICAgfVxuICpcbiAqICAgZ2V0IHZhbHVlQ2hhbmdlZCgpOiBJU2lnbmFsPE15Q2xhc3MsIG51bWJlcj4ge1xuICogICAgIHJldHVybiBNeUNsYXNzLnZhbHVlQ2hhbmdlZFNpZ25hbC5iaW5kKHRoaXMpO1xuICogICB9XG4gKlxuICogICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICogICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICogICB9XG4gKlxuICogICBnZXQgdmFsdWUoKTogbnVtYmVyIHtcbiAqICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gKiAgIH1cbiAqXG4gKiAgIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyKSB7XG4gKiAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl92YWx1ZSkge1xuICogICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAqICAgICAgIHRoaXMudmFsdWVDaGFuZ2VkLmVtaXQodmFsdWUpO1xuICogICAgIH1cbiAqICAgfVxuICpcbiAqICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICogICBwcml2YXRlIF92YWx1ZSA9IDA7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gbG9nZ2VyKHNlbmRlcjogTXlDbGFzcywgdmFsdWU6IG51bWJlcik6IHZvaWQge1xuICogICBjb25zb2xlLmxvZyhzZW5kZXIubmFtZSwgdmFsdWUpO1xuICogfVxuICpcbiAqIHZhciBtMSA9IG5ldyBNeUNsYXNzKCdmb28nKTtcbiAqIHZhciBtMiA9IG5ldyBNeUNsYXNzKCdiYXInKTtcbiAqXG4gKiBtMS52YWx1ZUNoYW5nZWQuY29ubmVjdChsb2dnZXIpO1xuICogbTIudmFsdWVDaGFuZ2VkLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBtMS52YWx1ZSA9IDQyOyAgLy8gbG9nczogZm9vIDQyXG4gKiBtMi52YWx1ZSA9IDE3OyAgLy8gbG9nczogYmFyIDE3XG4gKiBgYGBcbiAqL1xudmFyIFNpZ25hbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lnbmFsKCkge1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBCaW5kIHRoZSBzaWduYWwgdG8gYSBzcGVjaWZpYyBzZW5kZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QgdG8gYmluZCB0byB0aGUgc2lnbmFsLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIGJvdW5kIHNpZ25hbCBvYmplY3Qgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNvbm5lY3RpbmcsXG4gICAgICogICBkaXNjb25uZWN0aW5nLCBhbmQgZW1pdHRpbmcgdGhlIHNpZ25hbC5cbiAgICAgKi9cbiAgICBTaWduYWwucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRTaWduYWwodGhpcywgc2VuZGVyKTtcbiAgICB9O1xuICAgIHJldHVybiBTaWduYWw7XG59KSgpO1xuZXhwb3J0cy5TaWduYWwgPSBTaWduYWw7XG4vKipcbiAqIFJlbW92ZSBhbGwgY29ubmVjdGlvbnMgd2hlcmUgdGhlIGdpdmVuIG9iamVjdCBpcyB0aGUgc2VuZGVyLlxuICpcbiAqIEBwYXJhbSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdCBvZiBpbnRlcmVzdC5cbiAqXG4gKiAjIyMjIEV4YW1wbGVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGRpc2Nvbm5lY3RTZW5kZXIoc29tZU9iamVjdCk7XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gZGlzY29ubmVjdFNlbmRlcihzZW5kZXIpIHtcbiAgICB2YXIgbGlzdCA9IHNlbmRlck1hcC5nZXQoc2VuZGVyKTtcbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY29ubiA9IGxpc3QuZmlyc3Q7XG4gICAgd2hpbGUgKGNvbm4gIT09IG51bGwpIHtcbiAgICAgICAgcmVtb3ZlRnJvbVNlbmRlcnNMaXN0KGNvbm4pO1xuICAgICAgICBjb25uLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgY29ubi50aGlzQXJnID0gbnVsbDtcbiAgICAgICAgY29ubiA9IGNvbm4ubmV4dFJlY2VpdmVyO1xuICAgIH1cbiAgICBzZW5kZXJNYXAuZGVsZXRlKHNlbmRlcik7XG59XG5leHBvcnRzLmRpc2Nvbm5lY3RTZW5kZXIgPSBkaXNjb25uZWN0U2VuZGVyO1xuLyoqXG4gKiBSZW1vdmUgYWxsIGNvbm5lY3Rpb25zIHdoZXJlIHRoZSBnaXZlbiBvYmplY3QgaXMgdGhlIHJlY2VpdmVyLlxuICpcbiAqIEBwYXJhbSByZWNlaXZlciAtIFRoZSByZWNlaXZlciBvYmplY3Qgb2YgaW50ZXJlc3QuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogSWYgYSBgdGhpc0FyZ2AgaXMgcHJvdmlkZWQgd2hlbiBjb25uZWN0aW5nIGEgc2lnbmFsLCB0aGF0IG9iamVjdFxuICogaXMgY29uc2lkZXJlZCB0aGUgcmVjZWl2ZXIuIE90aGVyd2lzZSwgdGhlIGBjYWxsYmFja2AgaXMgdXNlZCBhc1xuICogdGhlIHJlY2VpdmVyLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gZGlzY29ubmVjdCBhIHJlZ3VsYXIgb2JqZWN0IHJlY2VpdmVyXG4gKiBkaXNjb25uZWN0UmVjZWl2ZXIobXlPYmplY3QpO1xuICpcbiAqIC8vIGRpc2Nvbm5lY3QgYSBwbGFpbiBjYWxsYmFjayByZWNlaXZlclxuICogZGlzY29ubmVjdFJlY2VpdmVyKG15Q2FsbGJhY2spO1xuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGRpc2Nvbm5lY3RSZWNlaXZlcihyZWNlaXZlcikge1xuICAgIHZhciBjb25uID0gcmVjZWl2ZXJNYXAuZ2V0KHJlY2VpdmVyKTtcbiAgICBpZiAoIWNvbm4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aGlsZSAoY29ubiAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbmV4dCA9IGNvbm4ubmV4dFNlbmRlcjtcbiAgICAgICAgY29ubi5jYWxsYmFjayA9IG51bGw7XG4gICAgICAgIGNvbm4udGhpc0FyZyA9IG51bGw7XG4gICAgICAgIGNvbm4ucHJldlNlbmRlciA9IG51bGw7XG4gICAgICAgIGNvbm4ubmV4dFNlbmRlciA9IG51bGw7XG4gICAgICAgIGNvbm4gPSBuZXh0O1xuICAgIH1cbiAgICByZWNlaXZlck1hcC5kZWxldGUocmVjZWl2ZXIpO1xufVxuZXhwb3J0cy5kaXNjb25uZWN0UmVjZWl2ZXIgPSBkaXNjb25uZWN0UmVjZWl2ZXI7XG4vKipcbiAqIENsZWFyIGFsbCBzaWduYWwgZGF0YSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gVGhlIG9iamVjdCBmb3Igd2hpY2ggdGhlIHNpZ25hbCBkYXRhIHNob3VsZCBiZSBjbGVhcmVkLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgcmVtb3ZlcyBhbGwgc2lnbmFsIGNvbm5lY3Rpb25zIHdoZXJlIHRoZSBvYmplY3QgaXMgdXNlZCBhc1xuICogZWl0aGVyIHRoZSBzZW5kZXIgb3IgdGhlIHJlY2VpdmVyLlxuICpcbiAqICMjIyMgRXhhbXBsZVxuICogYGBgdHlwZXNjcmlwdFxuICogY2xlYXJTaWduYWxEYXRhKHNvbWVPYmplY3QpO1xuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGNsZWFyU2lnbmFsRGF0YShvYmopIHtcbiAgICBkaXNjb25uZWN0U2VuZGVyKG9iaik7XG4gICAgZGlzY29ubmVjdFJlY2VpdmVyKG9iaik7XG59XG5leHBvcnRzLmNsZWFyU2lnbmFsRGF0YSA9IGNsZWFyU2lnbmFsRGF0YTtcbi8qKlxuICogQSBjb25jcmV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBJU2lnbmFsLlxuICovXG52YXIgQm91bmRTaWduYWwgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBib3VuZCBzaWduYWwuXG4gICAgICovXG4gICAgZnVuY3Rpb24gQm91bmRTaWduYWwoc2lnbmFsLCBzZW5kZXIpIHtcbiAgICAgICAgdGhpcy5fc2lnbmFsID0gc2lnbmFsO1xuICAgICAgICB0aGlzLl9zZW5kZXIgPSBzZW5kZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbm5lY3QgYSBjYWxsYmFjayB0byB0aGUgc2lnbmFsLlxuICAgICAqL1xuICAgIEJvdW5kU2lnbmFsLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIHJldHVybiBjb25uZWN0KHRoaXMuX3NlbmRlciwgdGhpcy5fc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IGEgY2FsbGJhY2sgZnJvbSB0aGUgc2lnbmFsLlxuICAgICAqL1xuICAgIEJvdW5kU2lnbmFsLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIHJldHVybiBkaXNjb25uZWN0KHRoaXMuX3NlbmRlciwgdGhpcy5fc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFbWl0IHRoZSBzaWduYWwgYW5kIGludm9rZSB0aGUgY29ubmVjdGVkIGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBCb3VuZFNpZ25hbC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIGVtaXQodGhpcy5fc2VuZGVyLCB0aGlzLl9zaWduYWwsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIEJvdW5kU2lnbmFsO1xufSkoKTtcbi8qKlxuICogQSBzdHJ1Y3Qgd2hpY2ggaG9sZHMgY29ubmVjdGlvbiBkYXRhLlxuICovXG52YXIgQ29ubmVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29ubmVjdGlvbigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzaWduYWwgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zaWduYWwgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNhbGxiYWNrIGNvbm5lY3RlZCB0byB0aGUgc2lnbmFsLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYHRoaXNgIGNvbnRleHQgZm9yIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudGhpc0FyZyA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmV4dCBjb25uZWN0aW9uIGluIHRoZSBzaW5nbHkgbGlua2VkIHJlY2VpdmVycyBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uZXh0UmVjZWl2ZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5leHQgY29ubmVjdGlvbiBpbiB0aGUgZG91Ymx5IGxpbmtlZCBzZW5kZXJzIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5leHRTZW5kZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByZXZpb3VzIGNvbm5lY3Rpb24gaW4gdGhlIGRvdWJseSBsaW5rZWQgc2VuZGVycyBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wcmV2U2VuZGVyID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIENvbm5lY3Rpb247XG59KSgpO1xuLyoqXG4gKiBUaGUgbGlzdCBvZiByZWNlaXZlciBjb25uZWN0aW9ucyBmb3IgYSBzcGVjaWZpYyBzZW5kZXIuXG4gKi9cbnZhciBDb25uZWN0aW9uTGlzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29ubmVjdGlvbkxpc3QoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmVmIGNvdW50IGZvciB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVmcyA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZmlyc3QgY29ubmVjdGlvbiBpbiB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlyc3QgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGxhc3QgY29ubmVjdGlvbiBpbiB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubGFzdCA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBDb25uZWN0aW9uTGlzdDtcbn0pKCk7XG4vKipcbiAqIEEgbWFwcGluZyBvZiBzZW5kZXIgb2JqZWN0IHRvIGl0cyByZWNlaXZlciBjb25uZWN0aW9uIGxpc3QuXG4gKi9cbnZhciBzZW5kZXJNYXAgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBBIG1hcHBpbmcgb2YgcmVjZWl2ZXIgb2JqZWN0IHRvIGl0cyBzZW5kZXIgY29ubmVjdGlvbiBsaXN0LlxuICovXG52YXIgcmVjZWl2ZXJNYXAgPSBuZXcgV2Vha01hcCgpO1xuLyoqXG4gKiBDcmVhdGUgYSBjb25uZWN0aW9uIGJldHdlZW4gYSBzZW5kZXIsIHNpZ25hbCwgYW5kIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBjb25uZWN0KHNlbmRlciwgc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIC8vIENvZXJjZSBhIGBudWxsYCB0aGlzQXJnIHRvIGB1bmRlZmluZWRgLlxuICAgIHRoaXNBcmcgPSB0aGlzQXJnIHx8IHZvaWQgMDtcbiAgICAvLyBTZWFyY2ggZm9yIGFuIGVxdWl2YWxlbnQgY29ubmVjdGlvbiBhbmQgYmFpbCBpZiBvbmUgZXhpc3RzLlxuICAgIHZhciBsaXN0ID0gc2VuZGVyTWFwLmdldChzZW5kZXIpO1xuICAgIGlmIChsaXN0ICYmIGZpbmRDb25uZWN0aW9uKGxpc3QsIHNpZ25hbCwgY2FsbGJhY2ssIHRoaXNBcmcpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIGEgbmV3IGNvbm5lY3Rpb24uXG4gICAgdmFyIGNvbm4gPSBuZXcgQ29ubmVjdGlvbigpO1xuICAgIGNvbm4uc2lnbmFsID0gc2lnbmFsO1xuICAgIGNvbm4uY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICBjb25uLnRoaXNBcmcgPSB0aGlzQXJnO1xuICAgIC8vIEFkZCB0aGUgY29ubmVjdGlvbiB0byB0aGUgcmVjZWl2ZXJzIGxpc3QuXG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICAgIGxpc3QgPSBuZXcgQ29ubmVjdGlvbkxpc3QoKTtcbiAgICAgICAgbGlzdC5maXJzdCA9IGNvbm47XG4gICAgICAgIGxpc3QubGFzdCA9IGNvbm47XG4gICAgICAgIHNlbmRlck1hcC5zZXQoc2VuZGVyLCBsaXN0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAobGlzdC5sYXN0ID09PSBudWxsKSB7XG4gICAgICAgIGxpc3QuZmlyc3QgPSBjb25uO1xuICAgICAgICBsaXN0Lmxhc3QgPSBjb25uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGlzdC5sYXN0Lm5leHRSZWNlaXZlciA9IGNvbm47XG4gICAgICAgIGxpc3QubGFzdCA9IGNvbm47XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgY29ubmVjdGlvbiB0byB0aGUgc2VuZGVycyBsaXN0LlxuICAgIHZhciByZWNlaXZlciA9IHRoaXNBcmcgfHwgY2FsbGJhY2s7XG4gICAgdmFyIGhlYWQgPSByZWNlaXZlck1hcC5nZXQocmVjZWl2ZXIpO1xuICAgIGlmIChoZWFkKSB7XG4gICAgICAgIGhlYWQucHJldlNlbmRlciA9IGNvbm47XG4gICAgICAgIGNvbm4ubmV4dFNlbmRlciA9IGhlYWQ7XG4gICAgfVxuICAgIHJlY2VpdmVyTWFwLnNldChyZWNlaXZlciwgY29ubik7XG4gICAgcmV0dXJuIHRydWU7XG59XG4vKipcbiAqIEJyZWFrIHRoZSBjb25uZWN0aW9uIGJldHdlZW4gYSBzZW5kZXIsIHNpZ25hbCwgYW5kIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBkaXNjb25uZWN0KHNlbmRlciwgc2lnbmFsLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIC8vIENvZXJjZSBhIGBudWxsYCB0aGlzQXJnIHRvIGB1bmRlZmluZWRgLlxuICAgIHRoaXNBcmcgPSB0aGlzQXJnIHx8IHZvaWQgMDtcbiAgICAvLyBTZWFyY2ggZm9yIGFuIGVxdWl2YWxlbnQgY29ubmVjdGlvbiBhbmQgYmFpbCBpZiBub25lIGV4aXN0cy5cbiAgICB2YXIgbGlzdCA9IHNlbmRlck1hcC5nZXQoc2VuZGVyKTtcbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY29ubiA9IGZpbmRDb25uZWN0aW9uKGxpc3QsIHNpZ25hbCwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgIGlmICghY29ubikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgY29ubmVjdGlvbiBmcm9tIHRoZSBzZW5kZXJzIGxpc3QuIEl0IHdpbGwgYmUgcmVtb3ZlZFxuICAgIC8vIGZyb20gdGhlIHJlY2VpdmVycyBsaXN0IHRoZSBuZXh0IHRpbWUgdGhlIHNpZ25hbCBpcyBlbWl0dGVkLlxuICAgIHJlbW92ZUZyb21TZW5kZXJzTGlzdChjb25uKTtcbiAgICAvLyBDbGVhciB0aGUgY29ubmVjdGlvbiBkYXRhIHNvIGl0IGJlY29tZXMgYSBkZWFkIGNvbm5lY3Rpb24uXG4gICAgY29ubi5jYWxsYmFjayA9IG51bGw7XG4gICAgY29ubi50aGlzQXJnID0gbnVsbDtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogRW1pdCBhIHNpZ25hbCBhbmQgaW52b2tlIHRoZSBjb25uZWN0ZWQgY2FsbGJhY2tzLlxuICovXG5mdW5jdGlvbiBlbWl0KHNlbmRlciwgc2lnbmFsLCBhcmdzKSB7XG4gICAgdmFyIGxpc3QgPSBzZW5kZXJNYXAuZ2V0KHNlbmRlcik7XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGlzdC5yZWZzKys7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIGRpcnR5ID0gaW52b2tlTGlzdChsaXN0LCBzZW5kZXIsIHNpZ25hbCwgYXJncyk7XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICBsaXN0LnJlZnMtLTtcbiAgICB9XG4gICAgaWYgKGRpcnR5ICYmIGxpc3QucmVmcyA9PT0gMCkge1xuICAgICAgICBjbGVhbkxpc3QobGlzdCk7XG4gICAgfVxufVxuLyoqXG4gKiBGaW5kIGEgbWF0Y2hpbmcgY29ubmVjdGlvbiBpbiB0aGUgZ2l2ZW4gY29ubmVjdGlvbiBsaXN0LlxuICpcbiAqIFJldHVybnMgYG51bGxgIGlmIG5vIG1hdGNoaW5nIGNvbm5lY3Rpb24gaXMgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGZpbmRDb25uZWN0aW9uKGxpc3QsIHNpZ25hbCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICB2YXIgY29ubiA9IGxpc3QuZmlyc3Q7XG4gICAgd2hpbGUgKGNvbm4gIT09IG51bGwpIHtcbiAgICAgICAgaWYgKGNvbm4uc2lnbmFsID09PSBzaWduYWwgJiZcbiAgICAgICAgICAgIGNvbm4uY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmXG4gICAgICAgICAgICBjb25uLnRoaXNBcmcgPT09IHRoaXNBcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25uO1xuICAgICAgICB9XG4gICAgICAgIGNvbm4gPSBjb25uLm5leHRSZWNlaXZlcjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2tzIGZvciB0aGUgbWF0Y2hpbmcgc2lnbmFscyBpbiB0aGUgbGlzdC5cbiAqXG4gKiBDb25uZWN0aW9ucyBhZGRlZCBkdXJpbmcgZGlzcGF0Y2ggd2lsbCBub3QgYmUgaW52b2tlZC4gVGhpcyByZXR1cm5zXG4gKiBgdHJ1ZWAgaWYgdGhlcmUgYXJlIGRlYWQgY29ubmVjdGlvbnMgaW4gdGhlIGxpc3QsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBpbnZva2VMaXN0KGxpc3QsIHNlbmRlciwgc2lnbmFsLCBhcmdzKSB7XG4gICAgdmFyIGRpcnR5ID0gZmFsc2U7XG4gICAgdmFyIGxhc3QgPSBsaXN0Lmxhc3Q7XG4gICAgdmFyIGNvbm4gPSBsaXN0LmZpcnN0O1xuICAgIHdoaWxlIChjb25uICE9PSBudWxsKSB7XG4gICAgICAgIGlmICghY29ubi5jYWxsYmFjaykge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbm4uc2lnbmFsID09PSBzaWduYWwpIHtcbiAgICAgICAgICAgIGNvbm4uY2FsbGJhY2suY2FsbChjb25uLnRoaXNBcmcsIHNlbmRlciwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbm4gPT09IGxhc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbm4gPSBjb25uLm5leHRSZWNlaXZlcjtcbiAgICB9XG4gICAgcmV0dXJuIGRpcnR5O1xufVxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlYWQgY29ubmVjdGlvbnMgZnJvbSB0aGUgZ2l2ZW4gY29ubmVjdGlvbiBsaXN0LlxuICovXG5mdW5jdGlvbiBjbGVhbkxpc3QobGlzdCkge1xuICAgIHZhciBwcmV2O1xuICAgIHZhciBjb25uID0gbGlzdC5maXJzdDtcbiAgICB3aGlsZSAoY29ubiAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbmV4dCA9IGNvbm4ubmV4dFJlY2VpdmVyO1xuICAgICAgICBpZiAoIWNvbm4uY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNvbm4ubmV4dFJlY2VpdmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghcHJldikge1xuICAgICAgICAgICAgbGlzdC5maXJzdCA9IGNvbm47XG4gICAgICAgICAgICBwcmV2ID0gY29ubjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByZXYubmV4dFJlY2VpdmVyID0gY29ubjtcbiAgICAgICAgICAgIHByZXYgPSBjb25uO1xuICAgICAgICB9XG4gICAgICAgIGNvbm4gPSBuZXh0O1xuICAgIH1cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgICAgbGlzdC5maXJzdCA9IG51bGw7XG4gICAgICAgIGxpc3QubGFzdCA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcmV2Lm5leHRSZWNlaXZlciA9IG51bGw7XG4gICAgICAgIGxpc3QubGFzdCA9IHByZXY7XG4gICAgfVxufVxuLyoqXG4gKiBSZW1vdmUgYSBjb25uZWN0aW9uIGZyb20gdGhlIGRvdWJseSBsaW5rZWQgbGlzdCBvZiBzZW5kZXJzLlxuICovXG5mdW5jdGlvbiByZW1vdmVGcm9tU2VuZGVyc0xpc3QoY29ubikge1xuICAgIHZhciByZWNlaXZlciA9IGNvbm4udGhpc0FyZyB8fCBjb25uLmNhbGxiYWNrO1xuICAgIHZhciBwcmV2ID0gY29ubi5wcmV2U2VuZGVyO1xuICAgIHZhciBuZXh0ID0gY29ubi5uZXh0U2VuZGVyO1xuICAgIGlmIChwcmV2ID09PSBudWxsICYmIG5leHQgPT09IG51bGwpIHtcbiAgICAgICAgcmVjZWl2ZXJNYXAuZGVsZXRlKHJlY2VpdmVyKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgICByZWNlaXZlck1hcC5zZXQocmVjZWl2ZXIsIG5leHQpO1xuICAgICAgICBuZXh0LnByZXZTZW5kZXIgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICAgIHByZXYubmV4dFNlbmRlciA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcmV2Lm5leHRTZW5kZXIgPSBuZXh0O1xuICAgICAgICBuZXh0LnByZXZTZW5kZXIgPSBwcmV2O1xuICAgIH1cbiAgICBjb25uLnByZXZTZW5kZXIgPSBudWxsO1xuICAgIGNvbm4ubmV4dFNlbmRlciA9IG51bGw7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJ2YXIgY3NzID0gXCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcXG58XFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxcbnxcXG58IFRoZSBmdWxsIGxpY2Vuc2UgaXMgaW4gdGhlIGZpbGUgTElDRU5TRSwgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHNvZnR3YXJlLlxcbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cXG4ucC1XaWRnZXQge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgY3Vyc29yOiBkZWZhdWx0O1xcbn1cXG4ucC1XaWRnZXQucC1tb2QtaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiOyAocmVxdWlyZShcImJyb3dzZXJpZnktY3NzXCIpLmNyZWF0ZVN0eWxlKGNzcywgeyBcImhyZWZcIjogXCJub2RlX21vZHVsZXMvcGhvc3Bob3Itd2lkZ2V0L2xpYi9pbmRleC5jc3NcIn0pKTsgbW9kdWxlLmV4cG9ydHMgPSBjc3M7IiwiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufCBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgUGhvc3Bob3JKUyBDb250cmlidXRvcnNcbnxcbnwgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbnxcbnwgVGhlIGZ1bGwgbGljZW5zZSBpcyBpbiB0aGUgZmlsZSBMSUNFTlNFLCBkaXN0cmlidXRlZCB3aXRoIHRoaXMgc29mdHdhcmUuXG58LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4ndXNlIHN0cmljdCc7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCdwaG9zcGhvci1hcnJheXMnKTtcbnZhciBwaG9zcGhvcl9kb211dGlsXzEgPSByZXF1aXJlKCdwaG9zcGhvci1kb211dGlsJyk7XG52YXIgcGhvc3Bob3JfbWVzc2FnaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1tZXNzYWdpbmcnKTtcbnZhciBwaG9zcGhvcl9ub2Rld3JhcHBlcl8xID0gcmVxdWlyZSgncGhvc3Bob3Itbm9kZXdyYXBwZXInKTtcbnZhciBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEgPSByZXF1aXJlKCdwaG9zcGhvci1wcm9wZXJ0aWVzJyk7XG52YXIgcGhvc3Bob3Jfc2lnbmFsaW5nXzEgPSByZXF1aXJlKCdwaG9zcGhvci1zaWduYWxpbmcnKTtcbnJlcXVpcmUoJy4vaW5kZXguY3NzJyk7XG4vKipcbiAqIGBwLVdpZGdldGA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIFdpZGdldCBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydHMuV0lER0VUX0NMQVNTID0gJ3AtV2lkZ2V0Jztcbi8qKlxuICogYHAtbW9kLWhpZGRlbmA6IHRoZSBjbGFzcyBuYW1lIGFkZGVkIHRvIGhpZGRlbiB3aWRnZXRzLlxuICovXG5leHBvcnRzLkhJRERFTl9DTEFTUyA9ICdwLW1vZC1oaWRkZW4nO1xuLyoqXG4gKiBBIHNpbmdsZXRvbiBgJ3VwZGF0ZS1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2UgY2FuIGJlIGRpc3BhdGNoZWQgdG8gc3VwcG9ydGluZyB3aWRnZXRzIGluIG9yZGVyIHRvXG4gKiB1cGRhdGUgdGhlaXIgY29udGVudC4gTm90IGFsbCB3aWRnZXRzIHdpbGwgcmVzcG9uZCB0byBtZXNzYWdlcyBvZlxuICogdGhpcyB0eXBlLlxuICpcbiAqIFRoaXMgbWVzc2FnZSBpcyB0eXBpY2FsbHkgdXNlZCB0byB1cGRhdGUgdGhlIHBvc2l0aW9uIGFuZCBzaXplIG9mXG4gKiBhIHdpZGdldCdzIGNoaWxkcmVuLCBvciB0byB1cGRhdGUgYSB3aWRnZXQncyBjb250ZW50IHRvIHJlZmxlY3QgdGhlXG4gKiBjdXJyZW50IHN0YXRlIG9mIHRoZSB3aWRnZXQuXG4gKlxuICogTWVzc2FnZXMgb2YgdGhpcyB0eXBlIGFyZSBjb21wcmVzc2VkIGJ5IGRlZmF1bHQuXG4gKlxuICogKipTZWUgYWxzbzoqKiBbW3VwZGF0ZV1dLCBbW29uVXBkYXRlUmVxdWVzdF1dXG4gKi9cbmV4cG9ydHMuTVNHX1VQREFURV9SRVFVRVNUID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoJ3VwZGF0ZS1yZXF1ZXN0Jyk7XG4vKipcbiAqIEEgc2luZ2xldG9uIGAnbGF5b3V0LXJlcXVlc3QnYCBtZXNzYWdlLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgbWVzc2FnZSBjYW4gYmUgZGlzcGF0Y2hlZCB0byBzdXBwb3J0aW5nIHdpZGdldHMgaW4gb3JkZXIgdG9cbiAqIHVwZGF0ZSB0aGVpciBsYXlvdXQuIE5vdCBhbGwgd2lkZ2V0cyB3aWxsIHJlc3BvbmQgdG8gbWVzc2FnZXMgb2ZcbiAqIHRoaXMgdHlwZS5cbiAqXG4gKiBUaGlzIG1lc3NhZ2UgaXMgdHlwaWNhbGx5IHVzZWQgdG8gdXBkYXRlIHRoZSBzaXplIGNvbnRyYWludHMgb2ZcbiAqIGEgd2lkZ2V0IGFuZCB0byB1cGRhdGUgdGhlIHBvc2l0aW9uIGFuZCBzaXplIG9mIGl0cyBjaGlsZHJlbi5cbiAqXG4gKiBNZXNzYWdlcyBvZiB0aGlzIHR5cGUgYXJlIGNvbXByZXNzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbb25MYXlvdXRSZXF1ZXN0XV1cbiAqL1xuZXhwb3J0cy5NU0dfTEFZT1VUX1JFUVVFU1QgPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSgnbGF5b3V0LXJlcXVlc3QnKTtcbi8qKlxuICogQSBzaW5nbGV0b24gYCdjbG9zZS1yZXF1ZXN0J2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2Ugc2hvdWxkIGJlIGRpc3BhdGNoZWQgdG8gYSB3aWRnZXQgd2hlbiBpdCBzaG91bGQgY2xvc2VcbiAqIGFuZCByZW1vdmUgaXRzZWxmIGZyb20gdGhlIHdpZGdldCBoaWVyYXJjaHkuXG4gKlxuICogTWVzc2FnZXMgb2YgdGhpcyB0eXBlIGFyZSBjb21wcmVzc2VkIGJ5IGRlZmF1bHQuXG4gKlxuICogKipTZWUgYWxzbzoqKiBbW2Nsb3NlXV0sIFtbb25DbG9zZVJlcXVlc3RdXVxuICovXG5leHBvcnRzLk1TR19DTE9TRV9SRVFVRVNUID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoJ2Nsb3NlLXJlcXVlc3QnKTtcbi8qKlxuICogQSBzaW5nbGV0b24gYCdhZnRlci1zaG93J2AgbWVzc2FnZS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIG1lc3NhZ2UgaXMgc2VudCB0byBhIHdpZGdldCB3aGVuIGl0IGJlY29tZXMgdmlzaWJsZS5cbiAqXG4gKiBUaGlzIG1lc3NhZ2UgaXMgKipub3QqKiBzZW50IHdoZW4gdGhlIHdpZGdldCBpcyBhdHRhY2hlZC5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbaXNWaXNpYmxlXV0sIFtbb25BZnRlclNob3ddXVxuICovXG5leHBvcnRzLk1TR19BRlRFUl9TSE9XID0gbmV3IHBob3NwaG9yX21lc3NhZ2luZ18xLk1lc3NhZ2UoJ2FmdGVyLXNob3cnKTtcbi8qKlxuICogQSBzaW5nbGV0b24gYCdiZWZvcmUtaGlkZSdgIG1lc3NhZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBtZXNzYWdlIGlzIHNlbnQgdG8gYSB3aWRnZXQgd2hlbiBpdCBiZWNvbWVzIG5vdC12aXNpYmxlLlxuICpcbiAqIFRoaXMgbWVzc2FnZSBpcyAqKm5vdCoqIHNlbnQgd2hlbiB0aGUgd2lkZ2V0IGlzIGRldGFjaGVkLlxuICpcbiAqICoqU2VlIGFsc286KiogW1tpc1Zpc2libGVdXSwgW1tvbkJlZm9yZUhpZGVdXVxuICovXG5leHBvcnRzLk1TR19CRUZPUkVfSElERSA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKCdiZWZvcmUtaGlkZScpO1xuLyoqXG4gKiBBIHNpbmdsZXRvbiBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBtZXNzYWdlIGlzIHNlbnQgdG8gYSB3aWRnZXQgYWZ0ZXIgaXQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbaXNBdHRhY2hlZF1dLCBbW29uQWZ0ZXJBdHRhY2hdXVxuICovXG5leHBvcnRzLk1TR19BRlRFUl9BVFRBQ0ggPSBuZXcgcGhvc3Bob3JfbWVzc2FnaW5nXzEuTWVzc2FnZSgnYWZ0ZXItYXR0YWNoJyk7XG4vKipcbiAqIEEgc2luZ2xldG9uIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UuXG4gKlxuICogIyMjIyBOb3Rlc1xuICogVGhpcyBtZXNzYWdlIGlzIHNlbnQgdG8gYSB3aWRnZXQgYmVmb3JlIGl0IGlzIGRldGFjaGVkIGZyb20gdGhlIERPTS5cbiAqXG4gKiAqKlNlZSBhbHNvOioqIFtbaXNBdHRhY2hlZF1dLCBbW29uQmVmb3JlRGV0YWNoXV1cbiAqL1xuZXhwb3J0cy5NU0dfQkVGT1JFX0RFVEFDSCA9IG5ldyBwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKCdiZWZvcmUtZGV0YWNoJyk7XG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIHRoZSBQaG9zcGhvciB3aWRnZXQgaGllcmFyY2h5LlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgY2xhc3Mgd2lsbCB0eXBpY2FsbHkgYmUgc3ViY2xhc3NlZCBpbiBvcmRlciB0byBjcmVhdGUgYSB1c2VmdWxcbiAqIHdpZGdldC4gSG93ZXZlciwgaXQgY2FuIGJlIHVzZWQgYnkgaXRzZWxmIHRvIGhvc3QgZm9yZWlnbiBjb250ZW50XG4gKiBzdWNoIGFzIGEgUmVhY3Qgb3IgQm9vdHN0cmFwIGNvbXBvbmVudC4gU2ltcGx5IGluc3RhbnRpYXRlIGFuIGVtcHR5XG4gKiB3aWRnZXQgYW5kIGFkZCB0aGUgY29udGVudCBkaXJlY3RseSB0byBpdHMgW1tub2RlXV0uIFRoZSB3aWRnZXQgYW5kXG4gKiBpdHMgY29udGVudCBjYW4gdGhlbiBiZSBlbWJlZGRlZCB3aXRoaW4gYSBQaG9zcGhvciB3aWRnZXQgaGllcmFyY2h5LlxuICovXG52YXIgV2lkZ2V0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoV2lkZ2V0LCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIFtbV0lER0VUX0NMQVNTXV0gaXMgYWRkZWQgdG8gdGhlIHdpZGdldCBkdXJpbmcgY29uc3RydWN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFdpZGdldCgpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuX2ZsYWdzID0gMDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5fYm94ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xpbWl0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoZXhwb3J0cy5XSURHRVRfQ0xBU1MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNwb3NlIG9mIHRoZSB3aWRnZXQgYW5kIGl0cyBkZXNjZW5kYW50IHdpZGdldHMuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSXQgaXMgZ2VuZXJhbGx5IHVuc2FmZSB0byB1c2UgdGhlIHdpZGdldCBhZnRlciBpdCBoYXMgYmVlblxuICAgICAqIGRpc3Bvc2VkLlxuICAgICAqXG4gICAgICogSWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBhbGwgY2FsbHMgbWFkZSBhZnRlclxuICAgICAqIHRoZSBmaXJzdCB3aWxsIGJlIGEgbm8tb3AuXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZmxhZ3MgfD0gV2lkZ2V0RmxhZy5Jc0Rpc3Bvc2VkO1xuICAgICAgICB0aGlzLmRpc3Bvc2VkLmVtaXQodm9pZCAwKTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgZGV0YWNoV2lkZ2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLl9jaGlsZHJlbi5wb3AoKTtcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQgPSBudWxsO1xuICAgICAgICAgICAgY2hpbGQuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHBob3NwaG9yX3NpZ25hbGluZ18xLmNsZWFyU2lnbmFsRGF0YSh0aGlzKTtcbiAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuY2xlYXJNZXNzYWdlRGF0YSh0aGlzKTtcbiAgICAgICAgcGhvc3Bob3JfcHJvcGVydGllc18xLmNsZWFyUHJvcGVydHlEYXRhKHRoaXMpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwiZGlzcG9zZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBzaWduYWwgZW1pdHRlZCB3aGVuIHRoZSB3aWRnZXQgaXMgZGlzcG9zZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHB1cmUgZGVsZWdhdGUgdG8gdGhlIFtbZGlzcG9zZWRTaWduYWxdXS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldC5kaXNwb3NlZFNpZ25hbC5iaW5kKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJpc0F0dGFjaGVkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlc3Qgd2hldGhlciB0aGUgd2lkZ2V0J3Mgbm9kZSBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkgd2hpY2ggaXMgYWx3YXlzIHNhZmUgdG8gYWNjZXNzLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbYXR0YWNoV2lkZ2V0XV0sIFtbZGV0YWNoV2lkZ2V0XV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9mbGFncyAmIFdpZGdldEZsYWcuSXNBdHRhY2hlZCkgIT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcImlzRGlzcG9zZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSB3aWRnZXQgaGFzIGJlZW4gZGlzcG9zZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eSB3aGljaCBpcyBhbHdheXMgc2FmZSB0byBhY2Nlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tkaXNwb3NlZF1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmxhZ3MgJiBXaWRnZXRGbGFnLklzRGlzcG9zZWQpICE9PSAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJpc1Zpc2libGVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVzdCB3aGV0aGVyIHRoZSB3aWRnZXQgaXMgdmlzaWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBBIHdpZGdldCBpcyB2aXNpYmxlIHdoZW4gaXQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTSwgaXMgbm90XG4gICAgICAgICAqIGV4cGxpY2l0bHkgaGlkZGVuLCBhbmQgaGFzIG5vIGV4cGxpY2l0bHkgaGlkZGVuIGFuY2VzdG9ycy5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eSB3aGljaCBpcyBhbHdheXMgc2FmZSB0byBhY2Nlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1toaWRkZW5dXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZsYWdzICYgV2lkZ2V0RmxhZy5Jc1Zpc2libGUpICE9PSAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJoaWRkZW5cIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHdoZXRoZXIgdGhlIHdpZGdldCBpcyBleHBsaWNpdGx5IGhpZGRlbi5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIGlzIGEgcHVyZSBkZWxlZ2F0ZSB0byB0aGUgW1toaWRkZW5Qcm9wZXJ0eV1dLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbaXNWaXNpYmxlXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFdpZGdldC5oaWRkZW5Qcm9wZXJ0eS5nZXQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgd2hldGhlciB0aGUgd2lkZ2V0IGlzIGV4cGxpY2l0bHkgaGlkZGVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSBwdXJlIGRlbGVnYXRlIHRvIHRoZSBbW2hpZGRlblByb3BlcnR5XV0uXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tpc1Zpc2libGVdXVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIFdpZGdldC5oaWRkZW5Qcm9wZXJ0eS5zZXQodGhpcywgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJib3hTaXppbmdcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBib3ggc2l6aW5nIGZvciB0aGUgd2lkZ2V0J3MgRE9NIG5vZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB2YWx1ZSBpcyBjb21wdXRlZCBvbmNlIGFuZCB0aGVuIGNhY2hlZCBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgICAgKiBleGNlc3NpdmUgc3R5bGUgcmVjb21wdXRhdGlvbnMuIFRoZSBjYWNoZSBjYW4gYmUgY2xlYXJlZCB2aWFcbiAgICAgICAgICogW1tjbGVhckJveFNpemluZ11dLlxuICAgICAgICAgKlxuICAgICAgICAgKiBMYXlvdXQgd2lkZ2V0cyByZWx5IG9uIHRoaXMgcHJvcGVydHkgd2hlbiBjb21wdXRpbmcgdGhlaXIgbGF5b3V0LlxuICAgICAgICAgKiBJZiBhIGxheW91dCB3aWRnZXQncyBib3ggc2l6aW5nIGNoYW5nZXMgYXQgcnVudGltZSwgdGhlIGJveCBzaXppbmdcbiAgICAgICAgICogY2FjaGUgc2hvdWxkIGJlIGNsZWFyZWQgYW5kIHRoZSBsYXlvdXQgd2lkZ2V0IHNob3VsZCBiZSBwb3N0ZWQgYVxuICAgICAgICAgKmAnbGF5b3V0LXJlcXVlc3QnYCBtZXNzYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2xlYXJCb3hTaXppbmddXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYm94KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib3g7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm94ID0gT2JqZWN0LmZyZWV6ZShwaG9zcGhvcl9kb211dGlsXzEuYm94U2l6aW5nKHRoaXMubm9kZSkpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgXCJzaXplTGltaXRzXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgc2l6ZSBsaW1pdHMgZm9yIHRoZSB3aWRnZXQncyBET00gbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHZhbHVlIGlzIGNvbXB1dGVkIG9uY2UgYW5kIHRoZW4gY2FjaGVkIGluIG9yZGVyIHRvIGF2b2lkXG4gICAgICAgICAqIGV4Y2Vzc2l2ZSBzdHlsZSByZWNvbXB1dGF0aW9ucy4gVGhlIGNhY2hlIGNhbiBiZSBjbGVhcmVkIGJ5XG4gICAgICAgICAqIGNhbGxpbmcgW1tjbGVhclNpemVMaW1pdHNdXS5cbiAgICAgICAgICpcbiAgICAgICAgICogTGF5b3V0IHdpZGdldHMgcmVseSBvbiB0aGlzIHByb3BlcnR5IG9mIHRoZWlyIGNoaWxkIHdpZGdldHMgd2hlblxuICAgICAgICAgKiBjb21wdXRpbmcgdGhlIGxheW91dC4gSWYgYSBjaGlsZCB3aWRnZXQncyBzaXplIGxpbWl0cyBjaGFuZ2UgYXRcbiAgICAgICAgICogcnVudGltZSwgdGhlIHNpemUgbGltaXRzIHNob3VsZCBiZSBjbGVhcmVkIGFuZCB0aGUgbGF5b3V0IHdpZGdldFxuICAgICAgICAgKiBzaG91bGQgYmUgcG9zdGVkIGEgYCdsYXlvdXQtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tzZXRTaXplTGltaXRzXV0sIFtbY2xlYXJTaXplTGltaXRzXV1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpbWl0cylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGltaXRzO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbWl0cyA9IE9iamVjdC5mcmVlemUocGhvc3Bob3JfZG9tdXRpbF8xLnNpemVMaW1pdHModGhpcy5ub2RlKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXQucHJvdG90eXBlLCBcIm9mZnNldFJlY3RcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBjdXJyZW50IG9mZnNldCBnZW9tZXRyeSByZWN0IGZvciB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIElmIHRoZSB3aWRnZXQgZ2VvbWV0cnkgaGFzIGJlZW4gc2V0IHVzaW5nIFtbc2V0T2Zmc2V0R2VvbWV0cnldXSxcbiAgICAgICAgICogdGhvc2UgdmFsdWVzIHdpbGwgYmUgdXNlZCB0byBwb3B1bGF0ZSB0aGUgcmVjdCwgYW5kIG5vIGRhdGEgd2lsbFxuICAgICAgICAgKiBiZSByZWFkIGZyb20gdGhlIERPTS4gT3RoZXJ3aXNlLCB0aGUgb2Zmc2V0IGdlb21ldHJ5IG9mIHRoZSBub2RlXG4gICAgICAgICAqICoqd2lsbCoqIGJlIHJlYWQgZnJvbSB0aGUgRE9NLCB3aGljaCBtYXkgY2F1c2UgYSByZWZsb3cuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tzZXRPZmZzZXRHZW9tZXRyeV1dLCBbW2NsZWFyT2Zmc2V0R2VvbWV0cnldXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVjdClcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvbmVPZmZzZXRSZWN0KHRoaXMuX3JlY3QpO1xuICAgICAgICAgICAgcmV0dXJuIGdldE9mZnNldFJlY3QodGhpcy5ub2RlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwicGFyZW50XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgcGFyZW50IG9mIHRoZSB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyB3aWxsIGJlIGBudWxsYCBpZiB0aGUgd2lkZ2V0IGRvZXMgbm90IGhhdmUgYSBwYXJlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHBhcmVudCBvZiB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHdpZGdldCBpcyB0aGUgcGFyZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIElmIHRoZSBzcGVjaWZpZWQgcGFyZW50IGlzIHRoZSBjdXJyZW50IHBhcmVudCwgdGhpcyBpcyBhIG5vLW9wLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgc3BlY2lmaWVkIHBhcmVudCBpcyBgbnVsbGAsIHRoaXMgaXMgZXF1aXZhbGVudCB0byB0aGVcbiAgICAgICAgICogZXhwcmVzc2lvbiBgd2lkZ2V0LnBhcmVudC5yZW1vdmVDaGlsZCh3aWRnZXQpYCwgb3RoZXJ3aXNlIGl0XG4gICAgICAgICAqIGlzIGVxdWl2YWxlbnQgdG8gdGhlIGV4cHJlc3Npb24gYHBhcmVudC5hZGRDaGlsZCh3aWRnZXQpYC5cbiAgICAgICAgICpcbiAgICAgICAgICogKipTZWUgYWxzbzoqKiBbW2FkZENoaWxkXV0sIFtbaW5zZXJ0Q2hpbGRdXSwgW1tyZW1vdmVDaGlsZF1dXG4gICAgICAgICAqL1xuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQgJiYgcGFyZW50ICE9PSB0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghcGFyZW50ICYmIHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwiY2hpbGRyZW5cIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBhcnJheSBvZiBjaGlsZCB3aWRnZXRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFdoZW4gb25seSBpdGVyYXRpbmcgb3ZlciB0aGUgY2hpbGRyZW4sIGl0IGNhbiBiZSBmYXN0ZXIgdG8gdXNlXG4gICAgICAgICAqIHRoZSBjaGlsZCBxdWVyeSBtZXRob2RzLCB3aGljaCBkbyBub3QgcGVyZm9ybSBhIGNvcHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tjaGlsZENvdW50XV0sIFtbY2hpbGRBdF1dXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5zbGljZSgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBjaGlsZHJlbiBvZiB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBjbGVhciB0aGUgY3VycmVudCBjaGlsZCB3aWRnZXRzIGFuZCBhZGQgdGhlIHNwZWNpZmllZFxuICAgICAgICAgKiBjaGlsZCB3aWRnZXRzLiBEZXBlbmRpbmcgb24gdGhlIGRlc2lyZWQgb3V0Y29tZSwgaXQgY2FuIGJlIG1vcmVcbiAgICAgICAgICogZWZmaWNpZW50IHRvIHVzZSBvbmUgb2YgdGhlIGNoaWxkIG1hbmlwdWxhdGlvbiBtZXRob2RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiAqKlNlZSBhbHNvOioqIFtbYWRkQ2hpbGRdXSwgW1tpbnNlcnRDaGlsZF1dLCBbW3JlbW92ZUNoaWxkXV1cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5jbGVhckNoaWxkcmVuKCk7XG4gICAgICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gX3RoaXMuYWRkQ2hpbGQoY2hpbGQpOyB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldC5wcm90b3R5cGUsIFwiY2hpbGRDb3VudFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBvZiB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqU2VlIGFsc286KiogW1tjaGlsZHJlbl1dLCBbW2NoaWxkQXRdXVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNoaWxkIHdpZGdldCBhdCBhIHNwZWNpZmljIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBjaGlsZCBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBjaGlsZCB3aWRnZXQgYXQgdGhlIHNwZWNpZmllZCBpbmRleCwgb3IgYHVuZGVmaW5lZGBcbiAgICAgKiAgaWYgdGhlIGluZGV4IGlzIG91dCBvZiByYW5nZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tjaGlsZENvdW50XV0sIFtbY2hpbGRJbmRleF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jaGlsZEF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbltpbmRleCB8IDBdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBpbmRleCBvZiBhIHNwZWNpZmljIGNoaWxkIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZCAtIFRoZSBjaGlsZCB3aWRnZXQgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgaW5kZXggb2YgdGhlIHNwZWNpZmllZCBjaGlsZCB3aWRnZXQsIG9yIGAtMWAgaWZcbiAgICAgKiAgIHRoZSB3aWRnZXQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2hpbGRDb3VudF1dLCBbW2NoaWxkQXRdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuY2hpbGRJbmRleCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4uaW5kZXhPZihjaGlsZCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgYSBjaGlsZCB3aWRnZXQgdG8gdGhlIGVuZCBvZiB0aGUgd2lkZ2V0J3MgY2hpbGRyZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGQgLSBUaGUgY2hpbGQgd2lkZ2V0IHRvIGFkZCB0byB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBuZXcgaW5kZXggb2YgdGhlIGNoaWxkLlxuICAgICAqXG4gICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgd2lkZ2V0IGlzIGFkZGVkIHRvIGl0c2VsZi5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgY2hpbGQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBpdHMgY3VycmVudCBwYXJlbnRcbiAgICAgKiBiZWZvcmUgYmVpbmcgYWRkZWQgdG8gdGhpcyB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbaW5zZXJ0Q2hpbGRdXSwgW1ttb3ZlQ2hpbGRdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0Q2hpbGQodGhpcy5fY2hpbGRyZW4ubGVuZ3RoLCBjaGlsZCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYSBjaGlsZCB3aWRnZXQgYXQgYSBzcGVjaWZpYyBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSB0YXJnZXQgaW5kZXggZm9yIHRoZSB3aWRnZXQuIFRoaXMgd2lsbCBiZVxuICAgICAqICAgY2xhbXBlZCB0byB0aGUgYm91bmRzIG9mIHRoZSBjaGlsZHJlbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZCAtIFRoZSBjaGlsZCB3aWRnZXQgdG8gaW5zZXJ0IGludG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBuZXcgaW5kZXggb2YgdGhlIGNoaWxkLlxuICAgICAqXG4gICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGEgd2lkZ2V0IGlzIGluc2VydGVkIGludG8gaXRzZWxmLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBjaGlsZCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIGl0cyBjdXJyZW50IHBhcmVudFxuICAgICAqIGJlZm9yZSBiZWluZyBhZGRlZCB0byB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1thZGRDaGlsZF1dLCBbW21vdmVDaGlsZF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5pbnNlcnRDaGlsZCA9IGZ1bmN0aW9uIChpbmRleCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKGNoaWxkID09PSB0aGlzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2hpbGQgd2lkZ2V0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoaWxkLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLl9wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkLmlzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIGRldGFjaFdpZGdldChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXM7XG4gICAgICAgIHZhciBpID0gYXJyYXlzLmluc2VydCh0aGlzLl9jaGlsZHJlbiwgaW5kZXgsIGNoaWxkKTtcbiAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgbmV3IENoaWxkTWVzc2FnZSgnY2hpbGQtYWRkZWQnLCBjaGlsZCwgLTEsIGkpKTtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNb3ZlIGEgY2hpbGQgd2lkZ2V0IGZyb20gb25lIGluZGV4IHRvIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZnJvbUluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBjaGlsZCBvZiBpbnRlcmVzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0b0luZGV4IC0gVGhlIHRhcmdldCBpbmRleCBmb3IgdGhlIGNoaWxkLlxuICAgICAqXG4gICAgICogQHJldHVybnMgJ3RydWUnIGlmIHRoZSBjaGlsZCB3YXMgbW92ZWQsIG9yIGBmYWxzZWAgaWYgZWl0aGVyXG4gICAgICogICBvZiB0aGUgZ2l2ZW4gaW5kaWNlcyBhcmUgb3V0IG9mIHJhbmdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBtb3JlIGVmZmljaWVudCB0aGFuIHJlLWluc2VydGluZyBhbiBleGlzdGluZ1xuICAgICAqIGNoaWxkLCBhcyBzb21lIHdpZGdldHMgbWF5IGJlIGFibGUgdG8gb3B0aW1pemUgY2hpbGQgbW92ZXMgYW5kXG4gICAgICogYXZvaWQgbWFraW5nIHVubmVjZXNzYXJ5IGNoYW5nZXMgdG8gdGhlIERPTS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1thZGRDaGlsZF1dLCBbW2luc2VydENoaWxkXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm1vdmVDaGlsZCA9IGZ1bmN0aW9uIChmcm9tSW5kZXgsIHRvSW5kZXgpIHtcbiAgICAgICAgdmFyIGkgPSBmcm9tSW5kZXggfCAwO1xuICAgICAgICB2YXIgaiA9IHRvSW5kZXggfCAwO1xuICAgICAgICBpZiAoIWFycmF5cy5tb3ZlKHRoaXMuX2NoaWxkcmVuLCBpLCBqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpICE9PSBqKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLl9jaGlsZHJlbltqXTtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIG5ldyBDaGlsZE1lc3NhZ2UoJ2NoaWxkLW1vdmVkJywgY2hpbGQsIGksIGopKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgY2hpbGQgd2lkZ2V0IGF0IGEgc3BlY2lmaWMgaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGNoaWxkIG9mIGludGVyZXN0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgVGhlIHJlbW92ZWQgY2hpbGQgd2lkZ2V0LCBvciBgdW5kZWZpbmVkYCBpZiB0aGUgaW5kZXhcbiAgICAgKiAgIGlzIG91dCBvZiByYW5nZS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tyZW1vdmVDaGlsZF1dLCBbW2NsZWFyQ2hpbGRyZW5dXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUucmVtb3ZlQ2hpbGRBdCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgaSA9IGluZGV4IHwgMDtcbiAgICAgICAgdmFyIGNoaWxkID0gYXJyYXlzLnJlbW92ZUF0KHRoaXMuX2NoaWxkcmVuLCBpKTtcbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICBjaGlsZC5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIG5ldyBDaGlsZE1lc3NhZ2UoJ2NoaWxkLXJlbW92ZWQnLCBjaGlsZCwgaSwgLTEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBzcGVjaWZpYyBjaGlsZCB3aWRnZXQgZnJvbSB0aGlzIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZCAtIFRoZSBjaGlsZCB3aWRnZXQgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgaW5kZXggd2hpY2ggdGhlIGNoaWxkIG9jY3VwaWVkLCBvciBgLTFgIGlmIHRoZVxuICAgICAqICAgY2hpbGQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbcmVtb3ZlQ2hpbGRBdF1dLCBbW2NsZWFyQ2hpbGRyZW5dXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmNoaWxkSW5kZXgoY2hpbGQpO1xuICAgICAgICBpZiAoaSAhPT0gLTEpXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkQXQoaSk7XG4gICAgICAgIHJldHVybiBpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBjaGlsZCB3aWRnZXRzIGZyb20gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIHdpbGwgY29udGludWUgdG8gcmVtb3ZlIGNoaWxkcmVuIHVudGlsIHRoZSBgY2hpbGRDb3VudGBcbiAgICAgKiByZWFjaGVzIHplcm8uIEl0IGlzIHRoZXJlZm9yZSBwb3NzaWJsZSB0byBlbnRlciBhbiBpbmZpbml0ZVxuICAgICAqIGxvb3AgaWYgYSBtZXNzYWdlIGhhbmRsZXIgY2F1c2VzIGEgY2hpbGQgd2lkZ2V0IHRvIGJlIGFkZGVkXG4gICAgICogaW4gcmVzcG9uc2UgdG8gb25lIGJlaW5nIHJlbW92ZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbcmVtb3ZlQ2hpbGRdXSwgW1tyZW1vdmVDaGlsZEF0XV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNsZWFyQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmNoaWxkQ291bnQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkQXQodGhpcy5jaGlsZENvdW50IC0gMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERpc3BhdGNoIGFuIGAndXBkYXRlLXJlcXVlc3QnYCBtZXNzYWdlIHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW1tZWRpYXRlIC0gV2hldGhlciB0byBkaXNwYXRjaCB0aGUgbWVzc2FnZSBpbW1lZGlhdGVseVxuICAgICAqICAgKGB0cnVlYCkgb3IgaW4gdGhlIGZ1dHVyZSAoYGZhbHNlYCkuIFRoZSBkZWZhdWx0IGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX1VQREFURV9SRVFVRVNUXV0sIFtbb25VcGRhdGVSZXF1ZXN0XV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChpbW1lZGlhdGUpIHtcbiAgICAgICAgaWYgKGltbWVkaWF0ZSA9PT0gdm9pZCAwKSB7IGltbWVkaWF0ZSA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIGV4cG9ydHMuTVNHX1VQREFURV9SRVFVRVNUKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnBvc3RNZXNzYWdlKHRoaXMsIGV4cG9ydHMuTVNHX1VQREFURV9SRVFVRVNUKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2ggYSBgJ2Nsb3NlLXJlcXVlc3QnYCBtZXNzYWdlIHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW1tZWRpYXRlIC0gV2hldGhlciB0byBkaXNwYXRjaCB0aGUgbWVzc2FnZSBpbW1lZGlhdGVseVxuICAgICAqICAgKGB0cnVlYCkgb3IgaW4gdGhlIGZ1dHVyZSAoYGZhbHNlYCkuIFRoZSBkZWZhdWx0IGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX0NMT1NFX1JFUVVFU1RdXSwgW1tvbkNsb3NlUmVxdWVzdF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChpbW1lZGlhdGUpIHtcbiAgICAgICAgaWYgKGltbWVkaWF0ZSA9PT0gdm9pZCAwKSB7IGltbWVkaWF0ZSA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHRoaXMsIGV4cG9ydHMuTVNHX0NMT1NFX1JFUVVFU1QpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEucG9zdE1lc3NhZ2UodGhpcywgZXhwb3J0cy5NU0dfQ0xPU0VfUkVRVUVTVCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSBjYWNoZWQgYm94IHNpemluZyBmb3IgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90KiogcmVhZCBmcm9tIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90Kiogd3JpdGUgdG8gdGhlIERPTS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tib3hTaXppbmddXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuY2xlYXJCb3hTaXppbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2JveCA9IG51bGw7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHNpemUgbGltaXRzIGZvciB0aGUgd2lkZ2V0J3MgRE9NIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWluV2lkdGggLSBUaGUgbWluIHdpZHRoIGZvciB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWluSGVpZ2h0IC0gVGhlIG1pbiBoZWlnaHQgZm9yIHRoZSB3aWRnZXQsIGluIHBpeGVscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYXhXaWR0aCAtIFRoZSBtYXggd2lkdGggZm9yIHRoZSB3aWRnZXQsIGluIHBpeGVscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYXhIZWlnaHQgLSBUaGUgbWF4IGhlaWdodCBmb3IgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGRvZXMgKipub3QqKiByZWFkIGZyb20gdGhlIERPTS5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tzaXplTGltaXRzXV0sIFtbY2xlYXJTaXplTGltaXRzXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLnNldFNpemVMaW1pdHMgPSBmdW5jdGlvbiAobWluV2lkdGgsIG1pbkhlaWdodCwgbWF4V2lkdGgsIG1heEhlaWdodCkge1xuICAgICAgICB2YXIgbWluVyA9IE1hdGgubWF4KDAsIG1pbldpZHRoKTtcbiAgICAgICAgdmFyIG1pbkggPSBNYXRoLm1heCgwLCBtaW5IZWlnaHQpO1xuICAgICAgICB2YXIgbWF4VyA9IE1hdGgubWF4KDAsIG1heFdpZHRoKTtcbiAgICAgICAgdmFyIG1heEggPSBNYXRoLm1heCgwLCBtYXhIZWlnaHQpO1xuICAgICAgICB0aGlzLl9saW1pdHMgPSBPYmplY3QuZnJlZXplKHtcbiAgICAgICAgICAgIG1pbldpZHRoOiBtaW5XLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiBtaW5ILFxuICAgICAgICAgICAgbWF4V2lkdGg6IG1heFcsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IG1heEgsXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLm5vZGUuc3R5bGU7XG4gICAgICAgIHN0eWxlLm1pbldpZHRoID0gbWluVyArICdweCc7XG4gICAgICAgIHN0eWxlLm1pbkhlaWdodCA9IG1pbkggKyAncHgnO1xuICAgICAgICBzdHlsZS5tYXhXaWR0aCA9IChtYXhXID09PSBJbmZpbml0eSkgPyAnJyA6IG1heFcgKyAncHgnO1xuICAgICAgICBzdHlsZS5tYXhIZWlnaHQgPSAobWF4SCA9PT0gSW5maW5pdHkpID8gJycgOiBtYXhIICsgJ3B4JztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSBjYWNoZWQgc2l6ZSBsaW1pdHMgZm9yIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBtZXRob2QgZG9lcyAqKm5vdCoqIHJlYWQgZnJvbSB0aGUgRE9NLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW3NpemVMaW1pdHNdXSwgW1tzZXRTaXplTGltaXRzXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNsZWFyU2l6ZUxpbWl0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbGltaXRzID0gbnVsbDtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5ub2RlLnN0eWxlO1xuICAgICAgICBzdHlsZS5taW5XaWR0aCA9ICcnO1xuICAgICAgICBzdHlsZS5tYXhXaWR0aCA9ICcnO1xuICAgICAgICBzdHlsZS5taW5IZWlnaHQgPSAnJztcbiAgICAgICAgc3R5bGUubWF4SGVpZ2h0ID0gJyc7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG9mZnNldCBnZW9tZXRyeSBmb3IgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsZWZ0IC0gVGhlIG9mZnNldCBsZWZ0IGVkZ2Ugb2YgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRvcCAtIFRoZSBvZmZzZXQgdG9wIGVkZ2Ugb2YgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHdpZHRoIC0gVGhlIG9mZnNldCB3aWR0aCBvZiB0aGUgd2lkZ2V0LCBpbiBwaXhlbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IC0gVGhlIG9mZnNldCBoZWlnaHQgb2YgdGhlIHdpZGdldCwgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoaXMgbWV0aG9kIGlzIG9ubHkgdXNlZnVsIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb25pbmcgdG8gc2V0XG4gICAgICogdGhlIGxheW91dCBnZW9tZXRyeSBvZiB0aGUgd2lkZ2V0LiBJdCB3aWxsIHVwZGF0ZSB0aGUgaW5saW5lIHN0eWxlXG4gICAgICogb2YgdGhlIHdpZGdldCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWVzLiBJZiB0aGUgd2lkdGggb3IgaGVpZ2h0IGlzXG4gICAgICogZGlmZmVyZW50IGZyb20gdGhlIHByZXZpb3VzIHZhbHVlLCBhIFtbUmVzaXplTWVzc2FnZV1dIHdpbGwgYmUgc2VudFxuICAgICAqIHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90KiogdGFrZSBpbnRvIGFjY291bnQgdGhlIHNpemUgbGltaXRzIG9mIHRoZVxuICAgICAqIHdpZGdldC4gSXQgaXMgYXNzdW1lZCB0aGF0IHRoZSBzcGVjaWZpZWQgd2lkdGggYW5kIGhlaWdodCBkbyBub3RcbiAgICAgKiB2aW9sYXRlIHRoZSBzaXplIGNvbnN0cmFpbnRzIG9mIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90KiogcmVhZCBhbnkgZGF0YSBmcm9tIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBDb2RlIHdoaWNoIHVzZXMgdGhpcyBtZXRob2QgdG8gbGF5b3V0IGEgd2lkZ2V0IGlzIHJlc3BvbnNpYmxlIGZvclxuICAgICAqIGNhbGxpbmcgW1tjbGVhck9mZnNldEdlb21ldHJ5XV0gd2hlbiBpdCBpcyBmaW5pc2hlZCBtYW5hZ2luZyB0aGVcbiAgICAgKiB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbb2Zmc2V0UmVjdF1dLCBbW2NsZWFyT2Zmc2V0R2VvbWV0cnldXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUuc2V0T2Zmc2V0R2VvbWV0cnkgPSBmdW5jdGlvbiAobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciByZWN0ID0gdGhpcy5fcmVjdCB8fCAodGhpcy5fcmVjdCA9IG1ha2VPZmZzZXRSZWN0KCkpO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLm5vZGUuc3R5bGU7XG4gICAgICAgIHZhciByZXNpemVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0b3AgIT09IHJlY3QudG9wKSB7XG4gICAgICAgICAgICByZWN0LnRvcCA9IHRvcDtcbiAgICAgICAgICAgIHN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlZnQgIT09IHJlY3QubGVmdCkge1xuICAgICAgICAgICAgcmVjdC5sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBpZiAod2lkdGggIT09IHJlY3Qud2lkdGgpIHtcbiAgICAgICAgICAgIHJlc2l6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVjdC53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhlaWdodCAhPT0gcmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJlc2l6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVjdC5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICBzdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNpemVkKVxuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UodGhpcywgbmV3IFJlc2l6ZU1lc3NhZ2Uod2lkdGgsIGhlaWdodCkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIG9mZnNldCBnZW9tZXRyeSBmb3IgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBvbmx5IHVzZWZ1bCB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uaW5nIHRvIHNldFxuICAgICAqIHRoZSBsYXlvdXQgZ2VvbWV0cnkgb2YgdGhlIHdpZGdldC4gSXQgd2lsbCByZXNldCB0aGUgaW5saW5lIHN0eWxlXG4gICAgICogb2YgdGhlIHdpZGdldCBhbmQgY2xlYXIgdGhlIHN0b3JlZCBvZmZzZXQgZ2VvbWV0cnkgdmFsdWVzLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCAqKm5vdCoqIGRpc3BhdGNoIGEgW1tSZXNpemVNZXNzYWdlXV0uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBkb2VzICoqbm90KiogcmVhZCBhbnkgZGF0YSBmcm9tIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGJ5IHRoZSB3aWRnZXQncyBsYXlvdXQgbWFuYWdlciB3aGVuXG4gICAgICogaXQgbm8gbG9uZ2VyIG1hbmFnZXMgdGhlIHdpZGdldC4gSXQgYWxsb3dzIHRoZSB3aWRnZXQgdG8gYmUgYWRkZWRcbiAgICAgKiB0byBhbm90aGVyIGxheW91dCBwYW5lbCB3aXRob3V0IGNvbmZsaWN0LlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW29mZnNldFJlY3RdXSwgW1tzZXRPZmZzZXRHZW9tZXRyeV1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jbGVhck9mZnNldEdlb21ldHJ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3JlY3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWN0ID0gbnVsbDtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5ub2RlLnN0eWxlO1xuICAgICAgICBzdHlsZS50b3AgPSAnJztcbiAgICAgICAgc3R5bGUubGVmdCA9ICcnO1xuICAgICAgICBzdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICBzdHlsZS5oZWlnaHQgPSAnJztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgYSBtZXNzYWdlIHNlbnQgdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSBzZW50IHRvIHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBtZXRob2QgYXMgbmVlZGVkLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUucHJvY2Vzc01lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Jlc2l6ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZShtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXBkYXRlLXJlcXVlc3QnOlxuICAgICAgICAgICAgICAgIHRoaXMub25VcGRhdGVSZXF1ZXN0KG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsYXlvdXQtcmVxdWVzdCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkxheW91dFJlcXVlc3QobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NoaWxkLWFkZGVkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hpbGRBZGRlZChtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hpbGQtcmVtb3ZlZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoaWxkUmVtb3ZlZChtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hpbGQtbW92ZWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25DaGlsZE1vdmVkKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhZnRlci1zaG93JzpcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyB8PSBXaWRnZXRGbGFnLklzVmlzaWJsZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJTaG93KG1zZyk7XG4gICAgICAgICAgICAgICAgc2VuZFRvU2hvd24odGhpcy5fY2hpbGRyZW4sIG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdiZWZvcmUtaGlkZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkJlZm9yZUhpZGUobXNnKTtcbiAgICAgICAgICAgICAgICBzZW5kVG9TaG93bih0aGlzLl9jaGlsZHJlbiwgbXNnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+V2lkZ2V0RmxhZy5Jc1Zpc2libGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhZnRlci1hdHRhY2gnOlxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmxlID0gIXRoaXMuaGlkZGVuICYmICghdGhpcy5fcGFyZW50IHx8IHRoaXMuX3BhcmVudC5pc1Zpc2libGUpO1xuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyB8PSBXaWRnZXRGbGFnLklzVmlzaWJsZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyB8PSBXaWRnZXRGbGFnLklzQXR0YWNoZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkFmdGVyQXR0YWNoKG1zZyk7XG4gICAgICAgICAgICAgICAgc2VuZFRvQWxsKHRoaXMuX2NoaWxkcmVuLCBtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYmVmb3JlLWRldGFjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkJlZm9yZURldGFjaChtc2cpO1xuICAgICAgICAgICAgICAgIHNlbmRUb0FsbCh0aGlzLl9jaGlsZHJlbiwgbXNnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+V2lkZ2V0RmxhZy5Jc1Zpc2libGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmxhZ3MgJj0gfldpZGdldEZsYWcuSXNBdHRhY2hlZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NoaWxkLXNob3duJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hpbGRTaG93bihtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hpbGQtaGlkZGVuJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hpbGRIaWRkZW4obXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Nsb3NlLXJlcXVlc3QnOlxuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVJlcXVlc3QobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ29tcHJlc3MgYSBtZXNzYWdlIHBvc3RlZCB0byB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHBvc3RlZCB0byB0aGUgd2lkZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBlbmRpbmcgLSBUaGUgcXVldWUgb2YgcGVuZGluZyBtZXNzYWdlcyBmb3IgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWVzc2FnZSB3YXMgY29tcHJlc3NlZCBhbmQgc2hvdWxkIGJlXG4gICAgICogICBkcm9wcGVkLCBvciBgZmFsc2VgIGlmIHRoZSBtZXNzYWdlIHNob3VsZCBiZSBlbnF1ZXVlZCBmb3JcbiAgICAgKiAgIGRlbGl2ZXJ5IGFzIG5vcm1hbC5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjb21wcmVzc2VzIHRoZSBmb2xsb3dpbmcgbWVzc2FnZXM6XG4gICAgICogYCd1cGRhdGUtcmVxdWVzdCdgLCBgJ2xheW91dC1yZXF1ZXN0J2AsIGFuZCBgJ2Nsb3NlLXJlcXVlc3QnYC5cbiAgICAgKlxuICAgICAqIFN1YmNsYXNzZXMgbWF5IHJlaW1wbGVtZW50IHRoaXMgbWV0aG9kIGFzIG5lZWRlZC5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLmNvbXByZXNzTWVzc2FnZSA9IGZ1bmN0aW9uIChtc2csIHBlbmRpbmcpIHtcbiAgICAgICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAndXBkYXRlLXJlcXVlc3QnOlxuICAgICAgICAgICAgY2FzZSAnbGF5b3V0LXJlcXVlc3QnOlxuICAgICAgICAgICAgY2FzZSAnY2xvc2UtcmVxdWVzdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBlbmRpbmcuc29tZShmdW5jdGlvbiAob3RoZXIpIHsgcmV0dXJuIG90aGVyLnR5cGUgPT09IG1zZy50eXBlOyB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdjaGlsZC1hZGRlZCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYWRkcyB0aGUgY2hpbGQgbm9kZSB0byB0aGUgd2lkZ2V0XG4gICAgICogbm9kZSBhdCB0aGUgcHJvcGVyIGxvY2F0aW9uIGFuZCBkaXNwYXRjaGVzIGFuIGAnYWZ0ZXItYXR0YWNoJ2BcbiAgICAgKiBtZXNzYWdlIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqXG4gICAgICogU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gY29udHJvbCBob3cgdGhlIGNoaWxkXG4gICAgICogbm9kZSBpcyBhZGRlZCwgYnV0IHRoZXkgbXVzdCBkaXNwYXRjaCBhbiBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2VcbiAgICAgKiBpZiBhcHByb3ByaWF0ZS5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQ2hpbGRBZGRlZCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLmNoaWxkQXQobXNnLmN1cnJlbnRJbmRleCArIDEpO1xuICAgICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKG1zZy5jaGlsZC5ub2RlLCBuZXh0ICYmIG5leHQubm9kZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQXR0YWNoZWQpXG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShtc2cuY2hpbGQsIGV4cG9ydHMuTVNHX0FGVEVSX0FUVEFDSCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdjaGlsZC1yZW1vdmVkJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiByZW1vdmVzIHRoZSBjaGlsZCBub2RlIGZyb20gdGhlIHdpZGdldFxuICAgICAqIG5vZGUgYW5kIGRpc3BhdGNoZXMgYSBgJ2JlZm9yZS1kZXRhY2gnYCBtZXNzYWdlIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqXG4gICAgICogU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gY29udHJvbCBob3cgdGhlIGNoaWxkXG4gICAgICogbm9kZSBpcyByZW1vdmVkLCBidXQgdGhleSBtdXN0ICBkaXNwYXRjaCBhIGAnYmVmb3JlLWRldGFjaCdgXG4gICAgICogbWVzc2FnZSBpZiBhcHByb3ByaWF0ZS5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQ2hpbGRSZW1vdmVkID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKVxuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UobXNnLmNoaWxkLCBleHBvcnRzLk1TR19CRUZPUkVfREVUQUNIKTtcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKG1zZy5jaGlsZC5ub2RlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2NoaWxkLW1vdmVkJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBtb3ZlcyB0aGUgY2hpbGQgbm9kZSB0byB0aGUgcHJvcGVyXG4gICAgICogbG9jYXRpb24gaW4gdGhlIHdpZGdldCBub2RlIGFuZCBkaXNwYXRjaGVzIGEgYCdiZWZvcmUtZGV0YWNoJ2BcbiAgICAgKiBhbmQgYCdhZnRlci1hdHRhY2gnYCBtZXNzYWdlIGlmIGFwcHJvcHJpYXRlLlxuICAgICAqXG4gICAgICogU3ViY2xhc3NlcyBtYXkgcmVpbXBsZW1lbnQgdGhpcyBtZXRob2QgdG8gY29udHJvbCBob3cgdGhlIGNoaWxkXG4gICAgICogbm9kZSBpcyBtb3ZlZCwgYnV0IHRoZXkgbXVzdCBkaXNwYXRjaCBhIGAnYmVmb3JlLWRldGFjaCdgIGFuZFxuICAgICAqIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZSBpZiBhcHByb3ByaWF0ZS5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQ2hpbGRNb3ZlZCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZClcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKG1zZy5jaGlsZCwgZXhwb3J0cy5NU0dfQkVGT1JFX0RFVEFDSCk7XG4gICAgICAgIHZhciBuZXh0ID0gdGhpcy5jaGlsZEF0KG1zZy5jdXJyZW50SW5kZXggKyAxKTtcbiAgICAgICAgdGhpcy5ub2RlLmluc2VydEJlZm9yZShtc2cuY2hpbGQubm9kZSwgbmV4dCAmJiBuZXh0Lm5vZGUpO1xuICAgICAgICBpZiAodGhpcy5pc0F0dGFjaGVkKVxuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2UobXNnLmNoaWxkLCBleHBvcnRzLk1TR19BRlRFUl9BVFRBQ0gpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhIGAncmVzaXplJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGhhbmRsZXIgc2VuZHMgYW4gW1tVbmtub3duU2l6ZV1dXG4gICAgICogcmVzaXplIG1lc3NhZ2UgdG8gZWFjaCBjaGlsZC4gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIHJlc2l6ZSBtZXNzYWdlc1xuICAgICAqIHByb3BhZ2F0ZSB0aHJvdWdoIGFsbCB3aWRnZXRzIGluIHRoZSBoaWVyYXJjaHkuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCBhcyBuZWVkZWQsIGJ1dCB0aGV5IG11c3RcbiAgICAgKiBkaXNwYXRjaCBgJ3Jlc2l6ZSdgIG1lc3NhZ2VzIHRvIHRoZWlyIGNoaWxkcmVuIGFzIGFwcHJvcHJpYXRlLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIHNlbmRUb0FsbCh0aGlzLl9jaGlsZHJlbiwgUmVzaXplTWVzc2FnZS5Vbmtub3duU2l6ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGFuIGAndXBkYXRlLXJlcXVlc3QnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBzZW5kcyBhbiBbW1Vua25vd25TaXplXV1cbiAgICAgKiByZXNpemUgbWVzc2FnZSB0byBlYWNoIGNoaWxkLiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgcmVzaXplIG1lc3NhZ2VzXG4gICAgICogcHJvcGFnYXRlIHRocm91Z2ggYWxsIHdpZGdldHMgaW4gdGhlIGhpZXJhcmNoeS5cbiAgICAgKlxuICAgICAqIFN1YmNsYXNzIG1heSByZWltcGxlbWVudCB0aGlzIG1ldGhvZCBhcyBuZWVkZWQsIGJ1dCB0aGV5IHNob3VsZFxuICAgICAqIGRpc3BhdGNoIGAncmVzaXplJ2AgbWVzc2FnZXMgdG8gdGhlaXIgY2hpbGRyZW4gYXMgYXBwcm9wcmlhdGUuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbdXBkYXRlXV0sIFtbTVNHX1VQREFURV9SRVFVRVNUXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uVXBkYXRlUmVxdWVzdCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgc2VuZFRvQWxsKHRoaXMuX2NoaWxkcmVuLCBSZXNpemVNZXNzYWdlLlVua25vd25TaXplKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2Nsb3NlLXJlcXVlc3QnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogIyMjIyBOb3Rlc1xuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciB3aWxsIHVucGFyZW50IG9yIGRldGFjaFxuICAgICAqIHRoZSB3aWRnZXQgYXMgYXBwcm9wcmlhdGUuIFN1YmNsYXNzZXMgbWF5IHJlaW1wbGVtZW50IHRoaXMgaGFuZGxlclxuICAgICAqIGZvciBjdXN0b20gY2xvc2UgYmVoYXZpb3IuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbY2xvc2VdXSwgW1tNU0dfQ0xPU0VfUkVRVUVTVF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vbkNsb3NlUmVxdWVzdCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgICAgICAgZGV0YWNoV2lkZ2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBIG1lc3NhZ2UgaGFuZGxlciBpbnZva2VkIG9uIGEgYCdsYXlvdXQtcmVxdWVzdCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGhhbmRsZXIgaXMgYSBuby1vcC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1tNU0dfTEFZT1VUX1JFUVVFU1RdXVxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25MYXlvdXRSZXF1ZXN0ID0gZnVuY3Rpb24gKG1zZykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYW4gYCdhZnRlci1zaG93J2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW01TR19BRlRFUl9TSE9XXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQWZ0ZXJTaG93ID0gZnVuY3Rpb24gKG1zZykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2JlZm9yZS1oaWRlJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW01TR19CRUZPUkVfSElERV1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vbkJlZm9yZUhpZGUgPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBtZXNzYWdlIGhhbmRsZXIgaW52b2tlZCBvbiBhbiBgJ2FmdGVyLWF0dGFjaCdgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbTVNHX0FGVEVSX0FUVEFDSF1dXG4gICAgICovXG4gICAgV2lkZ2V0LnByb3RvdHlwZS5vbkFmdGVyQXR0YWNoID0gZnVuY3Rpb24gKG1zZykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2JlZm9yZS1kZXRhY2gnYCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogKipTZWUgYWxzbzoqKiBbW01TR19CRUZPUkVfREVUQUNIXV1cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQmVmb3JlRGV0YWNoID0gZnVuY3Rpb24gKG1zZykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2NoaWxkLXNob3duJ2AgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoaXMgaGFuZGxlciBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIFdpZGdldC5wcm90b3R5cGUub25DaGlsZFNob3duID0gZnVuY3Rpb24gKG1zZykgeyB9O1xuICAgIC8qKlxuICAgICAqIEEgbWVzc2FnZSBoYW5kbGVyIGludm9rZWQgb24gYSBgJ2NoaWxkLWhpZGRlbidgIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGhhbmRsZXIgaXMgYSBuby1vcC5cbiAgICAgKi9cbiAgICBXaWRnZXQucHJvdG90eXBlLm9uQ2hpbGRIaWRkZW4gPSBmdW5jdGlvbiAobXNnKSB7IH07XG4gICAgLyoqXG4gICAgICogQSBzaWduYWwgZW1pdHRlZCB3aGVuIHRoZSB3aWRnZXQgaXMgZGlzcG9zZWQuXG4gICAgICpcbiAgICAgKiAqKlNlZSBhbHNvOioqIFtbZGlzcG9zZWRdXSwgW1tpc0Rpc3Bvc2VkXV1cbiAgICAgKi9cbiAgICBXaWRnZXQuZGlzcG9zZWRTaWduYWwgPSBuZXcgcGhvc3Bob3Jfc2lnbmFsaW5nXzEuU2lnbmFsKCk7XG4gICAgLyoqXG4gICAgICogQSBwcm9wZXJ0eSBkZXNjcmlwdG9yIHdoaWNoIGNvbnRyb2xzIHRoZSBoaWRkZW4gc3RhdGUgb2YgYSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogVGhpcyBwcm9wZXJ0eSBjb250cm9scyB3aGV0aGVyIGEgd2lkZ2V0IGlzIGV4cGxpY2l0bHkgaGlkZGVuLlxuICAgICAqXG4gICAgICogSGlkaW5nIGEgd2lkZ2V0IHdpbGwgY2F1c2UgdGhlIHdpZGdldCBhbmQgYWxsIG9mIGl0cyBkZXNjZW5kYW50c1xuICAgICAqIHRvIGJlY29tZSBub3QtdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIFRoaXMgcHJvcGVydHkgd2lsbCB0b2dnbGUgdGhlIHByZXNlbmNlIG9mIFtbSElEREVOX0NMQVNTXV0gb24gYVxuICAgICAqIHdpZGdldCBhY2NvcmRpbmcgdG8gdGhlIHByb3BlcnR5IHZhbHVlLiBJdCB3aWxsIGFsc28gZGlzcGF0Y2hcbiAgICAgKiBgJ2FmdGVyLXNob3cnYCBhbmQgYCdiZWZvcmUtaGlkZSdgIG1lc3NhZ2VzIGFzIGFwcHJvcHJpYXRlLlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgcHJvcGVydHkgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqICoqU2VlIGFsc286KiogW1toaWRkZW5dXSwgW1tpc1Zpc2libGVdXVxuICAgICAqL1xuICAgIFdpZGdldC5oaWRkZW5Qcm9wZXJ0eSA9IG5ldyBwaG9zcGhvcl9wcm9wZXJ0aWVzXzEuUHJvcGVydHkoe1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIGNoYW5nZWQ6IG9uSGlkZGVuQ2hhbmdlZCxcbiAgICB9KTtcbiAgICByZXR1cm4gV2lkZ2V0O1xufSkocGhvc3Bob3Jfbm9kZXdyYXBwZXJfMS5Ob2RlV3JhcHBlcik7XG5leHBvcnRzLldpZGdldCA9IFdpZGdldDtcbi8qKlxuICogQXR0YWNoIGEgd2lkZ2V0IHRvIGEgaG9zdCBET00gbm9kZS5cbiAqXG4gKiBAcGFyYW0gd2lkZ2V0IC0gVGhlIHdpZGdldCB0byBhdHRhY2ggdG8gdGhlIERPTS5cbiAqXG4gKiBAcGFyYW0gaG9zdCAtIFRoZSBub2RlIHRvIHVzZSBhcyB0aGUgd2lkZ2V0J3MgaG9zdC5cbiAqXG4gKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHdpZGdldCBpcyBub3QgYSByb290IHdpZGdldCxcbiAqICAgaWYgdGhlIHdpZGdldCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBET00sIG9yIGlmIHRoZSBob3N0XG4gKiAgIGlzIG5vdCBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICpcbiAqICMjIyMgTm90ZXNcbiAqIFRoaXMgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGFuIGAnYWZ0ZXItYXR0YWNoJ2AgbWVzc2FnZSBpcyBkaXNwYXRjaGVkXG4gKiB0byB0aGUgaGllcmFyY2h5LiBJdCBzaG91bGQgYmUgdXNlZCBpbiBsaWV1IG9mIG1hbnVhbCBET00gYXR0YWNobWVudC5cbiAqL1xuZnVuY3Rpb24gYXR0YWNoV2lkZ2V0KHdpZGdldCwgaG9zdCkge1xuICAgIGlmICh3aWRnZXQucGFyZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignb25seSBhIHJvb3Qgd2lkZ2V0IGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgRE9NJyk7XG4gICAgfVxuICAgIGlmICh3aWRnZXQuaXNBdHRhY2hlZCB8fCBkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHdpZGdldC5ub2RlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dpZGdldCBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBET00nKTtcbiAgICB9XG4gICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGhvc3QpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaG9zdCBpcyBub3QgYXR0YWNoZWQgdG8gdGhlIERPTScpO1xuICAgIH1cbiAgICBob3N0LmFwcGVuZENoaWxkKHdpZGdldC5ub2RlKTtcbiAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZSh3aWRnZXQsIGV4cG9ydHMuTVNHX0FGVEVSX0FUVEFDSCk7XG59XG5leHBvcnRzLmF0dGFjaFdpZGdldCA9IGF0dGFjaFdpZGdldDtcbi8qKlxuICogRGV0YWNoIGEgd2lkZ2V0IGZyb20gaXRzIGhvc3QgRE9NIG5vZGUuXG4gKlxuICogQHBhcmFtIHdpZGdldCAtIFRoZSB3aWRnZXQgdG8gZGV0YWNoIGZyb20gdGhlIERPTS5cbiAqXG4gKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHdpZGdldCBpcyBub3QgYSByb290IHdpZGdldCxcbiAqICAgb3IgaWYgdGhlIHdpZGdldCBpcyBub3QgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAqXG4gKiAjIyMjIE5vdGVzXG4gKiBUaGlzIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBhIGAnYmVmb3JlLWRldGFjaCdgIG1lc3NhZ2UgaXMgZGlzcGF0Y2hlZFxuICogdG8gdGhlIGhpZXJhcmNoeS4gSXQgc2hvdWxkIGJlIHVzZWQgaW4gbGlldSBvZiBtYW51YWwgRE9NIGRldGFjaG1lbnQuXG4gKi9cbmZ1bmN0aW9uIGRldGFjaFdpZGdldCh3aWRnZXQpIHtcbiAgICBpZiAod2lkZ2V0LnBhcmVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ29ubHkgYSByb290IHdpZGdldCBjYW4gYmUgZGV0YWNoZWQgZnJvbSB0aGUgRE9NJyk7XG4gICAgfVxuICAgIGlmICghd2lkZ2V0LmlzQXR0YWNoZWQgfHwgIWRvY3VtZW50LmJvZHkuY29udGFpbnMod2lkZ2V0Lm5vZGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignd2lkZ2V0IGlzIG5vdCBhdHRhY2hlZCB0byB0aGUgRE9NJyk7XG4gICAgfVxuICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKHdpZGdldCwgZXhwb3J0cy5NU0dfQkVGT1JFX0RFVEFDSCk7XG4gICAgd2lkZ2V0Lm5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3aWRnZXQubm9kZSk7XG59XG5leHBvcnRzLmRldGFjaFdpZGdldCA9IGRldGFjaFdpZGdldDtcbi8qKlxuICogQSBtZXNzYWdlIGNsYXNzIGZvciBjaGlsZC1yZWxhdGVkIG1lc3NhZ2VzLlxuICovXG52YXIgQ2hpbGRNZXNzYWdlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2hpbGRNZXNzYWdlLCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBjaGlsZCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgbWVzc2FnZSB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkIC0gVGhlIGNoaWxkIHdpZGdldCBmb3IgdGhlIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcHJldmlvdXNJbmRleCAtIFRoZSBwcmV2aW91cyBpbmRleCBvZiB0aGUgY2hpbGQsIGlmIGtub3duLlxuICAgICAqICAgVGhlIGRlZmF1bHQgaW5kZXggaXMgYC0xYCBhbmQgaW5kaWNhdGVzIGFuIHVua25vd24gaW5kZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY3VycmVudEluZGV4IC0gVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGNoaWxkLCBpZiBrbm93bi5cbiAgICAgKiAgIFRoZSBkZWZhdWx0IGluZGV4IGlzIGAtMWAgYW5kIGluZGljYXRlcyBhbiB1bmtub3duIGluZGV4LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENoaWxkTWVzc2FnZSh0eXBlLCBjaGlsZCwgcHJldmlvdXNJbmRleCwgY3VycmVudEluZGV4KSB7XG4gICAgICAgIGlmIChwcmV2aW91c0luZGV4ID09PSB2b2lkIDApIHsgcHJldmlvdXNJbmRleCA9IC0xOyB9XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IHZvaWQgMCkgeyBjdXJyZW50SW5kZXggPSAtMTsgfVxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCB0eXBlKTtcbiAgICAgICAgdGhpcy5fY2hpbGQgPSBjaGlsZDtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gY3VycmVudEluZGV4O1xuICAgICAgICB0aGlzLl9wcmV2aW91c0luZGV4ID0gcHJldmlvdXNJbmRleDtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENoaWxkTWVzc2FnZS5wcm90b3R5cGUsIFwiY2hpbGRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNoaWxkIHdpZGdldCBmb3IgdGhlIG1lc3NhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqICMjIyMgTm90ZXNcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2hpbGRNZXNzYWdlLnByb3RvdHlwZSwgXCJjdXJyZW50SW5kZXhcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGNoaWxkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBgLTFgIGlmIHRoZSBjdXJyZW50IGluZGV4IGlzIHVua25vd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50SW5kZXg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaGlsZE1lc3NhZ2UucHJvdG90eXBlLCBcInByZXZpb3VzSW5kZXhcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByZXZpb3VzIGluZGV4IG9mIHRoZSBjaGlsZC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHdpbGwgYmUgYC0xYCBpZiB0aGUgcHJldmlvdXMgaW5kZXggaXMgdW5rbm93bi5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBpcyBhIHJlYWQtb25seSBwcm9wZXJ0eS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzSW5kZXg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBDaGlsZE1lc3NhZ2U7XG59KShwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKTtcbmV4cG9ydHMuQ2hpbGRNZXNzYWdlID0gQ2hpbGRNZXNzYWdlO1xuLyoqXG4gKiBBIG1lc3NhZ2UgY2xhc3MgZm9yICdyZXNpemUnIG1lc3NhZ2VzLlxuICovXG52YXIgUmVzaXplTWVzc2FnZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJlc2l6ZU1lc3NhZ2UsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0IGEgbmV3IHJlc2l6ZSBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHdpZHRoIC0gVGhlICoqb2Zmc2V0IHdpZHRoKiogb2YgdGhlIHdpZGdldCwgb3IgYC0xYCBpZlxuICAgICAqICAgdGhlIHdpZHRoIGlzIG5vdCBrbm93bi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBoZWlnaHQgLSBUaGUgKipvZmZzZXQgaGVpZ2h0Kiogb2YgdGhlIHdpZGdldCwgb3IgYC0xYCBpZlxuICAgICAqICAgdGhlIGhlaWdodCBpcyBub3Qga25vd24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVzaXplTWVzc2FnZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsICdyZXNpemUnKTtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVzaXplTWVzc2FnZS5wcm90b3R5cGUsIFwid2lkdGhcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9mZnNldCB3aWR0aCBvZiB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiAjIyMjIE5vdGVzXG4gICAgICAgICAqIFRoaXMgd2lsbCBiZSBgLTFgIGlmIHRoZSB3aWR0aCBpcyB1bmtub3duLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGlzIGEgcmVhZC1vbmx5IHByb3BlcnR5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZXNpemVNZXNzYWdlLnByb3RvdHlwZSwgXCJoZWlnaHRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9mZnNldCBoZWlnaHQgb2YgdGhlIHdpZGdldC5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHdpbGwgYmUgYC0xYCBpZiB0aGUgaGVpZ2h0IGlzIHVua25vd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgYSByZWFkLW9ubHkgcHJvcGVydHkuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEEgc2luZ2xldG9uICdyZXNpemUnIG1lc3NhZ2Ugd2l0aCBhbiB1bmtub3duIHNpemUuXG4gICAgICovXG4gICAgUmVzaXplTWVzc2FnZS5Vbmtub3duU2l6ZSA9IG5ldyBSZXNpemVNZXNzYWdlKC0xLCAtMSk7XG4gICAgcmV0dXJuIFJlc2l6ZU1lc3NhZ2U7XG59KShwaG9zcGhvcl9tZXNzYWdpbmdfMS5NZXNzYWdlKTtcbmV4cG9ydHMuUmVzaXplTWVzc2FnZSA9IFJlc2l6ZU1lc3NhZ2U7XG4vKipcbiAqIEFuIGVudW0gb2Ygd2lkZ2V0IGJpdCBmbGFncy5cbiAqL1xudmFyIFdpZGdldEZsYWc7XG4oZnVuY3Rpb24gKFdpZGdldEZsYWcpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgd2lkZ2V0IGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG4gICAgICovXG4gICAgV2lkZ2V0RmxhZ1tXaWRnZXRGbGFnW1wiSXNBdHRhY2hlZFwiXSA9IDFdID0gXCJJc0F0dGFjaGVkXCI7XG4gICAgLyoqXG4gICAgICogVGhlIHdpZGdldCBpcyB2aXNpYmxlLlxuICAgICAqL1xuICAgIFdpZGdldEZsYWdbV2lkZ2V0RmxhZ1tcIklzVmlzaWJsZVwiXSA9IDJdID0gXCJJc1Zpc2libGVcIjtcbiAgICAvKipcbiAgICAgKiBUaGUgd2lkZ2V0IGhhcyBiZWVuIGRpc3Bvc2VkLlxuICAgICAqL1xuICAgIFdpZGdldEZsYWdbV2lkZ2V0RmxhZ1tcIklzRGlzcG9zZWRcIl0gPSA0XSA9IFwiSXNEaXNwb3NlZFwiO1xufSkoV2lkZ2V0RmxhZyB8fCAoV2lkZ2V0RmxhZyA9IHt9KSk7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBvZmZzZXQgcmVjdCBmdWxsIG9mIE5hTidzLlxuICovXG5mdW5jdGlvbiBtYWtlT2Zmc2V0UmVjdCgpIHtcbiAgICByZXR1cm4geyB0b3A6IE5hTiwgbGVmdDogTmFOLCB3aWR0aDogTmFOLCBoZWlnaHQ6IE5hTiB9O1xufVxuLyoqXG4gKiBDbG9uZSBhbiBvZmZzZXQgcmVjdCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lT2Zmc2V0UmVjdChyZWN0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICAgIH07XG59XG4vKipcbiAqIEdldCB0aGUgb2Zmc2V0IHJlY3QgZm9yIGEgRE9NIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdldE9mZnNldFJlY3Qobm9kZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogbm9kZS5vZmZzZXRUb3AsXG4gICAgICAgIGxlZnQ6IG5vZGUub2Zmc2V0TGVmdCxcbiAgICAgICAgd2lkdGg6IG5vZGUub2Zmc2V0V2lkdGgsXG4gICAgICAgIGhlaWdodDogbm9kZS5vZmZzZXRIZWlnaHQsXG4gICAgfTtcbn1cbi8qKlxuICogVGhlIGNoYW5nZSBoYW5kbGVyIGZvciB0aGUgW1toaWRkZW5Qcm9wZXJ0eV1dLlxuICovXG5mdW5jdGlvbiBvbkhpZGRlbkNoYW5nZWQob3duZXIsIG9sZCwgaGlkZGVuKSB7XG4gICAgaWYgKGhpZGRlbikge1xuICAgICAgICBpZiAob3duZXIuaXNBdHRhY2hlZCAmJiAoIW93bmVyLnBhcmVudCB8fCBvd25lci5wYXJlbnQuaXNWaXNpYmxlKSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2Uob3duZXIsIGV4cG9ydHMuTVNHX0JFRk9SRV9ISURFKTtcbiAgICAgICAgfVxuICAgICAgICBvd25lci5hZGRDbGFzcyhleHBvcnRzLkhJRERFTl9DTEFTUyk7XG4gICAgICAgIGlmIChvd25lci5wYXJlbnQpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKG93bmVyLnBhcmVudCwgbmV3IENoaWxkTWVzc2FnZSgnY2hpbGQtaGlkZGVuJywgb3duZXIpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3duZXIucmVtb3ZlQ2xhc3MoZXhwb3J0cy5ISURERU5fQ0xBU1MpO1xuICAgICAgICBpZiAob3duZXIuaXNBdHRhY2hlZCAmJiAoIW93bmVyLnBhcmVudCB8fCBvd25lci5wYXJlbnQuaXNWaXNpYmxlKSkge1xuICAgICAgICAgICAgcGhvc3Bob3JfbWVzc2FnaW5nXzEuc2VuZE1lc3NhZ2Uob3duZXIsIGV4cG9ydHMuTVNHX0FGVEVSX1NIT1cpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvd25lci5wYXJlbnQpIHtcbiAgICAgICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKG93bmVyLnBhcmVudCwgbmV3IENoaWxkTWVzc2FnZSgnY2hpbGQtc2hvd24nLCBvd25lcikpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSB0byBhbGwgd2lkZ2V0cyBpbiBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gc2VuZFRvQWxsKGFycmF5LCBtc2cpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHBob3NwaG9yX21lc3NhZ2luZ18xLnNlbmRNZXNzYWdlKGFycmF5W2ldLCBtc2cpO1xuICAgIH1cbn1cbi8qKlxuICogU2VuZCBhIG1lc3NhZ2UgdG8gYWxsIG5vbi1oaWRkZW4gd2lkZ2V0cyBpbiBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gc2VuZFRvU2hvd24oYXJyYXksIG1zZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKCFhcnJheVtpXS5oaWRkZW4pXG4gICAgICAgICAgICBwaG9zcGhvcl9tZXNzYWdpbmdfMS5zZW5kTWVzc2FnZShhcnJheVtpXSwgbXNnKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG58IENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBQaG9zcGhvckpTIENvbnRyaWJ1dG9yc1xufFxufCBEaXN0cmlidXRlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxufFxufCBUaGUgZnVsbCBsaWNlbnNlIGlzIGluIHRoZSBmaWxlIExJQ0VOU0UsIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb2Z0d2FyZS5cbnwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQSBiYXNlIGNsYXNzIGZvciBjcmVhdGluZyBvYmplY3RzIHdoaWNoIHdyYXAgYSBET00gbm9kZS5cbiAqL1xudmFyIE5vZGVXcmFwcGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOb2RlV3JhcHBlcigpIHtcbiAgICAgICAgdGhpcy5fbm9kZSA9IHRoaXMuY29uc3RydWN0b3IuY3JlYXRlTm9kZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdGhlIERPTSBub2RlIGZvciBhIG5ldyBub2RlIHdyYXBwZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgRE9NIG5vZGUgdG8gdXNlIHdpdGggdGhlIG5vZGUgd3JhcHBlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjcmVhdGVzIGFuIGVtcHR5IGA8ZGl2PmAuXG4gICAgICpcbiAgICAgKiBUaGlzIG1heSBiZSByZWltcGxlbWVudGVkIGJ5IGEgc3ViY2xhc3MgdG8gY3JlYXRlIGEgY3VzdG9tIG5vZGUuXG4gICAgICovXG4gICAgTm9kZVdyYXBwZXIuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGVXcmFwcGVyLnByb3RvdHlwZSwgXCJub2RlXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgRE9NIG5vZGUgbWFuYWdlZCBieSB0aGUgd3JhcHBlci5cbiAgICAgICAgICpcbiAgICAgICAgICogIyMjIyBOb3Rlc1xuICAgICAgICAgKiBUaGlzIHByb3BlcnR5IGlzIHJlYWQtb25seS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlV3JhcHBlci5wcm90b3R5cGUsIFwiaWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHRoZSBpZCBvZiB0aGUgd3JhcHBlcidzIERPTSBub2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pZDtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgaWQgb2YgdGhlIHdyYXBwZXIncyBET00gbm9kZS5cbiAgICAgICAgICovXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9ub2RlLmlkID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIFRlc3Qgd2hldGhlciB0aGUgd3JhcHBlcidzIERPTSBub2RlIGhhcyB0aGUgZ2l2ZW4gY2xhc3MgbmFtZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIC0gVGhlIGNsYXNzIG5hbWUgb2YgaW50ZXJlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgaGFzIHRoZSBjbGFzcywgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgTm9kZVdyYXBwZXIucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIGEgY2xhc3MgbmFtZSB0byB0aGUgd3JhcHBlcidzIERPTSBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgLSBUaGUgY2xhc3MgbmFtZSB0byBhZGQgdG8gdGhlIG5vZGUuXG4gICAgICpcbiAgICAgKiAjIyMjIE5vdGVzXG4gICAgICogSWYgdGhlIGNsYXNzIG5hbWUgaXMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbm9kZSwgdGhpcyBpcyBhIG5vLW9wLlxuICAgICAqL1xuICAgIE5vZGVXcmFwcGVyLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHRoaXMuX25vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNsYXNzIG5hbWUgZnJvbSB0aGUgd3JhcHBlcidzIERPTSBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgLSBUaGUgY2xhc3MgbmFtZSB0byByZW1vdmUgZnJvbSB0aGUgbm9kZS5cbiAgICAgKlxuICAgICAqICMjIyMgTm90ZXNcbiAgICAgKiBJZiB0aGUgY2xhc3MgbmFtZSBpcyBub3QgeWV0IGFkZGVkIHRvIHRoZSBub2RlLCB0aGlzIGlzIGEgbm8tb3AuXG4gICAgICovXG4gICAgTm9kZVdyYXBwZXIucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fbm9kZS5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVG9nZ2xlIGEgY2xhc3MgbmFtZSBvbiB0aGUgd3JhcHBlcidzIERPTSBub2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgLSBUaGUgY2xhc3MgbmFtZSB0byB0b2dnbGUgb24gdGhlIG5vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9yY2UgLSBXaGV0aGVyIHRvIGZvcmNlIGFkZCB0aGUgY2xhc3MgKGB0cnVlYCkgb3IgZm9yY2VcbiAgICAgKiAgIHJlbW92ZSB0aGUgY2xhc3MgKGBmYWxzZWApLiBJZiBub3QgcHJvdmlkZWQsIHRoZSBwcmVzZW5jZSBvZlxuICAgICAqICAgdGhlIGNsYXNzIHdpbGwgYmUgdG9nZ2xlZCBmcm9tIGl0cyBjdXJyZW50IHN0YXRlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBjbGFzcyBpcyBub3cgcHJlc2VudCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgTm9kZVdyYXBwZXIucHJvdG90eXBlLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gKG5hbWUsIGZvcmNlKSB7XG4gICAgICAgIHZhciBwcmVzZW50O1xuICAgICAgICBpZiAoZm9yY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MobmFtZSk7XG4gICAgICAgICAgICBwcmVzZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JjZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MobmFtZSk7XG4gICAgICAgICAgICBwcmVzZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5oYXNDbGFzcyhuYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcyhuYW1lKTtcbiAgICAgICAgICAgIHByZXNlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MobmFtZSk7XG4gICAgICAgICAgICBwcmVzZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJlc2VudDtcbiAgICB9O1xuICAgIHJldHVybiBOb2RlV3JhcHBlcjtcbn0pKCk7XG5leHBvcnRzLk5vZGVXcmFwcGVyID0gTm9kZVdyYXBwZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXX0=
