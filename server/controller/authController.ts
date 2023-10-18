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
} from "http-status-codes";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN = "access_token";

@autoInjectable()
export default class AuthController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill all the fields" });

    const existingUser: User | undefined =
      await this.userService.getUserByEmailAsync(email);

    // checking if the user exists
    if (!existingUser)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User does not exist" });

    const isValidPws = await bcrypt.compare(password, existingUser.password);
    if (!isValidPws)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
        
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: existingUser.username,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
      { 
        username: existingUser.username 
      },
      process.env.REFRESH_TOKEN_SECRET,
      { 
        expiresIn: "1d" 
      }
    );
    // Saving refreshToken with current user
    existingUser.refreshToken = refreshToken;

    // Update user in db
    const updateUser : User | undefined = await this.userService.updateUserAsync(existingUser);

    if(updateUser === null) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error updating user" });

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    return res.status(StatusCodes.OK).json({
      message: "Loggen in successfully",
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      password: existingUser.password,
      createdAt: existingUser.created_at,
      accessToken,
    });


  }

  async logout(req: Request, res: Response) {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT); //No content
    const refreshToken = cookies.jwt;

    const existingUser: User | undefined = await this.userService.getUserByRefreshToken(refreshToken);

    if (!existingUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }


    existingUser.refreshToken = "";
    // delete refresh token in db 
    const updatedUser = await this.userService.updateUserAsync(existingUser);

    if (updatedUser === null) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    
    return res
      .clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "Successfully logged out." });
  }


  async handleRefreshToken (req: Request, res: Response) {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(StatusCodes.FORBIDDEN);
    const refreshToken = cookies.jwt;

    const existingUser: User | undefined = await this.userService.getUserByRefreshToken(refreshToken);


    if (!existingUser) return res.sendStatus(StatusCodes.FORBIDDEN); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: Error, decoded: { username: string; }) => {
            if (err || existingUser.username !== decoded.username) return res.sendStatus(StatusCodes.FORBIDDEN);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                    }
                },
                process.env.JWT_SECRET,
                { expiresIn: '10s' }
            );
            res.json({  accessToken })
        }
    );
}


  routes() {
    router.post("/login", (req: Request, res: Response) =>
      this.login(req, res)
    );
    router.get("/logout", (req: Request, res: Response) =>
      this.logout(req, res)
    );
    router.get("/refresh", (req: Request, res: Response) =>
        this.handleRefreshToken(req, res)
  );

    return router;
  }
}
