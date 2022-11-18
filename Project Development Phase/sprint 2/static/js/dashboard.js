const linkColor = document.querySelectorAll(".nav_link");

const app = Vue.createApp({
  data() {
    return {
      dashboard: true,
      product: undefined,
      purchase: undefined,
      sales: undefined,
      transactions: undefined,
      showdanger:undefined,
      showsuccess:undefined,
    };
  },
  methods: {
    showNavbar: (toggleId, navId, bodyId, headerId) => {
      const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId);

      nav.classList.toggle("show");
      // change icon
      toggle.classList.toggle("bx-x");
      // add padding to body
      bodypd.classList.toggle("body-pd");
      // add padding to header
      headerpd.classList.toggle("body-pd");

      // Validate that all variables exist
      if (toggle && nav && bodypd && headerpd) {
        toggle.addEventListener("click", () => {
          // show navbar
          nav.classList.toggle("show");
          // change icon
          toggle.classList.toggle("bx-x");
          // add padding to body
          bodypd.classList.toggle("body-pd");
          // add padding to header
          headerpd.classList.toggle("body-pd");
        });
      }
    },
    colorLink(e) {
      this.makeUndefined();
      this[e.currentTarget.id] = true;
    },
    makeUndefined() {
      this.dashboard = undefined;
      this.product = undefined;
      this.purchase = undefined;
      this.sales = undefined;
      this.transactions = undefined;
    },
    clearMsg(){
      this.showdanger = undefined ;
      this.showsuccess = undefined;
    },
    async getTransactions(){
      this.clearMsg();
      const response = await fetch('/transactions');
    },
    async getProductsReport(){
      this.clearMsg();
      const response = await fetch('/products');
    },
    async addNewProduct(){
      this.clearMsg();
      const addProductCode = document.getElementById("addProductCode").value;
      const addProductName = document.getElementById("addProductName").value.trim();
      const addProductSalePrice = document.getElementById("addProductSalePrice").value;
      const addProductPurchasePrice = document.getElementById("addProductPurchasePrice").value;
      if (addProductCode == "" || addProductName == "" || addProductSalePrice == "" || addProductPurchasePrice == ""){
         this.showdanger = true ;
         Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Please Fill up all the fields!");
         return
      }
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},
        body: JSON.stringify({name:addProductName , code: addProductCode,salePrice:addProductSalePrice,purchasePrice:addProductPurchasePrice})
      })
    },
    async purchaseEntry(){
      this.clearMsg();
        const purchaseProductCode = document.getElementById("purchaseProductCode").value;
        const purchaseProductName = document.getElementById("purchaseProductName").value.trim();
        const purchasePrice = document.getElementById("purchasePrice").value;
        const purchaseQuantity = document.getElementById("purchaseQuantity").value;
        if (purchaseProductCode == "" || purchaseProductName == "" || purchasePrice == "" || purchaseQuantity == ""){
          this.showdanger = true ;
          Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Please Fill up all the fields!");
          return
       }
       const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},
        body: JSON.stringify({name:purchaseProductName , code: purchaseProductCode,purchaseQuantity,purchasePrice})
      })
    },
    async saleEntry(){
      this.clearMsg();
        const salesProductCode = document.getElementById("salesProductCode").value;
        const salesProductName = document.getElementById("salesProductName").value.trim();
        const salesPrice = document.getElementById("salesPrice").value;
        const salesQuantity = document.getElementById("salesQuantity").value;
        if (salesProductCode == "" || salesProductName == "" || salesPrice == "" || salesQuantity == ""){
          this.showdanger = true ;
          Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Please Fill up all the fields!");
          return
       }
       const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},
        body: JSON.stringify({name:salesProductName , code: salesProductCode,salesPrice,salesQuantity})
      })
    }
  },

  mounted() {
    this.showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  },
  delimiters: ["${", "}$"],
});

app.mount("#app");
