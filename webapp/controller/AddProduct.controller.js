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
        onSave: function () {
            const inputs = this.getView().findAggregatedObjects(true)
                .filter(o => o.isA("sap.m.Input"));

            let isValid = true;

            // Validate inputs
            inputs.forEach(oInput => {
                const value = oInput.getValue();
                switch (oInput.getId()) {
                    case this.byId("ratingP")?.getId():
                        isValid = isValid && /^([1-4](\.[0-9])?|5(\.0)?)$/.test(value);
                        break;
                    case this.byId("price")?.getId():
                    case this.byId("height")?.getId():
                    case this.byId("depth")?.getId():
                    case this.byId("width")?.getId():
                        isValid = isValid && /^[0-9]+$/.test(value);
                        break;
                    case this.byId("artistNameInput")?.getId():
                        isValid = isValid && /^[A-Za-z0-9 ]+$/.test(value);
                        break;
                    case this.byId("imageUrlInput")?.getId():
                        isValid = isValid && /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
                        break;
                    case this.byId("p_name")?.getId():
                        isValid = true; // No specific validation for painting name
                        break;
                    case this.byId("descriptionInput")?.getId():
                        // Description: Allow all characters
                        isValid = true; // No specific validation required
                        break;
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
                MessageToast.show("Please correct the highlighted fields.");
                return; // Stop if inputs are invalid
            }

            // Get the model
            const oModel = this.getOwnerComponent().getModel("productModelData");
            const aProducts = oModel.getProperty("/products") || [];

            // Create a new product object
            const ratingValue = parseFloat(this.byId("ratingP")?.getValue()) || 0;

            const newProduct = {
                image: this.byId("imageUrlInput")?.getValue() || "",
                product_name: this.byId("p_name")?.getValue() || "",
                product_id: "SKU: " + new Date().getTime(), // Unique ID
                artist_name: this.byId("artistNameInput")?.getValue() || "",
                rating: ratingValue,
                price: parseInt(this.byId("price")?.getValue(), 10) || 0,
                height: parseInt(this.byId("height")?.getValue(), 10) || 0,
                depth: parseInt(this.byId("depth")?.getValue(), 10) || 0,
                width: parseInt(this.byId("width")?.getValue(), 10) || 0,
                available: true,
                state: ratingValue < 4 ? "Warning" : "Success", // Conditional state based on rating
                description: this.byId("descriptionInput")?.getValue() || "" // Get description
            };

            // Add the new product to the existing products array
            aProducts.push(newProduct);

            // Update the model with the new data
            oModel.setProperty("/products", aProducts);

            MessageToast.show("Product saved successfully!");
        },
        onInputChange: function (oEvent) {
            const oInput = oEvent.getSource();
            const value = oInput.getValue();
            let isValid = true;

            switch (oInput.getId()) {
                case this.byId("ratingP")?.getId():
                    // Rating: Regex for 1 to 5 with one decimal place
                    isValid = /^([1-4](\.[0-9])?|5(\.0)?)$/.test(value);
                    break;
                case this.byId("price")?.getId():
                case this.byId("height")?.getId():
                case this.byId("depth")?.getId():
                case this.byId("width")?.getId():
                    // Price, Height, Depth, Width: Only numbers
                    isValid = /^[0-9]+$/.test(value);
                    break;
                case this.byId("artistNameInput")?.getId():
                    // Artist Name: Latin characters and numbers
                    isValid = /^[A-Za-z0-9 ]+$/.test(value);
                    break;
                case this.byId("imageUrlInput")?.getId():
                    // Image URL: Basic validation for URL
                    isValid = /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(value);
                    break;
                case this.byId("p_name")?.getId():
                    // Painting Name: Allow all characters
                    isValid = true; // No specific validation required
                    break;
                case this.byId("descriptionInput")?.getId():
                    // Description: Allow all characters
                    isValid = true; // No specific validation required
                    break;
            }

            // Handle validation feedback
            if (!isValid) {
                oInput.setValueState("Error");
                oInput.setValueStateText("Invalid input");
            } else {
                oInput.setValueState("None");
            }
        }
    });
});
