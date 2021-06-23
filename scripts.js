(function($){
  $(document).ready(function(){
    $('#datiUtente').on('change', function(){
      console.log($(this).val().split("\n"));
    });
  });
})(jQuery);
