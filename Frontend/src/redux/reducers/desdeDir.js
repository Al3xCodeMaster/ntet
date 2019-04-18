import {type as updateDesde} from '../actions/updateDesde'
const defaultState = {dirOrigen: {}};

// Reducer que colabora con la conexión entre el componente que maneja la dirección "desde" que pone
// el usuario para viajar, por lo que se recibe unas coordenadas.

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case updateDesde:
        if(!payload){
            return state;
        }

        return {
            dirOrigen: payload.dirOrigen
        }

        default: 
            return state;
    }    
}

export default reducer;