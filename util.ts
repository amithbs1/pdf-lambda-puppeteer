import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GET_CATEGORIES, GET_ALL_ARTICLES_NEW } from "./queries"
import { svgObject } from "qr-image";
export const BANNER_SECTION = "Home Page Banner";
export const WELCOME_SECTION = "Welcome Section";
export const VIDEO_SECTION = "Home Page Videos";
export const RISK_STRATIFICATION_SLUG = "risk_stratification";
export const PROSTATE_SPECIFIC_ANTIGEN = "prostate_specific_antigen";
export const WATCHFUL_WAITING = "surveillance_expectant_management";
export const SURGERY = "surgery";
export const HORMONE_THERAPY = "hormone_ablative_therapy";
export const RADIATION_THERAPY = "radiation_therapy";
export const FOCAL_THERAPY = "focal_therapy";
export const MULTI_MODALITY_THERAPY = "multimodality_treatment";
export const USER_TOKEN = "userToken";
export const WAS_TUTORIAL_SHOWN = "isTutorialShown";
export const RISK_LEVEL_HEADING = "Your current risk level:";
export const TOP_TREATMENT_OPTIONS_HEADING = "Most appropriate treatment options you can discuss with your physician";
export const TOP_TREATMENT_OPTIONS_HEADING_MOBILE = "Most appropriate treatment options you can discuss with your physician";
export const ENTER_DATA_HEADING = "Enter your data";
export const ENTER_PATIENT_PREF_HEADING = "Select your preferences for treatment outcomes";
export const ENTER_DATA_HEADING_MOBILE = "Your Data";
export const ENTER_PATIENT_PREF_HEADING_MOBILE = "Your Preferences";
export const CURRENT_TOOL_STATE = "currentToolState";

export const REP_ID = "{{reportId}}";
export const REP_SVG_PATH = "{{qrCode}}";
export const REP_NAME = "{{name}}";
export const REP_PHONE = "{{phone}}";
export const REP_EMAIL = "{{email}}";
export const REP_DATE = "{{date}}";
export const REP_AGE = "{{age}}";
export const REP_GS_VALUE = "{{gsValue}}";
export const REP_UI_DESC = "{{uiDescription}}";
export const REP_UF_DESC = "{{ufDescription}}";
export const REP_EP_DESC = "{{epDescription}}";
export const REP_BD_DESC = "{{bdDescription}}";
export const REP_PSE_DESC = "{{pseDescription}}";
export const REP_AIC_DESC = "{{aicDescription}}";
export const REP_PSA_DESC = "{{psaDescription}}";
export const REP_PSA_VALUE = "{{psaValue}}";
export const REP_CLINICAL_STAGE = "{{clinicalStage}}";
export const REP_RISK_LEVEL = "{{riskLevel}}";
export const REP_TREATMENT_OPTIONS = "{{treatmentOptions}}";
export const REP_TREATMENT_NAME = "{{treatmentName}}";
export const DOC_NOTES = "{{doctorNotes}}";
export const REP_HTML_STR_LOW = "<div style='text-align:center;margin-top: 14px;margin-bottom: 0px;margin-left: 20px;'><span class='dotLow'><p class='textInside'>Low</p></span></div>";
export const REP_HTML_STR_MEDIUM = "<div style='text-align:center;margin-top: 14px;margin-bottom: 0px;margin-left: 20px;'><span class='dotMedium'><p class='textInsideMedium'>Medium</p></span></div>";
export const REP_HTML_STR_HIGH = "<div style='text-align:center;margin-top: 14px;margin-bottom: 0px;margin-left: 20px;'><span class='dotHigh'><p class='textInsideHigh'>High</p></span></div>";
export const REP_HTML_STR_TREATMENT_OPTIONS_TEMPLATE = "<div class='rectangle'><P class='ft9'>{{treatmentName}}</P></div>";
export const DOCTOR_NOTES_REPLACEMENT = "<TABLE cellpadding=0 cellspacing=0 class='t0a1'><TR colspan=2><TD rowspan=2 class='tr0 td0'><P class='p2b ft4'><SPAN class='ft3'>Notes to the Doctor: </SPAN>{{doctorNotes}}</P></TD></TR></TABLE>";
export const NOTES_TO_DOC_REP = "{{notesToDoc}}";
export const SEARCH_RESULT_PATHNAME="Search Result";

export const INITIAL_ARTICLE_FETCH_VARIABLES = {
    "riskRatificationArticle": "risk_stratification",
    "psaArticle": "prostate_specific_antigen",
    "watchfulWaitingArticle": "surveillance_expectant_management",
    "surgeryArticle": "surgery",
    "hormoneTherapyArticle": "hormone_ablative_therapy",
    "radiationTherapyArticle": "radiation_therapy",
    "focalTherapyArticle": "focal_therapy",
    "multiModalityTherapyArticle": "multimodality_treatment"
}

export const getFormattedDateString = () => {
    function join(t, a, s) {
        function format(m) {
            let f = new Intl.DateTimeFormat('en', m);
            return f.format(t);
        }
        return a.map(format).join(s);
    }

    let a = [{ day: 'numeric' }, { month: 'short' }, { year: 'numeric' }];
    let s = join(new Date, a, '-');
    // console.log(s);
    return s;
}

export const getCategories = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query({
        query: GET_CATEGORIES,
    });
    return data?.categories;
}

export const getArticlesAllNew = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query({
        query: GET_ALL_ARTICLES_NEW,
    });
    return data?.articles;
}

export enum InputType {
    Name,
    Email,
    Phone
}

export enum RiskLevel {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}

export enum Life {
    OVER = "ovr",
    UNDER = "undr"
}

export enum PatientPrefType {
    UI_SELECTOR = "UiSelector",
    EP_SELECTOR = "EpSelector",
    BD_SELECTOR = "BdSelector",
    UF_SELECTOR = "UfSelector",
    PSE_SELECTOR = "PseSelector",
    AIC_SELECTOR = "AicSelector",
    PSA_SELECTOR = "PsaSelector"
}

export const calculateRiskLevelV2 = (psaValue, gleasonScoreValue, clinicalStageValue): RiskLevel => {
    if (psaValue <= 10) {
        if (gleasonScoreValue == 0 || gleasonScoreValue == 1) {
            if (clinicalStageValue == 0 || clinicalStageValue == 1) {
                return RiskLevel.LOW;
            } else if (clinicalStageValue == 2) {
                return RiskLevel.MEDIUM;
            } else {
                return RiskLevel.HIGH;
            }
        } else if (gleasonScoreValue == 2) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.HIGH;
        }
    } else if (psaValue > 10 && psaValue <= 20) {
        if (gleasonScoreValue == 5 || clinicalStageValue == 5) {
            return RiskLevel.HIGH;
        } else {
            return RiskLevel.MEDIUM;
        }
    } else {
        return RiskLevel.HIGH;
    }
}

export const calculateRiskLevel = (psaValue, gleasonScoreValue, clinicalStageValue): RiskLevel => {
    let riskScore = 0;
    let riskTotal = 0;
    if (psaValue > 20) {
        // console.log('psaValue 1 ' + psaValue);
        riskScore = 5;
        riskTotal = 1;
    } else if (psaValue > 10 && psaValue <= 20) {
        // console.log('psaValue 2 ' + psaValue)
        riskScore = 2;
        riskTotal = 1;
    } else if (psaValue > 0 && psaValue <= 10) {
        // console.log('psaValue 3 ' + psaValue)
        riskScore = 1;
        riskTotal = 1;
    }

    if (gleasonScoreValue != 0) {
        // console.log('gleasonScoreValue' + gleasonScoreValue)
        riskScore += gleasonScoreValue;
        riskTotal += 1
    }

    if (clinicalStageValue != 0) {
        // console.log('clinicalStageValue' + gleasonScoreValue)
        riskScore += clinicalStageValue;
        riskTotal += 1;
    }

    const lowriskmax = 1 * riskTotal;
    const medriskmax = 2 * riskTotal;
    // const hiriskmax = 3 * riskTotal;

    // // console.log('riskScore ' + riskScore + ' medriskmax ' + medriskmax);
    if (riskScore == 0 && riskTotal == 0) {
        return RiskLevel.LOW;
        return;
    }

    if (riskScore >= medriskmax + 1) {
        return RiskLevel.HIGH;
    } else if (riskScore >= lowriskmax + 1 || riskScore <= medriskmax) {
        return RiskLevel.MEDIUM;
    } else {
        return RiskLevel.LOW;
    }
}

export const calculateTreatmentOptionsWithSequence = (lifeExpectancyValue,
    possibleTreatmentOptions,
    riskLevel,
    preferenceScores,
    UIscore, SDscore, BFscore, UUscore, PEscore, ACscore, PFscore
): any[] => {
    // console.log("lifeExpectancyValue " + lifeExpectancyValue)
    let life = "";
    if (lifeExpectancyValue >= 10) {
        life = Life.OVER;
    } else {
        life = Life.UNDER;
    }

    // console.log(`fetching possible treament option for the combination possibleTreatmentOptions[${riskLevel.toLowerCase()}${life}]`);
    const psbScores = []
    const psbTOptions = possibleTreatmentOptions[`${riskLevel.toLowerCase()}${life}`];
    psbTOptions?.map(option => {
        const { name } = option;
        const specificScore = preferenceScores[name];
        const optionTotal = specificScore["UIscore"] * UIscore +
            specificScore["SDscore"] * SDscore +
            specificScore["BFscore"] * BFscore +
            specificScore["UUscore"] * UUscore +
            specificScore["PSEscore"] * PEscore +
            specificScore["AICscore"] * ACscore +
            specificScore["PSAscore"] * PFscore

        psbScores.push({
            treatmentOption: option,
            totalScore: optionTotal
        })
    });
    // console.log(psbScores)
    const psbScoresSorted = psbScores?.sort((a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore));
    let newTreatmentOptionsList = []
    psbScoresSorted.map(tOption => {
        newTreatmentOptionsList.push(tOption.treatmentOption);
    });

    return newTreatmentOptionsList;
}


export const findSelectorDescription = (selectedType, selectedValue, selectorsMaster) => {
    const selectorObj = selectorsMaster.find(sMaster => sMaster.type == selectedType);
    if (selectorObj) {
        const { values } = selectorObj;
        if (values) {
            const valObj = values.find(val => val.value == selectedValue);
            return valObj ? valObj.displayText : "";
        } else {
            return "";
        }
    } else {
        return "";
    }
}

export const constructRiskLevelTag = (currentRiskLevel) => {
    if (currentRiskLevel == RiskLevel.HIGH) {
        return REP_HTML_STR_HIGH
    } else if (currentRiskLevel == RiskLevel.MEDIUM) {
        return REP_HTML_STR_MEDIUM
    } else {
        return REP_HTML_STR_LOW;
    }
}

export const constructTreatmentOptionsTag = (currentTreatmentOptions) => {
    let formattedHTMLTreatmentOptions = "";
    currentTreatmentOptions.map(opt => {
        formattedHTMLTreatmentOptions = formattedHTMLTreatmentOptions + REP_HTML_STR_TREATMENT_OPTIONS_TEMPLATE.replace(REP_TREATMENT_NAME, opt.name);
    })
    return formattedHTMLTreatmentOptions;
}

export const constructDocNotesTag = (comments) => {
    let formattedHTMLDocNotes = "";
    if(comments == "") {
        return formattedHTMLDocNotes
    }
    return formattedHTMLDocNotes + DOCTOR_NOTES_REPLACEMENT.replace(DOC_NOTES, comments);
}

export const createHTMLFromTemplate = (htmlContent, user, currentState, selectorsMaster, currentRiskLevel, currentTreatmentOptions, svgReportIdPath, reportId) => {
    const { display_name, email, phone } = user;
    const { toolCurrentPatientData, toolCurrentPatientPref } = currentState;
    const { gleasonScoreValue, clinicalStageValue, ageValue, psaValue } = toolCurrentPatientData;
    const { UiSelector, UfSelector, EpSelector, BdSelector, PseSelector, AicSelector, PsaSelector } = toolCurrentPatientPref;

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
        .replace(REP_RISK_LEVEL, constructRiskLevelTag(currentRiskLevel))
        .replace(REP_TREATMENT_OPTIONS, constructTreatmentOptionsTag(currentTreatmentOptions));

    // console.log("createHTMLFromTemplate" + constructContent);
    return constructContent;
}

export const generateQRCodeSVG = (reportId) => {
    // console.log("generateQRCodeSVG - reportId - " + reportId);
    if (!reportId) {
        return "";
    }
    const qrImageObj = svgObject(reportId, { type: 'svg' });
    // console.log("generateQRCodeSVG - qrImageObj - " + JSON.stringify(qrImageObj));
    if (qrImageObj && qrImageObj["path"]) {
        // console.log("generateQRCodeSVG - returning path - " + qrImageObj["path"]);
        return qrImageObj["path"];
    } else {
        return "";
    }


}