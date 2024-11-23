import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import mongoose from "mongoose";
import router from "./router";

const app = express();
const PORT = 8080;

app.use(cors ({
    credentials: true,
}));


require('dotenv').config();
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);


server.listen(PORT, ()=>{
    console.log(`Server Running on PORT http://localhost:${PORT}/. Click on this link to open your web application`)
});

const MONGO_URL = `mongodb+srv://shivammmhyphen:${process.env.MONGO_URI_PASSWORD}@backend-crud.ybakm.mongodb.net/?retryWrites=true&w=majority&appName=backend-crud`

mongoose.Promise = Promise;
const connectDB = mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());