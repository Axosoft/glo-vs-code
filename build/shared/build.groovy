def build_vs_code(configuration) {
  // copy config file from Jenkins
  configFileProvider([configFile(fileId: "glo-vs-code-${configuration}-config", variable: 'GLO_VS_CODE_CONFIG_PATH')]) {
    sh "cat $GLO_VS_CODE_CONFIG_PATH > src/config.ts"
  }

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