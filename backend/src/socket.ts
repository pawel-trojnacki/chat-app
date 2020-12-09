let io: any;

module.exports = {
    init: (httpServer: any) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PATCH', 'DELETE'],
            },
        });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket not initialized');
        }
        return io;
    },
};
