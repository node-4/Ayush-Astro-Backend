// const UserSetting = require("../models/userSetting");
const User = require("../models/User");
const Notification = require("../models/Notification");

module.exports.UserSettings = async (req, res) => {
  try {
    // if (!(UserId && ActiveNotification)) {
    //   res.json({ message: "All fields are required", status: false });
    // } else {
    //   const SettingUser = await UserSetting.findOne({ UserId });
    //   if (!SettingUser) {
    //     const NewUserSetting = await UserSetting.create({
    //       UserId,
    //       ActiveNotification,
    //     });
    //     if (NewUserSetting)
    //       res.status(200)({
    //         message: "UserSetting Updated",
    //         data: NewUserSetting,
    //         status: true,
    //       });
    //     res
    //       .status(400)
    //       .json({ message: "Usersetting  not Updated", status: false });
    //   } else {
    //     const UpdateUserSetting = await UserSetting.findOneAndUpdate(
    //       { UserId },
    //       { ActiveNotification }
    //     );
    //     if (UpdateUserSetting)
    //       res
    //         .status(200)
    //         .json({
    //           message: "UserSetting Updated",
    //           data: UpdateUserSetting,
    //           status: true,
    //         });
    //     res
    //       .status(400)
    //       .json({ message: "Usersetting  not Updated", status: false });
    //   }
    // }

    const user = await User.findById(req.params.id);
    user.ActiveNotification = true;
    await user.save();
    res.status(201).json({ status: "success", message: user });
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const user = await User.find({ ActiveNotification: true });
    console.log(user);
    res.send({
      status: "success",
      message: "All the users who have opted to receive notifications",
      data: user,
    });
  } catch (err) {
    res.send({
      status: "falied",
      message: err.message,
    });
  }
};

exports.getAllnotifications = async (req, res) => {
  try {
    const users = await User.find({
      ActiveNotification: true,
    });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};
