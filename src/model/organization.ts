import mongoose, { Schema } from "mongoose";
import { IOrganizationProps } from '../utils/types';

export const OrganizationSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    countryId: { type: String, default: null},
    provinceId: { type: String, default: null },
});

export const Organization = mongoose.model<IOrganizationProps>("organization", OrganizationSchema);