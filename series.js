/*jshint esversion:6*/

let series = [];
let page = 1;

class Show {
  constructor(title, id, banner, episodes, status) {
    this.title = title;
    this.id = id;
    this.banner = banner;
    this.episodes = episodes;
    this.status = status;
  }
}

$(document ).ready(function() {
  if(localStorage.getItem("Series")){
    series = JSON.parse(localStorage.getItem("Series"));
  }
  render(0);
  $('#searchSeries').on('click', function(){
    page = 1;
    render(0);
  });
  var title = $('#title').val().replace(/ /g,"+");
  $('#nextPage').on('click', () => render(0));
  $('#prevPage').on('click', () => render(-2));
});

function render(stats){
  var title = $('#title').val().replace(/ /g,"+");
  var url = "";
  if(isNaN(page)){
    page = 1;
  }
    page+=stats;
    if(title == "") {
      url = "https://api.themoviedb.org/3/discover/tv?api_key=bf189b69bddcc61c8a2cc82e7130ae13&include_adult=false&include_video=false&page="+page+"";
    } else {
       url =  "https://api.themoviedb.org/3/search/tv?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US&query="+title+"&page="+page+"&include_adult=false";
    }
    console.log(url);
  $('#Movies').html("");
    $.get( url, function( data ) {
    if(data.total_pages+1 <= page){
      $("#nextPage").hide();
    } else {
      $("#nextPage").show();
    }
    if(page <= 2){
      $("#prevPage").hide();
    } else {
      $("#prevPage").show();
    }
    data.results.forEach(function (movie, dataIndex) {
      var text = "";
      text='<div class="movies">';
        if(movie.name.length > 17){
          text = text+'<b>'+movie.name.slice(0, 17)+'...</b><br>';
        } else {
          text = text+ '<b>'+movie.name+'</b><br>';
        }
        if(movie.poster_path == "N/A"){
          text = text+'<img src="https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png" height="322" width="162">';
        } else {
          text = text+ '<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2'+movie.poster_path+'" height="322" width="162">';
        }
          var status = checkStatus(movie.id);
          if(status === false){
            text = text+ `<br><button class="btn check" onclick="completedShow(${movie.id});"><i class="fa fa-check"></i></button>`;
            text = text+ `<button class="btn addBtn" id=${movie.id} onclick="addToList(${movie.id});"><i class="fa fa-plus"></i></button>`;
          } else {
            text = text+ `<br><button class="btn rmvBtn" id=(${movie.id}) onclick="removeFromList(${movie.id});"><i class="fa fa-minus"></i></button>`;
            text = text+ `<button class="btn edit" id=${movie.id} onclick="editList(${movie.id});"><i class="fa fa-edit"></i></button>`;
          }
          text = text+ `<button class="btn info" onclick="showInfo(${movie.id});"><i class="fa fa-info"></i></button></div>`;
        $('#Movies').append(text);
    });
  });
  page++;
}

function showInfo(id){
  $('#popup1').html("");
  $.get( "https://api.themoviedb.org/3/tv/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    $('#popup1').append('<div id="popup" class="popup"><h2>'+info.name+'</h2>'+info.overview+'<a class="close" href="#">&times;</a><br><a target="_blank" rel="noopener noreferrer" href="'+info.homepage+'"><i class="fa fa-home"></i></a></div>');
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
  for(var show of series) {
    if(show.id == id){
        index = series.indexOf(show);
        return index;
      }
  }
  return false;
}

function removeFromList(id){
  const status = checkStatus(id);
  series.splice(status, 1);
  localStorage.setItem('Series', JSON.stringify(series));
  render(-1);
}

function completedShow(id){
  $.get( "https://api.themoviedb.org/3/tv/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    const title = info.name;
    const banner = info.poster_path;
    const status = checkStatus(id);
    const episodes = info.number_of_episodes;
    console.log(status);
    if(!status){
      series.push(new Show(title, id, banner, episodes, "completed"));
      localStorage.setItem('Series', JSON.stringify(series));
      render(-1);
    } else {
      console.log("Series already is in your list");
    }
  });
}

function addToList(id){
  var text = "";
  $('#popup1').html("");
  $.get( "https://api.themoviedb.org/3/tv/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    const status = checkStatus(id);
    if(!status){
      text = text + `<div id="popup" class="popup"><h2>${info.name}</h2><div id="popupText" class="popupText">`;
      text = text + `Status: <select id="status"><option value="watching">watching</option>`;
      text = text + `<option value="completed">Completed</option>`;
      text = text + `<option value="on_hold">On-hold</option>`;
      text = text + `<option value="plan_to_watch">Plan to watch</option></select><br>`;
      //text = text + ``;
      text = text + `<form>Episodes watched: <input id="episode" type="number" min="0" max="${info.number_of_episodes}" step="1"></input> / ${info.number_of_episodes}</form>`;
      text = text + `<button id="nextPage" class="btn btn-primary" onclick="saveToList(${id})">Save to your list</button>`;
      text = text + `</div><a class="close" href="#">&times;</a><br><a target="_blank" rel="noopener noreferrer" href="${info.homepage}"><i class="fa fa-home"></i></a></div>`;
      $('#popup1').append(text);
      location.replace('#popup1');
    }
    $(document).mouseup(function(e)
    {
      var container = $("#popup");
      if (!container.is(e.target) && container.has(e.target).length === 0)
      {
            location.replace('#');
      }
  });
  });
}
function saveToList(id){
  $.get( "https://api.themoviedb.org/3/tv/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
    const title = info.name;
    const banner = info.poster_path;
    const status = $( "#status option:selected" ).val();
    const episodes = parseInt($( "#episode").val());
    console.log(status);
    console.log(episodes);
    if(checkStatus(id) >= 0){
      series.splice(checkStatus(id), 1);
    }
    series.push(new Show(title, id, banner, episodes, status));
    localStorage.setItem('Series', JSON.stringify(series));
    render(-1);
    location.replace('#');
  });
}

function editList(id){
  const status = checkStatus(id);
  console.log(status);
  var text = "";
  $('#popup1').html("");
  $.get( "https://api.themoviedb.org/3/tv/"+id+"?api_key=bf189b69bddcc61c8a2cc82e7130ae13&language=en-US", function( info ) {
  text = text + `<div id="popup" class="popup"><h2>${info.name}</h2><div id="popupText" class="popupText">`;
  text = text + `Status: <select id="status"><option value="watching">watching</option>`;
  text = text + `<option selected="selected" value="completed">Completed</option>`;
  text = text + `<option value="on_hold">On-hold</option>`;
  text = text + `<option value="plan_to_watch">Plan to watch</option></select><br>`;
  //text = text + ``;
  text = text + `<form>Episodes watched: <input id="episode" type="number" min="0" max="${info.number_of_episodes}" step="1"></input> / ${info.number_of_episodes}</form>`;
  text = text + `<button id="nextPage" class="btn btn-primary" onclick="saveToList(${id})">Save to your list</button>`;
  text = text + `</div><a class="close" href="#">&times;</a><br><a target="_blank" rel="noopener noreferrer" href="${info.homepage}"><i class="fa fa-home"></i></a></div>`;
  $('#popup1').append(text);
  $( '#status option[value='+series[status].status+']').attr('selected','selected');
  $('#episode').val(series[status].episodes);
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
