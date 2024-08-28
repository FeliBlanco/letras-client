import useUser from "./hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

export default function RouterLogged() {
    const { isLogged } = useUser()

    return isLogged == false ? <Navigate to={"/login"}/> : <Outlet />
}