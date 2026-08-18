
import {useAuth} from '@clerk/react'
import Loading from '../Loading';
import { Navigate, Outlet } from 'react-router';

const Public = () => {
    const {isLoaded, isSignedIn} = useAuth();

    if(!isLoaded){
        return <Loading/>
    }
    if(isSignedIn) return <Navigate to={'/dashboard'} replace/>
    return <Outlet/>
}

export default Public