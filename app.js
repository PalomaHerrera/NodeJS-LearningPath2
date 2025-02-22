const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');



const controllerError =  require('./controllers/error')
const sequelize =  require('./util/database');

const Product  =  require('./models/product');
const User  =  require('./models/user');
const Cart =  require('./models/cart');
const CartItem =  require('./models/cart-item');

const Order =  require('./models/order')
const OrderItem =  require('./models/order-item')



const app = express();


//const db =  require('./util/database');
//const expressHbs = require('express-handlebars');

/* app.engine(
    'hbs',
    expressHbs({
      layoutsDir: 'views/layouts/',
      defaultLayout: 'main-layout',
      extname: 'hbs'
    })
  ); */

//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views','views');

/* const adminData = require('./routes/admin'); */
const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');


/* 
db.execute('SELECT * FROM  products')
.then((result) => {
  console.log(result[0], result[1])
})
.catch((err) => {
  console.log(err);
});
  */

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
  User.findByPk(1)
  .then(user => {
    req.user =  user;
    next();
  })
  .catch(err => console.log(err));
});

//app.use('/admin',adminData.routes);
app.use('/admin', adminRoutes)
app.use(shopRoutes);


app.use(controllerError.getError);

//asociaciones 
Product.belongsTo(User,{
  constraints: true,
  onDelete: 'CASCADE'
});

User.hasMany(Product);

User.hasOne(Cart);

Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem});

Product.belongsToMany(Cart , { through: CartItem});

Order.belongsTo(User);

User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem})


// sincroniza tus modulos con los de la base de datos
sequelize
.sync()
//.sync({force: true})
 .then(result => {
  return User.findByPk(1);
  //console.log(result);
})
.then(user => {
  if(!user){
   return  User.create({name: 'Paloma',email: 'paloma@email.com', password: '1234'})
  }
  return user;
})
.then(user => {
  //console.log(user);
  //return  user.createCart();
})
.then(cart => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
}) 















