const LinkAffIdent = document.querySelector(".affLinkConnexion")
const identification = document.querySelector(".identification")
const identificationTitle = document.querySelector(".identification-title")
const identification_close = document.querySelector(".identification-close")
const newAccountLink = document.querySelector(".newAccountLink")
const isAccountLink = document.querySelector(".isAccountLink")
const formLogon = document.querySelector(".form-logon")
const formLogin = document.querySelector(".form-login")
const linkDeconnexion = document.querySelector(".linkDeconnexion")
const notVerified = document.querySelector('.not-verified')


//config Firebase
var firebaseConfig = {
    apiKey: "AIzaSyB8OohD-60KDyDRsy8hBVW4527X_JCpY_8",
    authDomain: "cepegra-4fb67.firebaseapp.com",
    projectId: "cepegra-4fb67",
    storageBucket: "cepegra-4fb67.appspot.com",
    messagingSenderId: "224873497489",
    appId: "1:224873497489:web:c96d31e7f8a2f0fbf51030"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)

  //raccourcis
    const db = firebase.firestore()
    const auth = firebase.auth()
//end config Firebase   



//test session opened ?
auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('user is logged: '+user.uid);
      console.log(user)
      identification.classList.add("hidded")
      LinkAffIdent.classList.add('hidded')
      linkDeconnexion.querySelector('.user').innerHTML = user.displayName
      linkDeconnexion.classList.remove('hidded')
    }
});
//end test


// events ui

LinkAffIdent.addEventListener("click", (e) => {
    e.preventDefault()
    identification.classList.toggle('hidded')
    LinkAffIdent.classList.toggle('hidded')
})

identification_close.addEventListener("click", (e) => {
    e.preventDefault()
    identification.classList.toggle('hidded')
    LinkAffIdent.classList.toggle('hidded')
})

newAccountLink.addEventListener("click", (e) => {
    e.preventDefault()
    identificationTitle.innerHTML = "Créer un compte"
    formLogin.classList.toggle('hidded')
    formLogon.classList.toggle('hidded')
})

isAccountLink.addEventListener("click", (e) => {
    e.preventDefault()
    identificationTitle.innerHTML = "Se connecter"
    formLogin.classList.toggle('hidded')
    formLogon.classList.toggle('hidded')
})

//end events ui

//mettre déconnecter si connecté
if (firebase.auth().currentUser != null) {
    linkDeconnexion.classList.remove("hidded")
    LinkAffIdent.classList.add("hidded")
    console.log(firebase.auth().currentUser)
  }



//New User
formLogon.addEventListener("submit", (e) => {
    e.preventDefault()
    alert("new")
})

// connect user
formLogin.addEventListener("submit", (e) => {
    e.preventDefault()
    alert("connect")
    let email = formLogin.querySelector(".login-input-login").value
    let password = formLogin.querySelector(".login-input-password").value
    // [START authwithemail]
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) //SESSION, LOCAL (défaut), NONE
    .then(function() {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        //console.log(result)   
        
        let user = auth.currentUser
        console.log(user)
        let userName = user.displayName
        let userEmail = user.email
        let userId = user.userId

        //user non confirmé ?
        if (!user.emailVerified) {
          //alert('not verified')
          notVerified.classList.remove("hidded")
          identification.classList.remove('hidded')
          formLogin.classList.add('hidded')
          notVerified.querySelector('.not-verified-btn').addEventListener("click",(e) => {
              e.preventDefault()
              user.sendEmailVerification().then(function() {
                // Email sent.
                alert("email sent")
              }).catch(function(error) {
                // An error happened.
                console.log(error)
              });
          })
        }
        else {
            //compte vérifié, on peut afficher
            //alert('verified')
            identification.classList.add("hidded")
            linkDeconnexion.querySelector('.user').innerHTML = userName
            linkDeconnexion.classList.remove('hidded')
          }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);     
      // [END_EXCLUDE]
    });
  })
})

linkDeconnexion.addEventListener("click", (e) => {
    e.preventDefault()
    firebase.auth().signOut().then(() => {
        alert('deconnect')
        document.location.reload()
      }).catch((error) => {
        console.log(error)
      });
})