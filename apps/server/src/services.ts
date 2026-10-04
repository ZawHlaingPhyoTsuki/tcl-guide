import { ENV } from "./env.server.js";

import { createAuth } from "./auth.js";
import { createPrismaClient } from "./db.js";

export const db = createPrismaClient(ENV);
export const auth = createAuth(ENV, db);
