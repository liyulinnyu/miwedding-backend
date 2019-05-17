const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: { 
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }],
    savedWedding: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        require: true
    }],
    createdWedding: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        require: true
    }],
    likeWedding: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        require: true
    }],
    dislikeWedding: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        require: true
    }],
    image: {
        type:String,
        required: true
    },
    clickedWedding: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        require: true
    }],    
    likeMessage: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }],
    dislikeMessage: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }],
    replyMessage: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }],
});

module.exports = mongoose.model('User', UserSchema);