// ========================================
// SANDALI BIRTHDAY WEBSITE
// FIREBASE VERSION
// ========================================


// ========================================
// SETTINGS
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
    .addEventListener(
        "click",
        login
    );


document
    .getElementById("usernameInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                login();

            }

        }
    );


async function login() {

    const input =
        document
            .getElementById(
                "usernameInput"
            )
            .value
            .trim();


    const error =
        document.getElementById(
            "loginError"
        );


    if (input === "") {

        error.innerText =
            "Username එක දාන්න ❤️";

        return;

    }


    currentUser = input;


    editMode =
        input.toLowerCase() ===
        EDIT_USERNAME.toLowerCase();


    error.innerText = "";


    updateUserDisplay();

    updateEditPermissions();

    updateSecurityButton();


    // Save login session online

    await registerUser();


    showScene("intro");

}


// ========================================
// USER DISPLAY
// ========================================

function updateUserDisplay() {

    const display =
        document.getElementById(
            "currentUserDisplay"
        );


    if (display) {

        display.innerText =
            currentUser;

    }

}


// ========================================
// EDIT PERMISSIONS
// ========================================

function updateEditPermissions() {

    const letterControls =
        document.getElementById(
            "editControls"
        );

    const messageControls =
        document.getElementById(
            "messageEditControls"
        );


    if (editMode) {

        letterControls
            .classList
            .remove("hidden");


        messageControls
            .classList
            .remove("hidden");


        document
            .getElementById("letterText")
            .contentEditable =
            "true";


    } else {

        letterControls
            .classList
            .add("hidden");


        messageControls
            .classList
            .add("hidden");


        document
            .getElementById("letterText")
            .contentEditable =
            "false";

    }


    loadSavedLetter();

    loadSavedMessage();

}


// ========================================
// SCENE SYSTEM
// ========================================

function showScene(id) {

    scenes.forEach(
        function(scene) {

            scene.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.add(
            "active"
        );

    }

}


// ========================================
// INTRO
// ========================================

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        function() {

            showScene("birthday");

            heartBurst();

        }
    );


// ========================================
// BIRTHDAY
// ========================================

document
    .getElementById("memoriesButton")
    .addEventListener(
        "click",
        function() {

            showScene("memories");

        }
    );


// ========================================
// LETTER
// ========================================

document
    .getElementById("letterButton")
    .addEventListener(
        "click",
        function() {

            showScene("letter");

        }
    );


// ========================================
// SECRET
// ========================================

document
    .getElementById("secretButton")
    .addEventListener(
        "click",
        function() {

            showScene("secret");

        }
    );


// ========================================
// FINAL MESSAGE
// ========================================

document
    .getElementById("revealButton")
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "finalMessage"
                )
                .classList
                .add("show");


            heartBurst();

        }
    );


// ========================================
// LETTER SAVE
// ========================================

document
    .getElementById(
        "saveLetterButton"
    )
    .addEventListener(
        "click",
        saveLetter
    );


async function saveLetter() {

    if (!editMode) {

        return;

    }


    const letter =
        document.getElementById(
            "letterText"
        );


    const letterHTML =
        letter.innerHTML;


    try {

        await setDoc(
            doc(
                db,
                "birthday",
                "main"
            ),
            {
                letter:
                    letterHTML
            },
            {
                merge: true
            }
        );


        alert(
            "Letter saved ❤️"
        );


    } catch (error) {

        console.error(
            "Letter save error:",
            error
        );


        alert(
            "Letter save කරන්න බැරි වුණා 😢"
        );

    }

}


// ========================================
// LOAD LETTER
// ========================================

async function loadSavedLetter() {

    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "birthday",
                    "main"
                )
            );


        if (
            snapshot.exists()
        ) {

            const data =
                snapshot.data();


            if (data.letter) {

                document
                    .getElementById(
                        "letterText"
                    )
                    .innerHTML =
                    data.letter;

            }

        }

    } catch (error) {

        console.error(
            "Letter load error:",
            error
        );

    }

}


// ========================================
// MESSAGE POPUP
// ========================================

const messagePopup =
    document.getElementById(
        "messagePopup"
    );


document
    .getElementById(
        "openMessageButton"
    )
    .addEventListener(
        "click",
        function() {

            messagePopup
                .classList
                .add("show");

            loadSavedMessage();

        }
    );


document
    .getElementById(
        "closeMessage"
    )
    .addEventListener(
        "click",
        function() {

            messagePopup
                .classList
                .remove("show");

        }
    );


messagePopup.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            messagePopup
        ) {

            messagePopup
                .classList
                .remove("show");

        }

    }
);


// ========================================
// LOAD MESSAGE
// ========================================

async function loadSavedMessage() {

    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "birthday",
                    "main"
                )
            );


        if (
            snapshot.exists()
        ) {

            const data =
                snapshot.data();


            if (data.message) {

                document
                    .getElementById(
                        "cloudMessage"
                    )
                    .innerHTML =
                    data.message;

            }

        }

    } catch (error) {

        console.error(
            "Message load error:",
            error
        );

    }

}


// ========================================
// EDIT MESSAGE
// ========================================

document
    .getElementById(
        "editMessageButton"
    )
    .addEventListener(
        "click",
        function() {

            if (!editMode) {

                return;

            }


            const message =
                document.getElementById(
                    "cloudMessage"
                );


            message.contentEditable =
                "true";


            message.classList.add(
                "editing"
            );


            message.focus();

        }
    );


// ========================================
// SAVE MESSAGE
// ========================================

document
    .getElementById(
        "saveMessageButton"
    )
    .addEventListener(
        "click",
        saveMessage
    );


async function saveMessage() {

    if (!editMode) {

        return;

    }


    const message =
        document.getElementById(
            "cloudMessage"
        );


    try {

        await setDoc(
            doc(
                db,
                "birthday",
                "main"
            ),
            {
                message:
                    message.innerHTML
            },
            {
                merge: true
            }
        );


        message.contentEditable =
            "false";


        message.classList.remove(
            "editing"
        );


        alert(
            "Message saved ❤️"
        );


    } catch (error) {

        console.error(
            "Message save error:",
            error
        );


        alert(
            "Message save කරන්න බැරි වුණා 😢"
        );

    }

}


// ========================================
// SECURITY / LOGIN USERS
// ========================================

const securityButton =
    document.getElementById(
        "securityButton"
    );


const onlinePopup =
    document.getElementById(
        "onlinePopup"
    );


function updateSecurityButton() {

    if (
        currentUser.toLowerCase() ===
        EDIT_USERNAME.toLowerCase()
    ) {

        securityButton
            .classList
            .remove("hidden");

    } else {

        securityButton
            .classList
            .add("hidden");

    }

}


// ========================================
// REGISTER USER
// ========================================

async function registerUser() {

    try {

        await setDoc(
            doc(
                db,
                "sessions",
                currentUser.toLowerCase()
            ),
            {

                username:
                    currentUser,

                lastSeen:
                    Date.now(),

                active:
                    true

            },
            {
                merge: true
            }
        );


    } catch (error) {

        console.error(
            "User registration error:",
            error
        );

    }

}


// ========================================
// UPDATE USER PRESENCE
// ========================================

setInterval(
    async function() {

        if (
            currentUser === ""
        ) {

            return;

        }


        try {

            await setDoc(
                doc(
                    db,
                    "sessions",
                    currentUser.toLowerCase()
                ),
                {

                    username:
                        currentUser,

                    lastSeen:
                        Date.now(),

                    active:
                        true

                },
                {
                    merge: true
                }
            );

        } catch (error) {

            console.error(
                "Presence update error:",
                error
            );

        }

    },
    30000
);


// ========================================
// SECURITY POPUP OPEN
// ========================================

securityButton.addEventListener(
    "click",
    function() {

        if (!editMode) {

            return;

        }


        onlinePopup
            .classList
            .add("show");


        loadUsers();

    }
);


// ========================================
// CLOSE SECURITY POPUP
// ========================================

document
    .getElementById(
        "closeOnline"
    )
    .addEventListener(
        "click",
        function() {

            onlinePopup
                .classList
                .remove("show");

        }
    );


onlinePopup.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            onlinePopup
        ) {

            onlinePopup
                .classList
                .remove("show");

        }

    }
);


// ========================================
// LOAD USERS
// ========================================

async function loadUsers() {

    const list =
        document.getElementById(
            "onlineUsersList"
        );


    list.innerHTML =
        `<div class="loading-users">
            Loading users... 🔐
        </div>`;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "sessions"
                )
            );


        list.innerHTML = "";


        if (
            snapshot.empty
        ) {

            list.innerHTML =
                `<div class="loading-users">
                    No users found yet.
                </div>`;

            return;

        }


        const now =
            Date.now();


        let count = 0;


        snapshot.forEach(
            function(docSnapshot) {

                const data =
                    docSnapshot.data();


                const lastSeen =
                    data.lastSeen || 0;


                // Consider active for 2 minutes

                const isActive =
                    now - lastSeen <
                    120000;


                if (!isActive) {

                    return;

                }


                count++;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "user-row";


                row.innerHTML = `

                    <div class="user-avatar">
                        👤
                    </div>

                    <div class="user-info">

                        <div class="user-name">
                            ${escapeHTML(
                                data.username
                            )}
                        </div>

                        <div class="user-time">
                            Last seen just now
                        </div>

                    </div>

                    <div class="user-online">
                        ● Online
                    </div>

                `;


                list.appendChild(row);

            }
        );


        if (count === 0) {

            list.innerHTML =
                `<div class="loading-users">
                    Nobody is active right now 👀
                </div>`;

        }


    } catch (error) {

        console.error(
            "Users load error:",
            error
        );


        list.innerHTML =
            `<div class="loading-users">
                Couldn't load users 😢
            </div>`;

    }

}


// ========================================
// SECURITY
// HTML ESCAPE
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.innerText =
        text;


    return div.innerHTML;

}


// ========================================
// AUDIO
// ========================================

const music =
    document.getElementById(
        "music"
    );


const voiceButton =
    document.getElementById(
        "voiceButton"
    );


voiceButton.addEventListener(
    "click",
    async function() {

        try {

            if (
                music.paused
            ) {

                await music.play();

                voiceButton.innerText =
                    "⏸ Pause";

            } else {

                music.pause();

                voiceButton.innerText =
                    "▶ Listen";

            }

        } catch (error) {

            console.error(
                "Audio error:",
                error
            );

            alert(
                "Audio play කරන්න බැරි වුණා 😢"
            );

        }

    }
);


// ========================================
// MUSIC TOP BUTTON
// ========================================

const musicButton =
    document.getElementById(
        "musicButton"
    );


musicButton.addEventListener(
    "click",
    async function() {

        try {

            if (
                music.paused
            ) {

                await music.play();

                musicButton.innerText =
                    "🔊 Playing";

            } else {

                music.pause();

                musicButton.innerText =
                    "🔇 Muted";

                voiceButton.innerText =
                    "▶ Listen";

            }

        } catch (error) {

            console.error(
                "Music error:",
                error
            );

        }

    }
);


// ========================================
// FLOATING HEARTS
// ========================================

function createHeart() {

    const heart =
        document.createElement(
            "div"
        );


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
        Math.random() * 100 +
        "%";


    heart.style.fontSize =
        (
            12 +
            Math.random() * 22
        ) +
        "px";


    heart.style.animationDuration =
        (
            5 +
            Math.random() * 6
        ) +
        "s";


    hearts.appendChild(
        heart
    );


    setTimeout(
        function() {

            heart.remove();

        },
        12000
    );

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
            document.createElement(
                "div"
            );


        heart.className =
            "heart";


        heart.innerText =
            "❤️";


        heart.style.left =
            (
                45 +
                Math.random() * 10
            ) +
            "%";


        heart.style.bottom =
            "40%";


        heart.style.fontSize =
            (
                15 +
                Math.random() * 25
            ) +
            "px";


        heart.style.animationDuration =
            (
                2 +
                Math.random() * 3
            ) +
            "s";


        hearts.appendChild(
            heart
        );


        setTimeout(
            function() {

                heart.remove();

            },
            6000
        );

    }

}
