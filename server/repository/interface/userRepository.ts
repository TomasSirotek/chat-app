export interface UserRepository {
    
  getUserByEmailAsync(email: string): any;
  createUserAsync(user : any): any;

  }