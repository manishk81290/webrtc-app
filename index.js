const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 8888;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    socket.on('callEnded', () => {
        socket.broadcast.emit("callEnded");
    });
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", {
            signal: signalData,
            from,
            name
        });
    });
    socket.on("callAccepted", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})