import {Router} from "express"
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js"
import authorize from "../middlewares/auth.middleware.js"


const authRouter = new Router()

authRouter.post('/login', signIn)

authRouter.post("/sign-up", signUp)

authRouter.post('/logout', signOut)

authRouter.get('/me',authorize, getUser);

export default authRouter;