const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    first_name: {type:String, required:[true, "Please enter a first name"], minlength:[3, "First name must be at least 3 characters"]},
    last_name: {type:String, required:[true, "Please enter a last name"], minlength:[3, "Last name must be at least 3 characters"]},
    email: {type:String, 
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9.+_-]+@[a-zA-z0-9._-]+\.[a-zA-z]+$/.test(v);
            }, 
            message:"Please enter a valid email"}, 
        required:[true, "Please enter an email"]},
    password: {type:String, required:[true, "Please enter a password"], minlength:[8, "Password must be at least 8 characters"]},
    confirm_password: {type:String, required:[true, "Please confirm your password"], validate:{
        validator:function(value){
            return value == this.password;
        },
        message: "Passwords do not match"
    }},
    birthday: {type:Date, 
        validate:{
            validator: function(v){
                let date = new Date(v);
                let today = new Date();
                return date < today;
            },
            message:"Date must be in the past"
        }},
    comments:[{type:Schema.Types.ObjectId, ref: "Comment"}],
    secrets:[{type:Schema.Types.ObjectId, ref: "Secret"}]
}, {timestamps:true});
UserSchema.pre('save', function(done){
    bcrypt.hash(this.password, 10)
    .then(hashed => {
        this.password = hashed;
        this.confirm_password = null;
        done();
    })
    .catch(error => {
        console.log("Something went wrong", error);
    })
}); 
let User = mongoose.model('User', UserSchema);
module.exports = User