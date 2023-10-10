import { Request, Response } from "express"; // import Request and Response types

require("dotenv").config(); // use .env file
const express = require("express");
const cors = require("cors"); // standard CORS
const app = express();

const userRoute = require("./routes/userRoute"); // import userRoute

// middleware function
app.use(express.json()); // recieve json data from client

app.use(cors()); // use cors

app.use("/api/users", userRoute); // use userRoute
// end middleware



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


