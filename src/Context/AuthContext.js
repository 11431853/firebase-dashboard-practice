import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";


const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (emailid, pin) => {
        return signInWithEmailAndPassword(auth, emailid, pin);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (createUser) => {
            // console.log("currentuser", createUser);
            setUser(createUser);
            // console.log("user", user)
        })
        return () => {
            unsubscribe()
        }
    },[])

    return (
        <UserContext.Provider value={{createUser, user, signIn}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext);
}