var superagent = require("superagent"),
  cheerio = require("cheerio"),
  DB = require("./db"),
  urlParser = require("url");

function scrapeHadhwanaag(){
  var siteName = "Hadhwanaag";
  var url = "http://hadhwanaagnews.ca/more.aspx?type=1";
  var selector = "#MainContent_dlNews a";
  var urlPrefix = "http://hadhwanaagnews.ca/";

  scrapeSite(siteName, url, selector, {host: "hadhwanaagnews.ca", urlPrefix: urlPrefix});
}

function scrapeBoramaNews(){
  var siteName = "BoramaNews";
  var url = "http://boramanews.com/index.php?option=com_content&view=section&layout=blog&id=5&Itemid=53";
  var selector = ".blog_more ul li a";
  var urlPrefix = "http://boramanews.com";

  scrapeSite(siteName, url, selector, {host: "boramanews.com", urlPrefix: urlPrefix});
}

function scrapeSomalilandOrg(){
  var siteName = "Somaliland.Org";
  var url = "http://www.somaliland.org/";
  var selector = "#content article.post h1.entry-title a";

  scrapeSite(siteName, url, selector, {host: "www.somaliland.org"});
}

function scrapeCaynabaNews(){
  var siteName = "CaynabaNews";
  var url = "http://www.caynabanews.com/caynaba.php?catid=Wararka&type=Content&list=Yes";
  var selector = "table td[height=100] a";
  var urlPrefix = "http://www.caynabanews.com/";

  scrapeSite(siteName, url, selector, {host: "www.caynabanews.com", urlPrefix: urlPrefix});
}

function scrapeSomalilandToday(){
  var siteName = "SomalilandToday";
  var url = "http://somalilandtoday.com/category/news/";
  var selector = "#content .post h2 a";

  scrapeSite(siteName, url, selector, {host: "somalilandtoday.com"});
}

function scrapeGabileyNet(){
  var siteName = "Gabiley.Net";
  var url = "http://gabiley.net/category/news/";
  var selector = "#gk-mainbody .post h2 a";

  scrapeSite(siteName, url, selector, {host: "gabiley.net"});
}

function scrapeSite(siteName, url, selector, options){
  var start = Date.now();

  console.log("Scraping " + siteName + " at " + new Date(start));

  superagent.get(url, function(err, res){
    if(err || res.statusCode !== 200){
      return console.log("Failed to fetch " + siteName);
    }

    console.log("Fetched " + siteName + " . Cheerio loading in "  + (Date.now() - start) + "ms" );

    var $ = cheerio.load(res.text, {encoding: "utf-8"});

    var posts = [];

    $(selector).each(function(){
      var postUrl = $(this).attr("href");

      if(!urlParser.parse(postUrl).host) {
        var urlPrefix = options.urlPrefix || ("http://" + options.host + "/");

        postUrl = urlPrefix + postUrl;
      }

      var post = {
        title: $(this).text().trim(),
        url: postUrl,
        host: options.host
      };

      if(post.title || !post.host) {
        posts.push(post);
      }
    });

    console.log(siteName + " scraping completed. Posts: ", posts.length);

    DB.
      savePosts(posts).
      then(function(){
        console.log("Successfully saved " + siteName + " posts to DB.");
      }).
      fail(function (err) {
        console.log("Failed to save " + siteName + " posts to DB.", err);
      }).
      finally(function () {
        console.log(siteName + " scraper completed in "  + (Date.now() - start) + "ms");
      }).
      done();
  });
}

setTimeout(scrapeHadhwanaag, 0);
setTimeout(scrapeBoramaNews, 0);
setTimeout(scrapeSomalilandOrg, 0);
setTimeout(scrapeCaynabaNews, 0);
setTimeout(scrapeSomalilandToday, 0);
setTimeout(scrapeGabileyNet, 0);

/*
setInterval(scrapeHadhwanaag, 60000);
setInterval(scrapeBoramaNews, 90000);
setInterval(scrapeSomalilandOrg, 60000);
setInterval(scrapeCaynabaNews, 60000);
setInterval(scrapeSomalilandToday, 60000);
setInterval(scrapeGabileyNet, 60000);
*/
