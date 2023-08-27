const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// get blood data
const bloodGroupDetailsController = async (req, res) => {
  try {
    const all_blood_groups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const curr_blood_group_data = [];
    // const organisation = new mongoose.Types.ObjectId(req.body.userId);
    // console.log(organisation);

    // // const userId = new mongoose.Types.ObjectId(req.body.userId);

    // const user = await userModel.findById(organisation);
    // console.log("this is the user ");
    // console.log(user);

    // console.log(role);
    // let filter = { organisation: organisation };
    // if (role === "donor") {
    //   filter = { $or: [{ organisation: organisation }, { donor: organisation }] };
    // }

    // const userId = new mongoose.Types.ObjectId(req.body.userId);
    // console.log(userId);
    // const user = await userModel.findById(userId);
    // console.log("this is the user ");
    // console.log(user);
    // const role = user.role;

    // console.log("this is the role");
    // console.log(role);
    // let filter = { organisation: userId };
    // console.log("before filtering");
    // console.log(filter);

    // if (role === "donor") {
    //   filter = { $or: [{ organisation: userId }, { donor: userId }] };
    // }
    // console.log("after filteirng");
    // console.log(filter);


    // const user = await userModel.findById(req.body.userId).populate('donors organizations');
    // console.log(user);
    // if (!user) {
    //     return res.status(404).send({
    //         success: false,
    //         message: "User not found",
    //     });
    // }
    
    // const role = user.role;
    // console.log(role);
    // let organisationIds = [];
    
    // if (role === "hospital") {
    //     // If the user is a hospital, get the IDs of associated donors and organizations
    //     organisationIds = user.donors.concat(user.organizations);
    // } else if (role === "organisation") {
    //     // If the user is an organization, just use its own ID
    //     organisationIds.push(user._id);
    //     console.log(organisationIds);
    // } else if (role === "donor") {
    //     // If the user is a donor, use its own ID
    //     organisationIds.push(user._id);
    // }
    // console.log(organisationIds);

    // get single blood group ... i am using map to map all blood groups
    // using async for map bec data is dynamic.. woh change hota reha ga
    // single bloodGroup daal ra hoon ,,
    await Promise.all(
      all_blood_groups.map(async (SingleBloodGroup) => {
        // count total blood in
        const BloodIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: SingleBloodGroup,
              inventoryType: "in",
            //   organisation
            // organisation: { $in: organisationIds },
            },
          },

          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        // count total blood out
        const BloodOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: SingleBloodGroup,
              inventoryType: "out",
            //   organisation,
            //  organisation: { $in: organisationIds },
            },
          },

          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        // calculaten total blood left
        const BloodLeft = (BloodIn[0]?.total || 0) - (BloodOut[0]?.total || 0);

        //adding data in my curr blood data
        curr_blood_group_data.push({
          SingleBloodGroup,
          BloodIn: BloodIn[0]?.total || 0,
          BloodOut: BloodOut[0]?.total || 0,
          BloodLeft,
        });
      })
    );
    return res.status(200).send({
      success: "true",
      message: "blood group data fetched successfully",
      curr_blood_group_data,
    });
  } catch (error) {
    return res.status(500).send({
      success: "false",
      message: "error in creating blood group data by bloodgroupdetail api ",
      error,
    });
  }
};

module.exports = { bloodGroupDetailsController };
