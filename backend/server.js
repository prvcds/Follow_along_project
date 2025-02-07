const app = require('./app');
const connectDatabase = require('./db/Database');

process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
   
});

if(process.env.NODE !== 'PRODUCTION') {
    require('dotenv').config({
        path: "config/.env",
    });
}


connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
    
        console.log(`Unhandled rejection: ${err.message}`);
        console.log('Shutting down the server due to unhandled rejection');

        server.close(() => {
            process.exit(1);
        });
    });