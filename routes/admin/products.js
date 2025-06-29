const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const newProductTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');
const productEditTemplate = require('../../views/admin/products/edit');
const router = express.Router();
const upload = multer( {storage: multer.memoryStorage({})} )
const productsRepo = require('../../repository/products');
const { requireValidProductName,
    requireValidProductPrice,
} = require('./validator');

router.get('/admin/products', requireAuth,
    async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth,
    (req, res) => {
    res.send(newProductTemplate({}));
});

router.post('/admin/products/new',
    requireAuth,
    upload.single('productImage'),
    [ requireValidProductName, requireValidProductPrice],
    handleErrors(newProductTemplate),
    async (req, res) => {
    const productImage = req.file.buffer.toString('base64');
    const { productName, productPrice } = req.body;
    await productsRepo.create({ productName, productPrice, productImage});
    res.redirect('/admin/products');
});

router.get('/admin/products/:id/edit', requireAuth,
    async (req, res) => {
    const id = req.params.id;
    const product = await productsRepo.getOne(id);

    if (!product) {
        console.log(product);
        return res.send('Product not found');
    }

    res.send(productEditTemplate({ product }));
});

router.post('/admin/products/:id/edit', requireAuth,
    upload.single('productImage'),
    [requireValidProductName, requireValidProductPrice],
    handleErrors(productEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try{
            await productsRepo.update(req.params.id, changes);
        } catch (error) {
            res.send('Product not found');
        }
    });

router.post('/admin/products/:id/delete', requireAuth,
    async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);
    if (!product) {
        return res.send('Product not found');
    }
    await productsRepo.delete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = router;