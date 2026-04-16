const express = require("express");
const app = express();

app.use(express.json());
const axios = require("axios");

async function generarRespuesta(pregunta) {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Eres Jarvis, un asistente elegante que responde en español de forma clara y formal." },
            { role: "user", content: pregunta }
        ]
    }, {
        headers: {
            "Authorization": `Bearer TU_API_KEY`,
            "Content-Type": "application/json"
        }
    });

    return response.data.choices[0].message.content;
}
});

// ruta para verificar
app.get("/", (req, res) => {
    res.send("Jarvis inteligente activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
