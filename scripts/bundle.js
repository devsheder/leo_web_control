var deviceRpi = null;
var characteristicServiceRpi = null;
var oBT = navigator.bluetooth;
//var uuidService = "ffffffff-ffff-ffff-ffff-fffffffffff0";
var uuidService = "ffffffff-ffff-ffff-ffff-fffffffffff0";
var uuidCharacteristic = "ffffffff-ffff-ffff-ffff-fffffffffff0";
var nomBT = "helloworld";

/**
 * Lance la connexion au BT
 */
function connection() {
    // Demande connexion BT
    navigator.bluetooth.requestDevice({
        "filters": [{
            "name": nomBT
        }],
        optionalServices:[uuidService]
    }).then(device => {
        deviceRpi = device;
        // Connexion OK : récupération du service BT
        device.gatt.connect().then(server => {
            alert("Vous êtes maintenant connecté à Léo... à vous de jouer !");
            return server.getPrimaryService(uuidService);
        }, error => {
            appendHTML("error", "Erreur lors de la connexion à Léo : " + error + "<br/>");
        }).then(service => {
            return service.getCharacteristic(uuidCharacteristic).then(characteristic => {
            	characteristicServiceRpi = characteristic;
            	appendHTML("testResultConnection", "Récupération service BT OK ! <br/>");
            });
        }, error => {
            appendHTML("error", "Erreur lors de la récupération du service BT : " + error + "<br/>");
        });
    }, error => {
            appendHTML("error", "Connexion BT à Léo KO : " + error + "<br/>");
    });
}

/**
 * Appel service READ du périphérique BT associé
 */
function testServiceRead() {
        // Récupération du service BT exposé
	if(characteristicServiceRpi) {
		characteristicServiceRpi.readValue().then(value => {
			appendHTML("testResultRead", "Valeur retournée par le service BT : " + new TextDecoder("utf-8").decode(value) + "<br/>");
		}, error => {
			appendHTML("error", "Erreur lors de l'appel au service : " + error + "<br/>");
		});
	}
}

/**
 * Stop le robot
 */
function stop() {
    _callWrite("stop");
}

/**
 * Fait avancer le robot
 */
function moveForward() {
    _callWrite("forward");
}

/**
 * Fait reculer le robot
 */
function moveBackward() {
    _callWrite("backward");
}

/**
 * Fait tourner le robot à gauche
 */
function turnLeft() {
    _callWrite("left");
}

/**
 * Fait tourner le robot à droite
 */
function turnRight() {
    _callWrite("right");
}

/**
 * Appel caractéristique write du service BT
 * @param message à envoyer
 * @private
 */
function _callWrite(message) {
    // on place un timeout pour laisser le temps au à l'appel précédent de se terminer
    // pour palier au cas où l'utilisateur appuie vite sur le bouton
    var self = this;
    if(characteristicServiceRpi) {
        setTimeout(function() {
            appendHTML("testResultWrite", "Envoi du message : " + message + "...");
            self.characteristicServiceRpi.writeValue(_str2ab(message));
            appendHTML("testResultWrite", " OK ! <br/>");
        }, 400);
    }
}

/**
 *  Converti une String en ArrayBuffer
 * @param str à convertir
 * @returns {ArrayBuffer}
 */
function _str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Ajoute de l'HTML dans un élément
 * @param id
 * @param html
 */
function appendHTML(id, html) {
    var el = document.getElementById(id);
    if (el) {
        el.innerHTML += html;
    }
}
