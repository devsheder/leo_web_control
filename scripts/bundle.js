var deviceRpi = null;
var serverRpi = null;

$(document).ready(function() {

    var oBT = navigator.bluetooth;
    var uuidService = "00000000-0000-1000-8000-00805f9b34fb";
    var uuidRead = "ffffffff-ffff-ffff-ffff-fffffffffff0";
    var nomBT = "helloworld";

    $("#debug").html("navigator.bluetooth = " + oBT + "<br/>");

    $("#connectBT").click(function(event) {
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
                $("#testWrapper").show();
                serverRpi = server;
                alert("Vous êtes maintenant connecté à Léo... à vous de jouer !");
            }, error => {
                $("#error").append("Erreur lors de la connexion à Léo : " + error + "<br/>");
            });
    }, error => {
            $("#error").append("Connexion BT à Léo KO : " + error + "<br/>");
        });
    });

    $("#test").click(function(event) {
        // Récupération du service BT exposé
        serverRpi.getPrimaryService(uuidService).then(service => {
            // Appel à la charactéristique "READ" du service
            service.getCharacteristic("ffffffff-ffff-ffff-ffff-fffffffffff0")
                .then(characteristic => {
                characteristic.readValue().then(value => {
                    var stringConverstion = "";
                    for(var i=0; i < value.byteLength; i++) {
                        stringConverstion += String.fromCharCode(value.getUint8(i));
                    }
                    $("#testResult").append("Valeur retournée par le service BT : " + stringConverstion + "<br/>");
                }, error => {
                    $("#error").append("Erreur lors de l'appel au service : " + error + "<br/>");
                });
            })
        }, error => {
            $("#error").append("Erreur lors de la récupération du service BT : " + error + "<br/>");
        });
    });
});