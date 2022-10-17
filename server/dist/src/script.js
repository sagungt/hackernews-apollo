"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const allLinks = await prisma.link.findUnique({
        where: {
            id: 20,
        },
    });
    // eslint-disable-next-line no-console
    console.log(allLinks);
}
main()
    .catch((e) => {
    throw e;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=script.js.map