const express = require('express');
const os = require('os');
//import TikTokAPI, { getRequestParams } from 'tiktok-api';
const TikTokAPI = require('tiktok-api').default;
const getRequestParams = require('tiktok-api').getRequestParams;

const app = express();

app.use(express.static('dist'));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/api/feed', async (req, res) => {
  // Required - a method that signs the URL with anti-spam parameters
  // You must provide an implementation yourself to successfully make
  // most requests with this library.
  const signURL = async (url, ts, deviceId) => {
    const as = 'nospam-1'+deviceId;
    const cp = 'nospam-2'+deviceId;
    const mas = 'nospam-3'+deviceId;
    return `${url}&as=${as}&cp=${cp}&mas=${mas}`;
  }

  // Required - device parameters
  // You need to source these using a man-in-the-middle proxy such as mitmproxy,
  // CharlesProxy or PacketCapture (Android)
  const params = getRequestParams({
    device_id: '235235235235235',
    fp: '<device_fingerprint>',
    iid: '<install_id>',
    openudid: '<device_open_udid>',
  });

  const api = new TikTokAPI(params, { signURL });

  await api.listForYouFeed({pull_type: 'LoadMore'})
    .then(response => res.send({ feed: response.data.aweme_list }))
    .catch(console.log);
});

app.listen(8080, () => console.log('Listening on port 8080!'));
