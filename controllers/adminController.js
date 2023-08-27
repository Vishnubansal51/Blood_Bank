const userModel = require("../models/userModel");


// get donor list
const get_donor_list_controller = async (req, res) => {
  try {
    const donor_data = await userModel
      .find({ role: "donor" })
      .sort({ createdAt: -1 });
      return res.status(200).send({
        success: 'true',
        TotalCount: donor_data.length,
        message: 'donor data fetched successfully',
        donor_data
      })
  } catch (error) {
    
    return res.status(500).send({
      success: "false",
      message: "error in creating donor list api",
      error,
    });
  }
};
// get hospital list
const get_hospital_list_controller = async (req, res) => {
  try {
    const hospital_data = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
      return res.status(200).send({
        success: 'true',
        TotalCount: hospital_data.length,
        message: 'hospital data fetched successfully',
        hospital_data
      })
  } catch (error) {
    
    return res.status(500).send({
      success: "false",
      message: "error in creating hospital list api",
      error,
    });
  }
};
// get organisation list
const get_org_list_controller = async (req, res) => {
  try {
    const org_data = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });
      return res.status(200).send({
        success: 'true',
        TotalCount: org_data.length,
        message: 'organisation data fetched successfully',
        org_data
      })
  } catch (error) {
    
    return res.status(500).send({
      success: "false",
      message: "error in creating organisation list api",
      error,
    });
  }
};

// delete  for deleleting donor
const delete_donor_controller = async (req,res) =>{
  try{
    await userModel.findByIdAndDelete(req.params.id)

    return res.status(200).send({
      success: 'true',
      message: 'donor data deleted successfully',
  
    })
  }
  catch (error) {
    
    return res.status(500).send({
      success: "false",
      message: "error while deleting donor api",
      error,
    });
  }
}
// delete  for deleleting hospital
const delete_hospital_controller = async (req,res) =>{
  try{
    await userModel.findByIdAndDelete(req.params.id)

    return res.status(200).send({
      success: 'true',
      message: 'hospital data deleted successfully',
  
    })
  }
  catch (error) {
    return res.status(500).send({
      success: "false",
      message: "error while deleting hospital api",
      error,
    });
  }
}

module.exports = { get_donor_list_controller, get_hospital_list_controller,get_org_list_controller,delete_donor_controller,delete_hospital_controller };
