import { createStore, combineReducers} from 'redux'
//Importación de los reducers:
import activarLogin from './reducers/activarLogin'
import authenticated from './reducers/authenticated'
import showInfo from './reducers/showInfo'
import showDirection from './reducers/showDirection'
import desdeDir from './reducers/desdeDir'
import hastaDir from './reducers/hastaDir'
import initialStateViajes from './reducers/initialStateViajes'
import activarCarInfo from './reducers/activarCarInfo'


/* 

Redux: Un objeto que guarda un estado global de la aplicación, este estado solo se puede cambiar por una acción es decir
de solo lectura, luego se tiene que los reducers determinan el comportamiento de las acctiones sobre el Store de Redux. 

*/

//Función que toma todos los reducers y los combina en uno solo. 
const reducer = combineReducers({
    activarLogin,
    authenticated,
    showInfo,
    showDirection,
    desdeDir,
    hastaDir,
    initialStateViajes,
    activarCarInfo
});

//Objeto STORE de Redux
const store = createStore(reducer);

export default store;