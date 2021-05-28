import * as ReactDOM from 'react-dom';
import * as React from 'react';
import swal from 'sweetalert2';
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ToggleComponent from "./components/ToggleComponent";

class detailItem {
	parent: string;
	key: string;
	value: string;
}

class selState {
	label: string;
	text: string;
	total: number;
	actual: number;
}

export class AssociationTableControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Global Variables
	private _context: ComponentFramework.Context<IInputs>;
	private _container: HTMLDivElement;
	private _mainContainer: HTMLDivElement;
	private _unorderedList: HTMLUListElement;
	private _errorLabel: HTMLLabelElement;
	public _defaultFilter: string;
	public _filter: string;
	private _entityName: string;
	private _selectorLabel: string;
	public _selValues: detailItem[];
	public _values: string[];
	private _checkBoxChanged: EventListenerOrEventListenerObject;
	private _notifyOutputChanged: () => void;
	private _togglePanel: HTMLDivElement;
	private _itemList: detailItem[];
	private _selStates: selState[];
	private _showToggle = false;

	constructor()
	{

	}

	public async init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._context = context;
		this._container = container;
		this._mainContainer = document.createElement("div");
		this._unorderedList = document.createElement("ul");
		this._errorLabel = document.createElement("label");
		this._unorderedList.classList.add("ks-cboxtags");
		this._mainContainer.classList.add("multiselect-container");
		this._itemList = [];

		if (this._context.parameters.visibilityToggle.raw != null) {
			this._showToggle = this._context.parameters.visibilityToggle.raw == "1" ? true : false;
		}

		if (this._context.parameters.defaultFilter.raw != null) {
			this._defaultFilter = this._context.parameters.defaultFilter.raw;
		}

		//Trigger function on check-box change.
		this._notifyOutputChanged = notifyOutputChanged;
		this._checkBoxChanged = this.checkBoxChanged.bind(this);
		this._selStates = [];

		// @ts-ignore
		if (Xrm.Page.ui.getFormType() !== 1) {
			await this.getRelatedRecords();
		}
	}

	public async updateView(context: ComponentFramework.Context<IInputs>)
	{
		// Add code to update control view
		this._context = context;

		//Check that the entityId value has been updated before refreshing the control
		if (context.updatedProperties != null && context.updatedProperties.length != 0) {
			if (context.updatedProperties[context.updatedProperties.length - 1] == "entityId" || context.updatedProperties[context.updatedProperties.length - 1] == "IsControlDisabled") {
				await this.getRecords();
			}
		}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. canceling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	public async getRelatedRecords() {
	try {
		var list = [];
		// @ts-ignore
		var contextInfo = this._context.mode.contextInfo;
		var recordId = contextInfo.entityId;
		var lookupTo = this._context.parameters.lookuptoAssociatedTable.raw!.toLowerCase();
		var lookupFrom = this._context.parameters.lookuptoCurrentTable.raw!.toLowerCase();
		var result = await this._context.webAPI.retrieveMultipleRecords(this._context.parameters.associationTable.raw!, '?$select= _' + lookupTo + '_value&$filter=_' + lookupFrom + '_value eq ' + recordId);
		for (var i = 0; i < result.entities.length; i++) {
			var temp = result.entities[i]["_" + lookupTo + "_value"];
			list.push(temp);
			var cItem = this._itemList.find((e => e.key === temp));
			var cState = this._selStates.findIndex(e => e.text === cItem?.parent);
			if (cState !== -1) {
				this._selStates[cState].actual++;
			}
		}
		this._values = list;
		await this.getRecords();
		} catch(error) { 
			swal.fire("getRelatedRecords", "Error:" + error.message, "error");
		}
	}

	//Called to retrieve records to display, both on-load and on-change of lookup
	public async getRecords() {
	try {
		this._container.innerHTML = "";
		this._mainContainer.innerHTML = "";
		this._unorderedList.innerHTML = "";
		if (this._showToggle) {
			this._togglePanel = document.createElement("div");
			this._togglePanel.style.float = "right";
			var toggleProps = {
				visible: true,
				onChangeResult: this.showHideControl.bind(this)
			}

			ReactDOM.render(React.createElement(ToggleComponent, toggleProps), this._togglePanel);
			this._mainContainer.appendChild(this._togglePanel);
		}
		//Check if table name variable contains data
		if (this._context.parameters.selectorTable.raw != null && this._context.parameters.selectorTable.raw != "") {
			this._entityName = this._context.parameters.selectorTable.raw;
		}
		//Check if field name contains data
		if (this._context.parameters.selectorLabel.raw != null && this._context.parameters.selectorLabel.raw != "") {
			this._selectorLabel = this._context.parameters.selectorLabel.raw;
		}
		this._filter = "?$select=" + this._selectorLabel + "," + this._entityName + "id" + "&$orderby=" + this._selectorLabel + " asc";
		//Default Filter 
		if (this._defaultFilter !== undefined && this._defaultFilter !== "") {
			this._filter += "&$filter=" + this._defaultFilter;
		}
		var records = await this._context.webAPI.retrieveMultipleRecords(this._entityName, this._filter);
		for (var i = 0; i < records.entities.length; i++) {
			var newChkBox = document.createElement("input");
			var newLabel = document.createElement("label");
			var newUList = document.createElement("li");

			newChkBox.type = "checkbox";
			newChkBox.id = records.entities[i][this._entityName + "id"];
			newChkBox.name = records.entities[i][this._selectorLabel];
			newChkBox.value = records.entities[i][this._entityName + "id"];
			if (this._values != undefined) {
				if (this._values.includes(newChkBox.id)) {
					newChkBox.checked = true;
				}
			}
			newChkBox.addEventListener("change", this._checkBoxChanged);
			newLabel.innerHTML = records.entities[i][this._selectorLabel];
			newLabel.htmlFor = records.entities[i][this._entityName + "id"];
			newUList.appendChild(newChkBox);
			newUList.appendChild(newLabel);
			this._unorderedList.appendChild(newUList);
		}
		this._mainContainer.appendChild(this._unorderedList);
		this._mainContainer.appendChild(this._errorLabel);
		this._container.appendChild(this._mainContainer);

		} catch(error) {
			swal.fire("getRecords", "Error:" + error.message, "error");
		}
	}
	
	public async checkBoxChanged(evnt: Event) {
	try {
		var targetInput = <HTMLInputElement>evnt.target;
		// @ts-ignore
		var contextInfo = this._context.mode.contextInfo;
		var recordId = contextInfo.entityId;
		var thisEntity = contextInfo.entityTypeName;
		var thatEntity = this.getEntityPluralName(this._entityName);
		var thisEntityPlural = this.getEntityPluralName(thisEntity);
		var associationTable = this._context.parameters.associationTable.raw!;
		var lookupFieldTo = this._context.parameters.lookuptoAssociatedTable.raw!;
		var lookupFieldFrom = this._context.parameters.lookuptoCurrentTable.raw!;
		var lookupToLower = lookupFieldTo.toLowerCase();
		var lookupFromLower = lookupFieldFrom.toLowerCase();
		var lookupDataTo = lookupFieldTo + "@odata.bind";
		var lookupDataFrom = lookupFieldFrom + "@odata.bind";
		var selectorLabel = this._context.parameters.selectorLabel.raw!;

		var data =
		{
			selectorLabel: targetInput.name,
			[lookupDataTo]: "/" + thatEntity + "(" + targetInput.id + ")",
			[lookupDataFrom]: "/" + thisEntityPlural + "(" + recordId + ")"
		}
		var actual = 0;
		var cState = this._selStates.findIndex(e => e.text === targetInput.value);
		if (cState !== -1)
			actual = this._selStates[cState].actual;

		if (targetInput.checked) {
			await this._context.webAPI.createRecord(associationTable, data);
			actual++;
		}
		else {
			await this.deleteRecord(associationTable, lookupToLower, targetInput.id, lookupFromLower, recordId);
			actual--;
		}
	
		this._notifyOutputChanged();
		} catch (error) {
			swal.fire("checkBoxChanged", "Error:" + error.message , "error");
		}
	}

	//Async delete record process called when a check-box is unchecked
	private async deleteRecord(associationTable: string, lookupToLower: string, targetInput: string, lookupFromLower: string, recordId: string) {
		let _this = this;
		try {
			var result = await this._context.webAPI.retrieveMultipleRecords(associationTable, '?$select=' + associationTable + 'id&$filter=_' + lookupToLower + '_value eq ' + targetInput + ' and _' + lookupFromLower + '_value eq ' + recordId)
			for (var i = 0; i < result.entities.length; i++) {
				var linkRecordId = result.entities[i][associationTable + 'id'];
			}
			_this._context.webAPI.deleteRecord(associationTable, linkRecordId)
		} catch(error) { 
			swal.fire("deleteRecord", "Error:" + error.message, "error");
		}
	}

	public async showHideControl(show: boolean) {
	try {
		var display = "inline";
		if (show === false) {
			display = "none";
		}
		this._unorderedList.style.display = display;
		} catch (error) {
			swal.fire("showHideControl", "Error:" + error.message, "error");
		}
	}
	
	public async refreshItems() {
	try {
		await this.getRecords();
		return true;
		} catch (error) {
			swal.fire("refreshItems", "Error:" + error.message, "error");
		}
	}

	//Retrieve plural name of a table
	private getEntityPluralName(entityName: string): string {
		if (entityName.endsWith("s"))
			return entityName + "es";
		else if (entityName.endsWith("y"))
			return entityName.slice(0, entityName.length - 1) + "ies";
		else
			return entityName + "s";
	}
}