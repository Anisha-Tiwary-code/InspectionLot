/* global Quagga:true, global CryptoJS:true */
/* eslint-disable radix */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/Token",
	"sap/m/SearchField",
	"sap/m/MessageBox",
	"sap/ui/core/message/Message",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/ui/Device"
], function (Controller, JSONModel, Fragment, ColumnListItem, Label, Token, SearchField, MessageBox, Message,
	BusyIndicator, Filter, FilterOperator, FlattenedDataset, FeedItem, Dialog, DialogType, TextArea, Button, ButtonType, Text, Device) {
	"use strict";
	var oResourceBun;
	var physample = '';
	var scanModel, scanProperty, oResourceBundle;
	return Controller.extend("com.reckitt.zqminsplotrr.controller.BaseController", {
		/*	Method: onInit
		 *	Description/Usage: Base Controller onInit method used for initiating controller
		 **/
		onInit: function () {
			oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/*	Method: fnPreLoadingService
		 *	Description/Usage: initiating pre loading service call and format oData results required for app
		 **/
		fnPreLoadingService: function (oModel) {
			this.oDataModel = this.getOwnerComponent().getModel("oDataSearchModel");
			oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.oDataAttachmentFileModel = this.getOwnerComponent().getModel("oDataAttachmentFileTypeModel"); // Code added by Komal Nilakhe on 07-11-2024
			var that = this;
			var aFilters = [
				new sap.ui.model.Filter("Artpr", sap.ui.model.FilterOperator.EQ, "QM")
			];

			BusyIndicator.show(0);			
			 var username = "";
			// if (sap.ushell !== undefined) {
			// 	username = sap.ushell.Container.getService("UserInfo").getId();
			// }

			username = "test_qm2";

			this.getOwnerComponent().getModel("filterModel").setProperty("/Username", username);
			Promise.all([this.fnReadEntitySet(this.oDataModel, "/IflmcSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/ZequicSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/PrioritySHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/InspTypeSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/SelectSetRRSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/NotifTypeSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/UserPlantSet('" + username + "')", ""),
			this.fnReadEntitySet(this.oDataModel, "/AttributeSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/TestEquipSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/QMInspTypeSHSet", ""), //Inspection Type(QM)
			this.fnReadEntitySet(this.oDataModel, "/MaterialSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/BatchSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/MaterialTypeSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/PrinterSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/SampleCategorySet", ""),
			this.fnReadEntitySet(this.oDataModel, "/SamplContainerSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/UsersPMorQMSet('" + username + "')", ""),
			this.fnReadEntitySet(this.oDataAttachmentFileModel, "/FileFormatSet", ""), // Code added by Komal Nilakhe on 26-08-2024
			//Begin Code CR 5000026736 Veera Sudheer
			this.fnReadEntitySet(this.oDataModel, "/WorkCtrCategSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/PlantSHSet", ""),
			this.fnReadEntitySet(this.oDataModel, "/PrioritySHSet", { filters: aFilters }),//Priority for QM
			this.fnReadEntitySet(this.oDataModel, "/CreatedBySet", "")
				//End Code CR 5000026736 Veera Sudheer
			]).then(that.fnBuildSuccesslist.bind(that),
				that.fnHandleError.bind(that));
		},
		/*	Method: fnBuildSuccesslist
		 *	Description/Usage: pre loading service call promise of success function used for format backend data to front end format
		 **/
		fnBuildSuccesslist: function (values) {
			this.fnFormatEntitySet(values[0].results, "/IflmcSet", "/FunctionalLoc");
			this.fnFormatEntitySet(values[1].results, "/ZequicSet", "/Equipment");
			this.fnFormatEntitySet(values[2].results, "/PrioritySHSet", "/PrioritySet");
			this.fnFormatEntitySet(values[3].results, "/InspTypeSHSet", "/InspectionTypeSet");
			this.fnFormatEntitySet(values[4].results, "/SelectSetRRSHSet", "/InspectionResultSet");
			this.fnFormatEntitySet(values[5].results, "/NotifTypeSHSet", "/NotificationTypeSet");
			this.fnFormatUserPlant(values[6]);
			this.fnFormatEntitySet(values[7].results, "/AttributeSHSet", "/AttributeSet");
			this.fnFormatEntitySet(values[8].results, "/TestEquipSHSet", "/TestEquipSHSet");
			this.fnFormatEntitySet(values[9].results, "/QMInspTypeSHSet", "/InspectionTypeQM");
			this.fnFormatEntitySet(values[10].results, "/MaterialSHSet", "/MaterialSetQM");
			this.fnFormatEntitySet(values[11].results, "/BatchSHSet", "/BatchSetQM");
			this.fnFormatEntitySet(values[12].results, "/MaterialTypeSet", "/MaterialType");
			this.fnFormatEntitySet(values[13].results, "/PrinterSHSet", "/Printer");
			this.fnFormatEntitySet(values[14].results, "/SampleCategorySet", "/SampleCategory");
			this.fnFormatEntitySet(values[15].results, "/SamplContainerSet", "/SampleContainer");
			this.fnFormatUserPMorQM(values[16]);
			this.fnForamatAttachmentFileType(values[17]); // Code added by Jani Basha on 26-08-2024
			//Begin Code CR 5000026736 Veera Sudheer
			this.fnFormatEntitySet(values[18].results, "/WorkCtrCategSet", "/WorkCenterCategory");
			this.fnFormatEntitySet(values[19].results, "/PlantSHSet", "/Plant");
			this.fnFormatEntitySet(values[20].results, "/PrioritySHSet", "/PrioritySet");
			this.fnFormatEntitySet(values[21].results, "/CreatedBySet", "/CreatedBy");
			//End Code CR 5000026736 Veera Sudheer
			BusyIndicator.hide();
		},
		/*	Method: fnLoadInspectionLot
		 *	Description/Usage: fetch inspection lot details based on lot number
		 **/
		fnLoadInspectionLot: function (InspectionLotNo) {
			this.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var aFilter = [];
			if (InspectionLotNo.length > 0) {
				aFilter.push(new Filter("Insplot", FilterOperator.EQ, InspectionLotNo));
			}
			var oParameter = { "filters": aFilter };
			var aFilter2 = [];
			var oFilterModel = this.getOwnerComponent().getModel("filterModel");
			if (oFilterModel.getProperty("/Plant").length > 0) {
				aFilter2.push(new Filter("Plant", FilterOperator.EQ, oFilterModel.getProperty("/Plant").toUpperCase()));
			}
			var oParameter2 = { "filters": aFilter2 };
			var that = this;
			BusyIndicator.show(0);
			Promise.all([this.fnReadEntitySet(this.oDataInspectionLotModel, "/InspLotRRHdrSet('" + InspectionLotNo + "')", ""),
			this.fnReadEntitySet(this.oDataInspectionLotModel, "/InspLotOprSet", oParameter),
			this.fnReadEntitySet(this.oDataInspectionLotModel, "/InspLotATTSet", oParameter),
			this.fnReadEntitySet(this.oDataInspectionLotModel, "/UserDetailsSet", oParameter2)
			]).then(that.fnSuccessReadInspLot.bind(that),
				that.fnHandleError.bind(that));

		},
		/*	Method: fnSuccessReadInspLot
		 *	Description/Usage: inspection lot read service success menthod to handle result to format
		 **/
		fnSuccessReadInspLot: function (values) {
			this.fnFormatInspLotHdr(values[0]);
			this.fnFormatOperation(values[1].results);
			this.fnFormatAttachment(values[2].results);
			this.fnFormatUserData(values[3].results);//Code CR 5000026736 Veera Sudheer
			BusyIndicator.hide();
		},
		/*	Method: fnHandleError
		 *	Description/Usage: coomon service error handling in this mentod
		 **/
		fnHandleError: function (reason) {
			MessageBox.error(reason.responseText);
			BusyIndicator.hide();
		},
		/*	Method: fnFormatUserPlant
		 *	Description/Usage: format user plant
		 **/
		fnFormatUserPlant: function (rData) {
			var oAppDataModel = this.getOwnerComponent().getModel("AppModeModel");
			if (rData.Plant === "*") {
				oAppDataModel.setProperty("/enabledPlant", true);
			} else {
				this.getOwnerComponent().getModel("filterModel").setProperty("/Plant", rData.Plant);
				oAppDataModel.setProperty("/enabledPlant", false);
			}

		},
		fnFormatUserPMorQM: function (oRetrievedResult) {
			var filterModel = this.getOwnerComponent().getModel("filterModel");
			if (oRetrievedResult.PM === 'X') {
				filterModel.setProperty("/inspectionlottypes", 0);
				filterModel.setProperty("/selectedREL", true)
			} else if (oRetrievedResult.QM === 'X') {
				filterModel.setProperty("/inspectionlottypes", 1);
				filterModel.setProperty("/selectedREL", false)
			}
			filterModel.refresh();

		},
		/*	Method: fnFormatUserData
		 *	Description/Usage: format user data for value help
		 **/
		fnFormatUserData: function (uData) {
			var oCommonValueHelpModel = this.getOwnerComponent().getModel("CommonValueHelpModel");
			var newUserData = [];
			uData.forEach(function (obj) {
				var nItem = {
					"User": obj.User,
					"Name": obj.Name,
					"Plant": obj.Plant
				};
				newUserData.push(nItem);
			});
			oCommonValueHelpModel.setProperty("/UserDataSet", newUserData);
			oCommonValueHelpModel.refresh();
		},
		/*	Method: fnFormatInspLotHdr
		 *	Description/Usage: format inspection lot header data and assign in model
		 **/
		fnFormatInspLotHdr: function (rData) {
			var hdrItem = {
				"WorkOrderNo": rData.Aufnr,
				"Description": rData.Orderdesc,
				"Defectnotif": rData.Defectnotif,
				"InspectionLot": rData.Insplot,
				"DsNo": rData.DsNo,
				"Matnr": rData.Matnr,
				"Charg": rData.Charg,
				"Werk": rData.Werk,
				"InspectionType": rData.Art,
				"Maktx": rData.Maktx,
				"Isd": rData.Isd,
				"Equnr": rData.Equnr,
				"QlXequi": rData.QlXequi,
				"Tplnr": rData.Tplnr,
				"QlXfunc": rData.QlXfunc,
				"Pastrterm": rData.Pastrterm,
				"Paendterm": rData.Paendterm,
				"Eqktx": rData.Eqktx,
				"Pltxt": rData.Pltxt,
				"InspectionObject": rData.Pltxt,
				"InspectionObjectShortText": rData.Ktextmat,
				"InspectionStartDate": rData.Pastrterm,
				"Status": rData.Sttxt,
				"SelOperationNo": "",
				"SelInspectionPoint": ""
			};
			this.getOwnerComponent().getModel("InspectionLotHDRModel").setData(hdrItem);
			this.getOwnerComponent().getModel("InspectionLotHDRModel").refresh();
			//this.fnResetAttachment();
		},
		/*	Method: fnOpenFragment
		 *	Description/Usage: Base Controller fnOpenFragment method used for open dialog fragment across application
		 **/
		fnOpenFragment: function (fragmentname) {
			Fragment.load({
				name: "com.reckitt.zqminsplotrr.view.Fragments." + fragmentname,
				controller: this
			}).then(function (oFragment) {
				this._oDialog = oFragment;
				this.getView().addDependent(this._oDialog);
				this._oDialog.open();
			}.bind(this));
		},
		/*	Method: fnFetchEquipFuncLoc
		 *	Description/Usage: fetch equipment or functional location based on operation selected
		 **/
		fnFetchEquipFuncLoc: function (operationno) {
			var t = this;
			t.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var oAppModel = this.getOwnerComponent().getModel("AppModeModel");
			oAppModel.setProperty("/enableBtnValuate", false);
			oAppModel.setProperty("/enableBtnSave", false);
			oAppModel.setProperty("/enableBtnClose", false);
			oAppModel.setProperty("/enableBtnCloseWoDS", false);
			oAppModel.setProperty("/enableBtnDigitalSign", false);
			var aFilter = [];
			var oFilterModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			if (oFilterModel.getProperty("/InspectionLot").length > 0) {
				aFilter.push(new Filter("Insplot", FilterOperator.EQ, oFilterModel.getProperty("/InspectionLot")));
			}
			if (operationno.length > 0) {
				aFilter.push(new Filter("Inspoper", FilterOperator.EQ, operationno));
			}
			t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelOperationNo", operationno);
			var param = { "filters": aFilter };
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				this.fnReadEntitySet(t.oDataInspectionLotModel, "/InspLotpntSet", param).then(
					function (dataResult) {
						var aResult = [];
						if (dataResult.results.length !== 0) {
							dataResult.results.forEach(function (data) {
								var srhItem = {
									"InspectionLot": data.Insplot,
									"Inspoper": data.Inspoper,
									"InspectionPoint": data.Insppoint,
									"Equipment": data.Equipment,
									"FunctLoc": data.FunctLoc,
									"Material": data.Material,
									"Batch": data.Batch,
									"FLocTxt": data.FLocTxt,
									"TestEqui": data.TestEqui,
									"EquiDesc": data.EquiDesc,
									"DsNo": data.DsNo,
									"DsUser": data.DsUser,
									"Defectnotif": data.Defectnotif,
									"enbaleTestEquip": false,
									"TestEquiDesc": data.TestEquiDesc,
									"PhysSmpl": data.PhysSmpl,
									"TestEquipDms": data.TEST_EQUI_DMS,
									"EquipDms": data.EQUIPMENT_DMS,
									"FuncLocDms": data.FUNCT_LOC_DMS
								};
								aResult.push(srhItem);
							});
							BusyIndicator.hide();
						}
						else {
							BusyIndicator.hide();
							t.fnFetchResWithSample(operationno, oFilterModel.getProperty("/InspectionLot"));
						}
						t.getOwnerComponent().getModel("EquipmentModel").setProperty("/EquipmentSet", aResult);
						t.getOwnerComponent().getModel("EquipmentModel").refresh();
						BusyIndicator.hide();
					}, function (err) {
						BusyIndicator.hide();
						MessageBox.error(oResourceBun.getText("lblUnabletofilter"));
					});
			} else {
				MessageBox.information(oResourceBun.getText("lblPleaseselectatleastonecriteria"));
			}
		},

		/*	Method: fnFetchResWithSample
		 *	Description/Usage: fetch results based on sample selected
		 **/
		fnFetchResWithSample: function (operationno, sample) {

			var t = this;
			// this.getView().byId("idWizard").getSteps()[2].getContent()[0].removeSelections();
			this.getView().byId("idWizard").getSteps()[2]._activate();
			var inspModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var RecordResultModel = this.getOwnerComponent().getModel("RecordResultModel");
			var aFilter = [];
			aFilter.push(new Filter("Insplot", FilterOperator.EQ, sample));
			aFilter.push(new Filter("Inspoper", FilterOperator.EQ, operationno));
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				inspModel.read("/InspOprRrSet", {
					filters: aFilter,
					success: $.proxy(function (oRetrievedResult) {
						sap.ui.core.BusyIndicator.hide();
						RecordResultModel.setProperty("/RecordResultSet", oRetrievedResult.results);
						RecordResultModel.refresh();



					}, this),
					error: $.proxy(function (oError) {
						sap.ui.core.BusyIndicator.hide();
					}, this)
				});
			} else {
				MessageBox.information(oResourceBun.getText("lblPleaseselectatleastonecriteria"));
			}


		},
		/*	Method: fnFetchInspectionRecord
		 *	Description/Usage: fetch result to record based on operation and inspection point selected
		 **/
		fnFetchInspectionRecord: function (oEvent, inspectionPoint, insTestEquipment) {
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var t = this;
			this.physample = this.getView().byId("equipTable").getSelectedItem().getBindingContext("EquipmentModel").getObject().PhysSmpl;
			t.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var aFilter = [];
			var oFilterModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			if (oFilterModel.getProperty("/InspectionLot").length > 0) {
				aFilter.push(new Filter("Insplot", FilterOperator.EQ, oFilterModel.getProperty("/InspectionLot")));
			}
			if (oFilterModel.getProperty("/SelOperationNo").length > 0) {
				aFilter.push(new Filter("Inspoper", FilterOperator.EQ, oFilterModel.getProperty("/SelOperationNo")));
			}
			if (inspectionPoint.length > 0) {
				aFilter.push(new Filter("Insppoint", FilterOperator.EQ, inspectionPoint));
			}
			t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspectionPoint", inspectionPoint);
			t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", insTestEquipment);
			var param = { "filters": aFilter };
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				this.fnReadEntitySet(t.oDataInspectionLotModel, "/InspLotRrSet", param).then(
					function (dataResult) {




						var aResult = [];
						var aResultQM = [];//QM
						var oResultModel = t.getOwnerComponent().getModel("RecordResultModel");
						var oResultCompareModel = t.getOwnerComponent().getModel("RecordResultCompareModel");//QM
						oResultModel.setSizeLimit(dataResult.results.length + 100);
						dataResult.results.forEach(function (data) {
							var sDocReq = "", sDocReqToolTip = "";
							if (data.DocuRequ === "") {
								sDocReq = oResourceBun.getText("lblNone");
								sDocReqToolTip = oResourceBun.getText("lblNodocumentationrequired");
							} else if (data.DocuRequ === ".") {
								sDocReq = oResourceBun.getText("lblIfRejected");
								sDocReqToolTip = oResourceBun.getText("lblDocumentationrequiredonlyifrejected");
							} else if (data.DocuRequ === "+") {
								sDocReq = oResourceBun.getText("lblAlways");
								sDocReqToolTip = oResourceBun.getText("lblDocumentationisalwaysrequired");
							}
							var Stellen = data.Stellen; // Code Added By Komal Nilakhe on 28082024
							// Code Added By Komal Nilakhe on 10102024
							var adjustedValue = "";
							if (data.ResValue !== "" && !isNaN(parseFloat(data.ResValue))) {
								var value = data.ResValue;
								if (value.includes(",") == true) {
									value = value.replaceAll(",", ".");
								}
								// Check if there's a decimal point
								var decimalIndex = value.indexOf(".");
								if (decimalIndex === -1) {
									adjustedValue = value + "." + "0".repeat(Stellen);
								} else {
									var integerPart = value.slice(0, decimalIndex);
									var decimalPart = value.slice(decimalIndex + 1);

									if (decimalPart.length < Stellen) {
										decimalPart = decimalPart + "0".repeat(Stellen - decimalPart.length);
									} else {
										decimalPart = decimalPart.slice(0, Stellen);
									}

									adjustedValue = integerPart + '.' + decimalPart;
								}
							}
							else {
								adjustedValue = data.ResValue;
							}
							var srhItem = {
								"InspectionLot": data.Insplot,
								"Inspoper": data.Inspoper,
								"Insppoint": data.Insppoint,
								"CharNo": data.Inspchar,
								"Status": data.Status,
								"ShortText": data.CharDescr,
								"Specifications": data.Qtolgrenze,
								"Attribute": data.ResAttr,
								"Result": adjustedValue, // Code Added By Komal Nilakhe on 28082024
								"Description": data.Remark,
								"CharType": data.CharType,
								"Evaluation": data.Evaluation,
								"SelSet1": data.SelSet1,
								"ResultData": t.fnFetchQualitativeData(data.SelSet1, data.Werks, data.Katalogart),
								"ErrClass": data.ErrClass,
								"Evaluated": data.Evaluated,
								"MstrChar": data.MstrChar,
								"SingleRes": data.SingleRes,
								"Werks": data.Werks,
								"Katalogart": data.Katalogart,
								"DocuRequ": data.DocuRequ,
								"DocuRequiredTxt": sDocReq,
								"sDocReqToolTip": sDocReqToolTip,
								"UpLmt1": data.UpLmt1,
								"LwLmt1": data.LwLmt1,
								"UpLmt2": data.UpLmt2,
								"LwLmt2": data.LwLmt2,
								"UpPlsLmt": data.UpPlsLmt,
								"LwPlsLmt": data.LwPlsLmt,
								"UpTolLmt": data.UpTolLmt,
								"LwTolLmt": data.LwTolLmt,
								"InspCharLText": data.Inspcharltext,
								"Calculate": data.Calculate,
								"ControlChart": data.Controlchart,
								"Vorglfnr": data.Vorglfnr,
								"Inspchar": data.Inspchar,
								"Stellen": data.Stellen, //code written by Komal Nilakhe on 280824
								"SampleRes": data.SampleRes		// Code Written by Hari Krishna on 28062024
							};
							aResult.push(srhItem);
							//Start of code for QM Save
							var srhItemQM = {
								"Insplot": data.Insplot,
								"Inspoper": data.Inspoper,
								"Insppoint": data.Insppoint,
								"Inspchar": data.Inspchar,
								"Kurztext": data.CharDescr,
								"OSumplus": data.ResValue,
								"ResultData": data.Katalogart,
								"Sumplus": "",
								"Short_Text": "",
								// "Flag":""
							};
							aResultQM.push(srhItemQM);
							//End of code for QM Save
						});
						oResultModel.setProperty("/RecordResultSet", aResult);
						oResultModel.refresh();
						oResultCompareModel.setProperty("/RecordResultCompareSet", aResultQM); //QM Save
						oResultCompareModel.refresh(); //QM Save
						BusyIndicator.hide();
						t.fnRefreshResultData();
					}, function (err) {
						BusyIndicator.hide();
						MessageBox.error(oResourceBun.getText("lblUnabletofilter"));
					});
			} else {
				MessageBox.information(oResourceBun.getText("lblPleaseselectatleastonecriteria"));
			}
		},
		/*	Method: fnFetchQualitativeData
		 *	Description/Usage: fetch qualitiative data
		 **/
		fnFetchQualitativeData: function (auswahlmge, werks, katalogart) {
			var aQualitative = [];
			if (auswahlmge.length > 0) {
				var aResultSet = this.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/InspectionResultSet");
				aResultSet.forEach(function (obj) {
					if (auswahlmge === obj.Auswahlmge && werks === obj.Werks && katalogart === obj.Katalogart) {
						var oItem = {
							"key": obj.Code,
							"value": obj.Kurztext,
							"Auswahlmge": obj.Auswahlmge,
							"werks": obj.werks,
							"katalogart": obj.katalogart
						};
						aQualitative.push(oItem);
					}
				});
			}
			return aQualitative;
		},
		/*	Method: onLiveChangeNumberOnly
		 *	Description/Usage: it return only numbers
		 **/
		onLiveChangeNumberOnly: function (oEvent) {
			oEvent.getSource().setValue(oEvent.getSource().getValue().replace(/[^0-9]/g, ""));
		},
		/*	Method: onLiveChangeNumberwithTwoDecimal
		 *	Description/Usage: it return only numbers with two decimal
		 **/
		onLiveChangeNumberwithTwoDecimal: function (oEvent) {
			/*oEvent.getSource().setValue(oEvent.getSource().getValue().replace(/([^\d]*)(\d*(\.\d{0,2})?)(.*)/, "$2"));*/
			//oEvent.getSource().setValue(oEvent.getSource().getValue().replace(/([^-?\d]*)(-?\d*(\.\d{0,2})?)(.*)/, "$2"));
			// Code Added By Komal Nilakhe on 08082024 Starts Here
			var value = oEvent.getSource().getValue();
			value = value.replace(/[^0-9.,]/g, "");

			// Prevent multiple commas or dots by allowing only one of each
			var parts = value.split(".");
			if (parts.length > 2) {
				value = parts[0] + "." + parts[1];
			}

			parts = value.split(",");
			if (parts.length > 2) {
				value = parts[0] + "," + parts[1];
			}

			// Prevent both comma and dot from being present simultaneously
			if (value.indexOf(",") !== -1 && value.indexOf(".") !== -1) {
				value = value.replace(/[,.]+$/, "");  // Removes trailing dot or comma
			}

			// Prevent the value from starting with a comma or dot
			if (value.startsWith(",") || value.startsWith(".")) {
				value = value.substring(1);
			}
			// Code Added By Komal Nilakhe on 28082024
			// New decimal validation: Limit the decimal places based on backend 'Stellen' value
			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			var iStellen = Selected.Stellen;

			var oRegex = new RegExp("^\\d*(\\.\\d{0," + iStellen + "})?$");

			// If the input value is valid according to the regex, update the value; otherwise, revert
			if (!oRegex.test(value)) {
				value = oEvent.getSource()._lastValidValue || ""; // Revert to the last valid value
			} else {
				oEvent.getSource()._lastValidValue = value; // Store the last valid value
			}

			// Set the cleaned and validated value back to the input
			oEvent.getSource().setValue(value);
			//Code Added By Komal Nilakhe on 28082024 Ends Here
			this.getOwnerComponent().getModel("AppModeModel").setProperty("/CurrentlyChanged", true);

			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			if (Selected.ControlChart === 'X' && this.getOwnerComponent().getModel("filterModel").getProperty("/chart") === true) {
				var viz = this.getView().byId("vizFrame");
				var flatdata = this.getOwnerComponent().getModel("FlatDataSeteModel").getData();
				flatdata[flatdata.length - 1].Mittelwert = Selected.Result;
				viz.removeAllFeeds();
				var oDataset = new sap.viz.ui5.data.FlattenedDataset({
					dimensions: [{
						name: "InspLot",
						value: "{InspLot}"
					}],

					measures: [{
						name: "Mittelwert",
						value: "{Mittelwert}"
					}],

					data: {
						path: "/"
					}
				});
				var jsonData = new sap.ui.model.json.JSONModel();
				jsonData.setData(flatdata);
				viz.setDataset(oDataset);
				viz.setModel(jsonData);
			}
		},
		/*	Method: fnFormatOperation
		 *	Description/Usage: format operation odata result
		 **/
		fnFormatOperation: function (rOperation) {
			var aOpr = [];
			rOperation.forEach(function (oprObj) {
				var oprData = {
					"InspectionLot": oprObj.Insplot,
					"OperationNo": oprObj.Inspoper,
					"Plant": oprObj.Plant,
					"Description": oprObj.TxtOper,
					"WorkCenter": oprObj.Workcenter
				};
				aOpr.push(oprData);
			});
			this.getOwnerComponent().getModel("OperationModel").setProperty("/OperationSet", aOpr);
			this.getOwnerComponent().getModel("OperationModel").refresh();
		},
		/*	Method: fnFormatAttachment
		 *	Description/Usage: format attachment odata result
		 **/
		fnFormatAttachment: function (rResult) {
			this.getOwnerComponent().getModel("AttachmentModel").setData({
				"FileSet": []
			});
			var aAttach = [];
			var sInspectionLot = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/InspectionLot"); // Code added by Komal Nilakhe on 04-09-2024
			rResult.forEach(function (obj) {
				var attItem = {

					// Below code has been added by Komal Nilakhe on 04-09-2024 -- Start
					"Content": obj.Content,
					"deleteItem": false,
					"deletePath": "/InspLotATTSet(Doknr='" + obj.Doknr + "',Dokar='" + obj.Dokar + "')",
					"Doknr": obj.Doknr,
					"Dokar": obj.Dokar,
					"File_name": obj.File_name,
					"File_desc": obj.File_desc,
					"Ktxt": obj.Ktxt,
					"Mimetype": obj.Mimetype,
					"Objky": obj.Objky,
					"Dappl": obj.Dappl,
					"Lo_objid": obj.Lo_objid,
					"ShortDesc": obj.Short_desc, // Code added by Komal Nilakhe on 09-09-2024
					"url": "/sap/opu/odata/sap/ZOD_QM_INSPECTIONLOT_SRV/InspLotATTSet(Doknr='" + obj.Doknr + "',Dokar='" + obj.Dokar + "')/$value"
					// Below code has been added by Komal Nilakhe on 04-09-2024 -- End
				};
				// Below code has been added by Komal Nilakhe on 04-09-2024 -- Start
				if (sInspectionLot && attItem.Objky.indexOf(sInspectionLot) !== -1) {
					attItem.deleteItem = true;
				}
				// Below code has been added by Komal Nilakhe on 04-09-2024 -- End
				aAttach.push(attItem);
			});
			this.getOwnerComponent().getModel("AttachmentModel").setData({
				"FileSet": aAttach
			});
			this.getOwnerComponent().getModel("AttachmentModel").refresh();
		},
		// fnFormatAttachment: function (rResult) {
		// 	var aAttach = [];
		// 	rResult.forEach(function (obj) {
		// 		var attItem = {
		// 			"Guid": obj.Guid,
		// 			"Insplot": obj.Insplot,
		// 			"fileName": obj.Description,
		// 			"url": "/sap/opu/odata/sap/ZOD_QM_INSPECTIONLOT_SRV/InspLotATTSet(Guid=guid'" + obj.Guid + "',Insplot='" + obj.Insplot + "')/$value",
		// 			"Description": obj.Description,
		// 			"Mimetype": obj.Mimetype,
		// 			"Type": obj.Type,
		// 			"editEnabled": true,
		// 			"deleteItem": true,
		// 			"deletePath": "/InspLotATTSet(Guid=guid'" + obj.Guid + "',Insplot='" + obj.Insplot + "')"
		// 		};
		// 		aAttach.push(attItem);
		// 	});
		// 	this.getOwnerComponent().getModel("AttachmentModel").setData({ "FileSet": aAttach });
		// 	this.getOwnerComponent().getModel("AttachmentModel").refresh();
		// },
		/*	Method: fnReadEntitySet
		 *	Description/Usage: coomon method used for read odata service across application
		 **/
		fnReadEntitySet: function (oModel, sEntitySet, mParameters) {
			return new Promise(function (resolve, reject) {
				oModel.setUseBatch(false);
				oModel.read(sEntitySet, {
					filters: mParameters ? mParameters.filters : "",
					sorters: mParameters ? mParameters.sorters : "",
					success: function (oData) {
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},
		/*	Method: fnDeleteEntitySet
		 *	Description/Usage: common method used for delete odata service
		 **/
		fnDeleteEntitySet: function (oModel, sEntitySet, mParameters) {
			return new Promise(function (resolve, reject) {
				oModel.setUseBatch(false);
				oModel.remove(sEntitySet, {
					filters: mParameters ? mParameters.filters : "",
					sorters: mParameters ? mParameters.sorters : "",
					success: function (oData) {
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},
		/*	Method: fnCreateEntitySet
		 *	Description/Usage: common method used for create odata service
		 **/
		fnCreateEntitySet: function (oModel, sEntitySet, payload) {

			return new Promise(function (resolve, reject) {
				oModel.create(sEntitySet, payload, {
					success: function (oData) {
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},
		/*	Method: fnUpdateEntitySet
		 *	Description/Usage: common method used for updae odata service
		 **/
		fnUpdateEntitySet: function (oModel, sEntitySet, payload) {
			return new Promise(function (resolve, reject) {
				oModel.setUseBatch(false);
				oModel.update(sEntitySet, payload, {
					success: function (oData) {
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},
		/*	Method: fnUpdatePUTEntitySet
		 *	Description/Usage: Update method with PUT option
		 **/
		fnUpdatePUTEntitySet: function (oModel, sEntitySet, payload) {
			return new Promise(function (resolve, reject) {
				oModel.update(sEntitySet, payload, {
					method: "PUT",
					success: function (oData) {
						resolve(oData);
					},
					error: function (error) {
						reject(error);
					}
				});
			});
		},
		/*	Method: fnFormatEntitySet
		 *	Description/Usage: common method used for format entityset data to local format
		 **/
		fnFormatEntitySet: function (oDataResult, slocEntitySet, sLocColumnSet) {
			var CommonValueHelpModel = this.getOwnerComponent().getModel("CommonValueHelpModel");
			switch (slocEntitySet) {
				case "/IflmcSet":
					var newData1 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"FunctionalLoc": obj.Tplnr,
							"Description": obj.Pltxt,
							"MaintPlant": obj.Swerk,
							"CostCenter": obj.Kostl
						};
						newData1.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData1);
					CommonValueHelpModel.refresh();
					break;
				case "/QmelArbplSet":
					var newData2 = [];
					var aUnits = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"WorkCenterID": obj.Arbpl,
							"ObjectID": obj.Objid,
							"Plant": obj.Werks,
							"Description": obj.Ktext,
							"Unit": obj.Vgarb
						};
						newData2.push(nItem);
						aUnits.push(obj.Vgarb);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData2);
					var uniqueUnits = [];
					aUnits.forEach(function (u) {
						if (!uniqueUnits.includes(u)) {
							uniqueUnits.push(u);
						}
					});
					var fUnits = [];
					uniqueUnits.forEach(function (unit) {
						fUnits.push({ "Unit": unit });
					});
					CommonValueHelpModel.setProperty("UnitSet", fUnits);
					CommonValueHelpModel.refresh();
					break;
				case "/ZequicSet":
					var newData3 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Equipment": obj.Equnr,
							"Description": obj.Eqktu,
							"MaintPlant": obj.Swerk,
							"CostCenter": obj.Kostl,
							"Language": obj.Spras,
							"FuncLoc": obj.Tplnr
						};
						newData3.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData3);
					CommonValueHelpModel.refresh();
					break;
				case "/PlannerGroupSHSet":
					var newData4 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"PlannerGroup": obj.Ingrp,
							"Plant": obj.Iwerk,
							"PlGroupName": obj.Innam
						};
						newData4.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData4);
					CommonValueHelpModel.refresh();
					break;
				case "/PrioritySHSet":
					var newData5 = [];
					//Begin Code CR 5000026736 Veera Sudheer
					var newQMData = [];
					if (oDataResult[0].Artpr == "PM") {
						oDataResult.forEach(function (obj) {
							var nItem = {
								"Type": obj.Artpr,
								"Priority": obj.Priok,
								"Description": obj.Priokx
							};
							newData5.push(nItem);
						});
						CommonValueHelpModel.setProperty(sLocColumnSet, newData5);
						CommonValueHelpModel.refresh();
					} else {
						oDataResult.forEach(function (obj) {
							var nItem = {
								"Type": obj.Artpr,
								"Priority": obj.Priok,
								"Description": obj.Priokx
							};
							newQMData.push(nItem);
						});
						CommonValueHelpModel.setProperty(sLocColumnSet, newQMData);
						CommonValueHelpModel.refresh();
					}
					//End Code CR 5000026736 Veera Sudheer
					break;
				case "/InspTypeSHSet":
					var newData6 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"InspectionType": obj.Art,
							"Description": obj.Kurztext
						};
						newData6.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData6);
					CommonValueHelpModel.refresh();
					break;
				case "/SelectSetRRSHSet":
					var newData7 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Codegruppe": obj.Codegruppe,
							"Code": obj.Code,
							"Kurztext": obj.Kurztext,
							"Werks": obj.Werks,
							"Katalogart": obj.Katalogart,
							"Auswahlmge": obj.Auswahlmge,
							"Bewertung": obj.Bewertung,
							"Folgeakti": obj.Folgeakti,
							"Sprache": obj.Sprache
						};
						newData7.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData7);
					CommonValueHelpModel.refresh();
					break;
				case "/NotifTypeSHSet":
					var newData8 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"NotificationType": obj.Qmart,
							"Description": obj.Qmartx,
							"Category": obj.Qmtyp
						};
						newData8.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData8);
					CommonValueHelpModel.refresh();
					break;
				case "/AttributeSHSet":
					var newData9 = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Attribut": obj.Attribut,
							"Sortnr": obj.Sortnr,
							"Sprache": obj.Sprache,
							"Kurztext": obj.Kurztext
						};
						newData9.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, newData9);
					CommonValueHelpModel.refresh();
					break;
				case "/TestEquipSHSet":
					CommonValueHelpModel.setProperty(sLocColumnSet, oDataResult);
					CommonValueHelpModel.refresh();
					break;
				case '/QMInspTypeSHSet':
					var inspType = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"InspectionType": obj.ART,
							"Description": obj.KURZTEXT
						};
						inspType.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, inspType);
					CommonValueHelpModel.refresh();
					break;
				case '/MaterialSHSet':
					var material = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Material": obj.Matnr,
							"Description": obj.Maktg,
							"Xchpf": obj.Xchpf
						};
						material.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, material);
					CommonValueHelpModel.refresh();
					break;
				case '/BatchSHSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Batch": obj.Charg,
							"Description": obj.Werks
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/MaterialTypeSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"materialtype": obj.Mtart,
							"description": obj.Mtbez
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/PrinterSHSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Kname": obj.Kname,
							"Pastandort": obj.Pastandort,
							"Padest": obj.Padest
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/SampleCategorySet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Sample": obj.Prtyp,
							"Text": obj.Prtyptxt
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/SamplContainerSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Sample": obj.Gebindetyp,
							"Text": obj.Kurztext
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				//Begin Code CR 5000026736 Veera Sudheer
				case '/WorkCtrCategSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Category": obj.VERWE,
							"Description": obj.KTEXT
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/PlantSHSet':
					var batch = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Plant": obj.Werks,
							"Description": obj.Name1
						};
						batch.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, batch);
					CommonValueHelpModel.refresh();
					break;
				case '/CreatedBySet':
					var create = [];
					oDataResult.forEach(function (obj) {
						var nItem = {
							"Bname": obj.BNAME,
							"Fname": obj.NAME_FIRST,
							"Lname": obj.NAME_LAST
						};
						create.push(nItem);
					});
					CommonValueHelpModel.setProperty(sLocColumnSet, create);
					CommonValueHelpModel.refresh();
					break;
				//Begin Code CR 5000026736 Veera Sudheer
			}
		},
		/*	Method: fnValueHelpDialog
		 *	Description/Usage: common method used for open value help dialog across application
		 **/
		fnValueHelpDialog: function (control, entityset, columnData, data) {
			var oAppModel = this.getOwnerComponent().getModel("AppModeModel");
			if (oAppModel.getProperty("/valueHelpDialog") === false) {
				this._oBasicSearchField = new SearchField({
					showSearchButton: false,
					liveChange: function (oEvent) {
						var sQuery = oEvent.getSource().getValue();
						var columns = [];
						columnData.cols.forEach(function (col) {
							var oFilter = new sap.ui.model.Filter(col.template, sap.ui.model.FilterOperator.Contains, sQuery);
							columns.push(oFilter);
						});
						var allFilter = new sap.ui.model.Filter(columns, false);
						var oBinding = oEvent.getSource().getParent().getParent().getParent().getItems()[1].getBinding("rows");
						oBinding.filter(allFilter);
					}
				});
				this._oInput = control;
				this.oColModel = new JSONModel();
				this.oColModel.setData(columnData);
				var aCols = this.oColModel.getData().cols;
				this.oVHModel = new JSONModel();
				var obj = {};
				obj[entityset] = data;
				this.oVHModel.setData(obj);
				control.setModel(this.oVHModel);
				Fragment.load({
					name: "com.reckitt.zqminsplotrr.view.Fragments.ValueHelpDialog",
					controller: this
				}).then(function (oFragment) {
					this._oValueHelpDialog = oFragment;
					this.getView().addDependent(this._oValueHelpDialog);
					this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);
					this._oValueHelpDialog.getTableAsync().then(function (oTable) {
						oTable.setModel(this.oVHModel);
						oTable.setModel(this.oColModel, "columns");
						if (oTable.bindRows) {
							oTable.bindAggregation("rows", "/" + entityset);
						}
						if (oTable.bindItems) {
							oTable.bindAggregation("items", "/" + entityset, function () {
								return new ColumnListItem({
									cells: aCols.map(function (column) {
										return new Label({ text: "{" + column.template + "}" });
									})
								});
							});
						}
						this._oValueHelpDialog.update();
					}.bind(this));
					var oToken = new Token();
					oToken.setKey(this._oInput.getSelectedKey());
					oToken.setText(this._oInput.getValue());
					this._oValueHelpDialog.setTokens([oToken]);
					this._oValueHelpDialog.open();
					oAppModel.setProperty("/valueHelpDialog", true);
				}.bind(this));
			}
		},
		/*	Method: onVHOK
		 *	Description/Usage: common method used for select value help dialog selection or ok event across application
		 **/
		onVHOK: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var key = aTokens[0].getKey();
			this._oValueHelpDialog.close();
			var oModel = this.getView().getModel("filterModel");
			var tokenVal = aTokens[0].getCustomData()[0].getValue();
			if (oEvent.getSource().getKey() === "Kname") {
				oModel.setProperty("/Printer", tokenVal.Kname);
				this._oValueHelpDialog.close();
				this.Print();
			}
			if (oEvent.getSource().getKey() === "FunctionalLoc") {
				this._oInput.setValue(key);
				this.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointFunctional", key);
			} else if (oEvent.getSource().getKey() === "Equnr") {
				this._oInput.setValue(key);
				this.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", key);
				this.fnTestEquipmentValid(key);
			} else {
				this._oInput.setValue(key);
			}
		},
		/*	Method: onVHCancel
		 *	Description/Usage: common method used for select value help dialog cancel or close event across application
		 **/
		onVHCancel: function () {
			this._oValueHelpDialog.close();
		},
		/*	Method: onVHAfterClose
		 *	Description/Usage: common method used for select value help dialog afterclose event
		 **/
		onVHAfterClose: function () {
			this._oValueHelpDialog.destroy();
			this.getOwnerComponent().getModel("AppModeModel").setProperty("/valueHelpDialog", false);
		},
		/*	Method: fnFilterValues
		 *	Description/Usage: it return combined filter values to filter
		 **/
		fnFilterValues: function (oEvent) {
			var aFilter = [];
			var status = [];
			var oFilterModel = this.getOwnerComponent().getModel("filterModel");
			var inspectionlottypes = oFilterModel.getProperty("/inspectionlottypes");
			var ApplType = "";
			if (oFilterModel.getProperty("/InspectionLot").length > 0) {
				aFilter.push(new Filter("Insplot", FilterOperator.EQ, oFilterModel.getProperty("/InspectionLot")));
			}
			var sDay = "7";
			if (oFilterModel.getProperty("/selectedSevan") === true) {
				sDay = "7";
			} else if (oFilterModel.getProperty("/selectedTwentyEight") === true) {
				sDay = "28";
			} else if (oFilterModel.getProperty("/selectedNinety") === true) {
				sDay = "90";
			} else if (oFilterModel.getProperty("/selectedThreeSixty") === true) {
				sDay = "360";
			} else if (oFilterModel.getProperty("/selectedOne") === true) {
				sDay = "1";
			}
			aFilter.push(new Filter("Isd", FilterOperator.EQ, sDay));

			if (inspectionlottypes === 1) {
				ApplType = "QM";
				aFilter.push(new Filter("ApplType", FilterOperator.EQ, ApplType));
				if (oFilterModel.getProperty("/inspTypeQM").length > 0) {
					aFilter.push(new Filter("Art", FilterOperator.EQ, oFilterModel.getProperty("/inspTypeQM")));
				}
				if (oFilterModel.getProperty("/material").length > 0) {
					aFilter.push(new Filter("Matnr", FilterOperator.EQ, oFilterModel.getProperty("/material")));
				}
				if (oFilterModel.getProperty("/batch").length > 0) {
					aFilter.push(new Filter("Charg", FilterOperator.EQ, oFilterModel.getProperty("/batch")));
				}
				if (oFilterModel.getProperty("/MaterialType").length > 0) {
					aFilter.push(new Filter("MatType", FilterOperator.EQ, oFilterModel.getProperty("/MaterialType")));
				}
				if (oFilterModel.getProperty("/Sample").length > 0) {
					aFilter.push(new Filter("PhysSmpl", FilterOperator.EQ, oFilterModel.getProperty("/Sample")));
				}
				//Begin Code CR 5000026736 Veera Sudheer
				if (oFilterModel.getProperty("/ProductionOrder").length > 0) {
					aFilter.push(new Filter("Aufnr", FilterOperator.EQ, oFilterModel.getProperty("/ProductionOrder")));
				}
				//End Code CR 5000026736 Veera Sudheer
				//Begin Code - Send Work Center as Arbpl in payload when provided
				if (oFilterModel.getProperty("/WorkCenter").length > 0) {
					var sWC = oFilterModel.getProperty("/WorkCenter");
					if (sWC) { sWC = sWC.toUpperCase(); }
					aFilter.push(new Filter("Arbpl", FilterOperator.EQ, sWC));
				}
				//End Code - Send Work Center as Arbpl in payload when provided
				if (oFilterModel.getProperty("/selectedLTIN") === true) {
					status.push(oResourceBun.getText("lblLTIN"));
				}
			}
			if (inspectionlottypes === 0) {
				if (oFilterModel.getProperty("/InspectionType").length > 0) {
					aFilter.push(new Filter("Art", FilterOperator.EQ, oFilterModel.getProperty("/InspectionType")));
				}
				if (oFilterModel.getProperty("/Equipment").length > 0) {
					aFilter.push(new Filter("Equnr", FilterOperator.EQ, oFilterModel.getProperty("/Equipment")));
				}
				if (oFilterModel.getProperty("/FunctionalLocation").length > 0) {
					aFilter.push(new Filter("Tplnr", FilterOperator.EQ, oFilterModel.getProperty("/FunctionalLocation")));
				}
				if (oFilterModel.getProperty("/LotsforEquipment") === true) {
					aFilter.push(new Filter("QlXequi", FilterOperator.EQ, oFilterModel.getProperty("/LotsforEquipment")));
				}
				if (oFilterModel.getProperty("/LotsForFuncLocation") === true) {
					aFilter.push(new Filter("QlXfunc", FilterOperator.EQ, oFilterModel.getProperty("/LotsForFuncLocation")));
				}
				if (oFilterModel.getProperty("/selectedINSP") === true) {
					status.push(oResourceBun.getText("lblINSP"));
				}
				ApplType = "PM";
				aFilter.push(new Filter("ApplType", FilterOperator.EQ, ApplType));
			}
			if (oFilterModel.getProperty("/selectedREL") === true) {
				status.push(oResourceBun.getText("lblREL"));
			}
			// if (oFilterModel.getProperty("/selectedINSP") === true) {
			// 	status.push(oResourceBun.getText("lblINSP"));
			// }
			if (oFilterModel.getProperty("/selectedRREC") === true) {
				status.push(oResourceBun.getText("lblRREC"));
			}
			if (status.toString().length > 0) {
				aFilter.push(new Filter("Sttxt", FilterOperator.EQ, status.toString()));
			}
			if (oFilterModel.getProperty("/Plant").length > 0) {
				aFilter.push(new Filter("Werk", FilterOperator.EQ, oFilterModel.getProperty("/Plant").toUpperCase()));
			}
			return aFilter;
		},
		/*	Method: fnScanBarCode
		 *	Description/Usage: common method used for scan barcode
		 **/
		fnScanBarCode: function (uModel, uProperty) {
			oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			scanModel = uModel; scanProperty = uProperty;
			if (!this._oScanDialog) {
				this._oScanDialog = new sap.m.Dialog({
					title: oResourceBundle.getText("lblScanBarcode"),
					contentWidth: "640px",
					contentHeight: "480px",
					horizontalScrolling: false,
					verticalScrolling: false,
					stretchOnPhone: true,
					content: [new sap.ui.core.HTML({
						id: this.createId("scanContainer"),
						content: "<div />"
					})],
					endButton: new sap.m.Button({
						text: oResourceBundle.getText("btnClose"),
						press: function (oEvent) {
							this._oScanDialog.close();
						}.bind(this)
					}),
					afterOpen: function () {
						this._initQuagga(this.getView().byId("scanContainer").getDomRef()).done(function () {
							Quagga.start();
						}).fail(function (oError) {
							MessageBox.error(oError.message.length ? oError.message : (oResourceBun.getText("lblFailedtoinitialiseQuaggawithreasoncode") + " " + oError.name), {
								onClose: function () {
									this._oScanDialog.close();
								}.bind(this)
							});
						}.bind(this));
					}.bind(this),
					afterClose: function () {
						Quagga.stop();
					}
				});
				this.getView().addDependent(this._oScanDialog);
			}
			this._oScanDialog.open();
		},
		/*	Method: _initQuagga
		 *	Description/Usage: internal quagga library method invoked for barcode scan
		 **/
		_initQuagga: function (oTarget) {
			var oDeferred = jQuery.Deferred();
			Quagga.init({
				inputStream: {
					type: "LiveStream",
					target: oTarget,
					constraints: {
						width: { min: 640 },
						height: { min: 480 },
						facingMode: "environment"
					}
				},
				locator: {
					patchSize: "medium",
					halfSample: true
				},
				numOfWorkers: 2,
				frequency: 10,
				decoder: {
					readers: [{
						format: "code_128_reader",
						config: {}
					},
					{
						format: "code_39_reader",
						config: {}
					}]
				},
				locate: true
			}, function (error) {
				if (error) {
					oDeferred.reject(error);
				} else {
					oDeferred.resolve();
				}
			});
			if (!this._bQuaggaEventHandlersAttached) {
				Quagga.onProcessed(function (result) {
					var drawingCtx = Quagga.canvas.ctx.overlay,
						drawingCanvas = Quagga.canvas.dom.overlay;
					if (result) {
						if (result.boxes) {
							drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
							result.boxes.filter(function (box) {
								return box !== result.box;
							}).forEach(function (box) {
								Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
							});
						}
						if (result.box) {
							Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
						}
						if (result.codeResult && result.codeResult.code) {
							Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, { color: "red", lineWidth: 3 });
						}
					}
				});
				Quagga.onDetected(function (result) {
					scanModel.setProperty(scanProperty, result.codeResult.code);
					scanModel.refresh();
					this.fnValidateScannedBarcode(scanProperty);
					this._oScanDialog.close();
				}.bind(this));
				this._bQuaggaEventHandlersAttached = true;
			}
			return oDeferred.promise();
		},
		/*	Method: fnNavBack
		 *	Description/Usage: navigation back to launchpad
		 */
		fnNavBack: function (oEvent) {
			if (sap.ushell === undefined) {
				MessageBox.information(oResourceBun.getText("lblFioriLaunchpadnotavailabletonavigate"));
			} else {
				var oCrossAppNavigator2 = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator2.toExternal({
					target: {
						shellHash: "#"
					}
				});
			}
		},
		/*	Method: fnValidation
		 *	Description/Usage: validate before post
		 */
		// fnValidation: function (oEvent) {
		// 	var oInsHeaderModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
		// 	var oResutlRecordModel = this.getOwnerComponent().getModel("RecordResultModel");
		// 	if (oInsHeaderModel.getProperty("/InspectionLot").length === 0) {
		// 		MessageBox.information(oResourceBun.getText("lblInspectionlotMissing"));
		// 		return false;
		// 	} else if (oInsHeaderModel.getProperty("/SelOperationNo").length === 0) {
		// 		MessageBox.information(oResourceBun.getText("lblPleaseSelectOperation"));
		// 		return false;
		// 	} else if (oInsHeaderModel.getProperty("/SelInspectionPoint").length === 0) {
		// 		MessageBox.information(oResourceBun.getText("lblPleaseSelectInspectionPoint"));
		// 		return false;
		// 	} else if (oResutlRecordModel.getProperty("/RecordResultSet").length === 0) {
		// 		MessageBox.information(oResourceBun.getText("lblResultrecordtableisempty"));
		// 		return false;
		// 	}
		// 	return true;
		// },
		fnValidation: function (oEvent) {
			var oInsHeaderModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var oResutlRecordModel = this.getOwnerComponent().getModel("RecordResultModel");
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var DsEsigns1 = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/DsEsigns");
			var DsNo1 = this.getOwnerComponent().getModel("EquipmentModel").getProperty("/EquipmentSet/0/DsNo");
			var DsFlag = false;
			var closedFlag = false
			aSelItems.forEach(oItem => {
				var binding = oItem.getBindingContext("RecordResultModel").sPath;
				var obj = oResutlRecordModel.getProperty(binding);
				// if (obj.Status === '3' && DsEsigns1 === '2' && DsNo1 === 1) {
				// 	DsFlag = true;
				// }
				if (obj.Status === '5') {
					closedFlag = true;
				}
			});

			if (oInsHeaderModel.getProperty("/InspectionLot").length === 0) {
				MessageBox.information(oResourceBun.getText("lblInspectionlotMissing"));
				return false;
			} else if (oInsHeaderModel.getProperty("/SelOperationNo").length === 0) {
				MessageBox.information(oResourceBun.getText("lblPleaseSelectOperation"));
				return false;
			}
			// else if (oInsHeaderModel.getProperty("/SelInspectionPoint").length === 0) {
			// 	MessageBox.information(oResourceBun.getText("lblPleaseSelectInspectionPoint"));
			// 	return false;
			// } 
			else if (oResutlRecordModel.getProperty("/RecordResultSet").length === 0) {
				MessageBox.information(oResourceBun.getText("lblResultrecordtableisempty"));
				return false;
			} else if (DsFlag === true) {
				MessageBox.error(oResourceBun.getText("lblselalreatDSproceesd"));
				return false;
			} else if (closedFlag === true) {
				MessageBox.error(oResourceBun.getText("lblselalreadyclosed"));
				return false;
			}

			return true;
		},
		/*	Method: fnLoadRemarks
		 *	Description/Usage: fnLoadRemarks method used for load remarks
		 **/
		fnLoadRemarks: function () {
			var t = this;
			BusyIndicator.show(0);
			var aFilters = [];
			var sPlant = t.getOwnerComponent().getModel("filterModel").getProperty("/Plant");
			if (sPlant.length > 0) {
				aFilters.push((new Filter("Werks", FilterOperator.EQ, sPlant)));
			}
			var aRemarks = [];
			this.oDataModel = this.getOwnerComponent().getModel("oDataSearchModel");
			var mParam = { "filters": aFilters };
			this.fnReadEntitySet(this.oDataModel, "/RemarkSHSet", mParam).then(function (resultData) {
				resultData.results.forEach(function (rData) {
					var pItem = {
						"Plant": rData.Werks,
						"OrderType": rData.Auart,
						"RemarkID": rData.Id,
						"SignRemark": rData.SignRemark
					};
					aRemarks.push(pItem);
				});
				BusyIndicator.hide();
				t.getOwnerComponent().getModel("CommonValueHelpModel").setProperty("/RemarkSet", aRemarks);
			}, function (err) {
				var erMsg = JSON.parse(err.responseText);
				MessageBox.error(erMsg.error.message.value);
				BusyIndicator.hide();
			});
		},
		/*	Method: fnValidationCloseResult
		 *	Description/Usage: validate before post of close result
		 */
		fnValidationCloseResult: function (oEvent) {
			var oAppModel = this.getOwnerComponent().getModel("AppModeModel");
			var aResutlRecord = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var bStatusCheck = false;
			//commented by Komal Nilakhe on 091024
			// if (oAppModel.getProperty("/CurrentlyChanged") === true) {
			// 	MessageBox.information(oResourceBun.getText("lblResultshavechanged"));
			// 	return false;
			// }
			aResutlRecord.forEach(function (rData) {
				if (rData.Status !== "3") {
					bStatusCheck = true;
				}
			});
			//commented by Komal Nilakhe on 081024
			// if (bStatusCheck === true) {
			// 	//MessageBox.information(oResourceBun.getText("lblstatusshouldbe3toproceed")); 
			// 	return false;
			// }
			return true;
		},
		/*	Method: fnDigitalSignValidation
		 *	Description/Usage: validate for digital signature
		 */
		fnDigitalSignValidation: function (oEvent) {
			var oAppModeModel = this.getOwnerComponent().getModel("AppModeModel");
			var oHDRModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var sSelectPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var oEquipModel = this.getOwnerComponent().getModel("EquipmentModel");
			
			var username = "";
			// if (sap.ushell !== undefined) {
			// 	username = sap.ushell.Container.getService("UserInfo").getId();
			// }
			username = "test_qm2";
			var nHdrDS = oHDRModel.getProperty("/DsNo");
			var nInPntDS = oEquipModel.getProperty(sSelectPath + "/DsNo");
			var uInPntDSUser = oEquipModel.getProperty(sSelectPath + "/DsUser");
			if (nHdrDS > nInPntDS) {
				if (uInPntDSUser.length > 0) {
					if (username === uInPntDSUser) {
						oAppModeModel.setProperty("/enableBtnClose", false);
						oAppModeModel.setProperty("/enableBtnDigitalSign", false);
					} else {
						oAppModeModel.setProperty("/enableBtnClose", false);
						oAppModeModel.setProperty("/enableBtnDigitalSign", true);
					}
				} else {
					oAppModeModel.setProperty("/enableBtnClose", true);
					oAppModeModel.setProperty("/enableBtnDigitalSign", false);
					oAppModeModel.setProperty("/enableBtnCloseWoDS", false);
				}
			} else {
				if (nHdrDS === 0) {
					oAppModeModel.setProperty("/enableBtnClose", false);
					oAppModeModel.setProperty("/enableBtnDigitalSign", false);
					oAppModeModel.setProperty("/enableBtnCloseWoDS", true);
				} else {
					oAppModeModel.setProperty("/enableBtnClose", false);
					oAppModeModel.setProperty("/enableBtnDigitalSign", false);
					oAppModeModel.setProperty("/enableBtnCloseWoDS", false);
				}
			}
		},
		/*	Method: fnSaveValidation
		 *	Description/Usage: validate before post for Save
		 */
		fnSaveValidation: function (oEvent) {
			var t = this;
			t.getOwnerComponent().getModel("AppModeModel").setProperty("/bValidStatus", false);
			var bStatusCheck = false;

			//  Code Commented by Hari Krishna Starts Here - 26062024			

			// var aResutlRecord = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			// aResutlRecord.forEach(function (rData) {
			// 	if (rData.Evaluation !== "A") {
			// 		bStatusCheck = true;
			// 	}
			// 	if (Number(rData.Status) === 3) {
			// 		t.getOwnerComponent().getModel("AppModeModel").setProperty("/bValidStatus", true);
			// 	}
			// });

			// Code Commented by Hari Krishna Ends Here - 26062024

			// /* Code Written By Hari Krishna Starts Here 26062024 */

			var idResultTable = this.getView().byId("idResult"),
				selectedItems = idResultTable.getSelectedItems();

			selectedItems.forEach(function (rData, index) {
				var tempObject = rData.getBindingContext("RecordResultModel").getObject();

				if (tempObject.Evaluation === "R") {
					bStatusCheck = true;
				}

				if (Number(tempObject.Status) === 3) {
					t.getOwnerComponent().getModel("AppModeModel").setProperty("/bValidStatus", true);
				}

			});

			// /* Code Written By Hari Krishna Ends Here 26062024 */

			if (bStatusCheck === true) {
				return false;
			}
			return true;
		},
		/*	Method: fnFormatErrorMessage
		 *	Description/Usage: Format structure of common error
		 **/
		fnFormatErrorMessage: function (error) {
			var errMsg = JSON.parse(error.responseText);
			var returnMsg = "";
			if (errMsg === undefined) {
				returnMsg = oResourceBun.getText("lblUnbaletoshowerrordetail");
			} else if (errMsg.error.innererror === undefined) {
				returnMsg = errMsg.error;
			} else if (errMsg.error.innererror.errordetails.length > 0) {
				errMsg.error.innererror.errordetails.forEach(function (msg) {
					if (msg.message !== oResourceBun.getText("lblAnexceptionwasraised")) {
						returnMsg = returnMsg + msg.message + "\n";
					}
				});
			} else if (errMsg.error.message !== undefined) {
				returnMsg = errMsg.error.message.value;
			} else {
				returnMsg = oResourceBun.getText("lblerroroccurred");
			}
			return returnMsg;
		},
		/*	Method: fnResetDetailScreen
		 *	Description/Usage: Reset Detail Screen data
		 */
		fnResetDetailScreen: function (oEvent) {
			var oInsHeaderModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			oInsHeaderModel.setProperty("/InspectionLot", "");
			oInsHeaderModel.setProperty("/SelOperationNo", "");
			oInsHeaderModel.setProperty("/SelInspectionPoint", "");
			var oWizard = oEvent.getSource().getParent().getParent().getContent()[1];
			oWizard.setCurrentStep(oWizard.getSteps()[0]);
			oWizard.getSteps()[0].getContent()[0].setSelectedContextPaths([]);
			oWizard.getSteps()[1].getContent()[0].setSelectedContextPaths([]);
			oWizard.getSteps()[2].getContent()[0].setSelectedContextPaths([]);
			this.getOwnerComponent().getModel("OperationModel").setProperty("/OperationSet", []);
			this.getOwnerComponent().getModel("EquipmentModel").setProperty("/EquipmentSet", []);
			this.getOwnerComponent().getModel("RecordResultModel").setProperty("/RecordResultSet", []);
			oWizard.getSteps()[1]._deactivate();
			oWizard.getSteps()[2]._deactivate();
			oWizard.getSteps()[3]._deactivate();
		},
		/*	Method: fnResetDetailScreenInit
		 *	Description/Usage: Reset Detail Screen data before init
		 */
		fnResetDetailScreenInit: function (oEvent) {
			var oInsHeaderModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			oInsHeaderModel.setProperty("/InspectionLot", "");
			oInsHeaderModel.setProperty("/SelOperationNo", "");
			oInsHeaderModel.setProperty("/SelInspectionPoint", "");
			var oWizard = this.getView().getContent()[0].getContent()[1];
			oWizard.setCurrentStep(oWizard.getSteps()[0]);
			oWizard.getSteps()[0].getContent()[0].setSelectedContextPaths([]);
			oWizard.getSteps()[1].getContent()[0].setSelectedContextPaths([]);
			oWizard.getSteps()[2].getContent()[0].setSelectedContextPaths([]);
			this.getOwnerComponent().getModel("OperationModel").setProperty("/OperationSet", []);
			this.getOwnerComponent().getModel("EquipmentModel").setProperty("/EquipmentSet", []);
			this.getOwnerComponent().getModel("RecordResultModel").setProperty("/RecordResultSet", []);
			this.getOwnerComponent().getModel("filterModel").setProperty("/chart", false);
			oWizard.getSteps()[1]._deactivate();
			oWizard.getSteps()[2]._deactivate();
			oWizard.getSteps()[3]._deactivate();



			this.fnResetButtonsFields();
		},
		/*	Method: fnFormatValuatePayload
		 *	Description/Usage: format valuate payload to post
		 **/
		fnFormatValuatePayload: function () {
			var oInsHdrData = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var Werks = oInsHdrData.getProperty("/Werk"); // Code Added By Komal Nilakhe on 09102024
			var aRecordData = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var aRecordRecord = [];
			//start of code for PM
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oSharedModel = this.getOwnerComponent().getModel("RecordResultModel");

			if (aSelItems.length != 0) {
				aSelItems.forEach(oItem => {
					var binding = oItem.getBindingContext("RecordResultModel").sPath;
					var obj = oSharedModel.getProperty(binding);
					var oItem = {
						"Inspchar": obj.CharNo,
						"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 12082024
						"CharType": obj.CharType,
						"SelSet1": obj.SelSet1,
						"Status": obj.Status,
						"Evaluated": obj.Evaluated,
						"UpLmt1": obj.UpLmt1,
						"LwLmt1": obj.LwLmt1,
						"SingleRes": obj.SingleRes,
						"ResAttr": obj.Attribute,
						"ResValue": obj.Result,
						"Remark": obj.Description,
						"Insplot": obj.InspectionLot,
						"Inspoper": obj.Inspoper,
						"Vorglfnr": obj.Vorglfnr,
						"Insppoint": obj.Insppoint,
						"SampleRes": obj.SampleRes,		// Code Written by Hari Krishna on 28062024
						"Werks": Werks // Code Added By Komal Nilakhe on 09102024
						//"ApplType": "PM" // Code Added By Komal Nilakhe on 17102024
					};

					aRecordRecord.push(oItem);


				});
			}
			// else {
			// 	//endd ofCode for PM
			// 	aRecordData.forEach(function (obj) {
			// 		var oItem = {
			// 			"Inspchar": obj.CharNo,						
			// 			"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 12082024
			// 			"CharType": obj.CharType,
			// 			"SelSet1": obj.SelSet1,
			// 			"Status": obj.Status,
			// 			"Evaluated": obj.Evaluated,
			// 			"UpLmt1": obj.UpLmt1,
			// 			"LwLmt1": obj.LwLmt1,
			// 			"SingleRes": obj.SingleRes,
			// 			"ResAttr": obj.Attribute,
			// 			"ResValue": obj.Result,
			// 			"Remark": obj.Description,
			// 			"Insplot": obj.InspectionLot,
			// 			"Inspoper": obj.Inspoper,
			// 			"Vorglfnr": obj.Vorglfnr,
			// 			"Insppoint": obj.Insppoint,
			// 			"Werks": Werks // Code Added By Komal Nilakhe on 09102024
			// 		};
			// 		aRecordRecord.push(oItem);
			// 	});
			// } ///PM COde
			var oPayload = {
				"Action": "VALUATE",
				"Werk": Werks,//code CR 5000026736 by Veera Sudheer
				"ApplType": "PM",//code CR 5000026736 by Veera Sudheer
				"Insplot": oInsHdrData.getProperty("/InspectionLot"),
				"InspLotOprSet": [{
					"Inspoper": oInsHdrData.getProperty("/SelOperationNo"),
					"InspLotpntSet": [{
						"Insplot": oInsHdrData.getProperty("/InspectionLot"),
						"Insppoint": oInsHdrData.getProperty("/SelInspectionPoint"),
						"InspLotRr": aRecordRecord
					}]
				}]
			};
			return oPayload;
		},
		/*	Method: fnFormatCRPayload
		 *	Description/Usage: format close result payload
		 **/
		fnFormatCRPayload: function () {
			var oInsHdrData = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var Werks = oInsHdrData.getProperty("/Werk"); // Code Added By Komal Nilakhe on 09102024
			var aRecordData = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var oNotifData = this.getOwnerComponent().getModel("NotificationModel");
			var aRecordRecord = [];
			//start of code for PM
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oSharedModel = this.getOwnerComponent().getModel("RecordResultModel");
			if (aSelItems.length != 0) {
				aSelItems.forEach(oItem => {
					var binding = oItem.getBindingContext("RecordResultModel").sPath;
					var obj = oSharedModel.getProperty(binding);
					var oItem = {
						"Inspchar": obj.CharNo,
						"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 09102024
						"CharType": obj.CharType,
						"SelSet1": obj.SelSet1,
						"Status": obj.Status,
						"Evaluated": obj.Evaluated,
						"UpLmt1": obj.UpLmt1,
						"LwLmt1": obj.LwLmt1,
						"SingleRes": obj.SingleRes,
						"ResAttr": obj.Attribute,
						"ResValue": obj.Result,
						"Remark": obj.Description,
						"Insplot": obj.InspectionLot,
						"Inspoper": obj.Inspoper,
						"Insppoint": obj.Insppoint,
						"CharDescr": obj.ShortText,
						"Qtolgrenze": obj.Specifications,
						"Evaluation": obj.Evaluation,
						"ErrClass": obj.ErrClass,
						"MstrChar": obj.MstrChar,
						"Werks": obj.Werks,
						"Katalogart": obj.Katalogart,
						"DocuRequ": obj.DocuRequ,
						"Werks": Werks // Code Added By Komal Nilakhe on 09102024

					};
					aRecordRecord.push(oItem);
				});
			}
			// else {
			// 	//End of PM COde
			// 	aRecordData.forEach(function (obj) {
			// 		var oItem = {
			// 			"Inspchar": obj.CharNo,
			// 			"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 09102024
			// 			"CharType": obj.CharType,
			// 			"SelSet1": obj.SelSet1,
			// 			"Status": obj.Status,
			// 			"Evaluated": obj.Evaluated,
			// 			"UpLmt1": obj.UpLmt1,
			// 			"LwLmt1": obj.LwLmt1,
			// 			"SingleRes": obj.SingleRes,
			// 			"ResAttr": obj.Attribute,
			// 			"ResValue": obj.Result,
			// 			"Remark": obj.Description,
			// 			"Insplot": obj.InspectionLot,
			// 			"Inspoper": obj.Inspoper,
			// 			"Insppoint": obj.Insppoint,
			// 			"CharDescr": obj.ShortText,
			// 			"Qtolgrenze": obj.Specifications,
			// 			"Evaluation": obj.Evaluation,
			// 			"ErrClass": obj.ErrClass,
			// 			"MstrChar": obj.MstrChar,
			// 			"Werks": obj.Werks,
			// 			"Katalogart": obj.Katalogart,
			// 			"DocuRequ": obj.DocuRequ,
			// 			"Werks": Werks // Code Added By Komal Nilakhe on 09102024
			// 		};
			// 		aRecordRecord.push(oItem);
			// 	});
			// } //PM Code
			var oPayload = {
				"Action": "CLOSE",
				"CLOSE": {
					"User": "",
					"PwdEnc": "",
					"Testequi": oInsHdrData.getProperty("/SelInspPointEquipment"),
					"Description": oNotifData.getProperty("/Description"),
					"Qmart": oNotifData.getProperty("/NotificationType"),
					"Priok": oNotifData.getProperty("/Priority"),
					"Cordinaytoe": oNotifData.getProperty("/Coordinator"),
					"ApplType": "PM" // Code Added By Komal Nilakhe on 17102024
				},
				"Insplot": oInsHdrData.getProperty("/InspectionLot"),
				"InspLotOprSet": [{
					"Inspoper": oInsHdrData.getProperty("/SelOperationNo"),
					"InspLotpntSet": [{
						"Insplot": oInsHdrData.getProperty("/InspectionLot"),
						"Insppoint": oInsHdrData.getProperty("/SelInspectionPoint"),
						"InspLotRr": aRecordRecord
					}]
				}]
			};
			return oPayload;
		},
		/*	Method: fnFormatReasonCangePayload
		 *	Description/Usage: format reason for change
		 **/
		fnFormatReasonCangePayload: function () {
			// var oInsHdrData = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var aRecordData = this.getOwnerComponent().getModel("RecordResultCompareModel").getData().RecordResultCompareSet;
			var aRecordRecord = [];
			var that = this;
			aRecordData.forEach(function (obj) {
				if (obj.Flag === 'X') {
					var oItem = {
						"Insplot": obj.Insplot,
						"Inspoper": obj.Inspoper,
						"Insppoint": obj.Insppoint,
						"Inspchar": obj.Inspchar,
						"Short_Text": obj.Short_Text,
						"Sumplus": obj.OSumplus,
						"OSumplus": obj.Sumplus,
						"Phynr": that.physample
					}
					aRecordRecord.push(oItem);
				}
			});
			var payload = {
				"ReasonPayload": aRecordRecord
			};
			return payload;
		},
		/*	Method: fnFormatDigiSignPayload
		 *	Description/Usage: format digital signature payload
		 **/
		fnFormatDigiSignPayload: function () {
			var oInsHdrData = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var Werks = oInsHdrData.getProperty("/Werk"); // Code Added By Komal Nilakhe on 09102024
			var aRecordData = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var oNotifData = this.getOwnerComponent().getModel("NotificationModel");
			var aRecordRecord = [];
			aRecordData.forEach(function (obj) {

				var oItem = {
					"Inspchar": obj.CharNo,
					"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 09102024
					"CharType": obj.CharType,
					"SelSet1": obj.SelSet1,
					"Status": obj.Status,
					"Evaluated": obj.Evaluated,
					"UpLmt1": obj.UpLmt1,
					"LwLmt1": obj.LwLmt1,
					"SingleRes": obj.SingleRes,
					"ResAttr": obj.Attribute,
					"ResValue": obj.Result,
					"Remark": obj.Description,
					"Insplot": obj.InspectionLot,
					"Inspoper": obj.Inspoper,
					"Insppoint": obj.Insppoint,
					"CharDescr": obj.ShortText,
					"Qtolgrenze": obj.Specifications,
					"Evaluation": obj.Evaluation,
					"ErrClass": obj.ErrClass,
					"MstrChar": obj.MstrChar,
					"Werks": obj.Werks,
					"Katalogart": obj.Katalogart,
					"DocuRequ": obj.DocuRequ,
					"Werks": Werks // Code Added By Komal Nilakhe on 09102024
				};
				aRecordRecord.push(oItem);
			});
			var oPayload = {
				"Action": "CLOSE",
				"ApplType": "PM",//code CR 5000026736 by Veera Sudheer
				"Werk": Werks,//code CR 5000026736 by Veera Sudheer
				"CLOSE": {
					"User": "",
					"PwdEnc": "",
					"Testequi": oInsHdrData.getProperty("/SelInspPointEquipment"),
					"Description": oNotifData.getProperty("/Description"),
					"Qmart": oNotifData.getProperty("/NotificationType"),
					"Priok": oNotifData.getProperty("/Priority"),
					"Cordinaytoe": oNotifData.getProperty("/Coordinator"),
					"ApplType": "PM" // Code Added By Komal Nilakhe on 17102024
				},
				"Insplot": oInsHdrData.getProperty("/InspectionLot"),
				"InspLotOprSet": [{
					"Inspoper": oInsHdrData.getProperty("/SelOperationNo"),
					"InspLotpntSet": [{
						"Insplot": oInsHdrData.getProperty("/InspectionLot"),
						"Insppoint": oInsHdrData.getProperty("/SelInspectionPoint"),
						"InspLotRr": aRecordRecord
					}]
				}]
			};
			return oPayload;
		},
		/*	Method: fnFormatSavePayload
		 *	Description/Usage: format save payload
		 **/
		fnFormatSavePayload: function () {
			var oInsHdrData = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var Werks = oInsHdrData.getProperty("/Werk"); // Code Added By Komal Nilakhe on 09102024
			var oNotifData = this.getOwnerComponent().getModel("NotificationModel");
			var aRecordData = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var aRecordRecord = [];
			//start of code for added by Komal Nilakhe on 24/09/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oSharedModel = this.getOwnerComponent().getModel("RecordResultModel");
			if (aSelItems.length != 0) {
				aSelItems.forEach(oItem => {
					var binding = oItem.getBindingContext("RecordResultModel").sPath;
					var obj = oSharedModel.getProperty(binding);

					var oItem = {
						"Inspchar": obj.CharNo,
						"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 09102024
						"CharType": obj.CharType,
						"SelSet1": obj.SelSet1,
						"Status": obj.Status,
						"Evaluated": obj.Evaluated,
						"Insplot": obj.InspectionLot,//code added by Komal on 11/10/24
						"Inspoper": obj.Inspoper, //code added by Komal on 11/10/24
						"Insppoint": obj.Insppoint, //code added by Komal on 11/10/24
						"UpLmt1": obj.UpLmt1,
						"LwLmt1": obj.LwLmt1,
						"SingleRes": obj.SingleRes,
						"ResAttr": obj.Attribute,
						"ResValue": obj.Result,
						"Remark": obj.Description,
						"Evaluation": obj.Evaluation,
						"SampleRes": obj.SampleRes,
						"Werks": Werks // Code Added By Komal Nilakhe on 09102024	

					};
					aRecordRecord.push(oItem);
				});
			}
			// else {
			// 	aRecordData.forEach(function (obj) {
			// 		var oItem = {
			// 			"Inspchar": obj.CharNo,
			// 			"Calculate": obj.Calculate, // Code Added By Komal Nilakhe on 09102024
			// 			"CharType": obj.CharType,
			// 			"SelSet1": obj.SelSet1,
			// 			"Status": obj.Status,
			// 			"Evaluated": obj.Evaluated,
			// 			"Insplot": obj.InspectionLot, //code added by Komal on 11/10/24
			// 			"Inspoper": obj.Inspoper, //code added by Komal on 11/10/24
			// 			"Insppoint": obj.Insppoint, //code added by Komal on 11/10/24
			// 			"UpLmt1": obj.UpLmt1,
			// 			"LwLmt1": obj.LwLmt1,
			// 			"SingleRes": obj.SingleRes,
			// 			"ResAttr": obj.Attribute,
			// 			"ResValue": obj.Result,
			// 			"Remark": obj.Description,
			// 			"Evaluation": obj.Evaluation,
			// 			"SampleRes":obj.SampleRes,		// Code Written by Hari Krishna on 28062024
			// 			"Werks": Werks // Code Added By Komal Nilakhe on 09102024
			// 		};
			// 		aRecordRecord.push(oItem);
			// 	});
			// }
			//end of code for added by Komal Nilakhe on 24/09/24
			var oPayload = {
				"Action": "SAVE",
				"ApplType": "PM",//code CR 5000026736 by Veera Sudheer
				"Werk": Werks,//code CR 5000026736 by Veera Sudheer
				"SAVE": {
					"Testequi": oInsHdrData.getProperty("/SelInspPointEquipment"),
					"Description": oNotifData.getProperty("/Description"),
					"Qmart": oNotifData.getProperty("/NotificationType"),
					"Priok": oNotifData.getProperty("/Priority"),
					"Cordinaytoe": oNotifData.getProperty("/Coordinator"),
					"ApplType": "PM" // Code Added By Komal Nilakhe on 17102024
				},
				"Insplot": oInsHdrData.getProperty("/InspectionLot"),
				"InspLotOprSet": [{
					"Inspoper": oInsHdrData.getProperty("/SelOperationNo"),
					"InspLotpntSet": [{
						"Insplot": oInsHdrData.getProperty("/InspectionLot"),
						"Insppoint": oInsHdrData.getProperty("/SelInspectionPoint"),
						"InspLotRr": aRecordRecord
					}]
				}]
			};
			return oPayload;
		},
		/*	Method: onAfterDialogClose
		 *	Description/Usage: after close event for closed dialog
		 */
		onAfterDialogClose: function (oEvent) {
			this._oDialog = undefined;
		},
		/*	Method: onDialogClose
		 *	Description/Usage: close event for opened dialog
		 */
		onDialogClose: function (oEvent) {
			oEvent.getSource().getParent().close();
		},
		/*	Method: fnEncryptionKey
		 *	Description/Usage: Base Controller fnEncryptionKey method used for encrypt password
		 **/
		fnEncryptionKey: function (plainText) {
			var data = plainText;
			var iv = "W5taJPnJHbOjNsWh4CHgTO3f1Eyo";
			var key = "FrYnM3UwoXVoVKNfXpO7mEzHcZ9tVMXZ";
			var fkey = CryptoJS.enc.Utf8.parse(key);
			var fiv = CryptoJS.enc.Utf8.parse(iv);
			var enc = CryptoJS.AES.encrypt(data, fkey, {
				iv: fiv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});
			return enc.ciphertext.toString();
		},
		/*	Method: onDialogCloseResult
		 *	Description/Usage: Technically completion function from dialog
		 */
		onDialogCloseResult: function (oEvent) {
			var t = this;
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (oEvent.getSource().getParent().getContent()[0].getContent()[1].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblInspectionlotnumberismissing"));
			} else if (oEvent.getSource().getParent().getContent()[0].getContent()[5].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblUsernameismissing"));
			} else if (oEvent.getSource().getParent().getContent()[0].getContent()[7].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblPleaseentervalidpassword"));
			} else {
				//Code added by Komal on 17/10/24
				var aSelItems = this.getView().byId("idResult").getSelectedItems();
				if (aSelItems.length == 0) {
					MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
					return;
				}
				BusyIndicator.show(0);
				var oClosePayload = t.fnFormatCRPayload();
				oClosePayload.CLOSE.User = oEvent.getSource().getParent().getContent()[0].getContent()[5].getValue();
				oClosePayload.CLOSE.PwdEnc = t.fnEncryptionKey(oEvent.getSource().getParent().getContent()[0].getContent()[7].getValue()).toUpperCase();
				var oObjectEvent = oEvent.getSource();
				var aExistinData = t.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
				var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
				t.fnCreateEntitySet(oPostModel, "/InspLotRRHdrSet", oClosePayload).then(
					function (successData) {
						oObjectEvent.getParent().close();
						var aCloseResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
						aCloseResult.forEach(function (data) {
							aExistinData.forEach(function (eData) {
								if (data.Inspchar === eData.CharNo) {
									eData.Evaluation = data.Evaluation;
									eData.ErrClass = data.ErrClass;
									eData.Status = data.Status;
									// Code Added By Komal Nilakhe on 10102024
									var Stellen = eData.Stellen;
									if (data.ResValue !== "" && !isNaN(parseFloat(data.ResValue))) {
										var value = data.ResValue;
										if (value.includes(",") == true) {
											value = value.replaceAll(",", ".");
										}
										// Check if there's a decimal point
										var decimalIndex = value.indexOf(".");
										if (decimalIndex === -1) {
											eData.Result = value + "." + "0".repeat(Stellen);
										} else {
											var integerPart = value.slice(0, decimalIndex);
											var decimalPart = value.slice(decimalIndex + 1);

											if (decimalPart.length < Stellen) {
												decimalPart = decimalPart + "0".repeat(Stellen - decimalPart.length);
											} else {
												decimalPart = decimalPart.slice(0, Stellen);
											}

											eData.Result = integerPart + '.' + decimalPart;
										}
									} else {
										eData.Result = data.ResValue;
									}
									// Code ended By Komal Nilakhe on 10102024
								}
							});
						});
						t.getOwnerComponent().getModel("RecordResultModel").refresh();
						t.getOwnerComponent().getModel("AppModeModel").setProperty("/SaveFrom", "CloseResult");
						//t.fnSave();
						t.fnUploadFiles();
						t.fnResetNotificationData();
						//Code commented by Komal Nilakhe on 09/10/2024
						// var sCRMsg = oResourceBun.getText("lblInspectionLot") + oClosePayload.Insplot + oResourceBun.getText("lblresulthasbeenclosedsuccessfully");
						// var nHdrDS = Number(t.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/DsNo"));
						// var sSelectPath = t.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
						// var oEquipModel = t.getOwnerComponent().getModel("EquipmentModel");
						// var nInPntDS = Number(oEquipModel.getProperty(sSelectPath + "/DsNo"));
						// if ((nHdrDS - nInPntDS) === 2) {
						// 	sCRMsg = oResourceBun.getText("lblFirstdigitalsignatureforInspectionLot") + " " + oClosePayload.Insplot + " " + oResourceBun.getText("lblperformedsuccessfullySeconddigitalsignatureisrequired");
						// }
						// MessageBox.success(sCRMsg);
						t.fnRefreshFetchEquipFuncLoc();
						BusyIndicator.hide();
					},
					function (err) {
						var erMsg = t.fnFormatErrorMessage(err);
						MessageBox.error(erMsg);
						BusyIndicator.hide();
					});
			}
		},
		/*	Method: onDialogDS
		 *	Description/Usage: Digital Signature only
		 */
		onDialogDS: function (oEvent) {
			var t = this;
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (oEvent.getSource().getParent().getContent()[0].getContent()[1].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblInspectionlotnumberismissing"));
			} else if (oEvent.getSource().getParent().getContent()[0].getContent()[5].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblUsernameismissing"));
			} else if (oEvent.getSource().getParent().getContent()[0].getContent()[7].getValue().length === 0) {
				MessageBox.error(oResourceBun.getText("lblPleaseentervalidpassword"));
			} else {
				//Code added by Komal on 17/10/24
				var aSelItems = this.getView().byId("idResult").getSelectedItems();
				if (aSelItems.length == 0) {
					MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
					return;
				}
				BusyIndicator.show(0);
				var oDigiSignPayload = t.fnFormatDigiSignPayload();
				oDigiSignPayload.CLOSE.User = oEvent.getSource().getParent().getContent()[0].getContent()[5].getValue();
				oDigiSignPayload.CLOSE.PwdEnc = t.fnEncryptionKey(oEvent.getSource().getParent().getContent()[0].getContent()[7].getValue()).toUpperCase();
				var oObjectEvent = oEvent.getSource();
				var aExistinData = t.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
				var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
				t.fnCreateEntitySet(oPostModel, "/InspLotRRHdrSet", oDigiSignPayload).then(
					function (successData) {
						oObjectEvent.getParent().close();
						var aCloseResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
						aCloseResult.forEach(function (data) {
							aExistinData.forEach(function (eData) {
								if (data.Inspchar === eData.CharNo) {
									eData.Evaluation = data.Evaluation;
									eData.ErrClass = data.ErrClass;
									eData.Status = data.Status;
									// Code Added By Komal Nilakhe on 10102024
									var Stellen = eData.Stellen;
									if (data.ResValue !== "" && !isNaN(parseFloat(data.ResValue))) {
										var value = data.ResValue;
										if (value.includes(",") == true) {
											value = value.replaceAll(",", ".");
										}
										// Check if there's a decimal point
										var decimalIndex = value.indexOf(".");
										if (decimalIndex === -1) {
											eData.Result = value + "." + "0".repeat(Stellen);
										} else {
											var integerPart = value.slice(0, decimalIndex);
											var decimalPart = value.slice(decimalIndex + 1);

											if (decimalPart.length < Stellen) {
												decimalPart = decimalPart + "0".repeat(Stellen - decimalPart.length);
											} else {
												decimalPart = decimalPart.slice(0, Stellen);
											}

											eData.Result = integerPart + '.' + decimalPart;
										}
									} else {
										eData.Result = data.ResValue;
									}
									// Code ended By Komal Nilakhe on 10102024
								}
							});
						});
						t.getOwnerComponent().getModel("RecordResultModel").refresh();
						BusyIndicator.hide();
						MessageBox.success(oResourceBun.getText("lblInspectionLot") + " " + oDigiSignPayload.Insplot + " " + oResourceBun.getText("lbldigitalsignaturehasbeensavedsuccessfully"));
						t.getOwnerComponent().getModel("AppModeModel").setProperty("/enableBtnDigitalSign", false);
						t.fnUploadFiles();
						t.fnRefreshFetchEquipFuncLoc();
					},
					function (err) {
						var erMsg = t.fnFormatErrorMessage(err);
						MessageBox.error(erMsg);
						BusyIndicator.hide();
					});
			}
		},
		/*	Method: fnCloseRusultWithoutDS
		 *	Description/Usage: Technically completion function from dialog
		 */
		fnCloseRusultWithoutDS: function (oEvent) {
			var t = this;
			//Code added by Komal on 17/10/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (aSelItems.length == 0) {
				MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
				return;
			}
			BusyIndicator.show(0);
			var oDigiSignPayload = t.fnFormatDigiSignPayload();
			var aExistinData = t.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			t.fnCreateEntitySet(oPostModel, "/InspLotRRHdrSet", oDigiSignPayload).then(
				function (successData) {
					var aCloseResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
					aCloseResult.forEach(function (data) {
						aExistinData.forEach(function (eData) {
							if (data.Inspchar === eData.CharNo) {
								eData.Evaluation = data.Evaluation;
								eData.ErrClass = data.ErrClass;
								eData.Status = data.Status;
								// Code Added By Komal Nilakhe on 10102024
								var Stellen = eData.Stellen;
								if (data.ResValue !== "" && !isNaN(parseFloat(data.ResValue))) {
									var value = data.ResValue;
									if (value.includes(",") == true) {
										value = value.replaceAll(",", ".");
									}
									// Check if there's a decimal point
									var decimalIndex = value.indexOf(".");
									if (decimalIndex === -1) {
										eData.Result = value + "." + "0".repeat(Stellen);
									} else {
										var integerPart = value.slice(0, decimalIndex);
										var decimalPart = value.slice(decimalIndex + 1);

										if (decimalPart.length < Stellen) {
											decimalPart = decimalPart + "0".repeat(Stellen - decimalPart.length);
										} else {
											decimalPart = decimalPart.slice(0, Stellen);
										}

										eData.Result = integerPart + '.' + decimalPart;
									}
								} else {
									eData.Result = data.ResValue;
								}
								// Code ended By Komal Nilakhe on 10102024
							}
						});
					});
					t.getOwnerComponent().getModel("RecordResultModel").refresh();
					BusyIndicator.hide();
					t.fnUploadFiles();
					MessageBox.success(oResourceBun.getText("lblInspectionLot") + " " + oDigiSignPayload.Insplot + " " + oResourceBun.getText("lbldigitalsignaturehasbeensavedsuccessfully"));
				},
				function (err) {
					var erMsg = t.fnFormatErrorMessage(err);
					MessageBox.error(erMsg);
					BusyIndicator.hide();
				});

		},
		/*	Method: fnResetNotificationData
		 *	Description/Usage: reset defect notification screen data
		 **/
		fnResetNotificationData: function () {
			var oNotifData = this.getOwnerComponent().getModel("NotificationModel");
			oNotifData.setProperty("/NotificationType", "");
			oNotifData.setProperty("/Priority", "");
			oNotifData.setProperty("/Description", "");
			oNotifData.setProperty("/Coordinator", "");
		},
		/*	Method: fnSaveData
		 *	Description/Usage: Save Inspection lot RR data to server, final save.
		 */
		fnSaveData: function (oEvent) {

			var t = this;
			//Code added by Komal on 17/10/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (aSelItems.length == 0) {
				MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
				return;
			}
			var oSavePayload = t.fnFormatSavePayload();
			//Below code added by Komal Nilakhe on 10-10-2024 -- Start
			var oRecordResultModel = this.getOwnerComponent().getModel("RecordResultModel");
			var aExistinData = oRecordResultModel.getProperty("/RecordResultSet");
			//Below code added by Komal Nilakhe on 10-10-2024 -- End
			var oAppData = t.getOwnerComponent().getModel("AppModeModel");
			var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			t.fnCreateEntitySet(oPostModel, "/InspLotRRHdrSet", oSavePayload).then(function (data) {
				//Below code added by Komal Nilakhe on 10-10-2024 -- Start
				var savedResult = data.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
				for (var i = 0; i < aExistinData.length; i++) {
					for (var j = 0; j < savedResult.length; j++) {
						if (aExistinData[i].CharNo === savedResult[j].Inspchar) {
							aExistinData[i].Status = savedResult[j].Status;
							aExistinData[i].Evaluation = savedResult[j].Evaluation;
							// Code Added By Komal Nilakhe on 10102024
							var Stellen = aExistinData[i].Stellen;

							if (!isNaN(parseFloat(savedResult[j].ResValue)) && savedResult[j].ResValue !== "") {
								var value = savedResult[j].ResValue;
								if (value.includes(",") == true) {
									value = value.replaceAll(",", ".");
								}
								// Check if there's a decimal point
								var decimalIndex = value.indexOf(".");
								if (decimalIndex === -1) {
									aExistinData[i].Result = value + "." + "0".repeat(Stellen);
								} else {
									var integerPart = value.slice(0, decimalIndex);
									var decimalPart = value.slice(decimalIndex + 1);

									if (decimalPart.length < Stellen) {
										decimalPart = decimalPart + "0".repeat(Stellen - decimalPart.length);
									} else {
										decimalPart = decimalPart.slice(0, Stellen);
									}

									aExistinData[i].Result = integerPart + '.' + decimalPart;
								}

							} else {
								aExistinData[i].Result = savedResult[j].ResValue;
							}
							// Code ended By Komal Nilakhe on 10102024								

						}
					}
				}
				oRecordResultModel.refresh();
				t.fnUploadFiles();
				//Cordinaytoe
				if (data.SAVE.Notif == "") {
					var validationStatue = t.fnSaveValidation();
					if (validationStatue === false) {
						if (t.getOwnerComponent().getModel("AppModeModel").getProperty("/bValidStatus") === true) {
							var oHDRModel = t.getOwnerComponent().getModel("InspectionLotHDRModel");
							var oNotifModel = t.getOwnerComponent().getModel("NotificationModel");
							if (oHDRModel.getProperty("/Defectnotif").length === 0) {
								if (oHDRModel.getProperty("/InspectionType") === "14") {
									oNotifModel.setProperty("/NotificationType", "X5");
								} else if (oHDRModel.getProperty("/InspectionType") === "Z14") {
									oNotifModel.setProperty("/NotificationType", "X6");
								}
								t.fnOpenFragment("NotificationCreate");
							}
						}
					}
					else {
						if (oAppData.getProperty("/SaveFrom") === "Valuate" || oAppData.getProperty("/SaveFrom") === "") {
							MessageBox.success(oResourceBun.getText("lblInspectionLot") + " " + oSavePayload.Insplot + " " + oResourceBun.getText("lbldatahasbeensavedsuccessfully"));
						}
						oAppData.setProperty("/bValuateSave", false);
						BusyIndicator.hide();
						t.fnRefreshResultData();
					}
				} else {
					if (oAppData.getProperty("/SaveFrom") === "Valuate" || oAppData.getProperty("/SaveFrom") === "") {
						MessageBox.success(oResourceBun.getText("lblInspectionLot") + " " + oSavePayload.Insplot + " " + oResourceBun.getText("lbldatahasbeensavedsuccessfully"));
					}
					oAppData.setProperty("/bValuateSave", false);
					BusyIndicator.hide();
					t.fnRefreshResultData();
				}
				//Below code added by Komal Nilakhe on 10-10-2024 -- End
				//Below code commented by Komal Nilakhe on 09-10-2024
				// else {
				// 	var sCRMsg = oResourceBun.getText("lblInspectionLot") + " " + oSavePayload.Insplot + " " + oResourceBun.getText("lblresulthasbeenclosedandsavedsuccessfully");
				// 	var nHdrDS = Number(t.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/DsNo"));
				// 	var nInPntDS = Number(t.getOwnerComponent().getModel("DigitalSignModel").getProperty("/DsNo"));
				// 	if ((nHdrDS - nInPntDS) === 1) {
				// 		sCRMsg = sCRMsg + " " + oResourceBun.getText("lblSeconddigitalsignatureisrequired");
				// 	}
				// 	MessageBox.success(sCRMsg, {
				// 		actions: [oResourceBun.getText("btnOK")],
				// 		onClose: function (oAction) {
				// 			if (oAction === oResourceBun.getText("btnOK")) {
				// 				//t.fnNavBack();
				// 			}
				// 		}
				// 	});
				// }



			}, function (err) {
				var erMsg = t.fnFormatErrorMessage(err);
				MessageBox.error(erMsg);
				BusyIndicator.hide();
			});
		},
		/*	Method: fnUploadFiles
		 *	Description/Usage: function used for upload files again work order
		 */
		fnUploadFiles: function () {
			//code commented by Komal on 07/11/2024
			// var oAttachmentUpl = this.byId("idUploadSet");
			// var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
			// var t = this;
			// var sInspectLotNo = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/InspectionLot");
			// aIncompleteItems.forEach(function (incompleteItem) {
			// 	var sFileName = incompleteItem.getProperty("fileName");
			// 	var oXCSRFToken = new sap.ui.core.Item({
			// 		key: "X-CSRF-Token",
			// 		text: t.getOwnerComponent().getModel("oDataInspectionLotModel").getSecurityToken()
			// 	});
			// 	var oSlug = new sap.ui.core.Item({
			// 		key: "SLUG",
			// 		text: sInspectLotNo + sFileName
			// 	});
			// 	oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug).uploadItem(incompleteItem);
			// 	oAttachmentUpl.removeAllHeaderFields();
			// });
			//code added by Komal on 07/11/2024 -- Start
			var that = this;
			var oAttachmentModel = this.getOwnerComponent().getModel("AttachmentModel");
			var aAttachmentData = oAttachmentModel.getProperty("/FileSet");
			var sInspectionLot = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/InspectionLot");
			var aDataToUpload = this.getInCompleteAttachments(aAttachmentData);
			aDataToUpload.forEach(function (oItem) {
				var sFileName = oItem.File_name;
				var oDataPostModel = that.getOwnerComponent().getModel("oDataInspectionLotModel");
				var sType = oItem.Content ? "ZQI" : "ZWB";
				var sSlug = "";
				var oXCSRFToken = oDataPostModel.getSecurityToken();
				if (sType === "ZWB") {
					sSlug = sInspectionLot + ";" + sType + ";" + sFileName + ";" + oItem.File_desc;
				} else {
					sSlug = sInspectionLot + ";" + sType + ";" + sFileName;
				}
				var sUrl = "" + oDataPostModel.sServiceUrl + "/InspLotATTSet";
				that.onPostAttachmentData(sUrl, sSlug, oXCSRFToken, oItem.Mimetype, oItem.oFile);
			});
			//code added by Komal on 07/11/2024-- End
		},
		/*	Method: onPostAttachmentData
		 *	Created By: Jani Basha 	|Created On: 04-09-2024
		 *	Description/Usage: Method post attachment data
		 */
		onPostAttachmentData: function (sUrl, sSlug, oXCSRFToken, Mimetype, oFile) {
			var oXhr = new window.XMLHttpRequest();
			return new Promise(function (resolve, reject) {
				oXhr.open("POST", sUrl, true);
				oXhr.setRequestHeader("SLUG", sSlug);
				oXhr.setRequestHeader("X-CSRF-Token", oXCSRFToken);
				if ((Device.browser.edge || Device.browser.internet_explorer) && oFile.type && oXhr.readyState === 1) {
					oXhr.setRequestHeader("Content-Type", oFile.type);
				}
				oXhr.onreadystatechange = function () {
					if (this.readyState === window.XMLHttpRequest.DONE) {
						if (this.status === 200) {
							resolve(this);
						} else {
							reject(this);
						}
					}
				};
				oXhr.send(oFile);
			});
		},

		/*	Method: fnRefreshResultData
		 *	Description/Usage: function used for refresh the data after save and close
		 */
		fnRefreshResultData: function () {



			var aResultData = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var oAppModeModel = this.getOwnerComponent().getModel("AppModeModel");
			var bStatusCheck = false;
			var bStatusCheckVal = false;
			aResultData.forEach(function (rData) {
				if (Number(rData.Status) === 5) {
					bStatusCheck = true;
				}
				if (Number(rData.Status) === 3) {
					bStatusCheckVal = true;
				}
			});

			var sSelectPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var oEquipModel = this.getOwnerComponent().getModel("EquipmentModel");



			if (bStatusCheck === true) {
				oEquipModel.setProperty(sSelectPath + "/enbaleTestEquip", false);
				oAppModeModel.setProperty("/enableRRvalues", false);

				/* Code Commented by Hari Krishna Starts Here - 27062024
				
					oAppModeModel.setProperty("/enableBtnSave", false);
				
				Code Commented by Hari Krishna Ends Here - 27062024 */

				// Code Written by Hari Krishna Starts Here - 27062024
				oAppModeModel.setProperty("/enableBtnSave", true);
				// Code Written by Hari Krishna Ends Here - 27062024


				/* Code Commented by Hari Krishna Starts Here - 27062024
				
				oAppModeModel.setProperty("/enableBtnValuate", false);

				Code Commented by Hari Krishna Ends Here - 27062024 */

				// Code Written by Hari Krishna Starts Here - 27062024
				oAppModeModel.setProperty("/enableBtnValuate", true);
				// Code Written by Hari Krishna Ends Here - 27062024

				oAppModeModel.setProperty("/enableBtnValuateQM", true); //QM Code
				oAppModeModel.setProperty("/enableBtnSaveQM", true);//QM Code
			} else if (bStatusCheckVal === true) {
				oEquipModel.setProperty(sSelectPath + "/enbaleTestEquip", false);
				oAppModeModel.setProperty("/enableRRvalues", false);

				/* Code Commented by Hari Krishna Starts Here - 27062024

				oAppModeModel.setProperty("/enableBtnSave", false);

				Code Commented by Hari Krishna Ends Here - 27062024 */

				// Code Written by Hari Krishna Starts Here - 27062024
				oAppModeModel.setProperty("/enableBtnSave", true);
				// Code Written by Hari Krishna Ends Here - 27062024

				/* Code Commented by Hari Krishna Starts Here - 27062024

				oAppModeModel.setProperty("/enableBtnValuate", false);

				Code Commented by Hari Krishna Ends Here - 27062024 */

				// Code Written by Hari Krishna Starts Here - 27062024
				oAppModeModel.setProperty("/enableBtnValuate", true);
				// Code Written by Hari Krishna Ends Here - 27062024

				oAppModeModel.setProperty("/enableBtnValuateQM", true); //QM Code
				oAppModeModel.setProperty("/enableBtnSaveQM", true);//QM Code
			} else {
				oEquipModel.setProperty(sSelectPath + "/enbaleTestEquip", true);
				oAppModeModel.setProperty("/enableRRvalues", true);
				oAppModeModel.setProperty("/enableBtnSave", true);
				oAppModeModel.setProperty("/enableBtnValuate", true);
				oAppModeModel.setProperty("/enableBtnValuateQM", true); //QM Code
				oAppModeModel.setProperty("/enableBtnSaveQM", true);//QM Code
			}
			this.fnDigitalSignValidation();
		},
		/*	Method: fnResetAttachment
		 *	Description/Usage: reset all completed and incompleted attachment
		 */
		fnResetAttachment: function () {
			var oUploadSet = this.getView().byId("idUploadSet");
			oUploadSet.removeAllIncompleteItems();
			this.fnRefreshAttachment();
		},
		/*	Method: fnResetButtonsFields
		 *	Description/Usage: reset all buttons and fields
		 */
		fnResetButtonsFields: function () {



			var oAppMode = this.getOwnerComponent().getModel("AppModeModel");
			oAppMode.setProperty("/enableBtnEquipment", true);
			oAppMode.setProperty("/enableRRvalues", true);
			oAppMode.setProperty("/enableBtnSave", false);
			oAppMode.setProperty("/enableBtnValuate", false);
			oAppMode.setProperty("/enableBtnClose", false);
			oAppMode.setProperty("/enableBtnDigitalSign", false);
			oAppMode.setProperty("/enableBtnSaveQM", false); //QM COde
			oAppMode.setProperty("/enableBtnValuateQM", false); //QM COde
		},
		/*	Method: fnValidateScannedBarcode
		 *	Description/Usage: validate scanned barcode, common functionality
		 */
		fnValidateScannedBarcode: function (scanField) {
			if (scanField === "/FunctionalLocation") {
				this.onChangeFuncLoc();
			} else if (scanField === "/ProductionOrder") {//Code CR 5000026736 Veera Sudheer
				this.onChangeProdOrder();//Code CR 5000026736 Veera Sudheer
			} else if (scanField === "/Sample") {//Code CR 5000026736 Veera Sudheer
				this.onSample();//Code CR 5000026736 Veera Sudheer
			} else if (scanField === "/Equipment") {
				this.onChangeEquipment();
			} else {
				this.onChangeEquipmentDetailScan();
			}
		},
		/*	Method: fnRefreshFetchEquipFuncLoc
		 *	Description/Usage: fetch equipment or functional location based on operation selected
		 **/
		fnRefreshFetchEquipFuncLoc: function () {
			var t = this;
			t.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var aFilter = [];
			var oFilterModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			if (oFilterModel.getProperty("/InspectionLot").length > 0) {
				aFilter.push(new Filter("Insplot", FilterOperator.EQ, oFilterModel.getProperty("/InspectionLot")));
			}
			if (oFilterModel.getProperty("/SelOperationNo").length > 0) {
				aFilter.push(new Filter("Inspoper", FilterOperator.EQ, oFilterModel.getProperty("/SelOperationNo")));
			}
			var param = { "filters": aFilter };
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				this.fnReadEntitySet(t.oDataInspectionLotModel, "/InspLotpntSet", param).then(
					function (dataResult) {
						var aResult = [];
						dataResult.results.forEach(function (data) {
							var srhItem = {
								"InspectionLot": data.Insplot,
								"Inspoper": data.Inspoper,
								"InspectionPoint": data.Insppoint,
								"Equipment": data.Equipment,
								"FunctLoc": data.FunctLoc,
								"Material": data.Material,
								"Batch": data.Batch,
								"FLocTxt": data.FLocTxt,
								"TestEqui": data.TestEqui,
								"EquiDesc": data.EquiDesc,
								"DsNo": data.DsNo,
								"DsUser": data.DsUser,
								"Defectnotif": data.Defectnotif,
								"enbaleTestEquip": false,
								"TestEquiDesc": data.TestEquiDesc,
								"TestEquipDms": data.TEST_EQUI_DMS,
								"EquipDms": data.EQUIPMENT_DMS,
								"FuncLocDms": data.FUNCT_LOC_DMS
							};
							aResult.push(srhItem);
						});
						t.getOwnerComponent().getModel("EquipmentModel").setProperty("/EquipmentSet", aResult);
						t.getOwnerComponent().getModel("EquipmentModel").refresh();
						t.fnRefreshResultData();
						BusyIndicator.hide();
					}, function (err) {
						BusyIndicator.hide();
						MessageBox.error(oResourceBun.getText("lblUnabletofilter"));
					});
			}
		},
		onDialogCreateInspLot: function (oEvent) {
			var eve = oEvent.getSource();
			var that = this;
			var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oInspModel = this.getOwnerComponent().getModel("LocalInspModel").getData();
			var oHeaderModel = this.getOwnerComponent().getModel("InspectionLotHDRModel").getData();
			var Payload = {
				"Prueflos": oHeaderModel.InspectionLot,
				"Vornr": oHeaderModel.SelOperationNo,
				"Prtyp": oInspModel.SampleCategory,
				"Gbtyp": oInspModel.SampleCntr,
				"Menge": oInspModel.SampleQuantity,
				"Meinh": oInspModel.UOM
			};
			this.fnCreateEntitySet(oPostModel, "/InspOprNewSampleSet", Payload).then(
				function (successData) {
					MessageBox.success(successData.Phynr + " " + oResourceBun.getText("lblCreated"));
					BusyIndicator.hide();
					eve.getParent().close();
					that.fnFetchEquipFuncLoc(successData.Vornr);
				},
				function (err) {
					eve.getParent().close();
					var erMsg = JSON.parse(err.responseText);
					MessageBox.error(erMsg.error.message.value);
					BusyIndicator.hide();
				});
		},
		onCalculate: function (oEvent) {
			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			var t = this;
			var oResource = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			// var calculateFilter = this.onCalculateFilter(Selected);
			var fiterModel = this.getOwnerComponent().getModel("filterModel");
			var aFilter = [];
			aFilter.push(new Filter("Inspchar", FilterOperator.EQ, Selected.Inspchar));
			aFilter.push(new Filter("Insplot", FilterOperator.EQ, Selected.InspectionLot));
			aFilter.push(new Filter("Insppoint", FilterOperator.EQ, Selected.Insppoint));
			aFilter.push(new Filter("Vorglfnr", FilterOperator.EQ, Selected.Vorglfnr));
			aFilter.push(new Filter("Werks", FilterOperator.EQ, fiterModel.getProperty("/Plant")));
			var param = { "filters": aFilter };
			if (this.fnValidation() === true) {
				// if (this.getOwnerComponent().getModel("AppModeModel").getProperty("/CurrentlyChanged") === true) {
				// 	//MessageBox.information(oResource.getText("lblResultshavechangedre-valuatebeforesaving")); //commented by Komal Nilakhe on 081024
				// } else {
				this.fnReadEntitySet(oDataInspectionLotModel, "/CalculateResultSet", param).then(
					function (dataResult) {
						var aResult = [];
						var mod = t.getOwnerComponent().getModel("RecordResultModel").getData().RecordResultSet;
						var refMod = t.getOwnerComponent().getModel("RecordResultModel")
						mod.forEach(function (Obj, index) {
							if (Obj.Inspchar === dataResult.results[0].Inspchar) {
								t.getOwnerComponent().getModel("RecordResultModel").setProperty("/RecordResultSet/" + index + "/Result", dataResult.results[0].ResValue);
							}
						});

						BusyIndicator.hide();
					}, function (err) {
						BusyIndicator.hide();
						var errMsg = JSON.parse(err.responseText);
						MessageBox.error(errMsg.error.message.value);
					});
				//}
			}
		},

		onLongText: function (oEvent) {
			BusyIndicator.show(0);
			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			var t = this;
			var oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");


			/* Code Written by Hari Krishna Starts Here 04072024 */
			var selectedREL = this.getOwnerComponent().getModel("filterModel").getProperty("/selectedREL");
			var inspectionlottypes = this.getOwnerComponent().getModel("filterModel").getProperty("/inspectionlottypes");
			var selectPMQM = (inspectionlottypes === 0) ? "PM" : "QM";
			/* Code Written by Hari Krishna Ends Here 04072024 */

			var aFilter = [];

			aFilter.push(new Filter("Insplot", FilterOperator.EQ, Selected.InspectionLot));
			aFilter.push(new Filter("Inspoper", FilterOperator.EQ, Selected.Inspoper));
			aFilter.push(new Filter("Insppoint", FilterOperator.EQ, Selected.Insppoint));
			aFilter.push(new Filter("Vorglfnr", FilterOperator.EQ, Selected.Vorglfnr));
			aFilter.push(new Filter("Inspchar", FilterOperator.EQ, Selected.Inspchar));
			aFilter.push(new Filter("ApplType", FilterOperator.EQ, selectPMQM));	// Code Written By Hari Krishna 04072024

			var param = { "filters": aFilter };
			this.fnReadEntitySet(oDataInspectionLotModel, "/InspLotCharLongTextSet", param).then(
				function (dataResult) {
					var aResult = [];
					var text1 = "";
					dataResult.results.forEach(function (data) {
						var srhItem = {
							"Lines": data.Lines,
						};
						aResult.push(srhItem);

					});
					aResult.forEach(function (oItem) {
						text1 = text1 + oItem.Lines + "\n";
					});
					if (!t.oWarningMessageDialog) {
						t.oWarningMessageDialog = new Dialog({
							type: DialogType.Message,
							title: "Long Text",
							content: new Text({ text: text1 }),
							beginButton: new Button({
								type: ButtonType.Emphasized,
								text: "OK",
								press: function () {
									t.oWarningMessageDialog.close();
									t.oWarningMessageDialog = undefined;
								}.bind(t)
							})
						});
					}

					t.oWarningMessageDialog.open();
					BusyIndicator.hide();
				}, function (err) {
					BusyIndicator.hide();
					var errMsg = JSON.parse(err.responseText);
					MessageBox.error(errMsg.error.message.value);
				});


		},
		onChart: function (oEvent) {
			// this.getView().byId("idWizard").getSteps()[4]._activate();

			BusyIndicator.show(0);
			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			var t = this;
			t.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
			var reflinmod = this.getOwnerComponent().getModel('ReferenceLineModel');
			var aFilter = [];
			aFilter.push(new Filter("InspLot", FilterOperator.EQ, Selected.InspectionLot));
			aFilter.push(new Filter("InspPoint", FilterOperator.EQ, Selected.Insppoint));
			aFilter.push(new Filter("CurrNode", FilterOperator.EQ, Selected.Vorglfnr));
			aFilter.push(new Filter("InspChar", FilterOperator.EQ, Selected.Inspchar));
			var param = { "filters": aFilter };
			var that = this;
			this.fnReadEntitySet(t.oDataInspectionLotModel, "/ControlChartSet", param).then(
				function (dataResult) {
					var aResult = [];
					if (dataResult.results.length !== 0) {
						dataResult.results.forEach(function (data) {
							var srhItem = {
								"CenterLine": data.CenterLine,
								"CurrNode": data.CurrNode,
								"InspChar": data.InspChar,
								"InspLot": data.InspLot,
								"InspPoint": data.InspPoint,
								"LowerActionLimit": data.LowerActionLimit,
								"LowerWarningLimit": data.LowerWarningLimit,
								"Mittelwert": data.Mittelwert,
								"UpperActionLimit": data.UpperActionLimit,
								"UpperWarningLimit": data.UpperWarningLimit
							};
							aResult.push(srhItem);
						});
						// var oVizFrame = new sap.viz.ui5.controls.VizFrame;
						// oVizFrame.setVizType('line');
						that.getOwnerComponent().getModel("FlatDataSeteModel").setData(aResult);
						var oVizFrame = that.getView().byId("vizFrame");
						oVizFrame.removeAllFeeds();
						var jsonData = new sap.ui.model.json.JSONModel();
						jsonData.setData(aResult);
						oVizFrame.setVizProperties({
							plotArea: {
								colorPalette: d3.scale.category20().range(),
								dataLabel: {
									showTotal: true
								}
							},
							tooltip: {
								visible: true
							}
						});
						var oDataset = new sap.viz.ui5.data.FlattenedDataset({
							dimensions: [{
								name: "InspLot",
								value: "{InspLot}"
							}],

							measures: [{
								name: "Mittelwert",
								value: "{Mittelwert}"
							}],

							data: {
								path: "/"
							}
						});
						oVizFrame.setDataset(oDataset);

						oVizFrame.setModel(jsonData);
						var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "valueAxis",
							"type": "Measure",
							"values": ["Mittelwert"]
						});
						var oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
							"uid": "categoryAxis",
							"type": "Dimension",
							"values": ["InspLot"]
						});
						var refMod = that.getOwnerComponent().getModel("ReferenceLineModel")
						var oText = that.getOwnerComponent().getModel("i18n").getResourceBundle();
						refMod.setProperty("/0", dataResult.results[0].UpperActionLimit);
						refMod.setProperty("/1", dataResult.results[0].UpperWarningLimit);
						refMod.setProperty("/2", dataResult.results[0].CenterLine);
						refMod.setProperty("/3", dataResult.results[0].LowerWarningLimit);
						refMod.setProperty("/4", dataResult.results[0].LowerActionLimit);
						var RefLines2 = [];
						var color = ["red", "red", "green", "red", "red"];
						var type = ["solid", "dotted", "solid", "dotted", "solid"];
						var size = [3, 2, 1, 2, 3];
						var TargetValues = refMod.getData();
						for (var i = 0; i < 5; i++) {
							RefLines2.push({
								value: TargetValues[i],
								visible: true,
								size: size[i],
								type: type[i],
								color: color[i],
								label: {
									text: TargetValues[i],
									visible: true
								}
							}
							);
						}
						oVizFrame.setVizProperties({
							plotArea: {
								dataLabel: {
									visible: true
								},
								referenceLine: {
									line: {
										valueAxis: RefLines2
									}
								}
							},
							valueAxis: {
								title: {
									visible: true,
									text: oText.getText("lblShewartCharts")
								}
							},
							categoryAxis: {
								title: {
									visible: true,
									text: oText.getText("lblInspectionLot")
								}
							},
							title: { text: "" },
							legend: { visible: false }
						});
						oVizFrame.addFeed(oFeedValueAxis);
						oVizFrame.addFeed(oFeedCategoryAxis);
						var tha = that;
						// var oDialog1 = new sap.m.Dialog();
						// oDialog1.addContent(oVizFrame);
						// oDialog1.addButton(new sap.m.Button({
						// 	text: oText.getText("lblContolLimits"),
						// 	press: function (oEvent) { that.onControlLimits(oEvent) }
						// }));
						// oDialog1.addButton(new sap.m.Button({ text: oText.getText("lblok"), press: function () { oDialog1.close(); } }));
						// oDialog1.open();
						that.getOwnerComponent().getModel("filterModel").setProperty("/chart", true);
						BusyIndicator.hide();
					}
					else {
						BusyIndicator.hide();
					}
					BusyIndicator.hide();
				}, function (err) {
					BusyIndicator.hide();
					MessageBox.error(oResourceBun.getText("lblUnabletofilter"));
				});
		},
		// onControlLimits: function (oEvent) {
		// 	var t = this;
		// 	var oText = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		// 	var model1 = this.getOwnerComponent().getModel("ReferenceLineModel");
		// 	sap.ui.getCore().setModel(model1);
		// 	var oDialog2 = new sap.m.Dialog({
		// 		title: oText.getText("lblControlLimits"),
		// 		resizable: true,
		// 		content: [new sap.m.Input({
		// 			description: oText.getText("lblUpperWarningLimit"),
		// 			value: "{/0}"
		// 		}),
		// 		new sap.m.Input({
		// 			description: oText.getText("lblUpperActionLimit"),
		// 			value: "{/1}"
		// 		}),
		// 		new sap.m.Input({
		// 			description: oText.getText("lblCenterLine"),
		// 			value: "{/2}"
		// 		}),
		// 		new sap.m.Input({
		// 			description: oText.getText("lblLowerWarningLimit"),
		// 			value: "{/3}"
		// 		}),
		// 		new sap.m.Input({
		// 			description: oText.getText("lblLowerActionLimit"),
		// 			value: "{/4}"
		// 		})],
		// 		beginButton: new sap.m.Button({
		// 			type: sap.m.ButtonType.Emphasized,
		// 			text: oText.getText("lblSubmit"),
		// 			press: function (oEvent) {
		// 				// MessageToast.show("Submit pressed!");
		// 				oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
		// 					plotArea: {
		// 						referenceLine: {
		// 							line: {
		// 							}
		// 						}
		// 					}
		// 				})
		// 				var RefLines2 = [];
		// 				var TargetValues = this.getOwnerComponent().getModel("ReferenceLineModel").getData();
		// 				for (var i = 0; i < 5; i++) {
		// 					RefLines2.push({
		// 						value: TargetValues[i],
		// 						visible: true,
		// 						size: 1,
		// 						type: "dotted",
		// 						label: {
		// 							text: TargetValues[i],
		// 							visible: true
		// 						}
		// 					}
		// 					);
		// 				}
		// 				oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
		// 					plotArea: {
		// 						referenceLine: {
		// 							line: {
		// 							}
		// 						}
		// 					}
		// 				});
		// 				oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
		// 					plotArea: {
		// 						dataLabel: {
		// 							visible: true
		// 						},
		// 						referenceLine: {
		// 							line: {
		// 								valueAxis: RefLines2
		// 							}

		// 						}

		// 					}
		// 				});
		// 				oEvent.getSource().getParent().close();
		// 				oEvent.getSource().getParent().destroy();

		// 			}.bind(this)
		// 		}),
		// 		endButton: new sap.m.Button({
		// 			text: oText.getText("lblClose"),
		// 			press: function (oEvent) {
		// 				oEvent.getSource().getParent().close();
		// 				oEvent.getSource().getParent().destroy();
		// 			}.bind(this)
		// 		})

		// 	});
		// 	var mod = t.getOwnerComponent().getModel("ReferenceLineModel");
		// 	oDialog2.setModel(mod)
		// 	oDialog2.open();
		// },
		onControlLimits: function (oEvent) {
			var data1 = oEvent.getSource();
			var data = data1.getParent().getContent()[1].getParent().getParent().getContent()[1];
			var t = this;
			var oText = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var model1 = this.getOwnerComponent().getModel("ReferenceLineModel");
			sap.ui.getCore().setModel(model1);
			var oDialog2 = new sap.m.Dialog({
				id: "controlID",
				title: oText.getText("lblControlLimits"),
				resizable: true,
				content: [new sap.m.Input({
					description: oText.getText("lblUpperActionLimit"),
					value: "{/0}"
				}),
				new sap.m.Input({
					description: oText.getText("lblUpperWarningLimit"),
					value: "{/1}"
				}),
				new sap.m.Input({
					description: oText.getText("lblCenterLine"),
					value: "{/2}"
				}),
				new sap.m.Input({
					description: oText.getText("lblLowerWarningLimit"),
					value: "{/3}"
				}),
				new sap.m.Input({
					description: oText.getText("lblLowerActionLimit"),
					value: "{/4}"
				})],
				beginButton: new sap.m.Button({
					type: sap.m.ButtonType.Emphasized,
					text: oText.getText("lblSubmit"),
					press: function (oEvent) {
						var data = this.getView().byId("vizFrame");
						// MessageToast.show("Submit pressed!");
						// oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
						data.setVizProperties({
							plotArea: {
								referenceLine: {
									line: {
									}
								}
							}
						})
						var RefLines2 = [];
						var TargetValues = this.getOwnerComponent().getModel("ReferenceLineModel").getData();
						var color = ["red", "red", "green", "red", "red"];
						var type = ["solid", "dotted", "solid", "dotted", "solid"];
						var size = [3, 2, 1, 2, 3];
						for (var i = 0; i < 5; i++) {
							RefLines2.push({
								value: TargetValues[i],
								visible: true,
								color: color[i],
								size: size[i],
								type: type[i],
								label: {
									text: TargetValues[i],
									visible: true
								}
							}
							);
						}
						// oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
						data.setVizProperties({

							plotArea: {
								referenceLine: {
									line: {
									}
								}
							}
						});
						// oEvent.getSource().getParent().getParent().getContent()[0].getContent()[0].setVizProperties({
						data.setVizProperties({

							plotArea: {
								dataLabel: {
									visible: true
								},
								referenceLine: {
									line: {
										valueAxis: RefLines2
									}

								}

							}
						});
						oEvent.getSource().getParent().close();
						oEvent.getSource().getParent().destroy();

					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: oText.getText("lblClose"),
					press: function (oEvent) {
						oEvent.getSource().getParent().close();
						oEvent.getSource().getParent().destroy();
					}.bind(this)
				})

			});
			var mod = t.getOwnerComponent().getModel("ReferenceLineModel");
			oDialog2.setModel(mod)
			oDialog2.open();
		},
		/*	Method: fnForamatAttachmentFileType
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Method used to fetch upload file types
		 */
		fnForamatAttachmentFileType: function (aData) {
			var oAttachmentModel = this.getOwnerComponent().getModel("AttachmentModel");
			var afileFormat = [];
			for (var i = 0; i < aData.results.length; i++) {
				afileFormat.push(aData.results[i].File_format.replace("*.", ""));
			}
			oAttachmentModel.setProperty("/supportedFileTypes", afileFormat);
		},
		/*	Method: setEquipmentDMS
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: common method used to fetch equipment dms
		 */
		setEquipmentDMS: function () {
			var oDataPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var oEquipmentDataModel = this.getOwnerComponent().getModel("EquipmentModel");
			var sEquipment = oEquipmentDataModel.getProperty("/TestEquipDms");
			oEquipmentDataModel.setProperty("/EqunrDMS", '');
			if (sEquipment) {
				var aFilters = [(new Filter("Objky", FilterOperator.EQ, sEquipment)), (new Filter("FieldName", FilterOperator.EQ, 'EQUI'))];
				var mParams = { "filters": aFilters };
				this.fnReadEntitySet(oDataPostModel, "/HeaderAttSet/$count", mParams).then(function (oResponse) {
					const count = parseInt(oResponse);
					if (count > 0) {
						oEquipmentDataModel.setProperty("/TestEquipDms", 'X');
					}
				}.bind(this));
			}
		},
	});
});