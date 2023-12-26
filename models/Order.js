var mongoose = require('mongoose');
var OrderSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: [2, 'Product name must be at least 2 characters long'],
        required: [true, 'Product name is required'],
    },
    description: {
        type: String,
        minLength: [5, 'Product description must be at least 5 characters long'],
        required: [true, 'Product description is required'],
    },
    price: {
        type: Number,
        min: [0, 'Product price must be a non-negative number'],
        required: [true, 'Product price is required'],
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
    },
    quantity:Number,
    totalPrice:Number,
    UserId :String,
    date: {
        type: Date,
        default: Date.now,
    },
   
});

var OrderModel = mongoose.model('orders', OrderSchema);
module.exports = OrderModel;
