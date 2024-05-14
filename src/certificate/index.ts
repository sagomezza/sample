import { ICertAssociate, ICertificateGet, ICertificateInputProps, ICertificateValidateProps, IEventLogInputProps, IUserProps } from '../utils/types';
import { Certificate } from "../model/certificate";
import { insertLog } from '../eventLog';
import * as User from '../user';

export const post = (data: ICertificateInputProps) => {
    return new Promise((resolve, reject) => {
        try {
            Certificate.find({ serialNumber: data.serialNumber })
            .then((user) => {
                if (user && user?.length > 0) reject({ code: 'already_exists', message: 'There is an existing certificate with the specified data', data })
                else createCertificate(data)
                    .then(res => resolve(res))
                    .catch(err => reject(err))

            })
            .catch(err => {
                if (err?.message === `Cannot read property '_id' of null`) createCertificate(data)
                    .then(res => resolve(res))
                    .catch(err => reject(err))

                else {
                    console.log(err);
                    reject({ code: 'bad_request', message: 'Check the data send', err })
                }
            });
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

const createCertificate = (data: ICertificateInputProps) => {
    return new Promise((resolve, reject) => {
        Certificate.create(data).then(async certificate => {
            try {
                certificate.save();
                const log: IEventLogInputProps = {
                    dateCreated: new Date(),
                    model: 'Certificate',
                    type: 'post',
                    message: `Certificate ${data.name} was saved to DB successfuly`
                }
                await insertLog(log)
                resolve('Certificate created successfuly')
            } catch (err) {
                console.log(`[Certificate][post]:`, err)
                reject({ code: 'server_error', err })
            }
        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err, dataSend: data }));
    })
}

// export const get = (data: ICertificateGet) => {
//     return new Promise((resolve, reject) => {
//         Certificate.findOne(data)
//             .then(certificate => {
//                 let certificateData = certificate.toJSON();
//                 if (data.post) {
//                     delete certificateData.students_id
//                     delete certificateData._id
//                 }
//                 resolve({ message: 'Certificate found successfuly', certificateData })
//             })
//             .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
//     });
// }

export const get = (data : ICertificateGet) => {
    return new Promise((resolve, reject) => {
        Certificate.find(data)
            .then(certificate => {
                resolve({ message: 'Certificate found successfuly', certificate })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const listCerts = (data: string) => {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        Certificate.find({ students_id: [data] })
            .then(certs => resolve({ message: 'Certificate found successfuly', certs }))
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const certValidate = (data: ICertificateValidateProps) => {
    return new Promise((resolve, reject) => {
        // ts ignore
        Certificate.findOne({ data })
            .then(cert => {
                if (cert) {
                    resolve({ message: 'Certificate found successfuly', cert })
                    return;
                } else {
                    reject({ code: 'not_found', message: 'There are no records for the information sent' })
                }
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const certAssociate = (data: ICertAssociate) => {
    return new Promise((resolve, reject) => {
        console.log(data)
        User.get({ email: data.email })
            .then((res: { message: string, user: IUserProps }) => {
                try {

                    Certificate.findOne(
                        { serialNumber: data.serial }
                    ).then(certificate => {
                        console.log(certificate.language1, data.lng1, certificate.language2, data.lng2, certificate.degree, data.fluency)
                        if (certificate.language1 !== data.lng1 || certificate.language2 !== data.lng2 || certificate.degree !== data.fluency) {
                            console.log("milestone")
                            reject({ code: 'bad_request', message: 'Check the data send' })
                            return;
                        }
                        Certificate.findOneAndUpdate(
                            { serialNumber: data.serial },
                            {
                                $set: { students_id: res.user._id }
                            }
                        ).then(() => {
                            resolve({ message: 'certificate assoiacted successfuly' })
                        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }))
                    })
                        .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }))
                } catch (err) {
                    console.log(err)
                }
            }).catch(err => reject(err))

    })
}

export const bulkCertificate = (data: ICertificateInputProps[]) => {
    console.log('called bulkCertificate')
    return new Promise((resolve, reject) => {
        try {
            //@ts-ignore
            let promises = [];
            data.map(cert => {
                promises.push(post(cert))
            })
            //@ts-ignore
            Promise.allSettled(promises)
                .then((results) => {
                    resolve({ message: 'Certificates created successfuly', results })
                }).catch(err => {
                    console.log('bulkCertificate error:')
                    console.log(err)
                    console.log('resolving')
                    resolve({ code: 'bad_request', message: 'Check the data send', err })
                })

        } catch (err) {
            // console.log(err);
            reject({ code: 'server_error', message: 'Something went wrong', err });
            return;
        }
    })
}

export const fullCertList = async () => {
    let certificates = await Certificate.aggregate([
        { $group: { _id: null, result: { $addToSet: '$serialNumber' } } },
        { $project: { _id: 0, result: 1 } }
    ]);
    return certificates
}