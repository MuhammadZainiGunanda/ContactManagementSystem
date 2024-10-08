import { PrismaClient } from "@prisma/client";

export const prismaClient : PrismaClient = new PrismaClient({
     errorFormat: "pretty",
     log: [ "info", "query", "error", "warn" ]
});