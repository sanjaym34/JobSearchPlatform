var mongoose = require("mongoose");

var employeeSchema = new mongoose.Schema({
    firstName      : String,
    lastName       : String,
    username       : String,
    email          : String,
    phoneNumber    : String,
    password       : String,
    confirmPassword: String,
    address1       : String,
    address2       : String,
    city           : String,
    state          : String,
    ZIP            : String,
    country        : String,
    skills         : String,
    areaOfInterest : String,
    Location       : String,
    Qualification  : String,
    aboutCandidate : String,
    calledEmployers: Array,
    fileUpload     :{ 
        data: Buffer,
        contentType: String }
});


module.exports = mongoose.model("employeeSchema",employeeSchema);