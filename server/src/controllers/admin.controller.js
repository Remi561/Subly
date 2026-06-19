import { prisma } from "../libs/prisma.js"
import { SubscriptionIdParamSchema } from "../libs/validated.js";
export async function getAdminStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalSubscriptions,
      subscriptionsByStatus,
      subscriptionsByCategory,
      totalHistory,
      latestRates,
    ] = await prisma.$transaction([
      prisma.user.count(),

      prisma.subscription.count(),

      prisma.subscription.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),

      prisma.subscription.groupBy({
        by: ["category"],
        _count: {
          id: true,
        },
      }),

      prisma.history.count(),

      prisma.rates.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          baseCurrency: true,
          updatedAt: true,
        },
      }),
    ]);

    const statusCounts = {
      ACTIVE: 0,
      EXPIRED: 0,
      ARCHIVED: 0,
      CANCELLED: 0,
    };

    subscriptionsByStatus.forEach((item) => {
      statusCounts[item.status] = item._count.id;
    });

    const categoryCounts = subscriptionsByCategory.map((item) => ({
      category: item.category,
      count: item._count.id,
    }));

    return res.status(200).json({
      message: "Admin stats fetched successfully",
      stats: {
        users: {
          total: totalUsers,
        },

        subscriptions: {
          total: totalSubscriptions,
          byStatus: statusCounts,
          byCategory: categoryCounts,
        },

        history: {
          total: totalHistory,
        },

        currency: {
          baseCurrency: latestRates?.baseCurrency || null,
          lastUpdated: latestRates?.updatedAt || null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                
            }
        })

        if (!users) {
            return res.status(404).json({message: 'No user found'})
        }

        return res.json({message: "User found", users})
    } catch (error) {
        next(error)
    }
}

export async function promoteUser(req, res, next) {
    try {
        const id = req.params.id
        const parsedId = SubscriptionIdParamSchema.safeParse({ id })
        
        if (!parsedId.success) {
            return res.status(400).json({message: "Invalid id"})
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                id: parsedId.data.id
            },
            select: {
                id: true,
                role: true,
            }
        })

        if (!existingUser) {
            return res.status(404).json({message: "user not found"})
        }

       
        if (existingUser.role === "ADMIN") {
            return res.status(400).json({message: "User cannot be promoted because they already have ADMIN role"})
        }
            

        await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                role: "ADMIN"
            }
        })

        return res.json({message: "User is successfully promoted"})
    } catch (error) {
        console.error(error)
        next(error)
    }

}

export async function demoteUser(req, res, next) {
    try {
      const id = req.params.id;
      const parsedId = SubscriptionIdParamSchema.safeParse({ id });

      if (!parsedId.success) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          id: parsedId.data.id,
          },
          select: {
              id: true,
              role: true,
         
          }
      });

      if (!existingUser) {
        return res.status(404).json({ message: "user not found" });
      }
        if (existingUser.id === req.user.id) {
            return res.status(400).json({
              message: "You cannot demote yourself",
            });
      }
        if (existingUser.role === "USER") {
            return res.status(400).json({
              message:
                "User cannot be demoted because they already have USER role",
            });
      }

        await prisma.user.update({
            where: {
            id: existingUser.id
        },
        data: {
          role: "USER",
        },
      });

      return res.json({ message: "User is successfully promoted" });
    } catch (error) {
        console.error(error)
      next(error);
    }
}