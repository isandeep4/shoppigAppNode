const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
});

module.exports = User