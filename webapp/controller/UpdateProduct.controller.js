sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
],
function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("assignment1.controller.UpdateProduct", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("UpdateProduct").attachMatched(this._onRouteMatched, this);

            var tabModel = this.getOwnerComponent().getModel("productModelData");
            this.getView().setModel(tabModel, "productData");
            
            // Initialized a class property to store the product ID
            this.productId = null;
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this.productId = oArgs.productId; // Store productId in class property

            // Fetch product data using the productId
            var tabModel = this.getOwnerComponent().getModel("productModelData");
            var aProducts = tabModel.getProperty("/products");
            var oProduct = aProducts.find(function (product) {
                return product.product_id === this.productId; // Use the stored productId
            }.bind(this)); // Bind 'this' to access the class context

            if (oProduct) {
                // Set the values in the form inputs
                this.getView().byId("updateimageUrlInput").setValue(oProduct.image);
                this.getView().byId("updatep_name").setValue(oProduct.product_name);
                this.getView().byId("updateartistNameInput").setValue(oProduct.artist_name);
                this.getView().byId("updateratingP").setValue(oProduct.rating);
                this.getView().byId("updateprice").setValue(oProduct.price);
                this.getView().byId("updateheight").setValue(oProduct.height);
                this.getView().byId("updatedepth").setValue(oProduct.depth);
                this.getView().byId("updatewidth").setValue(oProduct.width);
                this.getView().byId("updatedescriptionInput").setValue(oProduct.description); // Set description
            } else {
                MessageToast.show("Product not found!");
            }
        },

        onSave: function () {
            // Use the productId stored in the class property
            const productId = this.productId; 
            
            // Handle the save logic here
            const inputs = this.getView().findAggregatedObjects(true)
                .filter(o => o.isA("sap.m.Input"));
            
            let isValid = true;
            
            // Validate inputs
            inputs.forEach(oInput => {
                const value = oInput.getValue();
                switch (oInput.getId()) {
                    case this.byId("updateratingP")?.getId():
                        isValid = isValid && /^([1-4](\.[0-9])?|5(\.0)?)$/.test(value);
                        break;
                    case this.byId("updateprice")?.getId():
                    case this.byId("updateheight")?.getId():
                    case this.byId("updatedepth")?.getId():
                    case this.byId("updatewidth")?.getId():
                        isValid = isValid && /^[0-9]+$/.test(value);
                        break;
                    case this.byId("updateartistNameInput")?.getId():
                        isValid = isValid && /^[A-Za-z0-9 ]+$/.test(value);
                        break;
                    // Add other cases as needed
                }
            
                // Handle validation feedback
                if (!isValid) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid input");
                } else {
                    oInput.setValueState("None");
                }
            });
            
            if (!isValid) {
                sap.m.MessageToast.show("Please correct the highlighted fields.");
                return; // Stop if inputs are invalid
            }
            
            // Get the model
            const oModel = this.getOwnerComponent().getModel("productModelData");
            const aProducts = oModel.getProperty("/products") || [];
            
            // Find the product to update
            const productIndex = aProducts.findIndex(product => product.product_id === productId);
            
            if (productIndex === -1) {
                sap.m.MessageToast.show("Product not found for updating.");
                return; // Exit if product is not found
            }
            
            // Update the existing product object
            const updatedProduct = {
                ...aProducts[productIndex], // Keep existing properties
                image: this.byId("updateimageUrlInput")?.getValue() || "",
                product_name: this.byId("updatep_name")?.getValue() || "",
                artist_name: this.byId("updateartistNameInput")?.getValue() || "",
                rating: parseFloat(this.byId("updateratingP")?.getValue()) || 0,
                price: parseInt(this.byId("updateprice")?.getValue(), 10) || 0,
                height: parseInt(this.byId("updateheight")?.getValue(), 10) || 0,
                depth: parseInt(this.byId("updatedepth")?.getValue(), 10) || 0,
                width: parseInt(this.byId("updatewidth")?.getValue(), 10) || 0,
                available: true, // Maintain or update this value as needed
                // state: updateratingValue < 4 ? "Warning" : "Success", // Conditional state based on rating,
                description: this.byId("updatedescriptionInput")?.getValue() || "" // Get description value
            };

            // Update the product in the existing products array
            aProducts[productIndex] = updatedProduct;
            
            // Update the model with the new data
            oModel.setProperty("/products", aProducts);
            
            sap.m.MessageToast.show("Product Updated successfully!");
        }
    });
});
