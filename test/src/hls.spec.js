import playkit from 'playkit-js';
import HlsAdapter from '../../src/hls.js'

describe('HlsAdapter', function () {
  this.timeout(4000);

  it('should play hls stream - preload none', (done) => {
    let player = playkit({
      sources: [{
        mimetype: "application/x-mpegurl",
        url: "http://www.streambox.fr/playlists/test_001/stream.m3u8"
      }]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
      player.destroy();
      done();
    };
    player.load();
    player.play();
  });

  it('should play hls stream - preload none', (done) => {
    let player = playkit({
      preload: "auto",
      sources: [{
        mimetype: "application/x-mpegurl",
        url: "http://www.streambox.fr/playlists/test_001/stream.m3u8"
      }]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
      player.destroy();
      done();
    };
    player.load();
    player.play();
  });
});
