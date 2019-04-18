import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'

//importo componentes para la barra de navegación
import Navbar from 'react-bootstrap/Navbar'
import Brand from 'react-bootstrap/NavbarBrand'
import Nav from 'react-bootstrap/Nav'
import Link from 'react-bootstrap/NavLink'
import LoginForm from './loginForm'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { connect } from 'react-redux'
import loginForm from '../redux/actions/loginForm'
import isLogOut from '../redux/actions/isLogOut'
import showDirectionsAction from '../redux/actions/showDirectionsAction'
import showInfoAction from '../redux/actions/showInfoAction'
import showCarInfo from '../redux/actions/showCarInfo'
import Form from 'react-bootstrap/Form'
import { withRouter } from 'react-router-dom'

/* 

Componente que contiene la barra de navegación, donde se puede encontrar las ventas, links a registro y el botón de log/out. 
Este componente no desaparece de la pantalla, puesto que es el componente que se encuentra fuera de la navegación de React Router.
*/

class NavbarBlack extends Component {

    // Inicialización de funciones.
    constructor(props){
        super(props);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.showDirForm = this.showDirForm.bind(this);
        this.searchDir = this.searchDir.bind(this);
        this.showcarInfo = this.showcarInfo.bind(this);
        this.handler = this.handler.bind(this);
    }

    // Función que se encarga del evento de click (event: onClick) en el cual se selecciona las direcciones a borrar y se le pasan 
    // como un push al estado del store de redux.    
    handler(e){
        const {dirsInfo} = this.props;
        if(e.target.checked){
            dirsInfo.toDelete.push(e.target.name);
        }else{
            let index = dirsInfo.toDelete.findIndex((element) => {
                return element === e.target.name
            });
            if(index !== -1){
                dirsInfo.toDelete.splice(index,1);
            }    
        }
    }

    //Función que se encarga de llamar al action de Redux encargado de mostrar el registro del taxi.
    showcarInfo(){
        const {showCarInfo} = this.props;
        showCarInfo(true);
    }

    // Función que recibe ln (coord JSON) , lat (coord JSON) y realiza una petición al servidor mediante un get request a la API de Nominatin (OpenStreetMaps)
    // para obtener los nombres. 
    searchDir(ln,lat){
        return axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${ln}`, {
        }).then((res) => {
          return res.data.display_name; 
        }).catch((err) => {
          console.log(err);
        });    
    }
    
    // Función que se encarga de hacer una petición get al servidor para obtener la información de las direcciones y desplegar una tabla de cada dirección favorita del user.
    async showDirForm(){
        let dirs = [];
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showDirectionsAction,logged} = this.props;
        axios.get(`http://localhost:8080/profile/dirfav/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                 dirs = res.data.map(async (value,index) => {
                    const name = await this.searchDir(value.coords_gps_u.x,value.coords_gps_u.y);
                    return(<tr key={index}>
                    <td>
                          <Form.Check
                            custom
                            inline
                            label=""
                            type={'checkbox'}
                            id={`custom-checkbox_${index}`}
                            name={value.nombre_dir}
                            onClick={(e) => this.handler(e)}
                          />
                    </td>
                    <td>{value.nombre_dir}</td>
                    <td>{name}</td>
                    </tr>)                  
                 });
                    showDirectionsAction(true, dirs,[]); 
                }).catch((err) => {
                    return showDirectionsAction(true,[],[]);
                });

    }

    // Función que realiza una petición get al servidor solicitando la información del usuario para luego usar
    // la action de Redux y mostrar el componente que despliega la info del usuario o taxista.
    showInfo(){
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showInfoAction,logged} = this.props;
        if(logged.user.usuario){
            axios.get(`http://localhost:8080/profile/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                    const respuesta = {
                        ...res.data,
                        role: storage.usuario.role    
                    };
                    showInfoAction(true,respuesta);    
                }).catch((err) => {
                    showInfoAction(false,{});
                });    
        }else{
            axios.get(`http://localhost:8080/taxista/${logged.user.taxista.idTaxista}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                    const respuesta = {
                        ...res.data,
                        role: storage.taxista.role    
                    };
                    showInfoAction(true,respuesta);    
                }).catch((err) => {
                    showInfoAction(false,{});
                });    
        }  
    }

    // Función que abre el formulario de login por medio del llamado al actions de Redux encargado del estado del componente. 
    openForm(){
        const { loginForm } = this.props;
        loginForm(true);
    }

    // Función que cierra el formulario de login por medio del llamado al actions de Redux encargado del estado del componente. 
    closeForm(){
        const {loginForm} = this.props;
        loginForm(false);    
    }

    // Función que llama al action de Redux encargado de eliminar la info grabada en el localstorage y "purga" el storage de la sesión anterior.
    // Luego usando el WithRouter redirige a la pagina principal. 
    logOut(){
        const {isLogOut} = this.props;
        isLogOut();
        this.props.history.push('/');     
    }

    render() {
        const {logged} = this.props;
        console.log(logged);
        return (
            <Navbar className= "App-NavbarBlack" fixed="top" variant="dark">
            <Container>
                <Brand href="/">NoThatEasyTaxi</Brand>
                {logged.loggedIn ? <Nav className="mr-auto">
                <DropdownButton drop={'down'} variant="warning" title={logged.user.usuario?`${logged.user.usuario.nombre} ${logged.user.usuario.apellido}`:`${logged.user.taxista.nombre} ${logged.user.taxista.apellido}`} id="desplegable" key="down">
                <DropdownItem eventKey="1" onClick={this.showInfo} active={false}>Perfil</DropdownItem>{logged.user.usuario? <DropdownItem eventKey="2" onClick={this.showDirForm} active={false}>Modificar/Eliminar Direcciones Favoritas</DropdownItem>:<DropdownItem eventKey="3" onClick={this.showcarInfo} active={false}>Agregar Vehículo</DropdownItem>}</DropdownButton>
                </Nav>: <Nav className="mr-auto">
                    <Link href="/#services">Ventajas</Link>
                    <Link href="/#registro">Registro</Link>
                    </Nav>}
                {logged.loggedIn ? 
                <Button variant="dark" onClick={this.logOut}>Log out</Button> : 
                <Button variant="primary" onClick={this.openForm}>Iniciar sesión</Button>}
                <LoginForm showlog={this.props.showlog} closeLog={this.closeForm}></LoginForm>
            </Container>
            </Navbar>
        );
    }


}



// Conexion con el store de Redux
const mapStateToProps = state => ({
    ...state,
    logged: state.authenticated,
    showlog: state.activarLogin,
    dirsInfo: state.showDirection
});

// Actions disponibles para modificar el store de Redux
const mapDispatchToProps = {
    isLogOut,
    loginForm,
    showInfoAction,
    showDirectionsAction,
    showCarInfo
};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavbarBlack));