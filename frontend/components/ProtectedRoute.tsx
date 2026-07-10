"use client";


import {
    useEffect
} from "react";


import {
    useRouter
} from "next/navigation";


import {
    useAuth
} from "@/context/AuthContext";
import Loading from "./Loading";



export default function ProtectedRoute(
    {
        children
    }: {
        children: React.ReactNode
    }) {


    const {
        isAuthenticated,
        loading
    }
        =
        useAuth();


console.log("ProtectedRoute: isAuthenticated =", isAuthenticated, "loading =", loading);
    const router =
        useRouter();



    useEffect(() => {


        if (!loading && !isAuthenticated) {

            router.push("/login");

        }


    }, [
        loading,
        isAuthenticated,
        router
    ]);




    if (loading) {

        return (

            <Loading />

        );

    }



    if (!isAuthenticated) {

        return null;

    }



    return <>{children}</>;

}