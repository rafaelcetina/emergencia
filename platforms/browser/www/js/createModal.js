(function (a) {
    a.createModal = function (b) {
        defaults = {
            title: "", 
            message: "Mensaje", 
            closeButton: true, 
            fullscreen:true, 
            subtitle:"", 
            icon:"os-icon os-icon-delivery-box-2", 
            scrollable: false, 
            colorBody : '#fff', 
            sizeModal: 'md',
            efecto: 'bounceInDown',
            efecto2: 'bounceOutDown'
        };
        var b = a.extend({}, defaults, b);

        var c = (b.scrollable === true) ? 'style="max-height: 720px;overflow-y: auto; background-color:'+ b.colorBody +'"' : "";

        html = '<div id="myModal" class="" '+
                    'data-iziModal-group="grupo1"'+
                    'data-iziModal-fullscreen="'+b.fullscreen+'" '+
                    'data-iziModal-title="'+b.title+'" ';

                    if (b.subtitle.length > 0) {
                        html += 'data-iziModal-subtitle="'+b.subtitle+'" ';
                    }

                    html += 'data-iziModal-icon="'+b.icon+'" '+
                    'data-iziModal-transitionIn="'+b.efecto+'" '+
                    'data-iziModal-transitionOut="'+b.efecto2+'" '+
                '>';
        html += b.message;
        html += "</div>";

        a("body").append(html);

        $('#myModal').iziModal().iziModal("open");
        
        $(document).on('closed', '#myModal', function (e) {
            $("#myModal").remove();
           
        });

    }
})(jQuery);
