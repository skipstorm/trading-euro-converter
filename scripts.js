(function($){
  $(document).ready(function(){
    var configs = {
      'etoro': {
        'usd_cols': [4,5]
      }
    }
    var conf = configs['etoro'];
    var conversionFiles = ['quot/2020.csv'];
    var conversionData = {};
    var datiUtente;
    var letters = 'ancdefghijklmnopqrstuvwxyz'.split('');
    
    getConversions();
    
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
      for(let i in datiUtente[0]){        
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

    // Uses banca d'italia csv format
    // https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/dailyTimeSeries?startDate=2019-12-31&endDate=2020-12-31&&baseCurrencyIsoCode=EUR&currencyIsoCode=USD&lang=%7B%7D
    // 4th column is how many euros is a dollar worth
    // 6th column is the date YYYY-MM-DD
    function getConversions(){
      conversionData = {};
      for(let c of conversionFiles){
        $.get(c, function(data){
          var dataArray = data.split("\n").map(function(line){ return line.split(","); });
          for(let d of dataArray){
            if(d[5].length != 10) continue;
            conversionData[d[5]] = parseFloat(d[3]);
          }
        });
      }
    }
  });
})(jQuery);
