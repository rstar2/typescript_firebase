import * as firebase from "firebase";
import FirebaseConfig from "./app/firebase.config";

const defaultApp = firebase.initializeApp(FirebaseConfig);

// we can intialize multiple Firebase apps, but the first will be the "default"
// and will be accessible with the shorthand notation
// const secondApp = fb.initializeApp({});


// same as
// const db = defaultApp.database();
const db = firebase.database(); // shorthand notation - accessing
const rootDbRef = db.ref();

// 1. access the whole db  
rootDbRef.on("value",
    snapshot => console.log(snapshot.val()),
    err => console.log(err)
);

// 2. access the a child node - 
rootDbRef.child("listUid").on("value",
    snapshot => console.log("Received the whole courses node", snapshot.val())
);

// 3. Simple OnDisconnect event
const presenceRef = firebase.database().ref("disconnectMessage");
// // Write a string when this client loses connection
presenceRef.onDisconnect().set("I disconnected!");
presenceRef.remove();



// 4. Implement proper presence system

// since I can connect from multiple devices or browser tabs, we store each connection instance separately
// any time that connectionsRef's value is null (i.e. has no children) I am offline
const myConnectionsRef = firebase.database().ref("users/rumen/connections");

// attach a listener so we can know when we are connected/disconnected
const connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", snap => {
    if (snap.val() === true) {
        console.log("connected");

        // We're connected (or reconnected)! Do anything here that should happen
        // only if online (or on reconnect)

        // add this device to my connections list
        // this value could contain info about the device or a timestamp too
        const con = myConnectionsRef.push(true);

        // when I disconnect, remove this device from the my connections  db
        con.onDisconnect().remove();
    } else {
        console.log("not connected");
    }
});
