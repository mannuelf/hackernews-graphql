const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { APP_SECRET, getUserId } = require("../utils");

async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: userId ? { id: userId } : undefined,
      },
    },
  });

  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("invalid please try again");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function vote(parent, arg, context, info) {
  // validate the incoming JWT with the getUserId function, if valid return ID or throw exception
  const userId = getUserId(context);

  // protect against double voting, accidental twice clicker, check if vote already exist or not. fetch a vote with same linkId and userId. if vote exists, it will be stored in the vote var. resulting in the boolean True... from call to Boolean(vote)-threing an erro telling user already voted.
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
