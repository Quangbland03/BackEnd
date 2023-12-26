var express = require('express');
const ProductModel = require('../models/Product');
var router = express.Router();
const ve = require('../middleware/verifyMiddleware')
const OrderModel = require('../models/Order');

router.get('/detail/:id',async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

router.get('/products',ve('admin'), async (req, res) => {
  const {
    page = 1, limit = 4
  } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: 'category',
    };

    const products = await ProductModel.paginate({}, options);

    const response = {
      pagination: {
        total: products.totalDocs,
        per_page: products.limit,
        current_page: products.page,
        last_page: products.totalPages,
        from: products.offset + 1,
        to: products.offset + products.docs.length,
      },
      data: products.docs,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

router.get('/productss', async (req, res) => {
  const {
    page = 1, limit = 10
  } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: 'category',
    };
    const products = await ProductModel.paginate({}, options);
    const response = {
      pagination: {
        total: products.totalDocs,
        per_page: products.limit,
        current_page: products.page,
        last_page: products.totalPages,
        from: products.offset + 1,
        to: products.offset + products.docs.length,
      },
      data: products.docs,
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

//delete product
router.get('/delete/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await ProductModel.findByIdAndDelete(productId);
    console.log('Product deleted successfully!');
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete product. Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var pro = req.body;
    await ProductModel.findByIdAndUpdate(id, pro);
    res.status(200).send({
      "message": "edit success"
    });
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

// Express.js route handler (assuming you have a model called 'Order')

const verify = () => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, "262003", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
router.post('/orders/createOrder', async (req, res) => {
  try {
      const { name, description, price, image } = req.body.Item.product;
      const quantity = req.body.Quantity;
      let totalPrice = quantity * price;
      const UserId = req.body.UserId;
      const newItem = new OrderModel({ name, description, price, image ,quantity ,totalPrice,UserId});
      await newItem.save();
      res.status(201).json({ message: 'Item saved successfully', item: newItem });
  } catch (error) {
      res.status(500).json({ message: 'Error saving item', error: error.message });
  }
});

router.get('/orders', async function (req, res) {
  try {
      var orders = await OrderModel.find({ UserId:'657961a26fc9f2f3358942f3'});
      res.status(200).send(orders);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const pro = req.body;
    await ProductModel.create(pro);
    res.status(200).send({
      "message": "Create success"
    });
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

module.exports = router;