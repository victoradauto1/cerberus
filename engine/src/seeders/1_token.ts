import ISeeder from "./ISeeder";
import tokensRepository from "../repositories/tokensRepository";
import Config from "../config";
import { TokenData } from "src/services/uniswapTypes";
import { getTokens } from "src/services/uniswapService";

export class TokenSeeder implements ISeeder {
  async execute(): Promise<void> {
    console.log(`initializing tokens seeder...`);

    console.log(`Checking if the tokens already exists...`);
    const count = await tokensRepository.countToken(Config.NETWORK2);
    if (count > 0) {
      console.log(`The tokens already exists... exiting...`);
      return;
    }

    let skip: number = 0;
    let tokens: TokenData[] = [];

    do {
      tokens = await getTokens(skip);
      console.log(`Loaded ${tokens.length} tokens ...`);

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        console.log(token.name);

        try {
          await tokensRepository.addToken({
            id: token.id,
            name: token.name!,
            decimals: parseInt(token.decimals),
            symbol: token.symbol,
            network: Config.NETWORK2,
          });
        } catch (error) {
          console.error(`Error inserting token ${token.name}:`, error);
        }
      }

      skip += tokens.length;
      console.log(`Inserted ${tokens.length} tokens...`);
    } while (tokens.length > 0);

    console.log(`Finalized tokens seeder`);
  }
}

export default new TokenSeeder();
