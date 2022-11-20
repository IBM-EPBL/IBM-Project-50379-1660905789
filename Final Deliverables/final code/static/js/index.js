const app = Vue.createApp({
  data() {
    return {
      showSignup: undefined,
      showSignin: true,
      showsuccess: undefined,
      showdanger: undefined,
    };
  },
  methods: {
    showSignUp() {
      this.showsuccess = undefined;
      this.showdanger = undefined;
      this.showSignup = true;
      this.showSignin = undefined;
    },
    showSignIn() {
      this.showsuccess = undefined;
      this.showdanger = undefined;
      this.showSignup = undefined;
      this.showSignin = true;
    },
    validateEmail(email) {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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
    clearMsg() {
      this.showdanger = undefined;
      this.showsuccess = undefined;
    },
    async login() {
      this.clearMsg();
      const signInEmail = document
        .getElementById("signInEmail")
        .value.toLowerCase();
      const signInPassword = document
        .getElementById("signInPassword")
        .value.trim();
      if (signInEmail == "" || signInPassword == "") {
        this.sendMsg("danger", "Provide a Valid Email and Password");
        return;
      }
      if (!this.validateEmail(signInEmail)) {
        this.sendMsg("danger", "Provide a Valid Email Address");
        return;
      }
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });
      const result = await response.json();
      if (result == false)
        this.sendMsg("danger", "Username or Password is wrong");
      else window.location.href = "http://localhost:5000/dashboard";
    },
    async signUp() {
      this.clearMsg();
      const signUpEmail = document
        .getElementById("signUpEmail")
        .value.toLowerCase();
      const signUpName = document.getElementById("signUpName").value.trim();
      let sendMail = document.getElementById("sendMail").checked;
      const signUpPassword = document
        .getElementById("signUpPassword")
        .value.trim();
      if (signUpEmail == "" || signUpPassword == "" || signUpName == "") {
        this.sendMsg("danger", "Provide a Valid Credentials");
        this.showdanger = true;
        return;
      }
      if (!this.validateEmail(signUpEmail)) {
        this.sendMsg("danger", "Provide a Valid Email Address");
        return;
      }
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
          username: signUpName,
          sendReport: sendMail,
        }),
      });
      const result = await response.json();
      if (result == false) this.sendMsg("danger", "Email already exists");
      else window.location.href = "http://localhost:5000/dashboard";
    },
  },
  mounted: () => {},
  delimiters: ["${", "}$"],
});

app.mount("#app");
