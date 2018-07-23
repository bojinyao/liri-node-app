require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");

const DOWHATITSAYSFILE = "./random.txt";
const ACTIVITYLOGS = "./log.txt";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function Main(args) {
    let arg1 = args[2];
    let arg2 = args[3];

    try{
        switch (arg1) {
            case "my-tweets":
                if (arg2) {
                    throw "Invalid Command";
                }
                myTweets();
                break;
            case "spotify-this-song":
                if (!arg2) {
                    throw "Missing Command.";
                }
                spotifyThisSong(arg2);
                break;
            case "movie-this":
                if (!arg2) {
                    throw "Missing Command.";
                }
                movieThis(arg2);
                break;
            case "do-what-it-says":
                if (arg2) {
                    throw "Invalid Command";
                }
                doWhatItSays();
                break;
            default:
                throw "Unrecognized Command.";
    
        }
    } catch (err) {
        console.log(err);
    }
}

function myTweets() {

}

function spotifyThisSong(target) {

}

function movieThis(target) {

}

function doWhatItSays() {

}


Main(process.argv);

