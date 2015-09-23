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
//# sourceMappingURL=spreadsheet.js.map