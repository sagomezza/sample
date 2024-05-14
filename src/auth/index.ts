
import { ROLES } from '../utils/roles';
import argon2 from 'argon2';
import { User } from "../model/user";
import { Certificate } from "../model/certificate";

import { IAuthProps, IRegisterProps, IUserProps, IRegisterProcessProps } from '../utils/types';

interface IHashFnType {
    password: string;
    user: IUserProps;
}

export const hashPassword = async ({ password, user }: IHashFnType) => {
    const hash = await argon2.hash(password);
    (await user).password = hash;
    await user.save();
    return "done";
}
/**
 * 
 *  Change to work with serial number
 *  Save the email and passsword
 * 
 */
export const register = ({ email, password, serialNumber }: IRegisterProps) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(email && password && serialNumber)) {
                reject({ code: 'bad_request', message: 'Email and password were not provided' });
                return;
            }
            User.findOne({ email }).then((user: IUserProps) => {
                if (user) {
                    registerProcess({ user, password, email, serialNumber })
                        .then(res => resolve(res))
                        .catch(err => reject(err))
                } else {
                    Certificate.findOne({ serialNumber })
                        .then((cert) => {
                            User.findOne({ alternativeId: cert.name + cert.lastName + cert.affiliation })
                                .then(user => {
                                    console.log(user)
                                    if (user) {
                                        registerProcess({ user, password, email, serialNumber })
                                            .then(res => resolve(res))
                                            .catch(err => reject(err))
                                    } else {
                                        reject({ code: 'auth_error', message: 'Something happened, please contact support' })
                                    }
                                })
                        })
                        .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
                }
            })
        } catch (err) {
            reject({ code: 'server_error', message: 'Something went wrong', err });
            return;
        }
    })
}

const registerProcess = ({ user, password, serialNumber, email }: IRegisterProcessProps) => {
    return new Promise((resolve, reject) => {
        hashPassword({ password, user })
            .then(() => {
                if (email !== user.email) {
                    user.role = ROLES.User
                    user.email = email;
                    user.save();
                }
                console.log(serialNumber, user._id.toString())
                Certificate.findOneAndUpdate({ serialNumber }, { $set: { students_id: user._id.toString() } })
                    .then(() => {
                        resolve({ message: 'User registered sucessfully', data: user });
                        return;
                    })
                    .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
            });
    })
}

export const login = ({ email, password }: IAuthProps) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(email, password)
            if (!(email && password)) {
                reject({ code: 'bad_request', message: 'Empty request' });
                return;
            }
            //@ts-ignore
            const user = await User.findOne({ email });
            if (user) {
                const hashedPass = (await user).password;
                if (await argon2.verify(hashedPass, password)) {
                    resolve({ user: user.toObject(), message: 'User logged in sucessfully' })
                    return;
                } else {
                    reject({ code: 'auth_error', message: 'Invalid credentials!' });
                    return;
                };
            } else {
                reject({ code: 'auth_error', message: `User doesn't exists. Are you trying to signup?` });
            }
        } catch (err) {
            console.log(err);
            reject({ code: 'server_error', message: 'Something went wrong', err });
            return;
        }
    });
};
