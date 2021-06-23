(function($){
  $(document).ready(function(){
    
    var datiUtente;
    
    $('#datiUtente').on('change', function(){
      
    });
    
    function makeUserPreview() {
      var size = parseInt($('#datiUtenteN').val());
      datiUtente = $('#datiUtente').val().split("\n").map(function(line){ return line.split("\t").slice(0, size)});
      $('.datiUtentePreview').empty();
      var table = '<table class="table table-striped">';
      for(let d of datiUtente) {
        table += '<tr><td>'+(d.join('</td><td>')+'</td></tr>');
      }
      table += '</table>';
      $('.datiUtentePreview').append(table);
    }
  });
})(jQuery);
