var mongoose = require('mongoose');
var CategorySchema = mongoose.Schema({
    name: {
        type: String,
        minLength: [2, 'Username must be at least 3 characters long'],
        required: [true, 'Name is required'],
      },
    description:{
        type: String,
        minLength: [5, 'Username must be at least 3 characters long'],
        required: [true, 'Description is required'],
      },
});
var CategoryModel = mongoose.model('categories', CategorySchema);
module.exports =  CategoryModel;