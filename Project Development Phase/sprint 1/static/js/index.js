const app = Vue.createApp({
  data() {
    return {
      showSignup: undefined,
      showSignin: true,
    };
  },
  methods: {
    showSignUp() {
      this.showSignup = true;
      this.showSignin = undefined;
    },
    showSignIn() {
      this.showSignup = undefined;
      this.showSignin = true;
    },
  },
  mounted: () => {},
  delimiters: ["${", "}$"],
});

app.mount("#app");
