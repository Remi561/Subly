import {Response, Request, NextFunction} from 'express'
import {prisma} from '../libs/prisma.js'
import {verifyWebhook, UserWebhookEvent} from '@clerk/express/webhooks'
import {currencySchema} from '../libs/validated.js'
export const webHooks = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const evt = await verifyWebhook(req);


        const eventType = evt.type;
        
        
        if(eventType === 'user.created'){
            const {id, first_name, last_name, username, unsafe_metadata, email_addresses } = evt.data;

            const email = email_addresses[0]?.email_address;
            const emailVerificationStatus = email_addresses[0]?.verification?.status;




            if(username === null){
                throw new Error('Username does not exist')
            }
            
    
            let baseCurrency: string = 'USD';
    
            if(unsafe_metadata?.baseCurrency){
                const verifiedCurrency = currencySchema.safeParse(unsafe_metadata.baseCurrency);
    
                if(verifiedCurrency.success){
                    baseCurrency = verifiedCurrency.data
                }else{
                    console.error('Unsupported Currency')
                }
            } 

            await prisma.user.create({
                data:{
                    clerkId: id,
                    firstName: first_name,
                    lastName: last_name,
                    username,
                    email,
                    baseCurrency,
                    emailVerified: emailVerificationStatus === 'verified'? 'VERIFIED': 'UNVERIFIED'
                }
            })
        } else if (eventType === 'user.updated'){
            const {id, first_name, last_name, username,  email_addresses } = evt.data;

            if(username === null){
                throw new Error('Username does not exist')
            }

            await prisma.user.update({
                where: {
                    clerkId: id
                },
                data:{
                    firstName: first_name,
                    lastName: last_name,
                    username
                }
            })
        } else if(eventType === 'user.deleted'){
            const {id} = evt.data

           const results = await prisma.user.deleteMany({
                where: {
                    clerkId: id
                }
            })

            results.count === 0 ? console.log('No record found to deleted') : console.log('Deleted the user record')
        }

    
        res.send('WebHooks completed')

    } catch(err){
        console.error(`Webhooks error: ${err}`);
        next(err)
    }

}