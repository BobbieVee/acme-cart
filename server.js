const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 3000;
const swig = require('swig');
const db = require('./db/conn.js');
const {Product} = require('./db/conn.js').models;
const routes = require('./routes/orders');
const methodOverride = require('method-override');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
swig.setDefaults({cache: false});
app.use(methodOverride('_method'));

app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use('/orders', routes);

app.get('/', (req, res, next) => {
	Product.allData()
	.then(([products, orders, cart]) => {
		res.render('index', {products, orders, cart})
	})		
	.catch(next);
});


db.seed()
.then(() => app.listen(port, () => console.log(`Listening very intently on port ${port}`)));
