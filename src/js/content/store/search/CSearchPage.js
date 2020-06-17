class CSearchPage extends CStoreBase {

    constructor() {
        super([
            FSearchFilters,
        ]);

        this.infiniScrollEnabled = document.querySelector(".search_pagination").style.display === "none";

        this.applyFeatures();
    }
}