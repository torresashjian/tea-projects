
function TeaException(message, details, exitCode, statusCode) {
    this.message = message;
    this.details = details;
    this.exitCode = exitCode;
    this.statusCode = statusCode;
};

exports.createTeaException = function (message, details, exitCode, statusCode) {
    console.log('Creating TeaException: '+message);
    return new TeaException(message, details, exitCode, statusCode);
};


