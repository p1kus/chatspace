// import { generateHex } from "./generateHex.js";

const socket = io();
let username;

//Dodac walidacje nickow

const userList = document.querySelector("#users-online");
const userTypingTooltip = document.querySelector("#typing-tooltip");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const messages = document.querySelector("#messages");

let typeTimeout;

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

// form.addEventListener("keyup");

socket.on("connect", function () {
  username = prompt("Enter your nickname");
  socket.emit("newUser", username);
  socket.on("usersUpdate", (users) => {
    let usernames = [];
    users.forEach((user) => {
      console.log(user);
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
  console.log(usernameColor);
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
socket.on("disconnected", () => {});
