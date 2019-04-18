import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux'
//importo componentes
import Container from 'react-bootstrap/Container'
import MyInfo from './myInfo'
import Direcciones from './direcciones'
import Mapa from './map'
import MyDirections from './myDirections'

/*

Componente que hace parte del React Router, este contiene a su vez los demas componentes que juntos forman el profile del usuario.

*/

class profileUser extends Component {

    render() {
        return (
            <header className="usuario_open">
                <Container className="App-align-center">
                    <MyInfo></MyInfo>
                    <MyDirections></MyDirections>
                    <Mapa></Mapa>
                    </Container>
                    <Direcciones></Direcciones>
            </header>


        );
    }
}


// Conexión al store de redux 
const mapStateToProps = state => ({
    ...state
});


export default connect(mapStateToProps)(profileUser);