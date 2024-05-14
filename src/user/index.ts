import { IUserInputProps, IUserPutProps, IUserGetProps, IEventLogInputProps, IUserProps, ICertificateInputProps } from '../utils/types';
import { User } from "../model/user";
import { insertLog } from '../eventLog';
import { ROLES } from '../utils/roles';
import { hashPassword } from '../auth/';
import { listCerts } from '../certificate';
import { S3Client, PutObjectCommand, } from "@aws-sdk/client-s3";
import { getExtention } from '../utils/file_ext';
//@ts-ignore - Library doesn't have TS support published
import * as ImageDataURI from 'image-data-uri';

const myBucket = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_KEY || '',
    }
});

interface PostQuery { alternativeId?: string, email?: string }

export const post = (data: IUserInputProps) => {
    return new Promise((resolve, reject) => {
        try {
            if (!data.role) {
                if (data.applicantInfo || data.registarInfo) data.role = ROLES.User
                else data.role = ROLES.API_CONSUMER
            }
            let query: PostQuery = {}
            if (data.alternativeId) {
                query.alternativeId = data.alternativeId
            }
            else query.email = data.email
            User.find(query)
                .then((user) => {
                    try {
                        if (user && user?.length > 0) reject({ code: 'already_exists', message: 'There is an existing user with the specified data', data })
                        else createUser(data)
                            .then(res => resolve(res))
                            .catch(err => reject(err))
                    } catch (err) {
                        console.log(err)
                        reject({ code: 'bad_request', message: 'Check the data send', err })
                    }
                })
                .catch(err => {
                    try {
                        // console.log(err)
                        if (err?.message === `Cannot read property '_id' of null`) createUser(data)
                            .then(res => resolve(res))
                            .catch(err => reject(err))
                        else reject({ code: 'bad_request', message: 'Check the data send', err })
                    } catch (err) {
                        console.log(err)
                        reject({ code: 'bad_request', message: 'Check the data send', err })
                    }
                });
        } catch (err) {
            console.log('bulkUser error:')
            console.log(err)
            reject({ code: 'bad_request', message: 'Check the data send', err })
        }
    });
}

const createUser = (data: IUserInputProps) => {
    return new Promise((resolve, reject) => {
        User.create(data).then(async user => {
            user.save();
            const log: IEventLogInputProps = {
                dateCreated: new Date(),
                model: 'User',
                type: 'post',
                message: `User ${data.email || data.alternativeId} was saved to DB successfuly`
            }
            await insertLog(log)
            resolve('User created successfuly')
            return;
        }).catch(err => {
            // console.log(err);
            reject({ code: 'bad_request', message: 'Check the data send', err, dataSend: data });
        });
    })
}

export const put = (data: IUserPutProps) => {
    return new Promise((resolve, reject) => {
        if (!('email' in data)) {
            reject({ code: 'bad_request', message: 'Check the data send' });
            return;
        }
        const email = data.email;
        delete data.email;
        if (Object.keys(data).length > 0) {
            get({ email })
                .then(async (userRes: { user: IUserProps }) => {
                    try {
                        let user = userRes.user
                        let update: any = {}
                        if (data.newEmail && data.newEmail !== user.email) update.email = data.newEmail;
                        if (data.name && data.name !== user.name) update.name = data.name;
                        if (data.last_name && data.last_name !== user.last_name) update.last_name = data.last_name;
                        if (data.applicantInfo && JSON.stringify(data.applicantInfo) !== JSON.stringify(user.applicantInfo)) update.applicantInfo = data.applicantInfo;
                        if (data.registarInfo && JSON.stringify(data.registarInfo) !== JSON.stringify(user.registarInfo)) update.registarInfo = data.registarInfo;
                        if (data.profilePic && data.profilePic !== user.profilePic) await profilePic({ file: data.profilePic, id: user._id, profilePic: user.profilePic })
                        if (Object.keys(update).length > 0) User.findOneAndUpdate({ email: email }, { $set: update })
                            .then(async user => {
                                if (data.password) hashPassword({ password: data.password, user });
                                user.save();
                                const log: IEventLogInputProps = {
                                    dateCreated: new Date(),
                                    model: 'User',
                                    type: 'put',
                                    message: `User ${email} was updated successfuly`
                                }
                                await insertLog(log)
                                resolve({ message: 'User updated successfuly' })
                            })
                        else resolve("Nothing new to update")
                    } catch (err) {
                        console.log(err)
                        reject(err)
                    }
                })

                .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
        } else reject({ code: 'bad_request', message: 'You sent no new data to update' })
    });
}

export const get = (data: IUserGetProps) => {
    return new Promise((resolve, reject) => {
        User.findOne(data)
            .then((user) => {
                listCerts(user._id)
                    .then((res: { certs: ICertificateInputProps[] }) => {
                        //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                        let userObj: IUserProps = { ...user.toObject(), certs: res.certs }
                        //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                        if (user.profilePic) {
                            //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                            userObj.profilePic = `${process.env.BUCKET_URL}/${user.profilePic}`;
                        }
                        delete userObj.password
                        resolve({ message: 'User found successfuly', user: userObj })
                    }).catch(err => reject(err))
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const getById = (data: string) => {
    return new Promise((resolve, reject) => {
        User.findById(data)
            .then(user => {
                listCerts(user._id)
                    .then((res: any) => {
                        //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                        let userObj = { ...user.toObject(), certs: res.certs }
                        //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                        if (user.profilePic) {
                            //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                            userObj.profilePic = `${process.env.BUCKET_URL}/${user.profilePic}`;
                        }
                        //@ts-ignore Converting an array to object is getting an error, I'm using this ignore because TS is having issues to recognize the types for this object
                        delete userObj.password
                        resolve({
                            message: 'User found successfuly', user: userObj
                        })
                    }).catch(err => reject(err))
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const setPublicProfile = ({ publicProfile, id }: { publicProfile: boolean; id: string }) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ _id: id }, {
            $set: {
                public: publicProfile
            }
        }).then((user) => {
            user.save()
            resolve({ message: 'User updated successfuly' })
        })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    })
}

export const profilePic = ({ file, id, profilePic }: { file: string; id: string, profilePic: string }) => {
    return new Promise((resolve, reject) => {
        let key = (profilePic && profilePic !== '') ? profilePic.split(".com/")[1] : id + getExtention(file);
        let decodedFile = ImageDataURI.decode(file)
        const params = {
            Body: decodedFile.dataBuffer,
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: 'image/png'
        };
        try {
            let command = new PutObjectCommand(params);
            myBucket.send(command).then(res => {
                console.log(res)
                User.findOneAndUpdate({ _id: id }, {
                    $set: {
                        profilePic: key
                    }
                }).then(() => {
                    resolve({ message: 'User updated successfuly', key })
                }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
            }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
        } catch (err) {
            console.log(err)
            reject(err)
        }


    })
}

export const listUser = () => {
    return new Promise((resolve, _reject) => {
        User.find({ type: 'applicant' })
            .then(users => resolve({ message: 'List of users found', list: users }))
    })
}

export const getByToken = (token: string) => {
    return new Promise((resolve, reject) => {
        User.findOne({ token })
            .then(user => {
                resolve({ message: 'User found successfuly', user })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
};

export const bulkUser = (data: IUserInputProps[]) => {
    console.log('called bulkUser')
    return new Promise((resolve, reject) => {
        try {
            //@ts-ignore
            let promises = [];
            data.map(user => {
                promises.push(post(user))
            })
            //@ts-ignore
            Promise.all(promises).then(() => {
                // console.log(results)
                resolve('User created successfuly')
            }).catch(err => {
                try {
                    console.log('bulkUser error:')
                    console.log(err)
                    resolve({ code: 'bad_request', message: 'Check the data send', err })
                } catch (err) {
                    console.log(err)

                }
            })

        } catch (err) {
            // console.log(err);
            reject({ code: 'server_error', message: 'Something went wrong', err });
            return;
        }
    })
}