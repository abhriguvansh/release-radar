const api = `https://www.reddit.com/r/hiphopheads.json`;
fetch(api)
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
      console.log(postTitles[i].substring(0, 7));
    }
  });
