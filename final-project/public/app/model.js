var MODEL = (function () {
  var _grabNewContent = function (pageName, callback) {
    //get the new html page that was clicked
    $.get(`pages/${pageName}/${pageName}.html`, function (data) {
      //console.log(data);
      //replace the body with that new page
      $(".app").html(data);
      if (callback) {
        callback(pageName);
      }
    });
  };

  return {
    //send the private function
    grabNewContent: _grabNewContent,
  };
})();
