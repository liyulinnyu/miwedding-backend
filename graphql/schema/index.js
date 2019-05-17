const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Wedding {
        _id: ID!
        weddingTitle: String!
        backgroundImg: String!
        price: Float!
        creatorId: User!
        date: String!
        country: String!
        state: String!
        city: String!
        weddingDate: String!
        weddingYear: Int!
        weddingMonth: Int!
        weddingType: String!
        designer: String!
        customContent: String!
        comments: [Comment!]!
        likeUsers: [User!]!
        dislikeUsers: [User!]!
        saveUsers: [User!]!
        long: String!
        lati: String!
    }


    type Comment {
        _id: ID!
        weddingId: String!
        creator: User!
        respondent: User!
        date: String!
        content: String!
        likeUsers: [User!]!
        dislikeUsers: [User!]!
    }


    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        comments: [Comment!]!
        savedWedding: [Wedding!]!
        createdWedding: [Wedding!]!
        likeWedding: [Wedding!]!
        dislikeWedding: [Wedding!]!
        image: String!
        clickedWedding: [Wedding!]!
        likeMessage: [Comment!]!
        dislikeMessage: [Comment!]!
        replyMessage: [Comment!]!
    }

    type AuthUser {
        currentUser: User!
        token: String!
        tokenExp: Int!
    }

    type SearchWeddingsOutput {
        weddings: [Wedding!]!
        totalNum: Int!
    }


    input CreateWeddingInput {
        creatorId: String!
        country: String!
        state: String!
        city: String!
        backgroundImg: String!
        weddingTitle: String!
        price: String!
        weddingDate: String!
        weddingType: String!
        designer: String!
        customContent: String!
        long: String!
        lati: String!
    }

    input UpdateWeddingInput {
        _id: String!
        country: String!
        state: String!
        city: String!
        backgroundImg: String!
        weddingTitle: String!
        price: String!
        weddingDate: String!
        weddingType: String!
        designer: String!
        customContent: String!
        long: String!
        lati: String!
    }


    input SignupInput {
        username: String!
        email: String!
        password: String!
    }

    input GetSearchedWeddingInput {
        content: String
        minPrice: String
        maxPrice: String
        season: String
        country: String
        state: String
        page: String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthUser!
        getOneWedding(weddingId: String!): Wedding!
        getCoordinateWedding: [Wedding!]!
        getRecommendWedding(num: Int!): [Wedding!]!
        getWeddingComments(weddingId: String!, num: Int!, offset: Int!): [Comment!]!
        getUser(userId: String!): User!
        getSavedWedding(userId: String!): User!
        getSearchedWedding(input: GetSearchedWeddingInput): SearchWeddingsOutput!
    }

    type RootMutation {
        createComment(weddingId: String!, content: String!, creator: String!, respondent: String!): Comment!
        createWedding(input: CreateWeddingInput): Wedding!
        updateWedding(input: UpdateWeddingInput): String!

        signup(input: SignupInput): String!


        doWeddingLike(weddingId: String!, userId: String!): Wedding!
        doWeddingDislike(weddingId: String!, userId: String!): Wedding!
        doWeddingSave(weddingId: String!, userId: String!): Wedding!
        
        removeWeddingLike(weddingId: String!, userId: String!): Wedding!
        removeWeddingDislike(weddingId: String!, userId: String!): Wedding!
        removeWeddingSave(weddingId: String!, userId: String!): Wedding!

        doCommentLike(commentId: String!, userId: String!): Comment!
        doCommentDislike(commentId: String!, userId: String!): Comment!

        changeUserImage(userId: String!, image: String!): User!

        deleteSingleWedding(userId: String!, weddingId: String!): User!

        deleteComment(commentId: String!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);