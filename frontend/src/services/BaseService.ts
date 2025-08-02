import axios from "axios";
import { config } from "dotenv";
import { createPostponedAbortSignal } from "next/dist/server/app-render/dynamic-rendering";

axios.interceptors.request.use(
    config =>{
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    response => response,
    error => {
        if(error.response && [401, 403].includes(error.response.status)){
            localStorage.clear();
            console.error("Redirected to login because 4xx error.")
            window.location.href= "/";
        }else 
            return Promise.reject(error);
    }
)

export default axios;