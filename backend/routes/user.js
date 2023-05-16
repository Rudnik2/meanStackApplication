const express = require("express");
const multer = require("multer");

const UserController = require("../controllers/user");

const router = express.Router();
const checkAuth = require("../middleware/chech-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUser);

router.get("", UserController.getUsers);

router.put(
  "/changeImage/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  UserController.updateUser
);

router.put("/follow/:id", checkAuth, UserController.followUser);

router.put("/unfollow/:id", checkAuth, UserController.unfollowUser);

router.put("/notification/:id", checkAuth, UserController.updateSummary);

router.get("/confirm/:confirmationCode", UserController.verifyUser);

router.post("/req-reset-password", UserController.resetPassword);

router.post("/new-password", UserController.newPassword);

router.post("/valid-password-token", UserController.ValidPasswordToken);

module.exports = router;
