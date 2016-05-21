var divGmap = null;
var myPosition = null;
var mediaAlarm = null;
var mediaRing = null;
var mediaPlaying = false;
var pins = [];

var apiUrl = 'http://10.99.0.41/crownbyte_fw/iamsafe/';


/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
	
	function ISODateString(d){
	  function pad(n){return n<10 ? '0'+n : n}
	  return d.getUTCFullYear()+'-'
		  + pad(d.getUTCMonth()+1)+'-'
		  + pad(d.getUTCDate()) +' '
		  + pad(d.getUTCHours())+':'
		  + pad(d.getUTCMinutes())+':'
		  + pad(d.getUTCSeconds())
	}
	
	function pinsInit(){
		pins = [];
		$.post(apiUrl+'getAllPosts', {}, function(response){
			for(var key in response.data)
			{
				var geoLoc = response.data[key].geolocation.split(',');
				console.log(response.data[key].category);

				var imgPin = (response.data[key].category == 'safe')?'safe.png':'unsafe.png';
				var infoWindow = '<h3>'+response.data[key].category+'</h3><p>'+response.data[key].description.substring(0,256)+'...</p><center><button>View</button></center>';

				pins[key] = divGmap.addMarker({
					lat: geoLoc[0],
					lng: geoLoc[1],
					title: response.data[key].category,
					icon: 'images/'+imgPin,
					infoWindow: {
					  content: infoWindow
					}
				});
			}
		});
	}
    
    function gmapInit()
    {
        navigator.geolocation.watchPosition(function(position){
            if(!divGmap)
            divGmap = new GMaps({
                div: '#map',
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                width: '100%',
                height: '100%',
                zoom: 15
            });
            
            
            divGmap.setCenter(position.coords.latitude, position.coords.longitude);
            //divGmap.refresh();
            
            if(!myPosition)
			{
                myPosition = divGmap.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: 'Your location'
                });
				
				pinsInit();
			}
            else
                myPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        	
			divGmap.refresh();
		}, function(error){
            alert(JSON.stringify(error));
        });
    }
	
	function geolocationToAddress(lat, lng, callback)
	{
		var geocoder = new google.maps.Geocoder;
		var latlng = {lat: lat, lng: lng};
		geocoder.geocode({'location': latlng}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
			  if (results[1]) {
				  
				  callback(results[1]);
				//$('#input-safe-address').val(results[1].formatted_address);
				//$('#input-usafe-address').val(results[1].formatted_address);
				//infowindow.open(map, marker);
			  } else {
				window.alert('No results found');
			  }
			} else {
			  window.alert('Geocoder failed due to: ' + status);
			}
		});
	}
    
    function register_event_handlers()
    {
        //console.log(window.location.pathname);
		
		$.ajaxSetup ({
			// Disable caching of AJAX responses
			cache: false
		});
        
        mediaAlarm = new Media((window.location.pathname).replace('index.html','')+'sounds/alarm.mp3',function(){},function(error){alert(JSON.stringify(error));});
        mediaRing = new Media((window.location.pathname).replace('index.html','')+'sounds/ring.mp3',function(){},function(error){alert(JSON.stringify(error));});
    
		
            /* button  #btn-signup */
        $(document).on("click", "#btn-signup", function(evt)
        {
             /*global activate_page */
             activate_page("#page-register"); 
        });

            /* button  #btn-fbconnect */
        $(document).on("click", "#btn-fbconnect", function(evt)
        {
             /*global activate_page */
            activate_page("#page-map");
			$(document).ready(gmapInit);
			/*facebookConnectPlugin.login(
				[],
				function(response){
					activate_page("#page-map");
					$(document).ready(gmapInit);
					//alert(JSON.stringify(response));
				},
				function(error){
					alert(JSON.stringify(error));
			});*/
        });

            /* button  #btn-register */
        $(document).on("click", "#btn-register", function(evt)
        {
             /*global activate_page */
             activate_page("#page-map"); 
            $(document).ready(gmapInit);
        });

            /* button  #btn-cancel-register */
        $(document).on("click", "#btn-cancel-register", function(evt)
        {
             /*global activate_page */
             activate_page("#mainpage"); 
        });
    
        /* button  #btn-menu */
    $(document).on("click", "#btn-menu", function(evt)
    {
         /*global uib_sb */
         /* Other possible functions are: 
           uib_sb.open_sidebar($sb)
           uib_sb.close_sidebar($sb)
           uib_sb.toggle_sidebar($sb)
            uib_sb.close_all_sidebars()
          See js/sidebar.js for the full sidebar API */
        
         uib_sb.toggle_sidebar($("#side-bar"));  
    });
    
        /* button  #btn-report */
    $(document).on("click", "#btn-report", function(evt)
    {
         /* Other options: .modal("show")  .modal("hide")  .modal("toggle")
         See full API here: http://getbootstrap.com/javascript/#modals 
            */
        
         $("#popup-report").modal("toggle");  
    });
    
        /* button  #btn-danger */
    $(document).on("click", "#btn-danger", function(evt)
    {
         /* Other options: .modal("show")  .modal("hide")  .modal("toggle")
         See full API here: http://getbootstrap.com/javascript/#modals 
            */
        
         $("#popup-sending").modal("toggle");  
    });
    
        /* button  #btn-decline */
    $(document).on("click", "#btn-decline", function(evt)
    {
         /*global activate_page */
		mediaRing.stop();
         activate_page("#page-map"); 
    });
    
        /* button  #btn-fakecall */
    $(document).on("click", "#btn-fakecall", function(evt)
    {
         /*global activate_page */
		$('#btn-accept').text('Accept');
         activate_page("#page-fakecall"); 
		
		mediaRing.play({numberOfLoops:10});
		
    });
    
        /* button  #btn-settings */
    
    
        /* button  #btn-settings */
    $(document).on("click", "#btn-settings", function(evt)
    {
         /*global activate_page */
         activate_page("#page-settings"); 
    });
    
        /* button  #btn-done-settings */
    $(document).on("click", "#btn-done-settings", function(evt)
    {
         /*global activate_page */
         activate_page("#page-map"); 
    });
    
        /* button  #btn-safe */
    $(document).on("click", "#btn-safe", function(evt)
    {
         /* Other options: .modal("show")  .modal("hide")  .modal("toggle")
         See full API here: http://getbootstrap.com/javascript/#modals 
            */
        $('#img-safe').attr( 'src','');
         $("#popup-safepin").modal("toggle");
		
		
		$('#input-safe-geolocation').val(myPosition.position.lat().toFixed(6)+','+myPosition.position.lng().toFixed(6));
		geolocationToAddress(parseFloat(myPosition.position.lat().toFixed(6)), parseFloat(myPosition.position.lng().toFixed(6)),
			function(result){
				$('#input-safe-address').val(result.formatted_address);
		});
		
		//console.log(myPosition.position);
		
         return false;
    });
    
        /* button  #btn-safe-image */
    $(document).on("click", "#btn-safe-image", function(evt)
    {
        /* your code goes here */ 
		
		navigator.camera.getPicture(
			function(imageData){
				$('#img-safe').attr( 'src', "data:image/jpeg;base64," + imageData);
			},
			function(error){
				alert(JSON.stringify(error));
			},
			{
				quality: 50, 
                destinationType: Camera.DestinationType.DATA_URL
            }
		);
		
         return false;
    });
    
        /* button  #btn-unsafe */
    $(document).on("click", "#btn-unsafe", function(evt)
    {
         /* Other options: .modal("show")  .modal("hide")  .modal("toggle")
         See full API here: http://getbootstrap.com/javascript/#modals 
            */
		
		$('#img-unsafe').attr( 'src','');
        
         $("#popup-unsafepin").modal("toggle");  
		
		$('#input-unsafe-geolocation').val(myPosition.position.lat().toFixed(6)+','+myPosition.position.lng().toFixed(6));
		geolocationToAddress(parseFloat(myPosition.position.lat().toFixed(6)), parseFloat(myPosition.position.lng().toFixed(6)),
			function(result){
				$('#input-unsafe-address').val(result.formatted_address);
		});
		
		
         return false;
    });
    
        /* button  #btn-unsafe-image */
    $(document).on("click", "#btn-unsafe-image", function(evt)
    {
        /* your code goes here */ 
		navigator.camera.getPicture(
			function(imageData){
				$('#img-unsafe').attr( 'src', "data:image/jpeg;base64," + imageData);
			},
			function(error){
				alert(JSON.stringify(error));
			},
			{
				quality: 50, 
                destinationType: Camera.DestinationType.DATA_URL
            }
		);
         return false;
    });
    
        /* button  #btn-alarm */
    $(document).on("click", "#btn-alarm", function(evt)
    {
        /* your code goes here */ 
		//mediaAlarm = new Media(cordova.file.applicationDirectory+'www/sounds/alarm.mp3',function(){},function(error){alert(JSON.stringify(error));});
		
		if(mediaPlaying)
		{
			mediaAlarm.pause();
			mediaAlarm.stop();
			mediaPlaying = false;
		}
		else
		{
			mediaAlarm.play({numberOfLoops:10});
			mediaPlaying = true;
		}
		
		//mediaAlarm.play({numberOfLoops:99});
		
         return false;
    });
    
        /* button  #btn-accept */
    $(document).on("click", "#btn-accept", function(evt)
    {
        /* your code goes here */ 
		
		$('#btn-accept').text('Hold');
		mediaRing.stop();
         return false;
    });
    
        /* button  #btn-safe-post */
    $(document).on("click", "#btn-safe-post", function(evt)
    {
        /* your code goes here */ 
		var data = {
			category: 'safe',
			description: $('#textarea-safe-description').val(),
			photo: $('#img-safe').attr('src'),
			address: $('#input-safe-address').val(),
			geolocation: $('#input-safe-geolocation').val(),
			phone: ISODateString(new Date())
		};
		
		$.post(apiUrl+'savePIN?'+Math.random(), data, function(response){
			console.log(response);
			//alert(JSON.stringify(response));
			pinsInit();
			$("#popup-safepin").modal("toggle");
		}).fail(
			function(jqXHR, textStatus, errorThrown) {
				  alert(jqXHR.responseText);
			}
		);
		
         return false;
    });
    
        /* button  #btn-unsafe-post */
    $(document).on("click", "#btn-unsafe-post", function(evt)
    {
        /* your code goes here */ 
		
		var data = {
			category: $('#input-unsafe-category').val(),
			description: $('#textarea-unsafe-description').val(),
			photo: $('#img-safe').attr('src'),
			address: $('#input-unsafe-address').val(),
			geolocation: $('#input-unsafe-geolocation').val(),
			phone: ISODateString(new Date())
		};
		
		$.post(apiUrl+'savePIN?'+Math.random(), data, function(response){
			console.log(response);
			//alert(JSON.stringify(response));
			pinsInit();
			$("#popup-unsafepin").modal("toggle");
		}).fail(
			function(jqXHR, textStatus, errorThrown) {
				  alert(jqXHR.responseText);
			}
		);
				
		
         return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
