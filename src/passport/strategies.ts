import { getById } from '../user';
import passport from 'passport';
import { Strategy } from 'passport-local';
import * as passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

import { login } from '../auth'
import { IAuthProps, IResProps, IUserProps } from '../utils/types';

interface IGetResponse {
    message: string;
    user: IUserProps
}

export const localStrategy = () => {
    passport.use('local', new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        async (email, password, cb) => {
            try {
                const data: IAuthProps = { email, password }
                const res: IResProps = await login(data)
                if (!res.user) return cb(null, false, { message: 'Incorrect email or password.' })
                return cb(null, res.user, { message: 'Logged In Successfully' })
            } catch (err) {
                return cb(err, false, {message: "Something bad happened, try again later!"})
            }
        }
    ));
}

export const jwtStrategy = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.TOKEN_KEY
    },
        (jwtPayload: { _id: string; }, cb: (err: any, user?: IUserProps | null) => any) => {
            // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
            return getById(jwtPayload._id)
                .then(( res : IGetResponse) => {
                    return cb(null, res.user);
                })
                .catch(err => {
                    return cb(err, null);
                });
        }
    ));
}

// passport.use(new BearerStrategy(
//     (token: string, done) => {
//         getByToken(token, function (err: null, user: IUserProps) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             return done(null, user, { scope: 'read' });
//         });
//     }
// ));