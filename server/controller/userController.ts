import { User, PostUserDto } from "../model/user";
import { Request, Response } from "express";
import { UserService } from "../service/userService";

const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const pgPoolWrapper = require("../connection"); // import pgPoolWrapper
const {getUserByEmailAsync} = require("../service/userService"); // import pgPoolWrapper


const createToken = (_id: number) => {
  const jwtkey = process.env.JWT_SECRET;

  return jwt.sign({ id: _id }, jwtkey, { expiresIn: "3d" });
};

export class UserController {

constructor(private readonly userService: UserService) {}

  async registerUser (req: Request, res: Response) {
  const { username, email, password } = req.body;

 
    
    // validation of the user input
    if (!username || !email || !password)
      return res.status(400).json({ msg: "Please fill all the fields" });
    if (!validator.isEmail(email))
      return res.status(400).json({ msg: "Please enter a valid email" });
    if (!validator.isStrongPassword(password))
      return res.status(400).json({ msg: "Please enter a strong password" });

    // checking if the user already exists
    // return existing user from the database
    const existingUser = await this.userService.getUserByEmailAsync(email);


    if (existingUser.rows.length > 0)
      return res.status(400).json({ msg: "User already exists" });

    const user: PostUserDto = {
      username,
      email,
      password: await bcrypt
        .genSalt(10)
        .then((salt: any) => bcrypt.hash(password, salt)),
    };

    // inserting the user into the database

    const newUser = this.userService.createUserAsync(user);
    
    const token = createToken(newUser.rows[0].id);

    res.status(200).json({
      token,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].name,
        email: newUser.rows[0].email,
      },
    });

  
};


// const authenticate = async (req: Request, res: Response) => {
//     const {email, password} = req.body;

//     try {
//         const client = await pgPoolWrapper.connect();

//         const existingUser  = await client.query(
//             "SELECT * FROM chat_app.user WHERE email = $1",
//             [email]
//           );
      

//         if(existingUser.rows.length === 0) return res.status(400).json({msg: "User does not exist"});

//         const isValidPws = await bcrypt.compare(password, existingUser.rows[0].password);
//         if(!isValidPws) return res.status(400).json({msg: "Invalid credentials"});

//         const token = createToken(existingUser.rows[0].id);
//         res.status(200).json({ _id : existingUser.rows[0].id,name: existingUser.username ,token});
//     } catch (err: any) {

//     }

// }




}
