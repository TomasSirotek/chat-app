import { User, PostUserDto } from "../model/user";
import { Request, Response, Router } from "express";
import { autoInjectable } from "tsyringe";
import UserService from "../service/userService";
import JWT from "../helpers/jwt";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

@autoInjectable()
export default class UserController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async registerUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    // validation of the user input
    if (!username || !email || !password)
      return res.status(400).json({ msg: "Please fill all the fields" });
    if (!validator.isEmail(email))
      return res.status(400).json({ msg: "Please enter a valid email" });
    if (!validator.isStrongPassword(password))
      return res.status(400).json({ msg: "Please enter a strong password" });

    // checking if the user already exists
    const existingUser: User | undefined =
      await this.userService.getUserByEmailAsync(email);

    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const user: PostUserDto = {
      username,
      email,
      password: await bcrypt
        .genSalt(10)
        .then((salt: any) => bcrypt.hash(password, salt)),
    };

    const newUser: User | undefined = await this.userService.createUserAsync(
      user
    );

    if (!newUser) return res.status(500).json({ msg: "Failed to create user" });

    const token = JWT.createToken(newUser.id);

    // For now returning use inside the json response however it has to be changed back later on to the token only ! Propabllyyyy
    // Same here with the cookie
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "Registered successfully 😊 👌",
        _id: newUser.id,
        name: newUser.username,
      });
  }

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill all the fields" });

    const existingUser: User | undefined =
      await this.userService.getUserByEmailAsync(email);

    // checking if the user exists
    if (!existingUser)
      return res.status(400).json({ msg: "User does not exist" });

    const isValidPws = await bcrypt.compare(password, existingUser.password);
    if (!isValidPws)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = JWT.createToken(existingUser.id);

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "Loggen in successfully 😊 👌",
        _id: existingUser.id,
        name: existingUser.username,
      });

  }

  async getUserById(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);

    const user: User | undefined = await this.userService.getUserByIdAsync(
      userId
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users: User[] | undefined = await this.userService.getAllUsersAsync();

    if (!users) return res.status(404).json({ msg: "No users found" });

    res.status(200).json(users);
  }

  routes() {
    router.post("/register", (req: Request, res: Response) =>
      this.registerUser(req, res)
    );

    router.post("/authenticate", (req: Request, res: Response) =>
      this.authenticate(req, res)
    );

    router.get("/:id", (req: Request, res: Response) =>
      this.getUserById(req, res)
    );
    router.get("/", (req: Request, res: Response) =>
      this.getAllUsers(req, res)
    );
    return router;
  }
}
