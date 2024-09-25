import { validate } from "./validation.js";

const socket = io();

const userList = document.querySelector("#users-online");
const userTypingTooltip = document.querySelector("#typing-tooltip");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const messages = document.querySelector("#messages");
const errorItem = document.querySelector("#errorText");

const dialog = document.querySelector("dialog");
const dialogInput = document.querySelector("#dialogInput");
const closeButton = document.querySelector("dialog button");

let typeTimeout;
let username = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", username, input.value);
    input.value = "";
  }
});

form.addEventListener("keydown", (e) => {
  if (KeyboardEvent) {
    socket.emit("userTyping", username);
  }
});

//Wrzucic tą funcje do validation.js
const validateUser = () => {
  const validateResult = validate(username);
  if (validateResult === true) {
    socket.emit("newUser", username, (noDuplicate) => {
      if (noDuplicate) {
        dialog.close();
      } else {
        errorItem.classList.remove("hidden");
      }
    }); // Add closing bracket here
  } else if (username === "") {
    errorItem.classList.remove("hidden");
  } else {
    errorItem.classList.remove("hidden");
  }
};

socket.on("connect", function () {
  dialog.showModal();
  dialogInput.value = "";

  dialogInput.addEventListener("input", () => {
    username = dialogInput.value;
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validateUser();
    }
  });

  // this is actually a submit button in dialog named like that
  closeButton.addEventListener("click", validateUser);

  socket.on("usersUpdate", (users) => {
    const usernames = [];
    users.forEach((user) => {
      usernames.push(user.userData);
    });
    userList.innerHTML = `<span style="color: #007BFF; font-weight:bold">Users online: [${
      users.length
    }] </span> ${usernames.join(", ")}`;
  });
});

socket.on("userTyping", () => {
  userTypingTooltip.classList.remove("hidden");
  userTypingTooltip.classList.add("visible");
  clearTimeout(typeTimeout);
  typeTimeout = setTimeout(() => {
    userTypingTooltip.classList.remove("visible");
    userTypingTooltip.classList.add("hidden");
  }, 1500);
});

socket.on("chat message", (username, msg, usernameColor) => {
  const item = document.createElement("li");
  item.innerHTML = `<span style="color: ${usernameColor}">${username}: </span> ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  userTypingTooltip.classList.remove("visible");
  userTypingTooltip.classList.add("hidden");
  clearTimeout(typeTimeout);
});
socket.on("system message", (username, alert) => {
  const item = document.createElement("li");
  item.innerHTML = `<span>${username} ${alert}</span>`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  userTypingTooltip.classList.remove("visible");
  userTypingTooltip.classList.add("hidden");
  clearTimeout(typeTimeout);
});
