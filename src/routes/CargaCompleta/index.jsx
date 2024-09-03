import { useLocation } from "react-router-dom";
import Menu from "../../components/Menu";
import axios from "axios";
import useUser from "../../hooks/useUser";
import { useEffect } from "react";

export default function CargaCompleta() {
    const { getToken } = useUser()

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const payment_id = queryParams.get('payment_id');

    useEffect(() => {
        (async () => {
            console.log(payment_id)
            if(payment_id) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/compra_completa`, {
                        payment_id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${getToken}`
                        }
                    })
                    alert("BIEN")
                    console.log(response.data);
                }
                catch(err) {
                    alert("ERROR")
                }
            }
        })()
    }, [payment_id])

    return (
        <div>
            <Menu/>
        </div>
    )
}