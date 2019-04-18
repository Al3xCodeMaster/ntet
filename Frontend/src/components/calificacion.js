import React, { Component } from 'react';
import '../App.css';
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios'


/* 

Componente que se encarga de ejecutar el despliegue del formulario de calificación, el cual se basa en mostrar unas estrellas para calificar al usuario
asi pues lo que se tiene es que al momento de ser llamado, este no se finaliza sino hasya que el usuario de click en alguna estrella.

*/

class Calificacion extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.calificar = this.calificar.bind(this);
    }

    // Función que se encarga de capturar el evento de click (event: onClick) ejecutando una petición de post al servidor
    // la cual consiste en calificar al taxista, por medio de unas estrellas que se despliegan en el componente.
    // En este caso no se usa Redux, porque nuevamente el componente padre es quien tiene el control de la APP. 
    calificar(e){
        axios.post('http://localhost:8080/profile/calificarTaxista',{
            num: this.props.numCel,
            puntaje: e.target.value 
        })
        .then((res) => {
            alert(res.data.message);
            this.props.handleClose();
        })
        .catch((err) => {
            console.log(err.response);
        });
    }

    render() {
        return (
                <Form>
                    <p className="clasificacion">
                        <FormControl id="radio1" type="radio" name="estrellas" value="5" onClick={this.calificar}/>
                        <FormLabel htmlFor="radio1">&#9733;</FormLabel>
                        <FormControl id="radio2" type="radio" name="estrellas" value="4" onClick={this.calificar}/>
                        <FormLabel htmlFor="radio2">&#9733;</FormLabel>
                        <FormControl id="radio3" type="radio" name="estrellas" value="3" onClick={this.calificar}/>
                        <FormLabel htmlFor="radio3">&#9733;</FormLabel>
                        <FormControl id="radio4" type="radio" name="estrellas" value="2" onClick={this.calificar}/>
                        <FormLabel htmlFor="radio4">&#9733;</FormLabel>
                        <FormControl id="radio5" type="radio" name="estrellas" value="1" onClick={this.calificar}/>
                        <FormLabel htmlFor="radio5">&#9733;</FormLabel>
                    </p>
                    <InputGroup type="submit" value="submit" name="submit" />
                </Form>

        );
    }
}


export default Calificacion;