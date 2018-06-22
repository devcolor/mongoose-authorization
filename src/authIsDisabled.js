function authIsDisabled(options) {
  return options && options.authLevel === false;
}

module.exports = authIsDisabled;
