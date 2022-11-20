const linkColor = document.querySelectorAll(".nav_link");
var modal = document.getElementById("myModal");

const app = Vue.createApp({
  data() {
    return {
      dashboard: true,
      product: undefined,
      purchase: undefined,
      sales: undefined,
      transactions: undefined,
      showdanger: undefined,
      showsuccess: undefined,
      products: undefined,
      historys: undefined,
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
      this.clearMsg();
      this[e.currentTarget.id] = true;
    },
    callPurchase() {
      document.getElementById("purchase").click();
    },
    callSale() {
      document.getElementById("sales").click();
    },
    makeUndefined() {
      this.dashboard = undefined;
      this.product = undefined;
      this.purchase = undefined;
      this.sales = undefined;
      this.transactions = undefined;
    },
    clearMsg() {
      this.showdanger = undefined;
      this.showsuccess = undefined;
    },
    async getTransactions() {
      this.clearMsg();
      const response = await fetch("/transactions");
      const result = await response.json();
      this.historys = result;
    },
    signout() {
      window.location.href = "http://localhost:5000";
    },
    sendMsg(particular, value) {
      if (particular == "danger") {
        this.showdanger = true;
        Vue.nextTick(
          () => (document.getElementById("danger-msg").innerHTML = value)
        );
      } else {
        this.showsuccess = true;
        Vue.nextTick(
          () => (document.getElementById("success-msg").innerHTML = value)
        );
      }
    },
    async getProducts() {
      this.clearMsg();
      const response = await fetch("/products");
      const result = await response.json();
      this.products = result;
    },
    updateQuantity(id, type, value) {
      this.products.forEach((el) => {
        if (el.CODE == id)
          type == "sold"
            ? (el.QUANTITY = el.QUANTITY - value)
            : (el.QUANTITY = el.QUANTITY + value);
      });
    },
    async addNewProduct() {
      this.clearMsg();
      const addProductCode = document.getElementById("addProductCode").value;
      const addProductName = document
        .getElementById("addProductName")
        .value.trim();
      const addProductSalePrice = document.getElementById(
        "addProductSalePrice"
      ).value;
      const addProductPurchasePrice = document.getElementById(
        "addProductPurchasePrice"
      ).value;
      if (
        addProductCode == "" ||
        addProductName == "" ||
        addProductSalePrice == "" ||
        addProductPurchasePrice == ""
      ) {
        this.sendMsg("danger", "Please Fill up all the fields!");
        return;
      }
      const aProduct = {
        NAME: addProductName,
        CODE: addProductCode,
        SALEPRICE: addProductSalePrice,
        PURCHASEPRICE: addProductPurchasePrice,
      };
      const response = await fetch("/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aProduct),
      });
      const result = await response.json();
      if (result == false)
        this.sendMsg("danger", "Product is already available");
      else {
        this.sendMsg("success", "New Product has been added");
        aProduct.QUANTITY = 0;
        this.products.push(aProduct);
      }
    },
    async purchaseEntry() {
      this.clearMsg();
      const purchaseProductCode = document.getElementById(
        "purchaseProductCode"
      ).value;
      const purchaseProductName = document
        .getElementById("purchaseProductName")
        .value.trim();
      const purchasedPrice = document.getElementById("purchasePrice").value;
      const purchaseQuantity =
        document.getElementById("purchaseQuantity").value;
      if (
        purchaseProductCode == "" ||
        purchaseProductName == "" ||
        purchasedPrice == "" ||
        purchaseQuantity == ""
      ) {
        this.sendMsg("danger", "Please Fill up all the fields");
        return;
      }
      const aTransact = {
        NAME: purchaseProductName,
        CODE: purchaseProductCode,
        QUANTITY: purchaseQuantity,
        PURCHASEDPRICE: purchasedPrice,
      };
      const response = await fetch("/purchaseentry", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aTransact),
      });
      const result = await response.json();
      if (result == false) this.sendMsg("danger", "Something went wrong!");
      else {
        this.sendMsg("success", "Purchase Entry Added");
        this.updateQuantity(aTransact.CODE, "add", aTransact.QUANTITY);
        aTransact.SOLDPRICE = 0;
        this.historys.push(aTransact);
      }
    },
    async saleEntry() {
      this.clearMsg();
      const salesProductCode =
        document.getElementById("salesProductCode").value;
      const salesProductName = document
        .getElementById("salesProductName")
        .value.trim();
      const salesPrice = document.getElementById("salesPrice").value;
      const salesQuantity = document.getElementById("salesQuantity").value;
      if (
        salesProductCode == "" ||
        salesProductName == "" ||
        salesPrice == "" ||
        salesQuantity == ""
      ) {
        return;
      }
      const aTransact = {
        NAME: salesProductName,
        CODE: salesProductCode,
        SOLDPRICE: salesPrice,
        QUANTITY: salesQuantity,
      };
      const response = await fetch("/salesentry", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aTransact),
      });
      const result = await response.json();
      if (result == false) this.sendMsg("danger", "Something went wrong!");
      else if (result == true) {
        this.sendMsg("success", "Sales Entry Added");
        this.updateQuantity(aTransact.CODE, "sold", aTransact.QUANTITY);
        aTransact.PURCHASEDPRICE = 0;
        this.historys.push(aTransact);
      } else this.sendMsg("danger", result);
    },
  },

  mounted() {
    this.showNavbar("header-toggle", "nav-bar", "body-pd", "header");
    this.getProducts();
    this.getTransactions();
  },
  delimiters: ["${", "}$"],
});

app.mount("#app");
