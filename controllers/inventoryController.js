const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// create inventory controller
const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType } = req.body;
    // validation

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }
    
    // if(inventoryType== 'in' && user.role !== 'donar')
    // {
    //     throw new Error('donar not found');

    // }
    // if(inventoryType== 'out' && user.role !== 'hospital')
    // {
    //     throw new Error('not a hospital');

    // }

    if (inventoryType === "in"  && user.role !== 'hospital') {
      req.body.donor = user._id;
      

      // Update hospital's associatedDonors array
      const hospitalUser = await userModel.findOne({ role: "donor" });
      
      if (hospitalUser) {
        if (!hospitalUser.associatedDonors.includes(user._id)) {
          hospitalUser.associatedDonors.push(user._id);
          await hospitalUser.save();
        }
      }
    }
    

    // working with out inventory
    if (req.body.inventoryType == "out" && user.role !== 'donor' ) {
     
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const hospital = req.body.userId;
      

      // Get the associated donors of the hospital
      const hospitalUser = await userModel.findById(hospital);
      
      const associatedDonors = hospitalUser.associatedDonors || [];
   
      // const organisation = new mongoose.Types.ObjectId(req.body.userId);
      const inventory = await inventoryModel.find({
        $or: [{ donor: { $in: associatedDonors } }, { hospital: hospital }],
      });
    
      // calculating the blood quantity that is left after extraction using out
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      // calculating out blood quantity
      const totalOutOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBlood[0]?.total || 0;
      
      // in & out calculation
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      
      // validation of blood quantity
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    // save  record  agar upar wala sabh case pass ho gya toh phir hum saver karenga
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "new blood record added",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Not allowed to create inventory ", 
      error,
    });
  }
};

// creating get inventory controller to get all bood groups
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in getting all inventories",
      error,
    });
  }
};

// get donor records
// const getdonorsController = async (req, res) => {
//   try {
//     const organisation = req.body.userId;
//     ////finding donors
//     const donorId = await inventoryModel.distinct("donor", {
//       organisation,
//     });

//     // console.log(donorId)
//     //user id and donor id smae hai toh donors mein save kardo
//     const donors = await userModel.find({ _id: { $in: donorId } });
//     return res.status(200).send({
//       success: true,
//       message: "donor record fetched successfully",
//       donors,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error in Donor records",
//       error,
//     });
//   }
// };
const getdonorsController = async (req, res) => {
  try {
    const donors = await userModel
      .find({ role: "donor" })
      .sort({ createdAt: -1 });
      return res.status(200).send({
        success: 'true',
        TotalCount: donors.length,
        message: 'donor data fetched successfully',
        donors
      })
  } catch (error) {
    
    return res.status(500).send({
      success: "false",
      message: "error in creating donor list api",
      error,
    });
  }
};

// hospital records
// const getHospitalsController = async (req, res) => {
//   try {
//     const organisation = req.body.userId;
//     //GET HOSPITAL ID
//     console.log("nnnnnnnnnnnnnnnnnn",organisation);
//     const hospitalId = await inventoryModel.distinct("hospital", {
//       organisation,
//     });
//     console.log("kkkkkkkkkkkkkk",hospitalId);
    
//     //FIND HOSPITAL
//     const hospitals = await userModel.find({
//       _id: { $in: hospitalId },
//     });
//     console.log("llllllllllllllll",hospitals);

//     return res.status(200).send({
//       success: true,
//       message: "Hospitals Data Fetched Successfully",
//       hospitals,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In get Hospital API",
//       error,
//     });
//   }
// };
const  getHospitalsController = async (req, res) => {
  try {
    const hospitals = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
      return res.status(200).send({
        success: 'true',
        TotalCount: hospitals.length,
        message: 'hospital data fetched successfully',
        hospitals
      })
  } catch (error) {
   
    return res.status(500).send({
      success: "false",
      message: "error in creating hospital list api",
      error,
    });
  }
};

// get organisation profiles for donor
const getOrgnaisationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donor });
    //find org
    // console.log(orgId);
    const ORG = await userModel.find({
      _id: { $in: orgId },
      role: "organisation", // give me the data of oragnisation only
    });
    // console.log(ORG)
    
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully for donor",
      ORG,
    });
  } catch (error) {
    
    return res.status(500).send({
      success: false,
      message: "Error In doanr ORG API",
      error,
    });
  }
};

// get organisation profiles for hospital
const getOrgnaisationHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const organisation = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    //find org

    const ORG = await userModel.find({
      _id: { $in: orgId },
      role: "organisation",
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully for hospital",
      ORG,
    });
  } catch (error) {
    
    return res.status(500).send({
      success: false,
      message: "Error In hospital  ORG  API",
      error,
    });
  }
};
// creating get inventory controller to get all out bood groups that consumer has used for hospital
const getInventoryHospitalController = async (req, res) => {
  try {
    // const hospital = req.body.userId;
    // console.log(hospital)

    // // Get the associated donors of the hospital
    // const hospitalUser = await userModel.findById(hospital);
    // console.log(hospitalUser)
    // const associatedDonors = hospitalUser.associatedDonors || [];
    // console.log(hospitalUser)

    const inventory = await inventoryModel
      .find(req.body.filters)
      // .find({
      //   $or: [
      //     { donor: { $in: associatedDonors } },
      //     { hospital: hospital },
      //   ],
      // })
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    
    return res.status(500).send({
      success: false,
      message: "error in getting all hospital consumer inventories",
      error,
    });
  }
};

// get last three blood records

const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: "true",
      message: "successfully created API",
      inventory,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in creating api for last three records",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getdonorsController,
  getHospitalsController,
  getOrgnaisationController,
  getOrgnaisationHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
