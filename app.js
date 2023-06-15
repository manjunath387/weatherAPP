const express = require("express");
const app = express();
const https= require('https');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
            res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    const city = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=bf795983aef662234d93b063463fbcab&units=metric";
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const wDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.render("index", { temprature: temp, icon: icon, imageLink: imageURL, description: wDescription, cityName:city });
        })
    })
    
})
app.listen(3000, () => {
    console.log(" server is running");
})