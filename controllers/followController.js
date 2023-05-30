const Follow = require("../models/Follow");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.followById = catchAsync(async (req, res, next) => {
  let follower = req.user;
  let followee = req.body.followee;

  const user1 = await User.findById(follower);
  const user2 = await User.findById(followee);

  var flag = true;
  user1.following.every((e) => {
    if (e.toString() === followee) {
      flag = false;
      return false;
    }
  });

  if (!flag) {
    return next(new AppError("You are already following the followee!"));
  } else {
    user1.following.push(followee);
    user2.followers.push(follower);
    await user1.save();
    await user2.save();
  }

  const follow = await Follow.create({
    follower,
    followee,
  });

  //   const f = follow.populate([
  //     { path: "follower", select: "first_name last_name mobile_Number" },
  //     { path: "followee", select: "first_name last_name mobile_Number" },
  //   ]);

  res.status(200).json({
    status: "success",
    data: follow,
  });
});

exports.unfollow = catchAsync(async (req, res) => {
  let follower = req.user;
  let followee = req.body.followee;

  const user1 = await User.findById(follower);
  const user2 = await User.findById(followee);

  user1.following.filter(function (e) {
    return e.toString() !== followee;
  });

  user2.followers.filter(function (e) {
    return e.toString() !== follower;
  });

  console.log(user1);

  await user1.save();
  await user2.save();

  await Follow.findOneAndDelete({
    follower: follower,
    followee: followee,
  });

  res.status(200).json({
    status: "success",
    message: `${follower} unfollowed ${followee}`,
  });
});

exports.followersOfUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user).populate("followers");

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.Userfollowers = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate("followers");

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.Userfollowing = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate("following");

  res.status(200).json({
    status: "success",
    data: user,
  });
});
