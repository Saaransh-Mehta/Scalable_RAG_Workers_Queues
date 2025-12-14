import { parsePDF } from "./services/pdfParser.js";
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
import { getEmbeddings } from "./services/embeddings.js";
import { client } from "./DB/db.js";

export const main = async() =>{
    const docs = await parsePDF('Saaransh Mehta (2).pdf')
    const splitter = new RecursiveCharacterTextSplitter({chunkSize:250,chunkOverlap:20})
    const texts = await splitter.splitDocuments(docs)
    console.log('Split into ',texts.length,'chunks')
    const embeddings = []
    for(let i=0;i<texts.length;i++){
    const embedding = await getEmbeddings(texts[i].pageContent)
    embeddings.push(embedding)
    console.log(`Generated embedding for chunk ${i+1} / ${texts.length}`)

    }
      await client.getCollection("Scalable",{
            vectors:{
                distance: 'Cosine',
                size: embeddings.length
            }
        })
        for(let i=0;i<texts.length;i++){
      
        await client.upsert('Scalable',{
            points: [{
                id: i,
                vector: embeddings[i],
                payload: {
                    text: texts[i].pageContent
                }
            }]
        })
       
        
        console.log(`Added chunk ${i+1} / ${texts.length}`)
    }
    
}

