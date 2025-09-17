window.addEventListener("error", (e) => alert(e));
alert();
const querys = new URLSearchParams(window.location.search);
const pages = {
  "glarrglan": "https://docs.google.com/document/d/19gape2_N_B5AwshPbWARyjTViMeV_pr5pLitBynVlYg/edit?usp=sharing"
};
if(pages[querys.get("id")) window.location.href = pages[querys.get("id")];
