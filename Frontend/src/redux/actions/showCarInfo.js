export const type = 'showCarInfo';

const showCarInfo = (bool) => ({
    type,
    payload: bool 
});

export default showCarInfo;