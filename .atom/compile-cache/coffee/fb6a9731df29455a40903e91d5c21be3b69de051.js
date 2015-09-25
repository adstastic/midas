(function() {
  module.exports = {
    isDarwin: function() {
      return this.platform() === 'darwin';
    },
    isWindows: function() {
      return this.platform() === 'win32';
    },
    isLinux: function() {
      return this.platform() === 'linux';
    },
    platform: function() {
      return process.platform;
    }
  };

}).call(this);
