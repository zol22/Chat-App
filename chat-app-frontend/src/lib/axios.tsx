import axios, { AxiosInstance, AxiosError} from "axios"
import toast from 'react-hot-toast';

interface ErrorResponseData {
    message?: string;
  }

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true //  Include cookies in the request

})

// 📌 Global Response Interceptor (Handles API Errors)
axiosInstance.interceptors.response.use(
    (response) => response,  // ✅ If the request is successful, just return the response.
    
    async (error: AxiosError<ErrorResponseData>) => {
      if (error.response) {
        const { status, data } = error.response;
  
        switch (status) {
          case 400:
            toast.error(data?.message || "❌ Bad Request: Please check your input.");
            break;
          case 401:
            toast.error("🔒 Unauthorized: Please login again.");
            // Optionally, refresh the token if implemented
            /* 
              try {
                await axiosInstance.post("/auth/refresh"); // 🔄 Request a new access token
                return axiosInstance.request(error.config); // 🔁 Retry the failed request
            } catch (refreshError) {
                toast.error("Session expired. Please log in again.");
            }
            */
            break;
          case 403:
            toast.error("🚫 Forbidden: You do not have permission.");
            break;
          case 404:
            toast.error("🔎 Not Found: The requested resource does not exist.");
            break;
          case 409:
            toast.error("Conflict: User already exists.");
            break;
          case 500:
            toast.error("⚠️ Server Error: Please try again later.");
            break;
          default:
            toast.error(data?.message || "An unexpected error occurred.");
        }
      } else {
        // 🔴 Handle network errors or server not responding
        toast.error("Network Error: Please check your internet connection.");
      }
  
      return Promise.reject(error); // ✅ Ensures the calling function receives the error
    }
  );

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