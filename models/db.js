const Sequelize = require('sequelize');

const sequelize = new Sequelize("celke", "root", "1113646473", {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(function(){
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(function(){
    console.log("Erro: Conexão não realizada!");
});

module.exports = sequelize;