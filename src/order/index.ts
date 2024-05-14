import { IOrderInputProps, IEventLogInputProps, IOrderGetProps } from '../utils/types';
import { Order } from "../model/order";
import { insertLog } from '../eventLog';

export const post = (data: IOrderInputProps) => {
    return new Promise((resolve, reject) => {
        try {
            Order.create(data).then(async org => {
                org.save();
                const log: IEventLogInputProps = {
                    dateCreated: new Date(),
                    model: 'Order',
                    type: 'post',
                    message: `Order was saved to DB successfuly`
                }
                await insertLog(log)
                resolve('Order created successfuly')
            }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err, dataSend: data }));
        } catch(err){
            console.log(err)
            reject(err)
        }
    });
}

export const get = (data: IOrderGetProps) => {
    return new Promise((resolve, reject) => {
        Order.findById(data)
            .then(org => {
                resolve({ message: 'Order found successfuly', org })
            })
            .catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    });
}

export const bulkOrder = (data: IOrderInputProps[]) => {
    console.log('called bulkOrder')
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
                    resolve('Order created successfuly')
                })
                .catch(err => {
                    console.log('bulkOrder error:')
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