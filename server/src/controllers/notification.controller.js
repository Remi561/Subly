import { prisma } from "../libs/prisma.js"
export async function getNotification(req, res, next) {
    try { 
        const userId = req.user.id
     
        const notifications = await prisma.notification.findMany({
            where: {
                userId
            }
        })

        return res.json({data: notifications, count:notifications.length , message: 'notification fetched successfully '})

    }
    catch (err) {
        next(err)
    }
}

export async function deleteNotification(req, res, next) {
    try {
        const userId = req.user.id

        const id = req.params.id

        const existingNotification = await prisma.notification.findFirst({
            where: {
                userId,
                id
            }
        })

        if (!existingNotification) {
            return res.status(404).json({message: "notification not found"})
        }

        await prisma.notification.delete({
            where: {
                id: existingNotification.id
            }
        })

        return res.status(200).json({
          message: "Notification deleted successfully",
        });
    } catch (err) {
        next(err)
    }
}