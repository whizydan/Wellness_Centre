var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var register = require('./routes/register');
var profileRouter = require('./routes/profile');
var servicesRouter = require('./routes/services');
var bookingRouter = require('./routes/booking');
var historyRouter = require('./routes/history');
var aboutRouter = require('./routes/about');
var locationRouter = require('./routes/location');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var checkoutRouter = require('./routes/checkout');
var masseurServicesRouter = require('./routes/m_services');
var masseurScheduleRouter = require('./routes/m_schedule');
var masseurRevenueRouter = require('./routes/m_revenue');
var masseurProfile = require('./routes/m_profile');
var addMasseurRouter = require('./routes/a_add_masseur');
var addServiceRouter = require('./routes/a_add_service');
var bookingDetailsRouter = require('./routes/a_booking_detail');
var completedBookingsRouter = require('./routes/a_completed_bookings');
var customerDetailsRouter = require('./routes/a_customer_details');
var customersRouter = require('./routes/a_customers');
var editMasseurRouter = require('./routes/a_edit_masseur');
var editServiceRouter = require('./routes/a_edit_service');
var masseurRouter = require('./routes/a_masseur');
var pendingBookingsRouter = require('./routes/a_pending_bookings');
var pendingShipmentRouter = require('./routes/a_pending_shipment');
var adminScheduleRouter = require('./routes/a_schedule');
var adminServicesRouter = require('./routes/a_services');
var shipmentDetailsRouter = require('./routes/a_shipment_detail');
var completedShipmentRouter = require('./routes/a_completed_shipment');
var deleteCartRouter = require('./routes/del_cart');
var deleteMasseurRouter = require('./routes/a_delete_masseur');
var deleteServicesRouter = require('./routes/a_delete_service');
var deliveredRouter = require('./routes/delivered');

var app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/register', register);
app.use('/profile', profileRouter);
app.use('/services', servicesRouter);
app.use('/booking',bookingRouter);
app.use('/history',historyRouter);
app.use('/about', aboutRouter);
app.use('/location', locationRouter);
app.use('/product', productsRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/m_services', masseurServicesRouter);
app.use('/m_profile', masseurProfile);
app.use('/m_schedule', masseurScheduleRouter);
app.use('/m_revenue', masseurRevenueRouter);
app.use('/a_add_masseur', addMasseurRouter);
app.use('/a_add_service',addServiceRouter);
app.use('/a_booking_detail',bookingDetailsRouter);
app.use('/a_completed_bookings', completedBookingsRouter);
app.use('/a_completed_shipment', completedShipmentRouter);
app.use('/a_customer_details',customerDetailsRouter);
app.use('/a_customers', customersRouter);
app.use('/a_edit_masseur', editMasseurRouter);
app.use('/a_edit_service', editServiceRouter);
app.use('/a_masseur', masseurRouter);
app.use('/a_pending_bookings', pendingBookingsRouter);
app.use('/a_pending_shipment', pendingShipmentRouter);
app.use('/a_schedule', adminScheduleRouter);
app.use('/a_services', adminServicesRouter);
app.use('/a_shipment_detail', shipmentDetailsRouter);
app.use('/del_cart', deleteCartRouter);
app.use('/a_delete_masseur', deleteMasseurRouter);
app.use('/a_delete_service', deleteServicesRouter);
app.use('/delivered',deliveredRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error('Error:', err.stack); // Log the error stack trace
  res.render('error');
});

module.exports = app;
