module.exports = class IncompatibleMethodError extends Error {
  constructor(method) {
    const message = `[${method}] is not compatable with mongoose-authz. ` +
    `Please see https://www.npmjs.com/package/mongoose-authz#${method} for more details.`;

    super(message);
    this.name = 'IncompatibleMethod';
  }
};
