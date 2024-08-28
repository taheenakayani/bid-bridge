const { generateToken, verifyToken } = require("../../authentication/token");
const Bid = require("../../db/models/bid");
const Task = require("../../db/models/task");
const User = require("../../db/models/user");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = 'xyz';
const CLIENT_SECRET = 'xyz';
const REFRESH_TOKEN = '1//04r6lbB0Mxw_vCgYIARAAGAQSNwF-L9IrH9SLCnA1WAk5upb8LllK6pcnIDY3jMWYMfNOh67Vhu1rrJQONAJNOnd7gnnJcJurBuc';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

const userController = {
  registerUser: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        avatar: null,
        data: { verified: false }
      });

      console.log(newUser);

      // Save the new user record to the database
      user = await newUser.save();

      // send verification email
      const accessToken = await oauth2Client.getAccessToken();

      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     type: 'OAuth2',
      //     user: 'heenakayani@gmail.com',
      //     clientId: CLIENT_ID,
      //     clientSecret: CLIENT_SECRET,
      //     refreshToken: REFRESH_TOKEN,
      //     accessToken: accessToken.token,
      //   },
      // });

      // const mailOptions = {
      //   to: user.email,
      //   from: 'Bid Bridge <heenakayani@gmail.com>',
      //   subject: 'Account Verification',
      //   text: `Please click on the following link, or paste this into your browser to verify your bid bridge account:\n\n
      //               http://localhost:3001/login?verification=1&id=${user._id}\n`,
      // };

      // console.log(mailOptions)

      // transporter.sendMail(mailOptions, (err) => {
      //   if (err) {
      //     return res.status(500).json({ message: 'Error while sending the email.' });
      //   }
      //   res.status(200).json({ success: true, message: 'Verification email sent.' });
      // });
    } catch (error) {
      console.log("Error while signing in", error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== req.body.password) {
        return res.status(404).json({ message: "Password is incorrect" });
      }
      const { data } = user;
      if (!data?.verified) {
        // send verification email
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'heenakayani@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken.token,
          },
        });

        const mailOptions = {
          to: user.email,
          from: 'Bid Bridge <heenakayani@gmail.com>',
          subject: 'Account Verification',
          text: `Please click on the following link, or paste this into your browser to verify your bid bridge account:\n\n
                    http://localhost:3001/login?verification=1&id=${user._id}\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error while sending the email.' });
          }
          res.status(400).json({ success: false, message: 'Verification email sent again. Please verify to continue.', errorCode: 3000 });
        });
      } else {
        const token = generateToken({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        });
        console.log(user);
        user.token = token;
        await user.save();
        res.status(200).json({
          success: true,
          token,
        });
      }
    } catch (error) {
      console.log("Error while logging in", error);
    }
  },
  verifyUser: async (req, res) => {
    try {
      const id = req.params.userId;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let { data: dataCopy } = user;
      dataCopy.verified = true;
      user.data = { ...dataCopy };
      await User.findOneAndUpdate({ _id: user._id }, { data: dataCopy });
      res.status(200).json({
        success: true,
        message: "Account verified successfully",
      });
    } catch (error) {
      console.log("Error while verifying account", error);
    }
  },
  loginUserGoogle: async (req, res) => {
    try {
      console.log(req?.user?._json);
      const user = await User.findOne({
        platformId: req?.user.id,
        platform: "Google",
      });

      if (user) {
        user.name = req?.user?._json?.name;
        user.avatar = req?.user?._json?.picture || null;
        const token = generateToken({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: null,
        });
        user.token = token;
        await user.save();
        res.redirect(`http://localhost:3001/?token=${token}`);
      } else {
        const newUser = new User({
          name: req?.user?._json?.name,
          role: null,
          avatar: null,
          // token,
          platform: "Google",
          platformId: req?.user.id,
        });

        // Save the new user record to the database
        newUser
          .save()
          .then(async (user) => {
            console.log(user);
            const token = generateToken({
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
            });
            user.token = token;
            await user.save();
            res.redirect(`http://localhost:3001/?token=${token}`);
          })
          .catch((err) => {
            console.error(err);
            res.redirect("http://localhost:3001?error=true");
          });
      }
    } catch (error) {
      console.log("Error while logging in", error);
    }
  },
  updateUser: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      const { role, name, email, data } = req.body;

      if (role) {
        user.role = role;
      }

      if (name) {
        user.name = name;
      }

      if (email) {
        user.email = email;
      }
      if (data) {
        user.data = { ...data };
      }

      let updatedToken = null;

      if (role || name || email) {
        updatedToken = generateToken({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        });
        user.token = updatedToken;
      }

      await user.save();

      res.status(200).json({
        success: true,
        updatedToken,
        user,
      });
    } catch (error) {
      console.log("Error while updating user", error);
    }
  },
  updateUserAvatar: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      if (req.file.buffer) {
        user.avatar = {
          base64Image: req.file.buffer.toString("base64"),
          contentType: req.file.mimetype || "",
        };
      }
      console.log(user.avatar);
      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("Error while updating user avatar", error);
    }
  },
  updateUserResume: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      user.resume = {
        filename: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      await user.save();

      res.status(200).json({
        success: true,
        resume: user.resume,
      });
    } catch (error) {
      console.log("Error while updating user resume", error);
    }
  },
  updateUserCoverLetter: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      user.coverLetter = {
        filename: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      await user.save();

      res.status(200).json({
        success: true,
        coverLetter: user.coverLetter,
      });
    } catch (error) {
      console.log("Error while updating user cover letter", error);
    }
  },
  getUserDetails: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("Error while getting user details", error);
    }
  },
  getFreelancers: async (req, res) => {
    try {
      let freelancers = await User.find({
        role: "freelancer",
      });

      // calculate rating for freelancers and add in response
      for (const [index, freelancer] of freelancers.entries()) {
        let rating = 0;
        let totalRatingCount = 0;
        const bids = await Bid.find({ userId: freelancer._id });
        if (bids?.length > 0) {
          const bidIds = bids.map((bid) => {
            return bid._id.toString();
          });
          const tasks = await Task.find({
            acceptedBid: { $in: bidIds },
          });
          if (tasks?.length > 0) {
            tasks.forEach((task) => {
              if (task?.review?.rating) {
                rating = rating + parseInt(task?.review?.rating);
                totalRatingCount = totalRatingCount + 1;
              }
            });
          }
        }
        freelancers[index]._doc.rating = rating
          ? Math.floor(rating / totalRatingCount)
          : null;
      }

      res.status(200).json({
        success: true,
        freelancers,
      });
    } catch (error) {
      console.log("Error while getting freelancers", error);
    }
  },
  getEmployers: async (req, res) => {
    try {
      const employers = await User.find({
        role: "employer",
      });

      // calculate rating for freelancers and add in response
      for (const [index, employer] of employers.entries()) {
        let rating = 0;
        let totalRatingCount = 0;
        const tasks = await Task.find({ userId: employer._id });
        if (tasks?.length > 0) {
          const taskIds = tasks.map((task) => {
            return task._id.toString();
          });
          const bids = await Bid.find({
            taskId: { $in: taskIds },
          });
          if (bids?.length > 0) {
            bids.forEach((bid) => {
              if (bid?.review?.rating) {
                rating = rating + parseInt(bid?.review?.rating);
                totalRatingCount = totalRatingCount + 1;
              }
            });
          }
        }
        employers[index]._doc.rating = rating
          ? Math.floor(rating / totalRatingCount)
          : null;
      }

      res.status(200).json({
        success: true,
        employers,
      });
    } catch (error) {
      console.log("Error while getting employers", error);
    }
  },
  removeUserResume: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      user.resume = null;
      await user.save();

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log("Error while removing user resume", error);
    }
  },
  removeUserCoverLetter: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      user.coverLetter = null;
      await user.save();

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log("Error while removing user cover letter", error);
    }
  },
  updateNotificationsStatus: async (req, res) => {
    try {
      const token = req.headers["x-access-token"];
      const decodedToken = verifyToken(token);
      const userId = decodedToken.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "user not found",
        });
      }

      let dataCopy = user.data || {};
      let notificationsCopy = dataCopy.notifications
        ? [...dataCopy.notifications]
        : [];
      notificationsCopy.forEach((notification, index) => {
        notificationsCopy[index].isRead = true;
      });
      dataCopy.notifications = [...notificationsCopy];
      await User.findOneAndUpdate({ _id: user._id }, { data: dataCopy });

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log("Error while updating user notifications status", error);
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const email = req.body.email;
      const newPassword = req.body.newPassword;
      if (!newPassword) {
        // send link to email
        if (email) {
          const user = await User.findOne({
            email
          });
          if (!user) {
            res.status(404).json({
              success: false,
              message: "user not found",
            });
          }
          // Generate token
          const token = crypto.randomBytes(32).toString('hex');

          let dataCopy = user.data || {};
          dataCopy.resetPasswordToken = token;
          await User.findOneAndUpdate({ email }, { data: dataCopy });
          const accessToken = await oauth2Client.getAccessToken();

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'heenakayani@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken.token,
            },
          });

          const mailOptions = {
            to: email,
            from: 'Bid Bridge <heenakayani@gmail.com>',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://localhost:3001/reset-password?reset=${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error while sending the email.' });
            }
            res.status(200).json({ success: true, message: 'Recovery email sent.' });
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      // res.status(200).json({
      //   success: true,
      // });
    } catch (error) {
      console.log("Error while forgetting password", error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const newPassword = req.body.newPassword;
      const token = req.body.token;
      if (!newPassword) {
        res.status(400).json({
          success: false,
          message: "newPassword is required",
        });
      }
      if (!token) {
        res.status(400).json({
          success: false,
          message: "token is required",
        });
      }
      const user = await User.findOne({ 'data.resetPasswordToken': token });
      console.log(user)
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Reset password link has been expired",
        });
      }

      let dataCopy = user.data || {};
      dataCopy.resetPasswordToken = null;
      await User.findOneAndUpdate({ _id: user._id }, { data: dataCopy, password: newPassword });
      res.status(200).json({
        success: true,
        message: "Password has been reset successfully"
      });
    } catch (error) {
      console.log("Error while reseting password", error);
    }
  },
};

module.exports = userController;
