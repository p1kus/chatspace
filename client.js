// import { generateHex } from "./generateHex.js";

const socket = io();
let username;

//LISTA UZYTKOWNIKOW - DONE

//ODSEPAROWAC JS, CSS W OSOBNE PLIKI DLA KLIENTA ITD - DONE

//Dodac "user is typing..." - DONE

//Dodac kolorowe nicki - ZSYNCHRONIZOWAC, NA SERWERZE

//Dodac alerty ze ktos przyszedl poszedl

//Dodac walidacje nickow i

// naprawic disconnecta -- done

//W przyszlosci, kanaly

const userList = document.querySelector("#users-online");
const userTypingTooltip = document.querySelector("#typing-tooltip");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const messages = document.querySelector("#messages");

// const generateHex = () => {
//   const chars = "0123456789abcdef";
//   let hex = "#";
//   for (let i = 0; i <= 5; i++) {
//     hex += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return hex;
// };

// let color = "";
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
socket.on("disconnected", () => {});
