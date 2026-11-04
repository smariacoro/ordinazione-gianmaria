// Foglio delle conferme per l'ordinazione di Gian Maria.
// Da incollare in: Foglio Google > Estensioni > Apps Script.
// Non contiene password o dati personali. La guida è in PUBBLICARE.md.

var FIRST_ROW = 6; // Le persone iniziano da questa riga.
var SHEET_ID = ''; // Identificativo del foglio, se lo script non nasce dentro il foglio.

function book_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActive();
}

// Da eseguire una volta sola: prepara il foglio con il totale in alto.
function setup() {
  var ss = book_();
  ss.setSpreadsheetTimeZone('Europe/Rome');
  var sh = ss.getSheets()[0];
  sh.setName('Conferme');
  if (sh.getLastRow() >= FIRST_ROW) {
    throw new Error('Il foglio contiene già delle conferme: non lo preparo di nuovo.');
  }
  sh.clear();

  var navy = '#0f1533', cobalt = '#2240d6', white = '#ffffff';
  sh.getRange('A1:D1').merge().setValue('PERSONE CONFERMATE')
    .setBackground(cobalt).setFontColor(white).setFontWeight('bold').setFontSize(16)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange('A2:D2').merge().setFormula('=SUM(B' + FIRST_ROW + ':B)')
    .setBackground(cobalt).setFontColor(white).setFontWeight('bold').setFontSize(80)
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setNumberFormat('0');
  sh.getRange('A3:D3').merge()
    .setFormula('="Conferme ricevute: "&COUNTA(A' + FIRST_ROW + ':A)&"     Con esigenze alimentari: "&COUNTA(C' + FIRST_ROW + ':C)')
    .setBackground(navy).setFontColor(white).setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange('A4:D4').merge().setValue('Chi conferma di persona: aggiungilo a mano in fondo all\'elenco, il totale si aggiorna da solo.')
    .setFontColor('#3a4264').setFontStyle('italic').setHorizontalAlignment('center');
  sh.getRange('A5:D5').setValues([['Nome e cognome', 'Persone', 'Esigenze alimentari', 'Ricevuta il']])
    .setFontWeight('bold').setBackground('#e9ebf3').setFontSize(12);

  sh.setRowHeight(1, 34);
  sh.setRowHeight(2, 120);
  sh.setRowHeight(3, 34);
  sh.setColumnWidth(1, 210);
  sh.setColumnWidth(2, 80);
  sh.setColumnWidth(3, 260);
  sh.setColumnWidth(4, 120);
  sh.setFrozenRows(5);

  var rows = sh.getMaxRows() - FIRST_ROW + 1;
  sh.getRange(FIRST_ROW, 1, rows, 4).setFontSize(12).setVerticalAlignment('top');
  sh.getRange(FIRST_ROW, 2, rows, 1).setHorizontalAlignment('center').setFontWeight('bold').setNumberFormat('0')
    .setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(1, 99).setAllowInvalid(false).build());
  sh.getRange(FIRST_ROW, 3, rows, 1).setWrap(true);
  sh.getRange(FIRST_ROW, 4, rows, 1).setNumberFormat('dd/MM HH:mm');

  // Le esigenze alimentari saltano all'occhio.
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=LEN($C' + FIRST_ROW + ')>0')
      .setBackground('#fff3c4')
      .setRanges([sh.getRange(FIRST_ROW, 3, rows, 1)])
      .build(),
  ]);

  // Avvisa se qualcuno sta per sovrascrivere il totale per sbaglio.
  sh.getRange('A1:D5').protect().setDescription('Totale').setWarningOnly(true);
}

// Riceve una conferma dal modulo del sito.
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.botcheck) return reply_(true); // Compilato da un programma automatico: ignorato.

    var name = clean_(p.name, 120);
    var people = parseInt(p.people, 10);
    var food = clean_(p.food, 1000);
    if (!name || !(people >= 1 && people <= 99)) return reply_(false);

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      book_().getSheets()[0].appendRow([name, people, food || null, new Date()]);
    } finally {
      lock.releaseLock();
    }
    return reply_(true);
  } catch (err) {
    return reply_(false);
  }
}

// Toglie i caratteri di controllo e impedisce che un testo diventi una formula.
function clean_(value, max) {
  var s = String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ success: ok }))
    .setMimeType(ContentService.MimeType.JSON);
}
