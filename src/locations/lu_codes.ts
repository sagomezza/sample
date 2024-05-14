import { ILUInputCodeProps, IEventLogInputProps, ILUGetCodeProps } from "../utils/types";
import { LuCode } from "../model/lu_codes";
import { insertLog } from '../eventLog';

export const post = (data: ILUInputCodeProps) => {
    return new Promise((resolve, reject) => {
        try {
            LuCode.find({ country: data.country })
            .then((country) => {
                if (country && country?.length > 0) reject({ code: 'already_exists', message: 'There is an existing LuCode with the specified data', data })
                else createLuCode(data)
                    .then(res => resolve(res))
                    .catch(err => reject(err))

            })
            .catch(err => {
                if (err?.message === `Cannot read property '_id' of null`) createLuCode(data)
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

const createLuCode = (data: ILUInputCodeProps) => {
    return new Promise((resolve, reject) => {
        LuCode.create(data).then(async country => {
            country.save();
            const log: IEventLogInputProps = {
                dateCreated: new Date(),
                model: 'LU_Code',
                type: 'post',
                message: `The country ${data.country} was saved to DB successfuly`
            }
            await insertLog(log)
            resolve('Country created successfuly')
        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err, dataSend: data }));
    })
}

export const get = (data: ILUGetCodeProps) => {
    return new Promise((resolve, reject) => {
        LuCode.findById(data)
            .then(country => {
                resolve({ message: 'Country found successfuly', country })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const put = (data: ILUInputCodeProps) => {
    return new Promise((resolve, reject) => {
        if (!('country' in data)) {
            reject({ code: 'bad_request', message: 'Check the data send' });
            return;
        }
        const country = data.country;
        delete data.country;
        if (Object.keys(data).length > 0) {
            let update: any = {}
            if (data.abbreviation) update.abbreviation = data.abbreviation;
            if (data.flag) update.flag = data.flag;
            if (data.calling_code) update.calling_code = data.calling_code;
            LuCode.findOneAndUpdate({ country }, { $set: update })
                .then(async resultCountry => {
                    resultCountry.save();
                    const log: IEventLogInputProps = {
                        dateCreated: new Date(),
                        model: 'LU_Code',
                        type: 'put',
                        message: `Country ${country} was updated successfuly`
                    }
                    await insertLog(log)
                    resolve('Country updated successfuly')
                })
                .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
        } else reject({ code: 'bad_request', message: 'You sent no new data to update' })
    });
}

export const bulkLUCode = (data: ILUInputCodeProps[]) => {
    console.log('called bulkLUCode')
    return new Promise((resolve, _reject) => {
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
                    resolve('Countries created successfuly')
                }).catch(err => {
                    console.log('bulkLUCode error:')
                    console.log(err)
                    resolve({ code: 'bad_request', message: 'Check the data send', err })
                })

        } catch (err) {
            //console.log(err)  
        }
    })
}