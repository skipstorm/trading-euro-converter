(function ($) {
  $(document).ready(function () {
    var configs = {
      // conversions are couples amount -> date as values in the same line might need conversions in different dates

      'etoro': {
        'heading': true,
        'col_num': 16,
        'conversions': [
          // Column index for the date -> column index for the value
          // 9 open date
          // 10 close date
          [9, 3, 'DD/MM/YYYY HH:mm'], // Amount
          [9, 5, 'DD/MM/YYYY HH:mm'], // Open rate
          [10, 6, 'DD/MM/YYYY HH:mm'], // Close rate
          [10, 8, 'DD/MM/YYYY HH:mm'] // Profit
        ]
      }
    }

    var conf = configs['etoro'];
    var conversionFiles = ['quot/2019.csv', 'quot/2020.csv'];
    var conversionData = {};
    var datiUtente;
    var heading;
    var letters = 'ancdefghijklmnopqrstuvwxyz'.split('');
    var errors = [];

    getConversions();
    initPage();

    $('#datiUtente').on('change', function () {
      makeUserPreview();
    });
    $('#preset').on('change', function () {
      initPage();
    });

    function initPage() {
      const preset = $('#preset').val();
      conf = configs.hasOwnProperty(preset) ? configs[preset] : false;
      makeUserPreview();
    }

    function makeUserPreview() {
      var size = parseInt(conf.col_num);
      $('.datiUtentePreview').empty();
      if ($('#datiUtente').val() == '') {
        return;
      }
      datiUtente = $('#datiUtente').val().split("\n").map(function (line) { return line.split("\t").slice(0, size) });
      if (conf.heading) {
        heading = datiUtente.shift();
      } else {
        heading = [];
        for (let i in datiUtente[0]) {
          heading.push('col. ' + letters[i]);
        }
      }
      var table = '';
      table += '<div>Verifica che i dati siano stati riconosciuti correttamente.</div>' +
        '<div style="max-height: 400px; overflow: auto;"><table class="table table-striped">';
      table += '<thead><tr>';
      for (let i of heading) {
        table += '<th>col. ' + i + '</th>';
      }
      table += '</tr></thead><tbody>';

      table += '<tr><td>' + (heading.join('</td><td>') + '</td></tr>');

      for (let d of datiUtente) {
        table += '<tr><td>' + (d.join('</td><td>') + '</td></tr>');
      }
      table += '</tbody></table></div>';

      $('.datiUtentePreview').append(table);
      var toStep2 = $('<span class="w-100 btn btn-primary btn-lg">Avanti</span>');

      $('.datiUtentePreview').append(toStep2);
      $(toStep2).on('click', function () {
        makeConversionPreview();
        return false;
      });
    }

    function makeConversionPreview() {
      $('.conversionPreview').empty();
      var tempResult = datiUtente.map(function (d) {
        if (d.join('') == '') {
          return d;
        }
        let dateI;
        for (let c of conf.conversions) {
          dateI = moment(d[c[0]], c[2]).format('YYYY-MM-DD');
          if (conversionData[dateI]) {
            d[c[1]] = '€ ' + parseFloat(conversionData[dateI] * d[c[1]]).toFixed(3) + ' ($ ' + d[c[1]] + ')';
          } else {
            // Date not found
            errors.push('valore non convertito per la data ' + dateI + ' (cambio non trovato)');
          }
        }
        return d;
      });

      var table = '';
      table += '<div>Questa è la tabella con i dati convertiti in euro, se va bene puoi scaricare il file.</div>' +
        '<div style="max-height: 400px; overflow: auto;"><table class="table table-striped">';
      table += '<thead><tr>';

      for (let i of heading) {
        table += '<th>' + i + '</th>';
      }
      table += '</tr></thead><tbody>';
      for (let d of tempResult) {
        table += '<tr><td>' + (d.join('</td><td>') + '</td></tr>');
      }
      table += '</tbody></table></div>';

      $('.conversionPreview').append(table);
      for (let e of errors) {
        $('.conversionPreview').append('<div class="alert alert-warning" role="alert">' + e + '</div>');
      }

      datiUtente = tempResult;
      var download = $('<span class="w-100 btn btn-primary btn-lg">Scarica</span>');
      download.on('click', function () {
        downloadExcel(heading, datiUtente);
      });
      $('.conversionPreview').append(download);
    }

    // Uses banca d'italia csv format
    // https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/dailyTimeSeries?startDate=2019-12-31&endDate=2020-12-31&&baseCurrencyIsoCode=EUR&currencyIsoCode=USD&lang=%7B%7D
    // 4th column is how many euros is a dollar worth
    // 6th column is the date YYYY-MM-DD
    function getConversions() {
      let conversionDataT = {};
      for (let c of conversionFiles) {
        $.get(c, function (data) {
          var dataArray = data.split("\n").map(function (line) {
            return line.split(",");
          });
          var heading = true;
          for (let d of dataArray) {
            if (heading) {
              heading = false;
              continue;
            }
            // Empty line
            if (d.length < 6) continue;
            d[5] = d[5].replace("\r", '');
            d[5] = d[5].replace("\n", '');
            // Not a date
            if (d[5].length != 10) continue;
            conversionDataT[d[5]] = parseFloat(d[3]);
          }

          // Sorting
          conversionData = Object.keys(conversionDataT).sort().reduce(
            (obj, key) => {
              obj[key] = conversionDataT[key];
              return obj;
            },
            {}
          );
        });
      }
    }


    var s2ab = function (s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
      return buf;
    }

    var downloadExcel = function (headers, data) {
      var wb = XLSX.utils.book_new();
      wb.Props = {
        Title: "Acea",
        Subject: "Informazioni",
        Author: "Acea",
        CreatedDate: new Date()
      };
      wb.SheetNames.push("Sheet 1");
      var ws_data = [headers].concat(data);
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets["Sheet 1"] = ws;
      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // Start file download.
      //download("download.xlsx", s2ab(wbout));
      saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'download.xlsx');
    }
  });
})(jQuery);
