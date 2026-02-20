import {config} from "dotenv";
import readlineSync from "readline-sync";
import {GoogleGenAI} from "@google/genai";
import {exec} from "child_process";
import {stderr, stdout} from "process";
import {promisify} from "util";
import os from "os";

const platfom = os.platform();

const asyncExecute = promisify(exec);
// This tool is used to execute terminal/shell commands
async function executeCommand({command}) {
    try {
        const {stdout, stderr} = await asyncExecute(command);

        if (stderr) {
            return `Error :${stderr}`;
        }

        return `Sucess:${stdout} ||Task completed successfully`;
    } catch (error) {
        return `Command Generation Error by LLM Model ${error}`;
    }
}

// * We have to descibe the each function

const executeCommandFunctionDeclaration = {
    name: "executeCommand",
    description:
        "Execute a single terminal/shell command.A command can be to create a file ,folder,write on to the file,edit or delete the file ",

    parameters: {
        type: "OBJECT",
        properties: {
            command: {
                type: "STRING",
                description: "It will be single terminal command. Ex:mkdir calculator",
            },
        },
        required: ["command"],
    },
};

const availableTools = {
    executeCommand: executeCommand,
};

// Run AI Agent
const ai = new GoogleGenAI({
    apiKey: "AIzaSyCWiH6n27XG77YI_1JG1zKmJ4SZBTXijhA",
});
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
                systemInstruction: `You are an website builder expert.you have you have to create the frontend of the website by analysing the user input 
                You have an access of tool,which can run ,execute termianl/shell command.

                Current user operating system is :${platfom}
                Give command to the user according to its operating system.

               <-- What is your job--> 
               1. Analyse the user query to see what type of website they want to build.
               2. Give them command one by one,step by setp.
               3. use available tool executeCommand

             //  Now you can give them command in following:
             1. First create a folder. Ex: mkdir "calculator"
             2. Inside the folder create ,index.html. Ex:touch "calculator/index.html"
             3. Then create style.css . Follow the above example
             4. Then create script.js 
             5. Then write the code into html file.

            You have to provide terminal /shell command to user,they will directly execute it.
                `,
                tools: [
                    {
                        functionDeclarations: [executeCommandFunctionDeclaration],
                    },
                ],
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            // const fCall=response.functionCalls[0]
            const {name, args} = response.functionCalls[0];

            console.log(response.functionCalls[0]);
            const funCall = availableTools[name];
            const result = await funCall(args);

            const functionResponsePart = {
                name: name,
                response: {
                    result: result,
                },
            };
           
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
    console.log("I am a cursor,let's create your website :")
    const userProblem = readlineSync.question("Ask any question :-->");
    await runAgent(userProblem);
    main();
}

main();
