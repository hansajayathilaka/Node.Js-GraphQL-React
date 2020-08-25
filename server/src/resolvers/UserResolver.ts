import {Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { Context } from "../context";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../utils";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";


@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi!'
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(@Ctx() { payload }: Context) {
        return `userID is ${ payload!.userID }`
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {
        try {
            const hashedPassword = await hash(password, 12);
            await User.insert({
                email,
                password: hashedPassword
            });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokens(
        @Arg('userID', () => Int) userID: number
    ) {
        await getConnection()
            .getRepository(User)
            .increment({ id: userID }, 'tokenVersion', 1);
        return true;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: Context
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });

        if (!user){
            throw new Error('User not found');
        }

        const valid = await compare(password, user.password);
        if (!valid){
            throw new Error('Invalid credentials');
        }

        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user)
        };
    }
}
