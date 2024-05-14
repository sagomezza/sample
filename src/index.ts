//use-stric
// Library dependecies
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import SwaggerUi from 'swagger-ui-express';
import fs from 'fs';
var session = require('express-session');

// Imorts from project
import { connect } from "./mongo/connection";
import { localStrategy, jwtStrategy } from "./passport/strategies";
import { ROLES, checkIsInRole } from './utils/roles';
import { STATUS_CODES } from './utils/status_codes';
import {
    ICertAssociate,
    ICertificateGet,
    ICertificateValidateProps,
    IErrorHandlerProps,
    IErrorProps,
    ILUGetCodeProps,
    InputData,
    IOrderGetProps,
    IOrganizationGetProps,
    IProvinceGetProps,
    IResProps,
    IUserGetProps,
    IUserProps
} from './utils/types';
import { register } from "./auth/"
import * as User from "./user";
import * as LU_Code from "./locations/lu_codes";
import * as Province from "./locations/province";
import * as Order from "./order";
import * as Organization from "./organization";
import * as Certificate from "./certificate";
import * as docs from './docs';
import * as Tools from './mongo/dbTools';
import * as EventLog from "./eventLog";

// This enable access to environment viraibles, .env
dotenv.config();
// This connects to DB
connect({ MONGO_URI: process.env.MONGO_URI, MONGO_DB: process.env.MONGO_DB });

const port = process.env.PORT

// Express and Passport configuration necessary to start the server with auth logic, request from web pages, and configuration to responses and requests.
const app = express();

function a () {
    return fs.readFileSync('./.env');
}
function b() {
    const c = await a();
}

b();

app.use(
    express.json({
        limit: "50mb",
    })
);

app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

app.use(passport.initialize());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.session());

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(docs.default));

passport.serializeUser((user: IUserProps, done) => {
    // console.log(user)
    done(null, user._id);
});

passport.deserializeUser((id: IUserProps["_id"], done) => {
    User.getById(id)
        .then((res: IResProps) => {
            done(null, res.user._id);
        })
        .catch(err => {
            done(err, null)
        })
});

localStrategy();
jwtStrategy();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept,Authorization"
    );
    res.header("Access-Control-Allow-Origin: *");
    next();
});

app.enable('trust proxy');

// app.use(express.static(__dirname + '/node_modules'));

// app.use(express.static(__dirname + '/static', { dotfiles: 'allow' }));

// End of configuration process

// --------------------------- --------------------------- API calls  start ---------------------------  ---------------------------
const errorHandler = ({ err, res }: IErrorHandlerProps) => {
    return res.status(STATUS_CODES[err.code]).send(err)
}

app.get("/health", (_req, res) => {
    res.status(200).send("The GBS API is OK!");
});

// --------------------------- Auth related APIs ---------------------------
app.post("/register", (req, res) => {
    register(req.body)
        .then(result => { return res.status(200).send(result) })
        .catch((err: IErrorProps) => {
            console.log(err)
            return errorHandler({ err, res })
        })
});

app.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user: IUserProps) => {
        if (err || !user) {
            console.log(err)
            return res.status(400).json({
                message: err.message === 'Incorrect email or password.' ? err.message : err,
                user
            });
        }
        req.login(user, { session: false }, (loginErr) => {
            if (loginErr) {
                console.log(loginErr)
                res.send(loginErr);
            }
            const token = jwt.sign(user, process.env.TOKEN_KEY);
            return res.json({ user, token });
        });
    })(req, res);
});

app.get('/token', (req, res) => {
    passport.authenticate('jwt', { session: false }, () => {
        res.send(req.user);
    })
})
// --------------------------- END ---------------------------

// --------------------------- User related APIs ---------------------------
app.post("/user",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        User.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    }
);

app.get("/user",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: IUserGetProps = { email: (req.query.email as string) || (req.headers.email as string) }
        let user: IUserProps = req.user
        if (user.role === ROLES.User && data.email !== user.email) {
            let err: IErrorProps = { code: 'unauthorized', message: 'Unauthorized' }
            errorHandler({ err, res })
        }
        User.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.put("/user",
    passport.authenticate('jwt', { failureRedirect: '/login' }),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data = req.body
        let user: IUserProps = req.user
        if (user.role === ROLES.User && data.email !== user.email) {
            let err: IErrorProps = { code: 'unauthorized', message: 'Unauthorized' }
            errorHandler({ err, res })
        }
        User.put(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/listUser",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (_req, res) => {
        User.listUser()
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/publicUser",
    (req, res) => {
        const data: string = (req.query.id as string)
        User.getById(data)
            .then((result: { message: string; user: IUserProps }) => {
                if (result.user.public) {
                    delete result?.user?.id
                    delete result.user.email
                    const user = {
                        name: result?.user.name || '',
                        last_name: result?.user.last_name || '',
                        public: result?.user.public || false,
                        profilePic: result?.user.profilePic || '',
                        applicantInfo: {
                            city: result?.user?.applicantInfo?.city || '',
                            state: result?.user?.applicantInfo?.state || '',
                            country: result?.user?.applicantInfo?.country || '',
                            languages: result?.user?.applicantInfo?.languages || '',
                            title: result?.user?.applicantInfo?.title || '',
                            linkedIn: result?.user?.applicantInfo?.linkedIn || '',
                            twitter: result?.user?.applicantInfo?.twitter || '',
                            journey: result?.user?.applicantInfo?.journey || '',
                        },
                        //@ts-ignore
                        certs: result?.user?.certs || []
                    }
                    return res.status(200).send({ message: result.message, user })
                } else return res.status(200).send({ message: 'Not public profile found' })

            })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    }
);

app.post("/setPublicProfile",
    passport.authenticate('jwt'),
    (req, res) => {
        const data = req.body
        let user: IUserProps = req.user
        console.log(req.body)
        if (user.role === ROLES.User && data.email !== user.email) {
            let err: IErrorProps = { code: 'unauthorized', message: 'Unauthorized' }
            errorHandler({ err, res })
        }
        User.setPublicProfile(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    }
);

app.post("/profilePic",
    passport.authenticate('jwt'),
    (req, res) => {
        const data = req.body
        let user: IUserProps = req.user
        if (user.role === ROLES.User && data.email !== user.email) {
            let err: IErrorProps = { code: 'unauthorized', message: 'Unauthorized' }
            errorHandler({ err, res })
        }
        User.profilePic(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    }
);
// --------------------------- END ---------------------------

// --------------------------- LU_Code related APIs ---------------------------
app.post("/lu_code",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        LU_Code.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/lu_code",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: ILUGetCodeProps = { abbreviation: req.get('abbreviation') }
        LU_Code.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.put("/lu_code",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        LU_Code.put(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });
// --------------------------- END ---------------------------

// --------------------------- Province related APIs ---------------------------
app.post("/province",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        Province.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/province",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: IProvinceGetProps = { province: req.get('province') }
        Province.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.put("/province",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        Province.put(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });
// --------------------------- END ---------------------------

// --------------------------- Organization related APIs ---------------------------
app.post("/organization",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        Organization.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/organization",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: IOrganizationGetProps = { name: req.get('name') }
        Organization.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.put("/organization",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        Organization.put(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });
// --------------------------- END ---------------------------

// --------------------------- Order related APIs ---------------------------
app.post("/order",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data = req.body
        let user: IUserProps = req.user
        if (user.role === ROLES.User && data.requestedBy !== user._id) {
            let err: IErrorProps = { code: 'unauthorized', message: 'Unauthorized' }
            errorHandler({ err, res })
        }
        Order.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/order",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: IOrderGetProps = { _id: req.get('id') }
        Order.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });
// --------------------------- END ---------------------------

// --------------------------- Certificate related APIs ---------------------------
app.post("/certificate",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        Certificate.post(req.body)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/certificate",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        // @ts-ignore
        const data: ICertificateGet = { id: req.get('id') }
        data.post = false;
        Certificate.get(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

// app.post("/certificate/id",
//     passport.authenticate('jwt'),
//     checkIsInRole(ROLES.User, ROLES.Admin),
//     (req, res) => {
//         const data: ICertificateGet = req.body;
//         data.post = true;
//         Certificate.get(data)
//             .then(result => { return res.status(200).send(result) })
//             .catch((err: IErrorProps) => { errorHandler({ err, res }) })
//     });

app.post("/certValidate",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        const data: ICertificateValidateProps = req.body;
        Certificate.certValidate(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.post("/certAssociate",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.User, ROLES.Admin),
    (req, res) => {
        const data: ICertAssociate = req.body;
        Certificate.certAssociate(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

app.get("/fullCertList",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (_req, res) => {
        Certificate.fullCertList()
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { errorHandler({ err, res }) })
    });

// --------------------------- END ---------------------------

app.post("/updateDb",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (req, res) => {
        // @ts-ignore
        const data: InputData = req.body;
        Tools.updateDatabase(data)
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { console.log(err); errorHandler({ err, res }) })
    });

app.get("/eventLog",
    passport.authenticate('jwt'),
    checkIsInRole(ROLES.Admin),
    (_req, res) => {
        // @ts-ignore
        EventLog.listEventLogs()
            .then(result => { return res.status(200).send(result) })
            .catch((err: IErrorProps) => { console.log(err); errorHandler({ err, res }) })
    });

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    // console.log(`server started at http://localhost:${port}`);
});
