import React, { Component } from 'react';
import '../App.css';
import axios from 'axios'
//importo componentes para formulario
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import PedirCarrera from './pedirCarrera'
import initialStateViajes from '../redux/actions/initialStateViajes'

/* 

Componente que se encarga de mostrar la información referente a pedir una carrera: Como el "desde" y el "hasta" como el botón que 
desencadena la acción de solicitar el servicio. 

*/

class FormGetTaxi extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.pedirCarrera = this.pedirCarrera.bind(this);   
    }

    // Función que ejecuta una request POST al servidor para solicitar una carrera, se usan las coordenadas (json)
    // le han mandado desde el store de Redux (dado que estas se pueden obtener desde el mapa o desde las direcciones favoritas).
    pedirCarrera(){
        const {dirDestino,dirOrigen,logged,initialStateViajes} = this.props;
        axios.post('http://localhost:8080/profile/pedirCarrera',{
            num: logged.user.usuario.num_cel_u,
            coordsI: `(${dirOrigen.ln},${dirOrigen.lat})`,
            coordsF:`(${dirDestino.ln},${dirDestino.lat})`
        }).then((res) => {
            console.log(res.data);
            alert(res.data.message);
            initialStateViajes({
                sePidio: true, seConfirmo: false, calificar:false    
            });
        }).catch((err) => {
            alert(err.response.data.message);
        });
    }

    render() {
        const {dirOrigen,dirDestino} = this.props;
        return (
            <Row>
                <PedirCarrera></PedirCarrera>
                <Col md={12}>
                    <Form className="text-left text-white">
                        <Form.Group>
                            <Form.Label><i className="fas fa-taxi fa"></i> NotThatEasyTaxy</Form.Label>
                            <br />
                            <h3>Ordenar taxi</h3>
                        </Form.Group>

                        <Form.Group controlId="formGroupEmail">
                            <Form.Label><i className="fas fa-map-marker-alt"></i> Desde</Form.Label>
                            <Form.Control disabled={true} defaultValue={dirOrigen.name} type="text" placeholder="Seleccione origen con marcador del mapa..." />
                        </Form.Group>

                        <Form.Group controlId="formGroupEmail">
                            <Form.Label><i className="fas fa-location-arrow"></i> Hasta</Form.Label>
                            <Form.Control disabled={true} defaultValue={dirDestino.name} type="text" placeholder="Seleccione destino con marcador del mapa..." />
                        </Form.Group>
                        <Button className="btn btn-warning" onClick={this.pedirCarrera}>PEDIR AHORA</Button>
                    </Form>
                </Col>
            </Row>
        );
    }
}

// Actions disponibles de Redux
const mapDispatchToProps = {
    initialStateViajes
};

// Conexión con el store de Redux
const mapStateToProps = state => ({
    logged: state.authenticated 
});


export default connect(mapStateToProps,mapDispatchToProps)(FormGetTaxi);