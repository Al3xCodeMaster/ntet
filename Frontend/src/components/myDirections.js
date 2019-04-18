import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import showDirectionsAction from '../redux/actions/showDirectionsAction'
import Table from 'react-bootstrap/Table'
import axios from 'axios';


/* 

COmponente que se encarga de desplegar las direcciones favoritas del usuario, esta hace uso del
store de Redux.

*/

class MyDirections extends React.Component {

  // Inicialización del state y funciones

  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.eliminarDirs = this.eliminarDirs.bind(this);
    this.state = {
      info: [],
      dirEliminadas: 0,
      errors: false
    };
  }

    // Función que se encarga de eliminar las direcciones seleccionadas (traidas desde el store de Redux), 
    // esta operación se hace de forma sincrona (se resuelven todas las promesas). 
    async eliminarDirs(){
    const {showDirection,logged} = this.props;
    const storage = JSON.parse(localStorage.getItem('userInfo'));
    for(let i=0;i<showDirection.toDelete.length;i++){
    await axios.delete('http://localhost:8080/profile/deleteDirFav',{data:{
        num: logged.user.usuario.num_cel_u,
        nombre: showDirection.toDelete[i] 
      },headers: {Authorization: storage.token}})
      .then((res) => {
        this.setState({
          dirEliminadas: this.state.dirEliminadas + 1
        })  
      })
      .catch((err) => {
        this.setState({
          errors: true
        })
      })
    }

    if(this.state.errors){
      alert("Se ha presentado un error borrando alguna dirección, intente de nuevo");
      return
    }

    alert(`Se han eliminado: ${this.state.dirEliminadas} direcciones. `);
    this.handleClose();
  }


  //lifecycle React: Se llama para cuando ha terminado la función asincrona (callback) que resuelve los nombres de direcciones.
  componentWillReceiveProps(nextProps){
    const {showDirection} = nextProps;
    //Se resuelven el array de promesas para luego enviar la info y desplegarla.
    Promise.all(showDirection.data).then((valores)=>{ 
      this.setState({
        info: valores
      });
    })   
  }  

  // función que se encarga de llamar al action de Redux que oculta el componente actual. 
  handleClose() {
    const {showDirectionsAction} = this.props;
    showDirectionsAction(false,[],[]);    
  }


  render() {
    const {showDirection} = this.props; 
    return (
        <>
        <Modal
          size="lg"
          show={showDirection.show}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Direcciones favoritas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Table responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Dirección favorita</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.info}  
                </tbody>
              </Table>
              <Button variant="danger" onClick={this.eliminarDirs}><i className="fas fa-trash fa-3x"></i>Eliminar</Button>
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

    // conexión con el store de Redux
    const mapStateToProps = state => ({
        logged: state.authenticated,
        showDirection: state.showDirection
    });
    
    // actions disponibles de Redux
    const mapDispatchToProps = {
        showDirectionsAction
    };


    
export default connect(mapStateToProps,mapDispatchToProps)(MyDirections);