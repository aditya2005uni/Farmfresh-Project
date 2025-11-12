const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');


const router = express.Router();


router.post(
'/',
auth({ required: true , roles: ['admin'] }),
[body('name').notEmpty(), body('price').isNumeric()],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


try {
const product = new Product(req.body);
await product.save();
res.status(201).json(product);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
}
);


router.get('/', async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});



router.get('/:id', async (req, res) => {
try {
const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


router.put('/:id', auth({ required: true, roles: ['admin'] }), async (req, res) => {
try {
const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;