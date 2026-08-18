






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
