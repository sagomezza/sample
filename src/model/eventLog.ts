import { IEventLogInputProps } from "../utils/types";
import mongoose, { Schema } from "mongoose";

export const EventLogSchema: Schema = new Schema({
    dateCreated: { type: Date },
    model: { type: String },
    type: { type: String },
    message: { type: String },
});

export const EventLog = mongoose.model<IEventLogInputProps>("eventLog", EventLogSchema);