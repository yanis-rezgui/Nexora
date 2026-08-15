import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Types/Types";




interface AuthContextType{
    user : User | null
    login : (email : string, password : string)=>Promise<void>;
    loadingLogin : boolean;
    signUp : (firstName : string, lastName : string,email : string, password1 : string, password2 : string) => Promise<void>;
    loadingSignUp : boolean;
    signOut : ()=>Promise<void>
    loadingSignOut : boolean;
    errorMsg :string | null;

}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {

    const [user, setUser] = useState<User | null>(()=>{
        const saved = localStorage.getItem('user');

        return saved ? JSON.parse(saved) : null
    });

    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
    const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);
    const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);

    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])

    const login = async(email : string, password : string) => {

        try{

            setLoadingLogin(true)
            const res = await fetch('http://localhost:5000/api/v1/auth/login', {
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
            const res = await fetch("http://localhost:5000/api/v1/auth/sign-up", {
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
            const res = await fetch("http://localhost:5000/api/v1/auth/signOut", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials :"include"
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


    return <AuthContext.Provider value={{
        user,
            login,
    loadingLogin,
    signUp,
    loadingSignUp ,
    signOut ,
    loadingSignOut,
    errorMsg ,
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