import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Types/Types";
import {socket} from "../socket/socket.js"


interface AuthContextType{
    user : User | null
    login : (email : string, password : string)=>Promise<void>;
    loadingLogin : boolean;
    signUp : (firstName : string, lastName : string,email : string, password1 : string, password2 : string) => Promise<void>;
    loadingSignUp : boolean;
    signOut : ()=>Promise<void>
    loadingSignOut : boolean;
    errorMsg :string | null;
    getUser : ()=>Promise<void>;
    loadingUser : boolean;
    forgotPassword : (email: string) => Promise<boolean>;
    loadingForgotPassword : boolean;

    resetPassword : (token: string, password: string, confirmPassword: string) => Promise<boolean>;
    loadingResetPassword : boolean;

}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {

    const [user, setUser] = useState<User | null>(()=>{
        const saved = localStorage.getItem('user');

        return saved ? JSON.parse(saved) : null
    });

    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loadingUser, setLoadingUser] = useState<boolean>(false);

    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);
    const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);

    const [loadingForgotPassword, setLoadingForgotPassword] = useState<boolean>(false);
const [loadingResetPassword, setLoadingResetPassword] = useState<boolean>(false);

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])

    const login = async(email : string, password : string) => {

        try{

            setLoadingLogin(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({email, password}),
                credentials : "include"
            });

            const data = await res.json();


            if(!res.ok){
                setErrorMsg(data.error || data.message || "Error in logging in")
                throw new Error(data.error || data.message || "Error in logging in")

            }

            setUser(data.data.user)
            setErrorMsg(null)
        }catch(err){
            console.error(err);
        }finally{
            setLoadingLogin(false)
        }
    }

    const signUp = async(firstName : string, lastName : string,email : string, password1 : string, password2 : string) => {

        try{

            setLoadingSignUp(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-up`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({firstName, lastName,email, password1, password2}),
                credentials : "include"
            });

            const data = await res.json();

                        if(!res.ok){
                setErrorMsg(data.error || data.message || "Error in logging in")
                throw new Error(data.error || data.message || "Error in logging in")

            }

            setUser(data.data.user)
            setErrorMsg(null)
        }catch(err){
            console.error(err)
        }finally{
            setLoadingSignUp(false);
        }
    }

    const signOut = async() => {

        try{

            setLoadingSignOut(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials : "include"
            });

            const data = await res.json();

            if(!res.ok){
                setErrorMsg(data.error || data.message || "Error in logging in")
                throw new Error(data.error || data.message || "Error in logging in")

            }

            setUser(null)
            setErrorMsg(null)

        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignOut(false);
        }
    }


    const getUser = async() => {

        try{

            setLoadingUser(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
                method : "GET",
                credentials : "include"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting user");
            }

            setUser(data.data);
            
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUser(false);
        }
    } 


    const forgotPassword = async (email: string): Promise<boolean> => {

    try {
        setLoadingForgotPassword(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error || data.message || "Error in sending reset email");
            throw new Error(data.error || data.message || "Error in sending reset email");
        }

        setErrorMsg(null);
        return true;

    } catch (err) {
        console.error(err);
        return false;
    } finally {
        setLoadingForgotPassword(false);
    }
};


const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
): Promise<boolean> => {

    try {
        setLoadingResetPassword(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password, confirmPassword }),
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error || data.message || "Error in resetting password");
            throw new Error(data.error || data.message || "Error in resetting password");
        }

        setErrorMsg(null);
        return true;

    } catch (err) {
        console.error(err);
        return false;
    } finally {
        setLoadingResetPassword(false);
    }
};

    useEffect(()=>{
        getUser();
    } ,[])

        useEffect(() => {

    if(user){
        socket.connect();
    }else{
        socket.disconnect();
    }

}, [user]);

    return <AuthContext.Provider value={{
        user,
            login,
    loadingLogin,
    signUp,
    loadingSignUp ,
    signOut ,
    loadingSignOut,
    errorMsg ,
    loadingUser,
    getUser,
        forgotPassword,
    loadingForgotPassword,
    resetPassword,
    loadingResetPassword,
    }}>
        {children}
    </AuthContext.Provider>
}



export const useAuthContext = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("Please use the useAuthContext hook inside an AuthProvider");
    }

    return context;
}