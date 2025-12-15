import {client} from '../DB/db.js'
import 'dotenv/config'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { getEmbeddings } from './embeddings.js'
export const dataRetrieval = async(message)=>{
    const model = new ChatGoogleGenerativeAI({
        apiKey:process.env.GOOGLE_GENERATIVE_API_KEY,
        model:'gemini-2.0-flash-lite',
        temperature:0.2,
    })

    const inputEmbeedings = await getEmbeddings(message)

    const searchResult = await client.search('Scalable',{
        vector:inputEmbeedings,
        limit:3,
        withPayload:true,
    })

    const stringResult = searchResult.map((res)=>res.payload.text).join('\n\n')
    try{
        console.log("Ai generating response...")
        const aiMessage = await model.invoke([
            ["system","You are a helpful assistant. Use the following context to answer the question."],
            ["human",`Context: ${stringResult} Question: ${message}`]
        ])
        console.log('AI Message:',aiMessage.content)
    }catch(err){
        console.error('Error generating AI response:',err)
    }

}