var apiKey = 'MoepDSejShHpWYHdQHAZsEsMAi9yCWnY';
var userID = 'NinaIkea';

var perPage = 12;
var behanceUserAPI = 'http://www.behance.net/v2/users/' + userID + '?callback=?&api_key=' + apiKey;
var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?callback=?&api_key=' + apiKey + '&per_page=' + perPage;

function setPortfolioTemplate() {
  var projectData = JSON.parse(sessionStorage.getItem('behanceProject')),
    getTemplate = $('#portfolio-template').html(),
    template = Handlebars.compile(getTemplate),
    result = template(projectData);
  $('#portfolio').html(result);
};

if (sessionStorage.getItem('behanceProject')) {
  setPortfolioTemplate();
} else {
  $.getJSON(behanceProjectAPI, function(project) {
    var data = JSON.stringify(project);
    sessionStorage.setItem('behanceProject', data);
    setPortfolioTemplate();
  });
};