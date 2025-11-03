sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"com/reckitt/zqminsplotrr/model/formatter",
	"sap/ui/core/ValueState",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/SearchField",
	"sap/m/Token",
	"sap/m/Button",
], function (BaseController, Controller, Fragment, MessageBox, JSONModel, Dialog, formatter, ValueState, BusyIndicator, Filter, FilterOperator, SearchField, Token, Button) {
	"use strict";
	var oResource;
	return BaseController.extend("com.reckitt.zqminsplotrr.controller.InspectionLotDetail", {
		formatter: formatter,
		/*	Method: onInit
		 *	Description/Usage: Initiating pre required service and pattern based render functionality
		 */
		onInit: function () {
			oResource = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this._onObjectMatched, this);
		},
		/*	Method: _onObjectMatched
		 *	Description/Usage: if pattern matches it will trigger and load workorder details
		 **/
		_onObjectMatched: function (oEvent) {
			

			this.fnResetDetailScreenInit();
			
			if (oEvent.getParameter("arguments").InspectionLotNo === undefined) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("InspectionLotRR");
			} else {
				this.fnLoadInspectionLot(oEvent.getParameter("arguments").InspectionLotNo);
			}
		},
		/*	Method: onVHCoordinator
		 *	Description/Usage: open Value Help Data for Coordinator
		 **/
		onVHCoordinator: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblCoordinator"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "User");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Name");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/UserSetColumn");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/UserDataSet");
			
			var entityset = "UserDataSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHEquipment
		 *	Description/Usage: open Value Help Data for Equipment
		 **/
		onVHEquipment: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblEquipment"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Equipment");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/equipment");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/Equipment");
			var entityset = "Equipment";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHTestEquipment
		 *	Description/Usage: open Value Help Data for test Equipment
		 **/
		onVHTestEquipment: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblTestEquipment"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Equnr");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Eqktu");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/TestEquipColumn");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/TestEquipSHSet");
			var entityset = "TestEquipSHSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHPlannerGroup
		 *	Description/Usage: open Value Help Data for PlannerGroup
		 **/
		onVHPlannerGroup: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblPlannerGroup"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "PlannerGroup");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "PlGroupName");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/plannergroup");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/PlannerGroup");
			var entityset = "PlannerGroup";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHWorkCenter
		 *	Description/Usage: open Value Help Data for WorkCenter
		 **/
		onVHWorkCenter: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblWorkCenter"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "WorkCenterID");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Plant");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/ColWorkCenter");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/WorkCenter");
			var entityset = "WorkCenter";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		onVHSampleCategory: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblSampCategory"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Sample");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Text");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/SampleCat");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/SampleCategory");
			var entityset = "SampleCategorySet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		onVHSampleCntr: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblSampCntr"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Sample");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Text");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/SampleCntr");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/SampleContainer");
			var entityset = "SamplContainerSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onBCSFuncLoc
		 *	Description/Usage: bar code scan initiated for functional location
		 **/
		onBCSFuncLoc: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/FunctionalLocation";
			this.fnScanBarCode(updModel, updProperty);
		},
		/*	Method: onBCSEquipment
		 *	Description/Usage: bar code scan initiated for functional equipment
		 **/
		onBCSEquipment: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/Equipment";
			this.fnScanBarCode(updModel, updProperty);
		},
		/*	Method: onBCSTestEquipment
		 *	Description/Usage: bar code scan initiated for test equipment
		 **/
		onBCSTestEquipment: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("EquipmentModel");
			var updProperty = oEvent.getSource().getParent().getBindingContextPath() + "/TestEqui";
			this.fnScanBarCode(updModel, updProperty);
		},
		/*	Method: onLiveSearchInspectionLot
		 *	Description/Usage: on live search event for inspection lot to search table
		 **/
		onLiveSearchInspectionLot: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var oFilter = new Filter({
				filters: [
					new Filter("Notification", FilterOperator.Contains, sQuery),
					new Filter("NotificationType", FilterOperator.Contains, sQuery),
					new Filter("FunctionalLocation", FilterOperator.Contains, sQuery),
					new Filter("Description", FilterOperator.Contains, sQuery)
				]
			});
			var oBinding = oEvent.getSource().getParent().getParent().getBinding("items");
			oBinding.filter(oFilter);
			var tablen = oEvent.getSource().getParent().getParent().getBinding("items").getLength();
			if (tablen === 1) {
				var notiNo = oEvent.getSource().getParent().getParent().getItems()[0].getCells()[0].getText();
				MessageBox.show(oResource.getText("lblWouldyouliketoviewdetailofnotification") + " " + notiNo, {
					icon: sap.m.MessageBox.Icon.NONE,
					title: oResource.getText("lblGoToDetailScreen"),
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (oAction) {
					},
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			}
		},
		/*	Method: onCommonItemSelected
		 *	Description/Usage: common method used for wizard step selection equipment and inspection point
		 **/
		onCommonItemSelected: function (oEvent) {
			
			

			var sCurrentStepId = oEvent.getSource().getParent().getId();
			sCurrentStepId = sCurrentStepId.split("-").pop();
			var oWizard = oEvent.getSource().getParent().getParent();
			this.getOwnerComponent().getModel("filterModel").setProperty("/chart", false); //QM code
			if (sCurrentStepId === "OperationStep") {
				var operationno = oEvent.getSource().getSelectedItem().getCells()[0].getText();
				this.fnFetchEquipFuncLoc(operationno);
				oWizard.setCurrentStep(oWizard.getSteps()[1]);
				oWizard.getSteps()[3]._activate();
				oWizard.getSteps()[1].getContent()[0].setSelectedContextPaths([]);
				oWizard.getSteps()[2].getContent()[0].setSelectedContextPaths([]);
			} else if (sCurrentStepId === "EquipmentStep") {
				var sInspPoint = oEvent.getSource().getSelectedItem().getCells()[0].getText();
				
				// var sTestEquip = oEvent.getSource().getSelectedItem().getCells()[3].getText(); Code Commented By Hari Krishna on 16072024
				var sTestEquip = oEvent.getSource().getSelectedItem().getCells()[5].getValue(); // Code Written by Hari Krishna on 16072024

				var oSelectedObject = oEvent.getSource().getModel("EquipmentModel").getObject(oEvent.getSource().getSelectedContextPaths()[0]);
				this.getOwnerComponent().getModel("DigitalSignModel").setData(oSelectedObject);
				this.getOwnerComponent().getModel("AppModeModel").setProperty("/SelectedInspectionPath", oEvent.getSource().getSelectedContextPaths()[0]);
				this.fnFetchInspectionRecord(oEvent,sInspPoint, sTestEquip);
				oWizard.setCurrentStep(oWizard.getSteps()[2]);
				oWizard.getSteps()[3]._activate();
				this.fnInspTestEquipEnable(oEvent);
			}
		},
		/*	Method: fnInspTestEquipEnable
		 *	Description/Usage: on selected inspection point test equipment only allowed to edit.
		 **/
		fnInspTestEquipEnable: function (oEvent) {
			var sSelectedContextPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var oTableModel = this.getOwnerComponent().getModel("EquipmentModel");
			var aItems = oEvent.getSource().getItems();
			aItems.forEach(function (item) {
				if (item.getBindingContextPath() === sSelectedContextPath) {
					oTableModel.setProperty(item.getBindingContextPath() + "/enbaleTestEquip", true);
				} else {
					oTableModel.setProperty(item.getBindingContextPath() + "/enbaleTestEquip", false);
				}
			});
		},
		/*	Method: onNavBack
		 *	Description/Usage: naviagation back to filter screen or home screen
		 **/
		onNavBack: function (oEvent) {
			this.fnResetDetailScreen(oEvent);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("InspectionLotRR");
		},
		/*	Method: onExitNav
		 *	Description/Usage: exit application and navigate to fiori launchpad
		 **/
		onExitNav: function (oEvent) {
			this.fnNavBack();

		},
		/*	Method: onChangeRResult
		 *	Description/Usage: closed result value change captured
		 **/
		onChangeRResult: function (oEvent) {
			this.getOwnerComponent().getModel("AppModeModel").setProperty("/CurrentlyChanged", true);
		},
		/*	Method: onLiveChangeRRDescription
		 *	Description/Usage: on live result table description change captured
		 **/
		onLiveChangeRRDescription: function (oEvent) {
			this.getOwnerComponent().getModel("AppModeModel").setProperty("/CurrentlyChanged", true);
		},
		/*	Method: onValuate
		 *	Description/Usage: valuate entire data to server 
		 **/
		onValuate: function (oEvent) {
			var t = this;
			//Code added by Komal on 17/10/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (aSelItems.length == 0) {
				MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
				return;
			}
			if (this.fnValidation() === true) {
				BusyIndicator.show(0);
				var payload = t.fnFormatValuatePayload();
				var oDataInspectionLotModel = t.getOwnerComponent().getModel("oDataInspectionLotModel");
				var aExistinData = t.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
				var oAppStateModel = t.getOwnerComponent().getModel("AppModeModel");
				this.fnCreateEntitySet(oDataInspectionLotModel, "/InspLotRRHdrSet", payload).then(function (successData) {
					var valuatedResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
					valuatedResult.forEach(function (data) {
						aExistinData.forEach(function (eData) {
							if (data.Inspchar === eData.CharNo) {
								eData.Evaluation = data.Evaluation;
								eData.ErrClass = data.ErrClass;
								eData.Status = data.Status;								
								// Code Added By Komal Nilakhe on 28082024
								var Stellen = eData.Stellen;
								// Code Added By Komal Nilakhe on 10102024
								if(data.ResValue !== "" && !isNaN(parseFloat(data.ResValue))){
									var value = data.ResValue;
									if(value.includes(",") == true){
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
							}
						});
					});
					t.getOwnerComponent().getModel("RecordResultModel").refresh();
					oAppStateModel.setProperty("/CurrentlyChanged", false);
					oAppStateModel.setProperty("/SaveFrom", "Valuate");
					oAppStateModel.setProperty("/bValuateSave", true);
					BusyIndicator.hide();
					t.fnValidateQuantitativeResult();
				}, function (err) {
					var erMsg = t.fnFormatErrorMessage(err);
					MessageBox.error(erMsg);
					BusyIndicator.hide();
				});
			}
		},
		/*	Method: onCloseResult
		 *	Description/Usage: close result to server after valuate
		 **/
		onCloseResult: function (oEvent) {
			var t = this;
			//Code added by Komal on 17/10/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (aSelItems.length == 0) {
				MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
				return;
			}
			//Code added by Komal on 18/10/24
			var aResutlRecord = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			 var sCount = 0;
			if(aSelItems.length == aResutlRecord.length){
			for(var i=0; i<aResutlRecord.length; i++){
			    if(parseInt(aResutlRecord[i].Status) < 3){
			        sCount = sCount + 1;
			    }
			}
			}
			if(sCount == aSelItems.length){
				MessageBox.error(oResourceBun.getText("errPlsSaveFirst"));
			    return;
			}
			var username = "";
			if (sap.ushell !== undefined) {
				username = sap.ushell.Container.getService("UserInfo").getId();
			}
			var oAppStateModel = t.getOwnerComponent().getModel("AppModeModel");
			oAppStateModel.setProperty("/Username", username);
			//Code commented by Komal Nilakhe on 091024
			// if (oAppStateModel.getProperty("/bValuateSave") === true) {
			// 	MessageBox.information(oResource.getText("lblValuatedresulthasnotbeensaved"));
			// } else {
				if (this.fnValidation() === true) {
					if (this.fnValidationCloseResult() === true) {
						this.fnLoadRemarks();
						this.fnOpenFragment("TechnicalComplete");
						this.fnUploadFiles();
					}
				}
			// }
		},
		onCloseResultQM: function (oEvent) {
			var t = this;
			var username = "";
			if (sap.ushell !== undefined) {
				username = sap.ushell.Container.getService("UserInfo").getId();
			}
			var oAppStateModel = t.getOwnerComponent().getModel("AppModeModel");
			oAppStateModel.setProperty("/Username", username);
			
				if (this.fnValidation() === true) {
					
						this.fnLoadRemarks();
						this.fnOpenFragment("TechnicalComplete");
				}
			
		},
		
		/*	Method: onChangeResultValue
		 *	Description/Usage: change event of result recording quantitative result
		 **/
		// onChangeResultValue: function (oEvent) {
		// 	var Selected = oEvent.getSource().getBindingContext('RecordResultModel').getObject();
		// 	if(Selected.ControlChart === 'X' && this.getOwnerComponent().getModel("filterModel").getProperty("/chart") === true){
		// 		var viz = this.getView().byId("vizFrame");
		// 		var flatdata = this.getOwnerComponent().getModel("FlatDataSeteModel").getData();
		// 		flatdata[flatdata.length - 1].Mittelwert = Selected.Result;
		// 		viz.removeAllFeeds();
		// 		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
		// 			dimensions: [{
		// 				name: "InspLot",
		// 				value: "{InspLot}"
		// 			}],

		// 			measures: [{
		// 				name: "Mittelwert",
		// 				value: "{Mittelwert}"
		// 			}],

		// 			data: {
		// 				path: "/"
		// 			}
		// 		});
		// 		var jsonData = new sap.ui.model.json.JSONModel();
		// 		jsonData.setData(flatdata);
		// 		viz.setDataset(oDataset);
		// 		viz.setModel(jsonData);
		// 	}
		// },
		/*	Method: onDigitalSign
		 *	Description/Usage: digital signature captured for inspection point
		 **/
		onDigitalSign: function (oEvent) {
			var username = "";
			if (sap.ushell !== undefined) {
				username = sap.ushell.Container.getService("UserInfo").getId();
			}
			this.getOwnerComponent().getModel("AppModeModel").setProperty("/Username", username);
			if (this.fnValidation() === true) {
				this.fnLoadRemarks();
				this.fnOpenFragment("DigitalSignature");
			}
		},
		onSaveQM: function (oEvent) {
			var count = 0;
			var oResultModel = this.getOwnerComponent().getModel("RecordResultModel").getData().RecordResultSet;
			var oResultComapareModel = this.getOwnerComponent().getModel("RecordResultCompareModel").getData().RecordResultCompareSet;
			
			
			
			for (var i = 0; i < oResultModel.length; i++) {
				oResultComapareModel[i].Flag = "";
				if (oResultModel[i].Result.trimStart() !== oResultComapareModel[i].OSumplus.trimStart() && oResultComapareModel[i].OSumplus.trimStart() !== "") {
					oResultComapareModel[i].Flag = 'X';
					oResultComapareModel[i].Sumplus = oResultModel[i].Result.trimStart();
					count = count + 1;

				}
			}
			if (count > 0) {
				this.fnOpenFragment("ReasonForChange");
			}
			else {
				this.fnSaveData();
			}
		
		},
		onDialogSaveResult: function (oEvent) {
			var t = this;
			oEvent.getSource().getParent().close();
			var aExistinData = t.getOwnerComponent().getModel("RecordResultCompareModel").getProperty("/RecordResultCompareSet");
			var oResonChangePayload = t.fnFormatReasonCangePayload();
			var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			
			// t.fnCreateEntitySet(oPostModel, "/ReasonForChangeSet", oResonChangePayload).then(
			// 	function (successData) {
			// 		// var aCloseResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
			// 		// aCloseResult.forEach(function (data) {
			// 		// 	aExistinData.forEach(function (eData) {
			// 		// 		if (data.Inspchar === eData.CharNo) {
			// 		// 			eData.Evaluation = data.Evaluation;
			// 		// 			eData.ErrClass = data.ErrClass;
			// 		// 			eData.Status = data.Status;
			// 		// 		}
			// 		// 	});
			// 		// });
			// 		// t.getOwnerComponent().getModel("RecordResultModel").refresh();
			// 		// t.getOwnerComponent().getModel("AppModeModel").setProperty("/SaveFrom", "CloseResult");
			// 		//t.fnSave();
			// 		// t.fnUploadFiles();
			// 		// t.fnResetNotificationData();
			// 		// var sCRMsg = oResource.getText("lblInspectionLot") + " " + oClosePayload.Insplot + " " + oResource.getText("lblresulthasbeenclosedsuccessfully");
			// 		// MessageBox.success(sCRMsg);
			// 		// t.fnRefreshResultData();
			// 		BusyIndicator.hide();
			// 	},
			// 	function (err) {
			// 		// var erMsg = t.fnFormatErrorMessage(err);
			// 		// MessageBox.error(erMsg);
			// 		BusyIndicator.hide();
			// 	});

			var that = this;
                    // var oDataModel = this.getOwnerComponent().getModel("ListModel");
                    oPostModel.setChangeGroups({
                        "/ReasonForChangeSet": {
                            groupId: "submitRelease"
                        }
                    });
                    oPostModel.setDeferredGroups(["submitRelease"]);

                    oResonChangePayload.ReasonPayload.forEach(function (oItem) {
                        
						oPostModel.create("/ReasonForChangeSet", oItem, {
                                groupId: "submitRelease",
                                method: "PUT"
                            });
                        // }
                    });
                    oPostModel.submitChanges({
                        groupId: "submitRelease",
                        success: function (oData) {
                            // var responses = oData.__batchResponses[0].__changeResponses;
                            // var msgString = "";
                            // for (var j = 0; j < responses.length; j++) {
                            //     var oCompletemessage = oData.__batchResponses[0].__changeResponses[j].headers["sap-message"];
                            //     var oMessage = JSON.parse(oCompletemessage);
                            //     msgString = msgString + oMessage.message + "\n";
                            // }
                            MessageBox.information(oResourceBundle.getText("txtmsg3"));
                            oPostModel.setChangeGroups({});
                            oPostModel.setChangeGroups({
                                "*": {
                                    groupId: "changes"
                                }
                            });
                            oPostModel.setDeferredGroups(["changes"]);
                            oPostModel.refresh();
                            // that.getView().getModel("TableModel").setData("");

                            // that.byId("listTable").getTable().setSelectedIndex(-1);

                        },
                        error: function (err) {
                            that._scpoDialog.setBusy(false);
                            that._scpoDialog.close();
                            // sap.m.MessageBox.error(oError.responseText);
                            var erMsg = JSON.parse(err.responseText);
                            sap.m.MessageBox.error(erMsg.error.message.value);
                            oPostModel.setChangeGroups({});
                            oPostModel.setChangeGroups({
                                "*": {
                                    groupId: "changes"
                                }
                            });
                            oPostModel.setDeferredGroups(["changes"]);
                        }
                    });
			this.fnSaveData();
		},

		/*	Method: onSave
		 *	Description/Usage: after successful valuate and close it tirigger data to save
		 **/
		onSave: function (oEvent) {
			
			if (this.fnValidation() === true) {
				//commented by Komal Nilakhe on 081024
				// if (this.getOwnerComponent().getModel("AppModeModel").getProperty("/CurrentlyChanged") === true) {
				// 	//MessageBox.information(oResource.getText("lblResultshavechangedre-valuatebeforesaving")); 
				// } else {
					
					this.fnResetNotificationData();
					// if (this.fnSaveValidation() === true) {
						this.fnSaveData();
					// }
					//code commented by Komal on 18/10/24
					// else {
					// 	if (this.getOwnerComponent().getModel("AppModeModel").getProperty("/bValidStatus") === true) {
					// 		var oHDRModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
					// 		var oNotifModel = this.getOwnerComponent().getModel("NotificationModel");
					// 		var oDSModel = this.getOwnerComponent().getModel("DigitalSignModel");
					// 		if (oDSModel.getProperty("/Defectnotif").length === 0) {
					// 			if (oHDRModel.getProperty("/InspectionType") === "14") {
					// 				oNotifModel.setProperty("/NotificationType", "X5");
					// 			} else if (oHDRModel.getProperty("/InspectionType") === "Z14") {
					// 				oNotifModel.setProperty("/NotificationType", "X6");
					// 			}
					// 			this.fnOpenFragment("NotificationCreate");
					// 		} else {
					// 			this.fnSaveData();
					// 		}
					// 	} else {
					// 		this.fnSaveData();
					// 	}
					// }
				//}
			}
		},
		/*	Method: fnSave
		 *	Description/Usage: after successful valuate and close it tirigger data to save
		 **/
		fnSave: function () {
			//this.fnUploadFiles();
			this.fnResetNotificationData();
			if (this.fnSaveValidation() === true) {
				this.fnSaveData();
			} else {
				if (this.getOwnerComponent().getModel("AppModeModel").getProperty("/bValidStatus") === true) {
					var oHDRModel = this.getOwnerComponent().getModel("InspectionLotHDRModel");
					var oNotifModel = this.getOwnerComponent().getModel("NotificationModel");
					if (oHDRModel.getProperty("/Defectnotif").length === 0) {
						if (oHDRModel.getProperty("/InspectionType") === "14") {
							oNotifModel.setProperty("/NotificationType", "X5");
						} else if (oHDRModel.getProperty("/InspectionType") === "Z14") {
							oNotifModel.setProperty("/NotificationType", "X6");
						}
						this.fnOpenFragment("NotificationCreate");
					} else {
						this.fnSaveData();
					}
				} else {
					this.fnSaveData();
				}
			}
		},
		/*	Method: onNotificationCreate
		 *	Description/Usage: capture notifcation data to create defect notification
		 */
		onNotificationCreate: function (oEvent) {
			var oNotifCreateModel = this.getOwnerComponent().getModel("NotificationModel");
			if (oNotifCreateModel.getProperty("/NotificationType").length === 0) {
				MessageBox.information(oResource.getText("lblPleaseselectnotificationtype"));
			} else if (oNotifCreateModel.getProperty("/Priority").length === 0) {
				MessageBox.information(oResource.getText("lblPleaseselectpriority"));
			} else if (oNotifCreateModel.getProperty("/Description").length === 0) {
				MessageBox.information(oResource.getText("lblPleaseenterdescription"));
			} else if (oNotifCreateModel.getProperty("/Coordinator").length === 0) {
				MessageBox.information(oResource.getText("lblPleaseselectvalidcoordinator"));
			} else {
				this.fnSaveData();
				oEvent.getSource().getParent().close();
			}
		},
		/*	Method: onBCSFuncLocDoc
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Read Documents For Location
		 */
		 onBCSFuncLocDoc: function(oEvent){
			var oDataPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var oEquipmentDataModel = this.getOwnerComponent().getModel("EquipmentModel");
			var inputString = oEvent.getSource().sId;
			var parts = inputString.split('-');
			var rowNumber = parts[parts.length - 1];
			var sRowData = oEquipmentDataModel.getData().EquipmentSet[rowNumber];
			var sObjky = "", sFieldName= "";
			if(sRowData.EquipDms === "X"){
				sObjky = sRowData.FLocTxt.split(": ")[1];
				sFieldName = "EQUI";
			} else{
				sObjky = sRowData.FLocTxt.split(": ")[1];
				sFieldName = "IFLOT";
			}
			this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/Documents",[]);
			var aFilters = [(new Filter("Objky", FilterOperator.EQ, sObjky)),(new Filter("FieldName", FilterOperator.EQ, sFieldName))];
			var mParams = {"filters":aFilters};
			this.fnReadEntitySet(oDataPostModel,"/HeaderAttSet",mParams).then(function(oResponse){
				var oResults = oResponse.results;
				if(oResults.length>0){
					this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/Documents",oResults);
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/DocumentPopUpHeader",oResourceBundle.getText("lblFunctionLocationDocTitle"));
					if(this._oDocumentDisplayPopUp){
						this._oDocumentDisplayPopUp.open();
					}else{
						this.fnOpenDocumentDisplayFragment();
					}
				}
			}.bind(this));
		},
		/*	Method: fnOpenDocumentDisplayFragment
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Display Documents For Record/Event
		 */
		 fnOpenDocumentDisplayFragment: function(){
			Fragment.load({
				name: "com.reckitt.zqminsplotrr.view.Fragments.DisplayDocumentsPopUp",
				controller: this
			}).then(function (oFragment) {
				this._oDocumentDisplayPopUp = oFragment;
				this.getView().addDependent(this._oDocumentDisplayPopUp);
				this._oDocumentDisplayPopUp.open();
			}.bind(this));
		},
		/*	Method: onPressDocumentDisplay
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Display Document in new window
		 */
		 onPressDisplayDocument: function(oEvent){
			var oObject = oEvent.getSource().getBindingContext("DocumentDisplayModel").getObject();
			if(oObject.Dappl === "ZWB"){
				if(oObject.FileName.indexOf("http://") !== -1 || oObject.FileName.indexOf("https://") !== -1){
					window.open(oObject.FileName);
				}else{
					window.open("http://"+oObject.FileName);
				}
			}else{
				const b64Data = oObject.Content;
				const contentType = this.onGetMimeTypeBasedOnFileName(oObject.FileName);
				const blob = this.onCovertBase64ToBlob(b64Data, contentType);
				const blobUrl = URL.createObjectURL(blob);
				window.open(blobUrl);
			}
		},
		/*	Method: onCloseDocumentDisplayPopUp
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To Display Document PopUp close
		 */
		onCloseDocumentDisplayPopUp: function(oEvent){
			this._oDocumentDisplayPopUp.close();
		},
		/*	Method: onBCSEquipmentDoc
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To Read Equipment Document Data
		 */
		onBCSEquipmentDoc: function(oEvent){
			var oDataPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var oEquipmentDataModel = this.getOwnerComponent().getModel("EquipmentModel");
			var inputString = oEvent.getSource().sId;
			var parts = inputString.split('-');
			var rowNumber = parts[parts.length - 1];
			var sRowData = oEquipmentDataModel.getData().EquipmentSet[rowNumber];
			this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/Documents",[]);
			var aFilters = [(new Filter("Objky", FilterOperator.EQ, sRowData.TestEqui)),(new Filter("FieldName", FilterOperator.EQ, 'EQUI'))];
			var mParams = {"filters":aFilters};
			this.fnReadEntitySet(oDataPostModel,"/HeaderAttSet",mParams).then(function(oResponse){
				var oResults = oResponse.results;
				if(oResults.length>0){
					this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/Documents",oResults);
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					this.getOwnerComponent().getModel("DocumentDisplayModel").setProperty("/DocumentPopUpHeader",oResourceBundle.getText("lblEquipmentDocTitle"));
					if(this._oDocumentDisplayPopUp){
						this._oDocumentDisplayPopUp.open();
					}else{
						this.fnOpenDocumentDisplayFragment();
					}
				}
			}.bind(this));
		},
		/*	Method: getInCompleteAttachments
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Method to get un-uploaded attachments
		 */
		 getInCompleteAttachments: function(aAllAttachments){
			var aDataToUpload = [];
			aAllAttachments.forEach(function(oAttachment){
				if(!oAttachment.Doknr){
					aDataToUpload.push(oAttachment);
				}
			});
			return aDataToUpload;
		},
		/*	Method: onGetMimeTypeBasedOnFileName
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Get Mime Type
		 */
		 onGetMimeTypeBasedOnFileName: function(sFileName){
			var sExtension = sFileName.split(".");
			var mimeType;
			switch (sExtension[sExtension.length - 1].toLowerCase()) {
				case "aif":
					mimeType = "audio/x-aiff";
					break;
				case "avi":
					mimeType = "video/x-msvideo";
					break;
				case "bmp":
					mimeType = "image/bmp";
					break;
				case "csv":
					mimeType = "text/csv";
					break;
				case "doc":
					mimeType = "application/msword";
					break;
				case "docx":
					mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case "dwg":
					mimeType = "application/octet-stream";
					break;
				case "gif":
					mimeType = "image/gif";
					break;
				case "jpeg":
				case "jpg":
					mimeType = "image/jpeg";
					break;
				case "mp3":
					mimeType = "audio/mpeg";
					break;
				case "mp4":
					mimeType = "video/mp4";
					break;
				case "mpp":
					mimeType = "application/vnd.ms-project";
					break;
				case "mpx":
					mimeType = "application/vnd.ms-project";
					break;
				case "mov":
					mimeType = "video/quicktime";
					break;
				case "mwa":
					mimeType = "application/octet-stream";
					break;
				case "mwv":
					mimeType = "application/octet-stream";
					break;
				case "pdf":
					mimeType = "application/pdf";
					break;
				case "ppt":
					mimeType = "application/vnd.ms-powerpoint";
					break;
				case "pptx":
					mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
					break;
				case "png":
					mimeType = "image/png";
					break;
				case "rtf":
					mimeType= "application/rtf";
					break;
				case "svg":
					mimeType = "image/svg+xml";
					break;
				case "tif":
				case "tiff":
					mimeType = "image/tiff";
					break;
				case "txt":
					mimeType = "text/plain";
					break;
				case "wav":
					mimeType = "audio/wav";
					break;
				case "xls":
					mimeType = "application/vnd.ms-excel";
					break;
				case "xlsx":
					mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
				default:
					break;
			}
			return mimeType;
		},
		/*	Method: onCovertBase64ToBlob
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To convert base64 to blob
		 */
		onCovertBase64ToBlob: function(b64Data,contentType){
			const byteCharacters = atob(b64Data), sliceSize = 512;
			const byteArrays = [];
			for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				const slice = byteCharacters.slice(offset, offset + sliceSize);

				const byteNumbers = new Array(slice.length);
				for (let i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				const byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}

			const blob = new Blob(byteArrays, { type: contentType });
			return blob;
		},
		/*	Method: onDeleteAttachment
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To delete attachment
		 */
		 onDeleteAttachment: function(oEvent){
			var that = this;
			var oBindingContext = oEvent.getSource().getBindingContext("AttachmentModel");
			var oObject = oBindingContext.getObject();
			var sItemPath = oBindingContext.getPath();
			var sDeletePath = oObject.deletePath;
			var sSplit = sItemPath.split("/");
			var iSplitIndex = parseInt(sSplit[sSplit.length-1]);
			var oAttachmentModel = this.getOwnerComponent().getModel("AttachmentModel");
			var aAttachmentData = oAttachmentModel.getProperty("/FileSet");
			var oResource = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if(sDeletePath.length > 0){
				var oDeleteModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
				MessageBox.show(oResource.getText("lblAreyousurewanttodelete")+ " " + oObject.File_name, {
					icon: MessageBox.Icon.CONFIRM,
					title: oResource.getText("lblConfirmation"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							BusyIndicator.show(0);
							that.fnDeleteEntitySet(oDeleteModel, sDeletePath, "").then(function (resultData) {
								MessageBox.success(oResource.getText("lblFilehasbeendeletedsuccessfully"));
								aAttachmentData.splice(iSplitIndex,1);
								oAttachmentModel.refresh();
								BusyIndicator.hide();
							}, function (err) {
								MessageBox.error(oResource.getText("lblUnabletodeletefile"));
								BusyIndicator.hide();
							});
						}
					}
				});
			}else{
				aAttachmentData.splice(iSplitIndex,1);
				oAttachmentModel.refresh();
			}
		},
		/*	Method: onAttachmentDisplay
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To display attachment
		 */
		 onAttachmentDisplay:function(oEvent){
			var oBindingContext = oEvent.getSource().getBindingContext("AttachmentModel");
			var oObject = oBindingContext.getObject();
			if(oObject.Dappl === "ZWB"){
				if(oObject.File_name.indexOf("http://") !== -1 || oObject.File_name.indexOf("https://") !== -1){
					window.open(oObject.File_name);
				}else{
					window.open("http://"+oObject.File_name);
				}
			}else{
				if(oObject.url){
					const mimeType = this.onGetMimeTypeBasedOnFileName(oObject.File_name);
					if(mimeType.indexOf("pdf") !== -1|| mimeType.indexOf("image") !== -1){
						const b64Data = oObject.Content;
						const blob = this.onCovertBase64ToBlob(b64Data, mimeType);
						const blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					}else{
						window.open(oObject.url);
					}
				}else {
					const b64Data = oObject.Content;
					const contentType = this.onGetMimeTypeBasedOnFileName(oObject.File_name);
					const blob = this.onCovertBase64ToBlob(b64Data, contentType);
					const blobUrl = URL.createObjectURL(blob);
					window.open(blobUrl);
				}
			}
		},
		/*	Method: onOpenUploadDialog
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To open add attachment dialog
		 */
		 onOpenUploadDialog:function(oEvent){
			Fragment.load({
				name: "com.reckitt.zqminsplotrr.view.Fragments.AddAttachment",
				controller: this
			}).then(function (oFragment) {
				this._oAddAttachment = oFragment;
				this.getView().addDependent(this._oAddAttachment);
				this.getOwnerComponent().getModel("AttachmentModel").setProperty("/addTypeKey","");
				this.getOwnerComponent().getModel("AttachmentModel").setProperty("/zwbDescription","");
				this.getOwnerComponent().getModel("AttachmentModel").setProperty("/zwbUrl","");
				var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var aData = [{
					"key": "ZQI",
					"text": "ZQI",
					"additionalText": oResourceBundle.getText("txtZQIDescription")
				}, {
					"key": "ZWB",
					"text": "ZWB",
					"additionalText": oResourceBundle.getText("txtZWBDescription")
				}
				];
				this.getOwnerComponent().getModel("AttachmentModel").setProperty("/typeSelItems",aData);
				this.getOwnerComponent().getModel("AttachmentModel").setProperty("/addTypeKey","ZQI");
				this._oAddAttachment.open();
			}.bind(this));
		},
		/*	Method: onCloseAddAttachment
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To close add attachment dialog
		 */
		onCloseAddAttachment: function(oEvent){
			if (this._oAddAttachment) {
				this._oAddAttachment.close();
				this._oAddAttachment.destroy();
				this._oAddAttachment = "";
			}
		},
		/*	Method: onGetNewAttachmentObject
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Method to return new attachment default data
		 */
		onGetNewAttachmentObject: function(){
			var oNewAttachmentData = {
				"Content": "",
				"deleteItem": true,
				"deletePath": "",
				"Doknr": "",
				"Dokar": "",
				"File_name": "",
				"File_desc": "",
				"Ktxt": "",
				"oFile":"",
				"Mimetype":"",
				"Objky": "",
				"Dappl": "",
				"ShortDesc":"", // Code added by Komal Nilakhe on 09-09-2024
				"Lo_objid": ""
			};
			return oNewAttachmentData;
		},
		/*	Method: onTypeSelectChange
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: Method used to delete any previous data
		 */
		onTypeSelectChange:function(oEvent){
			var sSelectedKey = oEvent.getSource().getSelectedKey();
			var oAttachmentModel = this.getOwnerComponent().getModel("AttachmentModel");
			if(sSelectedKey === "ZQI"){
				oAttachmentModel.setProperty("/zwbDescription","");
				oAttachmentModel.setProperty("/zwbUrl","");
			}else if(sSelectedKey === "ZWB"){
				var aFileUploader = sap.ui.getCore().byId("fileUploader");
				aFileUploader.setValue("");
			}
		},
		/*	Method: onPressAttachmentAdd
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To add attachment data to attachment table
		 */
		onPressAttachmentAdd: function(oEvent){
			var oAttachmentModel = this.getOwnerComponent().getModel("AttachmentModel");
			var sTypeKey = oAttachmentModel.getProperty("/addTypeKey");
			var aAttachmentData = oAttachmentModel.getProperty("/FileSet");
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if(sTypeKey === "ZQI"){
				var aFileUploader = sap.ui.getCore().byId("fileUploader");
				var aFiles = aFileUploader.getFocusDomRef().files;
				if(aFiles.length > 0){
					for (var j = 0; j < aFiles.length; j++){
						var file = aFiles[j];
						var reader = new FileReader();
						var that = this;
						reader.onload = (function (oFile) {
							return function (e) {
								var base64_marker = "data:" + oFile.type + ";base64,";
								//locate base64 content
								var base64Index = e.target.result.indexOf(base64_marker) + base64_marker.length;
								// get base64 content
								var base64 = e.target.result.substring(base64Index);
								const blob = new Blob([new Uint8Array(e.target.result)], {type: file.type });
								var oNewAttachment = that.onGetNewAttachmentObject();
								oNewAttachment.File_name = oFile.name;
								oNewAttachment.Content = base64;
								oNewAttachment.Mimetype = oFile.type;
								oNewAttachment.oFile = oFile;
								oNewAttachment.Dokar = "ZQI";
								aAttachmentData.push(oNewAttachment);
								oAttachmentModel.refresh();
								that.onCloseAddAttachment();
							}
						})(file);
						reader.readAsDataURL(file);
					}
				}else {
					MessageBox.error(oResourceBundle.getText("errTxtNoFileSelected"));
				}
			}else if(sTypeKey === "ZWB"){
				var sDescription = oAttachmentModel.getProperty("/zwbDescription");
				var sOrginalUrl = oAttachmentModel.getProperty("/zwbUrl");
				var oDescription = sap.ui.getCore().byId("idZwbDescription");
				var oOriginalUrl = sap.ui.getCore().byId("idZwbOriginalUrl");
				var bError = false;
				if(!sDescription.trim().length > 0){
					oDescription.setValueState("Error");
					oDescription.setValueStateText(oResourceBundle.getText("errTxtProvide") + " " + oResourceBundle.getText("lblDescription"));
					bError = true;
				}
				if(!sOrginalUrl.trim().length > 0){
					oOriginalUrl.setValueState("Error");
					oOriginalUrl.setValueStateText(oResourceBundle.getText("errTxtProvide") + " " + oResourceBundle.getText("lblOriginalURL"));
					bError = true;
				}
				if(bError){
					MessageBox.error(oResourceBundle.getText("errTxtForZWBAdd"));
				}
			    else{
					var oNewAttachmentData = this.onGetNewAttachmentObject();
					oNewAttachmentData.File_desc = sDescription;
					oNewAttachmentData.File_name = sOrginalUrl;
					oNewAttachmentData.Dokar = "ZWB";
					oNewAttachmentData.Dappl = "ZWB";
					aAttachmentData.push(oNewAttachmentData);
					oAttachmentModel.refresh();
					this.onCloseAddAttachment();
				}
			}
		},
		/*	Method: onPressCamera
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To open camera
		 */
		 onPressCamera: function(oEvent){
			var that = this;
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.cameraDialog = new Dialog({
				title: oResourceBundle.getText("titleForCameraDialog"),
				content: [
					new sap.ui.core.HTML({
						content: "<video id='player' autoplay></video>"
					})
				],
				beginButton: new Button({
					text: oResourceBundle.getText("btnCapture"),
					press: function (oEvent) {
						that.imageValue = document.getElementById("player");
						that.iHeight = that.imageValue.offsetHeight; // Code added by udayasree on 20-09-2024
						that.iWidth = that.imageValue.offsetWidth;   // Code added by udayasree on 20-09-2024
						that.cameraDialog.close();
						that.onShowCapturedImage();
						that.cameraDialog.destroy();
					}
				}),
				endButton: new Button({
					text: oResourceBundle.getText("btnCancel"),
					press: function () {
						player.srcObject.getVideoTracks()[0].stop();
						that.cameraDialog.close();
						that.cameraDialog.destroy();
					}
				})
			});
			this.getView().addDependent(this.cameraDialog);
			this.cameraDialog.open();
			navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment"
				}
			}).then(function(stream){
				player.srcObject = stream;
			});
		},
		/*	Method: onShowCapturedImage
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To display captured image
		 */
		onShowCapturedImage: function(oEvent){
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			Fragment.load({
				name: "com.reckitt.zqminsplotrr.view.Fragments.ShowCapturedImage",
				controller: this
			}).then(function (oFragment) {
				oFragment.getContent()[0].removeAllItems();
				var imageVal = this.imageValue;
				var id = "id-new-snap" + new Date().valueOf();
				this.canvasId = id;
				var oCanvas = new sap.ui.core.HTML({
					content:"<canvas id ='"+id+"' width='"+this.iWidth+"px' height='"+this.iHeight+"px' style='2px solid black'></canvas>"
				});// Code modified by udayasree on 20-09-2024
				var oLabelFileName = new sap.m.Label({
					text:oResourceBundle.getText("lblFileName"),
					required:true
				});
				var oInputFileName = new sap.m.Input({});
				oFragment.getContent()[0].addItem(oCanvas);
				oFragment.getContent()[0].addItem(oLabelFileName);
				oFragment.getContent()[0].addItem(oInputFileName);
				oCanvas.addEventDelegate({
					onAfterRendering: function(){
						var oSnapCanvas = document.getElementById(id);
						var oContext = oSnapCanvas.getContext('2d');
						oContext.drawImage(imageVal,0,0, oSnapCanvas.width, oSnapCanvas.height);
					}
				});
				this._oShowCapturedImage = oFragment;
				this.getView().addDependent(this._oShowCapturedImage);
				this._oShowCapturedImage.open();
				this.imageValue.srcObject.getVideoTracks()[0].stop();
			}.bind(this));
		},
		/*	Method: onRecaptureImage
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To retake image
		 */
		onRecaptureImage: function(){
			this._oShowCapturedImage.close();
			this._oShowCapturedImage.destroy();
			this.onPressCamera();
		},
		/*	Method: onCloseShowCapturedImage
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To close captured image dialog
		 */
		onCloseShowCapturedImage: function(){
			this._oShowCapturedImage.close();
			this.imageValue = "";
			this.canvasId = "";
			this._oShowCapturedImage.destroy();
		},
		/*	Method: onSaveCapturedImage
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To save captured image data in attachment table
		 */
		onSaveCapturedImage: function(oEvent){
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var aAttachmentData = this.getOwnerComponent().getModel("AttachmentModel").getProperty("/FileSet");
			var oContent = document.getElementById(this.canvasId).toDataURL().replace("data:image/png;base64,","");
			var oContentFile = document.getElementById(this.canvasId).toDataURL();
			var oVb = sap.ui.getCore().byId("idCapturedImageVb");
			var sFileName = oVb.getItems()[2].getValue();
			if (sFileName) {
				sFileName = sFileName + ".png";
				var blob = this.dataURItoBlob(oContentFile);
				var file = new File([blob],sFileName, 
					{
						lastModified: new Date().getTime(),
						type: "image/png" 
					}
				);
				var oImageData = this.onGetNewAttachmentObject();
				oImageData.Content = oContent;
				oImageData.Dokar = "ZQI";
				oImageData.File_name = sFileName;
				oImageData.Mimetype = "image/png";
				oImageData.oFile = file;
				aAttachmentData.push(oImageData);
				this.getOwnerComponent().getModel("AttachmentModel").refresh();
				this.onCloseShowCapturedImage();
			} else {
				MessageBox.error(oResourceBundle.getText("errTxtProvide") + " " + oResourceBundle.getText("lblFileName"));
			}
		},
		/*	Method: dataURItoBlob
		 *	Created By: Komal Nilakhe 	|Created On: 07-11-2024
		 *	Description/Usage: To convert captured image to blob
		 */
		dataURItoBlob: function (dataURI) {
			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ia], { type: mimeString });
		},
		/*	Method: onBeforeItemRemoved
		 *	Description/Usage: prevent default of remove confirmation attachment
		 */
		onBeforeItemRemoved: function (oEvent) {
			var removeFile = oEvent.getParameter("item");
			var cUploadSet = oEvent.getSource();
			cUploadSet.removeIncompleteItem(removeFile);
			oEvent.preventDefault();
		},
		/*	Method: onUploadComplete
		 *	Description/Usage: file uploaded completed then manage locally available file attachment
		 */
		onUploadComplete: function (oEvent) {
			oEvent.getSource().removeAllIncompleteItems();
			var oItems = oEvent.getSource().getItems();
			oItems.forEach(function (oItem) {
				sap.ui.getCore().byId(oItem.getId()).destroy();
				var dIcon = sap.ui.getCore().byId(oItem.getId() + "-icon");
				if (dIcon) {
					sap.ui.getCore().byId(oItem.getId() + "-icon").destroy();
					sap.ui.getCore().byId(oItem.getId() + "-listItem").destroy();
				}
			});
			this.fnRefreshAttachment();
		},
		/*	Method: fnRefreshAttachment
		 *	Description/Usage: read attachment data against inspection lot
		 **/
		fnRefreshAttachment: function () {
			this.oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var InspectionLotNo = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/InspectionLot");
			if (InspectionLotNo.length > 0) {
				var aFilter = [];
				if (InspectionLotNo.length > 0) {
					aFilter.push(new Filter("Insplot", FilterOperator.EQ, InspectionLotNo));
				}
				var oParameter = { "filters": aFilter };
				var that = this;
				BusyIndicator.show(0);
				Promise.all([this.fnReadEntitySet(this.oDataInspectionLotModel, "/InspLotATTSet", oParameter)
				]).then(function (oRefreshData) {
					that.fnFormatAttachment(oRefreshData[0].results);
					BusyIndicator.hide();
				}, function (err) {
					BusyIndicator.hide();
				});
			}
		},
		/*	Method: onFileDelete
		 *	Description/Usage: attachment file delete functionality
		 **/
		onFileDelete: function (oEvent) {
			var t = this;
			var sDeletePath = oEvent.getSource().getModel("AttachmentModel").getObject(oEvent.getSource().getBindingContext("AttachmentModel").getPath()).deletePath;
			var oDeleteModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var removeFile = oEvent.getSource();
			var cUploadSet = oEvent.getSource().getParent();
			MessageBox.show(oResource.getText("lblAreyousurewanttodelete") + " " + oEvent.getParameter("item").getFileName(), {
				icon: MessageBox.Icon.CONFIRM,
				title: oResource.getText("lblConfirmation"),
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						BusyIndicator.show(0);
						t.fnDeleteEntitySet(oDeleteModel, sDeletePath, "").then(function (resultData) {
							MessageBox.success(oResource.getText("lblFilehasbeendeletedsuccessfully"));
							cUploadSet.removeItem(removeFile);
							removeFile.destroy();
							BusyIndicator.hide();
						}, function (err) {
							MessageBox.error(oResource.getText("lblUnabletodeletefile"));
							BusyIndicator.hide();
						});
					}
				}
			});
			oEvent.preventDefault();
		},
		/*	Method: onChangeEquipmentDetail
		 *	Description/Usage: change of equipment location manually in detail screen
		 */
		onChangeEquipmentDetail: function (oEvent) {
			this.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", "");
			var sSelectPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var sTestEquipDesc = "";
			if (oEvent.getSource().getValue().length > 0) {
				var t = this;
				var bValid = false;
				var sEquipment = oEvent.getSource().getValue();
				var aEquipment = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/TestEquipSHSet");
				aEquipment.forEach(function (oEquip) {
					if (sEquipment === oEquip.Equnr) {
						bValid = true;
						sTestEquipDesc = oEquip.Eqktu;
					}
				});
				if (bValid === false) {
					MessageBox.information(oResource.getText("lblInvalidorUnauthorisedObjectSelected") + sEquipment);
					oEvent.getSource().setValue("");
					t.getOwnerComponent().getModel("EquipmentModel").setProperty(sSelectPath + "/TestEquiDesc", "");
				} else {
					t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", sEquipment);
					t.getOwnerComponent().getModel("EquipmentModel").setProperty(sSelectPath + "/TestEquiDesc", sTestEquipDesc);
					t.fnTestEquipmentValid(sEquipment);
				}
				t.setEquipmentDMS();
			}
		},
		/*	Method: onChangeEquipmentDetailScan
		 *	Description/Usage: change of equipment location manually in detail screen from scanned scanned item
		 */
		onChangeEquipmentDetailScan: function (oEvent) {
			var oEquiModel = this.getOwnerComponent().getModel("EquipmentModel");
			var sSelectedContextPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var sTestEquipment = oEquiModel.getObject(sSelectedContextPath).TestEqui;
			this.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", "");
			var sTestEquipDesc = "";
			if (sTestEquipment.length > 0) {
				var t = this;
				var bValid = false;
				var sEquipment = sTestEquipment;
				var aEquipment = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/TestEquipSHSet");
				aEquipment.forEach(function (oEquip) {
					if (sEquipment === oEquip.Equnr) {
						bValid = true;
						sTestEquipDesc = oEquip.Eqktu;
					}
				});
				if (bValid === false) {
					MessageBox.information(oResource.getText("lblInvalidorUnauthorisedObjectSelected") + sEquipment);
					oEquiModel.setProperty(sSelectedContextPath + "/TestEqui", "");
					oEquiModel.setProperty(sSelectedContextPath + "/TestEquiDesc", "");
				} else {
					t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointEquipment", sEquipment);
					oEquiModel.setProperty(sSelectedContextPath + "/TestEquiDesc", sTestEquipDesc);
					t.fnTestEquipmentValid(sEquipment);
				}
			}
		},
		/*	Method: fnTestEquipmentValid
		 *	Description/Usage: test equipment valid state and based on message to user
		 */
		fnTestEquipmentValid: function (sEquipment) {
			var aEquipment = this.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/TestEquipSHSet");
			var sSelectPath = this.getOwnerComponent().getModel("AppModeModel").getProperty("/SelectedInspectionPath");
			var t = this;
			aEquipment.forEach(function (oEquip) {
				if (sEquipment === oEquip.Equnr) {
					t.getOwnerComponent().getModel("EquipmentModel").setProperty(sSelectPath + "/TestEquiDesc", oEquip.Eqktu);
					if (oEquip.ObjStat === "NPRT") {
						var sTxtMsg = oResource.getText("lblTheequipment") + " " + sEquipment + " " + oResource.getText("lblhasNPRTstatusandshouldnotbeused");
						if (oEquip.Abckz === "" || oEquip.Abckz === "W") {
							MessageBox.warning(sTxtMsg);
						} else if (oEquip.Abckz === "E") {
							MessageBox.error(sTxtMsg);
							t.getOwnerComponent().getModel("EquipmentModel").setProperty(sSelectPath + "/TestEqui", "");
							t.getOwnerComponent().getModel("EquipmentModel").setProperty(sSelectPath + "/TestEquiDesc", "");
						}
					}
				}
			});
		},
		/*	Method: onChangeFuncLocDetail
		 *	Description/Usage: change of functional location manually
		 */
		onChangeFuncLocDetail: function (oEvent) {
			if (oEvent.getSource().getValue().length > 0) {
				var t = this;
				var bValid = false;
				var sFuncLocation = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/FunctionalLocation");
				var aFuncLocation = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/FunctionalLoc");
				aFuncLocation.forEach(function (oFuncLoc) {
					if (sFuncLocation === oFuncLoc.FunctionalLoc) {
						bValid = true;
					}
				});
				if (bValid === false) {
					MessageBox.information(oResource.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sFuncLocation);
					oEvent.getSource().setValue("");
				} else {
					t.getOwnerComponent().getModel("InspectionLotHDRModel").setProperty("/SelInspPointFunctional", sFuncLocation);
				}
			}
		},
		/*	Method: onVHFunctionalLocDetail
		 *	Description/Usage: open value help dialog for functional location in detail screen
		 **/
		onVHFunctionalLocDetail: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResource.getText("lblFunctionalLocation"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "FunctionalLoc");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/functionallocation");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/FunctionalLoc");
			var entityset = "FunctionalLoc";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onChangeCoordinator
		 *	Description/Usage: coordinator data changed event for validate entered value
		 **/
		onChangeCoordinator: function (oEvent) {
			if (oEvent.getSource().getValue().length > 0) {
				oEvent.getSource().setValue(oEvent.getSource().getValue().toUpperCase());
				var t = this;
				var bValid = false;
				var sCoordinator = oEvent.getSource().getValue().toUpperCase();
				var aCoordinator = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/UserDataSet");
				aCoordinator.forEach(function (oCoordinatorObject) {
					if (sCoordinator === oCoordinatorObject.User) {
						bValid = true;
					}
				});
				if (bValid === false) {
					MessageBox.information(oResource.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sCoordinator);
					oEvent.getSource().setValue("");
				}
			}
		},
		/*	Method: onCloseResultWithoutDS
		 *	Description/Usage: close result to server without digital signature
		 **/
		onCloseResultWithoutDS: function (oEvent) {
			var t = this;
			//Code added by Komal on 17/10/24
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (aSelItems.length == 0) {
				MessageBox.error(oResourceBun.getText("errSelCharToValuate"));
				return;
			}		
			if (this.fnValidation() === true) {
				if (this.fnValidationCloseResult() === true) {
					BusyIndicator.show(0);
					var oClosePayload = t.fnFormatCRPayload();
					var aExistinData = t.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
					var oPostModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
					t.fnCreateEntitySet(oPostModel, "/InspLotRRHdrSet", oClosePayload).then(
						function (successData) {
							var aCloseResult = successData.InspLotOprSet.results[0].InspLotpntSet.results[0].InspLotRr.results;
							aCloseResult.forEach(function (data) {
								aExistinData.forEach(function (eData) {
									if (data.Inspchar === eData.CharNo) {
										eData.Evaluation = data.Evaluation;
										eData.ErrClass = data.ErrClass;
										eData.Status = data.Status;
									}
								});
							});
							t.getOwnerComponent().getModel("RecordResultModel").refresh();
							t.getOwnerComponent().getModel("AppModeModel").setProperty("/SaveFrom", "CloseResult");
							//t.fnSave();
							t.fnUploadFiles();
							t.fnResetNotificationData();
							var sCRMsg = oResource.getText("lblInspectionLot") + " " + oClosePayload.Insplot + " " + oResource.getText("lblresulthasbeenclosedsuccessfully");
							MessageBox.success(sCRMsg);
							t.fnRefreshResultData();
							BusyIndicator.hide();
						},
						function (err) {
							var erMsg = t.fnFormatErrorMessage(err);
							MessageBox.error(erMsg);
							BusyIndicator.hide();
						});
				}
			}
		},
		/*	Method: fnValidateQuantitativeResult
		 *	Description/Usage: validate quantitative result and upper and lower limit
		 **/
		fnValidateQuantitativeResult: function (oEvent) {
			// code changed by Komal on 11/10/24
			var aResRecord = this.getOwnerComponent().getModel("RecordResultModel").getProperty("/RecordResultSet");
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var sRecordResult = this.getOwnerComponent().getModel("RecordResultModel");
			if (aSelItems.length !== 0) {
				aResRecord = aSelItems;
			}
			var aMessageTxt = [];
			var oResource = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			aResRecord.forEach(function (record) {
				var binding = record.getBindingContext("RecordResultModel").sPath;

				
					var resultValue = sRecordResult.getProperty(binding + "/Result").replaceAll(" ", "").replaceAll(",", ".");
					var UpLmt1 = sRecordResult.getProperty(binding + "/UpLmt1").replaceAll(" ", "").replaceAll(",", ".");
					var UpLmt2 = sRecordResult.getProperty(binding + "/UpLmt2").replaceAll(" ", "").replaceAll(",", ".");
					var UpPlsLmt =sRecordResult.getProperty(binding + "/UpPlsLmt").replaceAll(" ", "").replaceAll(",", ".");
					var LwLmt1 = sRecordResult.getProperty(binding + "/LwLmt1").replaceAll(" ", "").replaceAll(",", ".");
					var LwLmt2 = sRecordResult.getProperty(binding + "/LwLmt2").replaceAll(" ", "").replaceAll(",", ".");
					var LwPlsLmt = sRecordResult.getProperty(binding + "/LwPlsLmt").replaceAll(" ", "").replaceAll(",", ".");
					var UpTolLmt = sRecordResult.getProperty(binding + "/UpTolLmt").replaceAll(" ", "").replaceAll(",", ".");
					var LwTolLmt = sRecordResult.getProperty(binding + "/LwTolLmt").replaceAll(" ", "").replaceAll(",", ".");
					if ((Number(resultValue) > Number(UpPlsLmt) && UpPlsLmt.length !== 0) || (Number(resultValue) < Number(LwPlsLmt) && LwPlsLmt.length !== 0)) {
						aMessageTxt.push(oResource.getText("lblThevalueforcharacteristic") + " " + sRecordResult.getProperty(binding + "/ShortText") + " " + oResource.getText("lblisoutsidetheplausiblelimits"));
					} else if ((LwTolLmt.lenght !== 0 && LwLmt2.lenght !== 0 && Number(resultValue) >= Number(LwTolLmt) && Number(resultValue) < Number(LwLmt2)) || (LwTolLmt.lenght === 0 && LwLmt2.lenght !== 0 && Number(resultValue) < Number(LwLmt2))) {
						aMessageTxt.push(oResource.getText("lblResultenteredfor") + " " + sRecordResult.getProperty(binding + "/ShortText") + " " + oResource.getText("lblisoutsidealertlevel2"));
					} else if ((UpTolLmt.length !== 0 && UpLmt2.length !== 0 && Number(resultValue) <= Number(UpTolLmt) && Number(resultValue) > Number(UpLmt2)) || (UpTolLmt.length === 0 && UpLmt2.length !== 0 && Number(resultValue) > Number(UpLmt2))) {
						aMessageTxt.push(oResource.getText("lblResultenteredfor") + " " + sRecordResult.getProperty(binding + "/ShortText") + " " + oResource.getText("lblisoutsidealertlevel2"));
					} else if ((LwTolLmt.length !== 0 && LwLmt1.length !== 0 && Number(resultValue) >= Number(LwTolLmt) && Number(resultValue) < Number(LwLmt1)) || (LwTolLmt.length === 0 && LwLmt1.length !== 0 && Number(resultValue) < Number(LwLmt1))) {
						aMessageTxt.push(oResource.getText("lblResultenteredfor") + " " + sRecordResult.getProperty(binding + "/ShortText") + " " + oResource.getText("lblisoutsidealertlevel1"));
					} else if ((UpTolLmt.length !== 0 && UpLmt1.length !== 0 && Number(resultValue) <= Number(UpTolLmt) && Number(resultValue) > Number(UpLmt1)) || (UpTolLmt.length === 0 && UpLmt1.length !== 0 && Number(resultValue) > Number(UpLmt1))) {
						aMessageTxt.push(oResource.getText("lblResultenteredfor") + " " + sRecordResult.getProperty(binding + "/ShortText") + " " + oResource.getText("lblisoutsidealertlevel1"));
					}
				
			});
			if (aMessageTxt.length > 0) {
				var sMessageTxt = aMessageTxt.toString().replaceAll(",", ",\n");
				MessageBox.warning(sMessageTxt);
			}
		},
		/*	Method: onPrint
		 *	Description/Usage: get the sample number on click of print
		 **/
		onPrint: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var eve = oEvent.getSource();
			var SampleNumber = this.getView().byId("equipTable").getItems()[oEvent.getParameters().id.split("equipTable-")[1]].mAggregations.cells[1].getProperty("text");
			this.fnServiceCallSampleNumber(eve, SampleNumber);
		},
		/*	Method: fnServiceCallSampleNumber
		 *	Description/Usage: fetch the respective drawing number,material,batch based on sample number
		 **/
		fnServiceCallSampleNumber: function (eve, sampnumb) {
			var that = this;
			var aFilter = [];
			aFilter.push(new Filter("Phynr", FilterOperator.EQ, sampnumb));
			this.getOwnerComponent().getModel("printModel").read("/SamNumSHelpSet", {
				filters: aFilter,
				success: function (oData, oResponse) {
					var SampleArray = [];
					if (oResponse.statusCode === 200 || oResponse.statusCode === "200") {
						var serviceData = oData.results;
						for (var y = 0; y < serviceData.length; y++) {
							var item = {
								"samplenumber": serviceData[y].Phynr,
								"drawingnumber": serviceData[y].PnNr,
								"samplecategory": serviceData[y].Prtyp,
								"material": serviceData[y].Matnr,
								"batch": serviceData[y].Charg,
							};
							SampleArray.push(item);
						}
						that.getOwnerComponent().getModel("CommonValueHelpModel").setProperty("/samplenumber", SampleArray);
						that.fnServicecallDrawing(eve, sampnumb, that.getOwnerComponent().getModel("CommonValueHelpModel").getData().samplenumber[0].drawingnumber);
					}
				},
				error: function (err) {
					var erMsg = JSON.parse(err.responseText);
					MessageToast.show(erMsg.error.message.value);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		/*	Method: fnServicecallDrawing
		 *	Description/Usage: fetch status,prtype,samplecategoty based on drawing number, sample number
		 **/
		fnServicecallDrawing: function (eve, sampnum, drawnum) {
			var that = this;
			var aFilter = [];
			aFilter.push(new Filter("Pn_nr", FilterOperator.EQ, drawnum));
			aFilter.push(new Filter("Phynr", FilterOperator.EQ, sampnum));
			that.getOwnerComponent().getModel("printModel").read("/PhysicalSample", {
				filters: aFilter,
				success: function (oData, oResponse) {
					var DrawingArray = [];
					if (oResponse.statusCode === 200 || oResponse.statusCode === "200") {
						var serviceData = oData.results;
						that.tArray = serviceData;
						for (var y = 0; y < serviceData.length; y++) {
							var item = {
								"samplenumber": serviceData[y].Phynr,
								"drawingnumber": serviceData[y].Pn_nr,
								"samplecategory": serviceData[y].Prtyp,
								"material": serviceData[y].Matnr,
								"batch": serviceData[y].Charg,
								"insplot": serviceData[y].Plos2,
								"status": serviceData[y].Stat,
								"prtype": serviceData[y].Prtyp,
							}
							DrawingArray.push(item);
						}
						that.getOwnerComponent().getModel("CommonValueHelpModel").setProperty("/Drawing", DrawingArray);
					}
					that.getPrinter(eve);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (err) {
					var erMsg = JSON.parse(err.responseText);
					MessageToast.show(erMsg.error.message.value);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		onAddSample: function () {
			var t = this;
			// // this.getView().byId("idWizard").getSteps()[2].getContent()[0].removeSelections();
			// this.getView().byId("idWizard").getSteps()[2]._activate();
			var inspModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var HDR = this.getOwnerComponent().getModel("InspectionLotHDRModel");
			var LIN = this.getOwnerComponent().getModel("LocalInspModel");

			var aFilter = [];
			aFilter.push(new Filter("Prueflos", FilterOperator.EQ, HDR.getProperty("/InspectionLot")));
			aFilter.push(new Filter("Vornr", FilterOperator.EQ, HDR.getProperty("/SelOperationNo")));
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				inspModel.read("/InspOprSampleDefaultSet", {
					filters: aFilter,
					success: $.proxy(function (oRetrievedResult) {
						sap.ui.core.BusyIndicator.hide();
						LIN.setProperty("/InspectionLot", oRetrievedResult.results[0].Prueflos);
						LIN.setProperty("/SampleCategory", oRetrievedResult.results[0].Prtyp);
						LIN.setProperty("/SampleCntr", oRetrievedResult.results[0].Gbtyp);
						LIN.setProperty("/SampleQuantity", oRetrievedResult.results[0].Menge);
						LIN.setProperty("/UOM", oRetrievedResult.results[0].Meinh);
						// LIN.setProperty("/RecordResultSet", oRetrievedResult.results);
						LIN.refresh();
						this.fnOpenFragment("CreateSample");
					}, this),
					error: $.proxy(function (oError) {
						sap.ui.core.BusyIndicator.hide();
					}, this)
				});
			} else {
				MessageBox.information(oResource.getText("lblPleaseselectatleastonecriteria"));
			}

			// this.fnOpenFragment("CreateSample");
		},
		onVHUOM: function (oEvent) {
			var control = oEvent.getSource();
			BusyIndicator.show(0);
			var f4Model = this.getOwnerComponent().getModel("oDataSearchModel");
			var CommonValueHelpModel = this.getOwnerComponent().getModel("CommonValueHelpModel");
			var that = this;
			this.fnReadEntitySet(f4Model, "/UoMSHSet", "").then(function (resultData) {
				var newData1 = [];
				resultData.results.forEach(function (obj) {
					var nItem = {
						"Msehi": obj.Msehi,
						"Msehl": obj.Msehl,
					};
					newData1.push(nItem);
				});
				CommonValueHelpModel.setProperty("/UOMSHSet", newData1);
				CommonValueHelpModel.refresh();
				var oRes = that.getOwnerComponent().getModel("i18n").getResourceBundle();
				that.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblUOM"));
				that.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Msehi");
				that.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Msehl");
				var columns = that.getOwnerComponent().getModel("ColumnModel").getObject("/UOMColumn");
				var data = that.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/UOMSHSet");
				var entityset = "UoMSHSet";
				that.fnValueHelpDialog(control, entityset, columns, data);
				BusyIndicator.hide();
			}, function (err) {
				var erMsg = JSON.parse(err.responseText);
				MessageBox.error(erMsg.error.message.value);
				BusyIndicator.hide();
			});
		},

		/*	Method: getPrinter
		 *	Description/Usage: based on status it will call printers valuhelp
		 **/
		getPrinter: function (eve) {
			var eve1 = eve
			var flag = "O";
			var status = this.getOwnerComponent().getModel("CommonValueHelpModel").getData().Drawing[0].status;
			if (status.includes('LBPR')) {
				flag = "X";
			}
			if (flag === "X") {
				this.onPrinter(eve);
			}
			else {
				this.Print();
			}
		},
		/*	Method: onPrinter
		 *	Description/Usage: printer Value Help
		 **/
		onPrinter: function (eve) {
			var control = eve;
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResourceBundle.getText("lblPrinter"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Kname");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Pastandort");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/Printer");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/Printer");
			var entityset = "PrinterSHSet";
			this.fnValueHelpDialog1(control, entityset, columns, data);
		},
		fnValueHelpDialog1: function (control, entityset, columnData, data) {
			var that = this;
			this._oBasicSearchField = new SearchField({
				showSearchButton: false,
				liveChange: function (oEvent) {
					var fil = []
					var sQuery = oEvent.getSource().getValue();
					var columns = [];
					var col = [];
					columnData.cols.forEach(function (col) {
						var oFilter = new sap.ui.model.Filter(col.template, sap.ui.model.FilterOperator.Contains, sQuery);
						columns.push(oFilter);
					});
					if (sQuery.length === 0) {
						var obj1 = {};
						obj1[entityset] = data;
						that.oVHModel.setData(obj1);
						that._oValueHelpDialog.getTableAsync().then(function (oTable) {
							oTable.setModel(that.oVHModel);
							oTable.setModel(that.oColModel, "columns");
							if (oTable.bindRows) {
								oTable.bindAggregation("rows", "/" + entityset);
							}
							that._oValueHelpDialog.update();
						}.bind(that));
						sap.ui.core.BusyIndicator.hide();
					}
					control.setModel(this.oVHModel);
					var allFilter = new sap.ui.model.Filter(columns, false);
					var oBinding = oEvent.getSource().getParent().getParent().getParent().getItems()[1].getBinding("rows");
					oBinding.filter(allFilter);
					sap.ui.core.BusyIndicator.hide();

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
			}).then(function name(oFragment) {
				this._oValueHelpDialog = oFragment;
				this.getView().addDependent(this._oValueHelpDialog);
				this._oValueHelpDialog.getFilterBar().setBasicSearch(this._oBasicSearchField);
				this._oValueHelpDialog.getFilterBar().setShowGoOnFB(false);
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
									return new Label({
										text: "{" + column.template + "}"
									});
								})
							});
						});
					}
					this._oValueHelpDialog.update();
				}.bind(this));
				var oToken = new Token();
				this._oValueHelpDialog.setTokens([oToken]);
				this._oValueHelpDialog.open();
			}.bind(this));
		},
		/*	Method: Print
		 *	Description/Usage: print label functionality
		 **/
		Print: function () {
			var oModel = this.getView().getModel("filterModel");
			var payloadModel = this.getOwnerComponent().getModel("CommonValueHelpModel").getData().Drawing[0];
			var printer = oModel.getData().Printer;
			var payload = {
				"Pn_nr": "",
				"NP_PRINT": []
			};
			if (payloadModel.status.includes('LBPR')) {
				var item = {
					"Pn_nr": payloadModel.drawingnumber,
					"Phynr": payloadModel.samplenumber,
					"Stat": payloadModel.status,
					"Plos2": payloadModel.insplot,
					"Matnr": payloadModel.material,
					"Charg": payloadModel.batch,
					"Kname": printer
				};
				payload.NP_PRINT.push(item);
			}
			else {
				var item = {
					"Pn_nr": payloadModel.drawingnumber,
					"Phynr": payloadModel.samplenumber,
					"Stat": payloadModel.status,
					"Plos2": payloadModel.insplot,
					"Matnr": payloadModel.material,
					"Charg": payloadModel.batch,
					"Kname": ""
				};
				payload.NP_PRINT.push(item);
			}
			var oModel1 = this.getView().getModel("printModel");
			oModel1.create("/PrintSampleSet", payload, {
				method: "POST",
				success: $.proxy(function (data, oResponse) {
				}, this),
				error: $.proxy(function (oError) {
				})
			});
		},
		// onUnlock: function (oEvent) {
		// 	var aSelItems = this.getView().byId("idResult").getSelectedItems();
		// 	var oSharedModel = this.getOwnerComponent().getModel("RecordResultModel");
		// 	if (aSelItems.length != 0) {
		// 		aSelItems.forEach(oItem => {
		// 			var binding = oItem.getBindingContext("RecordResultModel").sPath;
		// 			if (oSharedModel.getProperty(binding + "/Status") != '0' || binding != '4') {
		// 				oSharedModel.setProperty(binding + "/Status", '2');
		// 			}
		// 		});
		// 	}
		// 	else {
		// 		var resultData = this.getOwnerComponent().getModel("RecordResultModel").getData();
		// 		resultData.RecordResultSet.forEach(function (oItem) {
		// 			if (oItem.Status != '0' || oItem.Status != '4') {
		// 				oItem.Status = '2';
		// 			}
		// 		});
		// 		this.getOwnerComponent().getModel("RecordResultModel").refresh()
		// 	}
		// },
		onUnlockPM: function (oEvent) {
			var aSelItems = this.getView().byId("idResult").getSelectedItems();
			var oSharedModel = this.getOwnerComponent().getModel("RecordResultModel");
			var DsEsigns = this.getOwnerComponent().getModel("InspectionLotHDRModel").getProperty("/DsEsigns");
			var DsNo = this.getOwnerComponent().getModel("EquipmentModel").getProperty("/EquipmentSet/0/DsNo");


			
			if (aSelItems.length != 0) {
				aSelItems.forEach(oItem => {
					var binding = oItem.getBindingContext("RecordResultModel").sPath;
					if (oSharedModel.getProperty(binding + "/Status") != '0' || oSharedModel.getProperty(binding + "/Status") != '4') {
						if (DsEsigns === "2" && DsNo === 1 && oSharedModel.getProperty(binding + "/Status") === '3') {

						}
						else {
							oSharedModel.setProperty(binding + "/Status", '2');
						}
					}
				});
			}
			else {
				var resultData = this.getOwnerComponent().getModel("RecordResultModel").getData();
				resultData.RecordResultSet.forEach(function (oItem) {
					if (oItem.Status != '0' || oItem.Status != '4') {
						if (DsEsigns === "2" && DsNo === 1 && oSharedModel.getProperty(binding + "/Status") === '3') {

						} else {
							oItem.Status = '2';
						}
					}
				});
				this.getOwnerComponent().getModel("RecordResultModel").refresh()
			}
		},
		onLock: function (oEvent) {
			var resultData = this.getOwnerComponent().getModel("RecordResultModel").getData();
			resultData.RecordResultSet.forEach(function (oItem) {
				if (oItem.Status != '0' || oItem.Status != '4') {
					oItem.Status = '5';
				}
			});
			this.getOwnerComponent().getModel("RecordResultModel").refresh()
		}
	});
});