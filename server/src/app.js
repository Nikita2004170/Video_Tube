import express from 'express';
import dotenv from 'dotenv';
import router from './routes/user.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
dotenv.config({
     path:".env"
});

const app=express();
//
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static('public'));
app.use(cookieParser())
app.get('/',(req ,res )=>{
    res.send('Hello World!');
});
//
app.use(cors({
     origin:"http://localhost:5173",
    credentials: true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))
//route
app.use('/api/v1',router);
const port=process.env.PORT||3000;
app.listen(port,()=>{
console.log(`Server is running on port ${port}`);
});
export default app;
