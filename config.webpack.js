const path = require('path')
const dotenv = require('dotenv')

const desp = require('./package.json').dependencies
const modeEnv = process.env.NODE_ENV
dotenv.config({ path: path.resolve(__dirname, `.env.${modeEnv}`) })

module.exports = {
    publicPath: '/',
    moduleExposes: {},
    moduleRemotes: {},
   shared: {
  react: { singleton: true, requiredVersion: desp.react },
  "react-dom": { singleton: true, requiredVersion: desp["react-dom"] },
  "react-router-dom": { singleton: true, requiredVersion: desp["react-router-dom"] },
  redux: { singleton: true, requiredVersion: desp.redux },
  "react-redux": { singleton: true, requiredVersion: desp["react-redux"] },

  "react-dropzone": {
  singleton: true,
  requiredVersion: false
}

}

}
