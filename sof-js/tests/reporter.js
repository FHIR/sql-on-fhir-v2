export default class SqlOnFhirReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig
    this._options = reporterOptions
    this._context = reporterContext
  }

  onRunComplete(testContexts, results) {
    console.log('onRunComplete')
    console.log('global.testResults', global.testResults)
  }
}
