import { UserRepository } from "../repository/interface/userRepository";
import { UserServiceInterface } from "./interface/userServiceInterface";



export class UserService implements UserServiceInterface{
    constructor(private readonly userRepository: UserRepository) {}

    createUserAsync(user: any) {
        return this.userRepository.createUserAsync(user);
    }
  
    async getUserByEmailAsync(email: string) {
      return this.userRepository.getUserByEmailAsync(email);
    }
  }
