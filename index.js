const axios = require("axios");
const fs = require("fs");
const Util = require("./utils")

const getStargazers = async () => {
  try {
    const { data } = await axios.get("https://api.github.com/repos/dinhphuc/you-came-here/stargazers");
    console.log(data);
    if (data && Array.isArray(data)) {
      return data.map(stargazer => {
        return {
          login: stargazer.login,
          avatar_url: stargazer.avatar_url
        }
      });
    }
    return []
  } catch (err) {
    console.error(err.message);
    return [];
  }
};

const generate = async () => {
  const stargazers = await getStargazers();

  if (!stargazers || !Array.isArray(stargazers) || stargazers.length <= 0) return;

  const templateTable = fs.readFileSync("table-template.txt", "utf8");
  const templateTr = fs.readFileSync("tr-template.txt", "utf8");
  const templateTd = fs.readFileSync("td-tempate.txt", "utf8");

  let trData = "";
  let tdData = "";

  if (stargazers.length === 1) {
    tdData += Util.replaceTemplateWithParams(templateTd, stargazers[0]);
    trData += Util.replaceTemplateWithParams(templateTr, {
      td_data: tdData
    });
    tdData = "";
  } else {
    stargazers.forEach((stargazer, index) => {
      tdData += Util.replaceTemplateWithParams(templateTd, stargazer);
      if (index % 2 !== 0) {
        trData += Util.replaceTemplateWithParams(templateTr, {
          td_data: tdData
        });
        tdData = "";
      }
    });
  }

  const ReadMeContent = Util.replaceTemplateWithParams(templateTable, {
    tr_data: trData
  });

  fs.writeFileSync("README.md", ReadMeContent);
};

generate();