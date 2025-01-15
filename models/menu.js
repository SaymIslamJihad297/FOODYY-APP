const mongoose = require('mongoose');
const {Schema} = mongoose;


let menuSchema = new Schema({
    foodname: {
        type: String,
        required: true,
    },
    foodimage: {
        type: String,
        default: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    foodDetails: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ]
})


module.exports = mongoose.model("Menu", menuSchema);