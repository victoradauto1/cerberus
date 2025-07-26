import ConfigBase from "commons/configBase";

export default class Config extends ConfigBase{
    static PORT : number = parseInt(`${process.env.PORT || 3002}` );

    static CHAIN_ID : number = parseInt(`${process.env.CHAIN_ID|| 80002}` );

    static AUTH_MSG : string = `${process.env.AUTH_MSG|| "Authenticate to Cerberus. Timestamp: <timestamp>"}`;

}