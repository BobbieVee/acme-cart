const chalk = require('chalk');
const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, {logging: false});

const Product = db.define('product', {
	name: Sequelize.STRING
});

const LineItem = db.define('lineItem', {
	quantity: Sequelize.INTEGER
});

const Order = db.define('order', {
	address: Sequelize.STRING,
	isCart: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	} 
});

Order.hasMany(LineItem);
Product.hasMany(LineItem);
LineItem.belongsTo(Order);
LineItem.belongsTo(Product);


const sync = () => db.sync({force:true});

const seed = () => {
	let products;
	return sync()
	.then(() => {
		return Promise.all([
			Product.create({name: "Taylor Swift - Look What You Made Me Do"}),
			Product.create({name: "SKRILLEX - Bangarang"}),
			Product.create({name: 'Cross the Divide - The Perfect Storm'})
		]);
	})
	.then(_products => {
		products = _products;
		return Order.create({address: 'Nashville, TN'});
	})
	.then(order => {
		return Promise.all([
			Order.addProductToCart(products[0].id), 
			Order.addProductToCart(products[0].id),
			Order.addProductToCart(products[1].id)
		])
	})
	.then(() => console.log(chalk.blue('    DB seeded')));
};

Order.addProductToCart = (productId) => {
	let cart;
	return Order.findOne({where: {isCart: true}})
	.then((cart) => {
		if (cart === null ) {
			return Order.create()
		}
		return cart;
	})
	.then(_cart => {
		cart = _cart;
		return LineItem.findOne({where: {orderId: cart.id, productId}})
	})
	.then(lineItem => {
		if (!lineItem) return LineItem.create({quantity: 1, orderId: cart.id, productId});
		lineItem.quantity = lineItem.quantity++;
		return lineItem.save();
	})
	.then(lineitem => lineitem);
};

Order.destroyLineItem = (orderId, lineItemId) => {
	return LineItem.destroy({where: {id: lineItemId}})
};

Order.updateFromRequestBody = (orderId, _reqBody) => {
	const reqBody = Object.assign({isCart: false}, _reqBody)
	return Order.update(reqBody, {where: {id: orderId}})
};

Product.allData = () => {
	return Promise.all([
		Product.findAll(),
		Order.findAll({
			include: [{model: LineItem, include: [{model: Product}]}]
		})
	])
	.then(([products, _orders]) => {
		// console.log('_orders[0].lineItems[0].product.name = ', _orders[0].lineItems[0].product.name )
		const cart = _orders.filter((order) => order.isCart);
		const orders = _orders.filter((order) => !order.isCart);
		return [products, orders, cart[0]];		
	})
}


module.exports = {
	seed,
	sync,
	models: {
		Product,
		LineItem,
		Order
	}
};