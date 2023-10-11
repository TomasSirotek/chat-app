import 'reflect-metadata';
import { Request, Response } from "express"; // import Request and Response types
import { container } from 'tsyringe';
import UserController from "./controller/userController";

require("dotenv").config(); // use .env file
const express = require("express");
const cors = require("cors"); // standard CORS
const app = express();
const cookieParser = require("cookie-parser");

// middleware function
app.use(express.json()); // recieve json data from client
app.use(cors()); // use cors
app.use(cookieParser());


// ENDPOINTS
app.use('/api/users', container.resolve(UserController).routes());

const PORT = process.env.PORT || 5001;


app.listen(PORT, (req: Request, res: Response) => {
  console.log(`Server is running on port ${PORT}`);
});

// pgPoolWrapper
//   .connect()
//   .then(() => {
//     console.log("Connected to Postgres 🔥");
//   })
//   .catch((err: any) => {
//     console.log("Error connecting to Postgres", err);
//   });


