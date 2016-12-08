const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  plugins: [
    new DefinePlugin({
      ANOM_TOKEN: "''"
    })
  ]
};
