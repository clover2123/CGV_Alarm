var request  = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var nodemailer = require('nodemailer');

function notification() {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'user@gmail.com',
			pass: 'passwd'
		}
	});

	var mailOptions = {
		from: 'user@gmail.com',
		to: 'receiver@mail.com',
		subject: 'CGV Notification',
		text: 'Movie Reservation has been opened'
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent:' + info.response);
		}
	});
}

function cgvCrawler() {
	request(pageToVisit, function(error, response, body) {
		if(error) {
			console.log("Error: " + error);
   		}
	   	// Check status code (200 is HTTP OK)
		//console.log("Status code: " + response.statusCode);
		if(response.statusCode === 200) {
			// Parse the document body
			var $ = cheerio.load(body);

			if ($('span.screentype:has(span.imax)').length > 0) {
				console.log($('span.screentype:has(span.imax)').text());
		        	console.log("Success : Reservation Opened");
	        		notification();
				exitCrawling();	
	   		}
   		}
	});
}

function exitCrawling() {
	clearInterval(intervalObj);
}

var pageToVisit = "http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx?areacode=01&theatercode=0013&date=20170729";
var intervalObj = setInterval(cgvCrawler, 300000);
//var intervalObj = setInterval(cgvCrawler, 2000);

