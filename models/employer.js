var mongoose = require("mongoose");
var employerSchema = new mongoose.Schema({
    username         : String,
    email            : String,
    companyName      : String,
    phoneNumber      : String,
    password         : String,
    confirmPassword  : String,
    address1         : String,
    address2         : String,
    city             : String,
    state            : String,
    ZIP              : String,
    country          : String,
    jobTitle         : String,
    Salary           : String,
    jobDescription   : String,
    skillsRequired   : String,
    lastDateToApply  : String,
    appliedEmployees : Array,
    percentage       : String
});


module.exports = mongoose.model("employerSchema",employerSchema);