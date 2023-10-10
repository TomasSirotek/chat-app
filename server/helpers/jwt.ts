const jwt = require("jsonwebtoken");

export default class JWT {

    static createToken = (_id: number) => {
        const jwtkey = process.env.JWT_SECRET;
      
        return jwt.sign({ id: _id }, jwtkey, { expiresIn: '3d' });
      };
}