// middleware/dependencyInjection.ts
import { Request, Response, NextFunction } from 'express';
import { PostgresUserRepository } from '../repository/userRepository';
import { UserService } from '../service/userService';
import { UserController } from '../controller/userController';

export function injectDependencies(req: any, res: Response, next: NextFunction) {
  const userRepository = new PostgresUserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  req.userRepository = userRepository;
  req.userService = userService;
  req.userController = userController;

  next();
}
