const chalk = require('chalk');
const Sequelize = require('sequelize');
const Item = require('./sequelize');


const db = new Sequelize('api_practice', 'chadwindham', '', {
  dialect: 'postgres',
});


const Purchased = db.define('purchased', {
  cost: Sequelize.INTEGER,
});

Purchased.belongsTo(Item);

Purchased.sync().then(function() {
  console.log(chalk.red('great success!'))
});

module.exports = Purchased;
