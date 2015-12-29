
// Navigation Behavior

$(document).ready(function () {
$('#toggle').click(function() {
  $(this).next('.nav').toggleClass("is-collapsed-mobile");
});

$(document).on("scroll", onScroll);

$('.nav li').children('a').click(function (e) {
		e.preventDefault();

    $(document).off("scroll");

    $('a').each(function () {
        $(this).parent().removeClass('nav__item--current');
    })
    $(this).parent().addClass('nav__item--current');

		// var postId = $($(this).attr('href'));
		// var postLocation = postId.offset().top - 100;
		//$(window).scrollTop(postLocation);
		//or with animate:
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top+2
    }, 500, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
});
});


/*
$(window).scroll(function () {
		var scrollBar = $(this).scrollTop();

		$(".section").each(function (index) {
				var elTop = $(this).offset().top;
				var elHeight = $(this).height();

				if (scrollBar >= elTop-120 && scrollBar < elTop + elHeight) {
						$('.nav li').eq(index).addClass('nav__item--current').siblings().removeClass('nav__item--current');
				}
		});

});
*/

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('.nav a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.nav li').removeClass("nav__item--current");
            currLink.parent().addClass("nav__item--current");
        }
        else{
            currLink.parent().removeClass("nav__item--current");
        }
    });
}
