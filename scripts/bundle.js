var deviceRpi = null;
var serverRpi = null;
var oBT = navigator.bluetooth;
var uuidService = "00000000-0000-1000-8000-00805f9b34fb";
var uuidRead = "ffffffff-ffff-ffff-ffff-fffffffffff0";
var nomBT = "helloworld";

/**
 *
 * @param event
 */
function connexion() {

    // Demande connexion BT
    navigator.bluetooth.requestDevice({
        "filters": [{
            "name": nomBT
        }],
        optionalServices:[uuidService]
    }).then(device => {
        deviceRpi = device;
    // Connexion OK : récupération du "server" BT
        device.gatt.connect().then(server => {
            serverRpi = server;
            alert("Vous êtes maintenant connecté à Léo... à vous de jouer !");
        }, error => {
            appendHTML("error", "Erreur lors de la connexion à Léo : " + error + "<br/>");
        });
    }, error => {
            appendHTML("error", "Connexion BT à Léo KO : " + error + "<br/>");
    });
}

/**
 *
 * @param event
 */
function testServiceRead() {
    if (serverRpi) {
        // Récupération du service BT exposé
        serverRpi.getPrimaryService(uuidService).then(service => {
            // Appel à la charactéristique "READ" du service
            service.getCharacteristic(uuidRead)
            .then(characteristic => {
            characteristic.readValue().then(value => {
            var stringConverstion = "";
        for(var i=0; i < value.byteLength; i++) {
            stringConverstion += String.fromCharCode(value.getUint8(i));
        }
        appendHTML("testResult", "Valeur retournée par le service BT : " + stringConverstion + "<br/>");
    }, error => {
            appendHTML("error", "Erreur lors de l'appel au service : " + error + "<br/>");
        });
    })
    }, error => {
            appendHTML("error", "Erreur lors de la récupération du service BT : " + error + "<br/>");
        });
    }
}

/**
 *
 * @param id
 * @param html
 */
function appendHTML(id, html) {
    var el = document.getElementById(id);
    if (el) {
        el.innerHTML += html;
    }
}