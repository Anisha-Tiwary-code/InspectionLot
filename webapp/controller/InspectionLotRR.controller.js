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
	"sap/ui/model/FilterOperator"
], function (BaseController, Controller, Fragment, MessageBox, JSONModel, Dialog, formatter, ValueState, BusyIndicator, Filter, FilterOperator) {
	"use strict";
	var oRes;
	return BaseController.extend("com.reckitt.zqminsplotrr.controller.InspectionLotRR", {
		formatter: formatter,
		/*	Method: onInit
		 *	Description/Usage: Initiating pre required service and route functionality
		 */
		onInit: function () {
			oRes = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.fnPreLoadingService();
			this.getUserDateFormat();
			/*var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this._onObjectMatched, this);*/
		},
		// method to get User date format added by Komal Nilakhe on 12-11-2024
		getUserDateFormat: async function () {
			sap.ui.core.BusyIndicator.show();
			
			var username;
			if (sap.ushell !== undefined) {
				username = sap.ushell.Container.getService("UserInfo").getId();
			}
			var oDateModel = this.getOwnerComponent().getModel("DateFormatModel");

			this.fetchDateFormat("/USERDATESHSet('" + username + "')").then((oData) => {
				// Set date format in the model
				oDateModel.getData().dateFormat = oData.Dformat;
				oDateModel.refresh();

			}).catch((error) => {
				console.error("Error fetching date format:", error);
			}).finally(() => {
				sap.ui.core.BusyIndicator.hide();
			});
		},
		fetchDateFormat: function (entitySetPath) {
			return new Promise((resolve, reject) => {
				var oModel = this.getOwnerComponent().getModel("oDataModel");
				oModel.read(entitySetPath, {
					success: function (oData) {
						resolve(oData);  // Resolve the Promise with the data
					},
					error: function (oError) {
						reject(oError);  // Reject the Promise with the error
					}
				});
			});
		},
		/*	Method: onVHFunctionalLoc
		 *	Description/Usage: open value help dialog for functional location
		 */
		onVHFunctionalLoc: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblFunctionalLocation"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "FunctionalLoc");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/functionallocation");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/FunctionalLoc");
			var entityset = "FunctionalLoc";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHEquipment
		 *	Description/Usage: open value help dialog for equipment
		 */
		onVHEquipment: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblEquipment"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Equipment");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/equipment");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/Equipment");
			var entityset = "Equipment";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHInspectionType
		 *	Description/Usage: open value help dialog for inspection type
		 */
		onVHInspectionType: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblInspectionType"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "InspectionType");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/InspectionTypeColumn");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/InspectionTypeSet");
			var entityset = "InspectionTypeSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHInspTypeQM
		 *	Description/Usage: open value help dialog for inspection type QM
		 */
		onVHInspTypeQM: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblInspectionType"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "InspectionType"); //mandatory
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description"); //mandatory
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/inspectiontype"); //give from model
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/InspectionTypeQM"); //give from fnBuildSuccesslist
			var entityset = "QMInspTypeSHSet"; //same as data
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHMaterial
		 *	Description/Usage: open value help dialog for Material
		 */
		onVHMaterial: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblMaterial"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Material"); //mandatory
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description"); //mandatory
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/material"); //give from model
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/MaterialSetQM"); //give from fnBuildSuccesslist
			var entityset = "MaterialSHSet"; //same as data
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHBatch
		 *	Description/Usage: open value help dialog for Batch
		 */

		onVHBatch: function (oEvent) {

			// Pratibha's code start - Here /BatchSHSet needs filters(on plant and material) to be passed to get data on Entity set
			// changes made on 28 Feb 2025
			var f4Model = this.getOwnerComponent().getModel("oDataSearchModel");
			var BatchURL = f4Model.sServiceUrl;
			if (this.getView().byId("PlantID")) {
				var plantValue = this.getView().byId("PlantID").getValue();
			}
			if (this.getView().byId("materialID")) {
				var materialValue = this.getView().byId("materialID").getValue();
			}
			if (plantValue !== "" && materialValue === "") {
				BatchURL = BatchURL + "/BatchSHSet?&$filter=Werks eq " + "'" + plantValue + "'" + "&$format=json";
			}
			if (plantValue === "" && materialValue !== "") {
				BatchURL = BatchURL + "/BatchSHSet?&$filter=Matnr eq " + "'" + materialValue + "'" + "&$format=json";
			}
			if (plantValue !== "" && materialValue !== "") {
				BatchURL = BatchURL + "/BatchSHSet?&$filter=Werks eq " + "'" + plantValue + "'" + " " + "and Matnr eq " + "'" + materialValue + "'" + "&$format=json";
			}
			if (plantValue === "" && materialValue === "") {
				BatchURL = BatchURL + "/BatchSHSet?&$filter=Werks eq " + "''" + " " + "and Matnr eq " + "''" + "&$format=json";
			}


			var control = oEvent.getSource();
			var CommonValueHelpModel = this.getOwnerComponent().getModel("CommonValueHelpModel");
			var that = this;
			$.ajax({
				url: BatchURL,
				type: "GET",
				success: function (data, textStatus, request) {
					var resultData = data.d.results;
					var newData1 = [];
					resultData.forEach(function (obj) {
						var nItem = {
							"Batch": obj.Charg,
							"Description": obj.Werks
						};
						newData1.push(nItem);
					});
					CommonValueHelpModel.setProperty("/BatchSetQM", newData1);
					CommonValueHelpModel.refresh();
					var oRes = that.getOwnerComponent().getModel("i18n").getResourceBundle();
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblEquipment"));
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Batch"); //mandatory
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description"); //mandatory
					var columns = that.getOwnerComponent().getModel("ColumnModel").getObject("/batch"); //give from model
					var data = that.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/BatchSetQM"); //give from fnBuildSuccesslist
					var entityset = "BatchSHSet"; //same as data
					that.fnValueHelpDialog(control, entityset, columns, data);

				},
				error: function (oResponse4) {

					var oRes = that.getOwnerComponent().getModel("i18n").getResourceBundle();
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblEquipment"));
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Batch"); //mandatory
					that.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description"); //mandatory
					var columns = that.getOwnerComponent().getModel("ColumnModel").getObject("/batch"); //give from model
					var data = that.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/BatchSetQM"); //give from fnBuildSuccesslist
					var entityset = "BatchSHSet"; //same as data
					that.fnValueHelpDialog(control, entityset, columns, data);
				}
			});
			// Pratibha code End

		},
		/*	Method: onVHMaterialType
		 *	Description/Usage: open value help dialog for Material Type
		 */
		onMaterialType: function (oEvent) {
			var control = oEvent.getSource();
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResourceBundle.getText("lblMaterialType"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "materialtype");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/MaterialType");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/MaterialType");
			var entityset = "MaterialTypeSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		//Begin Code CR 5000026736 Veera Sudheer
		/*	Method: onVHWorkCenter
		 *	Description/Usage: open dialog for Work Center
		 */
		onWorkCenterType: function (oEvent) {
			if (!this._oWorkCenterDialog) {
				this._oWorkCenterDialog = sap.ui.xmlfragment("com.reckitt.zqminsplotrr.view.Fragments.WorkCenterValueHelp", this);
				this.getView().addDependent(this._oWorkCenterDialog);

				const oModel = new sap.ui.model.json.JSONModel({
					workCenterCategory: "",
					plant: "",
					workCenter: "",
					description: "",
					results: []
				});
				this._oWorkCenterDialog.setModel(oModel, "workCenterModel");
			}
			this._oWorkCenterDialog.open();
		},
		/*	Method: onVHWorkCenterCategory
		 *	Description/Usage: open value help dialog for Work Center Category
		 */
		onWorkCenterCategoryHelp: function (oEvent) {
			var control = oEvent.getSource();
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResourceBundle.getText("lblWorkCenterCategory"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Category");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/WorkCenterCategory");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/WorkCenterCategory");
			var entityset = "WorkCtrCategSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onVHPlant
		 *	Description/Usage: open value help dialog for Plant
		 */
		onPlantHelp: function (oEvent) {
			var control = oEvent.getSource();
			var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oResourceBundle.getText("lblPlant"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "Plant");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Description");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/Plant");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/Plant");
			var entityset = "PlantSHSet";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		onSearchWorkCenters: function (oEvent) {
			var that = this;
			const oData = this._oWorkCenterDialog.getModel("workCenterModel").getData();
			const oWorkCenterCategory = oData.workCenterCategory;
			var oPlant = oData.plant;
			var sWorkCenter = oData.workCenter;
			var sDescription = oData.description;
			const aFilters = [];
			if (oWorkCenterCategory) {
				aFilters.push(new sap.ui.model.Filter("VERWE", sap.ui.model.FilterOperator.EQ, oWorkCenterCategory));
			}
			if (oPlant) {
				oPlant = oPlant.toUpperCase();
				aFilters.push(new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, oPlant));
			}
			if (sWorkCenter) {
				sWorkCenter = sWorkCenter.toUpperCase();
				aFilters.push(new sap.ui.model.Filter("ARBPL", sap.ui.model.FilterOperator.EQ, sWorkCenter));
			}
			if (sDescription) {
				sDescription = sDescription.toUpperCase();
				aFilters.push(new sap.ui.model.Filter("KTEXT", sap.ui.model.FilterOperator.EQ, sDescription));
			}
			this.oDataModel = this.getOwnerComponent().getModel("oDataSearchModel");
			this.oDataModel.read("/WorkCentersSet", {
				filters: aFilters,
				success: function (data) {
					that._oWorkCenterDialog.getModel("workCenterModel").setProperty("/results", data.results);
				},
				error: function (oError) {

				}

			});

		},
		onWorkCenterSelect: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			// Get the table from the dialog
			const aContent = this._oWorkCenterDialog.getContent();
			const oTable = aContent.find(c => c.getId().includes("workCenterTable"));

			// Get selected item
			const oSelectedItem = oTable.getSelectedItem();

			if (!oSelectedItem) {
				sap.m.MessageToast.show("Please select a work center.");
				return;
			}

			// Get the selected context object
			const oContext = oSelectedItem.getBindingContext("workCenterModel");
			const oSelectedData = oContext.getObject();
			const sWorkCenter = oSelectedData.workCenter || oSelectedData.ARBPL;
			oFilterData.setProperty("/WorkCenter", sWorkCenter);
			this._oWorkCenterDialog.close();
		},
		onDialogClose: function (oEvent) {
			this._oWorkCenterDialog.close();
		},
		//End Code CR 5000026736 Veera Sudheer
		/*	Method: onChangeFuncLoc
		 *	Description/Usage: change of functional location manually
		 */
		onChangeFuncLoc: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			if (oFilterData.getProperty("/FunctionalLocation").length > 0) {
				var t = this;
				var bValid = false;
				var sFuncLocation = oFilterData.getProperty("/FunctionalLocation");
				var aFuncLocation = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/FunctionalLoc");
				aFuncLocation.forEach(function (oFuncLoc) {
					if (sFuncLocation === oFuncLoc.FunctionalLoc) {
						bValid = true;
					}
				});
				if (bValid === false) {
					MessageBox.information(oRes.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sFuncLocation);
					oFilterData.setProperty("/FunctionalLocation", "");
				}
			}
		},
		/*	Method: onChangeEquipment
		 *	Description/Usage: change of equipment location manually
		 */
		onChangeEquipment: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			if (oFilterData.getProperty("/Equipment").length > 0) {
				var t = this;
				var bValid = false;
				var sEquipment = oFilterData.getProperty("/Equipment");
				var aEquipment = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/Equipment");
				aEquipment.forEach(function (oEquip) {
					if (sEquipment === oEquip.Equipment) {
						bValid = true;
					}
				});
				if (bValid === false) {
					MessageBox.information(oRes.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sEquipment);
					oFilterData.setProperty("/Equipment", "");
				}
			}
		},
		/*	Method: onChangeInspType
		 *	Description/Usage: change of equipment location manually
		 */
		onChangeInspType: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			if (oFilterData.getProperty("/InspectionType").length > 0) {
				var t = this;
				var bValid = false;
				var sInspectionType = oFilterData.getProperty("/InspectionType");
				var aInspType = t.getOwnerComponent().getModel("CommonValueHelpModel").getProperty("/InspectionTypeSet");
				aInspType.forEach(function (oInsType) {
					if (sInspectionType === oInsType.InspectionType) {
						bValid = true;
					}
				});
				if (bValid === false) {
					MessageBox.information(oRes.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sInspectionType);
					oFilterData.setProperty("/InspectionType", "");
				}
			}
		},
		//Begin Code CR 5000026736 Veera Sudheer
		/*	Method: onChangeProdOrder
		 *	Description/Usage: Scanner reader for Production Order
		 */
		onChangeProdOrder: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			var sProductionOrder = oFilterData.getProperty("/ProductionOrder");

			// Exit if empty
			if (!sProductionOrder || sProductionOrder.length === 0) return;

			// Validate for special characters (allow only letters, numbers)
			var oRes = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oSpecialCharRegex = /[^a-zA-Z0-9]/;

			if (oSpecialCharRegex.test(sProductionOrder)) {
				MessageBox.warning(oRes.getText("lblSpecialCharactersNotAllowed"));
				oFilterData.setProperty("/ProductionOrder", "");
				return;
			}

			// Prevent multiple parallel validations
			if (this._bProdOrderCheckInProgress) return;
			this._bProdOrderCheckInProgress = true;

			var oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");

			oDataInspectionLotModel.read("/ProdOrderChkSet('" + sProductionOrder + "')", {
				success: function (data) {
					this._bProdOrderCheckInProgress = false;

					if (data.Zflag !== "X") {
						if (this._sLastInvalidProductionOrderShown !== sProductionOrder) {
							this._sLastInvalidProductionOrderShown = sProductionOrder;

							MessageBox.information(
								oRes.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sProductionOrder
							);
						}
						oFilterData.setProperty("/ProductionOrder", "");
					} else {
						// Valid sample — reset last invalid sample tracker
						this._sLastInvalidProductionOrderShown = null;
					}
				}.bind(this),

				error: function (oError) {
					this._bProdOrderCheckInProgress = false;
					sap.m.MessageToast.show(oError.responseText);
				}.bind(this)
			});
		},
		/*	Method: onSample
		 *	Description/Usage: Scanner reader for Sample
		 */
		onSample: function (oEvent) {
			var oFilterData = this.getOwnerComponent().getModel("filterModel");
			var sSample = oFilterData.getProperty("/Sample");

			if (!sSample || sSample.length === 0) return;

			// Check for special characters
			var oRes = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oSpecialCharRegex = /[^a-zA-Z0-9]/; // Only allow alphanumeric characters

			if (oSpecialCharRegex.test(sSample)) {
				MessageBox.warning(oRes.getText("lblSpecialCharactersNotAllowed"));
				oFilterData.setProperty("/Sample", ""); // Clear invalid input
				return;
			}

			// Prevent multiple parallel checks
			if (this._bSampleCheckInProgress) return;
			this._bSampleCheckInProgress = true;

			var oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");

			oDataInspectionLotModel.read("/PhySampleChkSet('" + sSample + "')", {
				success: function (data) {
					this._bSampleCheckInProgress = false;

					if (data.ZFLAG !== "X") {
						if (this._sLastInvalidSampleShown !== sSample) {
							this._sLastInvalidSampleShown = sSample;
							MessageBox.information(
								oRes.getText("lblInvalidorUnauthorisedObjectSelected") + " " + sSample
							);
						}
						oFilterData.setProperty("/Sample", "");

					} else {

						this._sLastInvalidSampleShown = null;
					}
				}.bind(this),

				error: function (oError) {
					this._bSampleCheckInProgress = false;
					sap.m.MessageToast.show(oError.responseText);
				}.bind(this)
			});

		},
		//End Code CR 5000026736 Veera Sudheer
		/*	Method: onVHWorkCenter
		 *	Description/Usage: open value help dialog for workcenter
		 */
		onVHWorkCenter: function (oEvent) {
			var control = oEvent.getSource();
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/Title", oRes.getText("lblWorkCenter"));
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/key", "WorkCenterID");
			this.getOwnerComponent().getModel("VHKeyModel").setProperty("/descriptionKey", "Plant");
			var columns = this.getOwnerComponent().getModel("ColumnModel").getObject("/ColWorkCenter");
			var data = this.getOwnerComponent().getModel("CommonValueHelpModel").getObject("/WorkCenter");
			var entityset = "WorkCenter";
			this.fnValueHelpDialog(control, entityset, columns, data);
		},
		/*	Method: onBCSFuncLoc
		 *	Description/Usage: open barcode scanner to read functional location
		 */
		onBCSFuncLoc: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/FunctionalLocation";
			this.fnScanBarCode(updModel, updProperty);
		},
		/*	Method: onBCSEquipment
		 *	Description/Usage: open barcode scanner to read equipment
		 */
		onBCSEquipment: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/Equipment";
			this.fnScanBarCode(updModel, updProperty);
		},
		/*	Method: onBCSProdOrder
		 *	Description/Usage: open barcode scanner to rad sample
		 */
		onBCSSample: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/Sample";
			this.fnScanBarCode(updModel, updProperty);
		},
		//Begin Code CR 5000026736 Veera Sudheer
		/*	Method: onBCSProdOrder
		 *	Description/Usage: open barcode scanner to read production order
		 */
		onBCSProdOrder: function (oEvent) {
			var updModel = this.getOwnerComponent().getModel("filterModel");
			var updProperty = "/ProductionOrder";
			this.fnScanBarCode(updModel, updProperty);
		},
		//End Code CR 5000026736 Veera Sudheer
		/*	Method: onSearch
		 *	Description/Usage: fetch inspection lot result based on filter values filled
		 */
		onSearch: function (oEvent) {
			var t = this;
			var oDataInspectionLotModel = this.getOwnerComponent().getModel("oDataInspectionLotModel");
			var aFilter = this.fnFilterValues();
			var param = { "filters": aFilter };
			if (aFilter.length > 0) {
				BusyIndicator.show(0);
				this.fnReadEntitySet(oDataInspectionLotModel, "/InspLotRRHdrSet", param).then(
					function (dataResult) {
						var aResult = [];
						dataResult.results.forEach(function (data) {
							var InspStartDt = t.fnFormatILDate(data.Pastrterm);
							var srhItem = {
								"WorkOrderNo": data.Aufnr,
								"InspectionLot": data.Insplot,
								"Matnr": data.Matnr,
								"Charg": data.Charg,
								"Werk": data.Werk,
								"InspectionType": data.Art,
								"Maktx": data.Maktx,
								"Isd": data.Isd,
								"Equnr": data.Equnr,
								"QlXequi": data.QlXequi,
								"Tplnr": data.Tplnr,
								"QlXfunc": data.QlXfunc,
								"Pastrterm": data.Pastrterm,
								"Paendterm": data.Paendterm,
								"Eqktx": data.Eqktx,
								"Pltxt": data.Pltxt,
								"InspectionObject": data.Pltxt,
								"InspectionObjectShortText": data.Ktextmat,
								"InspectionStartDate": InspStartDt,
								"Status": data.Sttxt,
								"UserStatus": data.UserStatus
							};
							aResult.push(srhItem);
						});
						t.getOwnerComponent().getModel("InspectionLotModel").setProperty("/InspectionLotSet", aResult);
						t.getOwnerComponent().getModel("InspectionLotModel").refresh();
						BusyIndicator.hide();
					}, function (err) {
						BusyIndicator.hide();
						var errMsg = JSON.parse(err.responseText);
						MessageBox.error(errMsg.error.message.value);
						t.getOwnerComponent().getModel("InspectionLotModel").setProperty("/InspectionLotSet", []);
						t.getOwnerComponent().getModel("InspectionLotModel").refresh();
					});
			} else {
				MessageBox.information(oRes.getText("lblPleaseselectatleastonecriteria"));
			}
		},
		//date formatter function added by Komal Nilakhe on 12/11/2024
		fnFormatILDate: function (dateString) {
			var format = this.getOwnerComponent().getModel("DateFormatModel").getData().dateFormat;
			// Check if the date is null, undefined, or empty
			if (!dateString) {
				return ""; // Return an empty string if date is invalid
			}

			// Parse the date string into a JavaScript Date object
			var date = new Date(dateString);

			// Check if the date is valid
			if (isNaN(date.getTime())) {
				return ""; // Return an empty string if date is invalid
			}

			// Create a DateFormat instance with the retrieved format (only for date, no time)
			var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: format
			});

			// Format the date using the specified format
			return dateFormatter.format(date);
		},
		/*	Method: onLiveSearchInspectionLot
		 *	Description/Usage: inspection lot table live search to fetch matching items
		 */
		onLiveSearchInspectionLot: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var oFilter = new Filter({
				filters: [
					new Filter("InspectionType", FilterOperator.Contains, sQuery),
					new Filter("InspectionLot", FilterOperator.Contains, sQuery),
					new Filter("InspectionObjectShortText", FilterOperator.Contains, sQuery),
					new Filter("Status", FilterOperator.Contains, sQuery)
					/*new Filter("InspectionStartDate", FilterOperator.Contains, sQuery)*/
				]
			});
			var oBinding = oEvent.getSource().getParent().getParent().getBinding("items");
			oBinding.filter(oFilter);
		},
		/*	Method: onItemSelected
		 *	Description/Usage: on selection of item navigating to detail screen with parameter
		 */
		onItemSelected: function (oEvent) {
			var oSelectedInspectionLot = oEvent.getSource().getCells()[1].getText();
			var Maktx = encodeURIComponent(oEvent.getSource().getBindingContext('InspectionLotModel').getObject().Maktx);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var filters = this.getOwnerComponent().getModel("filterModel");
			if (filters.getProperty("/inspectionlottypes") === 0) {
				oRouter.navTo("InspectionLotDetail", { "InspectionLotNo": oSelectedInspectionLot });
			}
			else if (filters.getProperty("/inspectionlottypes") === 1) {
				oRouter.navTo("InspectionLotDetailQM", { "InspectionLotNo": oSelectedInspectionLot, "MaterialText": Maktx })
			}
		},
		onRadioSelectChange: function (oEvent) {
			var filterModel = this.getOwnerComponent().getModel("filterModel");
			//debugger
			if (oEvent.getSource().getSelectedIndex() === 0) {
				filterModel.setProperty("/selectedREL", true)
				filterModel.setProperty("/inspectionlottypes", 0);
			}
			else if (oEvent.getSource().getSelectedIndex() === 1) {
				filterModel.setProperty("/selectedREL", false)
				filterModel.setProperty("/inspectionlottypes", 1);
			}

		},
		//Begin Code CR 5000026736 Veera Sudheer
		/**
			Method: handleSuggest
			Description/Usage: This function used to handle the suggestions for batch field
		 */
		handleSuggest: function (oEvent) {			
                var param;                
                var sValue = oEvent.getParameter("suggestValue");
                var aFilters = [];
                if (oEvent.getParameter("id").includes("idBatch")) {
                    param = "Charg";
                }                
                if (sValue) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter(param, FilterOperator.Contains, sValue.toUpperCase())
                        ],
                    }));
                }
                var oSource = oEvent.getSource();
                //oSource.setModel(this.getOwnerComponent().getModel("ListModel"));
                var oBinding = oSource.getBinding('suggestionItems');
                oBinding.filter(aFilters);
               
		}
		//End Code CR 5000026736 Veera Sudheer
	});
});