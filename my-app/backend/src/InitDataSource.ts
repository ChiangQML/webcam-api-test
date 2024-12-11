// 20221020, Kevin Maas

import {DataSource,DataSourceOptions} from "typeorm"
import {CLog, CPath, gisProduction} from "./AppHelper";
import * as path from "path";

if(!process.env.PORT) {
    require('dotenv-flow').config();
}

if (!process.env.DB_FILE) {
    CLog.bad(`Invalid or Missing [Primary] DB Config env, ${process.env.DB_FILE}`);
    process.exit(1);
}


// alert only
const entityPath = process.env.ENV === 'production' ? path.join(__dirname + '/../../build/src/auth2/entity/**/*.entity.js') :  path.join(__dirname + '/../src/entity/**/*.entity.ts')
// CLog.ok(`Env is: -->${process.env.NODE_ENV}` )
// CLog.ok(`Server Path-->${__dirname}`)

CLog.ok(`1, Entity Path: -->${entityPath}`)
CLog.ok(`2, Entity Path: -->${process.env.MYSQL_ENTITIES}`)
CLog.info(`Seed info: 
   ${process.env.TYPEORM_SEEDING_SEEDS} 
`)


const options: DataSourceOptions =
    {
        type: "sqlite",
        ...( {
            database: process.env.DB_FILE
        }),

        synchronize: process.env.DB_SYNC.toLowerCase() === 'true',
        extra: {connectionLimit: 50},
        logging: ["error"],
        maxQueryExecutionTime: 3000,
        entities: [
            entityPath
        ],
        migrations: [
            entityPath
        ],
        subscribers: [
            process.env.MYSQL_SUBSCRIBERS
        ],
    }
const gDB = new DataSource(options);
export default gDB
