const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/alexa/webhook", (req, res) => {

    const response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Hola, soy Jarvis. ¿En qué puedo ayudarte?</speak>"
            },
            shouldEndSession: false
        }
    };

    res.json(response);
});

app.get("/", (req, res) => {
    res.send("Jarvis API funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
