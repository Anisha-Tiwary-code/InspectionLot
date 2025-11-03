/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comreckitt/zqm_insplotrr/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
