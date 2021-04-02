const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "Fullstack tutorial for coding",
      url: "www.howtographql.com",
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log("🚀", allLinks);
}

main()
  .catch((e) => {
    console.log("💎", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// big picture
// 1. add model
// 2. Setup schema, add type definitions using SDL to match model
// 3. impliment resolver function (Query, Mutation, Model/Thing.js)
// 4. util functions to aid side effects
// 5. all gets given (passed) to GraphQLServer via the context object
