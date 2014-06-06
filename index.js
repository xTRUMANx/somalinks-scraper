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
  var siteName = "Borama News";
  var url = "http://boramanews.com/index.php?option=com_content&view=section&layout=blog&id=5&Itemid=53";
  var selector = ".blog_more ul li a";
  var urlPrefix = "http://boramanews.com";

  scrapeSite(siteName, url, selector, {host: "boramanews.com", urlPrefix: urlPrefix});
}

function scrapeSomalilandOrg(){
  var siteName = "Somaliland.org";
  var url = "http://www.somaliland.org/";
  var selector = "#content article.post h1.entry-title a";

  scrapeSite(siteName, url, selector, {host: "www.somaliland.org"});
}

function scrapeCaynabaNews(){
  var siteName = "Caynaba News";
  var url = "http://www.caynabanews.com/caynaba.php?catid=Wararka&type=Content&list=Yes";
  var selector = "table td[height=100] a";
  var urlPrefix = "http://www.caynabanews.com/";

  scrapeSite(siteName, url, selector, {host: "www.caynabanews.com", urlPrefix: urlPrefix});
}

function scrapeSomalilandToday(){
  var siteName = "Somaliland Today";
  var url = "http://somalilandtoday.com/category/news/";
  var selector = "#content .post h2 a";

  scrapeSite(siteName, url, selector, {host: "somalilandtoday.com"});
}

function scrapeGabileyNet(){
  var siteName = "Gabiley News";
  var url = "http://gabiley.net/category/news/";
  var selector = "#gk-mainbody .post h2 a";

  scrapeSite(siteName, url, selector, {host: "gabiley.net"});
}

function scrapeBurcoOnline(){
  var siteName = "Burco Online";
  var url = "http://burcoonline.com/category/1/Wararka";
  var selector = ".left-column .content-holder h1 a";

  scrapeSite(siteName, url, selector, {host: "burcoonline.com"});
}

function scrapeGobanimoNews(){
  var siteName = "Gobanimo News";
  var url = "http://www.gobanimonews.com/warar/";
  var selector = "#homepost h2 a";

  scrapeSite(siteName, url, selector, {host: "www.gobanimonews.com"});
}

function scrapeHargeisaNews(){
  var siteName = "Hargeisa News";
  var url = "http://www.hargeisanews.net/?cat=1";
  var selector = ".catNews li a";

  scrapeSite(siteName, url, selector, {host: "www.hargeisanews.net"});
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
        host: options.host,
        siteName: siteName
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
setTimeout(scrapeBurcoOnline, 0);
setTimeout(scrapeGobanimoNews, 0);
setTimeout(scrapeHargeisaNews, 0);

setInterval(scrapeHadhwanaag, 60000);
setInterval(scrapeBoramaNews, 90000);
setInterval(scrapeSomalilandOrg, 60000);
setInterval(scrapeCaynabaNews, 60000);
setInterval(scrapeSomalilandToday, 60000);
setInterval(scrapeGabileyNet, 60000);
setInterval(scrapeBurcoOnline, 60000);
setInterval(scrapeGobanimoNews, 60000);
setInterval(scrapeHargeisaNews, 60000);
