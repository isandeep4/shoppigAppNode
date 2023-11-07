const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
  product.save()
  .then(result=>{
    res.redirect('/admin/products')
  })
  .catch(err=>{
    console.log(err)
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
      });
    })
};

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId;
  const uTitle = req.body.title;
  const uPrice = req.body.price;
  const uImageUrl = req.body.imageUrl;
  const uDescription = req.body.description;
  const product = new Product(uTitle, uPrice, uDescription, uImageUrl, new mongodb.ObjectId(prodId));
  product.save()
    .then(result=>{
      res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}

exports.deleteProduct = (req,res,next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(result=>{
      console.log('Destroyed')
      res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
  
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  }).catch(err=>console.log(err));
};
