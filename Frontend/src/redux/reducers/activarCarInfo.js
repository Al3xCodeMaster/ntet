import {type as showCarInfo} from '../actions/showCarInfo'
const defaultState = false;

// Reducer que ayuda a la aplicación a mostrar el componente que despliega el formulario para registrar un taxi
// este recibe un payload que viene de una action que es boolean, el cual dice si mostrar o no el componente.


function reducer(state = defaultState, {type, payload}){
    switch(type){
        case showCarInfo:
        if(!payload){
            return false;    
        }
        
        return payload;

        default: 
            return false;
    }   
}

export default reducer;