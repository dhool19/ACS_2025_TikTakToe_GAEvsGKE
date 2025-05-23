const MAX_USERS_PER_ROOM = 2;
const queue = new Map();

function socket(io) {
    io.on("connection", (socket) => {
        console.log(`User connected with ID: ${socket.id}`);

        socket.on("joinQueue", () => {
            queue.set(socket.id, socket);
        
            if (queue.size >= MAX_USERS_PER_ROOM) {
                const roomName = 'room_' + Math.random().toString(36).substring(7);
                const players = Array.from(queue.values()).splice(0, 2);
        
                io.to(players[0].id).emit('tag', 'x');
                players[0].join(roomName);
                queue.delete(players[0].id);
                console.log(`User: ${players[0].id} connected to room: ${roomName}`);
        
                io.to(players[1].id).emit('tag', 'o');
                players[1].join(roomName);
                queue.delete(players[1].id);
                console.log(`User: ${players[1].id} connected to room: ${roomName}`);
        
                io.to(roomName).emit('startGame', roomName);
            }
        });
        

        socket.on("handShake", (arg)=> {
            console.log("HandShake", arg)
            socket.broadcast.to(arg.room).emit('handShake', arg.opp)
        })

        socket.on("joinRoom", (room) => {
            const roomClients = io.sockets.adapter.rooms.get(room);
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`)
        });

        socket.on("num", (arg) => {
            socket.to(arg.room).emit('num', arg);
            console.log(arg)
        });

        socket.on("message", (message) => {
            console.log(message)
            socket.to(message.room).emit('message', message);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected with ID: ${socket.id}`);
            io.emit('userLeft', socket.id);
            if (queue.has(socket.id)) {
                queue.delete(socket.id);
            }

            const rooms = io.sockets.adapter.rooms;
            if (rooms) {
                rooms.forEach((value, room) => {
                    if (value.has(socket.id)) {
                        io.to(room).emit('userLeft', socket.id);
                    }
                });
            }
        });
    });
}

module.exports = socket;
