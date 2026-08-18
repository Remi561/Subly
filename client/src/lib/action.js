// import {getToken} from '@clerk/react'
// export function getApiBaseUrl() {
//   return import.meta.env.VITE_API_URL;

import { useQuery } from "@tanstack/react-query";

// }






export async function apiFetch(url, options = {}) {
    const getApiBaseUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${getApiBaseUrl}${url}`, {
      ...options,
      credentials: "include",
    });

    if(!response.ok){
      let message = 'Request failed';

      try {
          const error = await response.json()

          if(error?.message) { 
            message = error.message
          }
      } catch {
        throw new Error('Something went wrong')
      }
      throw new Error(message)
    }
  
  return response.json()
}

export function GetCurrentUser(){
  const {data, isError} = useQuery({
    queryKey: ['me'],
    queryFn:() =>  apiFetch('/api/me')
  })

  return {data, isError}; 
}
