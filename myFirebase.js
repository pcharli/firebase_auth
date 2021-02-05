 //https://firebase.google.com/docs/auth/web/manage-users?hl=fr

 //https://firebase.google.com/docs/firestore/security/rules-structure?hl=fr

 // API : 
       // https://firebase.google.com/docs/firestore/use-rest-api 
       // https://firestore.googleapis.com/v1/projects/cepegra-107e1/databases/(default)/documents/produits/
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyB8OohD-60KDyDRsy8hBVW4527X_JCpY_8",
  authDomain: "cepegra-4fb67.firebaseapp.com",
  projectId: "cepegra-4fb67",
  storageBucket: "cepegra-4fb67.appspot.com",
  messagingSenderId: "224873497489",
  appId: "1:224873497489:web:c96d31e7f8a2f0fbf51030"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  let db = firebase.firestore();
  let auth = firebase.auth()

  if (firebase.auth().currentUser != null) {
    document.querySelector(".updateArea").style.display = 'block'
    console.log(firebase.auth().currentUser)
  }


  //création d'un user

  function registerPasswordUser(email,displayName,password){
    var user = null;
    //NULLIFY EMPTY ARGUMENTS
    for (var i = 0; i < arguments.length; i++) {
      arguments[i] = arguments[i] ? arguments[i] : null;
    }
    auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      user = auth.currentUser;
      user.sendEmailVerification();
    })
    .then(function () {
      user.updateProfile({
        displayName: displayName,
        //photoURL: photoURL,
      });
    })
    .catch(function(error) {
      console.log(error.message,7000);
    });
    console.log('Validation link was sent to ' + email + '.');
  }

  document.querySelector("form.inscription").addEventListener("submit", function(e) {
        e.preventDefault()
        let email = document.querySelector("[name='email']").value
        let nom = document.querySelector("[name='nom']").value
        let password = document.querySelector("[name='password']").value
        registerPasswordUser(email, nom, password)
    })



//login/delog

function toggleSignIn(email, password) {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      document.querySelector('.updateArea').style.display = 'none'
      console.log('logout')
      // [END signout]
    } else {
    document.querySelector('.updateArea').style.display = 'block'
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) //SESSION, LOCAL, NONE
      .then(function() {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function() {
          //console.log(result)
          document.querySelector('.updateArea').style.display = 'block'
          getProduits()
        
          
          let user = auth.currentUser
          console.log(user)
          document.querySelector("[name='update_nom']").value = user.displayName
          document.querySelector("[name='update_email']").value = user.email
          if (!user.emailVerified) {
            document.querySelector('.updateArea').classList.add("notverified")
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
        
        //document.getElementById('quickstart-sign-in').disabled = false;
       
        // [END_EXCLUDE]
      });
    })
      // [END authwithemail]
    }
    //document.getElementById('quickstart-sign-in').disabled = true;
  
  }


document.querySelector("form.connexion").addEventListener("submit", function(e) {
    e.preventDefault()
    let email = document.querySelector("[name='login_email']").value
    let password = document.querySelector("[name='login_password']").value
    toggleSignIn(email, password)
})

//update
function updateUser(email, password, nom) {
  let user = firebase.auth().currentUser
  user.updateProfile( {
    displayName: nom,
    "email": email
  })
  .then(function() {
    //change password
    user.updatePassword(password)
    .then(function() {
      alert('updated')
    })
    .catch(function(error) {
      console.log(error)
    })
    //end change password
  })
  .catch( function (error) {
    console.log(error)
  })
}

document.querySelector("form.update").addEventListener("submit", function(e) {
  e.preventDefault()
  let email = document.querySelector("[name='update_email']").value
  let password = document.querySelector("[name='update_password']").value
  let nom = document.querySelector("[name='update_nom']").value
  updateUser(email, password, nom)
})

//delete user
document.querySelector(".delete").addEventListener("click", function(e) {
  e.preventDefault()
  if (confirm('Sûr ?')) {
    let user = firebase.auth().currentUser;
    user.delete().then(function() {
      alert("Deleted")
    }).catch(function(error) {
      console.log(error)
    });
  }
})

//deconnexion user
document.querySelector(".deconnexion").addEventListener("click", function(e) {
  e.preventDefault()
  if (confirm('Sûr ?')) {
    firebase.auth().signOut();
      document.querySelector('.updateArea').style.display = 'none'
  }
})

function getProduits() {
  db.collection("produits").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        let produit = doc.data()
        console.log(produit.prix)
        document.querySelector('.prix').innerHTML = produit.prix
    });
});
}
getProduits()