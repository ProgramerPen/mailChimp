const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
const { response } = require("express");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/" , function(req, res){
    res.sendFile(__dirname +"/index.html");
})

app.post("/", function(req, res){
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const email = req.body.email;
    const data = {
        members:  [
            {
                
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }

        ]
    };
    const JSONData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/85d03d282e";
    const options = {
        method: "POST",
        auth: "ProgrammerPen:2bb58d985ffe268ffc9e811f26c77086-us20"
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){

            console.log(JSON.parse(data));
                
            if (JSON.parse(data).error_count >= 1) {
                console.log("ERROR: " + JSON.parse(data).errors[0].error);
                res.sendFile(__dirname + "/fail.html")  
                
            }
            else {
                
                res.sendFile(__dirname + "/suc.html")   
            }
        });

    });

    request.write(JSONData);
    request.end();
   

});

app.post("/fail", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("listening on 3000");
})

// 2bb58d985ffe268ffc9e811f26c77086-us20  
// 85d03d282e

