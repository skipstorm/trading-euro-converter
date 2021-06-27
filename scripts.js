(function($){
  $(document).ready(function(){
    var configs = {
      // conversions are couples amount -> date as values in the same line might need conversions in different dates
      
      'etoro': {
        'col_num': 16,
        'conversions': [
          // Column index for the date -> column index for the value
          // 9 open date
          // 10 close date
          [9, 3], // Amount
          [9, 5], // Open rate
          [10, 6] // Close rate
        ]
      }
    }
    
    var conf = configs['etoro'];
    var conversionFiles = ['quot/2020.csv'];
    var conversionData = {};
    var datiUtente;
    var letters = 'ancdefghijklmnopqrstuvwxyz'.split('');
    
    getConversions();
    initPage();
    
    $('#datiUtente').on('change', function(){
      makeUserPreview();
    });
    $('#preset').on('change', function(){
      initPage();
    });
    
    function initPage(){
      const preset = $('#preset').val();
      conf = configs.hasOwnProperty(preset)? configs[preset] : false;
      makeUserPreview();
    }
    
    function makeUserPreview() {
      var size = parseInt(conf.col_num);
      $('.datiUtentePreview').empty();
      if($('#datiUtente').val() == '') {
        return;
      }
      datiUtente = $('#datiUtente').val().split("\n").map(function(line){ return line.split("\t").slice(0, size)});
      var table = '';
      table += '<div>Verifica che i dati siano stati riconosciuti correttamente.</div>'+
      '<table class="table table-striped">';
      table += '<thead><tr>';
      for(let i in datiUtente[0]){        
          table += '<th>col. '+letters[i]+'</th>';
      }
      table += '</tr></thead><tbody>';
      for(let d of datiUtente) {
        table += '<tr><td>'+(d.join('</td><td>')+'</td></tr>');
      }
      table += '</tbody></table>';
      
      $('.datiUtentePreview').append(table);
      var toStep2 = $('<button class="w-100 btn btn-primary btn-lg">Avanti</button>');
      
      $('.datiUtentePreview').append(toStep2);
      $(toStep2).on('click', function(){
        makeConversionPreview();
        return false;
      });
    }
    
    function makeConversionPreview(){
      $('.conversionPreview').empty();
      var tempResult = datiUtente.map(function(d){
        for(let c of conf.conversions) {
          if(conversionData[c[0]]) {
            d[c[1]] = '€ ' + (conversionData[c[0]] * d[c[1]]) + ' ($ '+d[c[1]]+')';
          } else {
            // Date not found
            alert('valore per la data ' + c[0] + ' non trovato');
          }
        }
      });
      
      var table = '';
      table += '<div>Questa è la tabella con i dati convertiti in euro, se va bene puoi scaricare il file.</div>'+
      '<table class="table table-striped">';
      table += '<thead><tr>';
      for(let i in datiUtente[0]){        
          table += '<th>col. '+letters[i]+'</th>';
      }
      table += '</tr></thead><tbody>';
      for(let d of tempResult) {
        table += '<tr><td>'+(d.join('</td><td>')+'</td></tr>');
      }
      table += '</tbody></table>';
      
      $('.conversionPreview').append(table);
    }

    // Uses banca d'italia csv format
    // https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/dailyTimeSeries?startDate=2019-12-31&endDate=2020-12-31&&baseCurrencyIsoCode=EUR&currencyIsoCode=USD&lang=%7B%7D
    // 4th column is how many euros is a dollar worth
    // 6th column is the date YYYY-MM-DD
    function getConversions(){
      let conversionDataT = {};
      for(let c of conversionFiles){
        $.get(c, function(data){
          var dataArray = data.split("\n").map(function(line){ return line.split(","); });
          for(let d of dataArray){
            if(d[5].length != 10) continue;
            conversionDataT[d[5]] = parseFloat(d[3]);
          }
        });
      }
      // ordered by date
      conversionData = Object.keys(conversionDataT).sort().reduce(
        (obj, key) => { 
          obj[key] = conversionDataT[key]; 
          return obj;
        }, 
        {}
      );
    }
  });
})(jQuery);
