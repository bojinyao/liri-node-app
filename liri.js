//======================
// Required Dependencies
//======================
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const moment = require("moment");
const request = require("request");

//==========
// variables
//==========
const DOWHATITSAYSFILE = "./random.txt";
const ACTIVITYLOGFILE = "./log.txt";
const UTF8 = "utf8";
const OMDBKEY = `f59e23b9`;

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//-------------------------------------------

/**
 * The Main program.
 * @param {String[]} args command line inputs 
 */
function Main(args) {
    let arg1 = args[2];
    let arg2 = args[3];

    let now = moment();
    writeToLog(`\n===============================`);
    writeToLog(`\n${now}`);
    writeToLog(`\nCommand Parsed: ${args.slice(2)}`);
    writeToLog(`\nResponse >>> `);

    try {
        switch (arg1) {
            case "my-tweets":
                if (arg2) {
                    throw "Invalid Command";
                }
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThisSong(arg2);
                break;
            case "movie-this":
                movieThis(arg2);
                break;
            case "do-what-it-says":
                if (arg2) {
                    throw "Invalid Command";
                }
                doWhatItSays();
                break;
            default:
                writeToLog(`\nUnrecognized Command.\n`);
                throw "Unrecognized Command.";

        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Writing a Message directly to whatever log is being used.
 * @param {String} msg 
 */
function writeToLog(msg) {
    fs.appendFileSync(ACTIVITYLOGFILE, msg, UTF8);
}

/**
 * This will show your last 20 tweets and when they were created at in your terminal/bash window.
 */
function myTweets() {
    client.get("statuses/user_timeline", { count: 20 }, (err, tweets, response) => {
        if (err) {
            // console.log(err)
            throw "Problem getting Tweets";
        }
        // console.log(tweets)
        // console.log(`========================`)
        // console.log(response);
        if (tweets.length > 0) {
            tweets.forEach(post => {
                let result = `\n${post.created_at}\nid: ${post.id}\n${post.text}`;
                writeToLog(result);
                console.log(result);
            });
            console.log(``);
            writeToLog("\n");
        } else {
            writeToLog("\nNone Returned by Twitter.");
        }
    })
}

/**
 * This will show the following information about the song in terminal/bash window
 * - Artist(s)
 * - The song's name
 * - A preview link of the song from Spotify
 * - The album that the song is from
 * If no song is provided then the program will default to "The Sign" by Ace of Base.
 * @param {String} target the song to search for
 */
function spotifyThisSong(target) {
    if (!target) {
        target = "The Sign ace of base";
    }
    spotify.search({ type: 'track', query: target }, (err, data) => {
        if (err) {
            // console.log(err);
            throw "Problem getting music.";
        }
        // console.log(data);
        let items = data.tracks.items;
        if (items.length > 0) {
            // console.log(data.tracks.items[0])
            let curr = items[0];
            let artistNames = [];
            curr.artists.forEach(artistObj => {
                artistNames.push(artistObj.name);
            });
            let result = `\nArtist Name: ${artistNames.join(", ")}\nSong Name: ${curr.name}\nLink: ${curr.external_urls.spotify}\nAlbum Name: ${curr.album.name}\n`
            console.log(result);
            writeToLog(result);
        } else {
            writeToLog("\nNone Returned by Spotify.");
            throw "Didn't find anything :(";
        }
    })
}

/**
 * This will show the following information about the movie in terminal/bash window
 * - Title of the movie.
 * - Year the movie came out.
 * - IMDB Rating of the movie.
 * - Rotten Tomatoes Rating of the movie.
 * - Country where the movie was produced.
 * - Language of the movie.
 * - Plot of the movie.
 * - Actors in the movie.
 * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
 * @param {String} target the movie to search for 
 */
function movieThis(target) {
    if (!target) {
        target = `Mr.Nobody&y=2009`;
    }
    let url = `http://www.omdbapi.com/?apikey=${OMDBKEY}&t=${target}`
    request({ url: url, json: true }, function (error, response, body) {
        if (error) {
            throw "Problem getting movie.";
        }
        if (!error && response.statusCode == 200) {
            let result = `\nTitle: ${body.Title}\nYear: ${body.Year}\nIMDB rating: ${body.Ratings[0].Value}\nRotten Tomatoes rating: ${body.Ratings[1].Value}\nCountry: ${body.Country}\nLanguage: ${body.Language}\nPlot: ${body.Plot}\nActors: ${body.Actors}\n`;
            // console.log(body);
            console.log(result);
            writeToLog(result);
        }
    })
}

/**
 * Using the text inside of random.txt and then use it to call one of LIRI's commands.
 */
function doWhatItSays() {
    let command = fs.readFileSync(DOWHATITSAYSFILE, UTF8);
    if (command.includes("do-what-it-says")) {
        throw "Invalid Command in File."
    }
    // console.log(command);
    let args = command.replace(/["]+/g, '').split(",");
    args.unshift("", "");
    Main(args);
}


Main(process.argv);

