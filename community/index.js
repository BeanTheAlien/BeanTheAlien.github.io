import { comNet, net } from "../sv.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.4.5/+esm";

const btn = document.getElementById("create_post");
(async () => {
    if((await net.json("verify")).r) {
        btn.innerHTML = "Create Post";
        btn.addEventListener("click", () => window.location.href = "/community/createpost/");
    } else {
        document.body.removeChild(btn);
    }
})();
const disp = document.getElementById("post_display");
(async () => {
    const ps = await comNet.json("getposts");
    if("data" in ps) {
        ps.data.sort((a, b) => b.pinned - a.pinned).sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime()).forEach(p => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${p.title}</h3>
                <p style="color: #464646; font-size: 9px;">Posted by ${p.author} at ${(new Date(p.created_at)).toDateString()}</p>
                <div style="font-size: 15px;">
                    ${DOMPurify.sanitize(p.body)}
                </div>
            `;
            disp.appendChild(div);
        });
    }
})();
// DOMPurify.sanitize("");