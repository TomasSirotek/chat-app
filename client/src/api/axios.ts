import { environment } from '@/environments/environment';
import axios from 'axios';


export default axios.create({
    baseURL: environment.BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: environment.BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});