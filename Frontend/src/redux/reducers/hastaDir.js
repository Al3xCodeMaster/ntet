import {type as updateHasta} from '../actions/updateHasta'
const defaultState = {dirHasta: {}};

// Reducer que colabora con la conexión entre el componente que maneja la dirección "hasta" que pone
// el usuario para viajar, por lo que se recibe unas coordenadas.

function reducer(state = defaultState, {type, payload}){

    switch(type){
        case updateHasta:
        
        if(!payload){
            return state;
        }

        return {
            dirHasta: payload.dirHasta
        }

        default: 
            return state;
    }    
}

export default reducer;