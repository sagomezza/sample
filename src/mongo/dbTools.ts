import {
    IAllData,
    ICertificateInputProps,
    IEventLogInputProps,
    ILUInputCodeProps,
    InputData,
    IOrganizationInputProps,
    IProvinceInputProps,
    IRecordData,
    IUserInputProps
} from '../utils/types';;
import { bulkCertificate } from "../certificate";
import { bulkLUCode } from "../locations/lu_codes";
import { bulkProvince } from "../locations/province";
import { bulkOrder } from "../order";
import { bulkOrganization } from "../organization";
import { bulkUser } from "../user";
import { insertLog } from "../eventLog";
import { User } from "../model/user";
import { countriesList } from "../utils/countries";
import { Certificate } from "../model/certificate";

let backUp: IAllData = {}

// let admins: IUserInputProps[] = []
// let consumers: IUserInputProps[] = []

export const getCollections = async () => {
    console.log('getCollections')
    try {
        let users = await User.find({});
        let certificates = await Certificate.aggregate([
            { $group: { _id: null, result: { $addToSet: '$serialNumber' } } },
            { $project: { _id: 0, result: 1 } }
        ]);
        console.log(certificates?.length, users.length, (!certificates?.length || certificates?.length === 0) && users.length && users.length <= 4 )
        if ((!certificates?.length || certificates?.length <= 4) && users.length && users.length <= 4) return '1'
        else {
            backUp.certificates = certificates[0].result;
            return '2'
        }
    } catch (err) {
        console.log(err);
        return err
    }
}

export const updateDatabase = (inputData: InputData) => {
    return new Promise((resolve, reject) => {
        try {
            getCollections().then((res: string) => {
                try {
                    console.log(res)

                    if (res === '1') {
                        console.log('mapData case 1')
                        mapData(inputData)
                            .then((data: IAllData) => {
                                migratingData(data)
                                    .then(res => resolve(res))
                                    .catch(err => reject(err))
                            })
                            .catch(err => reject(err))

                    } else if (res === "2") {
                        console.log('mapData case 2')
                        let newCertificates = inputData.allData.filter((data: IRecordData) => {
                            //@ts-ignore
                            return !backUp.certificates.includes(data.serialNumber)
                        });
                        console.log('newCertificates filter')
                        if (newCertificates.length > 0) {
                            console.log('newCertificates length greater than 0')
                            let newData = { allData: newCertificates }
                            mapData(newData)
                                .then((data: IAllData) => {
                                    migratingData(data)
                                        .then(res => resolve(res))
                                        .catch(err => reject(err))
                                })
                                .catch(err => reject(err))

                        } else {
                            resolve('Nothing new to update!');
                            return;
                        }
                    } else {
                        handleError(reject, res);
                    }
                } catch (err) {
                    handleError(reject, err);
                }
            }).catch(err => {
                console.log(`${new Date()}:`, 'error while getting existing records from database')
                console.log(err);
                const log: IEventLogInputProps = {
                    dateCreated: new Date(),
                    model: 'Migrate',
                    type: 'post',
                    message: err
                }
                insertLog(log).then(() => {
                    reject({ code: 'server_error', message: 'Something went wrong', err })
                    return;
                })
            })
        } catch (err) {
            console.log('Error inside updateDatabase. Error message:')
            console.log(err)
            handleError(reject, err);
        }
    });
}

const mapData = (inputData: InputData) => {
    console.log('mapData called')
    return new Promise((resolve, reject) => {
        try {
            let data: IAllData = {
                certificates: [],
                lu_codes: [{ country: 'United States of America', abbreviation: 'US' }],
                orders: [],
                organizations: [],
                provinces: [],
                users: []
            };
            let provinces: IProvinceInputProps[] = [];
            let organizations: IOrganizationInputProps[] = [];
            let countries: ILUInputCodeProps[] = [];
            console.log('inputData.allData.forEach')
            inputData.allData.forEach((record: IRecordData) => {
                try {
                    let certificate: ICertificateInputProps = {
                        serialNumber: record.serialNumber,
                        name: record.firstName,
                        lastName: record.lastname,
                        degree: record.awardEarned,
                        language1: record.language1,
                        language2: record.language2,
                        state: record.state,
                        country: record.country,
                        inputDate: new Date(record.inputDate),
                        affiliation: record.schoolName
                    };
                    if (certificate.name) data.certificates.push(certificate)
                    if (record?.submitName) {
                        let registar: IUserInputProps = {
                            name: record.submitName,
                            last_name: record.lastNameSubmit,
                            email: record.submitEmail,
                            type: 'registar',
                            registarInfo: {},
                            role: 'user',
                            public: false,
                            alternativeId: record.alternativeId
                        };
                        data.users.push(registar);
                    } else {
                        let user: IUserInputProps = {
                            name: record.firstName,
                            last_name: record.lastname,
                            email: "",
                            type: 'applicant',
                            applicantInfo: {},
                            role: 'user',
                            public: false,
                            alternativeId: record.alternativeId
                        }
                        if (user.name) data.users.push(user);
                    }
                    let organization: IOrganizationInputProps = {
                        name: record.schoolName,
                        countryId: record.country,
                        provinceId: record.state
                    }
                    if (organization.name) organizations.push(organization);
                    let country: ILUInputCodeProps = {
                        abbreviation: record.country,
                        //@ts-ignore
                        country: countriesList[record?.country] ?? record.country
                    }
                    if (country.country) countries.push(country);
                    let province: IProvinceInputProps = {
                        province: record.state,
                        countryId: record.country
                    }
                    if (province.province) provinces.push(province);
                } catch (err) {
                    console.log('Error inside inputData.allData.forEach. Error message:')
                    console.log(err);
                    console.log("Data:")
                    console.log(record)
                }   
            });
            data.provinces = [
                ...new Map(provinces.map((item: IProvinceInputProps) => [item["province"], item])).values(),
            ]
            data.organizations = [
                ...new Map(organizations.map((item: IOrganizationInputProps) => [item["name"], item])).values(),
            ]
            data.lu_codes = [
                ...new Map(countries.map((item: ILUInputCodeProps) => [item["abbreviation"], item])).values(),
            ]
            console.log('filgtering duplicates')
            // console.log(admins.length);
            // console.log(consumers)
            // if (admins.length > 0) {
            //     // console.log(data.users.length);
            //     let users = data.users.concat(admins);
            //     // console.log(data.users.length);
            //     data.users = users;
            // }
            // if (consumers.length > 0) {
            //     // console.log(data.users.length);
            //     let users = data.users.concat(consumers);
            //     // console.log(data.users.length);
            //     data.users = users;
            // }
            resolve(data);
        } catch (err) {
            console.log('Error inside mapData. Error message:')
            console.log(err)
            reject({ code: 'server_error', message: 'Something went wrong', err })
        }
    })
}

const migratingData = (data: IAllData) => {
    console.log("inside migratingData")
    return new Promise((resolve, reject) => {
        try {
            let uniqueUserArray = [...new Map(data.users.map((item) => [item["alternativeId"], item])).values()];
            let promises = [];
            console.log("before bulks")
            if (data.certificates.length > 0) promises.push(bulkCertificate(data.certificates));
            if (data.lu_codes.length > 0) promises.push(bulkLUCode(data.lu_codes));
            if (data.orders.length > 0) promises.push(bulkOrder(data.orders));
            if (data.organizations.length > 0) promises.push(bulkOrganization(data.organizations));
            if (data.provinces.length > 0) promises.push(bulkProvince(data.provinces));
            if (data.users.length > 0) promises.push(bulkUser(uniqueUserArray));
            console.log('seting up results')
            //@ts-ignore
            let results = Promise.allSettled(promises);
            console.log('waiting for results')
            results
                .then(() => {
                    console.log("bulks results")
                    // console.log('resolve');
                    backUp = {};
                    resolve('Migrated data successfully');
                    return;
                })
                .catch(err => {
                    if (err?.err?.code === 'already_exists') {
                        resolve('Migrated data successfully');
                        return;
                    } else {
                        console.log('/catch from bulk promises')
                        console.log(err)
                        const log: IEventLogInputProps = {
                            dateCreated: new Date(),
                            model: 'Migrate',
                            type: 'post',
                            message: err
                        }
                        insertLog(log).then(() => {
                            reject({ code: 'server_error', message: 'Something went wrong', err })
                            return;
                        })
                        reject({ code: 'bad_request', message: 'Check the data send', err });
                        return;
                    }

                });
        } catch (err) {
            console.log('Error inside migratingData. Error message:')
            console.log(err);
            return err;
        }
    })
}

const handleError = (reject: any, err: any) => {
    // console.log(`${new Date()}:`, 'error while migrating database')
    // console.log(err);
    const log: IEventLogInputProps = {
        dateCreated: new Date(),
        model: 'DB',
        type: 'post',
        message: `Error while migrating databse`
    }
    insertLog(log).then(() => {
        migratingData(backUp)
            .then(() => {
                reject({ code: 'server_error', message: 'Something went wrong', err })
                return;
            }).catch(err => {
                // console.log(`${new Date()}:`, 'error while migrating  backup database')
                // console.log(err);
                reject({ code: 'server_error', message: 'Something went wrong', err })
                return;
            })

    })
}

