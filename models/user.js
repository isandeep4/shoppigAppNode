const { getDb } = require("../util/database");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;
class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
    }
    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id: new ObjectId(userId)})
        .next()
    }
    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex((cp)=>cp.productId.toString() === product._id.toString());
        const updatedCartItems = [...this.cart.items];
        let newQuantity = 1
        if(cartProductIndex >= 0){
            newQuantity = updatedCartItems[cartProductIndex].quantity + newQuantity;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1});
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users')
            .updateOne({_id: new ObjectId(this._id)},{$set: {cart: updatedCart}})
    }
    getCart(){
        const productIds = this.cart.items.map(itm=>itm.productId);
        const db = getDb();
        return db.collection('products').find({_id: {$in: productIds}})
                .toArray()
                .then(products=>{
                    return products.map(p=>{
                        return {...p, quantity: this.cart.items.find(item=>item.productId.toString()===p._id.toString()).quantity}
                    })
                })
    }
}
module.exports = User;