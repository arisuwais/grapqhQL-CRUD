const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const server = 'http://localhost:3000';

const AnimeType = new GraphQLObjectType({
    name: 'Anime',
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        director: { type: GraphQLString },
        year: { type: GraphQLInt },
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        animes: {
            type: new GraphQLList(AnimeType),
            resolve(parentValue, args) {
                return axios.get(`${server}/animes/`)
                    .then(res => res.data);
            }
        }
    }
});


const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAnime: {
            type: AnimeType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                director: { type: new GraphQLNonNull(GraphQLString) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args) {
                return axios.post(`${server}/animes`, {
                    title: args.title,
                    director: args.director,
                    year: args.year
                }).then(res => res.data);
            }
        },
        findAnime: {
            type: AnimeType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios.get(`${server}/animes/` + args.id)
                    .then(res => res.data);
            }
        },
        updateAnime: {
            type: AnimeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                title: { type: GraphQLString },
                director: { type: GraphQLString },
                year: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                return axios.patch(`${server}/animes/` + args.id, args)
                    .then(res => res.data);
            }
        },
        deleteAnime: {
            type: AnimeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args) {
                return axios.delete(`${server}/animes/` + args.id, args)
                    .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});