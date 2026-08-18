import { redirect } from "react-router";


export const dashboardLoader = async() => {
   

    const response = await fetch('/api/me')

    if(!response.ok){
        if(response.status >= 500){
            return redirect('/')
        }
        return redirect('/auth/login')
    }



    return response.json()
}

export const authLoader = async() => {
    const response = await fetch('/api/me')

    if(response.ok){
        return redirect('/dashboard')
    }

    return null; 
}




