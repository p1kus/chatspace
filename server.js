import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = [];

const generateHex = () => {
  const chars = "0123456789abcdef";
  let hex = "#";
  for (let i = 0; i <= 5; i++) {
    hex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hex;
};

let color = "";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));
app.get("/", (req, res) => {});

io.on("connection", (socket) => {
  console.log("a user connected");

  app.get("/users", (req, res) => {
    res.json(users);
  });

  socket.on("newUser", (userData) => {
    console.log(`New user
    ${userData}`);
    // username = userData;
    color = generateHex();
    socket.userColor = color;
    users.push(userData);
    console.log(users);
    io.emit("usersUpdate", users);
    socket.userData = userData;
  });
  socket.on("disconnect", () => {
    let userData = socket.userData;
    let index = users.indexOf(userData);
    if (index !== -1) {
      users.splice(index, 1);
    }
    io.emit("usersUpdate", users);
    console.log(`${userData} disconnected`);
  });
  socket.on("userTyping", () => {
    console.log(`User is typing rn`);
    socket.broadcast.emit("userTyping");
  });
});

socket.on("chat message", (username, msg) => {
  let usernameColor = socket.userColor;
  io.emit("chat message", usernameColor, username, msg);
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
