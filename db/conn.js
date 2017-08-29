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
		return LineItem.create({quantity: 1, productId: products[0].id, orderId: order.id });
	})
	.then(() => console.log(chalk.blue('    DB seeded')));
};

Order.addProductToCart = (productId) => {
	return Order.findOne({where: {isCart: true}})
	.then((cart) => {
		if (cart === null ) {
			console.log('No cart')
			return Order.create()
		}
		return cart;
	})
	.then(order => {
		return LineItem.create({quantity: 1, orderId: order.id, productId})
	})
	.then(lineitem => lineitem);
};

Order.destroyLineItem = (orderId, lineItemId) => {
	return LineItem.destroy({where: {id: lineItemId}})
};

Order.updateFromRequestBody = (orderId, reqBody) => {
	if (!reqBody.address) return "error";
	return Order.update(reqBody, {where: {id: orderId}})
};


module.exports = {
	seed,
	sync,
	models: {
		Product,
		LineItem,
		Order
	}
};