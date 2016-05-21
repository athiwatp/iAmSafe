var divGmap = null;
var myPosition = null;


/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
    
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
                myPosition = divGmap.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: 'Your location'
                });
            else
                myPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }, function(error){
            alert(JSON.stringify(error));
        });
    }
    
    function register_event_handlers()
    {
        
        
        //console.log(divGmap);
    
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
            divGmap.refresh();
            //divGmap.setCenter(14.6648, 121.0372);
            //divGmap.refresh();
        });

            /* button  #btn-register */
        $(document).on("click", "#btn-register", function(evt)
        {
             /*global activate_page */
             activate_page("#page-map"); 
            divGmap.refresh();
            $(document).ready(gmapInit);
            divGmap.refresh();
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
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
