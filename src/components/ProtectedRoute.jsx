import e from 'cors';
import{Navigate, Outlet} from 'react-router-dom';

const protectedRoute = () => {
    const token = localStorage.getItem('auth_token');
    
    if(!token){
        return<Navigate to="/login" replace/>
    }
    return <Outlet/>
};

export default protectedRoute;