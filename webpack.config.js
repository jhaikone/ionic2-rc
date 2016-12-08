const DefinePlugin = require('webpack/lib/DefinePlugin');

try {
  require('dotenv-safe').load({
    path: __dirname + '/.env',
    sample: __dirname + '/.env.example'
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}

module.exports = {
  plugins: [
    new DefinePlugin({
      ANOM_TOKEN: JSON.stringify(process.env.ANOM_TOKEN)
    })
  ]
};
