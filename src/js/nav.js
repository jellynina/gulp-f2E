
// Navigation Behavior

$('#toggle').click(function() {
  $(this).next('.nav').toggleClass("is-collapsed-mobile");
});

$('.nav li').children('a').click(function (e) {
		e.preventDefault();
		var postId = $($(this).attr('href'));
		var postLocation = postId.offset().top - 100;
		//$(window).scrollTop(postLocation);
		//or with animate:
		$('html, body').animate({scrollTop:postLocation},'slow');
});

$(window).scroll(function () {
		var scrollBar = $(this).scrollTop();

		$(".section").each(function (index) {
				var elTop = $(this).offset().top;
				var elHeight = $(this).height();

				if (scrollBar >= elTop-120 && scrollBar < elTop + elHeight) {
						$('.nav li').eq(index).addClass('nav__item--current').siblings().removeClass('nav__item--current');
				}
		});

		if ($(window).scrollTop() > 500) {
      $('#navbar').addClass('nav__bar--fixed');
    }
    if ($(window).scrollTop() < 501) {
      $('#navbar').removeClass('nav__bar--fixed');
    }
});
