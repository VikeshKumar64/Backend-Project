import { Router } from "express";
import { resgisterUser } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middlewares.js';

const router = Router() 

router.route("/register").post(
    upload.fields([
        {
            name: "avtar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    resgisterUser
)

export default router;