/*global skel, jQuery, window, document, _gaq*/
(function ($) {
  var qualifyURL = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
  };

  $('article').each(function (i, art) {
    var url = $('h2 a', art).attr('href') || window.location.href;
    $.sharedCount(qualifyURL(url), function (data) {
      $(".fa-twitter-square", art)
        .text(data.Twitter)
        .attr('target', '_blank')
        .click(function () {
          _gaq.push(['_trackEvent', 'share', 'twitter']);
        });
      $(".fa-facebook-square", art)
        .text((typeof data.Facebook === 'object') ? data.Facebook.like_count : 0)
        .attr('target', '_blank')
        .click(function () {
          _gaq.push(['_trackEvent', 'share', 'facebook']);
        });
      $(".fa-google-plus-square", art)
        .text(data.GooglePlusOne)
        .attr('target', '_blank')
        .click(function () {
          _gaq.push(['_trackEvent', 'share', 'gplus']);
        });
    });
  });
}(jQuery));
