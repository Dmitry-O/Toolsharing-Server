const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tools: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tool'
        }
    ]
},
{
    timestamps: true
}
);

var Wishlists = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlists;