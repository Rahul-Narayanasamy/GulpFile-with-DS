// import { Browser, EventHandler, MouseEventArgs, createElement } from '@syncfusion/ej2-base';
// import { isNullOrUndefined, isUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
// import { remove, closest, classList } from '@syncfusion/ej2-base';
// import { Query } from '@syncfusion/ej2-data';
// import { IGrid, IAction, IIndex, ISelectedCell, IPosition, IRenderer, EJ2Intance, NotifyArgs, CellFocusArgs } from '../base/interface';
// import { SelectionSettings } from '../base/grid';
// import { setCssInGridPopUp, getPosition, parentsUntil, addRemoveActiveClasses, removeAddCboxClasses } from '../base/util';
// import * as events from '../base/constant';
// import { RenderType, CheckState } from '../base/enum';
// import { ServiceLocator } from '../services/service-locator';
// import { RendererFactory } from '../services/renderer-factory';
// import { Column } from '../models/column';
// import { Row } from '../models/row';
// import { Data } from '../actions/data';
// import { ReturnType } from '../base/type';
// import { FocusStrategy } from '../services/focus-strategy';
// import { iterateExtend } from '../base/util';


// /**
//  * The `Selection` module is used to handle cell and row selection.
//  */
// export class Selection implements IAction {
//     //Internal letiables       
//     /**
//      * @hidden
//      */
//     public selectedRowIndexes: number[] = [];
//     /**
//      * @hidden
//      */
//     public selectedRowCellIndexes: ISelectedCell[] = [];
//     /**
//      * @hidden
//      */
//     public selectedRecords: Element[] = [];
//     /**
//      * @hidden
//      */
//     public isRowSelected: boolean;
//     /**
//      * @hidden
//      */
//     public isCellSelected: boolean;
//     /**
//      * @hidden
//      */
//     public preventFocus: boolean = false;
//     private selectionSettings: SelectionSettings;
//     private prevRowIndex: number;
//     private prevCIdxs: IIndex;
//     private prevECIdxs: IIndex;
//     private selectedRowIndex: number;
//     private isMultiShiftRequest: boolean = false;
//     private isMultiCtrlRequest: boolean = false;
//     private enableSelectMultiTouch: boolean = false;
//     private element: HTMLElement;
//     private autofill: HTMLElement;
//     private isAutoFillSel: boolean;
//     private startCell: Element;
//     private endCell: Element;
//     private startAFCell: Element;
//     private endAFCell: Element;
//     private startIndex: number;
//     private startCellIndex: number;
//     private startDIndex: number;
//     private startDCellIndex: number;
//     private currentIndex: number;
//     private isDragged: boolean;
//     private isCellDrag: boolean;
//     private x: number;
//     private y: number;
//     private target: Element;
//     private actualTarget: Element;
//     private preSelectedCellIndex: IIndex;
//     private factory: RendererFactory;
//     private contentRenderer: IRenderer;
//     private checkedTarget: HTMLInputElement;
//     private primaryKey: string;
//     private chkField: string;
//     private selectedRowState: { [key: number]: boolean } = {};
//     private totalRecordsCount: number = 0;
//     private chkAllCollec: Object[] = [];
//     private isCheckedOnAdd: boolean = false;
//     private persistSelectedData: Object[] = [];
//     private onDataBoundFunction: Function;
//     private actionBeginFunction: Function;
//     private actionCompleteFunction: Function;
//     private actionCompleteFunc: Function;
//     private resizeEndFn: Function;
//     private mUPTarget: Element;
//     private bdrLeft: HTMLElement;
//     private bdrRight: HTMLElement;
//     private bdrTop: HTMLElement;
//     private bdrBottom: HTMLElement;
//     private bdrAFLeft: HTMLElement;
//     private bdrAFRight: HTMLElement;
//     private bdrAFTop: HTMLElement;
//     private bdrAFBottom: HTMLElement;
//     //Module declarations
//     private parent: IGrid;
//     private focus: FocusStrategy;
//     private isCancelDeSelect: boolean = false;
//     private isPreventCellSelect: boolean = false;
//     private disableUI: boolean = false;

//     /**
//      * Constructor for the Grid selection module
//      * @hidden
//      */
//     constructor(parent?: IGrid, selectionSettings?: SelectionSettings, locator?: ServiceLocator) {
//         this.parent = parent;
//         this.selectionSettings = selectionSettings;
//         this.factory = locator.getService<RendererFactory>('rendererFactory');
//         this.focus = locator.getService<FocusStrategy>('focus');
//         this.addEventListener();
//     }

//     private initializeSelection(): void {
//         EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
//     }

//     /**
//      * The function used to trigger onActionBegin
//      * @return {void}
//      * @hidden
//      */
//     public onActionBegin(args: Object, type: string): void {
//         this.parent.trigger(<string>type, this.fDataUpdate(args));
//     }

//     private fDataUpdate(args: { cellIndex?: IIndex, foreignKeyData?: Object, rowIndex?: number }): Object {
//         if (args.cellIndex || args.rowIndex) {
//             let rowObj: Row<Column> = this.getRowObj(isNullOrUndefined(args.rowIndex) ? isNullOrUndefined(args.cellIndex) ?
//                 this.currentIndex : args.cellIndex.rowIndex : args.rowIndex);
//             args.foreignKeyData = rowObj.foreignKeyData;
//         }
//         return args;
//     }

//     /**
//      * The function used to trigger onActionComplete
//      * @return {void}
//      * @hidden
//      */
//     public onActionComplete(args: Object, type: string): void {
//         this.parent.trigger(<string>type, this.fDataUpdate(args));
//     }

//     /**
//      * For internal use only - Get the module name.
//      * @private
//      */
//     protected getModuleName(): string {
//         return 'selection';
//     }

//     /**
//      * To destroy the selection 
//      * @return {void}
//      * @hidden
//      */
//     public destroy(): void {
//         let gridElement: Element = this.parent.element;
//         if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }
//         this.hidePopUp();
//         this.clearSelection();
//         this.removeEventListener();
//         EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
//     }

//     private isEditing(): boolean {
//         return (this.parent.editSettings.mode === 'Normal' || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule &&
//             this.parent.editModule.formObj && !this.parent.editModule.formObj.validate())) &&
//             this.parent.isEdit && !this.parent.isPersistSelection;
//     }

//     private getSelectedMovableRow(index: number): Element {
//         let gObj: IGrid = this.parent;
//         if (gObj.getFrozenColumns()) {
//             return gObj.getMovableRowByIndex(index);
//         }
//         return null;
//     }

//     public getCurrentBatchRecordChanges(): Object[] {
//         let gObj: IGrid = this.parent;
//         let added: string = 'addedRecords';
//         let deleted: string = 'deletedRecords';
//         if (gObj.editSettings.mode === 'Batch' && gObj.editModule) {
//             let currentRecords: Object[] = iterateExtend(this.parent.getCurrentViewRecords());
//             currentRecords = this.parent.editModule.getBatchChanges()[added].concat(currentRecords);
//             let deletedRecords: Object[] = this.parent.editModule.getBatchChanges()[deleted];
//             let primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
//             for (let i: number = 0; i < (deletedRecords.length); i++) {
//                 for (let j: number = 0; j < currentRecords.length; j++) {
//                     if (deletedRecords[i][primaryKey] === currentRecords[j][primaryKey]) {
//                         currentRecords.splice(j, 1);
//                         break;
//                     }
//                 }
//             }
//             return currentRecords;
//         } else {
//             return gObj.getCurrentViewRecords();
//         }
//     }

//     /** 
//      * Selects a row by the given index. 
//      * @param  {number} index - Defines the row index. 
//      * @param  {boolean} isToggle - If set to true, then it toggles the selection.
//      * @return {void} 
//      */
//     public selectRow(index: number, isToggle?: boolean): void {
//         if (this.selectedRowIndexes.length && this.selectionSettings.enableSimpleMultiRowSelection) {
//             this.addRowsToSelection([index]);
//             return;
//         }
//         let gObj: IGrid = this.parent;
//         let selectedRow: Element = gObj.getRowByIndex(index);
//         let selectedMovableRow: Element = this.getSelectedMovableRow(index);
//         let selectData: Object = this.getCurrentBatchRecordChanges()[index];
//         let isRemoved: boolean = false;
//         if (gObj.enableVirtualization && selectedRow) {
//             selectData = gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')).data;
//         }
//         if (!this.isRowType() || !selectedRow || this.isEditing()) {
//             // if (this.isEditing()) {
//             //     gObj.selectedRowIndex = index;
//             // }
//             return;
//         }
//         let isRowSelected: boolean = selectedRow.hasAttribute('aria-selected');
//         isToggle = !isToggle ? isToggle :
//             !this.selectedRowIndexes.length ? false :
//                 (this.selectedRowIndexes.length === 1 ? (index === this.selectedRowIndexes[0]) : false);
//         let args: Object;
//         let can: string = 'cancel';
//         if (!isToggle) {
//             args = {
//                 data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
//                 isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
//                 previousRow: gObj.getRowByIndex(this.prevRowIndex),
//                 previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
//             };
//             args = this.addMovableArgs(args, selectedMovableRow);
//             this.onActionBegin(args, events.rowSelecting);
//         }
//         if (!isNullOrUndefined(args) && args[can] === true) {
//             return;
//         }
//         if (isRowSelected) {
//            // this.isRowSelected = true;
//             this.clearSelectedRow();
//             isRemoved = true;
//         }
//         if (!isToggle && !isRemoved) {
//             if (this.selectedRowIndexes.indexOf(index) <= -1) {
//                 this.updateRowSelection(selectedRow, index);
//                 if (gObj.getFrozenColumns()) { this.updateRowSelection(selectedMovableRow, index); }
//             }
//             this.selectRowIndex(index);
//         }
//         if (!isToggle) {
//             args = {
//                 data: selectData, rowIndex: index,
//                 row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
//                 previousRowIndex: this.prevRowIndex, target: this.actualTarget
//             };
//             args = this.addMovableArgs(args, selectedMovableRow);
//             this.onActionComplete(args, events.rowSelected);
//         }
//         this.updateRowProps(index);
//     }

//     private addMovableArgs(targetObj: Object, mRow: Element): Object {
//         if (this.parent.getFrozenColumns()) {
//             let mObj: Object = { mRow: mRow, previousMovRow: this.parent.getMovableRows()[this.prevRowIndex] };
//             targetObj = { ...targetObj, ...mObj };
//         }
//         return targetObj;
//     }

//     /** 
//      * Selects a range of rows from start and end row indexes. 
//      * @param  {number} startIndex - Specifies the start row index. 
//      * @param  {number} endIndex - Specifies the end row index. 
//      * @return {void} 
//      */
//     public selectRowsByRange(startIndex: number, endIndex?: number): void {
//         this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
//         this.selectRowIndex(endIndex);
//     }

//     /** 
//      * Selects a collection of rows by index. 
//      * @param  {number[]} rowIndexes - Specifies an array of row indexes.
//      * @return {void} 
//      */
//     public selectRows(rowIndexes: number[]): void {
//         let gObj: IGrid = this.parent;
//         let rowIndex: number = !this.isSingleSel() ? rowIndexes[0] : rowIndexes[rowIndexes.length - 1];
//         let selectedRow: Element = gObj.getRowByIndex(rowIndex);
//         let selectedMovableRow: Element = this.getSelectedMovableRow(rowIndex);
//         let frzCols: number = gObj.getFrozenColumns();
//         let can: string = 'cancel';
//         let selectedData: Object = this.getCurrentBatchRecordChanges()[rowIndexes[0]];
//         if (!this.isRowType() || this.isEditing()) {
//             return;
//         }
//         let args: Object = {
//             rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndex, target: this.actualTarget,
//             prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
//             isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
//             data: selectedData
//         };
//         args = this.addMovableArgs(args, selectedMovableRow);
//         this.onActionBegin(args, events.rowSelecting);
//         if (!isNullOrUndefined(args) && args[can] === true) {
//             return;
//         }
//         this.clearRow();
//         this.selectRowIndex(rowIndexes.slice(-1)[0]);
//         if (!this.isSingleSel()) {
//             for (let rowIdx of rowIndexes) {
//                 this.updateRowSelection(gObj.getRowByIndex(rowIdx), rowIdx);
//                 if (frzCols) { this.updateRowSelection(gObj.getMovableRowByIndex(rowIdx), rowIdx); }
//                 this.updateRowProps(rowIndex);
//             }
//         } else {
//             this.updateRowSelection(gObj.getRowByIndex(rowIndex), rowIndex);
//             if (frzCols) { this.updateRowSelection(gObj.getMovableRowByIndex(rowIndex), rowIndex); }
//             this.updateRowProps(rowIndex);
//         }
//         args = {
//             rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndex, target: this.actualTarget,
//             prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
//             data: selectedData
//         };
//         args = this.addMovableArgs(args, selectedMovableRow);
//         this.onActionComplete(args, events.rowSelected);
//     }

//     /** 
//      * Select rows with existing row selection by passing row indexes. 
//      * @param  {number} startIndex - Specifies the row indexes. 
//      * @return {void} 
//      * @hidden
//      */
//     public addRowsToSelection(rowIndexes: number[]): void {
//         let gObj: IGrid = this.parent;
//         let can: string = 'cancel';
//         let target: Element = this.target;
//         let selectedRow: Element = !this.isSingleSel() ? gObj.getRowByIndex(rowIndexes[0]) :
//             gObj.getRowByIndex(rowIndexes[rowIndexes.length - 1]);
//         let selectedMovableRow: Element = !this.isSingleSel() ? this.getSelectedMovableRow(rowIndexes[0]) :
//             this.getSelectedMovableRow(rowIndexes[rowIndexes.length - 1]);
//         let frzCols: number = gObj.getFrozenColumns();
//         if (!this.isRowType() || this.isEditing()) {
//             return;
//         }
//         let args: Object;
//         let checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
//         for (let rowIndex of rowIndexes) {
//             let rowObj: Row<Column> = this.getRowObj(rowIndex);
//             let isUnSelected: boolean = this.selectedRowIndexes.indexOf(rowIndex) > -1;
//             this.selectRowIndex(rowIndex);
//             if (isUnSelected && ((checkboxColumn.length ? true : this.selectionSettings.enableToggle) || this.isMultiCtrlRequest)) {
//                 this.rowDeselect(events.rowDeselecting, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target);
//                 this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
//                 this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
//                 selectedRow.removeAttribute('aria-selected');
//                 this.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
//                 if (selectedMovableRow) {
//                     this.selectedRecords.splice(this.selectedRecords.indexOf(selectedMovableRow), 1);
//                     selectedMovableRow.removeAttribute('aria-selected');
//                     this.addRemoveClassesForRow(selectedMovableRow, false, null, 'e-selectionbackground', 'e-active');
//                 }
//                 this.rowDeselect(
//                     events.rowDeselected, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target, [selectedMovableRow]);
//             } else {
//                 args = {
//                     data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this.actualTarget,
//                     prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
//                     isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
//                     foreignKeyData: rowObj.foreignKeyData
//                 };
//                 args = this.addMovableArgs(args, selectedMovableRow);
//                 this.onActionBegin(args, events.rowSelecting);
//                 if (!isNullOrUndefined(args) && args[can] === true) {
//                     return;
//                 }
//                 if (this.isSingleSel()) {
//                     this.clearRow();
//                 }
//                 this.updateRowSelection(selectedRow, rowIndex);
//                 if (frzCols) { this.updateRowSelection(selectedMovableRow, rowIndex); }
//             }
//             if (!isUnSelected) {
//                 args = {
//                     data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this.actualTarget,
//                     prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
//                     foreignKeyData: rowObj.foreignKeyData
//                 };
//                 args = this.addMovableArgs(args, selectedMovableRow);
//                 this.onActionComplete(args, events.rowSelected);
//             }
//             this.updateRowProps(rowIndex);
//             if (this.isSingleSel()) {
//                 break;
//             }
//         }
//     }

//     private getCollectionFromIndexes(startIndex: number, endIndex: number): number[] {
//         let indexes: number[] = [];
//         let { i, max }: { i: number, max: number } = (startIndex < endIndex) ?
//             { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
//         for (; i <= max; i++) {
//             indexes.push(i);
//         }
//         if (startIndex > endIndex) {
//             indexes.reverse();
//         }
//         return indexes;
//     }

//     private clearRow(): void {
//         this.clearRowSelection();
//         if (this.isCancelDeSelect === true) {
//             return;
//         }
//         this.selectedRowIndexes = [];
//         this.selectedRecords = [];
//         this.selectRowIndex(-1);
//         if (this.isSingleSel() && this.parent.isPersistSelection) {
//             this.selectedRowState = {};
//         }
//     }

//     private clearSelectedRow(): void {
//         let selectedRowIndex: number=Number.parseInt(this.target.getAttribute('index'));
//         let rows: Element[] = this.parent.getDataRows();
//         rows.filter((record: HTMLElement) => (Number.parseInt(record.getAttribute('aria-rowindex')) === selectedRowIndex)).forEach((ele: HTMLElement) => {
//             if (!this.disableUI) {
//                 ele.removeAttribute('aria-selected');
//                 this.addRemoveClassesForRow(ele, false, true, 'e-selectionbackground', 'e-active');
//             }
//             this.updatePersistCollection(ele, false);
//             this.updateCheckBoxes(ele);
//         });
//         this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(selectedRowIndex),1);
//         this.selectedRecords.splice(this.selectedRecords.indexOf(this.parent.getRowByIndex(selectedRowIndex)),1);
//     }

//     private updateRowProps(startIndex: number): void {
//         this.prevRowIndex = startIndex;
//         this.isRowSelected = this.selectedRowIndexes.length && true;
//     }

//     private updatePersistCollection(selectedRow: Element, chkState: boolean): void {
//         if (this.parent.isPersistSelection && !isNullOrUndefined(selectedRow)) {
//             let rowObj: Row<Column> = this.getRowObj(selectedRow);
//             let pKey: string = rowObj.data ? rowObj.data[this.primaryKey] : null;
//             if (pKey === null) { return; }
//             rowObj.isSelected = chkState;
//             if (chkState) {
//                 this.selectedRowState[pKey] = chkState;
//                 if (!this.persistSelectedData.some((data: Object) => data[this.primaryKey] === pKey)) {
//                     this.persistSelectedData.push(rowObj.data);
//                 }
//             } else {
//                 this.updatePersistDelete(pKey);
//             }
//         }
//     }

//     private updatePersistDelete(pKey: string): void {
//         delete (this.selectedRowState[pKey]);
//         let index: number;
//         let isPresent: boolean = this.persistSelectedData.some((data: Object, i: number) => {
//             index = i;
//             return data[this.primaryKey] === pKey;
//         });
//         if (isPresent) {
//             this.persistSelectedData.splice(index, 1);
//         }
//     }
//     private updateCheckBoxes(row: Element, chkState?: boolean): void {
//         if (!isNullOrUndefined(row)) {
//             let chkBox: HTMLInputElement = row.querySelector('.e-checkselect') as HTMLInputElement;
//             if (!isNullOrUndefined(chkBox)) {
//                 removeAddCboxClasses(chkBox.nextElementSibling as HTMLElement, chkState);
//                 if (isNullOrUndefined(this.checkedTarget) || (!isNullOrUndefined(this.checkedTarget)
//                     && !this.checkedTarget.classList.contains('e-checkselectall'))) {
//                     this.setCheckAllState(parseInt(row.getAttribute('aria-rowindex'), 10));
//                 }
//             }
//         }
//     }

//     private updateRowSelection(selectedRow: Element, startIndex: number): void {
//         if (!selectedRow) {
//             return;
//         }
//         this.selectedRowIndexes.push(startIndex);
//         let len: number = this.selectedRowIndexes.length;
//         if (this.parent.getFrozenColumns() && len > 1) {
//             if ((this.selectedRowIndexes[len - 2] === this.selectedRowIndexes[len - 1])) {
//                 this.selectedRowIndexes.pop();
//             }
//         }
//         this.selectedRecords.push(selectedRow);
//         selectedRow.setAttribute('aria-selected', 'true');
//         this.updatePersistCollection(selectedRow, true);
//         this.updateCheckBoxes(selectedRow, true);
//         this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
//         if (!this.preventFocus) {
//             let target: Element = this.focus.getPrevIndexes().cellIndex ?
//                 (<HTMLTableRowElement>selectedRow).cells[this.focus.getPrevIndexes().cellIndex] :
//                 selectedRow.querySelector('.e-selectionbackground:not(.e-hide):not(.e-detailrowcollapse):not(.e-detailrowexpand)');
//             if (!target) { return; }
//             this.focus.onClick({ target }, true);
//         }
//     }

//     /** 
//      * Deselects the currently selected rows and cells.
//      * @return {void} 
//      */
//     public clearSelection(): void {
//         if (!this.parent.isPersistSelection || (this.parent.isPersistSelection && !this.parent.isEdit) ||
//             (!isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
//             let span: Element = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
//             if (span.classList.contains('e-rowselect')) {
//                 span.classList.remove('e-spanclicked');
//             }
//             if (this.parent.isPersistSelection) {
//                 this.persistSelectedData = [];
//                 this.selectedRowState = {};
//             }
//             this.clearRowSelection();
//             this.clearCellSelection();
//             this.enableSelectMultiTouch = false;
//         }
//     }

//     /** 
//      * Deselects the currently selected rows.
//      * @return {void} 
//      */
//     public clearRowSelection(): void {
//         if (this.isRowSelected) {
//             let gObj: IGrid = this.parent;
//             let rows: Element[] = this.parent.getDataRows();
//             let data: Object[] = [];
//             let row: Element[] = [];
//             let mRow: Element[] = [];
//             let rowIndex: number[] = [];
//             let frzCols: number = gObj.getFrozenColumns();
//             let foreignKeyData: Object[] = [];
//             let target: Element = this.target;
//             let currentViewData: Object[] = this.parent.getCurrentViewRecords();

//             for (let i: number = 0, len: number = this.selectedRowIndexes.length; i < len; i++) {
//                 let currentRow: Element = this.parent.editSettings.mode === 'Batch' ?
//                     this.parent.getRows()[this.selectedRowIndexes[i]]
//                     : this.parent.getDataRows()[this.selectedRowIndexes[i]];
//                 let rowObj: Row<Column> = this.getRowObj(currentRow);
//                 if (rowObj) {
//                     data.push(rowObj.data);
//                     row.push(currentRow);
//                     rowIndex.push(this.selectedRowIndexes[i]);
//                     foreignKeyData.push(rowObj.foreignKeyData);
//                 }
//                 if (frzCols) {
//                     mRow.push(gObj.getMovableRows()[this.selectedRowIndexes[i]]);
//                 }
//             }
//             this.rowDeselect(events.rowDeselecting, rowIndex, data, row, foreignKeyData, target, mRow);
//             if (this.isCancelDeSelect === true) {
//                 return;
//             }
//             rows.filter((record: HTMLElement) => record.hasAttribute('aria-selected')).forEach((ele: HTMLElement) => {
//                 if (!this.disableUI) {
//                     ele.removeAttribute('aria-selected');
//                     this.addRemoveClassesForRow(ele, false, true, 'e-selectionbackground', 'e-active');
//                 }
//                 this.updatePersistCollection(ele, false);
//                 this.updateCheckBoxes(ele);
//             });
//             for (let i: number = 0, len: number = this.selectedRowIndexes.length; i < len; i++) {
//                 let movableRow: Element = this.getSelectedMovableRow(this.selectedRowIndexes[i]);
//                 if (movableRow) {
//                     if (!this.disableUI) {
//                         movableRow.removeAttribute('aria-selected');
//                         this.addRemoveClassesForRow(movableRow, false, true, 'e-selectionbackground', 'e-active');
//                     }
//                     this.updatePersistCollection(movableRow, false);
//                 }
//             }
//             this.selectedRowIndexes = [];
//             this.selectedRecords = [];
//             this.isRowSelected = false;
//             this.selectRowIndex(-1);
//             this.rowDeselect(events.rowDeselected, rowIndex, data, row, foreignKeyData, target, mRow);
//         }
//     }

//     private rowDeselect(
//         type: string, rowIndex: number[], data: Object, row: Element[],
//         foreignKeyData: Object[], target: Element, mRow?: Element[]): void {
//         let cancl: string = 'cancel';
//         this.updatePersistCollection(row[0], false);
//         let rowDeselectObj: Object = {
//             rowIndex: rowIndex, data: data, row: row, foreignKeyData: foreignKeyData,
//             cancel: false, target: target
//         };
//         this.parent.trigger(type, this.parent.getFrozenColumns() ? { ...rowDeselectObj, ...{ mRow: mRow } } : rowDeselectObj);
//         this.isCancelDeSelect = rowDeselectObj[cancl];
//         this.updateCheckBoxes(row[0]);
//     }

//     private getRowObj(row: Element | number = this.currentIndex): Row<Column> {
//         if (isNullOrUndefined(row)) { return {} as Row<Column>; }
//         if (typeof row === 'number') {
//             row = this.parent.getRowByIndex(row);
//         }
//         if (row) {
//             return this.parent.getRowObjectFromUID(row.getAttribute('data-uid')) || {} as Row<Column>;
//         }
//         return {} as Row<Column>;
//     }

//     private getSelectedMovableCell(cellIndex: IIndex): Element {
//         let gObj: IGrid = this.parent;
//         let frzCols: number = gObj.getFrozenColumns();
//         if (frzCols) {
//             if (cellIndex.cellIndex >= frzCols) {
//                 return gObj.getMovableCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
//             }
//             return null;
//         }
//         return null;
//     }

//     /**
//      * Selects a cell by the given index.
//      * @param  {IIndex} cellIndex - Defines the row and column indexes. 
//      * @param  {boolean} isToggle - If set to true, then it toggles the selection.
//      * @return {void}
//      */
//     public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
//         if (!this.isCellType()) { return; }
//         let gObj: IGrid = this.parent;
//         let selectedCell: Element = this.getSelectedMovableCell(cellIndex);
//         let args: Object;
//         let cncl: string = 'cancel';
//         if (!selectedCell) {
//             selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
//         }
//         let selectedTable: NodeListOf<Element>;
//         let cIdx: number;
//         this.currentIndex = cellIndex.rowIndex;
//         let selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
//         if (!this.isCellType() || !selectedCell || this.isEditing()) {
//             return;
//         }
//         let isCellSelected: boolean = selectedCell.classList.contains('e-cellselectionbackground');
//         isToggle = !isToggle ? isToggle : (!isUndefined(this.prevCIdxs) &&
//             cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
//             isCellSelected);

//         if (!isToggle) {
//             args = {
//                 data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
//                 isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
//                 previousRowCell: this.prevECIdxs ?
//                     this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
//                 cancel: false
//             };
//             this.onActionBegin(args, events.cellSelecting);
//         }
//         if (!isNullOrUndefined(args) && args[cncl] === true) {
//             return;
//         }
//         this.clearCell();
//         if (!isToggle) {
//             this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
//         }
//         this.updateCellProps(cellIndex, cellIndex);
//         if (!isToggle) {
//             this.onActionComplete(
//                 {
//                     data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
//                     previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
//                     previousRowCell: this.prevECIdxs ?
//                         this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
//                 },
//                 events.cellSelected);
//         }
//     }

//     private getCellIndex(rIdx: number, cIdx: number): Element {
//         return (this.parent.getFrozenColumns() ? (cIdx >= this.parent.getFrozenColumns() ? this.parent.getMovableCellFromIndex(rIdx, cIdx)
//             : this.parent.getCellFromIndex(rIdx, cIdx)) : this.parent.getCellFromIndex(rIdx, cIdx));
//     }

//     /**
//      * Selects a range of cells from start and end indexes. 
//      * @param  {IIndex} startIndex - Specifies the row and column's start index.
//      * @param  {IIndex} endIndex - Specifies the row and column's end index.
//      * @return {void}
//      */
//     public selectCellsByRange(startIndex: IIndex, endIndex?: IIndex): void {
//         if (!this.isCellType()) { return; }
//         let gObj: IGrid = this.parent;
//         let selectedCell: Element = this.getSelectedMovableCell(startIndex);
//         let frzCols: number = gObj.getFrozenColumns();
//         if (!selectedCell) {
//             selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
//         }
//         let min: number;
//         let max: number;
//         let stIndex: IIndex = startIndex;
//         let edIndex: IIndex = endIndex = endIndex ? endIndex : startIndex;
//         let cellIndexes: number[];
//         this.currentIndex = startIndex.rowIndex;
//         let cncl: string = 'cancel';
//         let selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
//         if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
//             return;
//         }
//         let args: Object = {
//             data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
//             isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
//             previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
//         };
//         this.onActionBegin(args, events.cellSelecting);
//         if (!isNullOrUndefined(args) && args[cncl] === true) {
//             return;
//         }
//         this.clearCell();
//         if (startIndex.rowIndex > endIndex.rowIndex) {
//             let temp: IIndex = startIndex;
//             startIndex = endIndex;
//             endIndex = temp;
//         }
//         for (let i: number = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
//             if (this.selectionSettings.cellSelectionMode.indexOf('Box') < 0) {
//                 min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
//                 max = i === endIndex.rowIndex ? (endIndex.cellIndex) : this.getLastColIndex(i);
//             } else {
//                 min = startIndex.cellIndex;
//                 max = endIndex.cellIndex;
//             }
//             cellIndexes = [];
//             for (let j: number = min < max ? min : max, len: number = min > max ? min : max; j <= len; j++) {
//                 if (frzCols) {
//                     if (j < frzCols) {
//                         selectedCell = gObj.getCellFromIndex(i, j);
//                     } else {
//                         selectedCell = gObj.getMovableCellFromIndex(i, j);
//                     }
//                 } else {
//                     selectedCell = gObj.getCellFromIndex(i, j);
//                 }
//                 if (!selectedCell) {
//                     continue;
//                 }
//                 cellIndexes.push(j);
//                 this.updateCellSelection(selectedCell);
//                 this.addAttribute(selectedCell);
//             }
//             this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
//         }
//         this.updateCellProps(stIndex, edIndex);
//         this.onActionComplete(
//             {
//                 data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
//                 previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
//                 previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
//             },
//             events.cellSelected);
//     }

//     /**
//      * Selects a collection of cells by row and column indexes. 
//      * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
//      * @return {void}
//      */
//     public selectCells(rowCellIndexes: ISelectedCell[]): void {
//         if (!this.isCellType()) { return; }
//         let gObj: IGrid = this.parent;
//         let selectedCell: Element = this.getSelectedMovableCell(rowCellIndexes[0]);
//         let frzCols: number = gObj.getFrozenColumns();
//         if (!selectedCell) {
//             selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
//         }
//         this.currentIndex = rowCellIndexes[0].rowIndex;
//         let selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
//         if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
//             return;
//         }
//         this.onActionBegin(
//             {
//                 data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
//                 currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
//                 isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
//                 previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
//             },
//             events.cellSelecting);
//         for (let i: number = 0, len: number = rowCellIndexes.length; i < len; i++) {
//             for (let j: number = 0, cellLen: number = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
//                 if (frzCols) {
//                     if (rowCellIndexes[i].cellIndexes[j] < frzCols) {
//                         selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
//                     } else {
//                         selectedCell = gObj.getMovableCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
//                     }
//                 } else {
//                     selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
//                 }
//                 if (!selectedCell) {
//                     continue;
//                 }
//                 this.updateCellSelection(selectedCell);
//                 this.addAttribute(selectedCell);
//                 this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
//             }
//         }
//         this.updateCellProps(
//             { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] },
//             { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
//         this.onActionComplete(
//             {
//                 data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
//                 currentCell: selectedCell,
//                 previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
//                 previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
//             },
//             events.cellSelected);
//     }

//     /**
//      * Select cells with existing cell selection by passing row and column index. 
//      * @param  {IIndex} startIndex - Defines the collection of row and column index.
//      * @return {void}
//      * @hidden
//      */
//     public addCellsToSelection(cellIndexes: IIndex[]): void {
//         if (!this.isCellType()) { return; }
//         let gObj: IGrid = this.parent;
//         let selectedTable: NodeListOf<Element>;
//         let cIdx: number;
//         let selectedCell: Element;
//         let frzCols: number = gObj.getFrozenColumns();
//         let index: number;
//         this.currentIndex = cellIndexes[0].rowIndex;
//         let selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
//         if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
//             return;
//         }
//         this.hideAutoFill();
//         let rowObj: Row<Column>;
//         if (frzCols && cellIndexes[0].cellIndex >= frzCols) {
//             rowObj = gObj.getMovableRowsObject()[cellIndexes[0].rowIndex];
//         } else {
//             rowObj = this.getRowObj(cellIndexes[0].rowIndex);
//         }
//         let foreignKeyData: Object[] = [];
//         for (let cellIndex of cellIndexes) {
//             for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
//                 if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
//                     index = i;
//                     break;
//                 }
//             }
//             selectedCell = this.getSelectedMovableCell(cellIndex);
//             if (!selectedCell) {
//                 selectedCell = gObj.getCellFromIndex(
//                     cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
//             }
//             foreignKeyData.push(rowObj.cells[frzCols && cellIndexes[0].cellIndex >= frzCols
//                 ? cellIndex.cellIndex - frzCols : cellIndex.cellIndex].foreignKeyData);
//             let args: Object = {
//                 data: selectedData, cellIndex: cellIndexes[0],
//                 isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
//                 currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
//                 previousRowCell: this.prevECIdxs ?
//                     gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
//             };
//             let isUnSelected: boolean = index > -1;
//             if (isUnSelected) {
//                 let selectedCellIdx: number[] = this.selectedRowCellIndexes[index].cellIndexes;
//                 if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
//                     this.cellDeselect(
//                         events.cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
//                         selectedData, [selectedCell], foreignKeyData);
//                     selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
//                     selectedCell.classList.remove('e-cellselectionbackground');
//                     selectedCell.removeAttribute('aria-selected');
//                     this.cellDeselect(
//                         events.cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
//                         selectedData, [selectedCell], foreignKeyData);
//                 } else {
//                     isUnSelected = false;
//                     this.onActionBegin(args, events.cellSelecting);
//                     this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
//                     this.updateCellSelection(selectedCell);
//                     this.addAttribute(selectedCell);
//                 }
//             } else {
//                 this.onActionBegin(args, events.cellSelecting);
//                 this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
//             }
//             this.updateCellProps(cellIndex, cellIndex);
//             if (!isUnSelected) {
//                 this.onActionComplete(
//                     {
//                         data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
//                         previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
//                             undefined, previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes
//                     },
//                     events.cellSelected);
//             }
//         }
//     }

//     private getColIndex(rowIndex: number, index: number): number {
//         let cells: NodeListOf<Element>;
//         let frzCols: number = this.parent.getFrozenColumns();
//         if (frzCols) {
//             if (index >= frzCols) {
//                 cells = this.parent.getMovableDataRows()[rowIndex] &&
//                         this.parent.getMovableDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
//             }
//         }
//         if (!cells) {
//             cells = this.parent.getDataRows()[rowIndex] &&
//                     this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
//         }
//         if (cells) {
//             for (let m: number = 0; m < cells.length; m++) {
//                 let colIndex: number = parseInt(cells[m].getAttribute('aria-colindex'), 10);
//                 if (colIndex === index) {
//                     if (frzCols) {
//                         if (index >= frzCols) {
//                             m += frzCols;
//                         }
//                     }
//                     return m;
//                 }
//             }
//         }
//         return -1;
//     }

//     private getLastColIndex(rowIndex: number): number {
//         let cells: NodeListOf<Element> =
//             this.parent.getFrozenColumns() ? this.parent.getMovableDataRows()[rowIndex].querySelectorAll('td.e-rowcell')
//                 : this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
//         return parseInt(cells[cells.length - 1].getAttribute('aria-colindex'), 10);
//     }

//     private clearCell(): void {
//         this.clearCellSelection();
//     }

//     private cellDeselect(type: string, cellIndexes: ISelectedCell[], data: Object, cells: Element[], foreignKeyData: Object[]): void {
//         let cancl: string = 'cancel';
//         if (cells[0] && cells[0].classList.contains('e-gridchkbox')) {
//             this.updateCheckBoxes(closest(cells[0], 'tr'));
//         }
//         let args: Object = {
//             cells: cells, data: data, cellIndexes: cellIndexes, foreignKeyData: foreignKeyData, cancel: false
//         };
//         this.parent.trigger(type, args);
//         this.isPreventCellSelect = args[cancl];
//     }

//     private updateCellSelection(selectedCell: Element, rowIndex?: number, cellIndex?: number): void {
//         if (!isNullOrUndefined(rowIndex)) {
//             this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
//         }
//         selectedCell.classList.add('e-cellselectionbackground');
//         if (selectedCell.classList.contains('e-gridchkbox')) {
//             this.updateCheckBoxes(closest(selectedCell, 'tr'), true);
//         }
//         this.addAttribute(selectedCell);
//     }

//     private addAttribute(cell: Element): void {
//         this.target = cell;
//         if (!isNullOrUndefined(cell)) {
//             cell.setAttribute('aria-selected', 'true');
//             if (!this.preventFocus) {
//                 this.focus.onClick({ target: cell }, true);
//             }
//         }
//     }

//     private updateCellProps(startIndex: IIndex, endIndex: IIndex): void {
//         this.prevCIdxs = startIndex;
//         this.prevECIdxs = endIndex;
//         this.isCellSelected = this.selectedRowCellIndexes.length && true;
//     }

//     private addRowCellIndex(rowCellIndex: IIndex): void {
//         let isRowAvail: boolean;
//         let index: number;
//         for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
//             if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
//                 isRowAvail = true;
//                 index = i;
//                 break;
//             }
//         }
//         if (isRowAvail) {
//             if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
//                 this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
//             }
//         } else {
//             this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
//         }

//     }

//     /** 
//      * Deselects the currently selected cells.
//      * @return {void} 
//      */
//     public clearCellSelection(): void {
//         if (this.isCellSelected) {
//             let gObj: IGrid = this.parent;
//             let selectedCells: Element[] = this.getSelectedCellsElement();
//             let rowCell: ISelectedCell[] = this.selectedRowCellIndexes;
//             let data: Object[] = [];
//             let cells: Element[] = [];
//             let foreignKeyData: Object[] = [];
//             let currentViewData: Object[] = this.getCurrentBatchRecordChanges();
//             let selectedTable: NodeListOf<Element>;
//             let frzCols: number = gObj.getFrozenColumns();

//             this.hideAutoFill();
//             for (let i: number = 0, len: number = rowCell.length; i < len; i++) {
//                 data.push(currentViewData[rowCell[i].rowIndex]);
//                 let rowObj: Row<Column> = this.getRowObj(rowCell[i].rowIndex);
//                 for (let j: number = 0, cLen: number = rowCell[i].cellIndexes.length; j < cLen; j++) {
//                     if (frzCols) {
//                         if (rowCell[i].cellIndexes[j] < frzCols) {
//                             cells.push(gObj.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
//                         } else {
//                             cells.push(gObj.getMovableCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
//                         }
//                     } else {
//                         if (rowObj.cells) {
//                             foreignKeyData.push(rowObj.cells[rowCell[i].cellIndexes[j]].foreignKeyData);
//                         }
//                         cells.push(gObj.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
//                     }
//                 }
//             }
//             this.cellDeselect(events.cellDeselecting, rowCell, data, cells, foreignKeyData);
//             if (this.isPreventCellSelect === true) {
//                 return;
//             }

//             for (let i: number = 0, len: number = selectedCells.length; i < len; i++) {
//                 selectedCells[i].classList.remove('e-cellselectionbackground');
//                 selectedCells[i].removeAttribute('aria-selected');
//             }
//             this.selectedRowCellIndexes = [];
//             this.isCellSelected = false;
//             this.cellDeselect(events.cellDeselected, rowCell, data, cells, foreignKeyData);
//         }
//     }

//     private getSelectedCellsElement(): Element[] {
//         let gObj: IGrid = this.parent;
//         let rows: Element[] = gObj.getDataRows();
//         let mRows: Element[];
//         if (gObj.getFrozenColumns()) {
//             mRows = gObj.getMovableDataRows();
//             rows = gObj.addMovableRows(rows as HTMLElement[], mRows as HTMLElement[]);
//         }
//         let cells: Element[] = [];
//         for (let i: number = 0, len: number = rows.length; i < len; i++) {
//             cells = cells.concat([].slice.call(rows[i].querySelectorAll('.e-cellselectionbackground')));
//         }
//         return cells;
//     }

//     private mouseMoveHandler(e: MouseEventArgs): void {
//         e.preventDefault();
//         let gBRect: ClientRect = this.parent.element.getBoundingClientRect();
//         let x1: number = this.x;
//         let y1: number = this.y;
//         let position: IPosition = getPosition(e);
//         let x2: number = position.x - gBRect.left;
//         let y2: number = position.y - gBRect.top;
//         let tmp: number;
//         let target: Element = closest(e.target as Element, 'tr');
//         this.isDragged = true;
//         if (!this.isCellDrag) {
//             if (!target) {
//                 target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
//             }
//             if (x1 > x2) {
//                 tmp = x2;
//                 x2 = x1;
//                 x1 = tmp;
//             }
//             if (y1 > y2) {
//                 tmp = y2;
//                 y2 = y1;
//                 y1 = tmp;
//             }
//             this.element.style.left = x1 + 'px';
//             this.element.style.top = y1 + 'px';
//             this.element.style.width = x2 - x1 + 'px';
//             this.element.style.height = y2 - y1 + 'px';
//         }
//         if (target && !e.ctrlKey && !e.shiftKey) {
//             let rowIndex: number = parseInt(target.getAttribute('aria-rowindex'), 10);
//             if (!this.isCellDrag) {
//                 this.hideAutoFill();
//                 this.selectRowsByRange(this.startDIndex, rowIndex);
//             } else {
//                 let td: Element = parentsUntil(e.target as HTMLElement, 'e-rowcell');
//                 if (td) {
//                     this.startAFCell = this.startCell;
//                     this.endAFCell = parentsUntil(e.target as Element, 'e-rowcell');
//                     this.selectLikeExcel(e, rowIndex, parseInt(td.getAttribute('aria-colindex'), 10));
//                 }
//             }
//         }
//     }

//     private selectLikeExcel(e: MouseEvent, rowIndex: number, cellIndex: number): void {
//         if (!this.isAutoFillSel) {
//             this.clearCellSelection();
//             this.selectCellsByRange(
//                 { rowIndex: this.startDIndex, cellIndex: this.startDCellIndex },
//                 { rowIndex: rowIndex, cellIndex: cellIndex });
//             this.drawBorders();
//         } else { //Autofill
//             this.showAFBorders();
//             this.selectLikeAutoFill(e);
//         }
//     }

//     private drawBorders(): void {
//         if (this.selectionSettings.cellSelectionMode === 'BoxWithBorder' && this.selectedRowCellIndexes.length && !this.parent.isEdit) {
//             if (!this.bdrBottom) {
//                 this.createBorders();
//             }
//             this.positionBorders();
//         } else {
//             this.hideBorders();
//         }
//     }

//     private positionBorders(): void {
//         this.updateStartEndCells();
//         if (!this.startCell || !this.bdrLeft || !this.selectedRowCellIndexes.length) {
//             return;
//         }
//         this.showBorders();
//         let stOff: ClientRect = this.startCell.getBoundingClientRect();
//         let endOff: ClientRect = this.endCell.getBoundingClientRect();
//         let parentOff: ClientRect = (this.startCell as HTMLElement).offsetParent.getBoundingClientRect();
//         this.bdrLeft.style.left = stOff.left - parentOff.left + 'px';
//         this.bdrLeft.style.top = stOff.top - parentOff.top + 'px';
//         this.bdrLeft.style.height = endOff.top - stOff.top > 0 ?
//             (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + 'px' : endOff.height + 'px';

//         this.bdrRight.style.left = endOff.left - parentOff.left + endOff.width + 'px';
//         this.bdrRight.style.top = this.bdrLeft.style.top;
//         this.bdrRight.style.height = this.bdrLeft.style.height;

//         this.bdrTop.style.left = this.bdrLeft.style.left;
//         this.bdrTop.style.top = this.bdrRight.style.top;
//         this.bdrTop.style.width = parseInt(this.bdrRight.style.left, 10) - parseInt(this.bdrLeft.style.left, 10) + 1 + 'px';

//         this.bdrBottom.style.left = this.bdrLeft.style.left;
//         this.bdrBottom.style.top = parseInt(this.bdrLeft.style.top, 10) + parseInt(this.bdrLeft.style.height, 10) + 'px';
//         this.bdrBottom.style.width = this.bdrTop.style.width;
//     }

//     private createBorders(): void {
//         if (!this.bdrLeft) {
//             this.bdrLeft = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrleft', styles: 'width: 2px;' }));
//             this.bdrRight = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrright', styles: 'width: 2px;' }));
//             this.bdrBottom = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrbottom', styles: 'height: 2px;' }));
//             this.bdrTop = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrtop', styles: 'height: 2px;' }));
//         }
//     }

//     private showBorders(): void {
//         if (this.bdrLeft) {
//             this.bdrLeft.style.display = '';
//             this.bdrRight.style.display = '';
//             this.bdrBottom.style.display = '';
//             this.bdrTop.style.display = '';
//         }
//     }

//     private hideBorders(): void {
//         if (this.bdrLeft) {
//             this.bdrLeft.style.display = 'none';
//             this.bdrRight.style.display = 'none';
//             this.bdrBottom.style.display = 'none';
//             this.bdrTop.style.display = 'none';
//         }
//     }

//     private drawAFBorders(): void {
//         if (!this.bdrAFBottom) {
//             this.createAFBorders();
//         }
//         this.positionAFBorders();
//     }

//     private positionAFBorders(): void {
//         if (!this.startCell || !this.bdrAFLeft) {
//             return;
//         }
//         this.showBorders();
//         let stOff: ClientRect = this.startAFCell.getBoundingClientRect();
//         let endOff: ClientRect = this.endAFCell.getBoundingClientRect();
//         let parentOff: ClientRect = (this.startAFCell as HTMLElement).offsetParent.getBoundingClientRect();
//         this.bdrAFLeft.style.left = stOff.left - parentOff.left + 'px';
//         this.bdrAFLeft.style.top = stOff.top - parentOff.top + 'px';
//         this.bdrAFLeft.style.height = endOff.top - stOff.top > 0 ?
//             (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + 'px' : endOff.height + 'px';

//         this.bdrAFRight.style.left = endOff.left - parentOff.left + endOff.width + 'px';
//         this.bdrAFRight.style.top = this.bdrAFLeft.style.top;
//         this.bdrAFRight.style.height = this.bdrAFLeft.style.height;

//         this.bdrAFTop.style.left = this.bdrAFLeft.style.left;
//         this.bdrAFTop.style.top = this.bdrAFRight.style.top;
//         this.bdrAFTop.style.width = parseInt(this.bdrAFRight.style.left, 10) - parseInt(this.bdrAFLeft.style.left, 10) + 1 + 'px';

//         this.bdrAFBottom.style.left = this.bdrAFLeft.style.left;
//         this.bdrAFBottom.style.top = parseInt(this.bdrAFLeft.style.top, 10) + parseInt(this.bdrAFLeft.style.height, 10) + 'px';
//         this.bdrAFBottom.style.width = this.bdrAFTop.style.width;
//     }

//     private createAFBorders(): void {
//         if (!this.bdrAFLeft) {
//             this.bdrAFLeft = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrafleft', styles: 'width: 2px;' }));
//             this.bdrAFRight = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrafright', styles: 'width: 2px;' }));
//             this.bdrAFBottom = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdrafbottom', styles: 'height: 2px;' }));
//             this.bdrAFTop = this.parent.getContentTable().parentElement.appendChild(
//                 createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_bdraftop', styles: 'height: 2px;' }));
//         }
//     }

//     private showAFBorders(): void {
//         if (this.bdrAFLeft) {
//             this.bdrAFLeft.style.display = '';
//             this.bdrAFRight.style.display = '';
//             this.bdrAFBottom.style.display = '';
//             this.bdrAFTop.style.display = '';
//         }
//     }

//     private hideAFBorders(): void {
//         if (this.bdrAFLeft) {
//             this.bdrAFLeft.style.display = 'none';
//             this.bdrAFRight.style.display = 'none';
//             this.bdrAFBottom.style.display = 'none';
//             this.bdrAFTop.style.display = 'none';
//         }
//     }

//     private updateValue(rIdx: number, cIdx: number, cell: HTMLElement): void {
//         let col: Column = this.parent.getColumnByIndex(cIdx);
//         if (this.parent.editModule && cell) {
//             if (col.type === 'number') {
//                 this.parent.editModule.updateCell(rIdx, col.field, parseInt(cell.textContent, 10));
//             } else {
//                 this.parent.editModule.updateCell(rIdx, col.field, cell.textContent);
//             }
//         }
//     }

//     /* tslint:disable-next-line:max-func-body-length */
//     private selectLikeAutoFill(e: MouseEvent, isApply?: boolean): void {
//         let startrowIdx: number = parseInt(parentsUntil(this.startAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
//         let startCellIdx: number = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10);
//         let endrowIdx: number = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
//         let endCellIdx: number = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
//         let rowLen: number = this.selectedRowCellIndexes.length - 1;
//         let colLen: number = this.selectedRowCellIndexes[0].cellIndexes.length - 1;
//         let col: Column;
//         switch (true) { //direction         
//             case !isApply && this.endAFCell.classList.contains('e-cellselectionbackground') &&
//                 !!parentsUntil(e.target as Element, 'e-rowcell')
//                 :
//                 this.startAFCell = this.parent.getCellFromIndex(startrowIdx, startCellIdx);
//                 this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, startCellIdx + colLen);
//                 this.drawAFBorders();
//                 break;
//             case startCellIdx + colLen < endCellIdx && //right
//                 endCellIdx - startCellIdx - colLen + 1 > endrowIdx - startrowIdx - rowLen // right bottom
//                 && endCellIdx - startCellIdx - colLen + 1 > startrowIdx - endrowIdx: //right top
//                 this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, endCellIdx);
//                 endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
//                 endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
//                 if (!isApply) {
//                     this.drawAFBorders();
//                 } else {
//                     let cellIdx: number = parseInt(this.endCell.getAttribute('aria-colindex'), 10);
//                     for (let i: number = startrowIdx; i <= endrowIdx; i++) {
//                         let cells: HTMLElement[] = [].slice.call(
//                             this.parent.getDataRows()[i].querySelectorAll('.e-cellselectionbackground'));
//                         let c: number = 0;
//                         for (let j: number = cellIdx + 1; j <= endCellIdx; j++) {
//                             if (c > colLen) {
//                                 c = 0;
//                             }
//                             this.updateValue(i, j, cells[c]);
//                             c++;
//                         }
//                     }
//                     this.selectCellsByRange(
//                         { rowIndex: startrowIdx, cellIndex: this.startCellIndex },
//                         { rowIndex: endrowIdx, cellIndex: endCellIdx });
//                 }
//                 break;
//             case startCellIdx > endCellIdx && // left
//                 startCellIdx - endCellIdx + 1 > endrowIdx - startrowIdx - rowLen && //left top
//                 startCellIdx - endCellIdx + 1 > startrowIdx - endrowIdx: // left bottom
//                 this.startAFCell = this.parent.getCellFromIndex(startrowIdx, endCellIdx);
//                 this.endAFCell = this.endCell;
//                 if (!isApply) {
//                     this.drawAFBorders();
//                 } else {
//                     for (let i: number = startrowIdx; i <= startrowIdx + rowLen; i++) {
//                         let cells: HTMLElement[] = [].slice.call(
//                             this.parent.getDataRows()[i].querySelectorAll('.e-cellselectionbackground'));
//                         cells.reverse();
//                         let c: number = 0;
//                         for (let j: number = this.startCellIndex - 1; j >= endCellIdx; j--) {
//                             if (c > colLen) {
//                                 c = 0;
//                             }
//                             this.updateValue(i, j, cells[c]);
//                             c++;
//                         }
//                     }
//                     this.selectCellsByRange(
//                         { rowIndex: startrowIdx, cellIndex: endCellIdx },
//                         { rowIndex: startrowIdx + rowLen, cellIndex: this.startCellIndex + colLen });
//                 }
//                 break;
//             case startrowIdx > endrowIdx: //up
//                 this.startAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx);
//                 this.endAFCell = this.endCell;
//                 if (!isApply) {
//                     this.drawAFBorders();
//                 } else {
//                     let trIdx: number = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
//                     let r: number = trIdx;
//                     for (let i: number = startrowIdx - 1; i >= endrowIdx; i--) {
//                         if (r === this.startIndex - 1) {
//                             r = trIdx;
//                         }
//                         let cells: HTMLElement[] = [].slice.call(
//                             this.parent.getDataRows()[r].querySelectorAll('.e-cellselectionbackground'));
//                         let c: number = 0;
//                         r--;
//                         for (let j: number = this.startCellIndex; j <= this.startCellIndex + colLen; j++) {
//                             this.updateValue(i, j, cells[c]);
//                             c++;
//                         }
//                     }
//                     this.selectCellsByRange(
//                         { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen },
//                         { rowIndex: startrowIdx + rowLen, cellIndex: startCellIdx });
//                 }
//                 break;
//             default:                //down
//                 this.endAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx + colLen);
//                 if (!isApply) {
//                     this.drawAFBorders();
//                 } else {
//                     let trIdx: number = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
//                     let r: number = this.startIndex;
//                     for (let i: number = trIdx + 1; i <= endrowIdx; i++) {
//                         if (r === trIdx + 1) {
//                             r = this.startIndex;
//                         }
//                         let cells: HTMLElement[] = [].slice.call(
//                             this.parent.getDataRows()[r].querySelectorAll('.e-cellselectionbackground'));
//                         r++;
//                         let c: number = 0;
//                         for (let m: number = this.startCellIndex; m <= this.startCellIndex + colLen; m++) {
//                             this.updateValue(i, m, cells[c]);
//                             c++;
//                         }
//                     }
//                     this.selectCellsByRange(
//                         { rowIndex: trIdx - rowLen, cellIndex: startCellIdx }, { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen });
//                 }
//                 break;
//         }
//     }

//     private mouseUpHandler(e: MouseEventArgs): void {
//         document.body.classList.remove('e-disableuserselect');
//         if (this.element) {
//             remove(this.element);
//         }
//         if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
//             this.mUPTarget = parentsUntil(e.target as Element, 'e-rowcell');
//         } else {
//             this.mUPTarget = null;
//         }
//         this.isDragged = false;
//         this.updateAutoFillPosition();
//         if (this.isAutoFillSel) {
//             this.startAFCell = this.startCell;
//             this.endAFCell = parentsUntil(e.target as Element, 'e-rowcell');
//             this.updateStartCellsIndex();
//             this.selectLikeAutoFill(e, true);
//             this.updateAutoFillPosition();
//             this.hideAFBorders();
//             this.positionBorders();
//             this.isAutoFillSel = false;
//         }
//         EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
//         EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
//     }

//     private hideAutoFill(): void {
//         if (this.autofill) {
//             this.autofill.style.display = 'none';
//         }
//     }
//     /**
//      * @hidden
//      */
//     public updateAutoFillPosition(): void {
//         if (this.parent.enableAutoFill && !this.parent.isEdit &&
//             this.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()
//             && this.selectedRowCellIndexes.length) {
//             let cells: Element[] = [].slice.call(this.parent.getDataRows()[
//                 this.selectedRowCellIndexes[
//                     this.selectedRowCellIndexes.length - 1].rowIndex].querySelectorAll('.e-cellselectionbackground'));
//             if (!this.parent.element.querySelector('#' + this.parent.element.id + '_autofill')) {
//                 this.autofill = this.parent.getContentTable().parentElement.appendChild(createElement(
//                     'div', { className: 'e-autofill', id: this.parent.element.id + '_autofill' }));
//             }
//             let cell: HTMLElement = cells[cells.length - 1] as HTMLElement;
//             if (cell && cell.offsetParent) {
//                 let clientRect: ClientRect = cell.getBoundingClientRect();
//                 let parentOff: ClientRect = cell.offsetParent.getBoundingClientRect();
//                 this.autofill.style.left = clientRect.left - parentOff.left + clientRect.width - 3 + 'px';
//                 this.autofill.style.top = clientRect.top - parentOff.top + clientRect.height - 3 + 'px';
//             }
//             this.autofill.style.display = '';
//         } else {
//             this.hideAutoFill();
//         }
//     }

//     private mouseDownHandler(e: MouseEventArgs): void {
//         let target: Element = e.target as Element;
//         let gObj: IGrid = this.parent;
//         let isDrag: boolean;
//         let gridElement: Element = parentsUntil(target, 'e-grid');
//         if (gridElement && gridElement.id !== gObj.element.id) {
//             return;
//         }
//         if (e.shiftKey || e.ctrlKey) {
//             e.preventDefault();
//         }
//         if (parentsUntil(target, 'e-rowcell') && !e.shiftKey && !e.ctrlKey) {

//             if (gObj.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
//                 this.isCellDrag = true;
//                 isDrag = true;
//             } else if (gObj.allowRowDragAndDrop) {
//                 if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
//                     this.isDragged = false;
//                     return;
//                 }
//                 isDrag = true;
//                 this.element = this.parent.createElement('div', { className: 'e-griddragarea' });
//                 gObj.getContent().appendChild(this.element);
//             }
//             if (isDrag) {
//                 this.enableDrag(e, true);
//             }
//         }
//         this.updateStartEndCells();
//         if (target.classList.contains('e-autofill')) {
//             this.isCellDrag = true;
//             this.isAutoFillSel = true;
//             this.enableDrag(e);
//         }
//     }

//     private updateStartEndCells(): void {
//         let cells: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
//         this.startCell = cells[0];
//         this.endCell = cells[cells.length - 1];
//         if (this.startCell) {
//             this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
//             this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
//         }
//     }

//     private updateStartCellsIndex(): void {
//         if (this.startCell) {
//             this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
//             this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
//         }
//     }

//     private enableDrag(e: MouseEventArgs, isUpdate?: boolean): void {
//         let gObj: IGrid = this.parent;

//         if (isUpdate) {
//             let tr: Element = closest(e.target as Element, 'tr');
//             this.startDIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
//             this.startDCellIndex = parseInt(parentsUntil(e.target as Element, 'e-rowcell').getAttribute('aria-colindex'), 10);
//         }

//         document.body.classList.add('e-disableuserselect');
//         let gBRect: ClientRect = gObj.element.getBoundingClientRect();
//         let postion: IPosition = getPosition(e);
//         this.x = postion.x - gBRect.left;
//         this.y = postion.y - gBRect.top;

//         EventHandler.add(gObj.getContent(), 'mousemove', this.mouseMoveHandler, this);
//         EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
//     }

//     private clearSelAfterRefresh(e: { requestType: string }): void {
//         if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
//             this.clearSelection();
//         }
//     }

//     /**
//      * @hidden
//      */
//     public addEventListener(): void {
//         if (this.parent.isDestroyed) { return; }
//         this.parent.on(events.uiUpdate, this.enableAfterRender, this);
//         this.parent.on(events.initialEnd, this.initializeSelection, this);
//         this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
//         this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
//         this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
//         this.parent.on(events.cellFocused, this.onCellFocused, this);
//         this.parent.on(events.beforeFragAppend, this.clearSelAfterRefresh, this);
//         this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
//         this.parent.on(events.contentReady, this.initialEnd, this);
//         this.actionBeginFunction = this.actionBegin.bind(this);
//         this.actionCompleteFunction = this.actionComplete.bind(this);
//         this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
//         this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
//         this.parent.on(events.rowsRemoved, this.rowsRemoved, this);
//         this.parent.on(events.headerRefreshed, this.refreshHeader, this);
//         this.addEventListener_checkbox();
//     }
//     /**
//      * @hidden
//      */
//     public removeEventListener(): void {
//         if (this.parent.isDestroyed) { return; }
//         this.parent.off(events.uiUpdate, this.enableAfterRender);
//         this.parent.off(events.initialEnd, this.initializeSelection);
//         this.parent.off(events.rowSelectionComplete, this.onActionComplete);
//         this.parent.off(events.cellSelectionComplete, this.onActionComplete);
//         this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
//         this.parent.off(events.cellFocused, this.onCellFocused);
//         this.parent.off(events.beforeFragAppend, this.clearSelAfterRefresh);
//         this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
//         this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
//         this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
//         this.parent.off(events.rowsRemoved, this.rowsRemoved);
//         this.parent.off(events.headerRefreshed, this.refreshHeader);
//         this.removeEventListener_checkbox();
//     }

//     private columnPositionChanged(): void {
//         if (!this.parent.isPersistSelection) {
//             this.clearSelection();
//         }
//     }

//     private refreshHeader(): void {
//         this.setCheckAllState();
//     }

//     private rowsRemoved(e: { records: Object[] }): void {
//         for (let i: number = 0; i < e.records.length; i++) {
//             delete (this.selectedRowState[e.records[i][this.primaryKey]]);
//             --this.totalRecordsCount;
//         }
//         this.setCheckAllState();
//     };

//     public beforeFragAppend(e: { requestType: string }): void {
//         if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
//             this.clearSelection();
//         }
//     };

//     private getCheckAllBox(): HTMLInputElement {
//         return this.parent.getHeaderContent().querySelector('.e-checkselectall') as HTMLInputElement;
//     }

//     private enableAfterRender(e: NotifyArgs): void {
//         if (e.module === this.getModuleName() && e.enable) {
//             this.render();
//         }
//     }

//     private render(e?: NotifyArgs): void {
//         EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
//     }

//     private onPropertyChanged(e: { module: string, properties: SelectionSettings }): void {
//         if (e.module !== this.getModuleName()) {
//             return;
//         }
//         let gObj: IGrid = this.parent;
//         if (!isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'Single') {
//             if (this.selectedRowCellIndexes.length > 1) {
//                 this.clearCellSelection();
//             }
//             if (this.selectedRowIndexes.length > 1) {
//                 this.clearRowSelection();
//             }
//             this.enableSelectMultiTouch = false;
//             this.hidePopUp();
//         }

//         if (!isNullOrUndefined(e.properties.mode) ||
//             !isNullOrUndefined(e.properties.cellSelectionMode)) {
//             this.clearSelection();
//         }
//         this.checkBoxSelectionChanged();
//         this.initPerisistSelection();
//         let checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
//         if (checkboxColumn.length) {
//             gObj.isCheckBoxSelection = !(this.selectionSettings.checkboxMode === 'ResetOnRowClick');
//         }
//         this.drawBorders();
//     }

//     private hidePopUp(): void {
//         if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
//             (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
//         }
//     }

//     private initialEnd(): void {
//         this.parent.off(events.contentReady, this.initialEnd);
//         this.selectRow(this.parent.selectedRowIndex);
//     }

//     private checkBoxSelectionChanged(): void {
//         this.parent.off(events.contentReady, this.checkBoxSelectionChanged);
//         let gobj: IGrid = this.parent;
//         let checkboxColumn: Column[] = gobj.getColumns().filter((col: Column) => col.type === 'checkbox');
//         if (checkboxColumn.length > 0) {
//             gobj.isCheckBoxSelection = true;
//             this.chkField = checkboxColumn[0].field;
//             this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
//             if (isNullOrUndefined(this.totalRecordsCount)) {
//                 this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
//             }
//             if (this.isSingleSel()) {
//                 gobj.selectionSettings.type = 'Multiple';
//                 gobj.dataBind();
//             } else {
//                 this.initPerisistSelection();
//             }
//         }
//         if (!gobj.isCheckBoxSelection) {
//             this.chkField = null;
//             this.initPerisistSelection();
//         }
//     }

//     private initPerisistSelection(): void {
//         let gobj: IGrid = this.parent;
//         if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
//             gobj.isPersistSelection = true;
//             this.ensureCheckboxFieldSelection();
//         } else if (this.parent.getPrimaryKeyFieldNames().length > 0) {
//             gobj.isPersistSelection = false;
//             this.ensureCheckboxFieldSelection();
//         } else {
//             gobj.isPersistSelection = false;
//             this.selectedRowState = {};
//         }
//     }

//     private ensureCheckboxFieldSelection(): void {
//         let gobj: IGrid = this.parent;
//         this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
//         if (!gobj.enableVirtualization && this.chkField
//             && ((gobj.isPersistSelection && Object.keys(this.selectedRowState).length === 0) ||
//                 !gobj.isPersistSelection)) {
//             let data: Data = this.parent.getDataModule();
//             let query: Query = new Query().where(this.chkField, 'equal', true);
//             let dataManager: Promise<Object> = data.getData({} as NotifyArgs, query);
//             let proxy: Selection = this;
//             this.parent.showSpinner();
//             dataManager.then((e: ReturnType) => {
//                 proxy.dataSuccess(e.result);
//                 proxy.refreshPersistSelection();
//                 proxy.parent.hideSpinner();
//             });
//         }
//     }

//     private dataSuccess(res: Object[]): void {
//         for (let i: number = 0; i < res.length; i++) {
//             if (isNullOrUndefined(this.selectedRowState[res[i][this.primaryKey]]) && res[i][this.chkField]) {
//                 this.selectedRowState[res[i][this.primaryKey]] = res[i][this.chkField];
//             }
//         }
//         this.persistSelectedData = res;
//     }

//     private setRowSelection(state: boolean): void {
//         if (!this.parent.getDataModule().isRemote()) {
//             if (state) {
//                 for (let data of this.getData()) {
//                     this.selectedRowState[data[this.primaryKey]] = true;
//                 }
//             } else {
//                 this.selectedRowState = {};
//             }

//             // (this.getData()).forEach(function (data) {
//             //     this.selectedRowState[data[this.primaryKey]] = true;
//             // })
//         }
//     }

//     private getData(): object[] {
//         return this.parent.getDataModule().dataManager.dataSource.json;
//     }

//     private refreshPersistSelection(): void {
//         let rows: Element[] = this.parent.getRows();
//         if (rows.length > 0 && (this.parent.isPersistSelection || this.chkField)) {
//             let indexes: number[] = [];
//             for (let j: number = 0; j < rows.length; j++) {
//                 let rowObj: Row<Column> = this.getRowObj(rows[j]);
//                 let pKey: string = rowObj ? rowObj.data[this.primaryKey] : null;
//                 if (pKey === null) { return; }
//                 let checkState: boolean;
//                 let chkBox: HTMLInputElement = (rows[j].querySelector('.e-checkselect') as HTMLInputElement);
//                 if (this.selectedRowState[pKey] || (this.parent.checkAllRows === 'Check' && this.chkAllCollec.indexOf(pKey) < 0)
//                     || (this.parent.checkAllRows === 'Uncheck' && this.chkAllCollec.indexOf(pKey) > 0)
//                     || (this.parent.checkAllRows === 'Intermediate' && !isNullOrUndefined(this.chkField) && rowObj.data[this.chkField])
//                 ) {
//                     indexes.push(parseInt(rows[j].getAttribute('aria-rowindex'), 10));
//                     checkState = true;
//                 } else {
//                     checkState = false;
//                     if (this.checkedTarget !== chkBox && this.parent.isCheckBoxSelection) {
//                         removeAddCboxClasses(chkBox.nextElementSibling as HTMLElement, checkState);
//                     }
//                 }
//                 this.updatePersistCollection(rows[j], checkState);
//             }
//             this.isSingleSel() && indexes.length > 0 ? this.selectRow(indexes[0], true) : this.selectRows(indexes);
//         }
//         if (this.parent.isCheckBoxSelection && this.getCurrentBatchRecordChanges().length > 0) {
//             this.setCheckAllState();
//         }
//     }


//     private actionBegin(e: { requestType: string }): void {
//         if (e.requestType === 'save' && this.parent.isPersistSelection) {
//             let editChkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
//             if (!isNullOrUndefined(editChkBox)) {
//                 let row: HTMLElement = closest(editChkBox, '.e-editedrow') as HTMLElement;
//                 if (row) {
//                     if (this.parent.editSettings.mode === 'Dialog') {
//                         row = this.parent.element.querySelector('.e-dlgeditrow') as HTMLElement;
//                     }
//                     let rowObj: Row<Column> = this.getRowObj(row);
//                     if (!rowObj) { return; }
//                     this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = editChkBox.checked;
//                 } else {
//                     this.isCheckedOnAdd = editChkBox.checked;
//                 }
//             }
//         }
//     }

//     private actionComplete(e: { requestType: string, action: string, selectedRow: number, data: Object[] }): void {
//         if (e.requestType === 'save' && this.parent.isPersistSelection) {
//             if (e.action === 'add' && this.isCheckedOnAdd) {
//                 let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
//                 this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = this.isCheckedOnAdd;
//             }
//             this.refreshPersistSelection();
//         }
//         if (e.requestType === 'delete' && this.parent.isPersistSelection) {
//             e.data.slice().forEach((data: Object) => {
//                 if (!isNullOrUndefined(data[this.primaryKey])) {
//                     this.updatePersistDelete(data[this.primaryKey]);
//                 }
//             });
//             this.setCheckAllState();
//             this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
//         }
//         if (e.requestType === 'paging') {
//             this.prevRowIndex = undefined;
//             this.prevCIdxs = undefined;
//             this.prevECIdxs = undefined;
//         }
//     }

//     private onDataBound(): void {
//         if (!this.parent.enableVirtualization && this.parent.isPersistSelection) {
//             this.refreshPersistSelection();
//         }
//     }

//     private checkSelectAllAction(checkState: boolean): void {
//         let cRenderer: IRenderer = this.getRenderer();
//         let editForm: HTMLFormElement = this.parent.element.querySelector('.e-gridform') as HTMLFormElement;
//         this.checkedTarget = this.getCheckAllBox();
//         if (checkState && this.getCurrentBatchRecordChanges().length) {
//             this.selectRowsByRange(
//                 cRenderer.getVirtualRowIndex(0),
//                 cRenderer.getVirtualRowIndex(this.getCurrentBatchRecordChanges().length));
//             this.parent.checkAllRows = 'Check';
//         } else {
//             this.clearSelection();
//             this.parent.checkAllRows = 'Uncheck';
//         }
//         this.chkAllCollec = [];
//         if (this.parent.isPersistSelection) {
//             let rows: Element[] = this.parent.getRows();
//             for (let i: number = 0; i < rows.length; i++) {
//                 this.updatePersistCollection(rows[i], checkState);
//             }
//             if (this.parent.checkAllRows === 'Uncheck') {
//                 this.setRowSelection(false);
//                 this.persistSelectedData = this.parent.getDataModule().isRemote() ? this.persistSelectedData : [];
//             } else if (this.parent.checkAllRows === 'Check') {
//                 this.setRowSelection(true);
//                 this.persistSelectedData = !this.parent.getDataModule().isRemote() ? this.getData().slice() : this.persistSelectedData;
//             }
//         }
//         if (!isNullOrUndefined(editForm)) {
//             let editChkBox: HTMLElement = editForm.querySelector('.e-edit-checkselect') as HTMLElement;
//             if (!isNullOrUndefined(editChkBox)) {
//             removeAddCboxClasses(editChkBox.nextElementSibling as HTMLElement, checkState);
//         }
//     }
// }

//     private checkSelectAll(checkBox: HTMLInputElement): void {
//         let stateStr: string = this.getCheckAllStatus(checkBox);
//         let state: boolean = stateStr === 'Check';
//         if (stateStr === 'Intermediate') {
//             state = this.getCurrentBatchRecordChanges().some((data: Object) =>
//                 data[this.primaryKey] in this.selectedRowState);
//         }
//         this.checkSelectAllAction(!state);
//         this.target = null;
//         if (this.getCurrentBatchRecordChanges().length > 0) {
//             this.setCheckAllState();
//         }
//         this.triggerChkChangeEvent(checkBox, !state);
//     }

//     private getCheckAllStatus(ele?: HTMLElement): CheckState {
//         let classes: DOMTokenList = ele ? ele.nextElementSibling.classList :
//             this.getCheckAllBox().nextElementSibling.classList;
//         let status: CheckState;
//         if (classes.contains('e-check')) {
//             status = 'Check';
//         } else if (classes.contains('e-uncheck')) {
//             status = 'Uncheck';
//         } else if (classes.contains('e-stop')) {
//             status = 'Intermediate';
//         } else {
//             status = 'None';
//         }
//         return status;
//     }

//     private checkSelect(checkBox: HTMLInputElement): void {
//         let target: HTMLElement = closest(this.checkedTarget, '.e-rowcell') as HTMLElement;
//         let checkObj: EJ2Intance = ((checkBox as HTMLElement) as EJ2Intance);
//         this.isMultiCtrlRequest = true;
//         let rIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
//         if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
//             ++rIndex;
//         }
//         this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
//         this.moveIntoUncheckCollection(closest(target, '.e-row') as HTMLElement);
//         this.setCheckAllState();
//         this.isMultiCtrlRequest = false;
//         this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'));
//     }

//     private moveIntoUncheckCollection(row: HTMLElement): void {
//         if (this.parent.checkAllRows === 'Check' || this.parent.checkAllRows === 'Uncheck') {
//             let rowObj: Row<Column> = this.getRowObj(row);
//             let pKey: string = rowObj && rowObj.data ? rowObj.data[this.primaryKey] : null;
//             if (!pKey) { return; }
//             if (this.chkAllCollec.indexOf(pKey) < 0) {
//                 this.chkAllCollec.push(pKey);
//             } else {
//                 this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
//             }
//         }
//     }

//     private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean): void {
//         this.parent.trigger(events.checkBoxChange, {
//             checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
//             target: checkBox
//         });
//         if (!this.parent.isEdit) {
//             this.checkedTarget = null;
//         }
//     }

//     private updateSelectedRowIndex(index?: number): void {
//         if (this.parent.isCheckBoxSelection && this.parent.enableVirtualization && !this.parent.getDataModule().isRemote()) {
//             if (this.parent.checkAllRows === 'Check') {
//                 this.selectedRowIndexes = [];
//                 for (let data: number = 0; data < this.getData().length; data++) {
//                     this.selectedRowIndexes.push(data);
//                 }
//             } else if (this.parent.checkAllRows === 'Uncheck') {
//                 this.selectedRowIndexes = [];
//             } else {
//                 if (index && this.parent.getRowByIndex(index).getAttribute('aria-selected') === 'false') {
//                     let selectedVal: number = this.selectedRowIndexes.indexOf(index);
//                     this.selectedRowIndexes.splice(selectedVal, 1);
//                 }
//             }
//         }
//     };

//     private setCheckAllState(index?: number, isInteraction?: boolean): void {
//         if (this.parent.isCheckBoxSelection || this.parent.selectionSettings.checkboxMode === 'ResetOnRowClick') {
//             let checkedLen: number = Object.keys(this.selectedRowState).length;
//             if (!this.parent.isPersistSelection) {
//                 checkedLen = this.selectedRecords.length;
//                 this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
//             }
//             if (this.getCheckAllBox()) {
//                 let spanEle: HTMLElement = this.getCheckAllBox().nextElementSibling as HTMLElement;
//                 removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
//                 if (checkedLen === this.totalRecordsCount && this.totalRecordsCount || (this.parent.enableVirtualization
//                     && !this.parent.allowPaging && !this.parent.getDataModule().isRemote() && checkedLen === this.getData().length)) {
//                     addClass([spanEle], ['e-check']);
//                     if (isInteraction) {
//                         this.getRenderer().setSelection(null, true, true);
//                     }
//                     this.parent.checkAllRows = 'Check';
//                 } else if (checkedLen === 0 || this.getCurrentBatchRecordChanges().length === 0) {
//                     addClass([spanEle], ['e-uncheck']);
//                     if (isInteraction) {
//                         this.getRenderer().setSelection(null, false, true);
//                     }
//                     this.parent.checkAllRows = 'Uncheck';
//                     if (checkedLen === 0 && this.getCurrentBatchRecordChanges().length === 0) {
//                         addClass([spanEle.parentElement], ['e-checkbox-disabled']);
//                     } else {
//                         removeClass([spanEle.parentElement], ['e-checkbox-disabled']);
//                     }
//                 } else {
//                     addClass([spanEle], ['e-stop']);
//                     this.parent.checkAllRows = 'Intermediate';
//                 }
//                 if (this.parent.enableVirtualization && !this.parent.allowPaging && !this.parent.getDataModule().isRemote()) {
//                     this.updateSelectedRowIndex(index);
//                 }
//             }
//         }
//     }

//     private clickHandler(e: MouseEvent): void {
//         let target: HTMLElement = e.target as HTMLElement;
//         this.actualTarget = target;
//         this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
//         this.isMultiShiftRequest = e.shiftKey;
//         this.popUpClickHandler(e);
//         let chkSelect: boolean = false;
//         this.preventFocus = true;
//         let checkBox: HTMLInputElement;
//         let checkWrap: HTMLElement = parentsUntil(target, 'e-checkbox-wrapper') as HTMLElement;
//         if (checkWrap && checkWrap.querySelectorAll('.e-checkselect,.e-checkselectall').length > 0) {
//             checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
//             chkSelect = true;
//         }
//         this.drawBorders();
//         target = parentsUntil(target, 'e-rowcell') as HTMLElement;
//         if ((target && target.parentElement.classList.contains('e-row') && !this.parent.selectionSettings.checkboxOnly) || chkSelect) {
//             if (this.parent.isCheckBoxSelection) {
//                 this.isMultiCtrlRequest = true;
//             }
//             this.target = target;
//             if (!isNullOrUndefined(checkBox)) {
//                 this.checkedTarget = checkBox;
//                 if (checkBox.classList.contains('e-checkselectall')) {
//                     this.checkSelectAll(checkBox);
//                 } else {
//                     this.checkSelect(checkBox);
//                 }
//             } else {
//                 let rIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
//                 if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
//                     ++rIndex;
//                 }
//                 if (!this.mUPTarget || !this.mUPTarget.isEqualNode(target)) {
//                     this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
//                 }
//                 if (this.parent.isCheckBoxSelection) {
//                     this.moveIntoUncheckCollection(closest(target, '.e-row') as HTMLElement);
//                     this.setCheckAllState();
//                 }
//             }
//             if (!this.parent.isCheckBoxSelection && Browser.isDevice && !this.isSingleSel()) {
//                 this.showPopup(e);
//             }
//         }
//         this.isMultiCtrlRequest = false;
//         this.isMultiShiftRequest = false;
//         this.preventFocus = false;

//     }

//     private popUpClickHandler(e: MouseEvent): void {
//         let target: Element = e.target as Element;
//         if (closest(target, '.e-headercell') || (e.target as HTMLElement).classList.contains('e-rowcell') ||
//             closest(target, '.e-gridpopup')) {
//             if (target.classList.contains('e-rowselect')) {
//                 if (!target.classList.contains('e-spanclicked')) {
//                     target.classList.add('e-spanclicked');
//                     this.enableSelectMultiTouch = true;
//                 } else {
//                     target.classList.remove('e-spanclicked');
//                     this.enableSelectMultiTouch = false;
//                     (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
//                 }
//             }
//         } else {
//             (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
//         }
//         if((e.target as HTMLElement).classList.contains('e-link') && (e.target as HTMLElement).classList.contains('e-numericitem')) {
//             if(!(this.selectionSettings.persistSelection)) {
//                 this.clearRow();
//             }
//         }
//     }

//     private showPopup(e: MouseEvent): void {
//         if (!this.selectionSettings.enableSimpleMultiRowSelection) {
//             setCssInGridPopUp(
//                 <HTMLElement>this.parent.element.querySelector('.e-gridpopup'), e,
//                 'e-rowselect e-icons e-icon-rowselect' +
//                 (!this.isSingleSel() && (this.selectedRecords.length > (this.parent.getFrozenColumns() ? 2 : 1)
//                     || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
//         }
//     }

//     private rowCellSelectionHandler(rowIndex: number, cellIndex: number): void {
//         if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
//             if (!this.isDragged) {
//                 this.selectRow(rowIndex, this.selectionSettings.enableToggle);
//             }
//             this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, this.selectionSettings.enableToggle);
//             if (this.selectedRowCellIndexes.length) {
//                 this.updateAutoFillPosition();
//             }
//             this.drawBorders();
//         } else if (this.isMultiShiftRequest) {
//             if (this.parent.isCheckBoxSelection || (!this.parent.isCheckBoxSelection &&
//                 !closest(this.target, '.e-rowcell').classList.contains('e-gridchkbox'))) {
//                 this.selectRowsByRange(isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
//             } else {
//                 this.addRowsToSelection([rowIndex]);
//             }
//             this.selectCellsByRange(
//                 isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs,
//                 { rowIndex: rowIndex, cellIndex: cellIndex });
//             this.updateAutoFillPosition();
//             this.drawBorders();
//         } else {
//             this.addRowsToSelection([rowIndex]);
//             this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
//             this.hideBorders();
//         }
//         this.isDragged = false;
//     }

//     private onCellFocused(e: CellFocusArgs): void {
//         if (this.parent.frozenRows && e.container.isHeader && e.byKey) {
//             if (e.keyArgs.action === 'upArrow') {
//                 if (this.parent.allowFiltering) {
//                     e.isJump = e.element.tagName === 'INPUT' ? true : false;
//                 } else {
//                     e.isJump = e.element.tagName === 'TH' ? true : false;
//                 }
//             } else {
//                 if (e.keyArgs.action === 'downArrow') {
//                     let rIdx: number = Number(e.element.parentElement.getAttribute('aria-rowindex'));
//                     e.isJump = rIdx === 0 ? true : false;
//                 } else {
//                     if (e.keyArgs.action === 'ctrlHome') {
//                         e.isJump = true;
//                     }
//                 }
//             }
//         }
//         let clear: boolean = this.parent.getFrozenColumns() ? (((e.container.isHeader && e.element.tagName !== 'TD' && e.isJump) ||
//             ((e.container.isContent || e.element.tagName === 'TD') && !(e.container.isSelectable || e.element.tagName === 'TD')))
//             && !(e.byKey && e.keyArgs.action === 'space')) : ((e.container.isHeader && e.isJump) ||
//                 (e.container.isContent && !e.container.isSelectable)) && !(e.byKey && e.keyArgs.action === 'space');
//         let headerAction: boolean = (e.container.isHeader && e.element.tagName !== 'TD' && !closest(e.element, '.e-rowcell'))
//             && !(e.byKey && e.keyArgs.action === 'space');
//         if (!e.byKey || clear) {
//             if (clear && !this.parent.isCheckBoxSelection) { this.clearSelection(); }
//             return;
//         }
//         let [rowIndex, cellIndex]: number[] = e.container.isContent ? e.container.indexes : e.indexes;
//         let prev: IIndex = this.focus.getPrevIndexes();
//         if (this.parent.frozenRows) {
//             if (e.container.isHeader && (e.element.tagName === 'TD' || closest(e.element, '.e-rowcell'))) {
//                 let thLen: number = this.parent.getHeaderTable().querySelector('thead').childElementCount;
//                 rowIndex -= thLen;
//                 prev.rowIndex = prev.rowIndex ? prev.rowIndex - thLen : null;
//             } else {
//                 rowIndex += this.parent.frozenRows;
//                 prev.rowIndex = prev.rowIndex === 0 || !isNullOrUndefined(prev.rowIndex) ? prev.rowIndex + this.parent.frozenRows : null;
//             }
//         }
//         if (this.parent.getFrozenColumns()) {
//             let cIdx: number = Number(e.element.getAttribute('aria-colindex'));
//             prev.cellIndex = prev.cellIndex ? (prev.cellIndex === cellIndex ? cIdx : cIdx - 1) : null;
//             cellIndex = cIdx;
//         }
//         if (headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 && e.keyArgs.action !== 'space' &&
//             rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) { return; }
//         this.preventFocus = true;
//         switch (e.keyArgs.action) {
//             case 'downArrow':
//             case 'upArrow':
//             case 'enter':
//             case 'shiftEnter':
//                 this.applyDownUpKey(rowIndex, cellIndex);
//                 break;
//             case 'rightArrow':
//             case 'leftArrow':
//                 this.applyRightLeftKey(rowIndex, cellIndex);
//                 break;
//             case 'shiftDown':
//             case 'shiftUp':
//                 this.shiftDownKey(rowIndex, cellIndex);
//                 break;
//             case 'shiftLeft':
//             case 'shiftRight':
//                 this.applyShiftLeftRightKey(rowIndex, cellIndex);
//                 break;
//             case 'home':
//             case 'end':
//                 cellIndex = e.keyArgs.action === 'end' ? this.getLastColIndex(rowIndex) : 0;
//                 this.applyHomeEndKey(rowIndex, cellIndex);
//                 break;
//             case 'ctrlHome':
//             case 'ctrlEnd':
//                 this.applyCtrlHomeEndKey(rowIndex, cellIndex);
//                 break;
//             case 'escape':
//                 this.clearSelection();
//                 break;
//             case 'ctrlPlusA':
//                 this.ctrlPlusA();
//                 break;
//             case 'space':
//                 this.applySpaceSelection(e.element as HTMLElement);
//                 break;
//         }
//         this.preventFocus = false;
//         this.positionBorders();
//         this.updateAutoFillPosition();
//     }

//     /**
//      * Apply ctrl + A key selection
//      * @return {void}
//      * @hidden
//      */
//     public ctrlPlusA(): void {
//         if (this.isRowType() && !this.isSingleSel()) {
//             this.selectRowsByRange(0, this.parent.getRows().length - 1);
//         }
//         if (this.isCellType() && !this.isSingleSel()) {
//             this.selectCellsByRange(
//                 { rowIndex: 0, cellIndex: 0 },
//                 { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
//         }
//     }

//     private applySpaceSelection(target: HTMLElement): void {
//         if (target.classList.contains('e-checkselectall')) {
//             this.checkedTarget = target as HTMLInputElement;
//             this.checkSelectAll(this.checkedTarget);
//         } else {
//             if (target.classList.contains('e-checkselect')) {
//                 this.checkedTarget = target as HTMLInputElement;
//                 this.checkSelect(this.checkedTarget);
//             }
//         }
//     }

//     private applyDownUpKey(rowIndex?: number, cellIndex?: number): void {
//         let gObj: IGrid = this.parent;
//         if (this.parent.isCheckBoxSelection && this.parent.checkAllRows === 'Check' && !this.selectionSettings.persistSelection) {
//             this.checkSelectAllAction(false);
//             this.checkedTarget = null;
//         }
//         if (this.isRowType()) {
//             if (this.parent.frozenRows) {
//                 this.selectRow(rowIndex, true);
//                 this.applyUpDown(gObj.selectedRowIndex);
//             } else {
//                 this.selectRow(rowIndex, true);
//                 this.applyUpDown(gObj.selectedRowIndex);
//             }
//         }
//         if (this.isCellType()) {
//             this.selectCell({ rowIndex, cellIndex }, true);
//         }
//     }

//     private applyUpDown(rowIndex: number): void {
//         if (rowIndex < 0) { return; }
//         if (!this.target) {
//             this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
//         }
//         let cIndex: number = parseInt(this.target.getAttribute('aria-colindex'), 10);
//         let frzCols: number = this.parent.getFrozenColumns();
//         if (frzCols) {
//             if (cIndex >= frzCols) {
//                 this.target =
//                     this.contentRenderer.getMovableRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex - frzCols];
//             } else {
//                 this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
//             }
//         } else {
//             this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
//         }
//         this.addAttribute(this.target);
//     }

//     private applyRightLeftKey(rowIndex?: number, cellIndex?: number): void {
//         let gObj: IGrid = this.parent;
//         if (this.isCellType()) {
//             this.selectCell({ rowIndex, cellIndex }, true);
//             this.addAttribute(this.target);
//         }
//     }

//     private applyHomeEndKey(rowIndex?: number, cellIndex?: number): void {
//         if (this.isCellType()) {
//             this.selectCell({ rowIndex, cellIndex }, true);
//         } else {
//             this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
//         }
//     }

//     /**
//      * Apply shift+down key selection
//      * @return {void}
//      * @hidden
//      */
//     public shiftDownKey(rowIndex?: number, cellIndex?: number): void {
//         let gObj: IGrid = this.parent;
//         this.isMultiShiftRequest = true;
//         if (this.isRowType() && !this.isSingleSel()) {
//             if (!isUndefined(this.prevRowIndex)) {
//                 this.selectRowsByRange(this.prevRowIndex, rowIndex);
//                 this.applyUpDown(rowIndex);
//             } else {
//                 this.selectRow(0, true);
//             }
//         }
//         if (this.isCellType() && !this.isSingleSel()) {
//             this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex, cellIndex });
//         }
//         this.isMultiShiftRequest = false;
//     }

//     private applyShiftLeftRightKey(rowIndex?: number, cellIndex?: number): void {
//         let gObj: IGrid = this.parent;
//         this.isMultiShiftRequest = true;
//         this.selectCellsByRange(this.prevCIdxs, { rowIndex, cellIndex });
//         this.isMultiShiftRequest = false;
//     }

//     private applyCtrlHomeEndKey(rowIndex: number, cellIndex: number): void {
//         if (this.isRowType()) {
//             this.selectRow(rowIndex, true);
//             this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
//         }
//         if (this.isCellType()) {
//             this.selectCell({ rowIndex, cellIndex }, true);
//         }
//     }


//     private addRemoveClassesForRow(row: Element, isAdd: boolean, clearAll: boolean, ...args: string[]): void {
//         if (row) {
//             let cells: Element[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
//             let detailIndentCell: Element = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
//             let dragdropIndentCell: Element = row.querySelector('.e-rowdragdrop');
//             if (detailIndentCell) { cells.push(detailIndentCell); }
//             if (dragdropIndentCell) { cells.push(dragdropIndentCell); }
//             addRemoveActiveClasses(cells, isAdd, ...args);
//         }
//         this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
//     }

//     private isRowType(): boolean {
//         return this.selectionSettings.mode === 'Row' || this.selectionSettings.mode === 'Both';
//     }

//     private isCellType(): boolean {
//         return this.selectionSettings.mode === 'Cell' || this.selectionSettings.mode === 'Both';
//     }

//     private isSingleSel(): boolean {
//         return this.selectionSettings.type === 'Single';
//     }

//     private getRenderer(): IRenderer {
//         if (isNullOrUndefined(this.contentRenderer)) {
//             this.contentRenderer = this.factory.getRenderer(RenderType.Content);
//         }
//         return this.contentRenderer;
//     }

//     /**
//      * Gets the collection of selected records. 
//      * @return {Object[]}
//      */
//     public getSelectedRecords(): Object[] {
//         let selectedData: Object[] = [];
//         if (!this.selectionSettings.persistSelection) {
//             selectedData = (<Row<Column>[]>this.parent.getRowsObject()).filter((row: Row<Column>) => row.isSelected)
//                 .map((m: Row<Column>) => m.data);
//         } else {
//             selectedData = this.persistSelectedData;
//         }
//         return selectedData;
//     }

//     private addEventListener_checkbox(): void {
//         this.parent.on(events.dataReady, this.dataReady, this);
//         this.onDataBoundFunction = this.onDataBound.bind(this);
//         this.parent.addEventListener(events.dataBound, this.onDataBoundFunction);
//         this.parent.on(events.contentReady, this.checkBoxSelectionChanged, this);
//         this.actionCompleteFunc = this.actionCompleteHandler.bind(this);
//         this.parent.addEventListener(events.actionComplete, this.actionCompleteFunc);
//         this.parent.on(events.click, this.clickHandler, this);
//         this.resizeEndFn = () => {
//             this.updateAutoFillPosition();
//             this.drawBorders();
//         };
//         this.resizeEndFn.bind(this);
//         this.parent.addEventListener(events.resizeStop, this.resizeEndFn);
//     }

//     public removeEventListener_checkbox(): void {
//         this.parent.off(events.dataReady, this.dataReady);
//         this.parent.removeEventListener(events.dataBound, this.onDataBoundFunction);
//         this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunc);
//         this.parent.off(events.click, this.clickHandler);
//     }

//     public dataReady(e: { requestType: string }): void {
//         if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
//             this.disableUI = true;
//             this.clearSelection();
//             this.disableUI = false;
//         }
//     }

//     private actionCompleteHandler(e: { requestType: string, action: string, selectedRow: number }): void {
//         if (e.requestType === 'save' && this.parent.isPersistSelection) {
//             this.refreshPersistSelection();
//         }
//     }

//     private selectRowIndex(index: number): void {
//         this.parent.isSelectedRowIndexUpdating = true;
//         this.parent.selectedRowIndex = index;
//     }

// }
