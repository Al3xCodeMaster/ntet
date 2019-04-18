import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
//importo componentes para formulario
import Carousel from 'react-bootstrap/Carousel'
import { connect } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import updateDesde from '../redux/actions/updateDesde'
import updateHasta from '../redux/actions/updateHasta'

/* 

Componente que despliega las direcciones del usuario en un "slider" tipo Carousel en el cual, se selecciona la dirección
deseada escogiendola por medio de un click, este dispara un trigger en uno de los tooltips que a su vez despliegan dos botones 
"desde" y "Hasta" , los cuales permiten que se pueda pedir una carrera facilmente. 

*/

class Direcciones extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        // Por default las direcciones son un Carousel item pero con un mensaje de "no hay direcciones favoritas par mostrar" .
        this.state = {
          infoDirs: [],
          direcciones: <Carousel.Item>
          <div className="App-box-services text-center">
          <h3>No hay direcciones favoritas para mostrar</h3>
          </div>
        </Carousel.Item>  
        };
        this.getDir = this.getDir.bind(this);
        this.ponerDesde = this.ponerDesde.bind(this);
        this.ponerHasta = this.ponerHasta.bind(this);
        
    }

    //lifecycle React: Siempre se pide las direcciones antes de montar el componente
    componentWillMount(){
      this.getDir();
    }


    // Función que se encarga de poner la dirección "desde" en el componente pedirCarrera 
    ponerDesde(e){
      const {updateDesde} = this.props;
      const {lat,lng} = {lng: this.state.infoDirs[e.target.id].coords_gps_u.x,lat: this.state.infoDirs[e.target.id].coords_gps_u.y};
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        }).then((res) => {
          updateDesde({
            name: res.data.display_name,
            lat: res.data.lat,
            ln: res.data.lon  
          }); 
        }).catch((err) => {
          console.log(err);
        });
    }

    // Función que se encarga de poner la dirección "hasta" en el componente pedirCarrera 
    ponerHasta(e){
      const {updateHasta} = this.props;
      const {lat,lng} = {lng: this.state.infoDirs[e.target.id].coords_gps_u.x,lat: this.state.infoDirs[e.target.id].coords_gps_u.y};
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        }).then((res) => {
          updateHasta({
            name: res.data.display_name,
            lat: res.data.lat,
            ln: res.data.lon  
          }); 
        }).catch((err) => {
          console.log(err);
        });    
    }

    // Función que obtiene las direcciones favoritas solicitando al servidor mediante un GET, luego construye un arreglo
    // de Carousels en el cual cada uno se puede identificar de forma únivoca mediante la asignación de un "id" y una "key",
    // esto con el fin de que se puedan diferenciar uno de otro al momento de hacer click.  
    getDir(){
      let dirs = [];
      const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {logged} = this.props;
        axios.get(`http://localhost:8080/profile/dirfav/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                  dirs = res.data.map((value,index) => 
                  (<Carousel.Item key={index}>
                    <div className="App-box-services text-center">
                    <OverlayTrigger
                      trigger="hover"
                      key="right"
                      placement="right"
                      overlay={
                        <Popover
                          id="dir-popup"
                          title="Direcciones información"
                        >
                          <strong>Para mostrar mas opciones, presionar sobre el nombre de la dirección </strong>
                        </Popover>
                      }
                    >
                    <i className="fas fa-map-marker fa-7x"></i>  
                    </OverlayTrigger>
                    </div>
                      <Carousel.Caption>
                        
                        <OverlayTrigger
                      trigger="click"
                      key="top"
                      placement="top"
                      overlay={
                        <Popover
                          id="dir-on-click-popup"
                          title="Escoger una de las opciones: "
                        >  
                          <Button variant="outline-primary" onClick={this.ponerDesde} id={index}>
                          Desde   
                          </Button>
                          <Button variant="outline-primary" onClick={this.ponerHasta} id={index}>
                          Hasta   
                          </Button>     
                        </Popover>
                      }
                    >
                    <h3>{value.nombre_dir}</h3>  
                    </OverlayTrigger>
                      </Carousel.Caption>
                    </Carousel.Item>)
                  );
                  if(dirs.length !== 0){
                    this.setState({
                      infoDirs: res.data,
                      direcciones: dirs 
                    });
                  }    
                }).catch((err) => {
                    console.log(err.response);
                });  
    }

    render() {
        return (
            <Carousel wrap={false} interval={null}>
            {this.state.direcciones}
            </Carousel>
        );
    }
}

// Actions disponibles de Redux
const mapDispatchToProps = {
  updateHasta,
  updateDesde 
};

// Conexión del store de Redux 
const mapStateToProps = state => ({
    ...state,
    logged: state.authenticated 
});


export default connect(mapStateToProps,mapDispatchToProps)(Direcciones);