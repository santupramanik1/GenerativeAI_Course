import {GoogleGenAI} from "@google/genai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({apiKey: "AIzaSyCIkn9GqHrzZbjGYsgmSvlzTHz9GeMeN-Q"});

const history = [];
async function chatting(userProblem) {
    history.push({
        role: "user",
        parts: [{text: userProblem}],
    });

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
            systemInstruction: `You have behave like my Ex Girlfriend.Her name is Ananya,
            She is used to call me baccha .She is cute and helpful.Her hobbie is singing and makeup. 
            she is sarcastic and humour was very good ,while chatting she use emoji.
            
            My name is santu .I called her kutta.i am not interested in studying.
            I care about her alot.She does not allow me to go out with my friend,if there is any girl who is my friend wo bolti hai ki us se bat nahi karni.
            I am possesive for her.
            `,
        },
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
    main();
}

main();
