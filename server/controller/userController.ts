import { User, PostUserDto } from "../model/user";
import { NextFunction, Request, Response, Router } from "express";
import { autoInjectable } from "tsyringe";
import UserService from "../service/userService";
import JWT from "../helpers/jwt";
import { Role } from "../helpers/role";
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const ACCESS_TOKEN = 'access_token';

const authorization = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
  }

  try {
    const data = JWT.verifyToken(token);
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.status(StatusCodes.FORBIDDEN)
    .send({
      error: getReasonPhrase(StatusCodes.FORBIDDEN)
    });
  }
};

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
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please fill all the fields" });
    if (!validator.isEmail(email))
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter a valid email" });
    if (!validator.isStrongPassword(password))
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter a strong password" });

    // checking if the user already exists
    const existingUser: User | undefined =
      await this.userService.getUserByEmailAsync(email);

    if (existingUser)
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists" });

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

    if (!newUser) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create user" });

    const token = JWT.createToken(newUser.id, Role.ADMIN);

    return res
      .cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(StatusCodes.OK)
      .json({
        message: "Registered successfully",
        _id: newUser.id,
        name: newUser.username,
      });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password)
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please fill all the fields" });

    const existingUser: User | undefined =
      await this.userService.getUserByEmailAsync(email);

    // checking if the user exists
    if (!existingUser)
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User does not exist" });

    const isValidPws = await bcrypt.compare(password, existingUser.password);
    if (!isValidPws)
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials" });

    const token = JWT.createToken(existingUser.id, Role.ADMIN);

    return res
      .cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(StatusCodes.OK)
      .json({
        message: "Loggen in successfully",
        _id: existingUser.id,
        name: existingUser.username,
      });
  }

  async logout(req: Request, res: Response) {
    return res
      .clearCookie(ACCESS_TOKEN)
      .status(200)
      .json({ message: "Successfully logged out." });
  }

  async getUserById(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);

    const user: User | undefined = await this.userService.getUserByIdAsync(
      userId
    );

    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });

    res.status(StatusCodes.OK).json(user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users: User[] | undefined = await this.userService.getAllUsersAsync();

    if (!users) return res.status(StatusCodes.NOT_FOUND).json({ msg: "No users found" });

    res.status(StatusCodes.OK).json(users);
  }

  routes() {
    router.post("/register", (req: Request, res: Response) =>
      this.registerUser(req, res)
    );
    router.post("/login", (req: Request, res: Response) =>
      this.login(req, res)
    );
    router.get("/logout", authorization, (req: Request, res: Response) =>
      this.logout(req, res)
    );
    router.get("/:id",authorization, (req: Request, res: Response) =>
      this.getUserById(req, res)
    );
    router.get("/", authorization,(req: Request, res: Response) =>
      this.getAllUsers(req, res)
    );
    return router;
  }
}
