//==========PORT===========//
    process.env.PORT = process.env.PORT || 3000;         
//=========================//


//==========DB connection =====//
module.exports.connectionData = process.env.connectionData || {
    user: 'postgres',
    host: 'localhost',
    database: 'ntet',
    password: 'mysecretpass',
    port: 5432,
};
//==========================//

//=========SEED FOR HASH FUNCTIONS ====//
    process.env.SEED = process.env.SEED || 'mysecretpass';
