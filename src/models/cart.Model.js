import {Schema, model} from 'mongoose';
import Product from "./product.Model.js"

const cart = new Schema({
    products: Array,
    ownerId: String,
    totalProducts: Number,
    totalPrice : Number
},{
    timestamps:true
})

export default model('Cart', cart);
