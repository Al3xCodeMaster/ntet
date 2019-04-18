import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import isAuthenticated from "../redux/actions/isAuthenticated";
import axios from 'axios'

/* 

Componente que se encarga del despliegue del formulario de inicio de sesión usando el store de Redux .

*/

class LoginForm extends React.Component {

    // Inicialización del state y funciones.
    constructor(props, context) {
      super(props, context);
      this.log = this.log.bind(this);
      this.onChanged = this.onChanged.bind(this);
      this.close = this.close.bind(this);
      this.changeRole = this.changeRole.bind(this);
      this.state = {
        numText:'',
        passText:'',
        result: '',
        notSucess: false,
        role: 'Usuario'  
      }
    }

    // Recibe un role (string, se recide desde un llamado desde un evento de click sobre un botón) el cual cambia el state del componente,
    // para poder desplegarle al usuario el formulario correspondiente a User o a Taxista.
    changeRole(role){
      switch(role){
        case 'Usuario':
          this.setState({
            role: 'Taxista'
          });
          break;
        case 'Taxista':
        this.setState({
          role: 'Usuario'
        });
        break;
        default:
          this.setState({
            ...this.state
          });    
      }
        
    }

    // Función que captura event (event: onChange) y un name (string) el cual , dependiendo de name,
    // captura todo lo correspondiente a su input.
    onChanged(event,name) {
        const textR = event.target.value
        switch(name){
            case 'numCel':
                return( 
                    this.setState({
                        numText: textR.replace(/[^0-9]/g, '')}))
            case 'pass':
                return(
                    this.setState({
                        passText: textR
                    })
                )
            default: 
              break;                        
        }
      }


    // Función que se llama al presionar en el botón de login, esta hace una petición post de login al server 
    // el cual devuelve la info del usuario que posteriormente es guardada en el store de Redux para dar un estado global
    // a la aplicación. 
    log(){
      
      if(this.state.role === 'Usuario'){
        axios.post('http://localhost:8080/login/user',
      {
          num: this.state.numText,
          pass: this.state.passText
      }).then(res => {
          const {
            isAuthenticated,
            history, 
          } = this.props;
          isAuthenticated(res.data);
          history.push('/profile');
      }).catch((error) => {
          this.setState({
            numText:'',
            passText:'',
            result: '',
            notSucess: true 
          });
      })

      this.setState({
        numText: '',
        passText: ''
      });  
      }else{
        axios.post('http://localhost:8080/login/driver',
      {
          id_taxista: this.state.numText,
          pass: this.state.passText
      }).then(res => {
          const {
            isAuthenticated,
            history, 
          } = this.props;
          isAuthenticated(res.data);
          history.push('/profile');
      }).catch((error) => {
          this.setState({
            numText:'',
            passText:'',
            result: '',
            notSucess: true 
          });
      })

      this.setState({
        numText: '',
        passText: ''
      });  
      }
      
    }

    // Cierra el formulario de login posteriormente cuando se ha realizado una acción o si se ha pinchado en cerrar.
    close(){
      this.setState({
        numText:'',
        passText:'',
        result: '',
        notSucess: false  
      });
      this.props.closeLog();  
    }

    render() {
      return (
        <>
          <Modal show={this.props.showlog} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{`Bienvenido: ${this.state.role}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {this.state.notSucess ? <Alert dismissible variant="danger">
                    <Alert.Heading>Error al iniciar sesión, contraseña o usuario incorrecto</Alert.Heading>
            </Alert>: <></>}  
            <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{this.state.role === 'Usuario'?"Num de celular":"ID"}</Form.Label>
                        <Form.Control placeholder={this.state.role === 'Usuario'?"Digite su num celular":"Digite su ID"} onChange={event => this.onChanged(event,'numCel')} value={this.state.numText}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Digite la contraseña" onChange={event => this.onChanged(event,'pass')} value={this.state.passText}/>
                    </Form.Group>
                    </Form>
            </Modal.Body>
            <Modal.Footer>
            {this.state.role === 'Usuario'?<Button variant="primary" onClick={(e) => this.changeRole(this.state.role)}>
                Taxista
              </Button>:<Button variant="primary" onClick={(e) => this.changeRole(this.state.role)}>
                Usuario
              </Button>}
              <Button variant="secondary" onClick={this.close}>
                Salir
              </Button>
              <Button variant="primary" onClick={this.log}>
                Iniciar sesión
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }

  // Conexión con Redux
  const mapStateToProps = state => ({
      ...state
  });

  // Actions disponibles de Redux
  const mapDispatchToProps = {
    isAuthenticated
  };

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(LoginForm));