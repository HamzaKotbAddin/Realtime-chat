import { Router} from "express";
import { signUp, login, getUserInfo, updateProfile, updateImage, removeImage, logout } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import multer from "multer";


const authRouter = Router();
const upload = multer({ dest: "uploads/profiles/" });


authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.put("/update-user-info", verifyToken, updateProfile);
authRouter.put("/update-user-image", verifyToken, upload.single("profile-image"), updateImage);
authRouter.delete("/remove-user-image", verifyToken, removeImage);

export default authRouter;

