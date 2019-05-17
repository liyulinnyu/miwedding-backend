const User = require('../../models/User');
const Comment = require('../../models/Comment');
const Wedding = require('../../models/Wedding');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const nestedWeddingContent = (weddings) => {
    return weddings.map(wedding => {
        return {
            date: wedding.date,
            country: wedding.country,
            state: wedding.state,
            city: wedding.city,
            backgroundImg: wedding.backgroundImg,
            weddingTitle: wedding.weddingTitle,
            long: wedding.long,
            lati: wedding.lati,
            price: wedding.price,
            weddingDate: wedding.weddingDate,
            weddingYear: wedding.weddingYear,
            weddingMonth: wedding.weddingMonth,
            weddingType: wedding.weddingType,
            designer: wedding.designer,
            customContent: wedding.customContent,
            _id: wedding._id,
            creatorId: nestedSingleUser.bind(this, wedding.creatorId),
            comments: nestedMultipleComment.bind(this, wedding.comments),
            likeUsers: nestedMultipleUser.bind(this, wedding.likeUsers),
            dislikeUsers: nestedMultipleUser.bind(this, wedding.dislikeUsers),
            saveUsers: nestedMultipleUser.bind(this, wedding.saveUsers)
        }
    })
}

const nestedSingleWedding = async (weddingId) => {
    const wedding = await Wedding.findById(weddingId);
    return {
        date: wedding.date,
        country: wedding.country,
        state: wedding.state,
        city: wedding.city,
        backgroundImg: wedding.backgroundImg,
        weddingTitle: wedding.weddingTitle,
        price: wedding.price,
        long: wedding.long,
        lati: wedding.lati,
        weddingDate: wedding.weddingDate,
        weddingYear: wedding.weddingYear,
        weddingMonth: wedding.weddingMonth,
        weddingType: wedding.weddingType,
        designer: wedding.designer,
        customContent: wedding.customContent,
        _id: wedding._id,
        creatorId: nestedSingleUser.bind(this, wedding.creatorId),
        comments: nestedMultipleComment.bind(this, wedding.comments),
        likeUsers: nestedMultipleUser.bind(this, wedding.likeUsers),
        dislikeUsers: nestedMultipleUser.bind(this, wedding.dislikeUsers),
        saveUsers: nestedMultipleUser.bind(this, wedding.saveUsers)
    };
};

const nestedMultipleWedding = (arr) => {
    return arr.map(itemId => {
        return nestedSingleWedding(itemId);
    });
}

const nestedSingleUser = async (userId) => {
    const user = await User.findById(userId);
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        comments: nestedMultipleComment.bind(this, user.comments),
        savedWedding: nestedMultipleWedding.bind(this, user.savedWedding),
        createdWedding: nestedMultipleWedding.bind(this, user.createdWedding),
        likeWedding: nestedMultipleWedding.bind(this, user.likeWedding),
        dislikeWedding: nestedMultipleWedding.bind(this, user.dislikeWedding),
        image: user.image,
        clickedWedding: nestedMultipleWedding.bind(this, user.clickedWedding),
        likeMessage: nestedMultipleComment.bind(this, user.likeMessage),
        dislikeMessage: nestedMultipleComment.bind(this, user.dislikeMessage),
        replyMessage: nestedMultipleComment.bind(this, user.replyMessage),
    }
}

const nestedMultipleUser = (arr) => {
    return arr.map(itemId => {
        return nestedSingleUser(itemId);
    });
};

const nestedSingleComment = async (commentId) => {
    const comment = await Comment.findById(commentId);
    return {
        _id: comment._id,
        weddingId: comment.weddingId,
        creator: nestedSingleUser.bind(this, comment.creator),
        respondent: nestedSingleUser.bind(this, comment.respondent),
        date: comment.date,
        content: comment.content,
        likeUsers: nestedMultipleUser.bind(this, comment.likeUsers),
        dislikeUsers: nestedMultipleUser.bind(this, comment.dislikeUsers)
    }
};

const nestedMultipleComment = (arr) => {
    return arr.map(itemId => {
        return nestedSingleComment(itemId);
    });
};


module.exports = {
    login: async (args, req) => {
        try {
            const email = args.email,
                  password = args.password;
            const user = await User.findOne({email: email});
            if (!user) {
                // not exists
                return new Error(`No such user found`);
            }
            
            const match = password === user.password;
            
            if (match) {
                // get token
                const token = JWT.sign({
                    userId: user._id
                }, 'AuthKey', {expiresIn: "1h"});

                return {
                    currentUser: user,
                    token: token,
                    tokenExp: 1
                }
            } else {
                // wrong password
                return new Error(`Wrong password`);
            }
        } catch (err) {
            console.log(err);
            return new Error('Internal error');
        }
    },
    getOneWedding: async (args, req) => {
        return nestedSingleWedding(args.weddingId);
    },
    getRecommendWedding: async (args, req) => {
        /*wait */
    }, 

    getCoordinateWedding: async () => {

        const weddings = await Wedding.find({$and: [
            {'long': {$ne: ''}},
            {'lati': {$ne: ''}}
        ]});

        return nestedWeddingContent(weddings);
    },
    getWeddingComments: async (args, req) => {
        const wedding = await Wedding.findById(args.weddingId);
        const comments = wedding.comments.slice(args.offset, args.offset + args.num);

        return nestedMultipleComment(comments);
    },

    getUser: async (args, req) => {
        return nestedSingleUser(args.userId);
    },

    getSavedWedding: async (args, req) => {
        return nestedSingleUser(args.userId);
    }, 


    getSearchedWedding: async (args, req) => {
        const num = 10; // # for every page
        const page = parseInt(args.input.page); // offset =page * num

        let weddings = [];
        let totalNum = 0;
        // based on the important
        // args.input.content - weddingTitle
        // args.input.minPrice - price
        // args.input.maxPrice - price
        // args.input.country - country
        // args.input.season.split('-') [0] <= (new Date(weddingDate).getMonth + 1) <= [1] 
        let req_str = [];
        if (args.input.content) {
            const content = new RegExp(`${args.input.content}`, 'i');
            req_str.push({$or: [
                {'weddingTitle': content},
                {'designer': content},
                {'country': content},
                {'state': new RegExp(`${args.input.content}`, 'i')},
                {'city': content}
            ]});
            
            
        }
        if (parseInt(args.input.minPrice) >= 0 && parseInt(args.input.maxPrice) >= 0) {
            req_str.push({'price': {'$gte': parseInt(args.input.minPrice), '$lte': parseInt(args.input.maxPrice)}});
        } else if (parseInt(args.input.minPrice) >= 0) {
            req_str.push({'price': {'$gte': parseInt(args.input.minPrice)}});
        } else if (parseInt(args.input.maxPrice) >= 0) {
            req_str.push({'price': {'$lte': parseInt(args.input.maxPrice)}});
        }

        if (args.input.country) {
            req_str.push({'country': args.input.country});
        }

        if (args.input.state) {
            req_str.push({'state': args.input.state});
        }

        if (args.input.season) {
            req_str.push({'weddingMonth': {'$gte': parseInt(args.input.season.split('-')[0]), '$lte': parseInt(args.input.season.split('-')[1])}})
        }

        // search
        if (req_str.length > 0) {
            weddings = await Wedding.find({
                '$and': req_str
            }).skip(page*num).limit(num);
            totalNum = await Wedding.find({
                '$and': req_str
            }).count();
        } else {
            weddings = await Wedding.find().skip(page*num).limit(num);
            totalNum = await Wedding.find().count();
        }
    

        return {
            weddings: nestedWeddingContent(weddings),
            totalNum: totalNum
        };
    },



    changeUserImage: async (args, req) => {
        await User.findByIdAndUpdate(args.userId, {
            image: args.image
        });
        return nestedSingleUser(args.userId);
    },

    createComment: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.creator);
            let comment = new Comment({
                weddingId: args.weddingId,
                creator: args.creator,
                respondent: args.respondent,
                date: new Date().toISOString(),
                content: args.content,
                likeUsers: [],
                dislikeUsers: []
            });
            
            comment = await comment.save();
            
            user.comments.push(comment._id);
            wedding.comments.push(comment._id);
            
            await user.save();
            await wedding.save();
            return nestedSingleComment(comment._id);
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
    },

    createWedding: async (args, req) => {

        let wedding = new Wedding({
            creatorId: args.input.creatorId,
            date: new Date().toISOString(),
            country: args.input.country,
            state: args.input.state,
            city: args.input.city,
            long: args.input.long,
            lati: args.input.lati,
            backgroundImg: args.input.backgroundImg,
            weddingTitle: args.input.weddingTitle.toLowerCase(),
            price: parseFloat(args.input.price),
            weddingDate: args.input.weddingDate,
            weddingYear: new Date(args.input.weddingDate).getFullYear(),
            weddingMonth: new Date(args.input.weddingDate).getMonth() + 1,
            weddingType: args.input.weddingType,
            designer: args.input.designer,
            customContent: args.input.customContent,
            comments: [],
            likeUsers: [],
            dislikeUsers: [],
            saveUsers: []
        });
        
        wedding = await wedding.save();
        const user = await User.findById(args.input.creatorId);
        user.createdWedding.push(wedding._id);
        await user.save();
        
        return nestedSingleWedding(wedding._id);
    },

    updateWedding: async (args, req) => {
        try {
            const new_data = {
                country: args.input.country,
                state: args.input.state,
                city: args.input.city,
                long: args.input.long,
                lati: args.input.lati,
                backgroundImg: args.input.backgroundImg,
                weddingTitle: args.input.weddingTitle.toLowerCase(),
                price: parseFloat(args.input.price),
                weddingDate: args.input.weddingDate,
                weddingYear: new Date(args.input.weddingDate).getFullYear(),
                weddingMonth: new Date(args.input.weddingDate).getMonth() + 1,
                weddingType: args.input.weddingType,
                designer: args.input.designer,
                customContent: args.input.customContent
            };
            await Wedding.findByIdAndUpdate(args.input._id, new_data);
            return 'success';
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
    },

    signup: async (args, req) => {
        try {
            if (await User.findOne({email: args.input.email})) {
                return 'please use another email';
            } else {

                const user = new User({
                    username: args.input.username,
                    email: args.input.email,
                    password: args.input.password,
                    comments: [],
                    savedWedding: [],
                    createdWedding: [],
                    likeWedding: [],
                    dislikeWedding: [],
                    image: 'data:image/jpeg;base64,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',
                    clickedWedding: [],
                    likeMessage: [],
                    dislikeMessage: [],
                    replyMessage: []
                });        
                await user.save();
                return 'success';
            }
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
        

    },

    doWeddingLike: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.likeUsers.push(args.userId);
            user.likeWedding.push(args.weddingId);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },
    doWeddingDislike: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.dislikeUsers.push(args.userId);
            user.dislikeWedding.push(args.weddingId);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },
    doWeddingSave: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.saveUsers.push(args.userId);
            user.savedWedding.push(args.weddingId);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },

    removeWeddingLike: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.likeUsers.splice(wedding.likeUsers.indexOf(args.userId), 1);
            user.likeWedding.splice(user.likeWedding.indexOf(args.weddingId), 1);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },
    removeWeddingDislike: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.dislikeUsers.splice(wedding.dislikeUsers.indexOf(args.userId), 1);
            user.dislikeWedding.splice(user.dislikeWedding.indexOf(args.weddingId), 1);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },
    removeWeddingSave: async (args, req) => {
        try {
            const wedding = await Wedding.findById(args.weddingId);
            const user = await User.findById(args.userId);

            wedding.saveUsers.splice(wedding.saveUsers.indexOf(args.userId), 1);
            user.savedWedding.splice(user.savedWedding.indexOf(args.weddingId), 1);

            await wedding.save();
            await user.save();

            return nestedSingleWedding(args.weddingId);
        } catch (err) {
            return new Error('internal error');
        }
    },

    doCommentLike: async (args, req) => {
        try {
            const comment = await Comment.findById(args.commentId);
            comment.likeUsers.push(args.userId);
            await comment.save();
            return nestedSingleComment(comment._id);
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
    },
    doCommentDislike: async (args, req) => {
        try {
            const comment = await Comment.findById(args.commentId);
            comment.dislikeUsers.push(args.userId);
            await comment.save();
            return nestedSingleComment(comment._id);
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
    },


    deleteSingleWedding: async (args, req) => {
        try {
            const user = await User.findById(args.userId);

            // delete createdWedding 
            user.createdWedding.splice(user.createdWedding.indexOf(args.weddingId), 1);
            await user.save();

            const wedding = await Wedding.findById(args.weddingId);

            
            await Promise.all(wedding.comments.map(async item => {
                let comment = await Comment.findById(item);
                let creator = await User.findById(comment.creator);
                let respondent = await User.findById(comment.respondent);
                // delete comment from creator
                creator.comments.splice(creator.comments.indexOf(item), 1);
                // delete comment from respondent
                if (respondent.replyMessage.indexOf(comment._id) > -1) {
                    respondent.replyMessage.splice(respondent.replyMessage.indexOf(comment._id), 1);
                }

                await creator.save();
                await respondent.save();
                await Comment.findByIdAndDelete(item);
            }));

            // delete the likeUsers
            await Promise.all(wedding.likeUsers.map(async item => {
                let cur_user = await User.findById(item);
                cur_user.likeWedding.splice(cur_user.likeWedding.indexOf(args.weddingId), 1);
                await cur_user.save();
            }));
            
            // delete dislikeUsers

            await Promise.all(wedding.dislikeUsers.map(async item => {
                let cur_user = await User.findById(item);
                cur_user.dislikeWedding.splice(cur_user.dislikeWedding.indexOf(args.weddingId), 1);
                await cur_user.save();
            }));

            await Promise.all(wedding.saveUsers.map(async item => {
                let cur_user = await User.findById(item);
                cur_user.savedWedding.splice(cur_user.savedWedding.indexOf(args.weddingId), 1);
                await cur_user.save();
            }));


            // finally, delete this wedding
            await Wedding.findByIdAndDelete(args.weddingId);

            return nestedSingleUser(args.userId);
        } catch (err) {
            console.log(err);
            return new Error('internal error');
        }
    },


    deleteComment: async (args, req) => {
        try {
            const comment = await Comment.findById(args.commentId);
            // remove comment from wedding
            const wedding = await Wedding.findById(comment.weddingId);
            wedding.comments.splice(wedding.comments.indexOf(args.commentId), 1);
            await wedding.save();

            // remove comment from creator 
            const creator = await User.findById(comment.creator);
            creator.comments.splice(creator.comments.indexOf(args.commentId), 1);
            await creator.save();

            // remove comment from respondent
            const respondent = await User.findById(comment.respondent);
            if (respondent.replyMessage.indexOf(args.commentId) > -1) {
                respondent.replyMessage.splice(respondent.replyMessage.indexOf(args.commentId), 1);
            }
            await respondent.save();

            // remove the comment
            await Comment.findByIdAndDelete(args.commentId);


            return 'success';

        } catch(err) {
            console.log(err);
            return new Error('internal error');
        }
    }
}