sap.ui.define([], function () {
	"use strict";
	return {
		/*	Method: dateFormat
		 *	Description/Usage: formatter for date - user format DD-MM-yyyy
		 */
		dateFormat: function (oEve) {
			if (oEve === null) {
				return null;
			} else {
				var dt = new Date(oEve);
				var day = String(dt.getDate()).padStart(2, '0');
				var month = String(dt.getMonth() + 1).padStart(2, '0');
				var output = day + '-' + month + "-" + dt.getFullYear();
				return output;
			}
		},
		/*	Method: getNotifiTimeline
		 *	Description/Usage: formatter for due date in days
		 */
		getNotifiTimeline: function (value) {
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var now = new Date();
			now.setHours(0, 0, 0, 0);
			var seldate = new Date(value);
			if (seldate < now) {
				return oResourceBun.getText("lblPastDue");
			} else {
				var diffTime = Math.abs(seldate - now);
				var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				return oResourceBun.getText("lblWithin") + diffDays + oResourceBun.getText("lbldays");
			}
		},
		/*	Method: getNotifiTimeStatus
		 *	Description/Usage: formatter for status to display in user understanding way sucess or failed
		 */
		getNotifiTimeStatus: function (value) {
			var oResourceBun = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var now = new Date();
			now.setHours(0, 0, 0, 0);
			var seldate = new Date(value);
			if (seldate < now) {
				//	return oResourceBun.getText("lblError");
				return "Error";

			} else {
				var diffTime = Math.abs(seldate - now);
				var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
				if (diffDays > 3) {
					//	return oResourceBun.getText("lblSuccess");
					return "Success";

				} else {
					//	return oResourceBun.getText("lblWarning");
					return "Warning";

				}
			}
		}
	};
});