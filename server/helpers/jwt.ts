import { Role } from "./role";

const jwt = require("jsonwebtoken");

export default class JWT {

    static createToken = (_id: number,_role: Role) => {
        const jwtkey = process.env.JWT_SECRET;
      
        return jwt.sign({ id: _id, role: _role }, jwtkey, { expiresIn: '3d' });
      };

    static verifyToken = (token: string) => {
        const jwtkey = process.env.JWT_SECRET;
        return jwt.verify(token, jwtkey);
      }  
}