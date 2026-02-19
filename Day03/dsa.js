import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({apiKey: "AIzaSyCIkn9GqHrzZbjGYsgmSvlzTHz9GeMeN-Q"});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "who is the president of india",
        config: {
            systemInstruction: `You are a Data Structure and algorithm instructor.you only reply to the problem related to the Data Structure and algorithm.you have to solve query of user in simplest way.
                if user asks any question which is not related to the Data Structure and algorithm,reply him rudely.
                Example:If user ask,How are you 
                you will reply :you dumb ask some sensible question ,like this message you can reply anything rudely
                
                You have to reply rudely if question is not realted to Data Structure and algorithm
                Else Reply him with politely with some explanation`,
        },
    });
    console.log(response.text);
}

await main();
