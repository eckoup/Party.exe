/* =========================
   SUPABASE CONFIG
========================= */

const SUPABASE_URL = "https://omwycrliuclddnazrqjh.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ee5552Z9valzNcLO04d-hg_H0xe3iQp";

let db = null;

function initSupabase() {
    if (!window.supabase) {
        console.warn("Supabase library not loaded.");
        return;
    }

    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase ready");
}

/* =========================
   ELEMENTS
========================= */

const startupSound = document.getElementById("startupSound");
const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

const bootScreen = document.getElementById("bootScreen");
const desktop = document.getElementById("desktop");
const bootText = document.getElementById("bootText");

const messageBoardIcon = document.getElementById("messageBoardIcon");
const aimWindow = document.getElementById("aimWindow");
const closeAim = document.getElementById("closeAim");

const chatMessages = document.getElementById("chatMessages");
const guestName = document.getElementById("guestName");
const foodInput = document.getElementById("foodInput");
const sendChat = document.getElementById("sendChat");

const clock = document.getElementById("clock");

/* =========================
   AUDIO HELPERS
========================= */

function playBootSound() {
    if (!startupSound) {
        console.warn("startupSound element not found.");
        return;
    }

    startupSound.volume = 1;
    startupSound.currentTime = 0;

    startupSound.play()
        .then(() => {
            console.log("Boot sound playing");
        })
        .catch((err) => {
            console.warn("Boot sound failed:", err);
        });
}

/* =========================
   BOOT SYSTEM
========================= */

let booted = false;

document.addEventListener("click", startBoot, { once: true });

function startBoot() {
    if (booted) return;
    booted = true;

    playBootSound();

    const lines = [
        "PartyOS BIOS v07.22.2026",
        "",
        "Memory Test: 67536K OK",
        "Detecting Primary Master... BESTBUY_DISK",
        "Detecting Secondary Master... AIM_PROTOCOL",
        "",
        "Loading AIM Messages...",
        "Loading Party Service...",
        "Initiating Potluck Protocol...",
        "Checking Karaoke Drivers... OK",
        "Checking Halo LAN Adapter... OK",
        "Mounting Snack Registry... OK",
        "",
        "Boot complete ✔"
    ];

    bootText.textContent = "";

    let index = 0;

    const bootInterval = setInterval(() => {
        bootText.textContent += lines[index] + "\n";
        index++;

        if (index >= lines.length) {
            clearInterval(bootInterval);

            setTimeout(() => {
                bootScreen.classList.add("hidden");
                desktop.classList.remove("hidden");
                initSupabase();
            }, 700);
        }
    }, 180);
}

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
   OPEN / CLOSE AIM WINDOW
========================= */

messageBoardIcon?.addEventListener("click", () => {
    clickSound?.play().catch(() => {});
    aimWindow.classList.remove("hidden");
    loadAIMIntro();
});

closeAim?.addEventListener("click", () => {
    aimWindow.classList.add("hidden");
});

/* =========================
   CHAT SYSTEM
========================= */

sendChat?.addEventListener("click", async () => {
    const name = guestName.value.trim();
    const food = foodInput.value.trim();

    if (!name || !food) {
        errorSound?.play().catch(() => {});
        return;
    }

    const guestMsg = document.createElement("div");
    guestMsg.className = "chat-entry";
    guestMsg.innerHTML = `<strong>${name}:</strong> im bringing ${food}`;
    chatMessages.appendChild(guestMsg);

    if (!db) {
        const failMsg = document.createElement("div");
        failMsg.className = "chat-entry";
        failMsg.innerHTML = `<strong>chicrevolt:</strong> database isn't ready yet 😭 try again in a sec`;
        chatMessages.appendChild(failMsg);
        return;
    }

    const { data, error } = await db
        .from("food_claims")
        .insert({
            guest_name: name,
            food_item: food
        })
        .select();

    const reply = document.createElement("div");
    reply.className = "chat-entry";

    if (error) {
        errorSound?.play().catch(() => {});

        reply.innerHTML =
            `<strong>chicrevolt:</strong>
            nooo 😭 ${food} is already taken
            can u pick something else?`;

        console.error("Supabase insert error:", error);
    } else {
        reply.innerHTML =
            `<strong>chicrevolt:</strong>
            yesss ${food} is PERFECT 😍
            added u to the list ✔`;

        console.log("Inserted:", data);
    }

    chatMessages.appendChild(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    guestName.value = "";
    foodInput.value = "";
});

/* =========================
   CLOCK
========================= */

function updateClock() {
    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 1000);

/* =========================
   MANUAL SUPABASE TEST
========================= */

window.testSupabaseInsert = async function () {
    if (!db) {
        console.warn("Supabase not initialized yet.");
        return;
    }

    const { data, error } = await db
        .from("food_claims")
        .insert({
            guest_name: "Alex",
            food_item: "Pizza"
        })
        .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);
};