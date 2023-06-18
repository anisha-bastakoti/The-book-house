const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ItemSchema = new Schema({
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    },
    
})

const CartSchema = new Schema({
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type:Number
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('cart', CartSchema);
