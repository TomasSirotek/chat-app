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
  
    async getUserByEmailAsync(email: string)  : Promise<User | undefined> {
      return this.userRepository.getUserByEmailAsync(email);
    }
  }
