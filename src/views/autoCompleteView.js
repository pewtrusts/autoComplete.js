const dataAttribute = "data-result";
const select = {
  resultsList: "autoComplete_results_list",
  result: "autoComplete_result",
  highlight: "autoComplete_highlighted"
};

/**
 * Gets the user's input value
 *
 * @param selector
 *
 * @return Element
 */
const getInput = selector => (typeof selector === "string" ? document.querySelector(selector) : selector());

/**
 * Creates the results list HTML tag
 *
 * @param renderResults
 *
 * @return HTMLElement
 */
const createResultsList = renderResults => {
  const resultsList = document.createElement("ul");
  if (renderResults.container) {
    select.resultsList = renderResults.container(resultsList) || select.resultsList;
  }
  resultsList.classList.add(select.resultsList);
  renderResults.destination.insertAdjacentElement(renderResults.position, resultsList);
  return resultsList;
};

/**
 * Highlight matching values
 *
 * @param value
 *
 * @return string
 */
const highlight = value => `<span class=${select.highlight}>${value}</span>`;

/**
 * Adding matching results to the list
 *
 * @param resultsList
 * @param dataSrc
 * @param dataKey
 * @param callback
 *
 * @return void
 */
const addResultsToList = (resultsList, dataSrc, dataKey, callback) => {
  dataSrc.forEach((event, record) => {
    const result = document.createElement("li");
    const resultValue = dataSrc[record].source[dataKey] || dataSrc[record].source;
    result.setAttribute(dataAttribute, resultValue);
    result.setAttribute("class", select.result);
    result.setAttribute("tabindex", "1");
    result.innerHTML = callback ? callback(event, result) : event.match || event;
    resultsList.appendChild(result);
  });
};

/**
 * Keyboard Arrow Navigation
 *
 * @param selector
 *
 * @param resultsList
 */
const navigation = (selector, resultsList) => {
  const input = getInput(selector);
  const first = resultsList.firstChild;
  document.onkeydown = event => {
    const active = document.activeElement;
    switch (event.keyCode) {
      // Arrow Up
      case 38:
        if (active !== first && active !== input) {
          active.previousSibling.focus();
        } else if (active === first) {
          input.focus();
        }
        break;
      // Arrow Down
      case 40:
        if (active === input && resultsList.childNodes.length > 0) {
          first.focus();
        } else if (active !== resultsList.lastChild) {
          active.nextSibling.focus();
        }
        break;
    }
  };
};

/**
 * Clears the list of results
 *
 * @param resultsList
 *
 * @return string
 */
const clearResults = resultsList => (resultsList.innerHTML = "");

/**
 * Gets user selection
 *
 * @param field
 * @param resultsList
 * @param callback
 * @param resultsValues
 * @param dataKey
 */
const getSelection = (field, resultsList, callback, resultsValues, dataKey) => {
  const results = resultsList.querySelectorAll(`.${select.result}`);
  Object.keys(results).forEach(selection => {
    ["mousedown", "keydown"].forEach(eventType => {
      results[selection].addEventListener(eventType, event => {
        if (eventType === "mousedown" || event.keyCode === 13) {
          // Callback function invoked on user selection
          callback({
            event,
            query: getInput(field).value,
            results: resultsValues.map(record => record.source),
            selection: resultsValues.find(value => {
              const resValue = value.source[dataKey] || value.source;
              return resValue === event.target.closest(`.${select.result}`)
                .getAttribute(dataAttribute);
            }).source
          });
          // Clear Results after selection is made
          clearResults(resultsList);
        }
      });
    });
  });
};

export const autoCompleteView = {
  getInput,
  createResultsList,
  highlight,
  addResultsToList,
  navigation,
  clearResults,
  getSelection
};
