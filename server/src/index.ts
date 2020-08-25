import * as dotenv from "dotenv";
dotenv.config({ path: `${ __dirname }/.env`});
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import {verify} from "jsonwebtoken";
import cors from 'cors';
import {User} from "./entity/User";
import {createAccessToken, createRefreshToken, sendRefreshToken} from "./utils";


(async () => {
    const app = express();
    app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true
    }));
    app.use(cookieParser());
    app.get('/', (_, res) => res.send('Hello World!'));
    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ status: false, accessToken: '' });
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);

        } catch (err) {
            console.log(err)
            return res.send({ status: false, accessToken: '' })
        }

        const user = await User.findOne({ id: payload.userID });
        if (!user) {
            return res.send({ status: false, accessToken: '' });
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ status: false, accessToken: '' });
        }
        sendRefreshToken(res, createRefreshToken(user));
        return res.send({ status: true, accessToken: createAccessToken(user) });
    });

    await createConnection()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ UserResolver ]
        }),
        context: ({ req, res }) => ({ req, res })
    });
    apolloServer.applyMiddleware({ app, cors: false });


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server is up and running on port ${ PORT }`));
})()


// createConnection().then(async connection => {
//
//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);
//
//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);
//
//     console.log("Here you can setup and run express/koa/any other framework.");
//
// }).catch(error => console.log(error));
