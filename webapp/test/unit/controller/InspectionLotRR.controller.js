/*global QUnit*/

sap.ui.define([
	"comreckitt/zqm_insplotrr/controller/InspectionLotRR.controller"
], function (Controller) {
	"use strict";

	QUnit.module("InspectionLotRR Controller");

	QUnit.test("I should test the InspectionLotRR controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
