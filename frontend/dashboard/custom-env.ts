// const JsDomEnv = require('jest-environment-jsdom');
import JsDomEnv from 'jest-environment-jsdom';

class CustomEnvironment extends JsDomEnv {

  async setup() {
    await super.setup();
    this.global.DOMRect = class DOMRect {
      height: number;
      width: number;
      x: number;
      y: number;
      bottom: number;
      left: number;
      right: number;
      top: number;
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