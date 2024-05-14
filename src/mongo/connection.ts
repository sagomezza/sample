import mongoose from "mongoose";

interface IConnectionMongo {
  MONGO_URI: string,
  MONGO_DB: string,
}

export const connect = ({ MONGO_URI, MONGO_DB }: IConnectionMongo) => {
  mongoose
    .connect(`${MONGO_URI}/${MONGO_DB}`)
    .then(() => {
      // tslint:disable-next-line:no-console
      console.log("Successfully connected to database");
    })
    .catch((error: any) => {
      // tslint:disable-next-line:no-console
      console.log("database connection failed. exiting now...");
      // tslint:disable-next-line:no-console
      console.error(error);
      process.exit(1);
    });
};
