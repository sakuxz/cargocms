var mapTheme = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]

// $.fn.tinyMapConfigure({
//   'key': 'Google Maps API KEY'
// });

var init = false;

$(function () {
  $('#map').tinyMap({
    'styles': mapTheme,
    'disableDefaultUI': true,
    'center': ['25.045', '121.562904'],
    'zoom': 16,
    'scrollwheel': false,
    'marker': [
      {
        'addr': ['25.042552', '121.562883'],
        'infoWindowOptions': { 'disableAutoPan': true },
        'text': '\
          <div class="map-info-dialog">\
            <img class="map-info-dialog-image" src="/assets/labfnp/img/img.index/map-info.jpg">\
            <div class="map-info-dialog-content">\
              <h2>台北松菸門市</h2>\
              <address>\
                <a href="https://www.google.com.tw/maps/place/LFP%E9%A6%99%E6%96%99%E9%A6%99%E6%B0%B4%E5%AF%A6%E9%A9%97%E5%AE%A4(%E5%8F%B0%E5%8C%97%E9%96%80%E5%B8%82)/@25.042562,121.5606943,17z/data=!4m13!1m7!3m6!1s0x3442abb92b2135d1:0x6f03f0aea40b892e!2zMTEw5Y-w5YyX5biC5L-h576p5Y2A5b-g5a2d5p2x6Lev5Zub5q61NTUz5be3MTLomZ8!3b1!8m2!3d25.042562!4d121.562883!3m4!1s0x3442abb92b2135d1:0x432a74d0571869dc!8m2!3d25.042562!4d121.562883" target="_blank">台北市信義區忠孝東路四段553巷12號</a>\
              </address>\
              <a href="tel: +886227657272">Tel: (02)2765-7272</a>\
              <span>營業時間：Mon-Sun 12:00-20:00</span>\
            </div>\
          </div>\
        ',
      },
      {
        'addr': ['24.147533', '120.662738'],
        'infoWindowOptions': { 'disableAutoPan': true },
        'text': '\
          <div class="map-info-dialog">\
            <img class="map-info-dialog-image" src="/assets/labfnp/img/img.index/map-info.jpg">\
            <div class="map-info-dialog-content">\
              <h2>台中綠光計畫門市</h2>\
              <address>\
                <a href="https://www.google.com.tw/maps/place/LFP%E9%A6%99%E6%B0%B4%E5%AF%A6%E9%A9%97%E5%AE%A4/@24.1475427,120.6605388,17z/data=!3m1!4b1!4m5!3m4!1s0x34693d9f0eb06e2d:0x324e39b59dbb10c6!8m2!3d24.1475427!4d120.6627275" target="_blank">台中市西區中興一巷8號2樓K戶</a>\
              </address>\
              <a href="tel:+886423015682">Tel: (04)2301-5682</a>\
              <span>營業時間：Mon-Sun 12:00-20:00</span>\
            </div>\
          </div>\
        ',
      },
    ],
    'event': {
      'idle': function () {
        if (!init) {
          // open all info-window of markers
          $('#map').tinyMap('get', 'marker', function (markers) {                
            for (var i = 0; i < markers.length; i++) {                
              if (markers[i].hasOwnProperty('infoWindow')) {
                  markers[i].infoWindow.open(this, markers[i]);
              }
            }
          });      
          init = true;
        }         
      }
    }
  });

  $('.map-locations li').click(function (e) {
    var addr = $('#map').tinyMap('get', 'marker')[$(this).data('idx')].addr;
    $('#map').tinyMap('get', 'map').panTo({lat: parseFloat(addr[0]) + 0.002448, lng: parseFloat(addr[1])});
    $('.map-locations li').removeClass('active');
    $(this).addClass('active');
  });
});