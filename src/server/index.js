const express = require('express');
const os = require('os');
//import TikTokAPI, { getRequestParams } from 'tiktok-api';
const TikTokAPI = require('tiktok-api').default;
const getRequestParams = require('tiktok-api').getRequestParams;

const app = express();

app.use(express.static('dist'));

const signURL = async (url, ts, deviceId) => {
  const as = 'a225e304e452fcba312652&ts=1547778596';
  const cp = 'nospam-2';
  const mas = '01cc64a4dbffc7a33b7dac199f1b0ac6ae7de70cbd65a2131c84e7';
  return `${url}&as=${as}&cp=${cp}&mas=${mas}`;
}

const params = getRequestParams({
  device_id: '235235235235235',
  fp: '<device_fingerprint>',
  iid: '<install_id>',
  openudid: '<device_open_udid>',
  app_language: 'en',
  language: 'en',
  region: 'US',
  sys_region: 'US',
  carrier_region: 'US',
  timezone_name: 'Europe/Madrid',
});
/*const params = getRequestParams({
  device_id: '6644064523324147205',
  fp: '<device_fingerprint>',
  iid: '6644064414965188357',
  openudid: '53567cdbfff39ae461995bae9cd118fcd830a381',
});*/

app.get('/api/feed', async (req, res) => {
  const api = new TikTokAPI(params, { signURL });
  await api.listForYouFeed({pull_type: 0})
    .then(response => res.send({ feed: response.data.aweme_list }))
    .catch(console.log);
});

app.get('/api/feed/:hashtag', async (req, res) => {
  const api = new TikTokAPI(params, { signURL });
  const hashtag = req.params.hashtag || ''
  
  console.log(hashtag)
  await api.searchHashtags({
    keyword: hashtag,
    count: 10,
    cursor: 0,
  })
    .then(response => {
      res.send({ feed: response.data })
      console.log(response.data)
    })
    .catch(console.log);
  

  /*await api.listPostsInHashtag({ ch_id: hashtag })
    .then(response => res.send({ feed: response.data.aweme_list }))
    .catch(console.log);*/
});


app.listen(8080, () => console.log('Listening on port 8080!'));
