/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/reckitt/zqminsplotrr/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.reckitt.zqminsplotrr.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                UIComponent.prototype.init.apply(this, arguments);
                this.getRouter().initialize();
                this.setModel(models.createDateFormatModel(),"DateFormatModel");
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(models.createAppModeModel(), "AppModeModel");
                this.setModel(models.createfilterModel(), "filterModel");
                this.setModel(models.createColumnModel(), "ColumnModel");
                this.setModel(models.createVHKeyModel(), "VHKeyModel");
                this.setModel(models.createValueHelpModel(), "CommonValueHelpModel");	
                this.setModel(models.createInspectionLotHDRModel(), "InspectionLotHDRModel");
                this.setModel(models.createInspectionLotModel(), "InspectionLotModel");
                this.setModel(models.createOperationModel(), "OperationModel");
                this.setModel(models.createEquipmentModel(), "EquipmentModel");
                this.setModel(models.createRecordResultModel(), "RecordResultModel");
                this.setModel(models.createNotificationModel(), "NotificationModel");
                this.setModel(models.createAttachmentModel(), "AttachmentModel");
                this.setModel(models.createDigitalSignModel(), "DigitalSignModel");
                this.setModel(models.createLocalInspModel(), "LocalInspModel");
                this.setModel(models.createUOMModel(), "uomModel");
                this.setModel(models.createRecordResultCompareModel(), "RecordResultCompareModel");//QM Model
                this.setModel(models.createReferenceLineModel(), "ReferenceLineModel");
                this.setModel(models.createFlatDataSetModel(),"FlatDataSeteModel");
                this.setModel(models.createStatusPopupSetModel(),"StatusPopupModel");
                this.setModel(models.createoDocumentDisplayModel(),"DocumentDisplayModel");
            }
        });
    }
);