import {config} from "dotenv"
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;


if (process.env.NODE_ENV !== "production") {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
}

export const {
    NODE_ENV,
    PORT,
        DATABASE_URL,
    ACCESS_TOKEN_SECRET,
REFRESH_TOKEN_SECRET,
ACCESS_TOKEN_EXPIRATION,
REFRESH_TOKEN_EXPIRATION,
CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET,
CLOUDINARY_CLOUD_NAME,
RESEND_API_KEY,
CLIENT_URL
} = process.env;


cloudinary.config({ 
    cloud_name : CLOUDINARY_CLOUD_NAME,
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET
});


export  {cloudinary}; 