
import { Role , Category, Status} from "../generated/prisma/enums.js";



export type StatusResult = {
    status: Status;
    _count: {
        id: number
    }
}

export type TotalRole ={
    role: Role;
    _count: {
        id: number
    }
}

export type Categorys = {
    category: Category;
    _count: {
        id: number
    }
}

export type User = {
    id: string;
    username: string;
    role: string
    baseCurrency: string;
}

export type Currencies = {
    id: string;
    baseCurrency: string;
    rates: Record<string, number>; 
    createdAt: number;
    updatedAt: number;
}

export type WhereClause = {

    userId: string;
    type?: string;
    category?: string;
    OR?: object;
    paidAt?: {gte: Date};
   
}


export type Rate = Record<string, number>