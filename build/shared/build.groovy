def build_app_bundle(configuration) {
  // pull shared UI
  sshagent (credentials: ['axosoft-build']) {
    // install depencencies
    sh "git clone git@github.com:Axosoft/app.gitkraken.com.git"
  
    dir ('app.gitkraken.com') {
      sh 'yarn'

      // HACK: build shared styles
      dir("./node_modules/gitkraken-shared-styles") {
        sh 'yarn build'
      }
      // HACK: copy gk-shared-styles to tasks-ui node_modules
      sh "cp -R ./node_modules/gitkraken-shared-styles ./node_modules/getcrakin-shared/node_modules"

      // copy the config.json for tasks-ui package before building it
      sh "cp ./node_modules/getcrakin-shared/build/${configuration}/config.json ./node_modules/getcrakin-shared/config.json"

      // build
      sh 'yarn build'
    }
  }
}

def build_vs_code(configuration) {
  // copy bundle to extension src folder
  sh 'cp app.gitkraken.com/static/bundle.js src/glo.js'

  // install extension build dependencies
  sh 'npm install'

  // build the extension file
  sh 'node_modules/.bin/vsce package'

  def extensionFilename = sh (
    script: 'find *.vsix',
    returnStdout: true
  ).trim()

  // archive artifact
  archiveArtifacts artifacts: extensionFilename

  return extensionFilename
}

return this