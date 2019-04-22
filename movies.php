<?php
function callMovies($page) {
  $url="http://www.omdbapi.com/?s=good&page=$page&apikey=5a78abf9";
  $result = file_get_contents($url);
  $vars = json_decode($result, true);
  return $vars;
}
?>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Filmid</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js"></script>
  <link rel="stylesheet" href="style.css">
  <script src="index.js" charset="utf-8"></script>
  <div class="header">
    <a href="index.html" class="logo">Track your movies/series</a>
    <div class="header-right">
      <a href="index.html">Home</a>
      <a class="active" href="movies.php">Movies</a>
      <a href="#series">Series</a>
      <a href="#progress">Progress list</a>
    </div>
  </div>
</head>
<body>
  <div id="Movies" class="movies">
  </div>
</body>
</html>
