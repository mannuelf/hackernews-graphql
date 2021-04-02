const { PrismaClient } = require("@prisma/client");
// apollo server fully-featured graphql server based on express.js
const { ApolloServer, PubSub } = require("apollo-server");
const { getUserId } = require("./utils");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require("./resolvers/Vote");
const Subscription = require("./resolvers/Subscription");

const pubsub = new PubSub();
// https://www.apollographql.com/docs/apollo-server/data/subscriptions/

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

// 3.1 typeDefs defines GraphQl schema, pass it all your types
// 3.2 resolvers object is the actual implemention of GraphQL schema
// 3.3 schema and resolvers are bundles and passed to ApolloServer, wich is imported from apollo-server
// 3.4 prisma, pubsub and userId passed into the context wich is passed int GraphQl server.
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
