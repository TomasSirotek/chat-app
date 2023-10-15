import { Socket } from "socket.io";

const { Server } = require('socket.io');

const io = new Server({ cors: "http://localhost:5173/"});


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
      
          console.log("Online users: " + JSON.stringify(onlineUser));
      
          // Send back online users to all connected clients
          io.emit('getUsersOnline', onlineUser);
        }
      });

      // listen to message emited from client   
      socket.on("sendMessage", (message: any) => {
        const user = onlineUser.find((user) => user.userId === message.recipientId);

        
        if(user) {
          io.to(user.socketId).emit("getMessage", message);
          console.log("Message: " + JSON.stringify(message));
          console.log("Message sent to user: " + JSON.stringify(user));
        }

      });


     socket.on('disconnect', () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);

        io.emit('getUsersOnline', onlineUser);
    });


});

io.listen(3000);


