import React, { Component } from 'react'
import '../App.css';
import Footer from '../components/footer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
//componente: Formulario de usuario y conductor
import FormUser from '../components/formUser'
import FormDriver from '../components/FormDriver'

/* 

Se tiene el Footer, FormUser, FormDriver con los que se pretende mostrar una pantalla de registro para cada caso

*/

class Signin extends Component {

    // Se usa el constructor para definir unas funciones asi como el estado . 
    constructor(props){
        super(props);
        this.customForm = this.customForm.bind(this);
    }

    //lifycycle React: Se llama antes de montar el componente al DOM y se verifica si se encuentra autenticado. 
    componentWillMount(){
        const {authenticated} = this.props;

        if(authenticated.loggedIn){
            this.props.history.push('/profile'); //Redirección a /profile
        }
    }


    render(){
        return(
            <div className="App">
                {this.customForm(this.props.role)}
                <Footer></Footer>
            </div>
        );    
    }

    // Función que dependiendo del role (string) devuelve un componente. 
    customForm(role) {
        if (role === 'Usuario') {
            return (
                <FormUser/>
            );
        }else{
            return(
                <FormDriver/>
            );
        }
    }



}

//Conexión con el store de Redux 
const mapStateToProps = state => ({
    ...state,
    authenticated: state.authenticated
});

export default withRouter(connect(mapStateToProps)(Signin));
