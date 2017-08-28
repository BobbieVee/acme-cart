const db = require('../db/conn.js');
const expect = require('chai').expect;
const { Product, LineItem, Order} = db.models;

describe('Database', (done) => {
	before(()=> {
		return db.seed()
		.catch(done);
	});
	describe('Products', () => {
		it("3 should exist", function(){
			return Product.findAll()
			.then(products => {
				expect(products.length).to.equal(3);
			})
			.catch(done);
		});
	});

	describe('Orders', () => {
		it('should have the correct address', () => {
			return Order.findAll()
			.then(orders => {
				expect(orders[0].address).to.equal('Nashville, TN');
			})
			.catch(done);
		});
	});

	describe('LineItems', function(){
		it('Should have correct productId, orderId and quantity', () => {
			return LineItem.findById(1)
			.then(lineItem => {
				expect(lineItem.orderId).to.equal(1);
				expect(lineItem.productId).to.equal(1);				
			})
			.catch(done);
		});
	});




});	
