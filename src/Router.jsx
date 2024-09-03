import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import useUser from './hooks/useUser'
import RouterLogged from './RouterLogged';
import Login from './routes/Login';
import Registro from './routes/Registro';
import RouterUnlogged from './RouterUnlogged';
import CargarSaldo from './routes/CargarSaldo';
import CargaCompleta from './routes/CargaCompleta';
import Retirar from './routes/Retirar';

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
            {
                path:'/saldo',
                element: <CargarSaldo />
            },
            {
                path:'/cargacompleta',
                element: <CargaCompleta />
            },
            {
                path:'/retirar',
                element: <Retirar />
            }
        ]
    },
    {
        path:'*',
        element: <Navigate to="/home"/>
    }
]);


export default function Router({children}) {

    const { isLogged } = useUser();

    if(isLogged == null) return <div>Loading...</div>
    return (
        <RouterProvider router={router}>{children}</RouterProvider>
    )
}