const db = require('../db/conn.js');
const { Order, Product } = db.models;
const app = require('express').Router();

module.exports = app;

app.put('/:id', (req, res, next)=> {
  if (!req.body.address) {
    Product.allData()
    .then(([products, orders, cart]) => {
      res.render('index', {products, orders, cart, error: 'Address required'})
    })
  } else {
    Order.updateFromRequestBody(req.params.id, req.body)
    .then( () => res.redirect('/'))
    .catch(next); 
  }
});

app.post('/lineItems/:id', (req, res, next) => {
  Order.addProductToCart(req.params.id*1)
    .then( ()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then( ()=> res.redirect('/'))
    .catch(next);
});