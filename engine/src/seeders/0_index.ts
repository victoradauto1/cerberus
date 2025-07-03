import ISeeder from "./ISeeder";
import tokenSeeder  from "./1_token";
import poolSeeder  from "./2_pools";

const seeders: ISeeder[] = [
    tokenSeeder,
    poolSeeder
]

async function start(){
    console.log("initializing Seeders Index...");
    for (let i = 0; i < seeders.length; i++){
        await seeders[i].execute();
    }
    console.log("Finalized Seeders Index.")
}

start();