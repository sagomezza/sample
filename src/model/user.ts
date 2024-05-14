import mongoose, { Schema } from "mongoose";
import { IUserProps } from '../utils/types';

export const UserSchema: Schema = new Schema({
    name: { type: String },
    last_name: { type: String },
    email: { type: String, default: null },
    password: { type: String, default: null },
    org_id: { type: String, default: null },
    auth_token: { type: String, default: null },
    type: { type: String },
    registarInfo: { type: JSON, default: null },
    applicantInfo: { type: JSON, default: null },
    role: { type: String, default: null },
    public: { type: Boolean, default: false },
    profilePic: { type: String, default: null },
    alternativeId: { type: String },
});

export const User = mongoose.model<IUserProps>("user", UserSchema);