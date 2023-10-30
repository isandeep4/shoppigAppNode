const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }
  save(){
    const db = getDb();
    let dbOps;
    if(this._id){
      dbOps = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
    } else {
      dbOps = db.collection('products').insertOne(this)
    }
    return db.collection('products').insertOne(this)
      .then(result=>{
        console.log(result);
      })
      .catch(error=>console.log(error));
  }
  static fetchAll(){
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(result=>{
      console.log(result);
      return result;
    })
    .catch(err=>console.log(err));
  }
  static findById(prodId){
    const db = getDb();
    return db.collection('products').find({_id: new mongodb.ObjectId(prodId)})
    .next()
    .then(product=>{
      console.log(product);
      return product;
    })
    .catch(err=>{
      console.log(err);
    })
  }
}

module.exports = Product;