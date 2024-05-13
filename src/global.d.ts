global.d.ts

import { PrismaClient } from "@prisma/client/edge";

declare global {
    var prisma: PrismaClient;
}