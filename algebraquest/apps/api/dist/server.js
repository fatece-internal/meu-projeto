"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_config = require("dotenv/config");

// src/app.ts
var import_cors = __toESM(require("cors"));
var import_express2 = __toESM(require("express"));
var import_helmet = __toESM(require("helmet"));
var import_morgan = __toESM(require("morgan"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));

// src/routes/rooms.routes.ts
var import_express = require("express");
var import_zod = require("zod");

// src/lib/response.ts
function success(res, data, status = 200) {
  return res.status(status).json(data);
}
function error(res, message, status, details) {
  return res.status(status).json({ message, details });
}

// src/services/rooms.service.ts
var import_nanoid = require("nanoid");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
function createClient() {
  const log = process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"];
  return new import_client.PrismaClient({ log });
}
var prisma = globalThis.__aq_prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalThis.__aq_prisma = prisma;

// src/services/rooms.service.ts
function isExpired(room) {
  return room.expiresAt.getTime() < Date.now();
}
async function createRoom(difficulty, topics) {
  const roomId = (0, import_nanoid.nanoid)(6);
  const seed = roomId;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
  return prisma.room.create({
    data: {
      roomId,
      seed,
      difficulty,
      topics,
      expiresAt
    }
  });
}
async function getRoom(roomId) {
  const room = await prisma.room.findUnique({ where: { roomId } });
  if (!room) return null;
  if (isExpired(room)) return null;
  return room;
}
async function submitScore(roomId, data) {
  const room = await getRoom(roomId);
  if (!room) {
    const e = new Error("ROOM_NOT_FOUND");
    e.code = "NOT_FOUND";
    throw e;
  }
  const entry = await prisma.$transaction(async (tx) => {
    const existing = await tx.leaderboardEntry.findFirst({
      where: { roomId, playerId: data.playerId }
    });
    if (!existing) {
      return tx.leaderboardEntry.create({
        data: {
          roomId,
          playerName: data.playerName,
          playerId: data.playerId,
          score: data.score,
          livesLeft: data.livesLeft,
          questionsAnswered: data.questionsAnswered
        }
      });
    }
    if (data.score > existing.score) {
      return tx.leaderboardEntry.update({
        where: { id: existing.id },
        data: {
          playerName: data.playerName,
          score: data.score,
          livesLeft: data.livesLeft,
          questionsAnswered: data.questionsAnswered
        }
      });
    }
    return existing;
  });
  const higherCount = await prisma.leaderboardEntry.count({
    where: {
      roomId,
      OR: [
        { score: { gt: entry.score } },
        {
          score: entry.score,
          createdAt: { lt: entry.createdAt }
        }
      ]
    }
  });
  return { rank: higherCount + 1, entry };
}
async function getLeaderboard(roomId) {
  const room = await getRoom(roomId);
  if (!room) {
    const e = new Error("ROOM_NOT_FOUND");
    e.code = "NOT_FOUND";
    throw e;
  }
  const entries = await prisma.leaderboardEntry.findMany({
    where: { roomId },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: 20
  });
  return entries.map((e, idx) => ({ ...e, rank: idx + 1 }));
}

// src/controllers/rooms.controller.ts
function toEntry(e) {
  return {
    playerName: e.playerName,
    score: e.score,
    livesLeft: e.livesLeft,
    questionsAnswered: e.questionsAnswered,
    timestamp: e.createdAt.toISOString()
  };
}
var roomsController = {
  async create(req, res, next) {
    try {
      const { body } = req.validated;
      const room = await createRoom(body.difficulty, body.topics);
      return success(
        res,
        {
          roomId: room.roomId,
          seed: room.seed,
          config: { difficulty: room.difficulty, topics: room.topics }
        },
        201
      );
    } catch (err) {
      return next(err);
    }
  },
  async get(req, res, next) {
    try {
      const { params } = req.validated;
      const room = await getRoom(params.roomId);
      if (!room) {
        const e = new Error("ROOM_NOT_FOUND");
        e.code = "NOT_FOUND";
        throw e;
      }
      return success(res, {
        roomId: room.roomId,
        config: { difficulty: room.difficulty, topics: room.topics, seed: room.seed }
      });
    } catch (err) {
      return next(err);
    }
  },
  async submitScore(req, res, next) {
    try {
      const { params, body } = req.validated;
      const result = await submitScore(params.roomId, body);
      return success(res, { rank: result.rank, entry: toEntry(result.entry) });
    } catch (err) {
      return next(err);
    }
  },
  async leaderboard(req, res, next) {
    try {
      const { params } = req.validated;
      const entries = await getLeaderboard(params.roomId);
      return success(
        res,
        entries.map((e) => ({
          ...toEntry(e),
          rank: e.rank
        }))
      );
    } catch (err) {
      return next(err);
    }
  }
};

// src/middlewares/validate.middleware.ts
function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    if (!result.success) return next(result.error);
    req.validated = result.data;
    return next();
  };
}

// src/routes/rooms.routes.ts
var DifficultySchema = import_zod.z.union([import_zod.z.literal("easy"), import_zod.z.literal("medium"), import_zod.z.literal("insane")]);
var TopicSchema = import_zod.z.union([
  import_zod.z.literal("linear"),
  import_zod.z.literal("twoStep"),
  import_zod.z.literal("fractions"),
  import_zod.z.literal("parentheses"),
  import_zod.z.literal("negative"),
  import_zod.z.literal("decimal")
]);
var createRoomSchema = import_zod.z.object({
  body: import_zod.z.object({
    difficulty: DifficultySchema,
    topics: import_zod.z.array(TopicSchema).min(1)
  }),
  params: import_zod.z.object({}).passthrough(),
  query: import_zod.z.object({}).passthrough()
});
var roomIdParamsSchema = import_zod.z.object({
  params: import_zod.z.object({ roomId: import_zod.z.string().min(1) }),
  body: import_zod.z.any().optional(),
  query: import_zod.z.object({}).passthrough()
});
var submitScoreSchema = import_zod.z.object({
  params: import_zod.z.object({ roomId: import_zod.z.string().min(1) }),
  body: import_zod.z.object({
    playerName: import_zod.z.string().min(2).max(16),
    playerId: import_zod.z.string().min(1),
    score: import_zod.z.number().int().nonnegative(),
    livesLeft: import_zod.z.number().int().min(0).max(3),
    questionsAnswered: import_zod.z.number().int().nonnegative()
  }),
  query: import_zod.z.object({}).passthrough()
});
var roomsRouter = (0, import_express.Router)();
roomsRouter.post("/api/rooms", validate(createRoomSchema), roomsController.create);
roomsRouter.get("/api/rooms/:roomId", validate(roomIdParamsSchema), roomsController.get);
roomsRouter.post("/api/rooms/:roomId/score", validate(submitScoreSchema), roomsController.submitScore);
roomsRouter.get(
  "/api/rooms/:roomId/leaderboard",
  validate(roomIdParamsSchema),
  roomsController.leaderboard
);

// src/middlewares/error.middleware.ts
var import_zod2 = require("zod");
function errorMiddleware(err, _req, res, _next) {
  if (err instanceof import_zod2.ZodError) {
    return error(
      res,
      "VALIDATION_ERROR",
      400,
      err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message
      }))
    );
  }
  const e = err;
  if (e?.code === "NOT_FOUND" || e?.status === 404) {
    return error(res, e.message || "NOT_FOUND", 404, e.details);
  }
  const message = process.env.NODE_ENV === "production" ? "INTERNAL_ERROR" : e?.message || "INTERNAL_ERROR";
  return error(res, message, 500);
}

// src/app.ts
var app = (0, import_express2.default)();
app.use((0, import_helmet.default)());
app.use(
  (0, import_cors.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000"
  })
);
app.use((0, import_morgan.default)("dev"));
app.use(import_express2.default.json());
app.use(
  (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(roomsRouter);
app.use(errorMiddleware);

// src/server.ts
var PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`AlgebraQuest API :${PORT}`);
  }
});
