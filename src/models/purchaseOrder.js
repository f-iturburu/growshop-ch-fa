import {Schema, model} from 'mongoose';

const Order = new Schema({
    products: Array,
    userId: String,
    successfulPayment: Boolean
},{
    timestamps:true
})

export default model('Order', Order);
