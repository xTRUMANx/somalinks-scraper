var Q = require("q"),
  PG = require("pg"),
  Config = require("./config"),
  url = require("url");

var connectionString = Config.connectionString;

var parsedConnectionString = url.parse(connectionString);

var connectionConfig = {
  user: parsedConnectionString.auth.split(":")[0],
  password: parsedConnectionString.auth.split(":")[1],
  database: parsedConnectionString.pathname.substr(1),
  port: parsedConnectionString.port,
  host: parsedConnectionString.hostname,
  ssl: true
};

function savePost(post, deferred){
  PG.connect(connectionConfig, function (err, client, done) {
    if(err){
      return deferred.reject(err);
    }

    var sql = "select upsert_posts_by_url($1, $2)";

    client.query(sql, [post.url, post], function (err) {
      done();

      if(err){
        deferred.reject(err);
      }
      else{
        deferred.resolve();
      }
    });
  });
}

module.exports = {
  savePosts: function(posts){
    var promises = [];

    posts.forEach(function(post){
      var deferred = Q.defer();

      promises.push(deferred.promise);

      savePost(post, deferred);
    });

    return Q.all(promises);
  }
};
