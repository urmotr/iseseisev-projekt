/*jshint esversion:6*/

class Movies {
  constructor(title, banner) {
    this.title = title;
    this.banner = banner;
  }
}

$( document ).ready(function() {
  var page = 1;
  for(i = 0; i<3; i++){
  $.get( "http://www.omdbapi.com/?s=good&page="+page+"&apikey=5a78abf9", function( data ) {
    if(data.Response == "True"){
    data.Search.forEach(function (movie, dataIndex) {
      var text = "";
      text='<div class="movies">';
      if(movie.Type == "movie"){
        if(movie.Title.length > 20){
          text = text+'<p>'+movie.Title.slice(0, 20)+'...</p><img src='+movie.Poster+' height="322" width="162"></div>';
        } else {
          text = text+ '<p>'+movie.Title+'</p><img src='+movie.Poster+' height="322" width="162"></div>';
        }
        $('#Movies').append(text);
      }
    });
  }
  });
  page++;
}
});
