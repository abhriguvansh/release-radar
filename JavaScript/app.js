const reddit = `https://www.reddit.com/r/hiphopheads.json`;
const spotify = `https://api.spotify.com/v1/search`;
const auth = {
  headers: {
    Authorization: `Bearer BQC9O7F2JoMh9qb_Nclz9ZbDODBKTlTK2blBSEaocGHjvzilzVlPsX0noFWW48nxqzKUYPXdg51E09Q74Up8f5VHhVDeV6ifOT5NVHMURXeymcCVEeDrEgaKhOeToRalSK8iZM1Nx154plmV73kQv7aGyXk`,
  },
};

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
        addToSongs();
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
    console.log(string2);
    let index2 = string2.search('DDD');
    trackName = string2.substring(index2 + 3, string2.length);
  }
  return trackName;
}

//finds song in spotify, add it to page
function addToSongs() {
  fetch(spotify, auth)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
}
