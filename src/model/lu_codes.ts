import mongoose, { Schema } from "mongoose";
import { ILUCodeProps } from '../utils/types';

export const LuCodeSchema: Schema = new Schema({
    country: {type: String, unique: true,  _id: true, required: true},
    abbreviation: {type: String, required: true},
    flag: {type: String, default: null},
    calling_code: {type: Number, default: null}
})

export const LuCode = mongoose.model<ILUCodeProps>("lu_code", LuCodeSchema);