import { useState, useEffect } from 'react'
import Menu from "../../components/Menu";
import styled from "styled-components";

const letras = ['a', 'b', 'c', 'd', 'e', 'f']
const precios = [18000, 20000, 18000, 19000, 18000, 19000, 19000, 18500, 18000, 18000]

export default function Home() {
    const [getLetras, setLetras] = useState([])
    
    useEffect(() => {
        setLetras(letras.map(i => ({userid:0, name: i, precio: precios[Math.floor(Math.random() * (precios.length - 1))]})))
    }, [])
    const clickLetra = (index) => {
        setLetras(i => {
            i[index].userid = 1;
            return [...i]
        })
    }
    return (
        <div>
            <Menu />
            <div>Presiona una letra para participar</div>
            <ContainerTable>
            
                {
                    getLetras.map((value, index) => <Letra selected={value.userid == 1} onClick={() => clickLetra(index) } precio={value.precio} letra={value.name} key={`letra/d${index}`}/>)
                }
            </ContainerTable>
        </div>
    )
}

const Letra = ({letra, precio, onClick = () => {}, selected = "#fff"  }) => {
    return (
        <div style={{display:'flex', justifyContent:'center'}} onClick={onClick}>

            <ContainerLetra selected={selected}>
                <div>
                    <LetraValor>{letra}</LetraValor>
                </div>
                <div>
                    <span>${precio}</span>
                </div>
            </ContainerLetra>
        </div>
    )
}

const LetraValor = styled.span`
font-size:52px;
font-weight:800;
`

const ContainerTable = styled.div`
display:grid;
grid-template-columns:repeat(3, 1fr);
gap:20px;
`
const ContainerLetra = styled.div`
border:1px solid #e1e1e1;
width:200px;
height:200px;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
cursor:pointer;
background:#fff;
${props => props.selected == true && `border:1px solid green;`}
border-radius:4px;
transition:transform 0.4s;
text-transform:uppercase;
&:hover {
    transform:scale(1.2);
}
`