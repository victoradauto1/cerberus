import Trade from "commons/models/trade";
import { TradeService } from "src/trade/trade.service";

export const newTrade = {
    id: "trade123",
    userId: "userId123",
    automationId: "automationId123",
    openDate: new Date(Date.now()-10),
    closeDate: new Date(),
    openPrice: 10,
    openAmountIn: "10",
    openAmountOut: "10",
    closePrice:10,
    closeAmountIn: "10",
    closeAmountOut: "10",
    pnl: 10
} as Trade;

export const tradeServices ={
    provide: TradeService,
    useValue:{
        getClosedTrades: jest.fn().mockResolvedValue([newTrade]),
    }
}
