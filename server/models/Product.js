const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    category: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

// #3-12 8:30 
// 검색 기능을 가능하게 하기 위해서
// title 을 검색, title 을 더 중점적으로
productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }