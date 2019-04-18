import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import showCarInfo from '../redux/actions/showCarInfo'
import Col from 'react-bootstrap/Col'
import axios from 'axios';

/* 

Componente que se encarga del registro de un taxi a la app. 

*/

class CarInfo extends React.Component {
    
    // Inicialización de state y funciones
    constructor(props){
        super(props);
        let dt = new Date();
        this.handleClose = this.handleClose.bind(this);
        this.onChanged = this.onChanged.bind(this);
        this.state = {
          placa:'',
          baul:'',
          soat:'',
          modelo:'',
          marca:'',
          year: dt.getFullYear()
        }
    }

    // Función que se encarga del evento (event: onChange) y recibe un role (string) que captura los valores de las cajas de texto
    onChanged(e,role){
      const value = e.target.value; 
      switch(role){
        case 'placa':
          this.setState({
            placa:value
          });
          break;
        case 'baul':
          this.setState({
            baul:value
          });
          break;
        case 'soat':
          this.setState({
            soat:value
          });
          break;
        case 'modelo':
          this.setState({
            modelo:value
          });
          break;
        case 'marca':
          this.setState({
            marca:value
          });
          break;
        case 'year':
          this.setState({
            year: value
          });
          break;
        default:
          break;  
      }
    }

    // Haciendo uso de una action de Redux, cierra el componente. 
    handleClose(){
        const {showCarInfo} = this.props;
        showCarInfo(false);
    }

    // Captura el evento de submit (event: submit) el cual ejecuta una petición post al servidor para crear un taxi 
    submitForm(e){
      e.preventDefault();
      axios.post('http://localhost:8080/taxista/registrarTaxi',{
        placa: this.state.placa,
        baul: this.state.baul,
        soat: this.state.soat,
        modelo: this.state.modelo,
        marca: this.state.marca,
        year: this.state.year
      })
      .then((res) => {
        alert(res.data.message)
      })
      .catch((err) => {
        alert(err.response.data);
      });     
    }


    render() {
        const {showCarForm} = this.props;
        return (
            <>
            <Modal
              size="lg"
              show={showCarForm}
              onHide={this.handleClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Agregar Taxi</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={(e) => this.submitForm(e)}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formPlaca">
                        <Form.Label>Placa</Form.Label>
                        <Form.Control placeholder="Digíte la placa..." onChange={event => this.onChanged(event, 'placa')} value={this.state.placa}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formBaul">
                        <Form.Label>Baúl</Form.Label>
                        <Form.Control as="select" onChange={event => this.onChanged(event, 'baul')} value={this.state.baul}>
                            <option>Grande</option>
                            <option>Mediano</option>
                            <option>Pequeño</option>
                        </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Group controlId="formSoat">
                    <Form.Label>SOAT</Form.Label>
                    <Form.Control placeholder="Digite el SOAT ..." onChange={event => this.onChanged(event, 'soat')} value={this.state.soat}/>
                    </Form.Group>

                    <Form.Group controlId="formModelo">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control placeholder="Digite el Modelo..." onChange={event => this.onChanged(event, 'modelo')} value={this.state.modelo}/>
                    </Form.Group>      
                    <Form.Row>
                        <Form.Group as={Col} controlId="formMarca">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control placeholder="Digite la Marca..." onChange={event => this.onChanged(event, 'marca')} value={this.state.marca}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAnho">
                        <Form.Label>Año</Form.Label>
                        <Form.Control type="number" min={1900} step={1} onChange={event => this.onChanged(event, 'year')} value={this.state.year}></Form.Control>
                        </Form.Group>            
                    </Form.Row>    
                <Button variant="primary" type="submit">Agregar</Button>
                </Form>
              </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Salir</Button>
                </Modal.Footer>
            </Modal>
          </>
            );
          }
        }
        
        // Conexión con el state de Redux
        const mapStateToProps = state => ({
            showCarForm: state.activarCarInfo
        });
        
        // Actions disponible de Redux
        const mapDispatchToProps = {
            showCarInfo
        };
    
    
        
    export default connect(mapStateToProps,mapDispatchToProps)(CarInfo);