/*jshint esversion:6*/

let series = [];
let page = 1;
let showsOnPage = [];
let show = 0;

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
  $('#nextPage').on('click', () => render(0));
  $('#prevPage').on('click', () => render(-1));
});

function render(stats){
    var current_show = 0;
    var url = "";
    if(stats < 0){
      show -= showsOnPage[page-1];
    }
    if(page == 1 && 0 < show){
      show -= showsOnPage[page-1];
    }
    if(isNaN(page)){
      page = 1;
    }
    if(isNaN(show)){
      show = 0;
    }
    var i = 0;
    page+=stats;
    if(page < 0){
      page = 1;
    }
    $('#Movies').html("");
    total_pages = Math.floor(series.length/20 +1);
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
    while(i < 20 && i+((page-1)*20)< series.length){
      if(page == 0){
        	 current_show = i+((page)*20)+show;
      } else {
           current_show = i+((page-1)*20)+show;
      }
      console.log("Show: "+current_show);
      var text = "";
      if(series[current_show].status != "completed"){
        text='<div class="movies">';
          if(series[current_show].title.length > 17){
            text = text+'<b>'+series[current_show].title.slice(0, 17)+'...</b><br>';
          } else {
            text = text+ '<b>'+series[current_show].title+'</b><br>';
          }
          if(series[current_show].poster_path == "N/A"){
            text = text+'<img src="https://m.media-amazon.com/images/G/01/imdb/images/nopicture/32x44/film-3119741174._CB483525279_.png" height="322" width="162">';
          } else {
            text = text+ '<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2'+series[current_show].banner+'" height="322" width="162">';
          }
            text = text+ `<br><button class="btn rmvBtn" id=(${series[current_show].id}) onclick="removeFromList(${series[current_show].id});"><i class="fa fa-minus"></i></button>`;
            text = text+ `<button `;
            if(series[current_show].status == "watching"){
              text = text+ `style="background-color: Aquamarine;"`;
            } else{
              if(series[current_show].status == "on_hold"){
                text = text+ `style="background-color: Gold;"`;
              } else {
                text = text+ `style="background-color: DodgerBlue;"`;
              }
            }
            text = text+ `class="btn edit" id=${series[current_show].id} onclick="editList(${series[current_show].id});"><i class="fa fa-edit"></i></button>`;
            text = text+ `<button class="btn info" onclick="showInfo(${series[current_show].id});"><i class="fa fa-info"></i></button></div>`;
          $('#Movies').append(text);
          i++;
        } else {
          show++;
        }
    }
  }
  page++;
  showsOnPage.push(show);
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

function removeFromList(id){
  const status = checkStatus(id);
  console.log(status);
  series.splice(status, 1);
  localStorage.setItem('Series', JSON.stringify(series));
  render(-1);
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

function checkStatus(id){
  for(var show of series) {
    if(show.id == id){
        index = series.indexOf(show);
        return index;
      }
  }
  return false;
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
    render(0);
    location.replace('#');
  });
}
