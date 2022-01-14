import load from "../pb/loader";
import dotenv from "dotenv";

dotenv.config();

export const PharmacyClient = load({
	serviceName: "PharmacyService",
	address: `${process.env.APP_HOST}:50051`,
	fileName: "pharmacy",
});
