const express = require('express');
const router = express.Router();

const productsRepo = require('../repository/products');
const productsIndexTemplate = require('../views/products/index');

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    if (!products) {
        return res.status(400).json({ error: 'Product not found' });
    }
    return res.send(productsIndexTemplate({products}));
});

module.exports = router;