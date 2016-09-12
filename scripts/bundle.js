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
 * Appel service READ du périphérique BT associé
 */
function testServiceRead() {
    if (serverRpi) {
        // Récupération du service BT exposé
        serverRpi.getPrimaryService(uuidService).then(service => {
            // Appel à la charactéristique "READ" du service
            service.getCharacteristic(uuidRead).then(characteristic => {
                characteristic.readValue().then(value => {
                    appendHTML("testResultRead", "Valeur retournée par le service BT : " + new TextDecoder("utf-8").decode(value) + "<br/>");
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
 * Appel service WRITE du périphérique BT associé
 * @param event
 */
function testServiceWrite() {
    if (serverRpi) {
        // Récupération du service BT exposé
        serverRpi.getPrimaryService(uuidService).then(service => {
            // Appel à la charactéristique "READ" du service
            var toSend = "Hello world !";
            service.getCharacteristic(uuidRead).then(characteristic => {
                characteristic.writeValue(str2ab(toSend))
            }).then(test => {
                appendHTML("testResultWrite", "Envoi du message ["+toSend+"] OK !<br/>");
            }, error => {
                appendHTML("testResultWrite", "Envoi du message ["+toSend+"] KO : " + error + "<br/>");
            });
        }, error => {
            appendHTML("error", "Erreur lors de la récupération du service BT : " + error + "<br/>");
        });
    }
}

/**
 *
 * @param str
 * @returns {ArrayBuffer}
 */
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
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