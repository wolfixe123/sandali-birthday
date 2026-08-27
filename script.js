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

    const musicControls =
        document.getElementById("musicControls");


    // Allow letter editing
    letter.contentEditable = "true";


    // Show editing controls
    editControls.classList.remove("hidden");

    musicControls.classList.remove("hidden");


    // Turn on the global "edit anywhere" system
    setEditableElementsState(true);

}


// ========================================
// VIEWER MODE
// ========================================

function disableEditMode() {

    const letter =
        document.getElementById("letterText");

    const editControls =
        document.getElementById("editControls");

    const musicControls =
        document.getElementById("musicControls");


    // Disable letter editing
    letter.contentEditable = "false";


    // Hide editor controls
    editControls.classList.add("hidden");


    // Music control can remain visible
    musicControls.classList.remove("hidden");


    // Turn off the global "edit anywhere" system
    setEditableElementsState(false);

}


// ========================================
// SCENE SYSTEM
// ========================================

function showScene(id) {

    scenes.forEach(function (scene) {

        scene.classList.remove("active");

    });


    const target =
        document.getElementById(id);


    if (!target) {
        return;
    }


    target.classList.add("active");


    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // Small heart effect on page change
    setTimeout(function () {

        heartBurst(8);

    }, 350);

}


// ========================================
// INTRO
// ========================================

document
    .getElementById("startButton")
    .addEventListener("click", function () {

        showScene("birthday");

        heartBurst(30);

    });


// ========================================
// BIRTHDAY
// ========================================

document
    .getElementById("memoriesButton")
    .addEventListener("click", function () {

        showScene("memories");

    });


// ========================================
// MEMORIES → LETTER
// ========================================

document
    .getElementById("letterButton")
    .addEventListener("click", function () {

        showScene("letter");

    });


// ========================================
// LETTER → SECRET
// ========================================

document
    .getElementById("secretButton")
    .addEventListener("click", function () {

        showScene("secret");

    });


// ========================================
// FINAL MESSAGE
// ========================================

document
    .getElementById("revealButton")
    .addEventListener("click", function () {

        const finalMessage =
            document.getElementById("finalMessage");


        finalMessage.classList.add("show");


        heartBurst(45);

    });


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
    .addEventListener("click", async function () {

        if (!editMode) {
            return;
        }


        const button = this;

        const originalText =
            button.innerText;


        button.innerText =
            "Saving...";


        const success =
            await window.cloudSave(
                "letter",
                letterEl.innerHTML
            );


        button.innerText =
            success ?
                "✓ Saved ❤️" :
                "⚠ Failed, try again";


        setTimeout(function () {

            button.innerText =
                originalText;

        }, 2000);

    });


// ---- APPLY DATA COMING FROM THE CLOUD ----

function applyCloudData(data) {

    if (!data) {
        return;
    }


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
// clicking it saves just that element's text to the cloud.
// ========================================================

const floatingSaveIcon =
    document.getElementById("floatingSaveIcon");

let currentEditingElement = null;


function setEditableElementsState(isEditable) {

    const editableEls =
        document.querySelectorAll(".editable");

    editableEls.forEach(function (el) {

        el.contentEditable =
            isEditable ? "true" : "false";

        if (isEditable) {

            el.classList.add("edit-active");

        } else {

            el.classList.remove("edit-active");

        }

    });


    if (!isEditable) {

        hideFloatingSaveIcon();

    }

}


function setupEditableElements() {

    const editableEls =
        document.querySelectorAll(".editable");


    editableEls.forEach(function (el) {

        el.addEventListener("focus", function () {

            if (!editMode) {
                return;
            }

            currentEditingElement = el;

            positionFloatingSaveIcon(el);

        });


        el.addEventListener("input", function () {

            if (!editMode) {
                return;
            }

            currentEditingElement = el;

            positionFloatingSaveIcon(el);

        });


        el.addEventListener("blur", function () {

            setTimeout(function () {

                hideFloatingSaveIcon();

            }, 150);

        });

    });

}


function positionFloatingSaveIcon(el) {

    const rect =
        el.getBoundingClientRect();


    floatingSaveIcon.style.top =
        (window.scrollY + rect.top - 14) + "px";

    floatingSaveIcon.style.left =
        (window.scrollX + rect.right + 10) + "px";


    floatingSaveIcon.classList.remove("hidden");

}


function hideFloatingSaveIcon() {

    floatingSaveIcon.classList.add("hidden");

    currentEditingElement = null;

}


floatingSaveIcon.addEventListener(
    "mousedown",
    function (event) {

        event.preventDefault();

    }
);


floatingSaveIcon.addEventListener(
    "click",
    async function () {

        if (!currentEditingElement) {
            return;
        }


        const key =
            currentEditingElement.getAttribute(
                "data-edit-key"
            );


        if (!key) {
            return;
        }


        const success =
            await window.cloudSave(
                key,
                currentEditingElement.innerHTML
            );


        floatingSaveIcon.innerText =
            success ? "✅" : "⚠️";

        setTimeout(function () {

            floatingSaveIcon.innerText = "💾";

        }, 1200);

    }
);


// ========================================
// FLOATING HEARTS
// ========================================

function createHeart() {

    const heart =
        document.createElement("div");


    heart.className = "heart";


    const symbols = [
        "❤️",
        "💗",
        "💖",
        "💕",
        "💓",
        "✨"
    ];


    heart.innerText =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    heart.style.left =
        Math.random() * 100 + "%";


    heart.style.fontSize =
        (
            12 +
            Math.random() * 22
        ) + "px";


    heart.style.animationDuration =
        (
            5 +
            Math.random() * 6
        ) + "s";


    hearts.appendChild(heart);


    setTimeout(function () {

        heart.remove();

    }, 12000);

}


setInterval(
    createHeart,
    700
);


// ========================================
// HEART BURST
// ========================================

function heartBurst(amount = 25) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement("div");


        heart.className = "heart";

        heart.innerText = "❤️";


        heart.style.left =
            (
                45 +
                Math.random() * 10
            ) + "%";


        heart.style.bottom =
            "40%";


        heart.style.fontSize =
            (
                15 +
                Math.random() * 25
            ) + "px";


        heart.style.animationDuration =
            (
                2 +
                Math.random() * 3
            ) + "s";


        hearts.appendChild(heart);


        setTimeout(function () {

            heart.remove();

        }, 6000);

    }

}


// ========================================
// MUSIC
// ========================================

const music =
    document.getElementById("music");

const musicButton =
    document.getElementById("musicButton");

let musicStarted = false;


// ========================================
// START MUSIC
// ========================================

function startMusic() {

    if (musicStarted) {
        return;
    }

    music.volume = 0.7;

    music.loop = true;

    music.play()
        .then(function () {

            musicStarted = true;

            if (musicButton) {
                musicButton.innerText = "🔊 Playing";
            }

        })
        .catch(function (error) {

            console.log("Autoplay blocked:", error);

        });
}


// ========================================
// ENTER BUTTON
// (single listener - calls login then
// immediately tries to start music,
// synchronously, inside the click handler,
// so the browser treats it as a valid
// user gesture for autoplay)
// ========================================

loginButton.addEventListener("click", function () {

    login();

    startMusic();

});


// ========================================
// MUSIC BUTTON
// ========================================

musicButton.addEventListener(
    "click",
    function () {

        if (music.paused) {

            music.play();

            musicStarted = true;

            musicButton.innerText =
                "🔊 Playing";

        } else {

            music.pause();

            musicButton.innerText =
                "🔇 Muted";

        }

    }
);


// ========================================
// KEYBOARD SHORTCUT
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        // Space = music pause/play
        if (
            event.code === "Space" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.contentEditable !== "true"
        ) {

            event.preventDefault();

            if (music.paused) {

                music.play();

                musicStarted = true;

                musicButton.innerText =
                    "🔊 Playing";

            }

            else {

                music.pause();

                musicButton.innerText =
                    "🔇 Paused";

            }

        }

    }
);


// ========================================
// INITIAL LOAD
// ========================================

setupEditableElements();


// Start background hearts after page loads
setTimeout(function () {

    createHeart();

}, 500);
