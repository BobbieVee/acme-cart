const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 3000;
const swig = require('swig');
// const routes = require('./routes/orders');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
swig.setDefaults({cache: false});

app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));

app.use('/', (req, res, next) => {
	res.render('index');
})
// app.use('/orders', routes);

app.listen(port, () => console.log(`Listening very intently on port ${port}`))