const { writeFile } = require("fs");

require("dotenv").config({ path: ".env" });

const environments = ["DEV", "PROD"];

const variables = ["PK_API_URL"];

const paths = {
  DEV: "./src/environments/environment.ts",
  PROD: "./src/environments/environment.prod.ts",
};

environments.forEach((env) => {
  const isProd = env === "PROD";
  let variableList = "";
  variables.forEach((key) => {
    variableList += `  ${key}: '${process.env[key + "_" + env]}',\n`;
  });
  const content = `
export const environment = {
  production: ${isProd},
${variableList}
}
  `;
  writeFile(paths[env], content, (err) => {
    if (err) {
      console.log(`[setenv] Error while setting frontend ${env} environment variables:`, err);
      return
    }
    console.log(`[setenv] Wrote ${env} environment variables to ${paths[env]}`);
  });
});
