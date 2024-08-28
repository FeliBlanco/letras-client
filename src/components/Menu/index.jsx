import styled from "styled-components"
import useUser from "../../hooks/useUser"

export default function Menu() {

    const { getUserData, setUserData, setToken, setLogged } = useUser()

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
                <div style={{display:'flex', alignItems:'center'}}>
                    <Saldo>Saldo: ${getUserData?.saldo.toLocaleString('es-ES')}</Saldo>
                </div>
                <UserMenu>
                    <div>{getUserData?.nombre}</div>
                    <UserIcon></UserIcon>
                </UserMenu>
                {/*<div><button onClick={() => cerrarSesion() }>Cerrar sesion</button></div>*/}
            </SubMenu>
        </Container>
    )
}

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