import React, { Component } from 'react'
import '../App.css'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
// Importo componentes
import Carrera from './carrera'
import MyInfo from './myInfo'
import CarInfo from './carInfo'

/* 

Componente que toma el React Router sobre el perfil del conductor, este a su vez otros componentes que juntos forman el perfil del conductor.

*/

class profileDriver extends Component {

    //Constructor para inicializar el estado y funciones.
    constructor(props) {
        super(props);
        this.state = {
            estado: "ACTIVAR",
            color: "boton-redondo",
            enServicio: false,
            enCarrera: false,
            onConfirm: false,
            userInfo: undefined
        }
        this.activarTaxi = this.activarTaxi.bind(this);
        this.service = this.service.bind(this);
        this.start = this.start.bind(this);
        this.buscarCarrera = this.buscarCarrera.bind(this);
        this.confirmarCarrera = this.confirmarCarrera.bind(this);
        this.terminarCarrera = this.terminarCarrera.bind(this);
        this.promiseTerminarCarrera = this.promiseTerminarCarrera.bind(this);
    }


    // Función que usa la localización del usuario tomada desde la opción del navegador, devuelve un callback promiseTerminarCarrera
    terminarCarrera(){
        navigator.geolocation.getCurrentPosition(this.promiseTerminarCarrera);
    }

    // Callback que recibe los argumentos (JSON) del navegador y se hace una petición al servidor notificando
    // que ya se ha terminado la carrera por medio de una post request. 
    promiseTerminarCarrera(callbackArg){
        const {logged} = this.props; // Estado de autenticación . 
        axios.post('http://localhost:8080/taxista/terminarCarrera',{
            id_taxista: logged.user.taxista.idTaxista,
            coordsF:`(${callbackArg.coords.longitude},${callbackArg.coords.latitude})`
        })
        .then((res) => {
            alert(`${res.data.message} \n \n Ganancia de la carrera: ${res.data.costo}`);
            this.setState({
                enCarrera: false,
                onConfirm: false,
                userInfo: {}
            })
        })
        .catch((err) => {
            this.setState({
                enCarrera: false,
                onConfirm: false,
                userInfo: {}
            })
        })   
    }

    //Función que confirma la carrera, enviando la petición post request al servidor. 
    confirmarCarrera(){
        const {logged} = this.props;
        axios.post('http://localhost:8080/taxista/confirmarServicio',{
            id_taxista: logged.user.taxista.idTaxista    
        })
        .then((res) => {
            alert("La carrera ha comenzado");
            this.setState({
                onConfirm: true,
                enCarrera:true
            })
        })
        .catch((err) => {
            let message = err.response.data.message;
            message? alert(message): alert("Fatal error: 505 internal server error")
        });        
    }

    //Función que se ejecuta como callback del setInterval que se ejecuta para verificar cada tanto de tiempo si hay
    // disponible una carrera para tomarla. Esto se hace por medio de un post request. 
    buscarCarrera(){
        const {logged} = this.props;
        const storage = JSON.parse(localStorage.getItem('userInfo')); // Se obtiene el objeto firmado en el localstorage
        axios.post('http://localhost:8080/taxista/buscarServicio',{
            id_taxista: logged.user.taxista.idTaxista
        },{
            headers: {
                    Authorization: storage.token
        }})
        .then((res) => {
            clearInterval(this.interval);
            this.setState({
                onConfirm: true,
                userInfo: res.data.vistaDeUsuario
            }); 
        })
        .catch((err) => {  
            console.log(err.response);
        });
    }

    //lifecyle React: Revisa el estado de la app para saber si ejecuta buscarCarrera. 
    componentDidUpdate(){
        if(this.state.enServicio && !(this.state.enCarrera) && !(this.state.onConfirm)){
            this.interval = setInterval(this.buscarCarrera,3000);    
        }
    }

    //lifecyle React: Revisa el estado de la app para saber si ejecuta buscarCarrera. 
    componentDidMount(){
        if(this.state.enServicio && !(this.state.enCarrera) && !(this.state.onConfirm)){
            this.interval = setInterval(this.buscarCarrera,3000);    
        }
    }

    // Limpia las subscripción al callback de setInterval.  
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    
    //lifecyle React: Se obtiene el estado de la aplicación para saber si el usuario estaba en alguna de las etapas de una carrera,
    // esto se hace por medio de una GET request. 
    componentWillMount(){ 
        const {logged} = this.props;
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        axios.get(`http://localhost:8080/taxista/revisarEstadoTaxista/${logged.user.taxista.idTaxista}`,{
          headers: {
                  Authorization: storage.token
          }})
          .then((res) => {
              const estado = res.data.estado;
              switch(estado){
                  case 'buscando':
                      this.setState({
                          enCarrera: false,
                          onConfirm: false,
                          enServicio: true,
                          estado: "DESACTIVAR",
                          color: "boton-redondo-gris"
                      });
                      break;
                  case 'carrera':
                      this.setState({
                          userInfo: res.data.vistaDeUsuario,
                          enCarrera: true,
                          onConfirm:true,
                          enServicio: true,
                          estado: "DESACTIVAR",
                          color: "boton-redondo-gris"
                      })
                      break;
                  default:
                      this.setState({
                          enCarrera:false,
                          enServicio:false,
                          onConfirm: false,
                          estado: "ACTIVAR",
                          color: "boton-redondo"
                      })
              }
          })
          .catch((err) => {
             this.setState({
                enCarrera:false,
                enServicio:false,
                onConfirm: false,
                estado: "ACTIVAR",
                color: "boton-redondo"
             })
          });
    }

    //Callback que es llamado cuando se le solicita al usuario su posición recibiendo un callaback (JSON) para ponerse disponible para una carrera.
    // esto mediante una post request.
    start(callbackArg){
        const {logged} = this.props;
        const placaValue = window.prompt("Digite el numero de la placa",''); // Se le pregunta la placa al user
        axios.post('http://localhost:8080/taxista/comenzarServicio',{
            id_taxista:logged.user.taxista.idTaxista,
            coordsTaxista:`(${callbackArg.coords.longitude},${callbackArg.coords.latitude})`,
            placa: placaValue
        })
        .then((res) => {
            alert(res.data.message);
            this.setState({
                enServicio: true,
                estado: "DESACTIVAR",
                color: "boton-redondo-gris"
            });
        })
        .catch((err) => {
            alert(err.response.message);
        });
    }

    //Función que toma un flag (boolean) y llama a una función que llama al callback start pasandole como parametros las coordenadas
    // que da el navegador o sino se termina el servicio notificandole al servidor por medio de una PUT request.
    service(flag){
        if(flag){
            navigator.geolocation.getCurrentPosition(this.start,(err) => {
                alert("Usted no activo la localización, no se puede prestar servicio. ");
            });    
        }else{
            const {logged} = this.props; 
            axios.put('http://localhost:8080/taxista/terminarServicio',{
                id_taxista:logged.user.taxista.idTaxista
            })
            .then((res) => {
                clearInterval(this.interval);
                alert(res.data.message);
                this.setState({
                    enServicio: true,
                    estado: "ACTIVAR",
                    color: "boton-redondo"
                });
            })
            .catch((err) => {
                clearInterval(this.interval);
                alert(err.response.message);
                this.setState({
                    enServicio: true,
                    estado: "ACTIVAR",
                    color: "boton-redondo"
                });
            });   
        }
    }

    // Función que activa el estado del taxista poniendo el botón de la interfaz en su respectivo color. 
    // revisa el estado del botón para saber localmente si esta en servicio (localmente en el sentido de que no se le pregunta al Backend durante este paso). 
    activarTaxi() {
        if (this.state.estado === "ACTIVAR") {
            this.service(true);
        } else {
            this.service(false);
        }

    }
    render() {
        return (
            <div className="usuario_open">
                
                    <MyInfo></MyInfo>
                    <CarInfo></CarInfo>
                    <Carrera userInfo={this.state.userInfo} onConfirm={this.state.onConfirm} enCarrera={this.state.enCarrera} confirmarCarrera={this.confirmarCarrera} terminarCarrera={this.terminarCarrera}></Carrera>
                    <div className="App-header-mainTaxi">
                        <Button id="btn-servicio"
                            className={this.state.color}
                            value={this.state.estado}
                            onClick={this.activarTaxi}>
                            <i className="fas fa-taxi fa-7x"></i>
                            <h2>{this.state.estado}</h2>
                        </Button>
                    </div>
            </div>

        );
    }
}

// Conexión al Store de Redux. 
const mapStateToProps = state => ({
    logged: state.authenticated
});


export default connect(mapStateToProps)(profileDriver);