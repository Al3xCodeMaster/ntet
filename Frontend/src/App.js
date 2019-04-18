import React, { Component } from 'react';
import './App.css';
import Routes from './router'
/* Componente principal desde donde arranca la app

Se importa el componente Routes que contiene el enrutador de React Router DOM,
como tambien los estilos .css a partir de ./App.css que se usara en todos los demas components. 
*/ 

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes></Routes> 
      </div>
    );
  }
}

export default App;
