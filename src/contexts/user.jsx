import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null)

export default function UserProvider({children}) {

    const [getUserData, setUserData] = useState(null);
    const [isLogged, setLogged] = useState(false);
    return (
        <UserContext.Provider value={{getUserData, setUserData, isLogged}}>{children}</UserContext.Provider>
    )
}