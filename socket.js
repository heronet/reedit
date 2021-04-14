let io;

module.exports = {
    init: server => {
        io = require('socket.io')(server, {
            cors: {
                origin: '*'
            }
        });
        return io;
    },
    getIo: () => {
        if(!io)
            throw new Error("Socket.io not initialized");
        return io;
    }
}