import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = [];
//Trzymac to w obiekcie, user - kolor?

const generateHex = () => {
  const chars = "0123456789abcdef";
  let hex = "#";
  for (let i = 0; i <= 5; i++) {
    hex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hex;
};

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
    let color = generateHex();
    let user = { userData, color, id: socket.id };
    users.push(user);
    console.log(users);
    for (user of users) {
      console.log(user.userData);
    }
    io.emit("usersUpdate", users);
    socket.userColor = color;
    socket.userData = userData;
  });
  socket.on("disconnect", () => {
    let userData = socket.userData;
    let index = users.findIndex((user) => user.userData === userData);
    if (index !== -1) {
      users.splice(index, 1);
    }
    io.emit("usersUpdate", users);
    console.log(`${userData} disconnected`);
  });
  socket.on("userTyping", () => {
    console.log(`User is typing rn`);
    socket.broadcast.emit("userTyping");
    //Broadcast - so the user typing does not get the tooltip. (Send to all but the sender)
  });

  socket.on("chat message", (username, msg) => {
    let user = users.find((user) => user.username === username);
    let usernameColor = user ? user.color : "#000000";
    io.emit("chat message", username, msg, usernameColor);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
