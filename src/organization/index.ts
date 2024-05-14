import {
    IOrganizationInputProps,
    IOrganizationPutProps,
    IEventLogInputProps,
    IOrganizationGetProps,
    IOrganizationProps,
    IOrganizationUpdterops
} from '../utils/types';
import { Organization } from "../model/organization";
import { insertLog } from '../eventLog';

export const post = (data: IOrganizationInputProps) => {
    return new Promise((resolve, reject) => {
        try {
            Organization.find({ name: data.name })
                .then((organization) => {
                    if (organization && organization?.length > 0) reject({ code: 'already_exists', message: 'There is an existing Organization with the specified data', data })
                    else createOrganization(data)
                        .then(res => resolve(res))
                        .catch(err => reject(err))

                })
                .catch(err => {
                    if (err?.message === `Cannot read property '_id' of null`) createOrganization(data)
                        .then(res => resolve(res))
                        .catch(err => reject(err))

                    else {
                        console.log(err);
                        reject({ code: 'bad_request', message: 'Check the data send', err })
                    }
                });
        } catch(err) {
            console.log(err)
            reject(err)
        }
    });
}

const createOrganization = (data: IOrganizationInputProps) => {
    return new Promise((resolve, reject) => {
        Organization.create(data).then(async org => {
            org.save();
            const log: IEventLogInputProps = {
                dateCreated: new Date(),
                model: 'Organization',
                type: 'post',
                message: `Organization ${data.name} was saved to DB successfuly`
            }
            await insertLog(log)
            resolve('Organization created successfuly')
        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    })
}

export const put = (data: IOrganizationPutProps) => {
    return new Promise((resolve, reject) => {
        if (!('id' in data)) {
            reject({ code: 'bad_request', message: 'Check the data send' });
            return;
        }
        if (Object.keys(data).length > 0) {
            let id = data.id
            let update: IOrganizationUpdterops = {}
            if (data.countryId) update.countryId = data.countryId
            if (data.name) update.name = data.name
            if (data.provinceId) update.provinceId = data.provinceId
            Organization.findOneAndUpdate({ _id: id }, { $set: update })
                .then(async (org: IOrganizationProps) => {
                    org.save();
                    const log: IEventLogInputProps = {
                        dateCreated: new Date(),
                        model: 'Organization',
                        type: 'put',
                        message: `Organization ${org.name} was updated successfuly`
                    }
                    await insertLog(log)
                    resolve('Organization updated successfuly')
                })
                .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
        } else reject({ code: 'bad_request', message: 'You sent no new data to update' })
    });
}

export const get = (data: IOrganizationGetProps) => {
    return new Promise((resolve, reject) => {
        Organization.findById(data)
            .then(org => {
                resolve({ message: 'Organization found successfuly', org })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const bulkOrganization = (data: IOrganizationInputProps[]) => {
    console.log('called bulkOrganization')
    return new Promise((resolve, reject) => {
        try {
            //@ts-ignore
            let promises = [];
            data.map(cert => {
                promises.push(post(cert))
            })
            //@ts-ignore
            let results = Promise.allSettled(promises);
            results
                .then(() => {
                    resolve('Organization created successfuly')
                })
                .catch(err => {
                    console.log('bulkOrganization error:')
                    console.log(err)
                    resolve({ code: 'bad_request', message: 'Check the data send', err })
                })

        } catch (err) {
            // console.log(err);
            reject({ code: 'server_error', message: 'Something went wrong', err });
            return;
        }
    })
}