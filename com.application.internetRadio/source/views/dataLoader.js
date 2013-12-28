
var API_KEY = "api_key=940a2d6372cbbfd7b3705c073db7ead86a882b0d";
var API_VERSION = "api_version=3";
var URL_PREFIX = "http://8tracks.com/";

var MIX_ID;
var PLAY_TOKEN;

function requestData(url, callback) {

    if (!url) {
        alert('No url was passed.');
        return false;
    }
    console.log(url);

    //ajax request object
    var requestdata = new enyo.Ajax({
        url: url,
        method: "GET",
        handleAs: "json"
		});
    // request info
    requestdata.go();

    //handle response
    requestdata.response(this, function (inSender, inResponse) {
		console.log(inResponse);
        callback(inResponse);
    })
    requestdata.error(function (inSender, inResponse) {
        console.log(inResponse);
        callback(inResponse);
    });
};


function getGenres(context,callback) {
    var genreURL = URL_PREFIX +"tags.json?"+ API_KEY +"&"+ API_VERSION;
    this.requestData(genreURL, function (result) {
        callback(context,result); // callback to controller
    })
};


function getMixes(context,tags, callback) {
    var mixesURL = URL_PREFIX +"mix_sets/tags:"+ tags +":safe.json?include=mixes&"+ API_KEY +"&"+ API_VERSION;
    this.requestData(mixesURL, function (result) {
        callback(context,result); // callback to controller
    })
};


function nextTrack(context,callback) {
    var playMixURL = URL_PREFIX +"sets/"+ PLAY_TOKEN +"/next.json?mix_id="+ MIX_ID +"&"+ API_KEY +"&"+ API_VERSION;
    this.requestData(playMixURL, function (result) {
        callback(context,result); // callback to controller
    })
};

function playMix(context,mixID, callback) {
    MIX_ID = mixID;
    var playTokenURL = URL_PREFIX +"sets/new.json?"+ API_KEY +"&"+ API_VERSION;
    this.requestData(playTokenURL, function (result) {
        this.PLAY_TOKEN = result.play_token;
        console.log(this.PLAY_TOKEN);
        var playMixURL = URL_PREFIX +"sets/"+ PLAY_TOKEN +"/play.json?mix_id="+ MIX_ID +"&"+ API_KEY +"&"+ API_VERSION;
        this.requestData(playMixURL, function (result) {
            callback(context,result); // callback to controller
        })
    
    })
};

