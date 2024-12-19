sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
function (Controller,JSONModel,MessageToast, Filter, FilterOperator,Sorter) {
    "use strict";

    return Controller.extend("assignment1.controller.View1", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();

            var tabModel = this.getOwnerComponent().getModel("productModelData");
            this.getView().setModel(tabModel,"productData");
        },
        onPress: function (oEvent){
            // console.log(e);
            // let productInfo = e.getSource().getCells();
            // this.oRouter.navTo("Pdetails");
            // console.log(productInfo);

            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext("productData");//VVIMP HE KARYCHAY
            var sProductId = oContext.getProperty("product_id");
            console.log(sProductId);
            this.oRouter.navTo("Pdetails", {
                productId: sProductId
            });
        },
        onAddProduct: function (event){
            console.log(event);
            this.oRouter.navTo("AddProduct");
        },
        

            onDeleteProduct: function () {
                console.log("hio");
                const oTable = this.byId("idProductsTable");
                const aSelectedItems = oTable.getSelectedItems();
                console.log(aSelectedItems);
                if (aSelectedItems.length > 0) {
                    const oModel = this.getView().getModel("productData");
                    const aProducts = oModel.getProperty("/products");
            
                    // Iterate over selected items and remove them from the array
                    for (let i = aSelectedItems.length - 1; i >= 0; i--) {
                        const selectedItem = aSelectedItems[i];
                        const selectedIndex = oTable.indexOfItem(selectedItem);
            
                        // Remove the selected product from the array
                        aProducts.splice(selectedIndex, 1);
                    }
            
                    // Update the model
                    oModel.setProperty("/products", aProducts);
                    oTable.removeSelections(); // Clear selection
                    sap.m.MessageToast.show("Selected products deleted successfully!");
                } else {
                    sap.m.MessageToast.show("Please select at least one product to delete.");
                }
            },
            odataNav: function(){
                this.oRouter.navTo("odataDemo");
                console.log("hii");
            },
            onSearch: function (event) {
                var Query = event.getParameter("query");
                console.log(event);
                var aFilters =[];

                if( Query && Query.length){
                    aFilters.push(new Filter("product_name", FilterOperator.Contains, Query));
                   
                    
                }

                var oList = this.getView().byId("idProductsTable");
                var binding = oList.getBinding("items");
                binding.filter(aFilters);
                if (event.getParameter("searchButtonPressed")) {
                    MessageToast.show("'search' event fired with 'searchButtonPressed' parameter");
                }
            },
            onSelectionChange: function(oEvent){
                var skey = oEvent.mParameters.item.mProperties.key;
                console.log(skey);
                var oSorter;

                if(skey==="artist_name"){
                    oSorter= new Sorter("artist_name", false, true);
                }
                else if(skey==="price"){
                    oSorter=new Sorter("price", false, true);
                }

                var oList = this.getView().byId("idProductsTable");
                var binding = oList.getBinding("items");
                binding.sort(oSorter);
            },
            onCategoryChanged: function(){
                var oComboBox = this.byId("idArtCategory");
                var sPopinLayout = oComboBox.getSelectedKey();
                var oSorter;
                switch (sPopinLayout) {
                    case "artist_name":
                        oSorter= new Sorter("artist_name", false, true);

                        break;
                    case "price":
                        oSorter=new Sorter("price", false, true);

                        
                        break;
                    default:
                        console.log("default");

                        break;
                }
                var oList = this.getView().byId("idProductsTable");
                var binding = oList.getBinding("items");
                binding.sort(oSorter);
            }

    });
});
