import { ASFeature } from "../../ASFeature.js";
import { HTML } from "../../../core.js";
import { Localization } from "../../../language.js";
import { ExtensionLayer } from "../../common.js";

export class FReplaceDevPubLinks extends ASFeature {

    apply() {
        let devs = Array.from(document.querySelectorAll("#developers_list > a, .details_block > .dev_row:first-of-type > a"));
        let pubs = Array.from(document.querySelectorAll(".user_reviews > .dev_row:last-of-type a, .details_block > .dev_row:nth-of-type(2) > a"));
        let franchise = document.querySelector(".details_block > .dev_row:nth-of-type(3) > a");
        franchise = franchise ? [franchise] : [];

        for (let node of [...devs, ...pubs, ...franchise]) {
            let homepageLink = new URL(node.href);
            if (homepageLink.pathname.startsWith("/search/")) { continue; }

            let type;
            if (devs.includes(node)) {
                type = "developer";
            } else if (pubs.includes(node)) {
                type = "publisher";
            } else if (franchise === node) {
                type = "franchise";
            }
            if (!type) { continue; }

            node.href = `https://store.steampowered.com/search/?${type}=${encodeURIComponent(node.textContent)}`;
            HTML.afterEnd(node, ` (<a href="${homepageLink.href}">${Localization.str.options.homepage}</a>)`);
        }

        for (let moreBtn of document.querySelectorAll(".dev_row > .more_btn")) {
            moreBtn.remove();
        }

        ExtensionLayer.runInPageContext(() => { CollapseLongStrings(".dev_row .summary.column"); });
    }
}