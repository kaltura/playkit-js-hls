import playkit from 'playkit-js';
//eslint-disable-next-line no-unused-vars
import HlsAdapter from '../../src/hls-adapter.js'

describe('HlsAdapter', function () {
  this.timeout(4000);

  it.only('should play hls stream - preload none', () => {
    let player = playkit({
      sources: [{
        mimetype: "application/x-mpegurl",
        // url: "https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/ElephantsDream.smil/playlist.m3u8"
        // url: "https://tungsten.aaplimg.com/VOD/bipbop_adv_example_v2/master.m3u8"
        url: "http://cdnbakmi.kaltura.com/p/243342/sp/24334200/playManifest/entryId/0_uka1msg4/flavorIds/1_vqhfu6uy,1_80sohj7p/format/applehttp/protocol/http/a.m3u8"
      }]
    });
    let video = document.getElementsByTagName("video")[0];
    video.onplaying = function () {
      // done();
    };
    player.load();
    player.play();
  });

  it('should play hls stream - preload auto', (done) => {
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
