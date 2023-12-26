var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/category');
var authRouter = require('./routes/auth');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const cors = require('cors');
 app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter );
app.use('/auth', authRouter),
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var mongoose = require("mongoose");
var uri = "mongodb+srv://quangquang2003tp:01234991798@cluster0.kv9zyyu.mongodb.net/Web";
mongoose.set('strictQuery', true);
mongoose.connect(uri)
.then(() => console.log ("Connect to DB succeed !"))
.catch((err) => console.log (err));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false}))
// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(process.env.PORT || 3001)
module.exports = app;
