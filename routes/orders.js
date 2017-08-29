const db = require('../db/conn.js');
const { Order } = db.models;
const app = require('express').Router();

module.exports = app;

console.log("on Router!")

app.put('/:id', (req, res, next)=> {
  if (!req.body.address) return res.render('index', { error: "Must have address" });
  Order.updateFromRequestBody(req.params.id, req.body)
    .then( () => res.redirect('/'))
    .catch(next);
});

app.post('lineItems/:id', (req, res, next) => {
  console.log('here!!!')
  Order.addProductToCart(req.params.Id*1)
    .then( ()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then( ()=> res.redirect('/'))
    .catch(next);
});