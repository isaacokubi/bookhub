const users = {};

export default function setupSocket(io) {
  io.on(
    "connection",

    (socket) => {
      console.log("User connected", socket.id);

      socket.on(
        "join",

        (userId) => {
          users[userId] = socket.id;

          socket.join(userId);
        },
      );

      socket.on(
        "typing",

        (data) => {
          socket.to(data.receiverId).emit(
            "typing",

            {
              sender: data.senderId,
            },
          );
        },
      );

      socket.on(
        "sendMessage",

        (data) => {
          const receiverSocket = users[data.receiverId];

          if (receiverSocket) {
            io.to(receiverSocket).emit(
              "newMessage",

              data,
            );
          }
        },
      );

      socket.on(
        "disconnect",

        () => {
          Object.keys(users)

            .forEach((id) => {
              if (users[id] === socket.id) delete users[id];
            });
        },
      );
    },
  );
}
