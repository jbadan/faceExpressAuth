// loading screen
$(document).ready(function(){
  $('#loading_wrap').remove();
});

//custom carousel animations on homepage
//https://www.sitepoint.com/bootstrap-carousel-with-css3-animations/
var $myCarousel = $('#myExampleCarousel');
$myCarousel.carousel();
function doAnimations(elems) {
  var animEndEv = 'webkitAnimationEnd animationend';
  elems.each(function () {
    var $this = $(this),
        $animationType = $this.data('animation');
    $this.addClass($animationType).one(animEndEv, function () {
      $this.removeClass($animationType);
    });
  });
}
var $firstAnimatingElems = $myCarousel.find('.item:first')
                           .find('[data-animation ^= "animated"]');
doAnimations($firstAnimatingElems);
$myCarousel.carousel('pause');
$myCarousel.on('slide.bs.carousel', function (e) {
  var $animatingElems = $(e.relatedTarget)
                        .find("[data-animation ^= 'animated']");
  doAnimations($animatingElems);
});
$myCarousel.carousel({
  interval: 4000
});

// passwords matching on sign up
$('#authPassword, #confirmPassword').on('keyup', function () {
  if ($('#authPassword').val() == $('#confirmPassword').val()) {
    $('#message').html('Passwords match').css('color', 'green');
  } else
    $('#message').html('Passwords do not match').css('color', 'red');
});
$(function() {
  $(":password").keyup(check_submit).each(function() {
    check_submit();
  });
});
function check_submit() {
  if ($('#authPassword').val() != $('#confirmPassword').val()) {
    $(":submit").attr("disabled", true);
  } else {
    $(":submit").removeAttr("disabled");
  }
}
$(function() {
    $('.imageCharts').hide();
});

//delete image from profile
$('.delete-link').on('click', function(e) {
  e.preventDefault();
  var deleteUrl = $(this).attr('href');
  $.ajax({
    method: 'DELETE',
    url: deleteUrl
  }).done(function(data) {
  });
  window.location.reload();
});
//trash button animation on hover
$('.trash').hover(
  function(){
    $(this).addClass('animated pulse infinite')
  },
  function(){
    $(this).removeClass('animated pulse infinite')
  }
);
