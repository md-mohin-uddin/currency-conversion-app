const amountElement = document.getElementById("amount");
const fromCurrencyElement = document.getElementById("fromCurrency");
const toCurrencyElement = document.getElementById("toCurrency");
const convertButton = document.getElementById("convertButton");
const conversionResult = document.getElementById("conversionResult");

// Fetch the currency options and populate the select elements
async function loadCurrencies() {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
    );
    const data = await response.json();

    // Populate select elements with currencies
    for (let currency in data) {
      const option = `<option value="${currency}">${
        data[currency]
      } (${currency.toUpperCase()})</option>`;
      fromCurrencyElement.innerHTML += option;
      toCurrencyElement.innerHTML += option;
    }
  } catch (error) {
    console.log("Error loading currencies:", error);
  }
}

// Perform conversion on button click
convertButton.addEventListener("click", async () => {
  const amount = parseFloat(amountElement.value);
  const fromCurrency = fromCurrencyElement.value.toLowerCase();
  const toCurrency = toCurrencyElement.value.toLowerCase();

  if (!amount || isNaN(amount)) {
    conversionResult.textContent = "Please enter a valid amount.";
    return;
  }

  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    conversionResult.textContent = "Please select different currencies.";
    return;
  }

  console.log(`Converting from ${fromCurrency} to ${toCurrency}`);

  try {
    // Fetch the currency data for the selected fromCurrency
    const response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`
    );

    if (!response.ok) {
      throw new Error(`Error fetching currency data: ${response.statusText}`);
    }

    const data = await response.json();

    // Access the conversion rate using the new structure
    const rate = data[fromCurrency][toCurrency];

    if (!rate) {
      throw new Error(
        `Conversion rate for ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()} not found.`
      );
    }

    // Calculate and display the conversion result
    const convertedAmount = (amount * rate).toFixed(2);
    conversionResult.textContent = `${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}`;
  } catch (error) {
    console.error("Error performing conversion:", error);
    conversionResult.textContent = `Error: ${error.message}`;
  }
});

// Load currencies on page load
loadCurrencies();
