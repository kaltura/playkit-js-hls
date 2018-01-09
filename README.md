# PlayKit JS HLS - [HLS.JS] Adapter for the [PlayKit JS Player]

[![Build Status](https://travis-ci.org/kaltura/playkit-js-hls.svg?branch=master)](https://travis-ci.org/kaltura/playkit-js-hls)

PlayKit JS HLS adapter integrates [HLS.JS] with the [PlayKit JS Player].
 
PlayKit JS HLS is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[HLS.JS]: https://github.com/video-dev/hls.js
[HLS.JS API docs]: https://github.com/video-dev/hls.js/blob/master/doc/API.md
[Flow]: https://flow.org/
[ECMAScript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[Babel]: https://babeljs.io

## Getting Started

### Prerequisites
The adapter requires [PlayKit JS Player] to be loaded first.

The adapter uses the [HLS.JS] javascript library.

[Playkit JS Player]: https://github.com/kaltura/playkit-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-hls.git
cd playkit-js-hls
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/playkit.js"></script>
<script type="text/javascript" src="/PATH/TO/FILE/playkit-hls.js"></script>
<div id="player-placeholder"" style="height:360px; width:640px">
<script type="text/javascript">
var playerContainer = document.querySelector("#player-placeholder");
var config = {...};
var player = playkit.core.loadPlayer(config);
playerContainer.appendChild(player.getView());
player.play();
</script>
```

## Configuration

[HLS.JS] configuration options, documented @[HLS.JS API docs], can be passed via the [PlayKit JS Player] config.

The configuration is exposed via the playback section:

```javascript
{
  playback:{
    options: {
      html5: {
        hls: {
          // HLS.JS configuration options here
        }
      }
    }
  }
}
``` 

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[Karma]: https://karma-runner.github.io/1.0/index.html
```
yarn run test
```

You can test individual browsers:
```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.


## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-hls/tags). 

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
