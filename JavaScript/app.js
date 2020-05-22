const reddit = `https://www.reddit.com/r/hiphopheads.json`;
const proxy = 'https://cors-anywhere.herokuapp.com/';
let spotify = `https://api.spotify.com/v1/search`;

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = '';

let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '920d39201a3249ffac54403cf1cd069c';
const redirectUri = 'http://127.0.0.1:5500/index.html';
const scopes = ['user-top-read'];

if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20'
  )}&response_type=token&show_dialog=true`;
}

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
  artist = string.replace(' - ', 'DELETETHIS');
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
  $.ajax({
    url: `${proxy}https://api.spotify.com/v1/search?q=${track}%20${artist}&type=track`,
    type: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    },
    success: function (data) {
      // Do something with the returned data
      console.log(data);
      let uri;
      let results = data.tracks.items;
      if (results.length == 0) {
        return;
      } else {
        uri = data.tracks.items[0].uri;
      }
      uri = uri.replace('spotify:track:', '');
      let songDiv = document.createElement('div');
      songDiv.className = 'song';
      let songPlayer = document.createElement('iframe');
      songPlayer.src = `https://open.spotify.com/embed/track/${uri}`;
      songPlayer.width = '300';
      songPlayer.height = '380';
      songPlayer.frameBorder = '0';
      songPlayer.allowtransparency = 'true';
      songPlayer.allow = 'encrypted-media';
      songDiv.appendChild(songPlayer);
      songList.appendChild(songDiv);
    },
  });
  // spotify = `https://api.spotify.com/v1/search?q=${track}%20${artist}&type=track`;
  // fetch(spotify)
  //   .then((response) => {
  //     console.log(response);
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     let uri;
  //     let results = data.tracks.items;
  //     if (results.length == 0) {
  //       return;
  //     } else {
  //       uri = data.tracks.items[0].uri;
  //     }
  //     uri = uri.replace('spotify:track:', '');
  //     let songDiv = document.createElement('div');
  //     songDiv.className = 'song';
  //     let songPlayer = document.createElement('iframe');
  //     songPlayer.src = `https://open.spotify.com/embed/track/${uri}`;
  //     songPlayer.width = '300';
  //     songPlayer.height = '380';
  //     songPlayer.frameBorder = '0';
  //     songPlayer.allowtransparency = 'true';
  //     songPlayer.allow = 'encrypted-media';
  //     songDiv.appendChild(songPlayer);
  //     songList.appendChild(songDiv);
  //   });
}
