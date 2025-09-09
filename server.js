import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://twitter-followers.p.rapidapi.com/seanaagbaje/profile',
  params: { page: '1' },
  headers: {
    'x-rapidapi-key': '70e512e8bdmshaaffc4d5a9623d3p16477cjsnd7d34b12bfd6',
    'x-rapidapi-host': 'twitter-followers.p.rapidapi.com'
  }
};

axios.request(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
