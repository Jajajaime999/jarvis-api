const express = require("express");
const app = express();

app.use(express.json());

// 🔥 Función que simula inteligencia (puedes conectar API real después)
async function generarRespuesta(pregunta) {
    return `He analizado su solicitud. ${pregunta} es un tema interesante. 
    Permítame explicarlo de forma sencilla.`;
}

app.post("/api/alexa/webhook", async (req, res) => {

    let pregunta = "tu consulta";

    try {
        const intent = req.body.request.intent;
        if (intent && intent.slots && intent.slots.query) {
            pregunta = intent.slots.query.value;
        }
    } catch (e) {
        console.log("Error leyendo la pregunta");
    }

    const respuestaIA = await generarRespuesta(pregunta);

    const response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: `<speak>
                    <prosody rate="90%" pitch="-2%">
                        Procesando su solicitud. <break time="300ms"/>
                        ${respuestaIA}
                    </prosody>
                </speak>`
            },
            shouldEndSession: false
        }
    };

    res.json(response);
});

// ruta para verificar
app.get("/", (req, res) => {
    res.send("Jarvis inteligente activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
