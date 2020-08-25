import { Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "./entity/User";


export const createAccessToken = (user: User) => {
    return sign(
        {
            userID: user.id
        },
        process.env.ACCESS_TOKEN_SECRET!,   // Secret for Access Token
        {
            expiresIn: '15s'
        });
}

export const createRefreshToken = (user: User) => {
    return sign(
        {
            userID: user.id,
            tokenVersion: user.tokenVersion
        },
        process.env.REFRESH_TOKEN_SECRET!,   // Secret for Access Token
        {
            expiresIn: '15m'
        });
}

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie('jid', token,{ httpOnly: true });
}
