const Sequelize = require('sequelize');

const sequelize = new Sequelize('mydb', 'root', 'Sandy12345', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
