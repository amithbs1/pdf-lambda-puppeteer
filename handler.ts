import { APIGatewayProxyHandler } from "aws-lambda";
import { PDFGenerator } from "./src/PDFGenerator";

export const generatePDFWeb: APIGatewayProxyHandler = async (event, _context) => {
  const response = await PDFGenerator.generatePDFWeb(event, _context);
  return response;
};
