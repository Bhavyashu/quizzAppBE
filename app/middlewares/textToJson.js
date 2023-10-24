// as of now the frontend isn't sending the data in the form of json object, it sending it in the form of text/plain so we get the string data from the request and then parse it to josn in the 'req' object and hardcoded the 'body' field in the req object to parse the string in request to the json so that the rest of the code can work properly

/**
 *
 */
function textToJson(req, res, next) {
  if (req.is('text/plain')) {
    try {
      req.body = JSON.parse(req.body);
    } catch (err) {
      return next(err);
    }
  }
  next();
}
module.exports = textToJson;
