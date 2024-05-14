import { IProvinceInputProps, IEventLogInputProps, IProvinceGetProps } from "../utils/types";
import { Province } from "../model/province";
import { insertLog } from '../eventLog';

export const post = (data: IProvinceInputProps) => {
    return new Promise((resolve, reject) => {
        try {
            Province.find({ province: data.province, countryId: data.countryId })
            .then((country) => {
                if (country && country?.length > 0) reject({ code: 'already_exists', message: 'There is an existing Province with the specified data', data })
                else createProvince(data)
                    .then(res => resolve(res))
                    .catch(err => reject(err))

            })
            .catch(err => {
                if (err?.message === `Cannot read property '_id' of null`) createProvince(data)
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

const createProvince = (data: IProvinceInputProps) => {
    return new Promise((resolve, reject) => {
        Province.create(data).then(async user => {
            user.save();
            const log: IEventLogInputProps = {
                dateCreated: new Date(),
                model: 'Province',
                type: 'post',
                message: `The province ${data.province} was saved to DB successfuly`
            }
            await insertLog(log)
            resolve('Province created successfuly')
        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err, dataSend: data }));
    })
}

export const get = (data: IProvinceGetProps) => {
    return new Promise((resolve, reject) => {
        Province.findById(data)
            .then(country => {
                resolve({ message: 'Province found successfuly', country })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const put = (data: IProvinceInputProps) => {
    return new Promise((resolve, reject) => {
        if (!('province' in data)) {
            reject({ code: 'bad_request', message: 'Check the data send' });
            return;
        }
        const province = data.province;
        delete data.province;
        if (Object.keys(data).length > 0) {
            let update: any = {}
            if (data.countryId) update.countryId = data.countryId;
            if (data.flag) update.flag = data.flag;
            if (data.calling_code) update.calling_code = data.calling_code;
            Province.findOneAndUpdate({ province }, { $set: data })
                .then(async resultCountry => {
                    resultCountry.save();
                    const log: IEventLogInputProps = {
                        dateCreated: new Date(),
                        model: 'Province',
                        type: 'put',
                        message: `Province ${province} was updated successfuly`
                    }
                    await insertLog(log)
                    resolve('Province updated successfuly')
                })
                .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
        } else reject({ code: 'bad_request', message: 'You sent no new data to update' })
    });
}

export const bulkProvince = (data: IProvinceInputProps[]) => {
    console.log('called bulkProvince')
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
                    resolve('Province created successfuly')
                }).catch(err => {
                    console.log('bulkProvince error:')
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