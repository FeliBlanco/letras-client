import { Button, Form, Input, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

import './index.css'
import useUser from '../../hooks/useUser';

export default function Login() {

    const { setToken, setUserData } = useUser()

    const onFinish = async (values) => {

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email: values.email,
                password: values.password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userdata', JSON.stringify(response.data.userdata));
            setUserData(response.data.userdata)
            setToken(response.data.token)
        }
        catch(err) {
            if(err.status == 400) {
                const { message } =  err.response.data;
                if(message == "incorrect_password") {
                    alert("Contraseña incorrecta")
                }
            }
        }
        console.log('Success:', values);
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
                <Form.Item
                name="email"
                rules={[{ required: true, message: 'Ingresa tu correo' }]}
                >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo" />
                </Form.Item>
                <Form.Item
                name="password"
                rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
                >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Contrasena"
                />
                </Form.Item>
                <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Recordar contrasena</Checkbox>
                </Form.Item>
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">Ingresar</Button>
                </Form.Item>
                <a href="/registro">Crear cuenta</a>
            </Form>
            </Card>
        </div>
    )
}