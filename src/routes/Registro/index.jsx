import { Button, Form, Input, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import axios from 'axios';

import './index.css'
import useUser from '../../hooks/useUser';

export default function Registro() {

    const { setToken } = useUser()

    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user`, {
                name: values.nombre,
                email: values.email,
                password: values.password
            })
            localStorage.setItem('token', response.data.token)
            setToken(response.data.token)
            console.log("TOKEN: ", response.data.token)
        }
        catch(err) {
            console.log(err)
        }
    };


    return (
        <div className='login-container'>
            <Card>

                <Form
                name="login_form"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item name="nombre" rules={[{ required: true, message: 'Ingresa tu nombre!', min:2, max:30 }]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Ingresa tu correo!', type:'email', max:120 }]}>
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Correo" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Ingresa una contraseña', min:3, max:40 }]}>
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Contraseña" />
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">Registrarse</Button>
                </Form.Item>
            </Form>
            </Card>
        </div>
    )
}