import connect from "./db";
import Pool from "commons/models/pool"

async function getPool(id: string): Promise<Pool | null>{

    const db = await connect();

    const pool = db.pools.findUnique({
        where: {id}
    });

    return pool;
}

async function addPool(pool: Pool): Promise<Pool>{
    const db = await connect();

    const newPool = db.pools.create({
        data: pool
    });

    return newPool;
}

export default{
    getPool,
    addPool
}