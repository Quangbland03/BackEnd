var express = require('express');
const CategoryModel = require('../models/Category');
var router = express.Router();


router.get('/', async function (req, res) {
    try {
        var categories = await CategoryModel.find({});
        res.send(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/delete/:id', async (req, res) => {
  const catId = req.params.id;
  try {
    await CategoryModel.findByIdAndDelete(catId);
    res.status(200).json({ success: true, message: 'category deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product. Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});
router.get('/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cate = await CategoryModel.findById(id);
    if (!cate) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.send(cate); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/edit/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var ca = req.body;

    await CategoryModel.findByIdAndUpdate(id, ca);
    res.status(200).send({"message":"edit success"});
  } catch (error) {
    if (error.name === 'ValidationError') {
      let inputErrors = {};
      for (let er in error.errors) {
        inputErrors[er] = error.errors[er].message;
      }
      res.status(400).json(inputErrors);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error' + error);
    }
  }
});
router.post('/add', async (req, res) => {
  try {
    const productData = req.body;
    await CategoryModel.create(productData);
    res.status(200).send({"message":"create success"});
  } catch (error) {
    if (error.name === 'ValidationError') {
      const inputErrors = Object.fromEntries(
        Object.entries(error.errors).map(([key, value]) => [key, value.message])
      );
      res.status(400).json(inputErrors);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
  }
});

module.exports = router;