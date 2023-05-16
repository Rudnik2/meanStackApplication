const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const goal = require("../models/goal");
const User = require("../models/user");
const passwordResetToken = require("../models/resetToken");
const sendEmail = require("../utils/sendEmail");
const resetPassword = require("../utils/resetPassword");
const crypto = require("crypto");

exports.createUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const mailToken = jwt.sign({ email: req.body.email }, process.env.JWT_KEY);

    const user = new User({
      Imie: req.body.Imie,
      Nazwisko: req.body.Nazwisko,
      email: req.body.email,
      password: hash,
      imagePath: url + "/images/defaultImage.png",
      followers: req.body.followers,
      followings: req.body.followings,
      summaryType: req.body.summaryType,
      summaryNotificationDate: req.body.summaryNotificationDate,
      confirmationCode: mailToken,
    });
    user
      .save()
      .then((result) => {
        sendEmail(user.Imie, user.email, user.confirmationCode);
        res.status(201).json({
          message: "User was registered successfully! Please check your email",
          result: user,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Podany email jest już zajęty",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      //we find the user
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      //result of the compare operation
      if (!result) {
        return res.status(401).json({
          message: "Comparison failed",
        });
      }
      if (fetchedUser.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
      //we have valid password
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: "Invalid authentication credentials",
        error: err,
      });
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching user failed" });
    });
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then((documents) => {
      //console.log(documents);
      res.status(200).json({
        message: "Posts fetched succesfully",
        users: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed" });
    });
};

exports.updateUser = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  User.updateOne(
    { _id: req.params.id },
    { $set: { imagePath: url + "/images/" + req.file.filename } }
  )
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Update Succesfull",
          imagePath: url + "/images/" + req.file.filename,
        });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post",
      });
    });
};

exports.followUser = async (req, res) => {
  //console.log(req.body.id);  ten, który followuje
  //console.log(req.params.id); ten followany

  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (!user.followers.includes(req.body.id)) {
        await user.updateOne({ $push: { followers: req.body.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant follow urself");
  }
};

exports.unfollowUser = async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (user.followers.includes(req.body.id)) {
        await user.updateOne({ $pull: { followers: req.body.id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow urself");
  }
};
exports.updateSummary = (req, res, next) => {
  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        summaryType: req.body.summaryType,
        summaryNotificationDate: req.body.summaryNotificationDate,
      },
    }
  )
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update Succesfull", user: User });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post",
      });
    });
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};

exports.resetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(500).json({ message: "Email is required" });
  }
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(409).json({ message: "Email does not exist" });

  var resettoken = new passwordResetToken({
    _userId: user._id,
    resettoken: crypto.randomBytes(16).toString("hex"),
  });

  resettoken.save(function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }

    passwordResetToken
      .find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } })
      .remove()
      .exec();

    res.status(200).json({ message: "Reset Password successfully." });

    resetPassword(user.Imie, user.email, resettoken.resettoken);
  });
};

exports.ValidPasswordToken = async (req, res) => {
  if (!req.body.resettoken) {
    console.log("tu?2");
    return res.status(500).json({ message: "Token is required" });
  }
  const userToken = await passwordResetToken.findOne({
    resettoken: req.body.resettoken,
  });

  if (!userToken) {
    return res.status(409).json({ message: "Invalid URL" });
  }

  User.findById(userToken._userId).then((user) => {
    if (user) {
      res.status(200).json({ message: "Token verified successfully." });
    } else {
      return res.status(500).send({ msg: err.message });
    }
  });
};

exports.newPassword = async (req, res) => {
  passwordResetToken.findOne(
    { resettoken: req.body.resettoken },
    function (err, userToken, next) {
      if (!userToken) {
        return res.status(409).json({ message: "Token has expired" });
      }

      User.findOne({ _id: userToken._userId }, function (err, userEmail, next) {
        if (!userEmail) {
          return res.status(409).json({ message: "User does not exist" });
        }

        return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(400).json({ message: "Error hashing password" });
          }
          userEmail.password = hash;

          userEmail.save(function (err) {
            if (err) {
              return res
                .status(400)
                .json({ message: "Password can not reset." });
            } else {
              userToken.remove();
              return res
                .status(201)
                .json({ message: "Password reset successfully" });
            }
          });
        });
      });
    }
  );
};
