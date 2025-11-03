sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/ValueState"
], function (JSONModel, Device, ODataModel, ValueState) {
	"use strict";
	return {
		/*	Method: createDeviceModel
		 *	Description/Usage: create internal device model
		 */
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		// method to display date in user profile format added by Komal on 12/11/2024
		createDateFormatModel: function () {
			var oModel = new JSONModel();
			oModel.setData({
				dateFormat: ""
			})
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		/*	Method: createAppModeModel
		 *	Description/Usage: create internal app mode model
		 */
		createAppModeModel: function () {
			var omModel = new JSONModel();
			var mItem = {
				"valuateFlag": false, "CurrentlyChanged": false, "Username": "", "enabledPlant": true, "bValidStatus": false, "valueHelpDialog": false, "SaveFrom": "",
				"enableBtnEquipment": true, "enableBtnValuate": false, "enableBtnClose": false, "enableBtnSave": false, "enableRRvalues": true,
				"enableBtnDigitalSign": false, "enableBtnCloseWoDS": false, "SelectedInspectionPath": "", "bValuateSave": false, "enableBtnValuateQM": false, "enableBtnSaveQM": false
			};
			omModel.setData(mItem);
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createfilterModel
		 *	Description/Usage: create internal filter model
		 */
		createfilterModel: function () {
			var filModel = new JSONModel();
			var filItem = {
				"InspectionType": "",
				"InspectionLot": "",
				"StartDate": "",
				"Equipment": "",
				"LotsforEquipment": true,
				"FunctionalLocation": "",
				"LotsForFuncLocation": true,
				"selectedREL": false,
				"selectedINSP": false,
				"selectedRREC": false,
				"selectedLTIN": false,
				"Plant": "",
				"material": "",
				"batch": "",
				"selectedSevan": true,
				"selectedTwentyEight": false,
				"selectedNinety": false,
				"selectedThreeSixty": false,
				"Username": "",
				"inspTypeQM": "",
				"inspectionlottypes": 2,
				"MaterialType": "",
				"chart": false,
				"Sample": "",
				"TplnrDMS": "X",
				"ProductionOrder": ""//CR 5000026736 Veera Sudheer
			};
			filModel.setData(filItem);
			filModel.setDefaultBindingMode("TwoWay");
			return filModel;
		},
		/*	Method: createColumnModel
		 *	Description/Usage: create internal common column model
		 */
		createColumnModel: function () {
			var oColModel = new JSONModel();
			var colItem = {
				"functionallocation": {
					"cols": [{
						"label": "{i18n>lblFunctionalLocation}",
						"template": "FunctionalLoc"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"plannergroup": {
					"cols": [{
						"label": "{i18n>lblPlannerGroup}",
						"template": "PlannerGroup"
					},
					{
						"label": "{i18n>lblGroupName}",
						"template": "PlGroupName"
					}]
				},
				"workordertype": {
					"cols": [{
						"label": "{i18n>lblType}",
						"template": "Type"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"equipment": {
					"cols": [{
						"label": "{i18n>lblEquipment}",
						"template": "Equipment"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					},
					{
						"label": "{i18n>lblFunctionalLocation}",
						"template": "FuncLoc"
					}]
				},
				"ColWorkCenter": {
					"cols": [{
						"label": "{i18n>lblWorkCenter}",
						"template": "WorkCenterID"
					},
					{
						"label": "{i18n>lblObejctID}",
						"template": "ObjectID"
					},
					{
						"label": "{i18n>lblPlant}",
						"template": "Plant"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"ColPMActType": {
					"cols": [{
						"label": "{i18n>lblActivityType}",
						"template": "ActType"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"UnitsColumn": {
					"cols": [{
						"label": "{i18n>lblUnit}",
						"template": "Unit"
					}]
				},
				"OperationColumn": {
					"cols": [{
						"label": "{i18n>lblOperation}",
						"template": "OperationNumber"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"MaterialColumn": {
					"cols": [{
						"label": "{i18n>lblMaterialNo}",
						"template": "MaterialNo"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					},
					{
						"label": "{i18n>lblPartNo}",
						"template": "PartNo"
					},
					{
						"label": "{i18n>lblMatType}",
						"template": "MatType"
					},
					{
						"label": "{i18n>lblPlant}",
						"template": "Plant"
					},
					{
						"label": "{i18n>lblLanguage}",
						"template": "Language"
					}]
				},
				"RevisionColumn": {
					"cols": [{
						"label": "{i18n>lblRevision}",
						"template": "Revision"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"SysCondColumn": {
					"cols": [{
						"label": "{i18n>lblSystemCondition}",
						"template": "SysCondition"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"PersonRespColumn": {
					"cols": [{
						"label": "{i18n>lblPersonnelNo}",
						"template": "PersonnelNo"
					},
					{
						"label": "{i18n>lblName}",
						"template": "PersonName"
					}]
				},
				"ConfirmColumn": {
					"cols": [{
						"label": "{i18n>lblCode}",
						"template": "Code"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Kurztext"
					},
					{
						"label": "{i18n>lblGroup}",
						"template": "Codegruppe"
					}]
				},
				"RemarksColumn": {
					"cols": [{
						"label": "{i18n>lblID}",
						"template": "RemarkID"
					},
					{
						"label": "{i18n>lblRemark}",
						"template": "SignRemark"
					}]
				},
				"InspectionTypeColumn": {
					"cols": [{
						"label": "{i18n>lblInspectionType}",
						"template": "InspectionType"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"UserSetColumn": {
					"cols": [{
						"label": "{i18n>lblUserID}",
						"template": "User"
					},
					{
						"label": "{i18n>lblName}",
						"template": "Name"
					}]
				},
				"TestEquipColumn": {
					"cols": [{
						"label": "{i18n>lblEquipment}",
						"template": "Equnr"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Eqktu"
					},
					{
						"label": "{i18n>lblFunctionalLocation}",
						"template": "Tplnr"
					}]
				},
				"material": {
					"cols": [{
						"label": "{i18n>lblMaterial}",
						"template": "Material"
					}, {
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}
					]
				},
				"batch": {
					"cols": [{
						"label": "{i18n>lblBatch}",
						"template": "Batch"
					}, {
						"label": "{i18n>lblPlant}",
						"template": "Description"
					}
					]
				},
				"inspectiontype": {
					"cols": [{
						"label": "{i18n>lblInspectionType}",
						"template": "InspectionType"
					}, {
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"MaterialType": {
					"cols": [{
						"label": "{i18n>lblMaterialType}",
						"template": "materialtype"
					}, {
						"label": "{i18n>lblDescription}",
						"template": "description"
					}]
				},
				"Printer": {
					"cols": [{
						"label": "{i18n>lblShortName}",
						"template": "Kname"

					}, {
						"label": "{i18n>lblLoaction}",
						"template": "Pastandort"
					}, {
						"label": "{i18n>lblOutputDevice}",
						"template": "Padest"
					}]
				},
				"SampleCat": {
					"cols": [{
						"label": "{i18n>lblSampCategory}",
						"template": "Sample"

					}, {
						"label": "{i18n>lblDescription}",
						"template": "Text"
					}]
				},
				"SampleCntr": {
					"cols": [{
						"label": "{i18n>lblSampCntr}",
						"template": "Sample"

					}, {
						"label": "{i18n>lblDescription}",
						"template": "Text"
					}]
				},
				"UOMColumn": {
					"cols": [{
						"label": "{i18n>lblUOM}",
						"template": "Msehi"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Msehl"
					}]
				},
				//Begin Code CR 5000026736 Veera Sudheer
				"WorkCenterCategory": {
					"cols": [{
						"label": "{i18n>Category}",
						"template": "Category"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"Plant": {
					"cols": [{
						"label": "{i18n>Plant}",
						"template": "Plant"
					},
					{
						"label": "{i18n>lblDescription}",
						"template": "Description"
					}]
				},
				"CreatedBy": {
					"cols": [{
						"label": "{i18n>lblUname}",
						"template": "Bname"
					},
					{
						"label": "{i18n>lblFname}",
						"template": "Fname"
					},
					{
						"label": "{i18n>lblLname}",
						"template": "Lname"
					}]
				}
				//End Code CR 5000026736 Veera Sudheer
			};
			oColModel.setData(colItem);
			oColModel.setDefaultBindingMode("TwoWay");
			return oColModel;
		},
		/*	Method: createVHKeyModel
		 *	Description/Usage: create internal key model for common value help dialog
		 */
		createVHKeyModel: function () {
			var omModel = new JSONModel();
			var mItem = { "Title": "", "key": "", "descriptionKey": "" };
			omModel.setData(mItem);
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createValueHelpModel
		 *	Description/Usage: create internal common value help model across all value help fields
		 */
		createValueHelpModel: function () {
			var oVHModel = new JSONModel();
			var vhItem = {
				"FunctionalLoc": [],
				"InspectionType": [],
				"Equipment": [],
				"WorkCenter": [],
				"UnitSet": [],
				"UserDataSet": [],
				"InspectionTypeQM": [],
				"MaterialSetQM": [],
				"BatchSetQM": [],
				"MaterialType": [],
				"Printer": [],
				"SampleCategory": [],
				"SampleContainer": [],
				"UOMSHSet": []
			};
			oVHModel.setData(vhItem);
			oVHModel.setDefaultBindingMode("TwoWay");
			return oVHModel;
		},
		/*	Method: createInspectionLotModel
		 *	Description/Usage: create internal inspection lot model
		 */
		createInspectionLotModel: function () {
			var omModel = new JSONModel();
			var mItem = [];
			omModel.setData({ "InspectionLotSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createInspectionLotHDRModel
		 *	Description/Usage: create internal inspection lot header model
		 */
		createInspectionLotHDRModel: function () {
			var omModel = new JSONModel();
			var mItem = {
				"WorkOrderNo": "",
				"InspectionLot": "",
				"Matnr": "",
				"Charg": "",
				"Werk": "",
				"InspectionType": "",
				"Maktx": "",
				"Isd": "",
				"Equnr": "",
				"QlXequi": "",
				"Tplnr": "",
				"QlXfunc": "",
				"Pastrterm": "",
				"Paendterm": "",
				"Eqktx": "",
				"Pltxt": "",
				"InspectionObject": "",
				"InspectionObjectShortText": "",
				"InspectionStartDate": "",
				"Status": "",
				"SelOperationNo": "",
				"SelInspectionPoint": "",
				"SelInspPointEquipment": "",
				"SelInspPointFunctional": ""
			};
			omModel.setData(mItem);
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createOperationModel
		 *	Description/Usage: create internal inspection lot operation model
		 */
		createOperationModel: function () {
			var omModel = new JSONModel();
			var mItem = [];
			omModel.setData({ "OperationSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createEquipmentModel
		 *	Description/Usage: create internal equipment or functional location model
		 */
		createEquipmentModel: function () {
			var omModel = new JSONModel();
			var mItem = [];
			omModel.setData({ "EquipmentSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createRecordResultModel
		 *	Description/Usage: create internal record result model
		 */
		createRecordResultModel: function () {
			var omModel = new JSONModel();
			var mItem = [];
			omModel.setData({ "RecordResultSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createNotificationModel
		 *	Description/Usage: create internal notification data model
		 */
		createNotificationModel: function () {
			var omModel = new JSONModel();
			var mItem = {
				"NotificationType": "",
				"Priority": "",
				"Description": "",
				"Coordinator": ""
			};
			omModel.setData(mItem);
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createAttachmentModel
		 *	Description/Usage: Initiating local JSONModel for display attachment associated with work order
		 */
		createAttachmentModel: function () {
			var oFileModel = new JSONModel();
			var attachmntItem = [];
			oFileModel.setData({
				"FileSet": attachmntItem
			});
			oFileModel.setDefaultBindingMode("TwoWay");
			return oFileModel;
		},
		/*	Method: createDigitalSignModel
		 *	Description/Usage: Initiating local JSONModel for digital signature validation
		 */
		createDigitalSignModel: function () {
			var oDsModel = new JSONModel();
			var oItem = {
				"Batch": "",
				"Defectnotif": "",
				"DsNo": 0,
				"DsUser": "",
				"EquiDesc": "",
				"Equipment": "",
				"FLocTxt": "",
				"FunctLoc": "",
				"InspectionLot": "",
				"InspectionPoint": "",
				"Inspoper": "",
				"Material": "",
				"TestEqui": "",
			};
			oDsModel.setData(oItem);
			oDsModel.setDefaultBindingMode("TwoWay");
			return oDsModel;
		},
		createLocalInspModel: function () {
			var inspModel = new JSONModel();
			var oItem = {
				"InspectionLot": "",
				"Plant": "",
				"SampleCategory": "",
				"SampleCntr": "",
				"SampleQuantity": "",
				"UOM": "",
				"PlysicalSample": "",
				"Oper": "",
				"DwawingNumber": ""
			};
			inspModel.setData(oItem);
			inspModel.setDefaultBindingMode("TwoWay");
			return inspModel;
		},
		createUOMModel: function () {
			var uomModel = new JSONModel();
			var oItem = {
				"Msehi": "",
				"Msehl": "",
			};
			uomModel.setData(oItem);
			uomModel.setDefaultBindingMode("TwoWay");
			return uomModel;
		},
		/*	Method: createRecordResultComapreModel --- for QM Save
		 *	Description/Usage: create internal record result model
		 */
		createRecordResultCompareModel: function () {
			var omModel = new JSONModel();
			var mItem = [];
			omModel.setData({ "RecordResultCompareSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		createReferenceLineModel: function () {
			var omModel = new JSONModel();
			var mItem = {
				"0": 200,
				"1": 150,
				"2": 175,
				"3": 120,
				"4": 100
			};
			omModel.setData(mItem);
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		createFlatDataSetModel: function () {
			var omModel = new JSONModel();
			// var mItem = [];
			// omModel.setData({ "FlatDataSet": mItem });
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		createStatusPopupSetModel: function () {
			var omModel = new JSONModel();
			omModel.setDefaultBindingMode("TwoWay");
			return omModel;
		},
		/*	Method: createoDocumentDisplayModel
		 *	Created By: Komal Nilakhe	|Created On: 07-11-2024
		 *	Description/Usage: To Display Documents in a Popup
		 */
		createoDocumentDisplayModel: function () {
			var oDocumentDisplay = new JSONModel();
			var oItem = [];
			oDocumentDisplay.setData({
				"Documents": oItem
			});
			oDocumentDisplay.setDefaultBindingMode("TwoWay");
			return oDocumentDisplay;
		}

	};
});