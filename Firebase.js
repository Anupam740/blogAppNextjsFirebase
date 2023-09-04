import firebase from 'firebase/compat/app'


import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'




var firebaseConfig = {
    apiKey: "AIzaSyAp6WUTZHknNecgT4shcWuzHPu7O51jE2M",
    authDomain: "nextjsblog-7d412.firebaseapp.com",
    projectId: "nextjsblog-7d412",
    storageBucket: "nextjsblog-7d412.appspot.com",
    messagingSenderId: "51262755163",
    appId: "1:51262755163:web:0c9b0435b77d95239e0a7e"
  };

  if(!firebase.apps.length) firebase.initializeApp(firebaseConfig)


  const auth  = firebase.auth()
  const db = firebase.firestore()
  const storage = firebase.storage()
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
  
  export {auth,db,storage,serverTimestamp}