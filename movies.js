/*jshint esversion:6*/

let movies = [];
let page = 1;

class Movie {
  constructor(title, id, banner) {
    this.title = title;
    this.id = id;
    this.banner = banner;
  }
}

$(document ).ready(function() {
  if(localStorage.getItem("Movies")){
    movies = JSON.parse(localStorage.getItem("Movies"));
  }
  renderPopularMovies(0);
  $('#searchMovie').on('click', function(){
    page = 1;
    renderPopularMovies(0);
  });
  var title = $('#title').val().replace(/ /g,"+");
  $('#nextPage').on('click', () => renderPopularMovies(0));
  $('#prevPage').on('click', () => renderPopularMovies(-2));
});

function renderPopularMovies(stats){
  var title = $('#title').val().replace(/ /g,"+");
  var url = "";
  if(isNaN(page)){
    page = 1;
  }
    page+=stats;
    if(title == "") {
      url = "https://api.themoviedb.org/3/discover/movie?api_key=bf189b69bddcc61c8a2cc82e7130ae13&include_adult=false&include_video=false&page="+page+"";
    } else {
       url =  "https://api.themoviedb.org/3/search/movie?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US&query="+title+"&page="+page+"&include_adult=false";
    }
    console.log(url);
  $('#Movies').html("");
    $.get( url, function( data ) {
    if(data.total_pages < page){
      $("#nextPage").hide();
    } else {
      $("#nextPage").show();
    }
    if(page <= 2){
      $("#prevPage").hide();
    } else {
      $("#prevPage").show();
    }
    if(data.total_pages+1 >= page){
    data.results.forEach(function (movie, dataIndex) {
      var text = "";
      text='<div class="movies">';
        if(movie.title.length > 17){
          text = text+'<b>'+movie.title.slice(0, 17)+'...</b><br>';
        } else {
          text = text+ '<b>'+movie.title+'</b><br>';
        }
        if(movie.poster_path == "N/A"){
          text = text+'<img src="https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png" height="322" width="162">';
        } else {
          text = text+ '<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2'+movie.poster_path+'" height="322" width="162">';
        }
          //add button
          var status = checkStatus(movie.id);
          if(status === false){
            text = text+ `<br><button class="btn addBtn" id=(${movie.id}) onclick="addToList(${movie.id});"><i class="fa fa-check"></i></button>`;
          } else {
            text = text+ `<br><button class="btn rmvBtn" id=(${movie.id}) onclick="removeFromList(${movie.id});"><i class="fa fa-minus"></i></button>`;
          }
          //Show information button
          text = text+ `<button class="btn info" onclick="showInfo(${movie.id});"><i class="fa fa-info"></i></button></div>`;
        $('#Movies').append(text);
    });
  }
  });
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
  renderPopularMovies(-1);
}

function addToList(id){
  $.get( " https://api.themoviedb.org/3/movie/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    const title = info.title;
    const banner = info.poster_path;
    const status = checkStatus(id);
    console.log(status);
    if(!status){
      movies.push(new Movie(title, id, banner));
      localStorage.setItem('Movies', JSON.stringify(movies));
      renderPopularMovies(-1);
    } else {
      console.log("Film juba eksisteerib teie listis");
    }
  });
}
