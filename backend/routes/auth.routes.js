import {Router} from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controller.js"


const authRouter = new Router()

authRouter.post('/login', signIn)

authRouter.post("/sign-up", signUp)

authRouter.post('/logout', signOut)

export default authRouter;