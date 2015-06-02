var router;
var gaCrumb = '/shuttle/';
var gaDimensions = {};

function navigation() {
    /*routie('/:nav', function(nav){
        if($('section#'+nav)){
            $('section').hide();
            $('section#'+nav).show().addClass('animated');
            window.scrollTo(0,0);
        }
        else{
            routie('/departures');
        }
    });*/
    router = new Grapnel();
    router.get('/:nav', function(req) {
        if ($('section#' + req.params.nav)) {
            $('section').hide();
            $('section#' + req.params.nav).show().addClass('animated');
            window.scrollTo(0, 0);
            if (req.params.nav === 'planner') {
                var title = 'Trip Planner | 1800 F Shuttle';
                document.title = title;
            }
            if (req.params.nav === 'schedule') {
                var title = 'Schedule | 1800 F Shuttle';
                document.title = title;
            }
            if (req.params.nav === 'departures') {
                var title = 'Departures | 1800 F Shuttle';
                document.title = title;
            }
            if (req.params.nav === '') {
                var title = 'Departures | 1800 F Shuttle';
                document.title = title;
            }
        } else {
            router.navigate('/departures');
        }
    });
    router.get('', function(req) {
        router.navigate('/departures');
    });
    router.get('/', function(req) {
        router.navigate('/departures');
    });

    $("nav li,.nav-secondary > div").hover(
        function() {
            if (window.innerWidth > 991) {
                var nav = $(this).attr('data-nav');
                $('.nav-secondary [data-nav=' + nav + ']').show().siblings().hide;
                //$('.hero').addClass('blurred');
                $('nav [data-nav=' + nav + ']').addClass('active')
            }
        },
        function() {
            if (window.innerWidth > 991) {
                var nav = $(this).attr('data-nav');
                $('.nav-secondary [data-nav=' + nav + ']').hide();
                $('.hero').removeClass('blurred');
                $('nav [data-nav=' + nav + ']').removeClass('active')
            }
        });

    $("nav li").on('click', function() {
        var nav = $(this).attr('data-nav');
        $(this).addClass('active').siblings().removeClass('active');
        $('.nav-secondary [data-nav=' + nav + ']').show().siblings().hide();
        $('.nav-secondary').addClass('active');
        $('nav').addClass('drawer-open');
    });

    $('.hero').on('click', function() {
        $('.nav-secondary').removeClass('active');
        $('nav').removeClass('drawer-open');
        $('.nav-primary li').removeClass('active');
    });

    $('.menu-toggle').on('click', function() {
        $(this).toggleClass('active');
        $('nav').toggleClass('active');
        $('.nav-primary li').removeClass('active');
    });

    $('.btn-navigation,nav li').on('click', function() {
            var nav = $(this).attr('data-nav');
            router.navigate('/' + nav);
            $('nav').removeClass('active');
            $('.menu-toggle').removeClass('active');
        })
        /* TEMP */
        /*$('.nav-secondary li').on('click',function(){
            $('.menu-toggle').removeClass('active');
            $('nav').removeClass('active');
            $('.nav-secondary').removeClass('active');
            $('.nav-primary li').removeClass('active');
        });*/

    //GA on hashchange
    router.on('hashchange', function(event) {
        if (window.location.hash.indexOf('undefined') === -1) {
            if (typeof ga !== "undefined") {
                ga('send', 'pageview', gaCrumb + window.location.hash, null, document.title);
            } else {
                console.log('send', 'pageview', gaCrumb + window.location.hash, null, document.title)
            }
        }
    });
    //GA on pageload
    if(window.location.hash.indexOf('departures') === -1){
          if (typeof ga !== "undefined") {
                ga('send', 'pageview', gaCrumb + window.location.hash, null, document.title);
            } else {
                console.log('send', 'pageview', gaCrumb + window.location.hash, null, document.title)
            }
    }
      
};