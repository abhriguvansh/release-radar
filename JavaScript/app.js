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
        console.log(postTitles[i]);
        let artist = artistFromTitle(postTitles[i]);
        console.log(artist);
        addToSongs();
      }
    }
  });

//takes in title of reddit post and converts it so we can add it to spotify link to search
function artistFromTitle(title) {
  let artist;
  let string = title.substring(7, title.length);
  artist = string.replace('-', 'DELETETHIS');
  let index = artist.search('DELETETHIS');
  artist = artist.substring(0, index);
  //artist = artist.replace('DELETETHIS', '');
  return artist;
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
