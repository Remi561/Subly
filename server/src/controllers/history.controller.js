import { prisma } from "../libs/prisma.js";
export async function getFilteredHistory(req, res, next) {

    
    try {
        const { query, category, type, range } = req.query
        const page = parseInt(req.query.page) || 1
        const userId = req.user.id;

        const ITEMS_PER_PAGE = 10

        const whereClause = { userId }
        
        if (type && type !== "ALL") {
            whereClause.type = type
        }

        if (category && category !== "ALL") {
            whereClause.category = category
        }
        if (range) {
          const dateThreshold = new Date();

          if (range === "7days") {
            dateThreshold.setDate(dateThreshold.getDate() - 7);
          } else if (range === "30days") {
            dateThreshold.setDate(dateThreshold.getDate() - 30);
          } else if (range === "12months") {
            dateThreshold.setMonth(dateThreshold.getMonth() - 12);
          }

          // Add the date boundary condition to our where clause
          whereClause.createdAt = { gte: dateThreshold };
        }

        if (query && query.trim() !== '') {
            whereClause.OR = [
                {
                    subscriptionName: {
                        contains: query,
                        mode: "insensitive",
                    },
                }
            ]
        }

        const [historyLogs, totalRecords] = await prisma.$transaction([
            
            prisma.history.findMany({
              where: whereClause,
              orderBy: { createdAt: "desc" }, 
              skip: (page - 1) * ITEMS_PER_PAGE,
              take: ITEMS_PER_PAGE,
            }),
            
            prisma.history.count({
              where: whereClause,
            }),
          ]);
      
    
          const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
      

        return res.status(200).json({
            history: historyLogs,
            meta: {
                currentPage: page,
                totalPages: totalPages || 1, 
                totalRecords,
            },
        })

    } catch (err) {
        next(err)
    }
}