const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
async function startApolloServer() {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    // Type Definitions and Resolvers
    const typeDefs = `
    type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        }
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
            userId: ID!
            user: User
        }

        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getTodosByUserId(userId: ID!): [Todo]
            getUser(id: ID!): User
        }
    `;

    const resolvers = {
        Todo: {
            user: async (parent) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`)).data,
        },  v 
        Query: {
            getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
            getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
            getUser: async (_, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            getTodosByUserId: async (_, { userId }) => {
                const todos = (await axios.get('https://jsonplaceholder.typicode.com/todos')).data;
                return todos.filter(todo => todo.userId == userId);
            },
        },
    };
    
    // Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // Middleware registration for GraphQL
    server.applyMiddleware({ app, path: '/graphql' });

    // Start Server
    const PORT = 4000;
    app.listen(PORT, () =>
        console.log(`Server is running on http://localhost:${PORT}/graphql`)
    );
}

startApolloServer();
