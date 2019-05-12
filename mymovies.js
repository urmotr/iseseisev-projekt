/*jshint esversion:6*/

let movies = [];
let page = 1;


$(document ).ready(function() {
  if(localStorage.getItem("Movies")){
    movies = JSON.parse(localStorage.getItem("Movies"));
  }
  render(0);
  $('#nextPage').on('click', () => render(0));
  $('#prevPage').on('click', () => render(-2));
});

function render(stats){
    var url = "";
    if(isNaN(page)){
      page = 1;
    }
    if(page < 0){
      page = 1;
    }
    var i = 0;
    page+=stats;
    $('#Movies').html("");
    total_pages = Math.floor(movies.length/20 +1);
    console.log(total_pages);
    if(page >= total_pages){
      $("#nextPage").hide();
    } else {
      $("#nextPage").show();
    }
    if(page < 2){
      $("#prevPage").hide();
    } else {
      $("#prevPage").show();
    }
    if(total_pages+1 >= page){
    while(i < 20 && i+((page-1)*20)< movies.length){
      var current_movie = i+((page-1)*20);
      var text = "";
      text='<div class="movies">';
        if(movies[current_movie].title.length > 17){
          text = text+'<b>'+movies[current_movie].title.slice(0, 17)+'...</b><br>';
        } else {
          text = text+ '<b>'+movies[current_movie].title+'</b><br>';
        }
        if(movies[current_movie].poster_path == "N/A"){
          text = text+'<img src="https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png" height="322" width="162">';
        } else {
          text = text+ '<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2'+movies[current_movie].banner+'" height="322" width="162">';
        }
          text = text+ `<br><button class="btn rmvBtn" id=(${movies[current_movie].id}) onclick="removeFromList(${movies[current_movie].id});"><i class="fa fa-minus"></i></button>`;
          text = text+ `<button class="btn info" onclick="showInfo(${movies[current_movie].id});"><i class="fa fa-info"></i></button></div>`;
        $('#Movies').append(text);
        i++;
    }
  }
  page++;
}

function showInfo(id){
  $('#popup1').html("");
  //http://www.omdbapi.com/?i=tt0060196&plot=full&apikey=5a78abf9
  $.get( "https://api.themoviedb.org/3/movie/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    $('#popup1').append('<div id="popup" class="popup"><h2>'+info.original_title+'</h2>'+info.overview+'<a class="close" href="#">&times;</a><br><a target="_blank" rel="noopener noreferrer" href="https://www.imdb.com/title/'+info.imdb_id+'/?ref_=plg_rt_1"><img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_46x22.png" alt="'+info.original_title+'" /></a></div>');
    location.replace('#popup1');
  });
  $(document).mouseup(function(e)
  {
    var container = $("#popup");
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
          location.replace('#');
    }
});
}

function checkStatus(id){
  for( var movie of movies) {
    if(movie.id == id){
        index = movies.indexOf(movie);
        return index;
      }
  }
  return false;
}

function removeFromList(id){
  const status = checkStatus(id);
  movies.splice(status, 1);
  localStorage.setItem('Movies', JSON.stringify(movies));
  render(-1);
}
