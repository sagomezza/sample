import { EventLog } from "../model/eventLog"
import { IEventLogInputProps } from "../utils/types"

export const insertLog = (data: IEventLogInputProps) => {
    return new Promise((resolve, reject) => {
        EventLog.create(data).then(user => {
            user.save();
            resolve('User create successfuly')
        }).catch(err => reject({ code: 'bad_request', message: 'Check the data send', err }));
    })
}

export const listEventLogs = () => {
    return new Promise((resolve, reject) => {
        EventLog.find({})
            .then(results => {
                resolve({message: 'EventLogs', eventLogs: results})
            })
            .catch(err => reject(err))
    })
}