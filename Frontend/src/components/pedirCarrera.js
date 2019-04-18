import React, { Component } from 'react'
import '../App.css';
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Calificacion from './calificacion'
import initialStateViajes from '../redux/actions/initialStateViajes'

/* 

Componente que contiene todo lo relacionado a las cajas de texto de la interfaz que contienen las direcciones de "hasta" y "desde"
como tambien tiene toda la funcionalidad de pedir un taxi hasta terminar una carrera. 

*/
class PedirCarrera extends React.Component {

  // Se inicializan el state y las funciones. 
  constructor(props, context) {
    super(props, context);
    this.confirmar = this.confirmar.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.terminar = this.terminar.bind(this);
    this.state = {
      nombreCompleto:'',
      numeroCelTaxista:'',
      placa:'',
      marcaModelo:'',
      numeroDeViajes:'',
      puntaje:''
    };
  }

  // Función que oculta el componente encargado de la carrera.
  handleClose(){
    const {initialStateViajes} = this.props;
        initialStateViajes({sePidio: false, seConfirmo: false, calificar:false});
  }

  // Función que se ejecuta como callback de setInterval, la cual se encarga de hacerle una petición POST al server
  // preguntando si se ha terminado la carrera (es decir, si el taxista ha llegado al destino). 
  // Esta función despliega el costo de la carrera como tambien activa la calificación. 
  terminar(){
    const {logged,initialStateViajes} = this.props;
    axios.post('http://localhost:8080/profile/notificarCarreraTerminada',{
      num: logged.user.usuario.num_cel_u 
    })
    .then((res) => {
      clearInterval(this.interval);
      alert(`${res.data.message} \n Costo: ${res.data.costo}`);
      initialStateViajes({
        sePidio: true, seConfirmo: true, calificar:true    
      });  
    })
    .catch((err) => {
      console.log(err.response);
    });   
  }

  // Función que se jecuta como callback en el setInterval preguntando al server con una Post request,
  // si ya el taxista ha confirmado la carrera. Hace un update al estado poniendo la confirmación como "true".
  confirmar(){
    const {logged,initialStateViajes} = this.props;
    axios.post('http://localhost:8080/profile/confirmarCarrera',{
        num: logged.user.usuario.num_cel_u
    })
    .then((res) => {
        clearInterval(this.interval);
        initialStateViajes({
          sePidio: true, seConfirmo: true, calificar:false    
        });
        this.setState({
          nombreCompleto:res.data.vistaDeTaxista.nombreCompleto,
          numeroCelTaxista:res.data.vistaDeTaxista.numeroCelTaxista,
          placa:res.data.vistaDeTaxista.placa,
          marcaModelo:res.data.vistaDeTaxista.marcaModelo,
          numeroDeViajes:res.data.vistaDeTaxista.numeroDeViajes,
          puntaje:res.data.vistaDeTaxista.puntaje
        })
    })
    .catch((err) => {
      console.log(err.response);
    })      
  }

  // lifecycle React: Se llama antes de montar el componente para poder obtener el estado de la aplicación, si se encuentra en alguna etapa de carrera.
  componentWillMount(){ 
      const {initialStateViajes,logged} = this.props;
      const storage = JSON.parse(localStorage.getItem('userInfo'));
      axios.get(`http://localhost:8080/profile/revisarEstado/${logged.user.usuario.num_cel_u}`,{
        headers: {
                Authorization: storage.token
        }})
        .then((res) => {
            const estado = res.data.estado;
            switch(estado){
                case 'calificando':
                    initialStateViajes({
                        sePidio: true, seConfirmo: true, calificar: true    
                    });
                    break;
                case 'solicitando':
                    initialStateViajes({
                        sePidio: true, seConfirmo: false, calificar:false    
                    });
                    break;
                case 'carrera':
                    this.setState({
                      nombreCompleto:res.data.vistaDeTaxista.nombreCompleto,
                      numeroCelTaxista:res.data.vistaDeTaxista.numeroCelTaxista,
                      placa:res.data.vistaDeTaxista.placa,
                      marcaModelo:res.data.vistaDeTaxista.marcaModelo,
                      numeroDeViajes:res.data.vistaDeTaxista.numeroDeViajes,
                      puntaje:res.data.vistaDeTaxista.puntaje
                    });
                    initialStateViajes({
                      sePidio: true, seConfirmo: true, calificar:false    
                    });
                    break;
                default: 
                    initialStateViajes({});
            }
        })
        .catch((err) => {
            initialStateViajes({});
        });
  }

  //lifecycle React: Se ejecuta cuando se le pasan propiedades al componente, con estas se ejecutan los callback confirmar o terminar cada 3 segundos. 
  componentWillReceiveProps(nextProps){
    
    if(nextProps.globalState.payload.sePidio && !(nextProps.globalState.payload.seConfirmo)){
        this.interval = setInterval(this.confirmar,3000);
    }
    if(nextProps.globalState.payload.seConfirmo && !(nextProps.globalState.payload.calificar)){
      this.interval = setInterval(this.terminar,3000);
    }       
  }

  // Se cancela la suscripción a algun callback de setInterval. 
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {globalState,logged} = this.props;
    return (
        <>
        
        <Modal
          size="lg"
          show={globalState.payload.sePidio}
          onHide={this.handleClose}
          backdrop="static"
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{globalState.payload.calificar?"Carrera Terminada: Por favor califique el servicio prestado por el taxista":globalState.payload.seConfirmo?"Carrera en curso":"Pedir Carrera"}</Modal.Title>
          </Modal.Header>
          {globalState.payload.calificar?<Modal.Body><Calificacion numCel={logged.user.usuario.num_cel_u} handleClose={this.handleClose}></Calificacion></Modal.Body>:
          <Modal.Body>
          {globalState.payload.seConfirmo?<Container>
                                                                                          <Row>
                                                                                            <Col sm>Nombre completo: </Col>
                                                                                            <Col sm>{this.state.nombreCompleto}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Numero Cel Taxista: </Col>
                                                                                            <Col sm>{this.state.numeroCelTaxista}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Placa: </Col>
                                                                                            <Col sm>{this.state.placa}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Marca modelo: </Col>
                                                                                            <Col sm>{this.state.marcaModelo}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Numero de viajes realizados</Col>
                                                                                            <Col sm>{this.state.numeroDeViajes}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>puntaje</Col>
                                                                                            <Col sm>{this.state.puntaje}</Col>
                                                                                          </Row>
                                                                                        </Container>:<h3>ESPERANDO CONFIRMACIÓN DEL TAXISTA....</h3>}
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
          </Modal.Body>}
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
      </>
        );
      }
    }

    // Conecta las acciones que se pueden ejecutar para cambiar el estado del store de Redux
    const mapDispatchToProps = {
        initialStateViajes //función que controla el estado de la aplicación en alguna etapa de carrera.
    };

    //conexion al store de redux 
    const mapStateToProps = state => ({
        logged: state.authenticated,
        globalState: state.initialStateViajes
    });
    
    
export default connect(mapStateToProps,mapDispatchToProps)(PedirCarrera);