const express = require('express');
const server = express();
const parser = require('body-parser');
const Sequelize = require('sequelize');
const Item = require('./Schema/sequelize');
const Purchased = require('./Schema/purchased_items');
const chalk = require('chalk');

server.use(parser.urlencoded({
  extended: false,
}));

//    ---   |||   ---   |||   ---   \\


//    Show all items in the db    \\
server.get('/vender/showAll', function(req, res) {
  Item.findAll()
  .then(function(available) {
    res.send(available)
    console.log(chalk.red('it worked!'))
  })
});


//    Udate stock in vending machine    \\
server.put('/vender/update_stock/:update_via_id', function(req, res) {
  Item.update({
    description: req.body.description,
    cost: parseInt(req.body.cost),
    quantity: parseInt(req.body.quantity),
  }, {
    where: {
    id: req.params.update_via_id,
  }
  })
  .then(function() {
    console.log(chalk.yellow('update worked!'));
    res.redirect('/vender/showAll')
  })
});


//    Create an new item in vending machine   \\
server.post('/vender/create_item', function (req, res) {
  Item.create({
    description: req.body.description,
    cost: parseInt(req.body.cost),
    quantity: parseInt(req.body.quantity),
  }).then(function () {
    res.send();
    console.log(chalk.magenta('it worked!'));
  }).catch(function () {
    res.send('status 500')
  })
});


//    Purchase an item from the vending machine   \\
server.post('/vender/buy_it/:item_id', function(req, res) {
  Item.find({
    where: {id: req.params.item_id}
  })
  .then(function(item) {
    if (req.body.paid >= item.cost && item.quantity !== 0) {
      item.update({
        quantity: item.quantity - 1,
      }, {
        where: {
          id:req.params.item_id,
        }
      });
      Purchased.create({
        cost: item.cost,
      })
      .then(function(justGot) {
        justGot.setItem(item)
        })
      .then(function() {
      console.log(chalk.bgYellow('item purchased!'))
      res.redirect('/vender/showAll')
  })}
  else if (req.body.paid >= item.cost && item.quantity === 0) {
    res.send('we are sorry, that item is all sold out.');
  }
  else {
    res.send('that is not enough, give us more monies...');
  }
})
});


//    View purchased items
server.get('/vender/allPurchases', function(req, res) {
  Purchased.findAll()
  .then(function(purchases) {
    res.send(purchases)
  })
});


//    View total sales value
server.get('/vender/total_sales', function(req, res) {
  Purchased.findAll()
  .then(function(totalSales) {
    let total = 0;
    for (let i = 0; i < totalSales.length; i++) {
      total += totalSales[i].cost
    }
    res.json(total)
  })
});




server.listen(3000);
