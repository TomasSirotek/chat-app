require("dotenv").config(); // use .env file

import 'reflect-metadata';
import { Request, Response } from "express"; // import Request and Response types
import { container } from 'tsyringe';
import UserController from "./controller/userController";
import ChatController from './controller/chatController';
import MessageController from './controller/messageController';
import AuthController from './controller/authController';
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errHandlerer');

const express = require("express");
const cors = require("cors"); // standard CORS
const app = express();
const cookieParser = require("cookie-parser");

// middleware function
app.use(express.json()); // recieve json data from client

app.use(credentials);
app.use(cors(corsOptions)); // use cors
app.use(cookieParser()); 

app.use(logger);


app.use('/api/auth', container.resolve(AuthController).routes());
// ENDPOINTS

app.use(verifyJWT);
app.use('/api/users', container.resolve(UserController).routes());
app.use('/api/chats', container.resolve(ChatController).routes());
app.use('/api/messages', container.resolve(MessageController).routes());

const PORT = process.env.PORT || 5001;

app.use(errorHandler);


app.listen(PORT, (req: Request, res: Response) => {
  console.log(`Server is running on port ${PORT}`);
});




