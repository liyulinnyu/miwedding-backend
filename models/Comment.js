const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    creator: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    },
    weddingId: {
        ref: 'Wedding',
        type: Schema.Types.ObjectId,
        required: true
    },
    respondent: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type:String,
        required: true
    },
    likeUsers: [{
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    }],
    dislikeUsers: [{
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    }]
});

module.exports = mongoose.model('Comment', CommentSchema);