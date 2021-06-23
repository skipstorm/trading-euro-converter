(function($){
  $(document).ready(function(){
    
    var datiUtente;
    
    $('#datiUtente').on('change', function(){
      makeUserPreview();
    });
    
    function makeUserPreview() {
      var size = parseInt($('#datiUtenteN').val());
      datiUtente = $('#datiUtente').val().split("\n").map(function(line){ return line.split("\t").slice(0, size)});
      $('.datiUtentePreview').empty();
      var table = '<div>Seleziona le colonne per le quali vuoi applicare la conversione</div>'+
      '<table class="table table-striped">';
      table += '<thead><tr>';
      for(let i in datiUtente[0]){
         table += '<th>col. '+i+' <input type="checkbox" name="datiUtenteCol['+i+']"></th>';
      }
      table += '</tr></thead>';
      for(let d of datiUtente) {
        table += '<tr><td>'+(d.join('</td><td>')+'</td></tr>');
      }
      table += '</table>';
      $('.datiUtentePreview').append(table);
    }
  });
})(jQuery);
