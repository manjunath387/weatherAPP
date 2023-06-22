const express = require("express");
const app = express();
const https= require('https');
const bodyParser = require('body-parser')
const dotenv=require("dotenv");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
dotenv.config({ path: "./config.env" });
app.get("/", (req, res) => {
            res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    const city = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + process.env.APIKEY + "&units=metric";

    const request = https.get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            try {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const wDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
  
                res.render("index", { temprature: temp, icon: icon, imageLink: imageURL, description: wDescription, cityName: city });
            } catch (error) {
                res.render("error", { cityName: req.body.cityName});
            }
        });
    });

    request.on("error", (error) => {
        res.render("error", { errorMessage: "Error connecting to weather API" });
    });
});
app.listen(3000, () => {
    console.log(" server is running");
})