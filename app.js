const express = require('express');
const app = express();
const request = require('request-promise');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');

//logger config
const logConfiguration = {
	'transports': [
		new winston.transports.File({
			filename: './logs/citysLogFile.log'
		})
	]
};
//criar o logger
const logger = winston.createLogger(logConfiguration);

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//conectar a BD
mongoose.connect('mongodb+srv://Ice:Maniac45@cluster0-grven.mongodb.net/test?retryWrites=true&w=majority',
{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//Criar o Schema para as Cidades na BD
const citySchema = new mongoose.Schema({
	name: String
});
const cityModel = mongoose.model('City', citySchema);

//fazer o request a api do openweathermap e retornar 1 array com as cidades inseridas na BD e log do url pro ficheiro
async function getData(cities){
	const cityData = [];

	for(let cityObj of cities) {
		const city = cityObj.name;
		const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f138d8f096ac3b609bb5c04e337efdf6`;
		const responseData = await request(url);
		const cityJson = JSON.parse(responseData);
		const cityDetails = {
			name: city,
			temp: cityJson.main.temp,
			icon: cityJson.weather[0].icon,
			sunrise: cityJson.sys.sunrise,
			sunset: cityJson.sys.sunset
		};
		cityDetails.sunrise = getTime(cityDetails.sunrise);
		cityDetails.sunset = getTime(cityDetails.sunset);

		cityData.push(cityDetails);

		logger.info(url);
	}
	return cityData;
}

//converter sunrise e sunset time
function getTime(oldFormat) {
	const date = new Date(oldFormat*1000);
	const hours = date.getHours();
	const minutes = "0" + date.getMinutes();
	const formattedTime = hours + ':' + minutes.substr(-2);

	return formattedTime;
}

// /route
app.get("/", function (req, res) {
	cityModel.find({}, function(err, cities, next){
		getData(cities)
		.then(function(results){
			const cityData = {cityData: results};
			res.render("home", cityData);
		})
		.catch(function(err){
			console.log("este e o erro:"+err);
			cityModel.collection.drop();
			res.render("error");
		});
	});
});

// post city route
app.post("/", function (req, res) {
	const cityName = req.body.cityName;
	const newCity = new cityModel({name : cityName});
	if(cityName) {
		newCity.save(function(err, city) {
			if(err) {
				console.log(err);
			}else {
				console.log("New City added to the DB!");
				res.render("home");
			}
		});
	}
	res.redirect("/");
});

// diferentes routes
app.get("*", function (req, res) {
	res.send("Page not found!")
});

// listen na port
app.listen(3000, function() {
	console.log("The Server is up and running!")
});