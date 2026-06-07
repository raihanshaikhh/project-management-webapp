import { Router } from "express";
import {loginUser, userRegister, logOut, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, currentUser, changePassword, resendEmail, generateAccessAndRefreshTokens} from "../controller/userAuth.controller.js"
import { validate } from "../middlewares/vlidators.middleware.js";
import { userRegistorValidator,loginUserValidator,userForgotPasswordValidator,userResetForgotPasswordValidator,userChangePasswordValidator } from "../validators/index.js";
import {verifyJWT} from "../middlewares/auth.midleware.js"
import passport from "../utils/passport.js";



const router = Router()
//unsecured route
router.route("/register").post(userRegistorValidator(), validate, userRegister)
router.route("/login").post(loginUserValidator(),validate,loginUser)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").get(userForgotPasswordValidator(),validate, forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword)


//secure route
router.route("/logout").post(verifyJWT, logOut)
router.route("/current-user").get(verifyJWT, currentUser)
router.route("/change-password").post(verifyJWT,userChangePasswordValidator(), validate, changePassword )
router.route("/resend-email-verification").post(verifyJWT, resendEmail)

//google auth routes

// Google OAuth
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const { accessToken } = await generateAccessAndRefreshTokens(req.user._id);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      const userPayload = encodeURIComponent(JSON.stringify({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      }));

      res
        .cookie("accessToken", accessToken, options)
        .redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${accessToken}&user=${userPayload}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${process.env.CLIENT_URL}/auth?error=google_failed`);
    }
  }
);

export default router;