import styled from "styled-components"
import useUser from "../../hooks/useUser"
import { useState } from "react";

export default function Menu() {

    const { getUserData, setUserData, setToken, setLogged, isLogged } = useUser();
    const [isOpenMenu, setOpenMenu] = useState(false)

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userdata')
        setLogged(false)
        setToken(null)
        setUserData(null)
    }
    return (
        <Container>
            <div>DinnerRoll</div>
            <SubMenu>
                {isLogged == true && 
                <div style={{display:'flex', alignItems:'center'}}>
                    <Saldo>Saldo: ${getUserData?.saldo?.toLocaleString('es-ES')}</Saldo>
                </div>}
                {
                    isLogged == true &&
                    <UserMenu>
                        <div>{getUserData?.nombre}</div>
                        <UserIcon onClick={() => setOpenMenu(i => !i)}></UserIcon>
                        <MenuContent disabled={!isOpenMenu}>
                            <MenuOverlay onClick={() => setOpenMenu(false)}/>
                            <MenuContainer>
                                <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'20px 0'}}>
                                    <UserIcon></UserIcon>
                                    <span>{getUserData?.nombre}</span>
                                </div>
                                <div>
                                    <MenuButton onClick={() => window.location.href = "/saldo"}>Cargar crédito</MenuButton>
                                    <MenuButton onClick={() => window.location.href = "/retirar"}>Retirar crédito</MenuButton>
                                    <MenuButton onClick={() => cerrarSesion()}>Cerrar sesion</MenuButton>
                                </div>
                            </MenuContainer>
                        </MenuContent>
                    </UserMenu>
                }
                {
                    isLogged == false &&
                    <div>
                        <button onClick={() => window.location.href = '/login'}>Iniciar sesion</button>
                    </div>
                }
                {/*<div><button onClick={() => cerrarSesion() }>Cerrar sesion</button></div>*/}
            </SubMenu>
        </Container>
    )
}

const MenuContent = styled.div`
${props => props.disabled == true && `display:none;`}
z-index:1000;
`

const MenuOverlay = styled.div`
position:absolute;
background:rgba(0, 0, 0, 0.4);
left:0;
top:0;
bottom:0;
right:0;
`

const MenuButton = styled.div`
padding:10px 20px;
cursor:pointer;
margin:4px 0;

&:hover {
background:#e1e1e1;
}
`

const MenuContainer = styled.div`
color:#000;
width:240px;
background:#fff;
border-radius:4px;
border:1px solid #e1e1e1;
position:absolute;
top:80px;
right:0;
`

const UserMenu = styled.div`
display:flex;
align-items:center;
gap:10px;
`

const UserIcon = styled.div`
width:40px;
height:40px;
background:gray;
border-radius:100%;
user-select:none;
cursor:pointer;
`

const Saldo = styled.div`
padding:4px 10px;
margin:0 20px;
background:#358f3f;
border-radius:4px;
`

const SubMenu = styled.div`
display:flex;
`

const Container = styled.div`
background:#3bb349;
padding:20px;
display:flex;
justify-content:space-between;
align-items:center;
color:#fff;
`