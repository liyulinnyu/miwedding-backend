const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WeddingSchema = new Schema({
    creatorId: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    },
    weddingTitle: {
        type: String,
        required: true
    },
    backgroundImg: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    long: {
        type: String
    },
    lati: {
        type: String
    },
    weddingDate: {
        type: Date,
        required: true
    },
    weddingYear: {
        type: Number,
        required: true
    },
    weddingMonth: {
        type: Number,
        required: true
    },
    weddingType: {
        type: String,
        required: true
    },
    designer: {
        type: String,
        required: true
    },
    customContent: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    }],
    likeUsers: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    dislikeUsers: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    saveUsers: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Wedding', WeddingSchema);