// ========================================
// SANDALI BIRTHDAY WEBSITE
// MAIN JAVASCRIPT
// ========================================


// ========================================
// USER SETTINGS
// ========================================

const EDIT_USERNAME = "Wolfixe";

let currentUser = "";
let editMode = false;


// ========================================
// ELEMENTS
// ========================================

const scenes = document.querySelectorAll(".scene");
const hearts = document.getElementById("hearts");


// ========================================
// LOGIN
// ========================================

const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("usernameInput");
const loginError = document.getElementById("loginError");

usernameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        login();
        startMusic();
    }

});


function login() {

    const username = usernameInput.value.trim();

    if (username === "") {

        loginError.innerText =
            "Username එක දාන්න ❤️";

        return;
    }


    currentUser = username;


    // ========================================
    // WOLFIXE = EDITOR
    // ========================================

    if (
        username.toLowerCase() ===
        EDIT_USERNAME.toLowerCase()
    ) {

        editMode = true;

        enableEditMode();

    }

    // ========================================
    // EVERYONE ELSE = VIEWER
    // ========================================

    else {

        editMode = false;

        disableEditMode();

    }


    loginError.innerText = "";

    showScene("intro");

}


// ========================================
// EDIT MODE
// ========================================

function enableEditMode() {

    const letter =
        document.getElementById("letterText");

    const editControls =
        document.getElementById("editControls");

    const photoUploadBox =
        document.getElementById("photoUploadBox");

    const musicControls =
        document.getElementById("musicControls");


    // Allow letter editing
    letter.contentEditable = "true";


    // Show editing controls
    editControls.classList.remove("hidden");

    photoUploadBox.classList.remove("hidden");

    musicControls.classList.remove("hidden");


    // Load saved letter
    loadSavedLetter();


    // Turn on the global "edit anywhere" system
    setEditableElementsState(true);

@@ -165,10 +161,6 @@
    musicControls.classList.remove("hidden");


    // Load saved letter
    loadSavedLetter();


    // Turn off the global "edit anywhere" system
    setEditableElementsState(false);

@@ -479,40 +471,49 @@
);


// ========================================
// SAVE LETTER (existing dedicated system)
// ========================================
// ========================================================
// CLOUD SYNC (Firestore)
// Letter text + every ".editable" element is saved to,
// and loaded from, an online Firestore database so
// changes show up on every device, not just this browser.
// ========================================================

const letterEl =
    document.getElementById("letterText");


// ---- SAVE LETTER ----

document
    .getElementById("saveLetterButton")
    .addEventListener("click", function () {
    .addEventListener("click", async function () {

        if (!editMode) {

            return;

        }


        const letter =
            document.getElementById("letterText");
        const button = this;

        const originalText =
            button.innerText;

        localStorage.setItem(
            "sandaliBirthdayLetter",
            letter.innerHTML
        );

        button.innerText =
            "Saving...";

        // Visual feedback
        const button = this;

        const originalText =
            button.innerText;
        const success =
            await window.cloudSave(
                "letter",
                letterEl.innerHTML
            );


        button.innerText =
            "✓ Saved ❤️";
            success ?
                "✓ Saved ❤️" :
                "⚠ Failed, try again";


        setTimeout(function () {
@@ -525,37 +526,79 @@
    });


// ========================================
// LOAD SAVED LETTER
// ========================================
// ---- APPLY DATA COMING FROM THE CLOUD ----

function loadSavedLetter() {
function applyCloudData(data) {

    const savedLetter =
        localStorage.getItem(
            "sandaliBirthdayLetter"
        );
    if (!data) {
        return;
    }


    if (!savedLetter) {
        return;
    // Letter (skip while Wolfixe is actively
    // editing it, so we don't overwrite typing)
    if (
        typeof data.letter === "string" &&
        document.activeElement !== letterEl
    ) {

        letterEl.innerHTML = data.letter;

    }


    // Every generic editable element
    document
        .getElementById("letterText")
        .innerHTML =
        savedLetter;
        .querySelectorAll(".editable")
        .forEach(function (el) {

            const key =
                el.getAttribute("data-edit-key");


            if (!key) {
                return;
            }


            if (
                data[key] !== undefined &&
                document.activeElement !== el
            ) {

                el.innerHTML = data[key];

            }

        });

}


// ---- LOAD ONCE + LISTEN FOR LIVE CHANGES ----

(async function initCloudSync() {

    const initialData =
        await window.cloudLoad();

    applyCloudData(initialData);


    // Live updates: if Wolfixe saves something
    // on another device while this page is open,
    // it updates here automatically.
    window.cloudListen(applyCloudData);

})();


// ========================================================
// GLOBAL "EDIT ANYWHERE" SYSTEM
// Any element with class="editable" + data-edit-key="..."
// becomes editable when Wolfixe logs in. A small floating
// 💾 icon appears next to the element being edited, and
// clicking it saves just that element's text.
// clicking it saves just that element's text to the cloud.
// ========================================================

const floatingSaveIcon =
@@ -604,9 +647,6 @@

    editableEls.forEach(function (el) {

        // Show the save icon whenever this element
        // is focused or typed into (only matters
        // while contentEditable is actually "true")
        el.addEventListener("focus", function () {

            if (!editMode) {
@@ -633,9 +673,6 @@
        });


        // Hide the icon when clicking away
        // (small delay so a click on the icon
        // itself still registers first)
        el.addEventListener("blur", function () {

            setTimeout(function () {
@@ -678,8 +715,6 @@
}


// Prevent the icon click from stealing focus
// (which would fire "blur" before "click")
floatingSaveIcon.addEventListener(
    "mousedown",
    function (event) {
@@ -692,77 +727,42 @@

floatingSaveIcon.addEventListener(
    "click",
    function () {
    async function () {

        if (!currentEditingElement) {
            return;
        }


        saveEditableElement(currentEditingElement);


        floatingSaveIcon.innerText = "✅";

        setTimeout(function () {

            floatingSaveIcon.innerText = "💾";

        }, 1200);

    }
);


function saveEditableElement(el) {

    const key =
        el.getAttribute("data-edit-key");


    if (!key) {
        return;
    }


    localStorage.setItem(
        "edit_" + key,
        el.innerHTML
    );

}


function loadEditableContent() {

    const editableEls =
        document.querySelectorAll(".editable");


    editableEls.forEach(function (el) {

        const key =
            el.getAttribute("data-edit-key");
            currentEditingElement.getAttribute(
                "data-edit-key"
            );


        if (!key) {
            return;
        }


        const saved =
            localStorage.getItem("edit_" + key);
        const success =
            await window.cloudSave(
                key,
                currentEditingElement.innerHTML
            );


        if (saved !== null) {
        floatingSaveIcon.innerText =
            success ? "✅" : "⚠️";

            el.innerHTML = saved;
        setTimeout(function () {

        }
            floatingSaveIcon.innerText = "💾";

    });
        }, 1200);

}
    }
);


// ========================================
@@ -1042,16 +1042,12 @@
// INITIAL LOAD
// ========================================

loadSavedLetter();

setupEditableElements();

loadEditableContent();


// Start background hearts after page loads
setTimeout(function () {

    createHeart();

}, 500);
