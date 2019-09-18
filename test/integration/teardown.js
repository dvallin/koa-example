module.exports = async () => {
  if (global.postgres !== undefined) {
    await global.postgres.stop()
    delete global.postgres
  }
}
