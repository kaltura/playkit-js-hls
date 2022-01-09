//@flow
import Hlsjs from 'hls.js';

class CustomTimelineController extends Hlsjs.DefaultConfig.timelineController {
  constructor(hls: Hlsjs) {
    super(hls);

    if (this.cea608Parser1 && this.cea608Parser2) {
      const originalResetParser = this.cea608Parser1.reset;
      this.cea608Parser1.reset = resetParser.bind(this.cea608Parser1, originalResetParser);
      this.cea608Parser2.reset = resetParser.bind(this.cea608Parser2, originalResetParser);
    }
  }
}

// eslint-disable-next-line require-jsdoc
function resetParser(originalResetParser) {
  for (const channel of this.channels) {
    if (channel) {
      channel.outputFilter.startTime = null;
    }
  }
  originalResetParser.apply(this);
}

export default CustomTimelineController;
