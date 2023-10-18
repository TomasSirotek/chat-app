import { autoInjectable } from "tsyringe";
import { UserRepository } from "../repository/userRepository";
import { PostUserDto, User } from "../model/user";


@autoInjectable()
export default class UserService {
   
    
    userRepository: UserRepository

    constructor( userRepository: UserRepository) {
      this.userRepository = userRepository;
    }

    async createUserAsync(user: PostUserDto) : Promise<User | undefined>   {
        return this.userRepository.createUserAsync(user);
    }

    async updateUserAsync(existingUser: User) : Promise<User | undefined> {
      return this.userRepository.updateUserAsync(existingUser);
    }

    async getUserByRefreshToken(refreshToken: any): Promise<User | undefined> {
      return this.userRepository.getUserByRefreshToken(refreshToken);
    }
  
    async getAllUsersAsync():  Promise<User[] | undefined> {
      return this.userRepository.getAllUsersAsync();
    }
    

    async getUserByEmailAsync(email: string)  : Promise<User | undefined> {
      return this.userRepository.getUserByEmailAsync(email);
    }

    async getUserByIdAsync(id: number): Promise<User | undefined> {
      return this.userRepository.getUserByIdAsync(id)
    }
  }
