const app = Vue.createApp({
  data() {
    return {
      showSignup: undefined,
      showSignin: true,
      showsuccess:undefined,
      showdanger:undefined
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
    validateEmail(email){
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    },
    async login(){
      
      const signInEmail = document.getElementById("signInEmail").value.toLowerCase();
      const signInPassword = document.getElementById("signInPassword").value.trim();
      if(signInEmail == "" || signInPassword == ""){
         this.showdanger = true ;
         Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Provide a Valid Email and Password");
         return
      }
      if(!this.validateEmail(signInEmail)){
        this.showdanger = true ;
         Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Provide a Valid Email Address");
         return
      }
      window.location.href = "http://localhost:5000/dashboard";
      const response = await fetch('/login', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},
                                body: JSON.stringify({email:signInEmail , password: signInPassword})
                              })
    },
    async signUp(){
      const signUpEmail = document.getElementById("signUpEmail").value.toLowerCase();
      const signUpName = document.getElementById("signUpName").value.trim();
      const signUpPassword = document.getElementById("signUpPassword").value.trim();
      if(signUpEmail == "" || signUpPassword == "" || signUpName == ""){
         this.showdanger = true ;
         Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Provide a Valid Credentials");
         return
      }
      if(!this.validateEmail(signUpEmail)){
        this.showdanger = true ;
         Vue.nextTick(() =>document.getElementById("danger-msg").innerHTML = "Provide a Valid Email Address");
         return
      }
      console.log("hello")
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},
        body: JSON.stringify({email:signUpEmail , password: signUpPassword,username:signUpName,sendReport:false})
      })
      console.log("respon",response)
    }
  },
  mounted: () => {},
  delimiters: ["${", "}$"],
});

app.mount("#app");
