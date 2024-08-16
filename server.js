const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('express-flash');

const app = express();

// Database configuration
const dbConfig = {
  host: 'bmit0bpiau5ou7gx51fr-mysql.services.clever-cloud.com',
  user: 'uaa1hwklgilqtmzw',
  password: 'lU7UCzZBTZGGeBcdoVxe',
  database: 'bmit0bpiau5ou7gx51fr',
  port: 3306
};

// Session store
const sessionStore = new MySQLStore(dbConfig);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'd438cfe9ba8c97d7de7883248661f64e01ab7b5839010111879f7b260325e567f1071aafa0ee10b12b539f1d286bac5d69195beab0d7e440ec3371274e666f78',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));