import {Router} from "express"
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js"
import authorize from "../middlewares/auth.middleware.js"
import { forgotPassword, resetPassword } from "../controllers/forgotPassword.controller.js";
import { loginLimiter, passwordLimiter, signUpLimiter } from "../middlewares/rateLimit.middleware.js";


const authRouter = new Router()

authRouter.post('/login', loginLimiter, signIn) 

authRouter.post("/sign-up", signUpLimiter, signUp)

authRouter.post('/logout', signOut)

authRouter.get('/me',authorize, getUser);

authRouter.post("/forgot-password",passwordLimiter, forgotPassword);
authRouter.post("/reset-password", passwordLimiter, resetPassword);

export default authRouter;