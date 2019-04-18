import React, { Component } from 'react';
import '../App.css';
// Importaciones de la libreria de Leaflet
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

import Select from 'react-select';
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import FormGetTaxi from './FormGetTaxi'
import { connect } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Form from 'react-bootstrap/Form'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import updateDesde from '../redux/actions/updateDesde'
import updateHasta from '../redux/actions/updateHasta'


//Modificaciones al MAPA para poder que adquiera el estilo deseado. 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

/* 

Componente que contiene toda la funcionalidad del mapa del usuario, el cual contiene una barra de direcciones para buscar,
se anida otro componente que es el de pedirCarrera que contiene "desde" y "hasta" .

*/


class Mapa extends Component {
  // inicialización de state,funciones y geolocation. 
  constructor(props) {
    super()
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 13,
      selectedOption: null,
      options: [],
      info: [],
      name: ''
    }
    this.changePosition = this.changePosition.bind(this);
    this.showPosition = this.showPosition.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.addOrigen = this.addOrigen.bind(this);
    this.addDestino = this.addDestino.bind(this);
    this.onChanged = this.onChanged.bind(this);
    navigator.geolocation.getCurrentPosition(this.showPosition);
  }

  // Captura el evento (event: onChange) que captura el cambio de la caja de texto correspondiente a el nombre de la dir favorita
  onChanged(e){
    this.setState({
      name: e.target.value
    });  
  }  

  // Captura el evento (event: submit) el cual se encarga de guardar las direcciones haciendo un post al servidor. 
   submitForm(e){
    e.preventDefault();
    const {logged} = this.props;
    axios.post('http://localhost:8080/profile/dirfav',{
      cel: logged.user.usuario.num_cel_u,
      nombre: this.state.name,
      coords: `(${this.state.lng},${this.state.lat})`
    }).then(res => {
      alert("Dirección guardada con éxito")
    }).catch(err => {
      let message = "Se ha producido el siguiente error: "+err.response.data;
      alert(message);
    });
  }

  // Función que se encarga de simular el buscador de Google maps o la adición de Geocoder anidado al mapa,
  // en vez de esto se captura el texto a partir de un evento en una caja de tipo "Select" la cual se actualiza
  // mediante esta función al hacer peticiones a la API de nominatin de OpenStreetMap cada vez que se presiona una tecla. 
  inputChange(text) {
    axios.get(`http://nominatim.openstreetmap.org/search?format=json&limit=4&q=${text}`, {
    }).then((res) => {
      let info = [];
      let showText = [];
      res.data.forEach((element, index) => {
        info.push(element);
        showText.push({label: element.display_name, value: index});
      });
      this.setState({ options: showText, info: info });
    }).catch((err) => {
      console.log(err);
    });

  }

  // Función que se encarga de mover el marquer en el mapa cuando el usuario a presionado enter para buscar la dirección.
  // recibe entonces las coordenadas (JSON) para mover el marquer al punto especificado.
  handleChange = (selectedOptionAux) => {
    const { latitude, longitude } = { latitude: this.state.info[selectedOptionAux.value].lat, longitude: this.state.info[selectedOptionAux.value].lon }
    this.setState({
      lat: latitude,
      lng: longitude,
      zoom: 13,
      selectedOption: selectedOptionAux
    });
  }

  // Callback que recibe las coordenadas (JSON) suministrada por el navegador.
  showPosition(positionCallBack) {
    this.setState({
      lat: positionCallBack.coords.latitude,
      lng: positionCallBack.coords.longitude,
      zoom: 13
    });
  }
 
  // Llama el action de Redux el cual se encarga de llenar el campo "desde" del componente pedirCarrera
  addOrigen() {
    const {updateDesde} = this.props;
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.state.lat}&lon=${this.state.lng}`, {
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

  // Llama el action de Redux el cual se encarga de llenar el campo "hasta" del componente pedirCarrera
  addDestino() {
    const {updateHasta} = this.props;
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.state.lat}&lon=${this.state.lng}`, {
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

  // Se encarga de recibir el evento (event: onClick) que se da sobre el mapa haciendo que el marquer se mueva.
  changePosition(e) {
    this.setState({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      zoom: this.map.leafletElement.getZoom()
    });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const {origen, destino} = this.props;
    return (
      <Container className="map-container">
        <Row>
          <Col md={8}>
            <LeafletMap ref={(ref) => this.map = ref} onclick={this.changePosition} style={{ height: "400px", width: "710px" }} center={position} zoom={this.state.zoom}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              />

              <Marker position={position}>
                <Popup>
                  <div>
                    <p> ¿Desea poner el marcador en esta dirección? <br /> Presione los botones para seleccionar el origen y destino</p>
                    <button className="btn btn-primary" onClick={this.addOrigen}>Desde</button>
                    <button className="btn btn-primary" onClick={this.addDestino}>Hasta</button>
                    <OverlayTrigger trigger="click" placement="right" overlay={<Popover id="popover-basic" title="Nombre del lugar que desea agregar como favorito">
                                                                                <Form onSubmit={(e) => this.submitForm(e)}>
                                                                                <Form.Group controlId="formGroupDirFav">
                                                                                  <Form.Label> Digite por favor el nombre del lugar</Form.Label>
                                                                                  <Form.Control type="text" placeholder="Cualquier nombre..." onChange={this.onChanged}/>
                                                                                </Form.Group>
                                                                                <Button variant="outline-primary" type="submit">
                                                                                  Guardar
                                                                                </Button>   
                                                                                </Form>                                          
                                                                                </Popover>}>
                    <button className="btn btn-success"> Agregar a favoritos</button>
                    </OverlayTrigger>
                  </div>
                </Popup>
              </Marker>
            </LeafletMap>
          </Col>

          <Col md={4}>
            <FormGetTaxi dirOrigen={origen.dirOrigen} dirDestino={destino.dirHasta}></FormGetTaxi>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.options}
              placeholder="Buscar dirección..."
              onInputChange={this.inputChange}
              filterOption={false}
            />
          </Col>
        </Row>
      </Container>);
  }
}
    
// Actions disnponibles de Redux
const mapDispatchToProps = {
  updateHasta,
  updateDesde 
};

// Conexión con Redux
const mapStateToProps = state => ({
  logged: state.authenticated,
  origen: state.desdeDir,
  destino: state.hastaDir
});

export default connect(mapStateToProps,mapDispatchToProps)(Mapa);