import axios from "axios";
import { getToken, removeToken } from "@/utils/storage";


const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 10000,

});


// Request interceptor
api.interceptors.request.use(

    (config) => {

        const token = getToken();


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// Response interceptor

api.interceptors.response.use(

    (response) => {

        return response;

    },


    (error) => {


        if (
            error.response &&
            error.response.status === 401
        ) {

            removeToken();


            if (typeof window !== "undefined") {

                window.location.href = "/login";

            }

        }


        return Promise.reject(error);

    }

);


export default api;