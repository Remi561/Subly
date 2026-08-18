
import {useAuth} from '@clerk/react'
import {Navigate, Outlet} from 'react-router'
import Loading from '../Loading';

const Protected = () => {
    const {isLoaded, isSignedIn} = useAuth()

    if(!isLoaded){
        return <Loading/>
    }
    if(!isSignedIn){
        return <Navigate to={'/auth/login'} replace/>
    }
    return <Outlet/>
}

export default Protected