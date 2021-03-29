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
