import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import useUser from './hooks/useUser'
import RouterLogged from './RouterLogged';
import Login from './routes/Login';
import Registro from './routes/Registro';
import RouterUnlogged from './RouterUnlogged';

const router = createBrowserRouter([
    {
        path:'/registro',
        element: <RouterUnlogged><Registro /></RouterUnlogged>
    },
    {
        path:'/login',
        element: <RouterUnlogged><Login /></RouterUnlogged>
    },
    {
        path:'/',
        element: <Navigate to="/home"/>
    },
    {
        path:'/home',
        element: <Home />
    },
    {
        path:'/',
        element: <RouterLogged />,
        children: [
            
        ]
    }
]);


export default function Router({children}) {

    const { isLogged } = useUser();

    if(isLogged == null) return <div>Loading...</div>
    return (
        <RouterProvider router={router}>{children}</RouterProvider>
    )
}