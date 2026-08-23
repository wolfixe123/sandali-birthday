// ========================================
// FIREBASE INIT
// Connects to Firestore and exposes
// simple helper functions on window so
// script.js (a normal, non-module script)
// can use them.
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAPjnZcEV5Xvtn5Svz9MshAaFP_pUIGtBs",
    authDomain: "sandali-birthday.firebaseapp.com",
    projectId: "sandali-birthday",
    storageBucket: "sandali-birthday.firebasestorage.app",
    messagingSenderId: "181624272555",
    appId: "1:181624272555:web:b90d918dd834a0318f69ee",
    measurementId: "G-1WPNH8NN9F"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Everything for the site lives in one document:
// collection "site", document "content"
const contentRef = doc(db, "site", "content");


// ========================================
// SAVE ONE FIELD
// (merge: true means it only updates this
// field and leaves everything else alone)
// ========================================

window.cloudSave = async function (fieldName, value) {

    try {

        await setDoc(
            contentRef,
            { [fieldName]: value },
            { merge: true }
        );

        return true;

    } catch (error) {

        console.log("Cloud save failed:", error);

        return false;

    }

};


// ========================================
// LOAD EVERYTHING ONCE
// ========================================

window.cloudLoad = async function () {

    try {

        const snap = await getDoc(contentRef);

        if (snap.exists()) {

            return snap.data();

        }

        return {};

    } catch (error) {

        console.log("Cloud load failed:", error);

        return {};

    }

};


// ========================================
// LIVE UPDATES
// Fires the callback immediately with the
// current data, then again every time the
// data changes (even from another device).
// ========================================

window.cloudListen = function (callback) {

    onSnapshot(contentRef, function (snap) {

        if (snap.exists()) {

            callback(snap.data());

        }

    });

};
