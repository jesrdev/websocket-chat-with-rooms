const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
  console.log("Server is running");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/math", (req, res) => {
  res.sendFile(__dirname + "/public/math.html");
});

app.get("/computer-science", (req, res) => {
  res.sendFile(__dirname + "/public/computer-science.html");
});

app.get("/physics", (req, res) => {
  res.sendFile(__dirname + "/public/physics.html");
});

//subjects namespace
const subjects = io.of("/subjects");

subjects.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    subjects
      .in(data.room)
      .emit("message", `New user joined ${data.room} room!`);
  });
  socket.on("message", (data) => {
    console.log(data.messge);
    subjects.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    subjects.emit("message", "user disconnected");
  });
});
