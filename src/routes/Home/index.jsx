import { useState, useEffect } from 'react'
import Menu from "../../components/Menu";
import styled from "styled-components";
import axios from 'axios';
import useUser from '../../hooks/useUser';
import { Modal, Button, message, notification } from "antd";

import './index.css'

export default function Home() {

    const { getToken, getSocket, getUserData, isLogged } = useUser()
    const [getLetras, setLetras] = useState([]);
    const [getBuscandoLetra, setBuscandoLetra] = useState(false);
    const [getLetra, setLetra] = useState('');
    const [isModalCreditOpen, setModalCreditOpen] = useState(false);
    const [isModalLoginOpen, setModalLoginOpen] = useState(false);
    const [isModalWinOpen, setModalWinOpen] = useState(-1);
    const [getChatMessage, setChatMessage] = useState("");
    const [getChatMessages, setChatMessages] = useState([])

    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNoti] = notification.useNotification();

    
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/juego`);
                setLetras(response.data.letras)
                setBuscandoLetra(response.data.buscando_letra)
                setLetra(response.data.letra_elegida)
            }
            catch(err) {

            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat`);
                setChatMessages(response.data)
            }
            catch(err) {}
        })()
    }, [])

    useEffect(() => {
        if(getSocket) {
            getSocket.on('union_juego', (data) => {
                console.log(data)
                setLetras(i => {
                    i[data.index].userid = data.userid;
                    i[data.index].username = data.username;
                    return [...i]
                })
            })

            getSocket.on('actualizarjuego', (data) => {
                setLetra("")
                setBuscandoLetra(false)
                setLetras(i => [...data.letras])
            })

            getSocket.on('ganador', (data) => {
                console.log("GANADORR")
                if(getLetras[data.index].userid == getUserData?.id) {
                    setModalWinOpen(data.index)
                }
                setLetras(i => {
                    i[data.index].ganador = 1;
                    return [...i]
                })
            })

            getSocket.on('comenzarjuego', (data) => {
               
            })

            getSocket.on('elegirletra', (data) => {
                setLetras(i => {
                    const index = i.findIndex(j => j.name.toLowerCase() == data.letra.toLowerCase());
                    if(index != -1) {
                        if(!i[index].marcador) {
                            i[index].marcador = 0;
                        }
                        i[index].marcador ++;
                    }
                    return [...i]
                })
                setLetra(data.letra)
                setBuscandoLetra(false)
            })

            getSocket.on('buscandoletra', () => {
                setLetra('')
                setBuscandoLetra(true)
            })

            return () => {
                getSocket.off('union_juego')
                getSocket.off('comenzarjuego')
                getSocket.off('elegirletra')
                getSocket.off('buscandoletra')
                getSocket.off('ganador')
                getSocket.off('actualizarjuego')
            }
        }
    }, [getSocket, getLetras])

    useEffect(() => {
        if(getSocket) {
            getSocket.on('chat', (data) => {
                setChatMessages(i => {
                    return [...i, data]
                })
            })
            return () => {
                getSocket.off('chat')
            }
        }
    }, [getSocket, getChatMessages])


    const clickLetra = async (index) => {
        if(isLogged == false) {
            setModalLoginOpen(true)
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/juego/jugar`, {index}, {headers:{'Authorization':`Bearer ${getToken}`}})
            api["success"]({
                message: "Compraste una letra",
                description:`Compraste la letra ${getLetras[index].name.toUpperCase()}`
            })
        }
        catch(err) {
            if(err.status == 400) {
                if(err.response.data.message == "saldo_insuficiente") {
                    setModalCreditOpen(true)
                } else if(err.response.data.message == "index_ocupado") {
                    messageApi.open({
                        type: 'error',
                        content: 'Alguien ya eligió esa letra',
                    });
                }
            }
        }
    }

    const mandarMensaje = async (e) => {
        e.preventDefault();
        const message = getChatMessage
        setChatMessage("")

        try {
            if(getChatMessage.length > 0) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat/`, {message}, {headers: {'Authorization': `Bearer ${getToken}`}});
            }

        }
        catch(err) {

        }
    }

    const changeChatMessage = text => {
        if(getChatMessage.length < 20) {
            setChatMessage(text)
        }
    }

    return (
        <Container>
            {contextHolderNoti}
            {contextHolder}
            <Menu />
            <ContainerBodyL>
                <ContainerTodo>
                    <div style={{display:'flex', justifyContent:'center', margin:'20px 0', flex:1}}><Instruccion>Presiona una letra para participar - Precio: $2.000</Instruccion></div>
                    {
                        getBuscandoLetra == true &&
                        <BuscandoLetra>
                            <span>Buscando letra...</span>
                        </BuscandoLetra>
                    }
                    {
                        getLetra != "" && 
                        <BuscandoLetra>
                            <span>Letra: {getLetra.toUpperCase()}</span>
                        </BuscandoLetra>
                    }

                    <ContainerTable>
                        {
                            getLetras.map((value, index) => <Letra ganador={value.ganador} otherSelect={value.userid != 0 && value.userid != getUserData?.id} selected={value.userid == getUserData?.id} onClick={() => clickLetra(index) } marcador={value.marcador} username={value.username} precio={value.precio} letra={value.name} key={`letra/d${index}`}/>)
                        }
                    </ContainerTable>
                </ContainerTodo>
                <ChatContainer>
                    <ChatHeader>
                        <span>Chat</span>
                    </ChatHeader>
                    <ChatMessagesContainer>
                        {getChatMessages.map((value, index) =>  <Message key={`chat-${index}`} fecha={value.fecha} message={value.message} username={value.username}/>)}
                    </ChatMessagesContainer>
                    <ChatInputContainer>
                        {
                            isLogged == true && 
                            <form onSubmit={mandarMensaje}>
                                <ChatInput name="chatmessage" placeholder="Escribe un mensaje" value={getChatMessage} onChange={(e) => changeChatMessage(e.target.value)}/>
                                <input type="submit" value="Enviar" />
                            </form>
                        }
                    </ChatInputContainer>
                </ChatContainer>
  
            </ContainerBodyL>

            <Modal title="Ganaste!" centered open={isModalWinOpen != -1} onOk={() => setModalWinOpen(-1)} onCancel={() => setModalWinOpen(-1)} footer={() => (
                <>
                    <Button type='primary' onClick={() => setModalWinOpen(-1)}>Cerrar</Button>
                </>
            )}>
                <p>¡Felicitaciones, {getUserData?.nombre}! Ganaste ${getLetras[isModalWinOpen] && getLetras[isModalWinOpen].precio.toLocaleString('es-ES')}.</p>
            </Modal>
            <Modal title="Saldo insuficiente" centered open={isModalCreditOpen} onOk={() => setModalCreditOpen(false)} onCancel={() => setModalCreditOpen(false)} footer={() => (
                <>
                    <Button onClick={() => window.location.href="/saldo"}>Cargar saldo</Button>
                    <Button type='primary' onClick={() => setModalCreditOpen(false)}>Cerrar</Button>
                </>
            )}>
                <p>No tienes suficiente saldo para comprar esa letra!</p>
            </Modal>
            <Modal title="Iniciar sesion" centered open={isModalLoginOpen} onOk={() => setModalLoginOpen(false)} onCancel={() => setModalLoginOpen(false)} footer={() => (
                <>
                    <Button onClick={() => setModalLoginOpen(false)}>Cerrar</Button>
                    <Button type='primary' onClick={() => window.location.href = '/login'}>Iniciar sesion</Button>
                </>
            )}>
                <p>Debes iniciar sesion para poder jugar!</p>
            </Modal>
        </Container>
    )
}

const Message = ({message, username, fecha}) => {

    const date = new Date(fecha)
    const fecha_string = `${date.getHours()}:${date.getMinutes()}`;
    return (
        <MessageContent>
            <MessageName>
                <MessageHora>{fecha_string}</MessageHora><span><MessageUsername>{username}</MessageUsername>:</span>
            </MessageName>
            <div>
                <span>{message}</span>
            </div>
        </MessageContent>
    )
}

const Letra = ({letra, precio, otherSelect=false, ganador = false, username, onClick = () => {}, marcador, selected = "#fff"  }) => {
    return (
        <div style={{display:'flex', justifyContent:'center'}}>

            <ContainerLetra ganador={ganador} otherSelect={otherSelect} selected={selected} onClick={onClick}>
                <div className='marcador'>
                    <MarcadorCuadrado marcador={marcador}/>
                </div>

                <div>{username}</div>
                <div>
                    <LetraValor>{letra}</LetraValor>
                </div>
                <div>
                    <span><b><span style={{fontSize:'12px'}}>Premio:</span> ${precio.toLocaleString('es-ES')}</b></span>
                </div>
            </ContainerLetra>
        </div>
    )
}
const Container = styled.div`
height:100vh;
display:flex;
flex-direction:column;
`

const ContainerTodo = styled.div`
max-height:87vh;
overflow-y:auto;
flex:1;
`

const MessageUsername = styled.span`
font-weight:800;
color:#e856d0;
font-size:14px;
`

const MessageHora = styled.span`
font-size:12px;
color:#b0b0b0;
`

const MessageName = styled.div`
display:flex;
align-items:center;
gap:4px;
`

const ChatHeader = styled.div`
display:Flex;
align-items:center;
padding:12px;
font-size:23px;
border-bottom:1px solid #e1e1e1;
`
const MessageContent = styled.div`
display:flex;
gap:5px;
`

const ChatMessagesContainer= styled.div`
overflow-y:auto;
padding:12px;
flex:1;
`

const ChatInput = styled.input`
 border-radius:18px;
        padding:8px 12px;
        width:100%;
        box-sizing:border-box;
        border:0;
        outline:0;
`

const ChatInputContainer = styled.div`
form {
    display:Flex;
    align-items:center;
    padding:4px;
    border-top:1px solid #e1e1e1;
}
`

const ContainerBodyL= styled.div`
display:flex;
flex-direction:row;
height:100vh;
`

const ChatContainer = styled.div`
width:300px;
border:1px solid #e1e1e1;
display:flex;
flex-direction:column;
background:#f2f2f2;
border-radius:10px;
height:100%;
max-height:calc(100vh - 80px);
box-sizing:border-box;
`

const BuscandoLetra = styled.div`
font-size:24px;
display:flex;
justify-content:center;
margin:20px;
`
const Instruccion = styled.span`
font-size:28px;
`

const MarcadorCuadrado = styled.div`
    width:20px;
    height:20px;
    margin:0 20px;
    border:5px solid transparent;

    ${props => props.marcador >= 1 && `border-top:5px solid #f0f018;`}
    ${props => props.marcador >= 2 && `border-left:5px solid #f0f018;`}
    ${props => props.marcador >= 3 && `border-bottom:5px solid #f0f018;`}
    ${props => props.marcador >= 4 && `border-right:5px solid #f0f018;`}
`

const LetraValor = styled.span`
font-size:52px;
font-weight:800;
text-transform:uppercase;
`

const ContainerTable = styled.div`
flex:1;
display:grid;
grid-template-columns:repeat(3, 1fr);
gap:20px;
`
const ContainerLetra = styled.div`
border:1px solid #e1e1e1;
width:180px;
height:180px;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
cursor:pointer;
background:#fff;
${props => props.selected == true && `border:1px solid green;`}
${props => props.otherSelect == true && `border:1px solid red;`}
border-radius:4px;
transition:transform 0.4s;
&:hover {
    transform:scale(1.2);
}
position:relative;

${props => props.ganador == true && `
    
background:#20ba3c;
color:#fff;    
`}
`