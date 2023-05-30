const product = require('../models/product');



  

module.exports.addproduct = async (req, res) => {
    const banner = req.files;
    try {

        const addBanner = await product.create({
          name: req.body.name,
          link:  req.body.link,
          price: req.body.price,
          desc: req.body.desc
        });
        res.status(200).json({
          msg: "Banner successfully added",
          data: addBanner,
          status: true,
        });
    } catch (error) {
      res.status(400).json({
        message: error.message
      })
    }
  };

  module.exports.getProduct = async (req, res) => {
    try {
      const getproduct = await product.find();
      res.status(200).json({ status: "success", data: getproduct });
    } catch (error) {
      res.status(200)

    }
  };


  module.exports.editProduct = async (req, res) => {
    try {
      const b = await product.findById(req.params.id);
  
      const editBanner = await product.findByIdAndUpdate(req.params.id, {
        bannerImage: req.file.filename ? req.file.filename : b.bannerImage,
        link: `public/images/${req.file.filename}`,
        price: req.body.price,
        desc: req.body.desc
      });
      res
        .status(200)
        .json({ msg: "product successfully Updated", data: editBanner });
    } catch (error) {
      console.log(error);
    }
  };


  module.exports.deleteProduct = async (req, res) => {
    try {
      const response = await product.findByIdAndDelete(req.params.id);
      res.status(200).send({
        msg: "product  deleted successfully",
        status: true,
      });
    } catch (error) {
      res.send(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  };
  