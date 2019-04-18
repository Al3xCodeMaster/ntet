import React, { Component } from 'react';

//importo componentes para formulario
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import axios from "axios";
import { connect } from 'react-redux';
import loginForm from '../redux/actions/loginForm'
import Modal from 'react-bootstrap/Modal'

/*

Componente que se encarga de desplegar el formulario correspondiente al conductor de taxi

*/

class FormDriver extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.state = {
            nombreText:'',
            apellidoText:'',
            celText:'',
            cuentaText:'',
            cedulaText:'',
            passText:'',
            result: '',
            sucess: false
        };
        this.onChanged = this.onChanged.bind(this);
        this.smShow = this.smShow.bind(this);
        this.smClose = this.smClose.bind(this);
        this.openForm = this.openForm.bind(this);
    }

    // Función que ejecuta una action de Redux el cual se encarga de desplegar el formulario de login
    openForm(){
        const { loginForm } = this.props;
        loginForm(true);
    }

    // Encargado de mostrar un aviso de confirmación
    smShow(){
        this.setState({
            smShow:true
        })
    }

    // Encargado de cerrar un aviso de confirmación
    smClose(){
        this.setState({
            smShow:false
        });
        if(this.state.sucess){
            this.openForm();    
        }
    }

    //Evento controlador de solo ingreso de números y de capturas los eventos de cada caja de texto
    onChanged(event, name) {
        let textR = event.target.value;
        switch (name) {
            case 'nombre':
                return (
                    this.setState({
                        nombreText: textR
                    })
                );
            case 'apellido':
                return (
                    this.setState({
                        apellidoText: textR
                    })
                );
            case 'numCel':
                return (
                    this.setState({
                        celText: textR.replace(/[^0-9]/g, '')
                    })
                );
            case 'cuenta':
                return (
                    this.setState({
                        cuentaText: textR.replace(/[^0-9]/g, '')
                    })
                );
            case 'cedula':
                return (
                    this.setState({
                        cedulaText: textR.replace(/[^0-9]/g, '')
                    })
                );
            case 'pass':
                return (
                    this.setState({
                        passText: textR
                    })
                );

            default: 
             break;    

        }
    }

    // Función que captura un evento (event: submit) con el cual se registra un conductor de taxi, esto mediante
    // una petición post al servidor. 
    submitForm(e){
        e.preventDefault();
        axios.post('http://localhost:8080/signin/driver',
            {
                id_taxista: this.state.cedulaText,
                nombre_t: this.state.nombreText,
                apellido_t: this.state.apellidoText,
                num_cel_t: this.state.celText,
                password_t: this.state.passText,
                num_cuenta: this.state.cuentaText
            }).then(res => {
                this.setState({
                    smShow: false,
                    numText: '',
                    nameText: '',
                    lastNameText: '',
                    creditText: '',
                    passText: '',
                    result: res.data.message,
                    sucess: true
                });
                this.smShow();
        }).catch((error) => {
            this.setState({
                smShow: false,
                numText: '',
                nameText: '',
                lastNameText: '',
                creditText: '',
                passText: '',
                result: `Ha sucedido un error al momento de crear la cuenta \n ${error.response.data}`,
                sucess: false
            });
        });
        this.setState({
            nombreText: '',
            apellidoText: '',
            celText: '',
            cuentaText: '',
            cedulaText: '',
            passText: ''
        });
    };


    render() {
        return (
            <header className="App-header-signDriver">
            <Modal
                    size="sm"
                    show={this.state.smShow}
                    onHide={this.smClose}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-sm">
                            Aviso
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body> {this.state.result} </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.smClose}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Container>
                    <Row>
                        <Col md={6} style={{textAlign: 'initial'}}>
                            <span style={{color: 'white', fontWeight: 'bold'}}></span><h1>Una App pensada en los
                            Taxistas</h1>
                            <p>Registra un par de datos personales y contraseña</p>
                            <p>Se dueño de tu tiempo ¡No esperes mas!</p>
                            <a href="#" onClick={this.props.enventPress}>¿Ya tienes una cuenta?</a>
                        </Col>
                        <Col md={6}>
                            <Card text="info">
                                <Card.Header>Formulario de Conductor</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={(e) => this.submitForm(e)}>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="FormGridName">
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control placeholder="Inserte su nombre..."
                                                              onChange={event => this.onChanged(event, 'nombre')}
                                                              value={this.state.nombreText}/>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="FormGridLastName">
                                                <Form.Label>Apellidos</Form.Label>
                                                <Form.Control placeholder="Inserte sus apellidos..."
                                                              onChange={event => this.onChanged(event, 'apellido')}
                                                              value={this.state.apellidoText}/>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="FormGriCel">
                                                <Form.Label>Num cel</Form.Label>
                                                <Form.Control placeholder="Inserte numero de celular"
                                                              onChange={event => this.onChanged(event, 'numCel')}
                                                              value={this.state.celText}/>

                                            </Form.Group>
                                            <Form.Group as={Col} controlId="FormGridTc">
                                                <Form.Label>Número de cuenta bancaria </Form.Label>
                                                <Form.Control type="password"
                                                              placeholder="Inserte numero de cuenta"
                                                              onChange={event => this.onChanged(event, 'cuenta')}
                                                              value={this.state.cuentaText}/>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Group controlId="formGridAddress2">
                                            <Form.Label>Cedúla de ciudadania</Form.Label>
                                            <OverlayTrigger
                                                overlay={<Tooltip id="tooltip-disabled">Este sera su nuevo usuario
                                                    dentro de la app</Tooltip>}>
                                                <Form.Control placeholder="Ingrese su identificación"
                                                              onChange={event => this.onChanged(event, 'cedula')}
                                                              value={this.state.cedulaText}/>
                                            </OverlayTrigger>
                                        </Form.Group>
                                        <Form.Group controlId="formGridAddress2">
                                            <Form.Label>Contraseña</Form.Label>
                                            <OverlayTrigger
                                                overlay={<Tooltip id="tooltip-disabled">Te recomendamos que crees una
                                                    contraseña de al menos 8 caracteres, símbolos y números</Tooltip>}>
                                                <Form.Control type="password"
                                                              placeholder="Ingrese su contraseña"
                                                              onChange={event => this.onChanged(event, 'pass')}
                                                              value={this.state.passText}/>
                                            </OverlayTrigger>
                                        </Form.Group>
                                        <Button variant="outline-primary" type="submit">
                                            Crear cuenta
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </header>
        );
    }
}

// Actions disponibles de Redux
const mapDispatchToProps = {
    loginForm
};

// Conexión con el store de Redux
const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps, mapDispatchToProps)(FormDriver);
