//Spotify: npm location--> https://www.npmjs.com/package/spotify
//npm i spotify
const readline = require('readline');
const Spotify = require('node-spotify-api');
//npm i dotenv
require('dotenv').config();// to load environment variables from .env file

// Setup Spotify API client with credentials from my dot environment variables file
const spotifyClient = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,//To read the input
  output: process.stdout//To give the output
});

// Prompt function to get the users input from the terminal
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Function to fetch the songs details from Spotify API
function fetchSpotifySong(songName) {
  return new Promise((resolve, reject) => {
    spotifyClient.search({ type: 'track', query: songName }, (error, data) => {
     
      if (data.tracks.items.length > 0) { // Checks if the song is on Spotify then prints out its details
        const track = data.tracks.items[0];
        const songDetails = {
          artists: track.artists.map(artist => artist.name).join(', '),
          song: track.name,
          previewLink: track.preview_url,
          album: track.album.name
        };
        console.log(JSON.stringify(songDetails, null, 2)); // Prints the song details as a JSON object
        resolve(songDetails);
      }
      else if(error){
        console.error("Error in fetching the song: ", error);
        return reject(error);
      }
        else {
        console.log("No results found");//Shows that the song is not on spotify, and rejects
        reject();
      }
    });
  });
}

//function to handle user input and call the fetchSpotifySong function
(async () => {
  try {
    const songName = await prompt("What's the song name: ");
    await fetchSpotifySong(songName);//Waits for the function to run before closing the program at line 61
  } catch (e) {
    console.error("Unable to prompt", e);//If something happens to go wrong it will print it to the terminal and close the program
  } finally {
    rl.close();//Just to help clean up incase an error happens
  }
})();

// Close the readline interface when done
rl.on('close', () => process.exit(0));

