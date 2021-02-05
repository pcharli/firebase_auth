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

  

  firebase.auth().signInAnonymously()
  .then(() => {
    let user = firebase.auth().currentUser
  //console.log(user)
    //getProduits()
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
  });
 

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      //console.log(user)
      user.updateProfile({
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  
/* tests avec produits 

  // Add a new document in collection "produits"
db.collection("produits").doc().set({
    label: "poires",
    prix: 1.5
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
  
 // Update a document in collection "produits"
 db.collection("produits").doc('Bm4ZbCItwTpLgH0e41U0').set({
    label: "poires",
    prix: 0.5
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});


//delete a document in a collection
db.collection("produits").doc().delete()
.then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});



function getProduits() {
  db.collection("produits").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        let produit = doc.data()
        console.log(produit.prix)
        document.querySelector('.produits').innerHTML = produit.prix
    });
});
}

 // end test produits
 */


//test cities
var citiesRef = db.collection("cities");

citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
citiesRef.doc("LA").set({
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
citiesRef.doc("DC").set({
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
citiesRef.doc("TOK").set({
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
citiesRef.doc("BJ").set({
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });

    // lire une city
var docRef = db.collection("cities").doc("SF");
docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

//lister les villes
db.collection("cities").orderBy("name","desc").limit(2)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
        console.log("end liste")
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


// faire une recherche
db.collection("cities").where("capital", "==", true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });



    // mise à jour auto d'une entrée
    db.collection("cities").doc("SF")
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
    });

     // mise à jour auto d'une liste
     db.collection("cities").where("state", "==", "CA")
    .onSnapshot((querySnapshot) => {
        var cities = [];
        querySnapshot.forEach((doc) => {
            cities.push(doc.data().name);
        });
        console.log("Current cities in CA: ", cities.join(", "));
    });

    // idem avec type d'action
    let unsubscribe = db.collection("cities").where("state", "==", "CA")
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    }, (error) => {
        console.error(error)
    });

    //stopper le snapchot
    unsubscribe()
