import {Router} from "express"
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js"


const authRouter = new Router()

authRouter.post('/login', signIn)

authRouter.post("/sign-up", signUp)

authRouter.post('/logout', signOut)

authRouter.get('/me', getUser);

export default authRouter;