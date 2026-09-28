# Herní police

Filtr deskových her ze sbírky **@JakSeRodi** na BoardGameGeek.
Data se stahují automaticky každý den ráno a web běží zdarma na GitHub Pages.

## Zveřejnění krok za krokem

### 1. Připrav si BGG token
Na BoardGameGeek otevři sekci s aplikacemi, kde jsi žádal o přístup k API, a vytvoř si u schválené aplikace **token**. Zkopíruj ho, budeš ho potřebovat v kroku 4. Nikomu ho neposílej a nikam jinam ho nevkládej.

### 2. Založ repozitář
1. Na GitHubu vpravo nahoře klikni na **+** → **New repository**.
2. Název: `herni-police`.
3. Nech zaškrtnuté **Public** (GitHub Pages zdarma funguje jen pro veřejné repozitáře; token zůstane skrytý).
4. Klikni na **Create repository**.

### 3. Nahraj soubory
1. Rozbal stažený zip.
2. V novém repozitáři klikni na odkaz **uploading an existing file**.
3. Otevři rozbalenou složku, označ **všechno uvnitř** (Ctrl+A), včetně složky `.github`, a přetáhni to do okna prohlížeče.
4. Dole klikni na **Commit changes**.

První automatické spuštění v záložce Actions teď skončí červeně. To je v pořádku, ještě chybí token a nastavení.

### 4. Vlož token
**Settings** → vlevo **Secrets and variables** → **Actions** → **New repository secret**
- Name: `BGG_TOKEN`
- Secret: tvůj token z kroku 1
- **Add secret**

### 5. Zapni web
**Settings** → vlevo **Pages** → v části *Build and deployment* vyber u **Source** možnost **GitHub Actions**.

### 6. Spusť první aktualizaci
**Actions** → vlevo **Aktualizace a zveřejnění** → vpravo **Run workflow** → **Run workflow**.
Za 1–3 minuty je hotovo (zelená fajfka). Web najdeš na adrese:

`https://TVOJE-JMENO-NA-GITHUBU.github.io/herni-police/`

Adresa se ukáže i v **Settings → Pages**.

## Na telefonu jako aplikace
- **iPhone (Safari):** Sdílet → Přidat na plochu.
- **Android (Chrome):** menu ⋮ → Přidat na plochu / Instalovat aplikaci.

Po přidání se otevírá na celou obrazovku jako běžná aplikace a funguje i bez signálu.

## Aktualizace na novou verzi
1. Rozbal nový zip (pravým tlačítkem → Extrahovat vše).
2. V repozitáři klikni na **Add file → Upload files** a přetáhni obsah rozbalené složky (Ctrl+A). Stejně pojmenované soubory se přepíšou.
3. Klikni na **Commit changes**.
4. Soubor `.github/workflows/update.yml` se tím nenahraje (GitHub přeskakuje soubory začínající tečkou). Když se v něm něco mění, otevři ho v repozitáři, klikni na tužku a uprav ho ručně.

## Jak to funguje
- Každý den v 6:17 se spustí `scripts/fetch-bgg.mjs`. Stáhne hry označené na BGG jako **Own**, jejich detaily, obtížnost, hodnocení, doporučený počet hráčů, vaše zapsané partie (kdy a kdo vyhrál), rozšíření, seznam *Want to Play* a komentáře ke hrám.
- Obálky se jednou zmenší do `data/covers/`, aby se web na mobilu načítal rychle.
- **Vlastní poznámky:** na BGG u hry v kolekci vyplň komentář (Comment). Web ho ukáže v detailu hry jako „Naše poznámka“.
- Výsledek uloží do `data/games.json` a web se znovu zveřejní.
- Když přidáš hru do kolekce na BGG, na webu se objeví nejpozději další den ráno. Hned to jde tlačítkem **Run workflow**.

## Úpravy
- `scripts/config.mjs`: jiný BGG uživatel, překlady kategorií, seznam českých autorů.
- `index.html`: vzhled a chování webu.

## Když něco nejde
- **Červený křížek u akce:** klikni na něj a rozbal krok *Stažení dat z BoardGameGeek*. Chyba je popsaná česky.
- **„BGG odmítl přístup“:** token je špatně zkopírovaný nebo vypršel. Vlož ho v kroku 4 znovu (Update secret).
- **„Kolekce je prázdná“:** na BGG musí mít hry zaškrtnuté *Own*.
- GitHub pozastaví denní spouštění, když se v repozitáři 60 dní nic nezmění. Protože se data mění skoro denně, nemělo by k tomu dojít. Kdyby ano, stačí v záložce Actions kliknout na **Enable workflow**.

Data: [BoardGameGeek](https://boardgamegeek.com). Powered by BGG.
