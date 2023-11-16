import {Schema, model} from 'mongoose';

const user = new Schema({
  username: {type:String, lowercase:true, trim:true},
  email: {type:String, lowercase:true, trim:true},
  password: String,
  role: String,
  premium: Boolean,
},{
    timestamps:true
});

export default model('User', user);
