import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ProfileUser from '../components/profileUser'
import ProfileDriver from '../components/profileDriver'

/* 

Se importan los componentes de ProfileUser y ProfileDriver, los cuales representan los componentes de
cada respectiva ruta del React Router, luego dependiendo del login que haga el usuario, haciendo uso de 
el store de Redux se escoge uno u otro. 

*/


class Profile extends Component {

  
  //Lifecycle REACT: Se revisa las propiedades del componente (cuando se reciben) y se determina la autenticación, de no estarlo, se redirige a "/"
  componentWillReceiveProps(nextProps){
    const {authenticated} = nextProps;
    if(!authenticated.loggedIn){
      return this.props.history.push('/');  
    }    
  }

  //Lifecycle REACT: Se llama antes de montar el componente y se revisa la autenticación. 
  componentWillMount(){
    const {authenticated} = this.props;
    if(!authenticated.loggedIn){
      return this.props.history.push('/');  
    }  
  }


  render() {
    const {authenticated} = this.props;
      return customProfile(authenticated.user)
    }
}

//Función que toma como parametro el role (string) y devuelve un componente de tipo ProfileUser o ProfileDriver.
const customProfile = (role) => {
  if(role){
    if(role.usuario){
      return(<ProfileUser></ProfileUser>);
    }
      return(<ProfileDriver></ProfileDriver>);
  }else{
    return <h3>NOTHING TO SHOW</h3>
  }
};

//Arrow Func que devuelve el estado de REDUX. 
const mapStateToProps = state => ({
    ...state,
    authenticated: state.authenticated
});

//Enrutador de React router para redirigir entre cada pagina y connect de Redux para conectar con el store.
export default withRouter(connect(mapStateToProps)(Profile));