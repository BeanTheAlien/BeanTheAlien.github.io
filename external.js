const querys = new URLSearchParams(window.location.search);
const pages = {
  "glarrglan": "https://docs.google.com/document/d/19gape2_N_B5AwshPbWARyjTViMeV_pr5pLitBynVlYg/edit?usp=sharing"
};
try {
  window.open(pages[querys.get("id"), "_blank");
} catch(e) { alert(e); console.error("An error occured: " + e); }
