// module.exports = {
//   headers: [{
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//   }]
// }


module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
