"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    login as cognitoLogin,
    logout as cognitoLogout
} from "@/services/auth";

import {
    getToken,
    removeToken
} from "@/utils/storage";

import {
    AuthContextType
} from "@/types/auth";


const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


export function AuthProvider(
    {
        children
    }: {
        children: React.ReactNode
    }
) {


    const [token, setToken] =
        useState<string | null>(null);


    const [loading, setLoading] =
        useState(true);



    useEffect(() => {

        try {

            const existingToken =
                getToken();


            if (existingToken) {

                setToken(existingToken);

            }

        } catch (error) {

            console.error(
                "Auth initialization failed",
                error
            );

            removeToken();

        } finally {

            setLoading(false);

        }

    }, []);




    async function login(
        username: string,
        password: string
    ) {


        const jwt =
            await cognitoLogin(
                username,
                password
            );


        setToken(jwt);

    }




    function logout() {


        cognitoLogout();


        setToken(null);

    }





    return (

        <AuthContext.Provider

            value={{

                token,

                isAuthenticated:
                    Boolean(token),

                loading,

                login,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}




export function useAuth() {


    const context =
        useContext(AuthContext);



    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}