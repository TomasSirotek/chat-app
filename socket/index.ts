import { Socket } from "socket.io";

const { Server } = require('socket.io');

const io = new Server({ cors: "http://localhost:5173"});


let onlineUser = [] as User[];

export interface User {
    socketId: string;
    userId: number;
}

io.on('connection', (socket: Socket) => {
    
    socket.on('join', (user: User) => {
        if (user.userId && !onlineUser.some((onlineUser) => onlineUser.userId === user.userId)) {
          onlineUser.push({
            userId: user.userId,
            socketId: socket.id,
          });
            
          // Send back online users to all connected clients
          io.emit('getUsersOnline', onlineUser);
        }
      });

      // listen to message emited from client   
      socket.on("sendMessage", (message: any) => {
        const user = onlineUser.find((user) => user.userId === message.recipientId);

        
        if(user) {
          io.to(user.socketId).emit("getMessage", message);
          io.to(user.socketId).emit("getNotification",{
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
          });
        }

      });


     socket.on('disconnect', () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);

        io.emit('getUsersOnline', onlineUser);
    });


});

io.listen(3000);


