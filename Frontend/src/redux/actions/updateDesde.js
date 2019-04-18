export const type = 'updateDesde';

const updateDesde = (dirOrigen) => {
    
    return {type, payload: {
            dirOrigen
        }
    };
};

export default updateDesde;