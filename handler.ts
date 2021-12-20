import { APIGatewayProxyHandler } from "aws-lambda";
import { PDFGenerator } from "./src/PDFGenerator";

export const generatePDFWeb: APIGatewayProxyHandler = async (event, _context) => {
  const response = await PDFGenerator.generatePDFWeb(event, _context);
  return response;
};

export const generatePDFMobile: APIGatewayProxyHandler = async (event, _context) => {
  const response = await PDFGenerator.generatePDFMobile(event, _context);
  return response;
};
