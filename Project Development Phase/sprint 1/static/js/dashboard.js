const linkColor = document.querySelectorAll(".nav_link");

const app = Vue.createApp({
  data() {
    return {
      dashboard: undefined,
      product: true,
      purchase: undefined,
      sales: undefined,
      transactions: undefined,
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
  },

  mounted() {
    this.showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  },
  delimiters: ["${", "}$"],
});

app.mount("#app");
