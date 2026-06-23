import { prisma } from "../libs/prisma.js";

const HISTORY_TYPES = new Set(["CREATED", "EDITED", "RENEWED"]);
const HISTORY_CATEGORIES = new Set([
  "ENTERTAINMENT",
  "PRODUCTIVITY",
  "SOFTWARE",
  "STORAGE",
  "EDUCATION",
  "AI_TOOLS",
  "OTHER",
]);

export async function getFilteredHistory(req, res, next) {
  try {
    const { category, type, range } = req.query;
    const search = req.query.search || req.query.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const userId = req.user.id;

    const whereClause = {
      subscription: {
        userId,
      },
    };

    const normalizedType = type ? String(type).toUpperCase() : null;
    const normalizedCategory = category ? String(category).toUpperCase() : null;

    if (normalizedType && normalizedType !== "ALL") {

      if (!HISTORY_TYPES.has(normalizedType)) {
        return res.status(400).json({ message: "Invalid history type" });
      }

      whereClause.type = normalizedType;
    }

    if (normalizedCategory && normalizedCategory !== "ALL") {
      if (!HISTORY_CATEGORIES.has(normalizedCategory)) {
        return res.status(400).json({ message: "Invalid history category" });
      }

      whereClause.category = normalizedCategory;
    }

    if (range && range !== "ALL") {
      const normalizedRange = String(range).toLowerCase().replace(/[\s_-]/g, "");
      const dateThreshold = new Date();

      if (["7d", "last7d", "7days", "last7days"].includes(normalizedRange)) {
        dateThreshold.setDate(dateThreshold.getDate() - 7);
        whereClause.paidAt = { gte: dateThreshold };
      }

      if (
        ["30d", "last30d", "30days", "last30days"].includes(normalizedRange)
      ) {
        dateThreshold.setDate(dateThreshold.getDate() - 30);
        whereClause.paidAt = { gte: dateThreshold };
      }

      if (
        ["12m", "last12m", "12months", "last12months"].includes(
          normalizedRange,
        )
      ) {
        dateThreshold.setMonth(dateThreshold.getMonth() - 12);
        whereClause.paidAt = { gte: dateThreshold };
      }
    }

    if (search && search.trim() !== "") {
      whereClause.OR = [
        {
          subscriptionName: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    const [historyLogs, totalRecords] = await prisma.$transaction([
      prisma.history.findMany({
        where: whereClause,
        orderBy: { paidAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.history.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      history: historyLogs,
      meta: {
        currentPage: page,
        totalPages: totalPages || 1,
        totalRecords,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}
