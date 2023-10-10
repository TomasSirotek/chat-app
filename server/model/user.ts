export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
  }

export class UserModel implements User{
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;

    constructor(id: number,username: string, email: string, password: string, created_at: Date) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
    }
}

export interface PostUserDto {
    username: string;
    email: string;
    password: string;
}