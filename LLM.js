import {GoogleGenAI} from "@google/genai";
import readlineSync from "readline-sync";
import dotenv from "dotenv"

dotenv.config()
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const history = [];
async function chatting(userProblem) {
    history.push({
        role: "user",
        parts: [{text: userProblem}],
    });

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
    });
    history.push({
        role: "model",
        parts: [{text: response.text}],
    });
    console.log(response.text);
}

async function main() {
    const userProblem = readlineSync.question("Ask me any question --->");
   await chatting(userProblem);
    main()
}

main()
