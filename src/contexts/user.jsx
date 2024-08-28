import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const UserContext = createContext(null)

export default function UserProvider({children}) {

    const [getUserData, setUserData] = useState(null);
    const [isLogged, setLogged] = useState(null);
    const [getToken, setToken] = useState(null);
    const [getSocket, setSocket] = useState(null)


    useEffect(() => {
   
        if(isLogged != null) {

            if(!getSocket) {
                let query = {}
                if(getUserData) {
                    query.userid = getUserData.id;
                }
                const socket = io(`ws://${import.meta.env.VITE_SOCKET_URL}`, {query})
                socket.on('actualizardata', (data) => {
                    try {
                        setUserData(i => {
                            return {...i, ...data}
                        })
                        localStorage.setItem('userdata', JSON.stringify(getUserData))
                    }
                    catch(err){}
                })
                setSocket(socket);
            }
        }
    }, [getUserData, getSocket, isLogged])


    useEffect(() => {
        (async () => {
            try {
                const token_storage = await localStorage.getItem('token');
                if(token_storage) {
                    const user_data_storage = await localStorage.getItem('userdata');
                    if(user_data_storage) {
                        try {
                            const user_data = JSON.parse(user_data_storage)
                            setUserData(user_data)
                            setLogged(true)
                        }
                        catch(err) {
                            
                        }
                    }
                    setToken(token_storage)
                } else {
                    setLogged(false)
                }
            }
            catch(err) {
                console.log(err)
            }
        })()
    }, [])


    useEffect(() => {
        (async () => {
            if(getToken) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/data`, { headers: { 'Authorization': `Bearer ${getToken}`}});
                    localStorage.setItem('userdata', JSON.stringify(response.data))
                    setLogged(true)
                    setUserData(response.data)
                }
                catch(err) {

                }
            }
        })()
    }, [getToken]);

    return (
        <UserContext.Provider value={{getUserData, setUserData, isLogged, setToken, setLogged, getToken, getSocket}}>{children}</UserContext.Provider>
    )
}