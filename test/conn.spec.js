const db = require('../db/conn.js');
const expect = require('chai').expect;
const chalk = require('chalk');
const { Product, LineItem, Order} = db.models;

describe('Database', (done) => {
	before(()=> {
		return db.seed()
		.then(() => console.log(chalk.green('    Test seed is done.....')))
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
				expect(orders[0].isCart).to.equal(true);
			})
			.catch(done);
		});
	});

	describe('LineItems', function(){
		it('Should have correct productId, orderId and quantity', () => {
			return LineItem.findById(1)
			.then(lineItem => {
				expect(lineItem.orderId).to.equal(1);
				expect(lineItem.productId).to.exist;				
			})
			.catch(err => console.log(err));
		});
	});

	describe(' LineItem ', () => {
		it('Adds second lineItem to cart', () => {
			return Order.addProductToCart(2)
			.then((lineItem) => {
			expect(lineItem.id).to.equal(2);
			})
			.catch(done);					
		});
	});

	describe(' LineItem ', () => {
		let lineItem;
		it('detroys new lineItem', () => {
			return Order.addProductToCart(2)
			.then((_lineItem) => {
				lineItem = _lineItem;
				return Order.destroyLineItem(null, lineItem.id)
			})
			.then(() => {
				return LineItem.findById(lineItem.id);
			})
			.then((lineItem) => {
				expect(lineItem).to.equal(null);
			})
			.catch(done);					
		});
	});
		
	describe(' LineItem ', () => {
		it('Adds third lineItem to cart', () => {
			return Order.addProductToCart(2)
			.then((lineItem) => {
			expect(lineItem.id).to.equal(4);
			})
			.catch(done);					
		});
	});

	describe('Order', () => {
		it('cart becomes an order', () => {
			return Order.updateFromRequestBody(1, {address: 'New York, NY'})
			.then(() => {
				return Order.findById(1)
			})
			.then(order => {
				expect(order.isCart).to.equal(false);
			})
			.catch(done);					
		});
	});

	describe(' LineItem ', () => {
		it('Adds new lineItem to cart. Should create new cart', () => {
			return Order.addProductToCart(2)
			.then((lineItem) => {
				expect(lineItem.id).to.equal(5);
				expect(lineItem.orderId).to.equal(2);
				return Order.findOne({where: {id: lineItem.orderId}});
			})
			.then(order => {
				expect(order.isCart).to.equal(true);
			})
			.catch(done);					
		});
	});
});	





