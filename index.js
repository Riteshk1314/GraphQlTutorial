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
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
        }

        type Query {
            getTodos: [Todo]
        }
    `;

    const resolvers = {
        Query: {
            getTodos: async () =>(await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
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
