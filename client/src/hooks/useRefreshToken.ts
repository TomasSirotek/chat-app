import { getRequest } from '@/utils/Service';

import { environment } from '@/environments/environment';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth() as any;

    const refresh = async () => {
        const res = await getRequest( `${environment.BASE_URL}/auth/refresh`);
       
        console.log(res);
        setAuth((prev: any) => {
            console.log(JSON.stringify(prev));
            console.log(res.accessToken);
            return {
                ...prev,
                accessToken: res.accessToken
            }
        });
        return res.accessToken;
    }
    return refresh;
};

export default useRefreshToken;