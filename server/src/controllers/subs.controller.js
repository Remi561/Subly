import { CreateSubscriptionSchema, UpdateSubscriptionSchema } from "../libs/validated"
import { prisma } from "../libs/prisma"

export async function getSubscriptions(req, res) {
    try {
        const user = req.user
        const data = await prisma.subscription.findMany({
            where: { userId: user.id },
            orderBy: {createdAt: "asc"}
        })
        if (!data) {
            return res.status(404).json({success: false, message: 'subscription not found'})
        }
        return res.json({success: true, message: 'Subscription found', data})
    } catch (err) {
        next(err)
        // return res.status(500).json({success: false,message:"something went wrong" })
    }
}

export async function createSubscriptions(req, res, next) {
    try {
        const user = req.user;
        const parsedBody = CreateSubscriptionSchema.safeParse(req.body)

        if (!parsedBody.success) {
            return res.status(400).json({
                errors: parsedBody.error.flatten().fieldErrors,
                message: "Invalid input"
            })
        }
        
        const data = parsedBody.data;
        const name = data.name.toLowerCase().trim()

        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                AND: {
                    userId: user.id,
                    name
                }
            }
        })

        if (existingSubscription) {
            return res.status(400).json({message:'Subscription already exist'})
        }
        
        // const generatedLogo =  
        // const generetedNextBilling =
        //const generatedSettledAmt =

    } catch (err) {
        next(err)
    }
}