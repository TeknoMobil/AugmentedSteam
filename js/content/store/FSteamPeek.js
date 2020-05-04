class FSteamPeek extends ASFeature {

    _moreLikeThis;

    checkPrerequisites() {
        this._moreLikeThis = document.querySelector("#recommended_block");
        return this._moreLikeThis;
    }

    async apply() {

        HTML.afterEnd(this._moreLikeThis.querySelector(".block_header"),
            `<div class="es_tabs">
                <div class="home_tabs_row">
                    <div id="es_tab_steamsimilar" class="es_tab home_tab active">
                        <div class="tab_content">Steam</div>
                    </div>
                    <div id="es_tab_steampeek" class="es_tab home_tab">
                        <div class="tab_content">SteamPeek</div>
                    </div>
                </div>
            </div>`);

        HTML.beforeEnd(this._moreLikeThis.querySelector(".store_horizontal_autoslider_ctn"),
            `<div class="block_responsive_horizontal_scroll store_horizontal_autoslider block_content nopad" id="es_steampeek_content"></div>`);

        // TODO Create a global handler for DS loading
        await ExtensionLayer.runInPageContext(() => new Promise(resolve => { GDynamicStore.OnReady(() => { resolve(); }); }), null, true);

        let [steamTab, steamPeekTab, content] = this._moreLikeThis
            .querySelectorAll("#es_tab_steamsimilar, #es_tab_steampeek, #recommended_block_content");

        

        steamTab.addEventListener("click", () => {
            steamPeekTab.classList.remove("active");
            steamTab.classList.add("active");
            content.classList.remove("es_sp_active");
            content.classList.add("es_steam_active");

            LocalStorage.set("steampeek", false);

            this._adjustScroller();
        });

        let spLoaded = false;
        steamPeekTab.addEventListener("click", async () => {
            steamPeekTab.classList.add("active");
            steamTab.classList.remove("active");
            content.classList.add("es_sp_active");
            content.classList.remove("es_steam_active");

            LocalStorage.set("steampeek", true);

            if (!spLoaded) {
                spLoaded = true;

                for (let node of content.querySelectorAll(":scope > a")) {
                    node.classList.add("es_steam_similar");
                }

                let data = await Background.action("steampeek", this.context.appid);
                if (!data) { return; }

                let lastChild = content.querySelector(":scope > :last-child");

                for (let { title, appid } of data) {
                    HTML.beforeBegin(lastChild,
                        `<a class="small_cap es_sp_similar" data-ds-appid="${appid}" href="https://store.steampowered.com/app/${appid}/">
                            <img src="https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_184x69.jpg" class="small_cap_img"></img>
                            <h4>${title}</h4>
                        </a>`);

                    ExtensionLayer.runInPageContext(appid => { GStoreItemData.BindHoverEvents($J("#recommended_block_content > a:last-of-type"), appid); }, [ appid ]);
                }

                ExtensionLayer.runInPageContext(() => { GDynamicStore.DecorateDynamicItems($J("#recommended_block_content > a.es_sp_similar")); });

                Highlights.highlightAndTag(content.querySelectorAll("a.es_sp_similar"), true);

                HTML.beforeBegin(lastChild,
                    `<a class="small_cap es_sp_similar" href="http://steampeek.hu/?appid=${this.context.appid}" target="_blank">
                        <div class="es_sp_similar__link">${Localization.str.more_on_steampeek}</div>
                    </a>`);
            }

            this._adjustScroller();
        });

        if (LocalStorage.get("steampeek", false)) {
            steamPeekTab.click();
        }
    }

    _adjustScroller() {
        ExtensionLayer.runInPageContext(() => { $J("#recommended_block_content").trigger("v_contentschanged"); });
    }
}