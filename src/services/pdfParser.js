import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from 'node:path'

export const parsePDF = async(filePath) =>{
    const file = path.resolve(filePath)
    const parsedPDF = new PDFLoader(file)
    return await parsedPDF.load()
}
