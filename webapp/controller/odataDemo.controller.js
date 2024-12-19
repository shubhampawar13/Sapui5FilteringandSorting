sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("assignment1.controller.AddProduct", {
        onInit: function () {
            var tabModel = this.getOwnerComponent().getModel("productModelData");
            this.getView().setModel(tabModel, "productData");
        },
        
    });
});
