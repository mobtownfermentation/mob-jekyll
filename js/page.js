$(document).ready(function(){

  //FillDate
  var targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 14);
  var dateString = targetDate.toDateString();
  var dateBits = dateString.split(" ");
  var day = dateBits[0];
      if (day == "Tue"){
          day = "Tuesday"
      } else if (day == "Wed"){
          day = "Wednesday"
      } else if (day == "Thu"){
          day = "Thursday"
      } else if (day == "Sat"){
          day = "Saturday"
      } else {
          day = day+"day"
      };
  var month = dateBits[1];
      if (month == "Jan"){
          month = "January"
      } else if (month == "Feb"){
          month = "February"
      } else if (month == "Mar"){
          month = "March"
      } else if (month == "Apr"){
          month = "April"
      } else if (month == "Jun"){
          month = "June"
      } else if (month == "Jul"){
          month = "July"
      } else if (month == "Aug"){
          month = "August"
      } else if (month == "Sep"){
          month = "September"
      } else if (month == "Oct"){
          month = "October"
      } else if (month == "Nov"){
          month = "November"
      } else if (month == "Dec"){
          month = "December"
      };
  var num = dateBits[2];
      if (num.split("")[0] == 0){
          num = num.split("")[1]
      }
  var dateinfo = day + " " + month + " " + num;
  $("#fillDate").html(dateinfo);




  var timer; //helps to slightly throttle the scroll event
  var aArray = []; //empty array for getNavHrefs

  var getNavHrefs = function() {
    var aChildren = $(".mainNav li").children();
    for (var i=0; i < aChildren.length; i++) {
      var aChild = aChildren[i];
      var ahref = $(aChild).attr('href');
      aArray.push(ahref);
    }
  };
  getNavHrefs();

  $(window).scroll(function () {
    var scrollPos = $(window).scrollTop(); // get current vertical position
    var winHeight = $(window).height(); // get window height
    var docHeight = $(document).height(); // get doc height for last child

    // console.log($(window).scrollTop(),scrollPos,winHeight,docHeight)

    // starts new timeout if new scroll triggered before first timeout finishes
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(function() {

      var scrollNav = function() {
        var breakpoint = $(aArray[0]).height() - 61;
        if ($(window).scrollTop() > breakpoint) {
           $('.mainNav').addClass('navbar-fixed').removeClass('navbar-absolute');
        }else{
          $('.mainNav').removeClass('navbar-fixed').addClass('navbar-absolute');
        }
      };
      scrollNav();

      var activeNav = function() {
        for (var i=0; i < aArray.length; i++) {
          var secID = aArray[i]; // select nav href i
          var secPos = $(secID).offset().top - 61; // get offset of that section from top of page - nav-height
          var secHeight = $(secID).height() +20; // get height of that section + padding-bottom
          if (scrollPos >= secPos && scrollPos < (secPos + secHeight)) { //if looking at that section
            $("a[href='" + secID + "']").addClass("nav-active");
          } else {
            $("a[href='" + secID + "']").removeClass("nav-active");
          }
        }

        // if at the bottom of the page make the last nav li active & others inactive
        if(scrollPos + winHeight == docHeight) {
          if (!$("mainNav li:last-child a").hasClass("nav-active")) {
            var navActiveCurrent = $(".nav-active").attr("href");
            $("a[href='" + navActiveCurrent + "']").removeClass("nav-active");
            $("nav li:last-child a").addClass("nav-active");
          }
        }
      };
      activeNav();

    }, 15); //delay of 10 ms
  });

  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - 40 // minus nav-height
          }, 1000);
          return false;
        }
      }
    });
  });




})
