import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Welcome from './routes/welcome'
import Signin from './routes/signin'
import NavbarBlack from './components/navbarBlack'
import Profile from './routes/profile'
import { Provider } from 'react-redux'
import store from './redux/store'
/* 

Se importa el react router DOM que contiene los objetos Switch, Route y Router, luego se
hacen las rutas con el path url de "/" como pagina principal, /profile como la pagina que renderiza tanto a user como taxista
mas las respectivas paginas de registro y por último una pagina de error por si ningúna de las rutas existe en algún path. 
En este punto se implementa el Store de REDUX con el cual se permite que la aplicación tenga un estado global de aplicación.

Se pasan los componentes NavBar, Profile, Signin y Welcome, todos hacen parte de lo que renderiza el Router, asi pues 
la pagina se puede definir como una SPA pero con unas modificaciones que la hacen parecer tener un comportamiento "estatico". 

*/

class Routes extends Component {

    render(){
        return(
          <Provider store={store}>
            <Router>
                <div className="App-Router">
                <NavbarBlack/>
                  <Switch className="App-Switch">
                    <Route path="/" exact={true} component={Welcome} />
                    <Route path="/signin/user" exact={true} render={(props) => <Signin role="Usuario"/>}/>
                    <Route path="/signin/driver" exact={true} render={(props) => <Signin role="Conductor"/>}/>
                    <Route path="/profile" exact={true} component = {Profile}/>
                    <Route component={NoMatch} />
                  </Switch>
                </div>
            </Router>
          </Provider>
        );
    }
}

//Función que toma el path que se le paso a Route y devuelve una caja con un texto h3 con un mensaje de que no se encuentra.
function NoMatch({ location }) {
    return (
      <div>
        <h3>
          No se encuentra la ruta <code>{location.pathname}</code>
        </h3>
      </div>
    );
}


export default Routes;