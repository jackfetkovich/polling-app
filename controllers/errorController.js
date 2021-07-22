const AppError = require('../utils/appError');

const handleDuplicateKeyError = (err, res) => {
  res.status(400).json({
    status: 'fail',
    message: `${Object.keys(err.keyValue)[0]} is already in use`
  })
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
    console.log('===ERROR===');
    console.log(err);
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res);
  }

  if(process.env.NODE_ENV === 'production'){
    if(err.code === 11000) return handleDuplicateKeyError(err, res);
    sendErrorProd(err, res);
  }
  
}

