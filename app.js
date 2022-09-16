//ACCUJOB
// =============================================================================================================================================
// ========================================================== IMPORTS ==========================================================================
// =============================================================================================================================================
var express = require("express"),
    path = require('path'),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    upload = require("express-fileupload"),
    employee = require("./models/employee"),
    employer = require("./models/employer"),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    cookie = require('cookie-parser'),
    docxConverter = require('docx-pdf'),
    nodemailer = require('nodemailer'),
    { google } = require('googleapis'),
    ejsMate = require('ejs-mate'),
    methodOverride = require('method-override'),
    session = require('express-session')

// mongoose.connect('mongodb://localhost:27017/JobSearchPlatform', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

const url = `mongodb+srv://sanjaym20:Sanjay12345@sanjaycluster.0ihte.mongodb.net/JobSearchPlatform?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookie());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(upload());

const CLIENT_ID = 'your_client_id';
const CLEINT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'your_refresh_token';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const JWT_SECRET = "mysecretKey";

// ==================================================== VERIFY Function =========================================================================
async function verify(req, res, next) {
    console.log(req.cookies);
    const token = await req.cookies.token;
    if (!token) {
        req.auth = "Not allowed";
        next();
    }
    else {
        try {
            const decode = await jwt.verify(token, "mysecretKEY", { algorithm: 'HS256' })
            req.dataa = decode;
            req.auth = "allowed"
            next();
        }
        catch (e) {
            console.log(e.message);
            req.auth = "Not allowed";
            next();
        }

    }
}


// ========================================================== INDEX ==========================================================================
app.get("/", function (req, res) {
    console.log("GET: /index");
    res.render("index");
});



// ====================================================== JOBS PAGE =============================================================================
app.get("/jobs", function (req, res) {
    employer.find({}, function (err, eachEmployer) {
        if (err) {
            console.log("Error in Jobs Page");
            console.log(err);
        } else {
            console.log("GET: /jobs");
            res.render("jobs", { eachEmployer: eachEmployer });
        }
    })
});


app.get("/recruiters", function (req, res) {
    employer.find({}, function (err, eachEmployer) {
        if (err) {
            console.log("Error in Jobs Page");
            console.log(err);
        } else {
            console.log("GET: /recruiters");
            res.render("recruiters", { eachEmployer: eachEmployer });
        }
    })
});


// ==============================================================================================================================================
// ============================================== JOBS BY LOCATION PAGE =========================================================================
// ==============================================================================================================================================

// ========================================================= HYDERABAD ==========================================================================
app.get("/jobsByLocationH", function (req, res) {
    employer.find({ "city": "Hyderabad" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByLocationH");
        } else {
            console.log("Get: /jobsByLocationH");
            res.render("jobsByLocationH", { foundEmployer: foundEmployer });
        }
    })
});

// ======================================================== BANGALORE ==========================================================================
app.get("/jobsByLocationB", function (req, res) {
    employer.find({ "city": "Bangalore" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByLocationB");
        } else {
            console.log("Get: /jobsByLocationB");
            res.render("jobsByLocationB", { foundEmployer: foundEmployer });
        }
    })
});

// ========================================================== DELHI ===========================================================================
app.get("/jobsByLocationD", function (req, res) {
    employer.find({ "city": "Delhi" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByLocationD");
        } else {
            console.log("Get: /jobsByLocationD");
            res.render("jobsByLocationD", { foundEmployer: foundEmployer });
        }
    })
});

// ========================================================== MUMBAI ==========================================================================
app.get("/jobsByLocationM", function (req, res) {
    employer.find({ "city": "Mumbai" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByLocationM");
        } else {
            console.log("Get: /jobsByLocationM");
            res.render("jobsByLocationM", { foundEmployer: foundEmployer });
        }
    })
});

// ==============================================================================================================================================
// ============================================== JOBS BY COMPANY PAGE ==========================================================================
// ==============================================================================================================================================

// ========================================================== APPLE =============================================================================
app.get("/jobsByCompanyA", function (req, res) {
    employer.find({ "companyName": "Apple" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByCompanyA");
        } else {
            console.log("GET: /jobsByCompanyA");
            res.render("jobsByCompanyA", { foundEmployer: foundEmployer });
        }
    })
});

// ========================================================== INFOSYS ===========================================================================
app.get("/jobsByCompanyI", function (req, res) {
    employer.find({ "companyName": "Infosys" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByCompanyI");
        } else {
            console.log("GET: /jobsByCompanyI");
            res.render("jobsByCompanyI", { foundEmployer: foundEmployer });
        }
    })
});

// ========================================================== TCS ===============================================================================
app.get("/jobsByCompanyT", function (req, res) {
    employer.find({ "companyName": "TCS" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByCompanyT");
        } else {
            console.log("GET: /jobsByCompanyT");
            res.render("jobsByCompanyT", { foundEmployer: foundEmployer });
        }
    })
});

// ========================================================== JP Morgan =========================================================================
app.get("/jobsByCompanyJ", function (req, res) {
    employer.find({ "companyName": "JP Morgan" }, function (err, foundEmployer) {
        if (err) {
            console.log(err);
            console.log("error in /jobsByCompanyJ");
        } else {
            console.log("GET: /jobsByCompanyJ");
            res.render("jobsByCompanyJ", { foundEmployer: foundEmployer });
        }
    })
});

// ==============================================================================================================================================
// ============================================== EMPLOYEE DASHBOARD ============================================================================
// ==============================================================================================================================================

app.get("/empdashboard", verify, async function (req, res) {

    if (req.auth == "Not allowed" || !req.auth) {
        res.redirect("/emplogin");
        return;
    }

    else {


        var employee1ID = req.dataa.id;

        console.log("Employee ID");
        console.log(employee1ID);

        console.log("GET: /empdashboard");

        let eligible = [];
        let skillsrequired = [];
        let countEmployee = 0;

        try {
            const employers = await employer.find();
            employers.forEach(employer => {
                if (employer.appliedEmployees.length === 0) {
                    let skillsRequired = employer.skillsRequired;
                    skillsRequired = skillsRequired.split(",");
                    countEmployer = skillsRequired.length;
                    skillsrequired.push({ skill: skillsRequired, employer: employer })
                } else {
                    let flag = 0;
                    employer.appliedEmployees.forEach(extractedEmployee => {
                        if (JSON.stringify(extractedEmployee) === JSON.stringify(employee1ID)) {
                            console.log("Same");
                            flag = 1;
                        } else {
                            console.log("Not Same");
                        }

                    })
                    if (flag != 1) {
                        let skillsRequired = employer.skillsRequired;
                        skillsRequired = skillsRequired.split(",");
                        skillsrequired.push({ skill: skillsRequired, employer: employer })
                    }
                }
            })
        }
        catch (e) {
            console.log(e.message)
        }

        try {
            const particularEmp = await employee.findById(employee1ID);
            let skills = particularEmp.skills;
            skills = skills.split(",");
            countEmployee = skills.length;
            console.log("Skills Of Employee count " + countEmployee);
            skillsrequired.forEach(skillr => {
                let countSimilar = 0;
                let countEmployer = skillr.skill.length;

                console.log("Count Employer at beginning" + countEmployer);
                let flag = 0;
                for (let i = 0; i < skills.length; i++) {
                    for (let j = 0; j < skillr.skill.length; j++) {
                        if (skills[i] == skillr.skill[j]) {
                            countSimilar++;
                        }
                    }
                }
                let percentage = 1.0;
                percentage = (countSimilar / countEmployer) * 100;

                if (percentage > 90) {
                    percentage = percentage - 10;
                }
                console.log("Count Similar" + countSimilar);
                console.log("Count Employer" + countEmployer);
                console.log(percentage);
                employer.findById(skillr.employer._id, async function (err, foundEmployer) {
                    if (err) {
                        console.log(err);
                    } else {
                        foundEmployer.percentage = percentage.toString();
                        await foundEmployer.save();
                        console.log("Percentage in string: " + foundEmployer.percentage);
                    }
                });
            });

            skillsrequired.forEach(skillr => {
                let flag = 0;
                for (let i = 0; i < skills.length; i++) {
                    if (flag == 1) {
                        break;
                    }
                    for (let j = 0; j < skillr.skill.length; j++) {
                        if (skills[i] == skillr.skill[j]) {
                            eligible.push(skillr.employer);
                            flag = 1;
                            break;
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }

        console.log("Outside");
        console.log(eligible);
        res.render("empdashboard", { eligible: eligible });

    }
});


// ==============================================================================================================================================
// ====================================================== APPLY PAGE ============================================================================
// ==============================================================================================================================================

app.get("/applypage/:id", verify, function (req, res) {

    var employerID = req.params.id;

    var employee1ID = req.dataa.id;

    console.log("Employee ID");
    console.log(employee1ID);

    employer.findById(employerID, function (err, foundEmployer) {
        if (err) {
            console.log("Error in Employee Apply Page");
            console.log(err);
        } else {
            console.log("GET: /applypage/:id ");
            res.render("applypage", { foundEmployer: foundEmployer });
        }
    });
});

// ==============================================================================================================================================
// ====================================================== RESUME UPLOAD PAGE ====================================================================
// ==============================================================================================================================================

// ====================================================== RESUME UPLOAD PAGE(GET) ===============================================================
app.get("/resumeUploadPage/:id", verify, function (req, res) {
    var employerID = req.params.id;

    var employee1ID = req.dataa.id;

    console.log("Employee ID");
    console.log(employee1ID);

    employee.findById(employee1ID, function (err) {
        if (err) {
            console.log(err);
            console.log("Error in finding the employee in Resume Upload Page");
        } else {
            console.log("Found the employee in Resume Upload Page");
        }
    });

    employer.findById(employerID, function (err, foundEmployer) {
        if (err) {
            console.log("There is an error in Employee Resume Upload Page ");
            console.log(err);
        } else {
            console.log("GET: /resumeUploadPage")
            res.render("resumeUploadPage", { foundEmployer: foundEmployer });
        }
    });
});

// ====================================================== RESUME UPLOAD PAGE(POST) ==============================================================
app.post("/resumeUploadPage/:id", verify, function (req, res) {
    console.log("POST: /resumeUploadPage");
    var employerID = req.params.id;

    var employee1ID = req.dataa.id;


    console.log("Employee ID");
    console.log(employee1ID);


    console.log(employee1ID + " in resumeUploadPage");

    employer.findByIdAndUpdate(employerID,
        { $push: { appliedEmployees: employee1ID } },
        { safe: true, upsert: true },
        function (err, foundEmployer) {
            if (err) {
                console.log("There is an error in Employee Resume Upload Page ");
                console.log(err);
            } else {
                employee.findById(employee1ID, function (err, foundEmployee) {
                    console.log(foundEmployee);
                });

                if (req.files) {
                    var file = req.files.uploadFile;
                    console.log(file);
                    uploadFile = file.name;
                    uploadExtension = file.name.split(".")[1];
                    if (uploadExtension === "pdf") {
                        file.mv("./pdfUpload/" + employee1ID + "." + uploadExtension, function (err) {
                            if (err) {
                                console.log("Error in file upload");
                                console.log(err);
                            } else {
                                console.log("Successfully Uploaded");
                                res.redirect("/empdashboard");
                            }
                        })
                    } else {
                        file.mv("./upload/" + employee1ID + "." + uploadExtension, function (err) {
                            if (err) {
                                console.log("Error in file upload");
                                console.log(err);
                            } else {
                                docxConverter('./upload/' + employee1ID + '.' + uploadExtension, './pdfUpload/' + employee1ID + '.pdf', (err, result) => {
                                    if (err) console.log(err);
                                    else console.log(result);
                                });
                                console.log("Successfully Uploaded");
                                res.redirect("/empdashboard");
                            }
                        })
                    }
                }
            }
        });
});

// ==============================================================================================================================================
// ============================================== EMPLOYER DASHBOARD ============================================================================
// ==============================================================================================================================================
app.get("/empldashboard", verify, async function (req, res) {
    if (req.auth == "Not allowed" || !req.auth) {
        res.redirect("/empllogin");
        return;
    }

    else {
        var employer1ID = req.dataa.id;
        console.log(employer1ID);
        employer.findById(employer1ID, function (err, foundEmployer) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundEmployer);
            }
        });

        let eligible = [];
        let appliedEmployeesArray = [];

        try {
            const employers = await employer.findById(employer1ID);

            console.log("Get: /empldashboard");

            employers.appliedEmployees.forEach((appliedEmployee) => {
                appliedEmployeesArray.push(appliedEmployee);
            })
        }
        catch (e) {
            console.log(e.message);
        }

        try {
            for (let i = 0; i < appliedEmployeesArray.length; i++) {
                await employee.findById(appliedEmployeesArray[i], function (err, foundEmployee) {
                    if (err) {
                        console.log(err);
                        console.log("error in find the employee in employer dash");
                    } else {
                        let flag = 0;
                        foundEmployee.calledEmployers.forEach(eachEmployer => {
                            if (JSON.stringify(eachEmployer) === JSON.stringify(employer1ID)) {
                                console.log("Same");
                                flag = 1;
                            } else {
                                console.log("Not Same");
                            }
                        })
                        if (flag != 1) {
                            eligible.push(foundEmployee);
                            console.log("Inside function");
                            console.log(eligible);
                        }
                    }
                })
            }
        }
        catch (e) {
            console.log(e.message);
        }

        console.log("Outside function");
        console.log(eligible);
        res.render("empldashboard", { eligible: eligible });

    }

});

// ==============================================================================================================================================
// ============================================== CALL FOR INTERVIEW PAGE =======================================================================
// ==============================================================================================================================================

// ============================================== CALL FOR INTERVIEW(GET) =======================================================================
app.get("/callForInterview/:id", verify, function (req, res) {

    var employer1ID = req.dataa.id;

    var employeeID = req.params.id;
    employee.findById(employeeID, function (err, foundEmployee) {
        if (err) {
            console.log("Error in call for interview page")
            console.log(err);
        } else {
            console.log("GET: /callForInterview");
            res.render("callForInterview", { foundEmployee: foundEmployee });
        }
    });
});

// ============================================== RESUME DOWNLOAD ===============================================================================
app.get('/download/:id', function (req, res) {
    const sid = req.params.id;
    const file = `${__dirname}/pdfUpload/${sid}.pdf`;
    res.download(file); // Set disposition and send it.
});

// ============================================== CALL FOR INTERVIEW(POST) ======================================================================
app.post("/callForInterview/:id", verify, function (req, res) {

    var employer1ID = req.dataa.id;

    var employee1ID = req.params.id;

    employee.findByIdAndUpdate(employee1ID,
        { $push: { calledEmployers: employer1ID } },
        { safe: true, upsert: true },
        function (err, foundEmployee) {
            if (err) {
                console.log(err);
                console.log("Error in find and Updating the employers in call for interview ");
            } else {
                console.log("POST: /callForInterview");
                console.log(foundEmployee);
                async function sendMail() {
                    try {
                        const accessToken = await oAuth2Client.getAccessToken();

                        const transport = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: 'OAuth2',
                                user: 'sanjaymujumdar20@gmail.com',
                                clientId: CLIENT_ID,
                                clientSecret: CLEINT_SECRET,
                                refreshToken: REFRESH_TOKEN,
                                accessToken: accessToken,
                            },
                        });

                        const mailOptions = {
                            from: 'ACCUJOB <sanjaymujumdar20@gmail.com>',
                            to: foundEmployee.email,
                            subject: 'AccuJob: Interview call message',
                            text: 'Here is the link to reset your password',
                            html: '<h1>Hello from Accu Job</h1> <br> <h2>Congrats!!!</h2> <br> <h2> You have been called for interview.Further details will be sent shortly.</h2>',
                        };

                        const result = await transport.sendMail(mailOptions);
                        return result;
                    } catch (error) {
                        return error;
                    }
                }

                sendMail()
                    .then((result) => console.log('Email sent...', result))
                    .catch((error) => console.log(error.message));

                res.redirect("/empldashboard");
            }
        });
});



// =============================================================================================================================================
// ====================================================== AUTHENTICATION =======================================================================
// =============================================================================================================================================

// ===================================================== EMPLOYEE REGISTER =====================================================================
app.get("/empregister", function (req, res) {
    console.log("Get: /empregister");
    res.render("empregister");
});

app.post("/empregister", async function (req, res) {
    console.log("POST: /empregister");

    var newEmployee = new employee({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        ZIP: req.body.zip,
        country: req.body.country,
        skills: req.body.skills,
        areaOfInterest: req.body.areaOfInterest,
        Location: req.body.location,
        Qualification: req.body.Qualification,
        aboutCandidate: req.body.aboutCandidate,
        password: ''
    });
    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Password mismatch");
        res.redirect("/empregister")
    }
    else if (req.body.password.length < 8) {
        req.flash("error", "Password should have minimum 8 characters.")
        res.redirect("/empregister");
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(req.body.password, salt);
            newEmployee.password = password;
            await newEmployee.save();
            res.redirect("/emplogin");
        }
        catch (e) {
            console.log(e);
        }


    }
});

//======================================================== EMPLOYEE LOGIN =======================================================================
app.get("/emplogin", function (req, res) {
    console.log("Get: /emplogin");
    res.render("emplogin");
});

app.post("/emplogin", async (req, res) => {
    try {

        const { username, password } = req.body;
        const emp = await employee.findOne({ username });
        if (!emp) {
            res.json({ message: "Invalid Creds" });
        }
        const value = await bcrypt.compare(password, emp.password);
        const payload = {
            id: emp._id
        }
        if (value) {
            const token = await jwt.sign(payload, "mysecretKEY", { algorithm: 'HS256' });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/empdashboard");
        }
        else {
            res.json({ message: "Invalid Creds" })
        }
    }
    catch (e) {
        console.log(e);
    }
});


// ===================================================== EMPLOYEE FORGOT PASSWORD =============================================================

app.get('/forgotPasswordEmp', (req, res) => {
    console.log("GET: /forgotPasswordEmp");
    res.render('forgotPasswordEmp');
});

app.post('/forgotPasswordEmp', async (req, res) => {
    console.log("POST: /forgotPasswordEmp");

    const { email } = req.body;

    var foundEmployee = await employee.findOne({ email: email });

    if (email != foundEmployee.email) {
        console.log("User not registered");
        res.render('forgotPasswordEmp', { variable: "User is not registered" });
    }

    const secret = JWT_SECRET + foundEmployee.password;
    const payload = {
        email: foundEmployee.email,
        id: foundEmployee._id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/resetPasswordEmp/${foundEmployee._id}/${token}`;

    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'sanjaymujumdar20@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLEINT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                from: 'ACCUJOB <sanjaymujumdar20@gmail.com>',
                to: foundEmployee.email,
                subject: 'AccuJob: Link to Reset Password',
                text: 'Here is the link to reset your password',
                html: '<h1>Hello from Accu Job</h1> <br> <h2>Link to reset password: ' + link + "</h2>",
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            return error;
        }
    }

    sendMail()
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));

    res.send("Password reset link has been sent successfully");
});

// ===================================================== EMPLOYEE RESET PASSWORD ==============================================================

app.get('/resetPasswordEmp/:id/:token', async (req, res) => {
    console.log("GET: /resetPasswordEmp");

    const { id, token } = req.params;

    var foundEmployee = await employee.findById(id);

    const secret = JWT_SECRET + foundEmployee.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render('resetPasswordEmp', { name: foundEmployee.name, variable: "" });
    } catch (e) {
        console.log("Error in catch of reset Password");
        console.log(e);
    }
});

app.post('/resetPasswordEmp/:id/:token', async (req, res) => {
    console.log("POST: /resetPasswordEmp");

    const { id, token } = req.params;

    var foundEmployee = await employee.findById(id);

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        console.log("Password mismatch in reset password employee");
        res.render('resetPasswordEmp', { name: foundEmployee.name, variable: "Password mismatch" })
    }
    const secret = JWT_SECRET + foundEmployee.password;
    try {
        const payload = jwt.verify(token, secret);
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);
        foundEmployee.password = password;
        await foundEmployee.save();
        res.redirect('/emplogin');
    } catch (e) {
        console.log("Error in catch of reset Password post");
        console.log(e);
    }
});

// ===================================================== EMPLOYER REGISTER ====================================================================
app.get("/emplregister", function (req, res) {
    console.log("Get: /emplregister");
    res.render("emplregister");
});

app.post("/emplregister", async function (req, res) {
    console.log("POST: /emplregister");
    var newEmployer = new employer({
        username: req.body.username,
        email: req.body.email,
        companyName: req.body.companyName,
        phoneNumber: req.body.phoneNumber,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        ZIP: req.body.zip,
        country: req.body.country,
        jobTitle: req.body.jobTitle,
        Salary: req.body.salary,
        jobDescription: req.body.jobDescription,
        skillsRequired: req.body.skillsRequired,
        lastDateToApply: req.body.lastDateToApply,
        percentage: ''
    });
    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Password mismatch");
        res.redirect("/emplregister")
    }
    else if (req.body.password.length < 8) {
        req.flash("error", "Password should have minimum 8 characters.")
        res.redirect("/emplregister");
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(req.body.password, salt);
            newEmployer.password = password;
            await newEmployer.save();
            res.redirect("/empllogin");
        }
        catch (e) {
            console.log(e);
        }
    }
});

//======================================================== EMPLOYER LOGIN =====================================================================
app.get("/empllogin", function (req, res) {
    console.log("Get: /empllogin");
    res.render("empllogin");
});

app.post("/empllogin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const emp = await employer.findOne({ username });
        if (!emp) {
            res.json({ message: "Invalid Creds" });
        }
        const value = await bcrypt.compare(password, emp.password);
        const payload = {
            id: emp._id
        }
        if (value) {
            const token = await jwt.sign(payload, "mysecretKEY", { algorithm: 'HS256' });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/empldashboard");
        }
        else {
            res.json({ message: "Invalid Creds" })
        }
    }
    catch (e) {
        console.log(e);
    }
});

// ===================================================== EMPLOYER FORGOT PASSWORD =============================================================

app.get('/forgotPasswordEmpl', (req, res) => {
    console.log("GET: /forgotPasswordEmpl");
    res.render('forgotPasswordEmpl');
});

app.post('/forgotPasswordEmpl', async (req, res) => {
    console.log("POST: /forgotPasswordEmpl");

    const { email } = req.body;

    var foundEmployer = await employer.findOne({ email: email });

    if (email != foundEmployer.email) {
        console.log("User not registered");
        res.render('forgotPassword', { variable: "User is not registered" });
    }

    const secret = JWT_SECRET + foundEmployer.password;
    const payload = {
        email: foundEmployer.email,
        id: foundEmployer._id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/resetPasswordEmpl/${foundEmployer._id}/${token}`;
    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'sanjaymujumdar20@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLEINT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                from: 'ACCUJOB <sanjaymujumdar20@gmail.com>',
                to: foundEmployer.email,
                subject: 'AccuJob: Link to Reset Password',
                text: 'Here is the link to reset your password',
                html: '<h1>Hello from Accu Job</h1> <br> <h2>Link to reset password: ' + link + "</h2>",
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            return error;
        }
    }

    sendMail()
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));

    res.send("Password reset link has been sent successfully");
});

// ===================================================== EMPLOYER RESET PASSWORD ==============================================================

app.get('/resetPasswordEmpl/:id/:token', async (req, res) => {
    console.log("GET: /resetPasswordEmpl");

    const { id, token } = req.params;

    var foundEmployer = await employer.findById(id);

    const secret = JWT_SECRET + foundEmployer.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render('resetPasswordEmpl', { name: foundEmployer.name, variable: "" });
    } catch (e) {
        console.log("Error in catch of reset Password");
        console.log(e);
    }
});

app.post('/resetPasswordEmpl/:id/:token', async (req, res) => {
    console.log("POST: /resetPasswordEmpl");

    const { id, token } = req.params;

    var foundEmployer = await employer.findById(id);

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        console.log("Password mismatch in reset password employer");
        res.render('resetPasswordEmpl', { name: foundEmployer.name, variable: "Password mismatch" })
    }
    const secret = JWT_SECRET + foundEmployer.password;
    try {
        const payload = jwt.verify(token, secret);
        const salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);
        foundEmployer.password = password;
        await foundEmployer.save();
        res.redirect('/empllogin');
    } catch (e) {
        console.log("Error in catch of reset Password post");
        console.log(e);
    }
});

//============================================================ LOGOUT ===========================================================================
app.get("/logout", function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is working!!!!");
});
