import axios, { AxiosInstance} from "axios"

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true //  Include cookies in the request

})


/* Keep in mind
    if ( response.status == 401 )
        Attemp to refresh the access token
        const refreshResponse = await axios('/refresh'), {
            method:'POST',
            withCredentialos: true
        }
            if (refreshResponse.ok) {
                return axios(url, ... options, withCredentials)
            }
                else {
                // Redirect to login if refresh fails
                }


    On the client side, monitor for 401 Unauthorized responses. 
    Upon receiving such a response, automatically request a new access 
    token from the /auth/refresh endpoint and retry the original request.

*/