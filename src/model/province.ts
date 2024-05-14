import mongoose, { Schema } from "mongoose";
import { IProvinceProps } from '../utils/types';

export const ProvinceSchema: Schema = new Schema({
    province: {type: String, unique: true,  _id: true, required: true},
    countryId: {type: String, required: true},
    flag: {type: String, default: null},
    calling_code: {type: Number, default: null}
})

export const Province = mongoose.model<IProvinceProps>("province", ProvinceSchema);