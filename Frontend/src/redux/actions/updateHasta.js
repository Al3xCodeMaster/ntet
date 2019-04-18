export const type = 'updateHasta';


const updateHasta = (dirHasta) => {
    
    return {type, payload: {
            dirHasta
        }
    };
};

export default updateHasta;