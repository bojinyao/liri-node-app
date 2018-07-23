//======================
// Required Dependencies
//======================
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");

//==========
// variables
//==========
const DOWHATITSAYSFILE = "./random.txt";
const ACTIVITYLOGS = "./log.txt";
const LOGTYPE = "utf8";

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

    writeToLog(`\n===============================`);
    writeToLog(`\nCommand Executed: ${args.slice(2)}`);
    writeToLog(`\nReturned: `);

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
    fs.appendFileSync(ACTIVITYLOGS, msg, LOGTYPE);
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
        tweets.forEach(post => {
            let result = `\n${post.created_at}\nid: ${post.id}\n${post.text}`;
            writeToLog(result);
            console.log(result);
        });
        console.log(``);
        writeToLog("\n");
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
    spotify.search({type: 'track', query: target}, (err, data) => {
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
            throw "Didn't find anything :(";
        }
     });
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

}

/**
 * Using the text inside of random.txt and then use it to call one of LIRI's commands.
 */
function doWhatItSays() {
    let command = fs.readFileSync(DOWHATITSAYSFILE, LOGTYPE);
    // console.log(command);
    let args = command.replace(/["]+/g, '').split(",");
    args.unshift("", "");
    Main(args);
}


Main(process.argv);

