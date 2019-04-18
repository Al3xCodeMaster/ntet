import {type as logIn} from '../actions/isAuthenticated'
import {type as logOut} from '../actions/isLogOut'

// Reducer que mantiene el estado de la autenticación del usuario.  

// Se obtiene el user Token guardado de forma persistente en el storage del navegador.
const user = JSON.parse(localStorage.getItem('userInfo'));

const defaultState = user? {loggedIn: true, user} : {};

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case logIn:
        if(!payload){
            return state;    
        }
        
        return {
            loggedIn: true,
            user: payload
        };

        case logOut:
            return payload;
                
        default: 
            return state;
    }    
}

export default reducer;