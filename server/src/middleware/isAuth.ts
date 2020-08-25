import { MiddlewareFn } from "type-graphql";
import {Context} from "../context";
import {verify} from "jsonwebtoken";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw Error('Auth Failed');
    }
    try {
        const [ bearer, token ] = authorization.split(' ');
        if(bearer.toLowerCase() != 'bearer') {
            throw Error('Auth Failed');
        }
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (err) {
        console.log(err);
        throw Error('Auth Failed');
    }
    return next();
}
