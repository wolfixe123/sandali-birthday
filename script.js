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

loginButton.addEventListener("click", login);

usernameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        login();
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

    // Start gentle music attempt after user interaction
    tryStartMusic();

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

}


// ========================================
// VIEWER MODE
// ========================================

function disableEditMode() {

    const letter =
        document.getElementById("letterText");

    const editControls =
        document.getElementById("editControls");

    const photoUploadBox =
        document.getElementById("photoUploadBox");

    const musicControls =
        document.getElementById("musicControls");


    // Disable letter editing
    letter.contentEditable = "false";


    // Hide editor controls
    editControls.classList.add("hidden");

    photoUploadBox.classList.add("hidden");


    // Music control can remain visible
    musicControls.classList.remove("hidden");


    // Load saved letter
    loadSavedLetter();

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

        startMusicIfAvailable();

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


// ========================================
// PHOTO UPLOAD
// ========================================

const photoInput =
    document.getElementById("photoInput");

const gallery =
    document.getElementById("gallery");


photoInput.addEventListener(
    "change",
    function (event) {

        // Only Wolfixe can upload
        if (!editMode) {

            photoInput.value = "";

            return;

        }


        const files =
            Array.from(event.target.files);


        files.forEach(function (file) {

            if (!file.type.startsWith("image/")) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (e) {

                    createPhoto(
                        e.target.result
                    );

                };


            reader.readAsDataURL(file);

        });


        // Allow selecting the same file again
        photoInput.value = "";

    }
);


// ========================================
// CREATE PHOTO
// ========================================

function createPhoto(imageURL) {

    const card =
        document.createElement("div");


    card.className = "photo-card";


    const image =
        document.createElement("img");


    image.src = imageURL;

    image.alt = "Sandali memory";


    card.appendChild(image);

    gallery.appendChild(card);


    // Open full screen viewer
    card.addEventListener(
        "click",
        function () {

            openPhoto(imageURL);

        }
    );


    // Small reveal animation
    card.style.opacity = "0";

    card.style.transform =
        "translateY(20px) scale(.95)";


    requestAnimationFrame(function () {

        card.style.transition =
            "opacity .6s ease, transform .6s ease";

        card.style.opacity = "1";

        card.style.transform =
            "translateY(0) scale(1)";

    });

}


// ========================================
// PHOTO VIEWER
// ========================================

const viewer =
    document.getElementById("photoViewer");

const viewerImage =
    document.getElementById("viewerImage");


function openPhoto(imageURL) {

    viewerImage.src = imageURL;

    viewer.classList.add("show");

}


document
    .getElementById("closeViewer")
    .addEventListener("click", closePhotoViewer);


function closePhotoViewer() {

    viewer.classList.remove("show");

    viewerImage.src = "";

}


viewer.addEventListener(
    "click",
    function (event) {

        if (event.target === viewer) {

            closePhotoViewer();

        }

    }
);


// ESC closes photo viewer
document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            viewer.classList.contains("show")
        ) {

            closePhotoViewer();

        }

    }
);


// ========================================
// SAVE LETTER
// ========================================

document
    .getElementById("saveLetterButton")
    .addEventListener("click", function () {

        if (!editMode) {

            return;

        }


        const letter =
            document.getElementById("letterText");


        localStorage.setItem(
            "sandaliBirthdayLetter",
            letter.innerHTML
        );


        // Visual feedback
        const button = this;

        const originalText =
            button.innerText;


        button.innerText =
            "✓ Saved ❤️";


        setTimeout(function () {

            button.innerText =
                originalText;

        }, 2000);

    });


// ========================================
// LOAD SAVED LETTER
// ========================================

function loadSavedLetter() {

    const savedLetter =
        localStorage.getItem(
            "sandaliBirthdayLetter"
        );


    if (!savedLetter) {
        return;
    }


    document
        .getElementById("letterText")
        .innerHTML =
        savedLetter;

}


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
// ========================================

document
    .getElementById("loginButton")
    .addEventListener("click", function () {

        login();

        // User clicked the button,
        // so browser allows audio playback.
        setTimeout(function () {

            startMusic();

        }, 300);

    });


// ========================================
// MUSIC BUTTON
// ========================================

musicButton.addEventListener(
    "click",
    function () {

        if (music.paused) {

            music.play();

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

        // ESC = close photo
        if (event.key === "Escape") {

            closePhotoViewer();

        }


        // Space = music pause/play
        if (
            event.code === "Space" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.contentEditable !== "true"
        ) {

            event.preventDefault();

            if (musicLoaded) {

                if (music.paused) {

                    music.play();

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

    }
);


// ========================================
// INITIAL LOAD
// ========================================

loadSavedLetter();


// Start background hearts after page loads
setTimeout(function () {

    createHeart();

}, 500);
