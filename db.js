var Q = require("q"),
  PG = require("pg"),
  Config = require("./config");

function savePost(post, deferred){
  PG.connect(Config.connectionString, function (err, client, done) {
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
