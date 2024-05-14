import { Document, ObjectId } from "mongoose";
import { Response } from "express";
import { STATUS_CODES } from "./status_codes";

export interface IAuthProps {
    email: string;
    password: string;
}

export interface IRegisterProps extends IAuthProps {
    serialNumber: string
}

export interface IRegisterProcessProps extends IRegisterProps {
    user: IUserProps;
}
export interface IUserInputProps {
    name: string;
    last_name: string;
    email: string;
    org_id?: IOrganizationProps['_id'];
    auth_token?: string | undefined;
    type: string;
    registarInfo?: object | undefined;
    applicantInfo?: {
        city?: string;
        state?: string;
        country?: string;
        dob? :string;
        title? :string;
        affiliation? :string;
        languages? :string[];
        journey? :string;
        linkedIn?: string;
        twitter?: string;
    } | undefined;
    role?: string;
    public: boolean;
    profilePic?: string;
    alternativeId?: string;
}

export interface IUserProps extends IUserInputProps, Document {
    password?: string | undefined;
}

declare global {
    namespace Express {
        interface User extends IUserProps {
            prop?: string
        }
    }
}

export interface IUserPutProps {
    email: string;
    newEmail?: string;
    name?: string;
    last_name?: string;
    registarInfo?: object | undefined;
    applicantInfo: {
        city?: string;
        state?: string;
        country?: string;
        dob? :string;
        title? :string;
        affiliation? :string;
        languages? :string[];
        journey? :string;
        linkedIn?: string;
        twitter?: string;
    } | undefined;
    password?: string;
    public: boolean;
    profilePic?: string;
    certs?: ICertificateInputProps[];
}

export interface IUserGetProps {
    email: string;
}
export interface IUserGetByIdProps {
    _id: ObjectId;
}

export interface IErrorProps {
    code: keyof typeof STATUS_CODES;
    message: string;
    err?: object;
}

export interface IErrorHandlerProps {
    err: IErrorProps;
    res: Response;
}

export interface IResProps {
    message?: string;
    user?: IUserProps;
}

export interface IEventLogInputProps {
    dateCreated: Date;
    model: string;
    type: string;
    message: string;
}

export interface IEventLogProps extends IEventLogInputProps {
    _id: ObjectId;
}

export interface IEventLogFilter {
    model?: string;
    type?: string;
    value?: string;
    dateCreated?: string;
}

export interface ILUInputCodeProps {
    country: string;
    abbreviation: string;
    flag?: string;
    calling_code?: number;
}

export interface ILUCodeProps extends Document {
    country: string;
    abbreviation: string;
    flag?: string;
    calling_code?: number;
}

export interface ILUGetCodeProps {
    abbreviation: string;
}

export interface ILUGetCode {
    id: string;
    post?: boolean;
}

export interface IProvinceInputProps {
    province: string;
    countryId: ILUCodeProps['country'],
    flag?: string;
    calling_code?: number;
}

export interface IProvinceGetProps {
    province: string;
}

export interface IProvinceGet {
    id: string;
    post?: boolean;
}

export interface IProvinceProps extends Document {
    province: string;
    countryId: ILUCodeProps['country'],
    flag?: string;
    calling_code?: number;
}

export interface IOrganizationInputProps {
    name: string;
    countryId: ILUCodeProps['country'];
    provinceId?: IProvinceProps['province'];
}

export interface IOrganizationGetProps {
    name: string;
}

export interface IOrganizationGet {
    id: string;
    post?: boolean;
}

export interface IOrganizationProps extends Document, IOrganizationInputProps {
    _id: ObjectId;
}

export interface IOrganizationPutProps {
    id: ObjectId;
    name?: string;
    countryId?: ILUCodeProps['country'];
    provinceId?: IProvinceProps['province'];
}

export interface IOrganizationUpdterops {
    name?: string;
    countryId?: ILUCodeProps['country'];
    provinceId?: IProvinceProps['province'];
}

export interface IOrderInputProps {
    _id: string
    requestedBy: IUserProps['_id'];
    details: string;
    students: IUserInputProps[];
}

export interface IOrderGetProps {
    _id: string
}

export interface IOrderGet {
    id: string;
    post?: boolean;
}

export interface IOrderProps extends IOrderInputProps, Document {
    _id: string
}
export interface ICertificateInputProps {
    serialNumber: string;
    name: string;
    lastName: string;
    degree: string;
    language1: string;
    language2: string;
    students_id?: string[];
    state: string;
    country: string;
    inputDate: Date;
    affiliation?: string;
}

export interface ICertificateGetProps {
    order_id: IOrderProps["_id"];
}

export interface ICertificateProps extends ICertificateInputProps, Document { }

export interface ICertificateGet {
    id: string;
    post?: boolean;
}

export interface ICertificateValidateProps {
    serialNumber: string;
    name: string;
    lastName: string;
    fluency: string;
}

export interface ICertAssociate {
    email: string;
    serial: string;
    fluency: string;
    lng1: string;
    lng2: string;
}

export interface IAllData {
    certificates?: ICertificateInputProps[];
    lu_codes?: ILUInputCodeProps[];
    orders?: IOrderInputProps[];
    organizations?: IOrganizationInputProps[];
    provinces?: IProvinceInputProps[];
    users?: IUserInputProps[];
}

export interface InputData {
    allData: object[];
}

export interface IRecordData {
    serialNumber: string,
    submitEmail: string,
    submitName: string,
    lastNameSubmit: string,
    medalsPurchased: string,
    pinsPurchased: string,
    orderNumber: string,
    certificateMailed: string,
    verified: string,
    inputDate: string,
    extraSeal: string,
    country: string,
    orgCode: string,
    ell: string,
    schoolName: string,
    state: string,
    firstName: string,
    lastname: string,
    awardEarned: string,
    language1: string,
    language2: string,
    lang2Test: string,
    testScale: string,
    alternativeId?: string;
}