const User = require("../models/User");
const Blog = require("../models/blog");
const feedback = require("../models/feedback");
const astroSttus = require('../models/astroStatus')
var newOTP = require("otp-generators");

module.exports.postuserProfiles = async (req, res) => {
  const { firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills } = req.body;
  if (!firstName && !lastName && !email && !password && !confirmpassword) {
    return res.status(501).json({
      message: "All field are require"
    })
  }

  // Check if user already exist
  const Existing = await astrologer.findOne({ mobile });
  if (Existing) {
    return res.send("Already existing");
  }
  if (password !== confirmpassword) {
    res.state(400).json({ message: "Password is not match " })
  }
  encryptedPassword = await bcrypt.hash(password, 10);

  // create new user

  const newUser = await createUser(firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills);
  if (!newUser[0]) {
    return res.status(401).send({
      message: "Unable to create new user",
    });
  }
  res.send(newUser);
};

const createUser = async (firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills) => {
  const hashedPassword = await encrypt(password);
  const confirmPassword = await encrypt(confirmpassword)
  const otpGenerated = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
  const newUser = await astrologer.create({ firstName, lastName, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, password: hashedPassword, confirmpassword: confirmPassword, otp: otpGenerated, });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }
  try {
 
    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign up, Please try again later", error];
  }
};

//get api

module.exports.ViewDataProfiles = async (req, res) => {
  try {
    const getDetails = await User.findById(req.params.id);
    if (!getDetails) {
      res.status(400).json({ message: "Enter the correct id", status: false });
    } else {
      res.status(200).json({
        message: "User Details is Created successfully",
        data: getDetails,
        status: true,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//patch api

// module.exports.updateUserProfile = async (req, res) => {
//   const id = req.params.id;
//   let photo = req.body;
//   photo["User_Images"] = [req.file.originalname];
//   const {
//     User_ID,
//     User_Name,
//     Experince,
//     Skills,
//     AboutMe,
//     User_Images,
//     Languages,
//   } = req.body;

//   // console.log("req.user", req.user);
//   if (
//     !(
//       User_ID &&
//       User_Name &&
//       Experince &&
//       Skills &&
//       AboutMe &&
//       User_Images &&
//       Languages
//     )
//   )
//     res.status(400).json({ message: "Required fields" });
//   const UpdateUser = await User.findByIdAndUpdate(id, {
//     User_ID,
//     User_Name,
//     Experince,
//     Skills: JSON.parse(Skills),
//     AboutMe,
//     User_Images,
//     Languages: JSON.parse(Languages),
//   });
//   if (!UpdateUser) {
//     res.status(400).json({ message: "Enter the correct Id", status: false });
//   } else {
//     res.status(200).json({
//       message: "Udpate is successfully",
//       status: true,
//       UpdateUser,
//     });
//   }
// };

// Patch Id 
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification } = req.body;
    await User.findByIdAndUpdate({ _id: req.params.id }, {
      firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification
    })
    res.status(200).json({
      message: "Updated Done "
    })
  } catch (err) {
    console.log(err);
    res.state(400).json({
      err: err.message
    })
  }
}


//Search api
module.exports.SearchUserNameLangSkills = async (req, res) => {
  const search = req.query.search;
  try {
    const student = await User.find({
      $or: [
        { User_Name: { $regex: search, $options: "i" } },
        { Skills: { $regex: search, $options: "i" } },
        { Languages: { $regex: search, $options: "i" } },
      ],
    });
    if (student.length == 0) {
      res.json({ message: "Data is not Found", status: false });
    } else {
      res.json({
        message: " Data  is found Successfully",
        student: student,
        status: true,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

// Serach api User Name
module.exports.SearchUserName = async (req, res) => {
  const search = req.query.search;
  try {
    const student = await User.find({
      User_Name: search,
    });
    if (student.length == 0) {
      res.json({ message: "This User was not Found", status: false });
    } else {
      res.json({
        message: " USer  is found",
        student: student,
        status: true,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

//seacrh for languseg get api
module.exports.SearchAnyLanguagesName = async (req, res) => {
  const search = req.query.search;
  try {
    const student = await User.find({
      $or: [{ Languages: { $regex: search, $options: "i" } }],
    });
    if (student.length == 0) {
      res.json({ message: "This Languages Is not Found", status: false });
    } else {
      res.json({
        message: "Languages  is found",
        student: student,
        status: true,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

//Delete User--
module.exports.deleteUserName = async (req, res) => {
  try {
    const DeleteUser = await User.findOneAndDelete({
      User_Name: req.params.user_Name,
    });
    if (!DeleteUser) {
      res.json({ message: "Enter the corret User  Name", status: false });
    } else {
      res
        .status(200)
        .json({ message: "User removed successfully", status: true });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//delete Languages
module.exports.deleteLanguages = async (req, res) => {
  try {
    const DeleteUser = await User.findOneAndDelete({
      $or: [{ Languages: { $regex: search, $options: "i" } }],
    });
    if (!DeleteUser) {
      res.json({ message: "Enter the corret User Languages", status: false });
    } else {
      res
        .status(200)
        .json({ message: "Languages removed successfully", status: true });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//
module.exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      status: "success",
      data: blogs,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

// FeedBack 

exports.UserFeedback = async (req, res) => {
  let { UserId, Feedback, rating, astroId } = req.body;

  try {
    if (!(UserId && Feedback && astroId)) {
      res
        .status(402)
        .json({ message: "All fields are required", status: false });
    } else {
      const userData = await User.findById({ _id: UserId });
      const data = {
        UserId: UserId,
        Feedback: Feedback,
        name: userData.firstName,
        astroId: astroId,
        rating: rating
      }
      const NewUserFeedback = await feedback.create(data);
      await astrologer.findByIdAndUpdate({ _id: req.body.astroId }, {
        rating: [rating]
      })
      if (NewUserFeedback)
        res
          .status(200)
          .json({
            message: "UserFeedback Send",
            data: NewUserFeedback,
            status: true,
          });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

exports.GetAllFeedBack = async (req, res) => {
  try {
    const data = await feedback.find();
    res.status(200).json({
      message: data
    })
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}


exports.GetFeedbackById = async (req, res) => {
  try {
    const data = await feedback.findOne({ userId: req.params.id });
    res.status(200).json({
      message: data
    })
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}


exports.GetAstroliveChanges = async (req, res) => {
  try {
    const data = await astroSttus.find({ status: true }).limit(5).sort();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}

exports.GetAstroUpcoming = async (req, res) => {
  try {
    const data = await astroSttus.find({ status: false }).limit(5).sort();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}