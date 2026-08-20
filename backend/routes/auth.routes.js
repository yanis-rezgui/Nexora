import {Router} from "express"
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js"
import authorize from "../middlewares/auth.middleware.js"
import { forgotPassword, resetPassword } from "../controllers/forgotPassword.controller.js";


const authRouter = new Router()

authRouter.post('/login', signIn)

authRouter.post("/sign-up", signUp)

authRouter.post('/logout', signOut)

authRouter.get('/me',authorize, getUser);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;