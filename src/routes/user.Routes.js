import { Router } from "express";
import {createUser,login, deleteUser, updatePremiumUser} from "../controllers/user.Controller.js"
import { verifyUserToken } from "../helpers/verifyUserToken.js"
const router = Router();

router.post("/user", createUser);
router.post("/login", login);
router.delete("/user", deleteUser)
router.patch("/user",verifyUserToken, updatePremiumUser)

export default router