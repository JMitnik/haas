const JsDomEnv = require('jest-environment-jsdom');

class CustomEnvironment extends JsDomEnv {

  async setup() {
    await super.setup();
    this.global.DOMRect = class DOMRect {
      constructor(x = 0, y = 0, width = 0, height = 0) { };
      static fromRect(other) {
        return new DOMRect(other.x, other.y, other.width, other.height)
      }
      toJSON() {
        return JSON.stringify(this)
      }
    }
  }

}

module.exports = CustomEnvironment;