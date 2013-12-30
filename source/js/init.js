/*global skel, jQuery, window, document*/
(function ($) {
  var qualifyURL = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
  };

  $('article').each(function (i, art) {
    var url = $('h2 a', art).attr('href') || window.location.href;
    $.sharedCount(qualifyURL(url), function (data) {
      $(".fa-twitter", art).text(data.Twitter);
      $(".fa-facebook", art).text((typeof data.Facebook === 'object') ? data.Facebook.like_count : 0);
      $(".fa-google-plus", art).text(data.GooglePlusOne);
    });
  });

  $(window).on('resize', function () {
    var width = window.innerWidth;
  });
}(jQuery));
