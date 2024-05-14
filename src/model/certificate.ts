import mongoose, { Schema } from "mongoose";
import { ICertificateInputProps } from '../utils/types';

export const CertificateSchema: Schema = new Schema({
    serialNumber: { type: String, required: true, unique: true },
    degree: { type: String, required: true },
    language1: { type: String, required: true },
    language2: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    students_id: { type: [String], default: null },
    inputDate: { type: Date, default: new Date() },
    affiliation: { type: String, required: true },
})

export const Certificate = mongoose.model<ICertificateInputProps>("certificate", CertificateSchema);