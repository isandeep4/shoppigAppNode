const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(item=>item.productId.toString()===product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.removeProductFromCart = function (productId) {
    const updatedProducts = this.cart.items.filter(item=>item.productId.toString() !== productId.toString());
    this.cart.items = updatedProducts;
    return this.save();    
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save()
}

module.exports = mongoose.model('User', userSchema);


// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");

// const ObjectId = mongodb.ObjectId;
// class User {
//     constructor(username, email, cart, id){
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//     }
//     static findById(userId){
//         const db = getDb();
//         return db.collection('users').find({_id: new ObjectId(userId)})
//         .next()
//     }
//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex((cp)=>cp.productId.toString() === product._id.toString());
//         const updatedCartItems = [...this.cart.items];
//         let newQuantity = 1
//         if(cartProductIndex >= 0){
//             newQuantity = updatedCartItems[cartProductIndex].quantity + newQuantity;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1});
//         }
//         const updatedCart = {items: updatedCartItems};
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({_id: new ObjectId(this._id)},{$set: {cart: updatedCart}})
//     }
//     getCart(){
//         const productIds = this.cart.items.map(itm=>itm.productId);
//         const db = getDb();
//         return db.collection('products').find({_id: {$in: productIds}})
//                 .toArray()
//                 .then(products=>{
//                     return products.map(p=>{
//                         return {...p, quantity: this.cart.items.find(item=>item.productId.toString()===p._id.toString()).quantity}
//                     })
//                 })
//     }
//     deleteProductFromCart(selectedProductId){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(selectedProductId)})
//           .then(result=>{
//             console.log('deleted')
//           })
//           .catch(err=>{
//             console.log(err)
//           })
//     }
//     addOrder(){
//         const db = getDb();
//         return this.getCart().then(products=>{
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name,
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(()=>{
//             this.cart = {items: []};
//             return db.collection('users').updateOne({$set: {cart: {items: []}}})
//         })
        
//     }
//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id':new ObjectId(this._id)}).toArray()

//     }
// }
// module.exports = User;