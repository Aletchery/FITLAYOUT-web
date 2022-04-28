# FitLayout webové rozhranie
(c) 2021-2022 Adam Ševčík (xsevci64@stud.fit.vutbr.cz)

FitLayout webové rozhranie je aplikácia vytvorená ako bakalárska práca ktorej zadaním bolo vytvoriť webové rozhranie v JavaScripte pre existujúcu aplikáciu FitLayout (http://fitlayout.github.io/). Tento dokument popisuje pripravenie a používanie aplikácie.

## Stiahnutie potrebných balíkov 
 Pred začiatkom používania aplikácie je potreba stiahnuť z npm potrebné balíky. Nasledujúci príkaz stiahne všetky potrebné balíky: 
   ~~~
   npm install
   ~~~

## Konfigurácia
V súbore **config.js** nájdete konfigurčné hodnoty pre **URL** použitého REST API a **id** použitého repozitára. Ak si prajete tieto hodnoty zmeniť jednoducho pred spustením aplikácie vymente prednastavené hodnoty za vaše hodnoty.
   ~~~
   repo_id: "12425e9f-6cdd-4700-8e35-6a4c6504a258"
   url: "https://layout.fit.vutbr.cz/api"
   ~~~

## Spustenie
Pre spustenie aplikácie je potreba napísať príkaz
   ~~~
   npm start
   ~~~
Tento príkaz spustí na adrese http://192.168.0.105:9966/ server budo s aplikáciu v predvolenom prehliadači.

## Použitie

### Pridávanie artefaktov

Pre pridanie artefaktov je potreba v ľavej hornej časti aplikácie kliknúť na tlačidlo **Add artifact**. Po klinkutí na toto tlačidlo sa zobrazí okno s formulárom pre pridanie artefaktu do ktorého je potreba vložiť potrebné informácie a to URL, šírku, výšku a službu ktorou bude stránka segmentovaná.

### Mazanie artefaktov

Pre vymazanie artefaktu z repozitára stačí pri názve artefaktu kliknúť na červené tlačidlo X. Po kliknutí na toto tlačidlo je artefakt vymazaný.

### Segmentácia artefaktov

Pre hlbšiu segmentáciu artefaktu stačí kliknúť na tlačidlo SEG nachádzajúce sa pri názve artefaktu.

### Zmena repozitára

Pre zmenu repozitára je potreba v hornej časti aplikácie zmeniť ID repozitára a kliknúť na tlačidlo **Switch repository**. Po kliknutí bude načítaný nový repozitár.

### Vyhľadanie boxov

Pre vyhľadanie boxov je potreba kliknúť na tlačidlo **Search** nachádzajúce sa v pravom hornom rohu aplikácie. Po jeho kliknutí je zobrazené okno s formulárom do ktorého je potreba vpísať požadovaný query príkaz pre vyhľadanie. Pre zrušenia vyhľadania je potrebné kliknúť na tlačidlo **Remove search** ktoré sa zobrazí pri tlačidle **Search** po úspešnom vyhľadaní.