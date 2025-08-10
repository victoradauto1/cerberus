import { Injectable } from "@nestjs/common";
import Pool from "commons/models/pool";
import db from "../db";

@Injectable()
export class PoolService {

    async getPool(id: string): Promise<Pool| null>{
        const pool = await db.pools.findUnique({
            where: {id}
        });

        return pool;
    }
}