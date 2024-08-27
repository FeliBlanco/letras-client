import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './routes/Home'
import useUser from './hooks/useUser'
import RouterLogged from './RouterLogged';

const router = createBrowserRouter([
    {
        path:'/',
        element: <RouterLogged />,
        children: [
            {
                path:'/home',
                element: <Home />
            }
        ]
    }
])
export default function Router({children}) {

    const { isLogged } = useUser();

    if(isLogged == null) return <div>Loading...</div>
    return (
        <RouterProvider router={router}>{children}</RouterProvider>
    )
}