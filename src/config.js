import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 4000;
export const CONNECTION_STRING = process.env.CONNECTION_STRING
export const TOKEN_SECRET = process.env.TOKEN_SECRET

export const ADMIN_USER = process.env.ADMIN_USER
export const ADMIN_PASS = process.env.ADMIN_PASS 
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL 

export const LOGIN_USER_TOKEN = process.env.LOGIN_USER_TOKEN
export const LOGIN_ADMIN_TOKEN = process.env.LOGIN_ADMIN_TOKEN