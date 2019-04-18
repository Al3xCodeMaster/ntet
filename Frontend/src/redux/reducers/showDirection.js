import {type as showDirectionsAction} from '../actions/showDirectionsAction'
const defaultState = {show: false, data: [],toDelete: []};

//Reducer que muestra el componente que despliega la información sobre las direcciones favoritas del usuario. 
// asi como tambien ayuda a actualizar las direcciónes a borrar, por lo que se guarda un arreglo con los nombres
// de direcciones a borrar.


function reducer(state = defaultState, {type, payload}){
    switch(type){
        case showDirectionsAction:
        
        if(payload.flag){
            
            return({
                show:true,
                data: payload.res,
                toDelete: payload.toDelete
            });
        }
        
        return {
            show:false,
            data: [],
            toDelete: []
        }

        default: 
            return state;
    }    
}

export default reducer;