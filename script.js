
/* =========================
   AUDIO
========================= */

const startupSound = document.getElementById("startupSound");
const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

/* =========================
   BOOT SEQUENCE
========================= */

const bootScreen = document.getElementById("bootScreen");
const desktop = document.getElementById("desktop");
const bootText = document.getElementById("bootText");

let booted = false;

document.addEventListener("click", startBoot, { once: true });

function startBoot() {

    if (booted) return;
    booted = true;

    startupSound.play().catch(() => {});

    bootText.textContent =
`PartyOS BIOS v1.0

Loading AIM Messenger...
Loading Party Services...
Loading Potluck Protocol...
Boot complete ✔`;

    setTimeout(() => {

        bootScreen.classList.add("hidden");
        desktop.classList.remove("hidden");

    }, 1400);
}

/* =========================
   AIM WINDOW
========================= */

const messageBoardIcon =
document.getElementById("messageBoardIcon");

const aimWindow =
document.getElementById("aimWindow");

const closeAim =
document.getElementById("closeAim");

const chatMessages =
document.getElementById("chatMessages");

const guestName =
document.getElementById("guestName");

const foodInput =
document.getElementById("foodInput");

const sendChat =
document.getElementById("sendChat");

/* =========================
   CLAIM SYSTEM
========================= */

const claimedFoods = new Set();

/* =========================
   AIM LANDING MESSAGE
========================= */

function loadAIMIntro() {

    chatMessages.innerHTML = `
        <div class="chat-entry">
            <strong>chicrevolt:</strong>
            omg u are coming to our party!! yayyy :D
            <br><br>

            <strong>PARTY DETAILS:</strong><br>
            📅 July 22nd<br>
            🕗 8:00 PM - ???<br>
            🍕 Potluck style<br>
            🎤 Karaoke<br>
            🎮 Halo<br>
            🧙 Magic: The Gathering<br>
            🎉 other chaotic fun stuff<br><br>

            what r u bringing???
        </div>
    `;
}

/* =========================
   OPEN / CLOSE WINDOW
========================= */

messageBoardIcon.addEventListener("click", () => {

    clickSound.play().catch(() => {});

    aimWindow.classList.remove("hidden");

    loadAIMIntro();

});

closeAim.addEventListener("click", () => {

    aimWindow.classList.add("hidden");

});

/* =========================
   CHAT SYSTEM
========================= */

sendChat.addEventListener("click", () => {

    const name =
    guestName.value.trim();

    const food =
    foodInput.value.trim();

    if (!name || !food) {

        errorSound.play().catch(() => {});
        return;
    }

    /* Guest message */

    const guestMsg =
    document.createElement("div");

    guestMsg.className =
    "chat-entry";

    guestMsg.innerHTML =
    `<strong>${name}:</strong>
    im bringing ${food}`;

    chatMessages.appendChild(guestMsg);

    const normalized =
    food.toLowerCase();

    /* chicrevolt response */

    const reply =
    document.createElement("div");

    reply.className =
    "chat-entry";

    setTimeout(() => {

        if (claimedFoods.has(normalized)) {

            errorSound.play().catch(() => {});

            reply.innerHTML =
            `<strong>chicrevolt:</strong>
            nooo 😭 ${food} is already taken
            can u pick something else?`;

        } else {

            claimedFoods.add(normalized);

            reply.innerHTML =
            `<strong>chicrevolt:</strong>
            yesss ${food} is PERFECT 😍
            added u to the list ✔`;

        }

        chatMessages.appendChild(reply);

        chatMessages.scrollTop =
        chatMessages.scrollHeight;

    }, 500);

    guestName.value = "";
    foodInput.value = "";

});

/* =========================
   CLOCK (optional but nice)
========================= */

const clock =
document.getElementById("clock");

function updateClock() {

    if (!clock) return;

    const now = new Date();

    clock.textContent =
    now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

}

updateClock();
setInterval(updateClock, 1000);


/* =========================
   CHAOS MODE (SAFE SIMULATION)
========================= */


document.addEventListener("DOMContentLoaded", () => {

    const chaosIcon =
    document.getElementById("chaosIcon");

    if (!chaosIcon) {
        console.error("Chaos icon not found");
        return;
    }

    const messages = [
        "ERROR 0x80070005: Access denied (to vibes)",
        "AIM service unexpectedly nostalgic",
        "System32 is thinking about quitting",
        "Memory leak detected in PartyOS.exe",
        "Guest list corrupted",
        "Unknown process: snack.exe running",
        "Kernel panic (emotion subsystem failed)"
    ];

    function spawnError() {

        const popup = document.createElement("div");
        popup.className = "xp-error";

        popup.style.top =
        Math.random() * (window.innerHeight - 150) + "px";

        popup.style.left =
        Math.random() * (window.innerWidth - 260) + "px";

        popup.innerHTML = `
            <div class="xp-error-title">
                PartyOS Error
            </div>

            <div class="xp-error-body">
                ${messages[Math.floor(Math.random() * messages.length)]}
                <br><br>

                <button onclick="this.parentElement.parentElement.remove()">
                    OK
                </button>
            </div>
        `;

        document.body.appendChild(popup);
    }

    chaosIcon.addEventListener("click", () => {

        console.log("Chaos clicked");

        spawnError(); // ONLY ONE POPUP PER CLICK

    });

});