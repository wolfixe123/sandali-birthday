// ========================================
// BIRTHDAY WEBSITE
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

const scenes =
    document.querySelectorAll(".scene");

const hearts =
    document.getElementById("hearts");


// ========================================
// LOGIN
// ========================================

document
    .getElementById("loginButton")
    .addEventListener("click", login);


document
    .getElementById("usernameInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            login();

        }

    });


function login() {

    const input =
        document
            .getElementById("usernameInput")
            .value
            .trim();


    const error =
        document.getElementById("loginError");


    if (input === "") {

        error.innerText =
            "Username එක දාන්න ❤️";

        return;

    }


    currentUser = input;


    if (
        input.toLowerCase() ===
        EDIT_USERNAME.toLowerCase()
    ) {

        editMode = true;

        enableEditMode();

    } else {

        editMode = false;

        disableEditMode();

    }


    error.innerText = "";

    showScene("intro");

}


// ========================================
// EDIT MODE
// ========================================

function enableEditMode() {

    const letter =
        document.getElementById(
            "letterText"
        );


    letter.contentEditable =
        "true";


    document
        .getElementById("editControls")
        .classList.remove("hidden");


    document
        .getElementById("photoUploadBox")
        .classList.remove("hidden");


    document
        .getElementById("musicControls")
        .classList.remove("hidden");


    loadSavedLetter();

}


function disableEditMode() {

    const letter =
        document.getElementById(
            "letterText"
        );


    letter.contentEditable =
        "false";


    document
        .getElementById("editControls")
        .classList.add("hidden");


    document
        .getElementById("musicControls")
        .classList.remove("hidden");


    loadSavedLetter();

}


// ========================================
// SCENE CHANGE
// ========================================

function showScene(id) {

    scenes.forEach(function(scene) {

        scene.classList.remove("active");

    });


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.add("active");

    }

}


// ========================================
// START
// ========================================

document
    .getElementById("startButton")
    .addEventListener("click", function() {

        showScene("birthday");

        heartBurst();

    });


// ========================================
// BIRTHDAY
// ========================================

document
    .getElementById("memoriesButton")
    .addEventListener("click", function() {

        showScene("memories");

    });


// ========================================
// LETTER
// ========================================

document
    .getElementById("letterButton")
    .addEventListener("click", function() {

        showScene("letter");

    });


// ========================================
// SECRET
// ========================================

document
    .getElementById("secretButton")
    .addEventListener("click", function() {

        showScene("secret");

    });


// ========================================
// FINAL MESSAGE
// ========================================

document
    .getElementById("revealButton")
    .addEventListener("click", function() {

        document
            .getElementById("finalMessage")
            .classList.add("show");

        heartBurst();

    });


// ========================================
// PHOTO UPLOAD
// ========================================

const photoInput =
    document.getElementById(
        "photoInput"
    );


const gallery =
    document.getElementById(
        "gallery"
    );


photoInput.addEventListener(
    "change",
    function(event) {

        const files =
            event.target.files;


        for (
            let i = 0;
            i < files.length;
            i++
        ) {

            const file =
                files[i];


            if (
                !file.type.startsWith("image/")
            ) {

                continue;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(e) {

                    createPhoto(
                        e.target.result
                    );

                };


            reader.readAsDataURL(file);

        }

    }
);


// ========================================
// CREATE PHOTO
// ========================================

function createPhoto(imageURL) {

    const card =
        document.createElement("div");


    card.className =
        "photo-card";


    const image =
        document.createElement("img");


    image.src =
        imageURL;


    image.alt =
        "Memory";


    card.appendChild(image);


    gallery.appendChild(card);


    card.addEventListener(
        "click",
        function() {

            openPhoto(imageURL);

        }
    );

}


// ========================================
// PHOTO VIEWER
// ========================================

const viewer =
    document.getElementById(
        "photoViewer"
    );


const viewerImage =
    document.getElementById(
        "viewerImage"
    );


function openPhoto(imageURL) {

    viewerImage.src =
        imageURL;

    viewer.classList.add("show");

}


document
    .getElementById("closeViewer")
    .addEventListener("click", function() {

        viewer.classList.remove(
            "show"
        );

    });


viewer.addEventListener(
    "click",
    function(event) {

        if (
            event.target === viewer
        ) {

            viewer.classList.remove(
                "show"
            );

        }

    }
);


// ========================================
// SAVE LETTER
// ========================================

document
    .getElementById("saveLetterButton")
    .addEventListener("click", function() {

        if (!editMode) {

            return;

        }


        const letter =
            document.getElementById(
                "letterText"
            );


        localStorage.setItem(
            "sandaliBirthdayLetter",
            letter.innerHTML
        );


        alert(
            "Letter saved successfully ❤️"
        );

    });


// ========================================
// LOAD LETTER
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
// FLOATING HEART
// ========================================

function createHeart() {

    const heart =
        document.createElement("div");


    heart.className =
        "heart";


    const symbols = [
        "❤️",
        "💗",
        "💖",
        "💕",
        "💓"
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


    setTimeout(function() {

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

function heartBurst() {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const heart =
            document.createElement("div");


        heart.className =
            "heart";


        heart.innerText =
            "❤️";


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


        setTimeout(function() {

            heart.remove();

        }, 6000);

    }

}


// ========================================
// MUSIC
// ========================================

const musicInput =
    document.getElementById(
        "musicInput"
    );


const music =
    document.getElementById(
        "music"
    );


const musicButton =
    document.getElementById(
        "musicButton"
    );


const removeMusicButton =
    document.getElementById(
        "removeMusicButton"
    );


let musicLoaded = false;


musicButton.addEventListener(
    "click",
    function() {

        if (!musicLoaded) {

            musicInput.click();

            return;

        }


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
// ADD MUSIC
// ========================================

musicInput.addEventListener(
    "change",
    function(event) {

        if (!editMode) {

            return;

        }


        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        const musicURL =
            URL.createObjectURL(file);


        music.src =
            musicURL;


        musicLoaded =
            true;


        music.play();


        musicButton.innerText =
            "🔊 Playing";

    }
);


// ========================================
// REMOVE MUSIC
// ========================================

removeMusicButton.addEventListener(
    "click",
    function() {

        if (!editMode) {

            return;

        }


        music.pause();

        music.removeAttribute("src");

        music.load();


        musicLoaded =
            false;


        musicButton.innerText =
            "🎵 Music";


        musicInput.value =
            "";

    }
);