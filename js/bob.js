// Configuración MQTT
host = "192.168.60.1"
port = 8080
clientid = "clientjs"
topic = "cifpmqtt/mensaje1"
reconnectTimeout = 2000
username = null;
password = null;
useTLS = false;
cleansession = true;


/*servos = {
  'brazo-izq': {'object': servo_brazo_izq, 'moves': {'arriba': 0,'medio': 90,'abajo': 180}},
  'brazo-der': {'object': servo_brazo_der, 'moves': {'arriba': 180,'medio': 90,'abajo': 0}},
  'ojos': {'object': servo_ojos, 'moves': {'izquierda': 0, 'centro': 90, 'derecha': 180}}
}*/


function MQTTconnect() {
    if (typeof path == "undefined") {
        path = '/mqtt';
    }
    mqtt = new Paho
        .MQTT
        .Client(host, port, path, "web_" + parseInt(Math.random() * 100, 10));
    var options = {
        timeout: 3,
        useSSL: useTLS,
        cleanSession: cleansession,
        onSuccess: onConnect,
        onFailure: function (message) {
            $('#status').val(
                "Connection failed: " + message.errorMessage + "Retrying"
            );
            setTimeout(MQTTconnect, reconnectTimeout);
        }
    };

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    if (username != null) {
        options.userName = username;
        options.password = password;
    }
    console.log(
        "Host=" + host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " u" +
        "sername=" + username + " password=" + password
    );
    mqtt.connect(options);
}

function onConnect() {
    $('#status').val('Connected to ' + host + ':' + port + path);
    // Connection succeeded; subscribe to our topic
    mqtt.subscribe(topic, {qos: 0});
    $('#topic').val(topic);
}

function onConnectionLost(response) {
    setTimeout(MQTTconnect, reconnectTimeout);
    $('#status').val(
        "connection lost: " + response.errorMessage + ". Reconnecting"
    );

};

function onMessageArrived(message) {

    var topic = message.destinationName;
    var payload = message.payloadString;
    var number = 0;
    console.log ("Ha llegado un mensaje", message.destinationName, "...", message.payloadString);
    var words = payload.split("-");
    if(words[0] =="brazo"){
        moveArms(words[1],words[2]);
    }else if(words[0] == "ojos"){
        movePupils(words[1]);
    } else{
        console.log("Mensaje not found");
    }
}

function moveArms(arm, position) {
    console.log(arm, position);
    
    if (arm == "izq"){
        var armElement = document.querySelector(`.arm.left`);
        var relatedMiddleArm = document.querySelector(`.arm.middle.left`);

    } else if (arm == "der") {
        var armElement = document.querySelector(`.arm.right`);
        var relatedMiddleArm = document.querySelector(`.arm.middle.right`);
    }
    if (!armElement) {
        console.error(`No se encontró el brazo: ${arm}`);
        return;
    }

    console.log("position: ", position);
    if (position === 'medio') {
        if (relatedMiddleArm) {
            relatedMiddleArm.style.display = 'block';
            armElement.style.display = 'none';
        }
    } else {
        // Para cualquier otra posición, mostramos el brazo normal y ocultamos el medio
        armElement.style.display = 'block';
        if (relatedMiddleArm) relatedMiddleArm.style.display = 'none';

        switch (position) {
            case 'arriba':
                console.log("Arriba!!");
                armElement.style.transform = 'rotate(180deg)';
                break;
            case 'abajo':
                armElement.style.transform = 'rotate(0deg)';
                break;
            default:
                console.error('Posición no válida');
        }
    }

    
   /* if (position === "medio") {
        leftArm.style.display = 'none';
        rightArm.style.display = 'none';
        leftMiddleArm.style.display = 'block';
        rightMiddleArm.style.display = 'block';
    } else if (position === 'arriba') {
        leftArm.style.display = 'block';
        rightArm.style.display = 'block';
        leftMiddleArm.style.display = 'none';
        rightMiddleArm.style.display = 'none';
        leftArm.style.transform = 'rotate(180deg)';
        rightArm.style.transform = 'rotate(-180deg)';
    } else {
        leftArm.style.display = 'block';
        rightArm.style.display = 'block';
        leftMiddleArm.style.display = 'none';
        rightMiddleArm.style.display = 'none';
        leftArm.style.transform = 'rotate(0deg)';
        rightArm.style.transform = 'rotate(0deg)';
    }*/
}

function movePupils(position) {
    var value = Math.max(0, Math.min(180, position));
    if (value <= 36) {
        position = "izquierda";
    } else if (value <= 72) {
        position = "medio-izquierda";
    } else if (value <= 108) {
        position = "centro";
    } else if (value <= 144) {
        position = "medio-derecha";
    } else {
        position = "derecha";
    }
    console.log (position);

    let pupils = document.querySelectorAll('.pupil');
    let offsets = {
        'izquierda': '10%',
        'medio-izquierda': '30%',
        'centro': '50%',
        'medio-derecha': '70%',
        'derecha': '90%'
    };
    pupils.forEach(pupil => {
        pupil.style.left = offsets[position];
    });
}