const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function feed(parent, args, context, info) {
  return context.prisma.link.findMany();
}

module.exports = {
  feed,
};
