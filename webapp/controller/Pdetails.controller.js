sap.ui.define([
    "sap/ui/core/mvc/Controller",
     'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
],
function (Controller,JSONModel,MessageToast) {
    "use strict";

    return Controller.extend("assignment1.controller.Pdetails", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();

			oRouter.getRoute("Pdetails").attachMatched(this._onRouteMatched, this);//this method will be triggred on url matching
            var tabModel = this.getOwnerComponent().getModel("productModelData");
            this.getView().setModel(tabModel,"productData");
            
        },
        _onRouteMatched : function (oEvent) {
			var oArgs, oView;

			oArgs = oEvent.getParameter("arguments");
            var pId =oArgs.productId; 
            console.log(pId);
			oView = this.getView();
            console.log(oView);

            //getting data model
            var tabModel = this.getOwnerComponent().getModel("productModelData");
            var aProducts = tabModel.getProperty("/products");
            console.log(aProducts);

             // Find the product by ID
            var oProduct = aProducts.find(function(product) {
                return product.product_id === pId;
             });

             console.log(oProduct);

             // Check if the product exists and bind it to the view
            if (oProduct) {
                this.getView().bindObject({
                    path: "/products/" + aProducts.indexOf(oProduct),
                    model: "productData"
                });
                console.log("binded")
            } else {
                // Handle the case where the product is not found
                console.error("Product not found: " + pId);
            }

			// oView.bindElement({
			// 	path : "/Employees(" + oArgs.employeeId + ")",
			// 	events : {
			// 		change: this._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			oView.setBusy(true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 			oView.setBusy(false);
			// 		}
			// 	}
			// });
		},
        onUpdateProduct: function(){
            var oView = this.getView();
            var tabModel = this.getOwnerComponent().getModel("productModelData");
            // var aProducts = tabModel.getProperty("/products");
            
            // Get the product ID from the current binding context
            var oProduct = oView.getBindingContext("productData").getObject();
            var productId = oProduct.product_id; // Assuming product_id is the identifier you want to pass
        
            // Navigate to the UpdateProduct view with productId as a parameter
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("UpdateProduct", {
                productId: productId
            });
        }
        
    });
});
