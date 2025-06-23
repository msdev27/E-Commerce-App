const express = require('express');
const userRepository = require('./repository/users.js');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

app.use(express.static('public'));
app.use(cookieSession({
    keys: ['eu3na9fa2ci8cn0ri']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(authRouter);
app.use(productsRouter);
app.listen(3000, () => {
    console.log('Server started on port 3000!');
});

