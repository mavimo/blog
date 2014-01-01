/*global jQuery, window*/
jQuery.sharedCount = function (url, fn) {
  url = encodeURIComponent(url || window.location.href);
  var arg = {
    data: {
      url : url,
      apikey : "93bed5c084eb25ca3a357e29001be83b853e010b"
    },
    url: "//" + (window.location.protocol === "https:" ? "sharedcount.appspot" : "api.sharedcount") + ".com/",
    cache: true,
    dataType: "json"
  };

  if ('withCredentials' in new XMLHttpRequest()) {
    arg.success = fn;
  }
  else {
    var cb = "sc_" + url.replace(/\W/g, '');
    window[cb] = fn;
    arg.jsonpCallback = cb;
    arg.dataType += "p";
  }
  return jQuery.ajax(arg);
};
