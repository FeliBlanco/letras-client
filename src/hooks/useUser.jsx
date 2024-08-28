import { useContext } from "react";
import { UserContext } from "../contexts/user";

export default function useUser() {
    const { getUserData, setUserData, isLogged, setToken, setLogged, getToken, getSocket } = useContext(UserContext);

    return {
        getUserData,
        setUserData,
        isLogged,
        setToken,
        setLogged,
        getToken,
        getSocket
    }
}