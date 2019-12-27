
heroku URL: https://scraper-jquery-api.herokuapp.com/api/evaluate (POST)
heroku URL: https://scraper-jquery-api.herokuapp.com/api/hash (POST)

{
	"url": "https://horriblesubs.info",
	"options": {
		"script": "const links = []; $('.latest-releases a').each(function() { links.push($(this)[0].href) }); links;",
		"waitTime": 500,
		"importJquery": true
	}
	
}

{
	"url": "http://www.google.com"
}