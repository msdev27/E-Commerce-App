const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const authRouter = require('./routes/admin/auth');
const productsAdminRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(cookieSession({
    keys: ['eu3na9fa2ci8cn0ri']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(authRouter);
app.use(productsRouter);
app.use(productsAdminRouter);
app.use(cartsRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});

