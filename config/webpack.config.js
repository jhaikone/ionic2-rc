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
      ANOM_TOKEN: JSON.stringify(process.env.ANOM_TOKEN),
      MASTER_TOKEN: JSON.stringify(process.env.MASTER_TOKEN),
      SIGN_UP_TOKEN: JSON.stringify(process.env.SIGN_UP_TOKEN),
      APP_ID: JSON.stringify(process.env.APP_ID),
      APP_NAME: JSON.stringify(process.env.APP_NAME),
      ANDROID_NAME: JSON.stringify(process.env.ANDROID_NAME),
      TEST_USER_EMAIL: JSON.stringify(process.env.TEST_USER_EMAIL),
      TEST_USER_PASSWORD: JSON.stringify(process.env.TEST_USER_PASSWORD)
    })
  ]
};
