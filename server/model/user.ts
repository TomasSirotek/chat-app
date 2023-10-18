export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    refreshToken?: string;
  }


export interface PostUserDto {
    username: string;
    email: string;
    password: string;
}