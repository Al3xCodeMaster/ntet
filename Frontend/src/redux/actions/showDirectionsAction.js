export const type = 'showDirectionsAction';


const showDirectionsAction = (flag,res,toDelete) => {
    
    if(flag){
        return( 
        {
            type,
            payload: {
                flag,
                res,
                toDelete
                     }
        }); 
    }else{
        return {
            type,
            payload: {
                flag,
                res: {},
                toDelete: []    
            }    
        }    
    }
};

export default showDirectionsAction;