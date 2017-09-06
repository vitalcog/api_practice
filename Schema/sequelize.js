const chalk = require('chalk');
const Sequelize = require('sequelize');

const db = new Sequelize('api_practice', 'chadwindham', '', {
  dialect: 'postgres',
});


const Item = db.define('item', {
  description: Sequelize.STRING,
  cost: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER,
});

Item.sync().then(function() {
  console.log(chalk.cyan('great success!'))
});

module.exports = Item;
