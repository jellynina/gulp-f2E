var apiKey = 'MoepDSejShHpWYHdQHAZsEsMAi9yCWnY';
var userID = 'NinaIkea';

var perPage = 12;
var behanceUserAPI = 'http://www.behance.net/v2/users/' + userID + '?callback=?&api_key=' + apiKey;
var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?callback=?&api_key=' + apiKey; //+ '&per_page=' + perPage;

$('#projects').on('click', '.project-cover', function(){
  var $this = $(this),
      projectID = $this.data('project-id'),
      beProjectContentAPI = 'http://www.behance.net/v2/projects/'+ projectID +'?callback=?&api_key=' + apiKey,
      keyName = 'behanceProjectImages-' + projectID;

  function showGallery(dataSource){
    $this.magnificPopup({
      items: dataSource,
      gallery: {
				enabled: true
			},
			type: 'image',
			mainClass: 'animated',
			removalDelay: 350
    }).magnificPopup('open');
  };
  if(localStorage.getItem(keyName)) {
		var srcItems = JSON.parse(localStorage.getItem(keyName));
		showGallery(srcItems);
	} else {
		$.getJSON(beProjectContentAPI, function(projectContent) {
			var src = [];
			$.each(projectContent.project.modules, function(index, mod) {
				if(mod.src != undefined) {
					src.push({ src: mod.src });
				}
			});
			showGallery(src);
			var data = JSON.stringify(src);
			localStorage.setItem(keyName, data);
		});
	};


});
