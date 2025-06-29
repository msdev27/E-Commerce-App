const express = require('express');
const router = express.Router();

const cartsRepo = require('../repository/carts');
const productsRepo = require('../repository/products');
const cartIndexTemplate = require('../views/cart/index');

router.post('/cart/products', async (req, res) => {
    let cart;

    if (!req.session.cartId) {
        cart = await cartsRepo.create({items: []});
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingProduct = cart.items.find((item) => {
        return item.id === req.body.productId;
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.items.push({id: req.body.productId, quantity: 1});
    }

    await cartsRepo.update(cart.id, {items: cart.items});
    res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);
    console.log(cart);

    let cartProducts = [];
    for (let item of cart.items) {
        const productId = item.id;
        const product = await productsRepo.getOne(productId);

        cartProducts.push({
            productId: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            productQuantity: item.quantity
        });
    }
    return res.send(cartIndexTemplate({cartProducts}));
});

router.post('/cart/delete', async (req, res) => {

    const cartProductId = req.body.cartProductId;
    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let i=0; i<cart.items.length; i++) {
        if (cart.items[i].id === cartProductId) {
            cart.items.splice(i, 1);
            break;
        }
    }

    await cartsRepo.update(cart.id, {items: cart.items});
    res.redirect('/cart');
})

module.exports = router;