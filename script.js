const API = "https://backend-b80q.onrender.com";

/* =========================
   LOGIN PROTECTION
========================= */

const email = localStorage.getItem("userEmail");
const name = localStorage.getItem("userName");
const pic = localStorage.getItem("userPic");

if (!email) {
    window.location.replace("login.html");
}

/* =========================
   DOM
========================= */

const profilePic = document.getElementById("profilePic");
const sidebarUserPic = document.getElementById("sidebarUserPic");
const sidebarUserName = document.getElementById("sidebarUserName");

const accountMenu = document.getElementById("accountMenu");
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");

const chat = document.getElementById("chat");
const chatHistory = document.getElementById("chatHistory");

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const thinkingBox = document.getElementById("thinkingBox");

const newChatBtn = document.getElementById("newChatBtn");

const mobileMenuBtn =
document.getElementById("mobileMenuBtn");

const sidebar =
document.getElementById("sidebar");

/* =========================
   USER INFO
========================= */

profilePic.src = pic;
sidebarUserPic.src = pic;
sidebarUserName.textContent = name;

userInfo.innerHTML = `
<b>${name}</b><br>
${email}
`;

/* =========================
   MENU
========================= */

profilePic.addEventListener("click", () => {

    accountMenu.style.display =
        accountMenu.style.display === "block"
        ? "none"
        : "block";

});

document.addEventListener("click", (e) => {

    if (
        !profilePic.contains(e.target) &&
        !accountMenu.contains(e.target)
    ) {
        accountMenu.style.display = "none";
    }

});

logoutBtn.addEventListener("click", () => {

    localStorage.clear();

    window.location.href =
    "login.html";

});

/* =========================
   MOBILE MENU
========================= */

mobileMenuBtn?.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});

/* =========================
   AUTO RESIZE
========================= */

msgInput.addEventListener("input", () => {

    msgInput.style.height = "auto";

    msgInput.style.height =
        msgInput.scrollHeight + "px";

});

/* =========================
   CHAT HISTORY
========================= */

let chats =
JSON.parse(
localStorage.getItem("nexora_chats")
|| "[]"
);

function saveChats() {

    localStorage.setItem(
        "nexora_chats",
        JSON.stringify(chats)
    );

}

function renderHistory() {

    chatHistory.innerHTML = "";

    chats.forEach((item, index) => {

        const div =
        document.createElement("div");

        div.className =
        "chat-history-item";

        div.textContent =
        item.title ||
        `Chat ${index + 1}`;

        div.addEventListener("click", () => {

            chat.innerHTML = "";

            item.messages.forEach(msg => {

                renderMessage(
                    msg.role,
                    msg.content
                );

            });

        });

        chatHistory.appendChild(div);

    });

}

renderHistory();

/* =========================
   NEW CHAT
========================= */

newChatBtn.addEventListener("click", () => {

    chat.innerHTML = "";

    const welcome =
    document.getElementById(
        "welcomeScreen"
    );

    if (welcome) {
        welcome.style.display = "block";
    }

});

/* =========================
   MESSAGE RENDER
========================= */

function renderMessage(
    role,
    text
) {

    const wrapper =
    document.createElement("div");

    wrapper.className =
    role === "user"
    ? "message user"
    : "message assistant";

    wrapper.innerHTML = `
    <div class="avatar"></div>
    <div class="message-content"></div>
    `;

    const content =
    wrapper.querySelector(
        ".message-content"
    );

    if (
        role === "assistant" &&
        window.marked
    ) {

        content.innerHTML =
        marked.parse(text);

    } else {

        content.textContent =
        text;

    }

    chat.appendChild(wrapper);

    addCopyButtons();

    scrollBottom();

    return content;

}

/* =========================
   COPY BUTTONS
========================= */

function addCopyButtons() {

    document
    .querySelectorAll("pre")
    .forEach(pre => {

        if (
            pre.querySelector(
                ".copy-btn"
            )
        ) return;

        const btn =
        document.createElement(
            "button"
        );

        btn.className =
        "copy-btn";

        btn.textContent =
        "Copy";

        btn.addEventListener(
            "click",
            async () => {

                await navigator
                .clipboard
                .writeText(
                    pre.innerText
                );

                btn.textContent =
                "Copied";

                setTimeout(() => {

                    btn.textContent =
                    "Copy";

                }, 1500);

            }
        );

        pre.appendChild(btn);

    });

}

/* =========================
   SCROLL
========================= */

function scrollBottom() {

    chat.scrollTop =
    chat.scrollHeight;

}

/* =========================
   THINKING
========================= */

function showThinking() {

    thinkingBox.style.display =
    "block";

}

function hideThinking() {

    thinkingBox.style.display =
    "none";

}

/* =========================
   TYPING ANIMATION
========================= */

function typeText(
    element,
    text
) {

    return new Promise(resolve => {

        let i = 0;

        element.innerHTML = "";

        function type() {

            if (i >= text.length) {

                resolve();

                return;

            }

            element.textContent +=
            text.charAt(i);

            i++;

            scrollBottom();

            setTimeout(
                type,
                8
            );

        }

        type();

    });

}

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    const message =
    msgInput.value.trim();

    if (!message) return;

    document
    .getElementById(
        "welcomeScreen"
    )
    ?.remove();

    renderMessage(
        "user",
        message
    );

    msgInput.value = "";
    msgInput.style.height = "auto";

    showThinking();

    try {

        const response =
        await fetch(
            API + "/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body:
                JSON.stringify({
                    message
                })
            }
        );

        const data =
        await response.json();

let reply = data.reply;

const q = message.toLowerCase().trim();

if (
    q === "who are you" ||
    q === "who r you" ||
    q === "what are you"
) {
    reply = `
# Morado AI

I am Morado AI, an advanced AI assistant created by Morado.

I can help with coding, mathematics, science, writing, research and problem solving.
`;
}

if (q === "who created you") {
    reply = "I was created by Morado.";
}

if (q === "what is your name") {
    reply = "My name is Morado AI.";
}

if (q === "are you gemini") {
    reply = "I am Morado AI.";
}
        hideThinking();

        const wrapper =
        document.createElement(
            "div"
        );

        wrapper.className =
        "message assistant";

        wrapper.innerHTML = `
        <div class="avatar"></div>
        <div class="message-content"></div>
        `;

        chat.appendChild(wrapper);

        const content =
        wrapper.querySelector(
            ".message-content"
        );

        await typeText(
            content,
            reply
        );

        content.innerHTML =
        marked.parse(
            reply
        );

        addCopyButtons();

        scrollBottom();

        chats.unshift({

            title:
            message.substring(
                0,
                40
            ),

            messages: [

                {
                    role:
                    "user",

                    content:
                    message
                },

                {
                    role:
                    "assistant",

                    content:
                    reply
                }

            ]

        });

        if (
            chats.length > 50
        ) {
            chats.pop();
        }

        saveChats();

        renderHistory();

    } catch (err) {

        hideThinking();

        renderMessage(
            "assistant",
            "Server Error."
        );

        console.error(err);

    }

}

/* =========================
   SEND BUTTON
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);

/* =========================
   ENTER TO SEND
========================= */

msgInput.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    }
);

/* =========================
   SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    e => {

        if (
            e.ctrlKey &&
            e.key.toLowerCase()
            === "k"
        ) {

            e.preventDefault();

            msgInput.focus();

        }

        if (
            e.ctrlKey &&
            e.key.toLowerCase()
            === "n"
        ) {

            e.preventDefault();

            newChatBtn.click();

        }

    }
);

/* =========================
   SUGGESTIONS
========================= */

document
.querySelectorAll(
".suggestion"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            msgInput.value =
            btn.textContent.trim();

            sendMessage();

        }
    );

});

