var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

/* 

1. Toteuta node.js:llä REST api, jonka avulla voidaan hakea KAIKKI asiakkaat tietokannasta ilman mitään hakuehtoja (asiakas-taulusta). 
Rajapinnan osoitteen täytyy olla muotoa "/api/customer", metodi  on GET. Rajanpinnasta palautetaan taulukollinen JSON-muotoista dataa, 
jokaisessa JSON-objektissa on kentät (AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN). HUOM! Kentät pitää palauttaa ISOILLA 
kirjoitettuna, juuri kuten ne on esitetty yllä. Tarvittaessa voit käyttää SQL-lauseessa as-sanaa, jonka avulla voi muuttaa kentän nimen haluamakseen (nk. alias).

2. Muuta tehtävää 1 siten, että asiakkaita voidaan hakea MYÖS hakuehdoilla nimi, osoite ja asiakastyyppi (hakuehdoista voidaan antaa mikä 
tahansa kombinaatio tai ei yhtään hakuehtoa). Jos yhtään hakuehtoa ei anneta, palautetaan kaikki asiakkaat. Hakuehto annettava query-parametrina 
(parametrien nimet ovat: nimi, osoite, asty) Huom! Toteuta api niin, että riittää syöttää nimen ja/tai osoitteen alkuosa. Eli jos kannassa on nimi 
"Maija", voi hakuehdoksi antaa tekstin "Mai" (ilman jokerimerkkejä).

3. Muuta tehtävää 2 niin, että asiakas-haku palauttaa myös asiakastyypin selitteen (ASTY_SELITE-kentässä).

4. Muuta tehtävää 2 niin, että asiakkaat palautetaan JSON-objektina, jossa on kentät: status, message, data. Status-kentässä palautetaan "OK", jos haku onnistui
(siis ei tullut virheitä ja haku palautti vähintään 1 rivin) ja "NOT OK", jos haussa oli virheitä TAI haku palautti 0 riviä. Message-kentässä palautetaan tieto 
VAIN jos status = "NOT OK", silloin kentässä lukee "Virheellinen haku" (muuten kentässä on tyhjä merkkijono). Data-kentässä palautetaan data taulukkona, jonka 
muoto on sama kuin tehtävässä 1 tai pelkkä tyhjä taulukko (ts. kenttä data pitää aina palauttaa ja siinä on aina taulukko ... joka voi olla tyhjä).

5. Jos REST-rajapintaa kutsutaan väärällä reitillä eli esimerkiksi muodossa "/api/vaara_reitti", täytyy rajapinnan palauttaa HTTP statuskoodi 404 sekä 
JSON-muotoinen objekti, jossa on kentät message ja count. Message-kentässä lukee teksti "Osoite oli  virheellinen:" + väärä url (em osoitteella lukisi 
kentässä arvo "Osoite oli virheellinen:/api/vaara_reitti"). Count kentässä tulee asiakas-taulun rivien lukumäärä.

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
app.get('/api/customer', (req,res) => {
    
    let query = 'SELECT x.ASTY_AVAIN, x.AVAIN, x.NIMI, x.OSOITE, x.POSTINRO, x.POSTITMP, y.SELITE as ASTY_SELITE FROM Asiakas as x LEFT JOIN Asiakastyyppi as y ON x.ASTY_AVAIN=y.AVAIN WHERE 1=1';
    
    if (req.query.nimi) {
      query = query + " AND nimi like '" + req.query.nimi + "%'"
    }

    if (req.query.osoite) {
      query = query + " AND osoite like '" + req.query.osoite + "%'"
    }

    if (req.query.asty) {
      query = query + " AND asty_avain like '" + req.query.asty + "%'"
    }

    connection.query(query, function(error, result, fields){

        if ( error )
        { 
            res.send({status : "NOT OK", message : "Virheellinen haku", data: ""});
            console.log(result)
        }
        else
        {
            res.statusCode = 200;
            res.send({status : "OK", message: "", data: result}); 
        }
    });
});

app.get('*',function(req, res){
    res.statusCode = 404;
    res.json({message: "Osoite oli virheellinen:" + req.originalUrl, count: ""})
}); 

module.exports = app