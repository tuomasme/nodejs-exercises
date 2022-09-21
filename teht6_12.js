var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

/* 

6. Toteuta node.js:llä REST api jonka avulla voidaan lisätä tietokantaan uusi asiakas. Rajapinnan osoite on muotoa "/api/customer", metodi on POST. 
Rajapintaan tuleva data tulee siis HTTP-body lohkossa JSON-objektina, kentät: nimi, osoite, postinro, postitmp, asty_avain. HUOM! Tietokanta muodostaa 
uudelle asiakas-riville avaimen automaattisesti ja luontipvm-tietoa EI tuoda rajapinnassa, se pitää generoida serverin päässä (helpointa on tehdä se SQL-lauseessa). 
Jos lisäys onnistuu, palauta HTTP-status 201 sekä juuri lisätyn asiakkaan tiedot JSON-muodossa niin että avain-kentässä on lisätyn asiakkaan avain (muut kentät 
samoja kuin yllä). HUOM! Luontipvm-kentässä EI tarvitse palauttaa mitään! 

7. Lisää em. asiakkaan lisäys-palveluun myös parametrien tarkistus. Eli kaikki kentät ovat pakollisia, jos kutsussa tulee kenttiä, joissa on tyhjiä arvoja 
(tai joku kenttä puuttuu), palauta tästä tieto kutsujalle muodossa "Pakollisia tietoja puuttuu: nimi,osoite" (esimerkissä siis puuttuu VAIN nimi ja osoite). 
Tämä on siis virhetilanne, joten palauta data yo. ohjeen mukaan. HUOM! Kenttien järjestys "Pakollisia tietoja puuttuu:" -merkkijonon jälkeen on nimi,osoite,
postinro,postitmp,asty_avain.

8. Toteuta node.js:llä REST api, jolla voidaa poistaa asiakas. API on muotoa "api/customer/123", käytä metodia DELETE ja anna poistettavan asiakkaan avain 
url:ssa (esimerkissä 123). Jos poisto onnistuu, palauta VAIN HTTP-status 204 (ei siis ollenkaan dataa).

9. Lisää edelliseen tehtävään: jos poistettavaa asiakasta ei löydy, palauta HTTP-status koodi 404 (ja palauta JSON-objekti, joka on käytössä virhetilanteessa, 
message-kentässä on teksti "Poistettavaa asiakasta X ei löydy", missä X on poistettavan asiakkaan avain). Tässä tehtävässä EI tarvitse tehdä erillistä hakua, 
jossa haet avaimen avulla poistettavan asiakkaan. Mysql-kirjasto palauttaa tiedon (ks. result-muuttujaa, joka on query-metodin callback-funktion parametrina), 
montako tietokannan riviä SQL-lause päivitti/lisäsi/poisti, käytä hyväksi tätä tietoa. HUOM! Elävässä elämässä ei ole itse asiassa täyttä selvyyttä mikä status
koodi pitäisi palauttaa ...
10. Toteuta node.js:llä REST api, jolla voidaan muokata asiakkaan tietoja. API on muotoa /api/customer/123, metodi on PUT. Rajapintaan tuleva data tulee siis 
HTTP-body lohkossa JSON-objektina, kentät: nimi, osoite, postinro, postitmp, asty_avain.  Jos muutos onnistuu, palauta HTTP-status 204.  

11. Lisää em. asiakkaan muutos-palveluun myös kenttien tarkistus. Eli kaikki kentät ovat pakollisia, jos kutsussa tulee kenttiä, joissa on tyhjiä arvoja 
(tai joku kenttä puuttuu), palauta tästä tieto kutsujalle muodossa "Pakollisia tietoja puuttuu: nimi,osoite" (esimerkissä siis puuttuu VAIN nimi ja osoite). 
Tämä on siis virhetilanne, joten palauta data yo. ohjeen mukaan. HUOM! url:ssa oleva avain on pakko antaa, jotta reititys toimii, joten node "hoitaa" sen 
tarkistamisen automaattisesti (väärä reitti), tarkista silti avaimesta että se on kokonaisluku ja positiivinen arvo (jos avain EI ole validi, palauta samanlainen 
virhe kuin jos avain-kenttä puuttuisi ts. "Pakollisia tietoja puuttuu ...., HUOM! kutsussahan voi puuttua pakollisia kenttiä JA avain). HUOM! Kenttien järjestys 
"Pakollisia tietoja puuttuu:" -merkkijonon jälkeen on nimi,osoite,postinro,postitmp,asty_avain,avain.

12. Tilanne: käyttäjä A on hakenut asiakas-datan (olkoon asiakkaan nimi "Maija") web-sovellukseen hetkellä X. Heti tietojen hakemisen jälkeen joku toinen käyttäjä B 
on päivittänyt Maijan tietoja (vaikka osoite- ja postinro-kenttiä). Kun käyttäjä A painaa web-sovelluksessa Muokkaa-nappia, näyttää web-sovellus muutettavan asiakkaan 
tiedot formissa, jossa on nyt siis vanhat tiedot (ja käyttäjä A ei tiedä sitä). Kun käyttäjä A painaa Tallenna-nappia, päivittää hän pahimmillaan takaisin vanhat tiedot 
tietokantaan.

*/

app.use(bodyParser.json());

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',      
    password : 'root',
    database : 'customer',
    dateStrings : true
});

// REST api -> GET 
app.post('/api/customer', (req,res) => {

    let avain = req.body.avain;
    let nimi = req.body.nimi;
    let osoite = req.body.osoite;
    let postinro = req.body.postinro;
    let postitmp = req.body.postitmp;
    let asty_avain = req.body.asty_avain;  
    
    let query = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ( ?, ?, ?, ?, CURDATE(), ?)";

    if ((nimi == undefined) || (osoite == undefined) || (postinro == undefined) || (postitmp == undefined) || (asty_avain == undefined) ||
      (nimi == "") || (osoite == "") || (postinro == "") || (postitmp == "") || (asty_avain == "")) {
        
    }

    connection.query(query, [nimi, osoite, postinro, postitmp, asty_avain], function(error, result, fields){
        if ((nimi == undefined) || (osoite == undefined) || (postinro == undefined) || (postitmp == undefined) || (asty_avain == undefined) ||
            (nimi == "") || (osoite == "") || (postinro == "") || (postitmp == "") || (asty_avain == "")) {
            let error_msg = "Pakollisia tietoja puuttuu:";
            if(nimi == undefined || nimi == ""){
                error_msg = error_msg + "nimi";
            }
            if(osoite == undefined || osoite == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "osoite";
            }
            if(postinro == undefined || postinro == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "postinro";
            }
            if(postitmp == undefined || postitmp == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "postitmp";
            }
            if(asty_avain == undefined || asty_avain == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "asty_avain";
            }
            res.statusCode = 400;
            res.json({status : "NOT OK", message : error_msg});
        }
        else
        {
            res.statusCode = 201;
            avain = result.insertId;
            // Palautetaan juuri lisätty asiakastyyppi kutsujalle! HUOM! Kaikissa REST-rajapinnoissa EI välttämättä tehdä näin
            // ELI ei palauteta välttämättä mitään!
            res.json({avain: avain, nimi: nimi, osoite: osoite, postinro: postinro, postitmp: postitmp, asty_avain: asty_avain})
        }
    });
});

app.delete('api/customer/:avain', (req,res) => {
    console.log("/asiakas.PARAMS:", req.params);
    let avain = req.params.avain;

    let query = "DELETE FROM asiakas where AVAIN = ? ";

    connection.query(query, [avain], function(error, result, fields){
        if ( error )
        {
            res.statusCode = 400;
            res.json({status : "NOT OK", msg : "Tekninen virhe!"});
        }
        else
        {
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});

// Asiakastyypin muuttaminen
// PUT + param + body
app.put('/api/customer/:avain', (req,res) => {
    
    console.log("/asiakastyyppi. PARAMS:", req.params);
    console.log("/asiakastyyppi. BODY:", req.body);

    let nimi = req.body.nimi;
    let osoite = req.body.osoite;
    let postinro = req.body.postinro;
    let postitmp = req.body.postitmp;
    let asty_avain = req.body.asty_avain;

    // HUOM! url:ssa oleva muuttuja löytyy params-muuttujasta, huomaa nimeäminen
    let avain = req.params.avain;
    
    let query = "UPDATE asiakas SET NIMI=?, OSOITE=?, POSTINRO=?, POSTITMP=?, LUONTIPVM=CURDATE(), ASTY_AVAIN=? where AVAIN = ? ";

    console.log("query:" + query);
    connection.query(query, [avain, nimi, osoite, postinro, postitmp, asty_avain], function(error, result, fields){
        if ((nimi == undefined) || (osoite == undefined) || (postinro == undefined) || (postitmp == undefined) || (asty_avain == undefined) ||
            (nimi == "") || (osoite == "") || (postinro == "") || (postitmp == "") || (asty_avain == "")) {
            let error_msg = "Pakollisia tietoja puuttuu:";
            if(nimi == undefined || nimi == ""){
                error_msg = error_msg + "nimi";
            }
            if(osoite == undefined || osoite == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "osoite";
            }
            if(postinro == undefined || postinro == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "postinro";
            }
            if(postitmp == undefined || postitmp == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "postitmp";
            }
            if(asty_avain == undefined || asty_avain == ""){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "asty_avain";
            }
            if(avain <= 0){
                if(error_msg != "Pakollisia tietoja puuttuu:"){
                    error_msg = error_msg + ",";
                }
                error_msg = error_msg + "avain";
            }
            res.statusCode = 400;
            res.json({status : "NOT OK", message : error_msg});
        }
        else
        {
            console.log("R:" , result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    });
});

module.exports = app