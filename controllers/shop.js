const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products)=>{
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product)=>{
      res.render('shop/product-detail', {
        product: product, 
        pageTitle: 'Product Title',
        path: '/product',
        isAuthenticated: req.session.isLoggedIn
      })
    })
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products)=>{
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    })
};

exports.getCart = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
            .then(user=>{
              const products = user.cart.items;
              res.render('shop/cart', {
                  path: '/cart',
                  pageTitle: 'Your Cart',
                  products: products,
                  isAuthenticated: req.session.isLoggedIn
                });
            })
            .catch(err=>{
              //res.redirect('/500')
              const error = new Error(err);
              error.httpStatusCide = 500;
              return next(error);
            });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeProductFromCart(prodId)
    .then(result=>{
      res.redirect('/cart');
    })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    });
  
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then(product=>{
      return req.user.addToCart(product)
    })
    .then(()=>{
        res.redirect('/cart');
        })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders=>{
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
  
};

exports.postOrder = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
      .then(user=>{
        const products = user.cart.items.map(i=>{return {quantity: i.quantity, product: {...i.productId._doc}}});
        const order = new Order({
          products: products,
          user: {
            email: req.user.email,
            userId: req.user
          }
        })
        return order.save();
      })
      .then(res=> {
        return req.user.clearCart();
      })
    .then(result=>{
      res.redirect('/orders')
    })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    });
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
        .then(order=>{
          if(!order){
            return next(new Error('No order found'));
          }
          if(order.user.userId.toString() !== req.user._id.toString() ){
            return next(new Error('unauthorized'));
          }
          const invoiceName = 'invoice-' + orderId + '.pdf';
          const orderPath = path.join('data', 'invoices', invoiceName);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
          const pdfDoc = new PDFDocument();
          pdfDoc.pipe(fs.createWriteStream(orderPath));
          pdfDoc.pipe(res);
          pdfDoc.text("Hello World")
        })
        .catch(err=>console.log(err))
}

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
