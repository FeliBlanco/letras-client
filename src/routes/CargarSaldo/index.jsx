import Menu from "../../components/Menu";
import { Card, Flex, Select, Form, Button } from 'antd'
import {
    initMercadoPago,
    Wallet
  } from '@mercadopago/sdk-react';

import axios from 'axios';
import useUser from "../../hooks/useUser";
import { useState } from "react";

initMercadoPago('TEST-856733f1-daeb-4b8f-9160-62ffd339028c', { locale: 'es-AR' });

export default function CargarSaldo() {

    const { getUserData, getToken } = useUser();

    const [getSaldo, setSaldo] = useState(1000);
    const [getPreference, setPreference] = useState(null)

    const createPreference = async () => {
        alert("a")
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/create_preference`, {
                saldo: getSaldo
            }, {
                headers: {
                    'Authorization': `Bearer ${getToken}`
                }
            });
            setPreference(response.data.preference)
        }
        catch(err) {

        }
    }
    return (
        <div>
            <Menu />
            <Flex align="center" justify="center">
                <Card title="Cargar saldo">
                    {
                        getPreference == null &&
                        <Form layout="vertical" onFinish={() => createPreference()}>
                            <Form.Item label="Cantidad">
                                <Select defaultValue={2000} value={getSaldo} onChange={(e) => {setSaldo(e)}}>
                                    <Select.Option value={2000}>2000</Select.Option>
                                    <Select.Option value={4000}>4000</Select.Option>
                                    <Select.Option value={6000}>6000</Select.Option>
                                    <Select.Option value={8000}>8000</Select.Option>
                                    <Select.Option value={10000}>10000</Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit">Siguiente</Button>
                        </Form>
                    }
                    {getPreference != null && <Wallet  initialization={{redirectMode:'modal', preferenceId: getPreference}}/>}
                    
                </Card>
            </Flex>
        </div>
    )
}