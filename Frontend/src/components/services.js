import React, { Component } from 'react';
import '../App.css';

//importo componentes para formulario
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/*

Componente que hace parte del NavBar el cual se basa en mostrar las ventajas de la aplicación y el registro, haciendo uso
de un "ancla" para poder llevar al usuario a cada botón de registro o a la info.  

*/
class Servicios extends Component {

    render() {
        return (
            <header id="services" className="App-header-services">
                <Container>
                    <Row>
                        <Col md={12}>
                            <h2 className="text-center">VENTAJAS</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <div className="App-box-services text-center">
                                <i className="fas fa-clock fa-7x"></i>
                                <h2>Conduce</h2>
                                <p>Conduce cuando quieras</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="App-box-services text-center">
                                <i className="far fa-money-bill-alt fa-7x"></i>
                                <h2>Genera ganancias</h2>
                                <p>Consigue más viajes</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="App-box-services text-center">
                                <i className="fas fa-file-invoice-dollar fa-7x"></i>
                                <h2>Una sola factura</h2>
                                <p>Conozca sus ingresos detalladamente</p>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="App-box-services text-center">
                                <i className="fas fa-shield-alt fa-7x"></i>
                                <h2>Conduce seguro</h2>
                                <p>Transporta solo a usuarios registrados</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </header >
        );
    }
}
export default Servicios;