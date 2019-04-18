import {type as initialStateViajes} from '../actions/initialStateViajes'
const defaultState = {sePidio: false, seConfirmo: false, calificar:false};

// Reducer que ayuda a determinar el estado de un "viaje" en el usuario, esto con el fin de determinar
// el estado que se tenia cuando se cerro el navegador o se recargo la pagina, para asi no perder el estado que se tenia.

function reducer(state = defaultState, {type, payload}){

    switch(type){
        case initialStateViajes:
        
        if(!payload){
            return {
                payload: state
            };
        }

        return {
            payload
        }

        default: 
            return {
                payload: state
            };
    }    
}

export default reducer;