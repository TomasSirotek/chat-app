export interface UserServiceInterface {
    getUserByEmailAsync(email: string): any;
    createUserAsync(user: any): any;
}