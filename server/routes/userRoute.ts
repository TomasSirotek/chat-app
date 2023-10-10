import { Request, Response } from "express"; // import Request and Response types
import { injectDependencies } from '../middleware/di';

const express = require('express');

const router = express.Router();
router.use(injectDependencies);

router.post('/register', async (req : any, res: any) => {
    const { userController } = req;
    await userController.registerUser(req, res);
  });
// router.post('/login', authenticate);
// router.get('/user', getUserById);

module.exports = router;