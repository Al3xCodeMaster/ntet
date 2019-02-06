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


class FormDriver extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.state = { text: '' }
        this.onChanged = this.onChanged.bind(this);
    }

    //Evento controlador de solo ingreso de números
    onChanged(event) {
        let textR = event.target.value;
        this.setState({
            text: textR.replace(/[^0-9]/g, '')
        });
    }


    render() {
        return (
            <header className="App-header-signDriver">
                <Container>
                    <Row>
                        <Col md={6} style={{ textAlign: 'initial' }}>
                            <span style={{ color: 'white', fontWeight: 'bold' }}></span><h1>Una App pensada en los Taxistas</h1>
                            <p>Registra un par de datos personales y contraseña</p>
                            <p>Se dueño de tu tiempo ¡No esperes mas!</p>
                            <a href="#" onClick={this.props.enventPress}>¿Ya tienes una cuenta?</a>
                        </Col>
                        <Col md={6}>
                            <Card text="info">
                                <Card.Header>Formulario de Conductor</Card.Header>

                                <Card.Body>
                                    <Form>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="FormGridName">
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control placeholder="Inserte su nombre..."></Form.Control>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="FormGridLastName">
                                                <Form.Label>Apellidos</Form.Label>
                                                <Form.Control placeholder="Inserte sus apellidos..."></Form.Control>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} controlId="FormGriCel">
                                                <Form.Label>Num cel</Form.Label>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Este sera su nuevo usuario dentro de la app</Tooltip>}>
                                                    <Form.Control onChange={this.onChanged} value={this.state.text} placeholder="Inserte numero de celular"></Form.Control>
                                                </OverlayTrigger>

                                            </Form.Group>
                                            <Form.Group as={Col} controlId="FormGridTc">
                                                <Form.Label>Tarjeta debito </Form.Label>
                                                <Form.Control type="password" placeholder="Inserte numero de tarjeta de credito"></Form.Control>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Group controlId="formGridAddress2">
                                            <Form.Label>Cedúla de ciudadania</Form.Label>
                                            <Form.Control type="password" placeholder="Ingrese su contraseña" />
                                        </Form.Group>
                                        <Form.Group controlId="formGridAddress2">
                                            <Form.Label>Contraseña</Form.Label>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Te recomendamos que crees una contraseña de al menos 8 caracteres, símbolos y números</Tooltip>}>
                                                <Form.Control type="password" placeholder="Ingrese su contraseña" />
                                            </OverlayTrigger>
                                        </Form.Group>
                                        <Button variant="outline-primary" type="submit">
                                            Iniciar
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

export default FormDriver;
