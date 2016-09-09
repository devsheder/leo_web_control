$(document).ready(function() {

    var oBT = navigator.bluetooth;

    $("#debug").html("navigator.bluetooth = " + oBT + "<br/>");

    for(var key in oBT) {
        $("#debug").html($("#debug").html() + oBT[key] + "<br/>");
    }

    $("#debug").html($("#debug").html() + "Tentative d'appairage avec [TV]Samsung LED40...<br/>");
    
    //SPBT2299
    //"optionalServices":["0x2A00"]
    
    $("#connectBT").click(function(event) {
        navigator.bluetooth.requestDevice({
            "filters": [{
                "name": 'raspberrypi'
            }]
        }).then(device => {
            console.log(device);
            device.gatt.connect();
    }, error => {
            console.log(error);
        });
    });
    
});