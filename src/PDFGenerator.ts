import { Helper } from "./Helper";
import { GeneratorFunction } from "./types/GeneratorTypes";
const axios = require("axios");
import {
  PatientPrefType,
  constructTreatmentOptionsTag,
  generateQRCodeSVG,
  getFormattedDateString,
  constructRiskLevelTag,
  findSelectorDescription,
  calculateRiskLevelV2,
  calculateTreatmentOptionsWithSequence,
  REP_ID, REP_SVG_PATH, REP_NAME, REP_PHONE, REP_EMAIL, REP_DATE, REP_AGE, REP_GS_VALUE, REP_UI_DESC, REP_UF_DESC, REP_EP_DESC, REP_BD_DESC, REP_PSE_DESC, REP_AIC_DESC,
  REP_PSA_DESC, REP_PSA_VALUE, REP_CLINICAL_STAGE, REP_RISK_LEVEL, REP_TREATMENT_OPTIONS, DOC_NOTES, NOTES_TO_DOC_REP, constructDocNotesTag
} from "../util";
import { FIND_ME_STRING, GET_HTML_TEMPLATE } from "../queries";
import { initializeApollo } from "../apollo";
import { getTemplate } from "./templates/pdf-template";

export class PDFGenerator {
  /**
   * This function returns the buffer for a generated PDF of manual
   * @param {any} event - The object that comes for lambda which includes the http's attributes
   * @returns {Array<any>} array of Structure Instructions
   */
  static generatePDFWeb: GeneratorFunction = async (event, context) => {
    try {
      const { body, headers } = event;
      // Extract the email and captcha code from the request body
      const { treatmentoptionid } = JSON.parse(body.toString());
      const { authorization } = JSON.parse(JSON.stringify(headers));

      // console.log(`headers information - ` + JSON.stringify(headers));
      if (!authorization) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            message: "User not authorised to access the endpoint",
          }),
        };
      } else if (!treatmentoptionid) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Treatment Options information not found as part of the request"
          }),
        };
      }

      // console.log(`Check if the user already exists for email: ${email}`);
      const respMe = await findMeByToken(authorization);
      if (!respMe || respMe?.data?.errors) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Error occured while fetching me"
          }),
        };
      }
      const userMe = respMe?.data?.data?.me;
      if (!userMe) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Error occured while fetching me information"
          }),
        };
      }
      const emailId = userMe["email"];
      if (!emailId || emailId == "") {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Error occured while fetching me information, no email id found"
          }),
        };
      }

      const usersData = userMe.user;
      if (!usersData) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Error occured while fetching user information"
          }),
        };
      }
      const existingTreatmentOptions = usersData.treatment_options;
      // console.log(`trying to find if the treatment option matches the user`);
      if (!existingTreatmentOptions || existingTreatmentOptions.length < 1) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "User is not associated with any treatment options, hence aborting"
          }),
        };
      }
      let isValid = false;
      let treatmentOptions = [];
      existingTreatmentOptions.map(option => {
        if (option.id == treatmentoptionid) {
          treatmentOptions.push(option);
          isValid = true;
          return;
        }
      });

      if (!isValid) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "User is not associated with the treatment option id specified, hence aborting"
          }),
        };
      }

      if (!treatmentOptions || treatmentOptions.length < 1) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: `Error occured: no treatment options entry found for the treatment id ${treatmentoptionid}`
          }),
        };
      }

      const client = initializeApollo();

      // console.log(`fetch the html template`);
      const respHTMLTemplate = await client.query({
        query: GET_HTML_TEMPLATE,
      });
      if (!respHTMLTemplate || respHTMLTemplate.error) {
        return {
          statusCode: 422,
          body: JSON.stringify({
            message: "Error occured while fetching the raw html template"
          }),
        };
      }

      console.log("treatment option - ");
      console.log(treatmentOptions[0])
      const { users_permissions_user, optionState, doctorNotes } = treatmentOptions[0]
      const { toolCurrentPatientPref, toolCurrentPatientData } = optionState
      console.log(`HTML template fetch response ${JSON.stringify(respHTMLTemplate)}`);
      const { treatmentToolMaster } = respHTMLTemplate?.data
      const { age, downloadTemplate, uiSelector, possibleTreatmentOptions, preferenceScores } = treatmentToolMaster
      const { lifeExpectancyYears } = age

      const svgReportIdPath = generateQRCodeSVG(treatmentoptionid);
      console.log("svgReportIdPath..." + treatmentoptionid);

      let htmlResp = createHTMLFromTemplate(downloadTemplate, users_permissions_user, uiSelector, svgReportIdPath, treatmentoptionid, toolCurrentPatientPref, toolCurrentPatientData, possibleTreatmentOptions, preferenceScores, lifeExpectancyYears, doctorNotes);
      const html = getTemplate(htmlResp);
      const options = {
        format: "A4",
        scale: 1,
        printBackground: true,
        margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
      };

      const pdf = await Helper.getPDFBuffer(html, options);

      return {
        headers: {
          "Content-type": "application/pdf",
        },
        statusCode: 200,
        body: pdf.toString("base64"),
        isBase64Encoded: true,
      };
    } catch (error) {
      console.error("Error : ", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error,
          message: "Something went wrong",
        }),
      };
    }
  };
}

export const createHTMLFromTemplate = (htmlContent, user, selectorsMaster, svgReportIdPath, reportId, toolCurrentPatientData, toolCurrentPatientPref, possibleTreatmentOptions, preferenceScores, lifeExpectancyYears, doctorNotes) => {
  const { display_name, email, phone } = user;
  const { gleasonScoreValue, clinicalStageValue, ageValue, psaValue } = toolCurrentPatientPref;
  const { UiSelector, UfSelector, EpSelector, BdSelector, PseSelector, AicSelector, PsaSelector } = toolCurrentPatientData;
  // console.log(`createHTMLFromTemplate - Input Values - toolCurrentPatientData - ${JSON.stringify(toolCurrentPatientData)} - toolCurrentPatientPref ${JSON.stringify(toolCurrentPatientPref)} - user - ${JSON.stringify(user)}`);

  const lifeExpectancyValue = lifeExpectancyYears[ageValue];
  // console.log("lifeExpectancyValue..." + lifeExpectancyValue);

  const riskLevel = calculateRiskLevelV2(psaValue, gleasonScoreValue.value, clinicalStageValue.value);
  // console.log(`createHTMLFromTemplate - Risk Level - ${riskLevel}`);

  const tO = calculateTreatmentOptionsWithSequence(lifeExpectancyValue,
    possibleTreatmentOptions,
    riskLevel,
    preferenceScores,
    UiSelector.value,
    EpSelector.value,
    BdSelector.value,
    UfSelector.value,
    PseSelector.value,
    AicSelector.value,
    PsaSelector.value);
  // console.log(`createHTMLFromTemplate - Treatment Options - ${tO}`);

  const constructContent = htmlContent
    .replace(REP_ID, reportId)
    .replace(REP_SVG_PATH, svgReportIdPath)
    .replace(REP_NAME, display_name)
    .replace(REP_PHONE, phone ? phone : "Unknown")
    .replace(REP_EMAIL, email)
    .replace(REP_DATE, getFormattedDateString())
    .replace(REP_AGE, ageValue)
    .replace(REP_UI_DESC, findSelectorDescription(PatientPrefType.UI_SELECTOR, UiSelector.value, selectorsMaster))
    .replace(REP_UF_DESC, findSelectorDescription(PatientPrefType.UF_SELECTOR, UfSelector.value, selectorsMaster))
    .replace(REP_EP_DESC, findSelectorDescription(PatientPrefType.EP_SELECTOR, EpSelector.value, selectorsMaster))
    .replace(REP_BD_DESC, findSelectorDescription(PatientPrefType.BD_SELECTOR, BdSelector.value, selectorsMaster))
    .replace(REP_PSE_DESC, findSelectorDescription(PatientPrefType.PSE_SELECTOR, PseSelector.value, selectorsMaster))
    .replace(REP_AIC_DESC, findSelectorDescription(PatientPrefType.AIC_SELECTOR, AicSelector.value, selectorsMaster))
    .replace(REP_PSA_DESC, findSelectorDescription(PatientPrefType.PSA_SELECTOR, PsaSelector.value, selectorsMaster))
    .replace(REP_CLINICAL_STAGE, clinicalStageValue?.name)
    .replace(REP_GS_VALUE, gleasonScoreValue?.name)
    .replace(REP_PSA_VALUE, psaValue)
    .replace(REP_RISK_LEVEL, constructRiskLevelTag(riskLevel))
    .replace(NOTES_TO_DOC_REP, constructDocNotesTag(doctorNotes))
    .replace(REP_TREATMENT_OPTIONS, constructTreatmentOptionsTag(tO));

  // console.log("createHTMLFromTemplate" + constructContent);
  return constructContent;
}

const findMeByToken = async (token) => {
  // update existing user with treatment options
  const respMe = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_URI, {
    query: FIND_ME_STRING,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });
  // console.log(`User Info response for token: `);
  // console.log(respMe);
  return respMe;
}