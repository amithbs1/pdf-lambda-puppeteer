import * as handlebars from "handlebars";

export const getTemplate: any = (htmlContent: any) => {
  return handlebars.compile(htmlContent)({});
};
