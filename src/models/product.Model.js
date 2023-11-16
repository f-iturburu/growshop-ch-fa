import {Schema, model} from 'mongoose';

const product = new Schema({
  name: String,
  description: String,
  category: String,
  images: Array,
  price: Number
},{
    timestamps:true
});



export default model('Product', product);