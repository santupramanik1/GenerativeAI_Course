import {config} from "dotenv";
import readlineSync from "readline-sync";
import {GoogleGenAI} from "@google/genai";
// sum of two number
function sum({num1, num2}) {
    return num1 + num2;
}

//Check Prime number
function prime({num}) {
    if (num < 2) {
        return false;
    }
    for (let i = 2; i < Math.sqrt(num); i++) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}

// Fecth crypto currency data
async function getCryptoPrice({coin}) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
    const data = await response.json();

    return data;
}

// * We have to descibe the each function
const sumFunctionDeclaration = {
    name: "sum",
    description: "This function take 2 number as input and returns its sum",
    parameters: {
        type: "OBJECT",
        properties: {
            num1: {
                type: "NUMBER",
                description: "It will be the first number for addition Ex:10",
            },
            num2: {
                type: "NUMBER",
                description: "It will be the second number for addition Ex:20",
            },
        },
        required: ["num1", "num2"],
    },
};

const primeFunctionDeclaration = {
    name: "prime",
    description: "Get if the number is prime or not",
    parameters: {
        type: "OBJECT",
        properties: {
            num: {
                type: "NUMBER",
                description: "It will be the number to find it is prime or not ex:13",
            },
        },
        required: ["num"],
    },
};

const getCryptoPriceFunctionDeclaration = {
    name: "getCryptoPrice",
    description: "Get the current price of any crypto currrency like bitcoin",
    parameters: {
        type: "OBJECT",
        properties: {
            coin: {
                type: "STRING",
                description: "It will be the the crypto currency name like bitcoin",
            },
        },
        required: ["coin"],
    },
};

const availableTools = {
    sum: sum,
    prime: prime,
    getCryptoPrice: getCryptoPrice,
};

// Run AI Agent
const ai = new GoogleGenAI({apiKey: "AIzaSyC184vK5kNfXGsOhVkP2PwsH1Az9x3nOFo"});
const History = [];
async function runAgent(userProblem) {
    // This is user given the prompt that is pushed into the History array for getting better repsonse
    History.push({
        role: "user",
        parts: [{text: userProblem}],
    });

    while (true) {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: History,
            config: {
                tools: [
                    {
                        functionDeclarations: [
                            sumFunctionDeclaration,
                            primeFunctionDeclaration,
                            getCryptoPriceFunctionDeclaration,
                        ],
                    },
                ],
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            // const fCall=response.functionCalls[0]
            const {name, args} = response.functionCalls[0];

            console.log(response.functionCalls[0])
            const funCall = availableTools[name];
            const result = await funCall(args);

            const functionResponsePart = {
                name: name,
                response: {
                    result: result,
                },
            };
            // model
            // History.push({
            //     role: "model",
            //     parts: [
            //         {
            //             functionCall:fCall ,
            //         },
            //     ],
            // });
            History.push(response.candidates[0].content);

            // result is pushed to the history
            History.push({
                role: "user",
                parts: [
                    {
                        functionResponse: functionResponsePart,
                    },
                ],
            });
        } else {
            History.push({
                role: "model",
                parts: [{text: response.text}],
            });
            console.log(response.text);
            break;
        }
    }
}

// This function continously call the runAgent function to run the programm continously
async function main() {
    // Take user input
    const userProblem = readlineSync.question("Ask any question :-->");
    await runAgent(userProblem);
    main();
}

main();
