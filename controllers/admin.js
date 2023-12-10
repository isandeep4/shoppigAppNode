const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('request', req);
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description, 
      },
      errorMessage: 'Attached file is not an image',
    })
  }
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product.save()
  .then(result=>{
    res.redirect('/admin/products')
  })
  .catch(err=>{
    //res.redirect('/500')
    const error = new Error(err);
    error.httpStatusCide = 500;
    return next(error);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product=>{
      if(!product){
        res.redirect('/');
      };
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
};

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId;
  const uTitle = req.body.title;
  const uPrice = req.body.price;
  const uImage = req.file;
  const uDescription = req.body.description;
  Product.findById(prodId).then(product=>{
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/')
    }
    product.title = uTitle;
    product.price = uPrice;
    product.description = uDescription;
    if(uImage){
      product.imageUrl = uImage.path;
    } 
    return product.save().then(result=>{
      res.redirect('/admin/products');
    })
  })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result=>{
      console.log('Destroyed')
      res.redirect('/admin/products');
    })
    .catch(err=>{
      //res.redirect('/500')
      const error = new Error(err);
      error.httpStatusCide = 500;
      return next(error);
    });
  
}

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    })
  }).catch(err=>{
    //res.redirect('/500')
    const error = new Error(err);
    error.httpStatusCide = 500;
    return next(error);
  });
};
