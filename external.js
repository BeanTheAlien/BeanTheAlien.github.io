const querys = new URLSearchParams(window.location.search);
const pages = {
  "glarrglan": "https://docs.google.com/document/d/19gape2_N_B5AwshPbWARyjTViMeV_pr5pLitBynVlYg/edit?usp=sharing"
};
const pg = querys.get("id");
if(pages[pg]) window.location.href = pages[pg];