# Come pubblicare il sito su GitHub Pages

Il sito finito è la cartella `docs/`. Non serve installare altro oltre a Git, che hai già.

## 1. Crea l'account e la repository

1. Vai su https://github.com/signup e crea un account, se non lo hai.
2. Vai su https://github.com/new
3. In "Repository name" scrivi per esempio `ordinazione-gian-maria`. Il nome finisce nell'indirizzo del sito.
4. Scegli **Public**: con un account gratuito GitHub Pages funziona solo su repository pubbliche, quindi tutto il contenuto è visibile a chiunque.
5. Non spuntare nessuna delle opzioni README, .gitignore o licenza.
6. Premi **Create repository**.

## 2. Carica i file

Apri un terminale nella cartella `Ordinazione Gian Maria` e lancia questi comandi uno alla volta, mettendo il tuo nome utente al posto di `TUO-NOME`.

```bash
git init -b main
```
```bash
git add .
```
```bash
git commit -m "Sito per l'ordinazione di fra Gian Maria"
```
```bash
git remote add origin https://github.com/TUO-NOME/ordinazione-gian-maria.git
```
```bash
git push -u origin main
```

Al primo `push` si apre una finestra per accedere a GitHub.

## 3. Attiva GitHub Pages

1. Nella pagina della repository apri **Settings**, poi **Pages** nella colonna di sinistra.
2. In "Source" scegli **Deploy from a branch**.
3. In "Branch" scegli **main** e la cartella **/docs**, poi premi **Save**.
4. Dopo qualche minuto, in cima alla stessa pagina compare l'indirizzo:
   `https://TUO-NOME.github.io/ordinazione-gian-maria/`

## 4. Anteprima su WhatsApp

Per far comparire la foto quando si condivide il link, in `scrollcraft/builds/gian-maria/src/content.mjs` scrivi l'indirizzo del sito in `SITE_URL` (con la `/` finale). Poi rigenera e carica (sotto, "Modificare il sito").

## Indirizzo personalizzato

Il sito è impostato per `https://smariacoro.github.io/ordinazione-gianmaria/`: repository `ordinazione-gianmaria` sull'account `smariacoro`. Se cambi indirizzo, aggiorna `SITE_URL` in `scrollcraft/builds/gian-maria/src/content.mjs` e rigenera il sito.

Alternative:

**Gratis:** crea un'organizzazione GitHub (https://github.com/account/organizations/new?plan=free), per esempio `ordinazione-gianmaria`, e al suo interno una repo chiamata esattamente `ordinazione-gianmaria.github.io`. L'indirizzo sarà `https://ordinazione-gianmaria.github.io/`.

**Con un dominio tuo:** compra il dominio da un registrar, poi nelle sue impostazioni DNS aggiungi quattro record `A` per il dominio principale verso `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` e un record `CNAME` per `www` verso `TUO-NOME.github.io`. In **Settings**, **Pages**, **Custom domain** scrivi il dominio, salva e attiva **Enforce HTTPS** appena disponibile. Scrivi lo stesso indirizzo in `SITE_URL`: così il file `docs/CNAME` viene ricreato a ogni rigenerazione.

## Il foglio delle conferme

Il foglio "Conferme ordinazione Gian Maria" è già creato e collegato al modulo del sito: si trova nel Google Drive di chi lo ha creato. Nel sito pubblicato il modulo funziona senza altri passaggi.

### Condividilo con Gian Maria

1. Nel foglio premi **Condividi**, scrivi l'indirizzo Gmail di Gian Maria e scegli **Editor**.
2. Sul telefono può aprirlo con l'app Fogli Google: il totale resta sempre visibile in alto.
3. Chi conferma di persona va aggiunto a mano in fondo all'elenco, con nome e numero di persone. Per togliere un doppione basta cancellare la riga: il totale si aggiorna da solo.

### Se un giorno devi rifarlo

1. Crea un foglio su https://sheets.new, poi un progetto su https://script.google.com e incolla `foglio-google/conferme.gs`.
2. Scrivi in `SHEET_ID` l'identificativo del foglio, cioè la parte del suo indirizzo tra `/d/` e `/edit`.
3. Esegui `setup` e autorizza.
4. Premi **Esegui il deployment**, **Nuovo deployment**, **Applicazione web**, con "Esegui come" **Me** e "Utenti autorizzati" **Chiunque**. Gli invitati possono solo aggiungere righe tramite il modulo, non leggere il foglio.
5. Copia l'indirizzo che finisce con `/exec` in `RSVP_ENDPOINT`, dentro `scrollcraft/builds/gian-maria/src/content.mjs`, e rigenera il sito.

Se modifichi lo script, in **Gestisci deployment** crea una nuova versione, altrimenti il sito continua a usare quella vecchia.

## Modificare il sito

Tutti i testi, nelle cinque lingue, sono in `scrollcraft/builds/gian-maria/src/content.mjs`. In alto ci sono anche `RSVP_URL`, `RSVP_PHONE` e `RSVP_EMAIL`: se li riempi, nella sezione di conferma compaiono i pulsanti. Dopo una modifica:

```bash
cd scrollcraft/builds/gian-maria
```
```bash
npm install
```
```bash
node build.mjs
```
```bash
cd ../../..
```
```bash
git add .
```
```bash
git commit -m "Aggiorna il sito"
```
```bash
git push
```

Il sito si aggiorna da solo dopo un paio di minuti.

## Dopo la pubblicazione: prova su un telefono vero

Apri il sito su un iPhone e su un Android, scorri la scena della porta, prova Menu, un pulsante Maps e il pulsante Chiama.
