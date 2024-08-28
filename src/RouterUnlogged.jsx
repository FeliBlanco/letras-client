import useUser from "./hooks/useUser";
import { Navigate } from "react-router-dom";

export default function RouterUnlogged({children}) {
    const { isLogged } = useUser()

    return isLogged == true ? <Navigate to={"/home"}/> : children
}