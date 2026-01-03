import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
//console.log(process.env.MONGO_URI);
import connectDb from './DB/db.js';
connectDb()
 .then(()=>{
        const port = process.env.PORT || 3000;
    })
    .catch((error)=>{
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    });
