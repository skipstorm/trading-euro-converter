(function($){
  $(document).ready(function(){
    var configs = {
      'etoro': {
        'usd_cols': [4,5]
      }
    }
    var conf = configs['etoro'];
    var datiUtente;
    var letters = 'ancdefghijklmnopqrstuvwxyz'.split('');
    
    $('#datiUtente').on('change', function(){
      makeUserPreview();
    });
    
    function makeUserPreview() {
      var size = parseInt($('#datiUtenteN').val());
      datiUtente = $('#datiUtente').val().split("\n").map(function(line){ return line.split("\t").slice(0, size)});
      $('.datiUtentePreview').empty();
      var table = '<div>Seleziona le colonne per le quali vuoi applicare la conversione da dollaro a euro</div>'+
      '<div>Verifica che i dati siano stati riconosciuti correttamente.</div>'+
      '<table class="table table-striped">';
      table += '<thead><tr>';
      for(let i in datiUtente[0])
        
         table += '<th>col. '+letters[i]+' <input type="checkbox" '+
         (conf.usd_cols.indexOf(i)>=0? 'checked' : '')+
         'name="datiUtenteCol['+i+']"></th>';
      }
      table += '</tr></thead>';
      for(let d of datiUtente) {
        table += '<tr><td>'+(d.join('</td><td>')+'</td></tr>');
      }
      table += '</table>';
      
      $('.datiUtentePreview').append(table);
      var toStep2 = $('<button class="w-100 btn btn-primary btn-lg">Avanti</button>');
      $(toStep2).on('click', function(){
        makeConversionPreview();
        return false;
      });
    }
    
    function makeConversionPreview(){
      $('.conversionPreview').empty();
      var tempResult = datiUtente.map(function(d){
//datiUtenteCol
      });
      
    }
  });
})(jQuery);
