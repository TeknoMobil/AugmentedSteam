class FCustomGiftcardAndWallet extends ASFeature {

    apply() {
        
        let giftcard = window.location.pathname.startsWith("/digitalgiftcards/");

        let minAmountNode = document.querySelector(giftcard ? ".giftcard_selection" : ".addfunds_area_purchase_game");
        let newel = minAmountNode.cloneNode(true);
        newel.classList.add("es_custom_money");

        let priceel = newel.querySelector(giftcard ? ".giftcard_text" : ".price");
        let price = priceel.textContent.trim();

        let currency = CurrencyRegistry.fromType(Currency.storeCurrency);
        let minValue = currency.valueOf(price);
        let step = Math.pow(10, -currency.format.decimalPlaces);

        let input = `<input type="number" id="es_custom_money_amount" class="es_text_input money" min="${minValue}" step="${step}" value="${minValue}">`;

        // add currency symbol
        if (currency.format.postfix) {
            input += currency.format.symbol;
        } else {
            input = currency.format.symbol + input;
        }

        if (giftcard) {
            let styleel = newel.querySelector(".giftcard_style");
            HTML.inner(styleel, Localization.str.wallet.custom_giftcard.replace("__input__", `<span>${input}</span>`));
            newel.querySelector("#es_custom_money_amount").dataset.tooltipText = Localization.str.wallet.custom_amount_text.replace("__minamount__", price);

            minAmountNode.insertAdjacentElement("afterend", newel);

            styleel.addEventListener("click", e => {
                e.preventDefault();
            });
        } else {
            HTML.inner(priceel, input);
            newel.querySelector("h1").textContent = `${Localization.str.wallet.custom_amount} ${price}`;
            newel.querySelector("p").textContent = Localization.str.wallet.custom_amount_text.replace("__minamount__", price);

            minAmountNode.insertAdjacentElement("afterend", newel);
        }

        newel.querySelector("#es_custom_money_amount").addEventListener("input", e => {
            let value = e.target.value;
            if (value < minValue) {
                value = minValue; // prevent purchase error
            }

            let customAmount = Number(value).toFixed(2).replace(/[,.]/g, '');

            if (giftcard) {
                priceel.textContent = new Price(value);
                priceel.classList.toggle("small", priceel.textContent.length > 8);
                newel.querySelector("a.btn_medium").href = `javascript:submitSelectGiftCard( ${customAmount} );`;
            } else {
                newel.querySelector("h1").textContent = `${Localization.str.wallet.custom_amount} ${new Price(value)}`;
                newel.querySelector("a.btn_medium").dataset.amount = customAmount;
            }
        });
    }
}