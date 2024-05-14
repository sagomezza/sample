import mongoose, { Schema } from "mongoose";
import { IOrderProps } from '../utils/types';

export const OrderSchema: Schema = new Schema({
    requestedBy: { type: String },
    details: { type: String },
    students: { type: Array },
});

export const Order = mongoose.model<IOrderProps>("order", OrderSchema);