const reddit = `https://www.reddit.com/r/hiphopheads.json`;
let spotify = `https://api.spotify.com/v1/search`;
const auth = {
  headers: {
    Authorization: `Bearer BQCavN_EFq-cBcMUiz1QTiazNpD2kUenVRmrQI4zy_JK5WUwG-w8pxu8dlk2d7cV7SzSVxlF6C6z1MAc8kWFhVjGd7Wfo2ap21ChW228RhXEhfdOEkFYboF2MqjLZTR2ADt11WZhdhgWeWOlOO49eutod6U`,
  },
};

const songList = document.querySelector('.song-list');

fetch(reddit)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let posts = data.data.children;
    let postTitles = new Array();
    for (let i = 0; i < posts.length; i++) {
      postTitles[i] = posts[i].data.title; //array full of post names
    }
    for (let i = 0; i < posts.length; i++) {
      if (postTitles[i].substring(0, 7) == '[FRESH]') {
        console.log('Reddit Post: ' + postTitles[i]);
        let artist = artistFromTitle(postTitles[i]);
        console.log('Artist: ' + artist);
        let trackName = trackNameFromTitle(postTitles[i]);
        console.log('Name of Track: ' + trackName);
        addToSongs(trackName, artist);
      }
    }
  });

//get name of artist from reddit post
function artistFromTitle(title) {
  let artist;
  let string = title.substring(7, title.length);
  artist = string.replace('-', 'DELETETHIS');
  let index = artist.search('DELETETHIS');
  artist = artist.substring(0, index);
  artist = artist.replace(' ', '');
  if (!artist) {
    string = title.substring(9, title.length);
    artist = string.replace('-', 'DELETETHIS');
    let index = artist.search('DELETETHIS');
    artist = artist.substring(0, index);
    artist = artist.replace(' ', '');
  }
  let featIndex = artist.search('feat.'); //remove if artist name has feat. in it
  if (featIndex != -1) {
    artist = artist.substring(0, featIndex);
  }
  let ftIndex = artist.search('ft.'); //remove if artist name has ft. in it
  if (ftIndex != -1) {
    artist = artist.substring(0, ftIndex);
  }
  artist = artist.replace(/ /g, '%20'); //spotify search uses %20 instead of spaces
  return artist;
}

//get name of song from reddit post and convert it to spotify readable title
function trackNameFromTitle(title) {
  let trackName;
  let string = title.replace('-', 'DELETETHIS');
  let index = string.search('DELETETHIS');
  trackName = title.substring(index + 1, title.length);
  if (trackName.search('-') != -1) {
    trackName = '';
    let string2 = title.substring(9, title.length);
    string2 = string2.replace('-', 'DDD');
    let index2 = string2.search('DDD');
    trackName = string2.substring(index2 + 3, string2.length);
  }
  trackName = trackName.replace(/ /g, '%20'); //spotify search uses %20 instead of spaces
  return trackName;
}

//finds song in spotify, add it to page
function addToSongs(track, artist) {
  spotify = `https://api.spotify.com/v1/search?q=${track}%20${artist}&type=track`;
  fetch(spotify, auth)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let results = data.tracks.items;
      if (results.length == 0) {
        return;
      } else {
        let uri = data.tracks.items[0].uri;
      }
      song;
    });
}
