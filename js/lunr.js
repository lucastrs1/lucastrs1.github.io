let pagesIndex, searchIndex;
const MAX_SUMMARY_LENGTH = 100;
const SENTENCE_BOUNDARY_REGEX = /\b\.\s/gm;
const WORD_REGEX = /\b(\w*)[\W|\s|\b]?/gm;

const JSON = [
    {
        categories: "",
        content:
            "What is currently being investigated by the L3? We defined as “Call Log” the number of unsolved cases. The Call Log is the pool of incident/problem being investigated and assigned to L3 Support Experts, in other words, the IN PROGRESS tickets. It does not include incidents/problems waiting for the deployment of a Change Note. The “Call Log” is a great metric to keep an eye on because it can help you figure out how efficient the support process is. It can also help you gauge the customer’s happiness level related to your application; if they have a lot of IN PROGRESS tickets or critical ones, they’re bound to be unhappy. How the PBOX can help? The PBOX, through the “On-Air Desk” dashboard, intends to provide a synthetic view of tickets currently in progress at the L3 Support, the Call Log then. It’s an instant view. The Call Log is still moving, new incoming tickets and resolved tickets impacting the numbers. To consult the history of the Call Log, you can use the On-Air History. How to use this Dashboard? Two charts are displayed by default. The Call Log filtered by application: The Call Log filtered by priority: You can navigate with the mouse upon the charts to have the number of each application: To retrieve the tickets details of the data, click on the chart sections or “all links”: How to interact? Two main actions are available for « In progress » tickets: The “On-Air Status” Clicking on this icon will display a small summary of investigation: Clicking on this icon will notify the Support Expert in charge of the ticket: The Support Expert in charge of the ticket will then send you a detailed status of the investigation.",
        href: "Support-On-Air-Desk-V1.html",
        title: "Support-On-Air-Desk-V1"
    },
    {
        categories: "",
        content:
            "How much IDSC is proactive? This dashboard intends to categorize created problems at L3, according their origin, to define part of proactivity of IDSC. Reactive definition A reactive problem is a problem created by the L3 after: Incident reception and a root cause analysis is required, Direct request from Airbus to launch an investigation Proactive definition A proactive problem is a problem created by the L3 after: Issue detected by the L3/Product Owner before the users do, Escalation confirmed from the L3 Monitoring, Preventive study on potential bottleneck identified (robustness mainly) Basically for any problems without incidents linked to it. How to use the dashboard Select the time frame for expected data: By default, the last twelve months are selected (including the current month) Select if you want to see an historic of the data per month or the global volume of data: The required chart will be then displayed: To retrieve the tickets details of the data, click on the chart sections required. it will then display a second chart with the detailed origins: For this specific chart, you can then filter for a single origin by using the list: Then click one of the origins section will display the data details in a table: For the specific “Time view” chart, you will also have the possibility to filter for a single product in order to refine the analysis:",
        href: "Support-Proactive-vs.-Reactive-V2.html",
        title: "Support-Proactive-vs.-Reactive-V2"
    }
];

async function initSearchIndex() {
    try {
        pagesIndex = JSON;
        searchIndex = lunr(function () {
            this.field("title");
            this.field("categories");
            this.field("content");
            this.ref("href");
            pagesIndex.forEach((page) => this.add(page));
        });
    } catch (e) {
        console.log(e);
    }
}

function searchBoxFocused() {
    document.querySelector(".search-container").classList.add("focused");
    document
        .getElementById("search")
        .addEventListener("focusout", () => searchBoxFocusOut());
}

function searchBoxFocusOut() {
    document.querySelector(".search-container").classList.remove("focused");
}

function handleSearchQuery(event) {
    event.preventDefault();
    const query = document.getElementById("search").value.trim().toLowerCase();
    if (!query) {
        displayErrorMessage("Please enter a search term");
        return;
    }
    const results = searchSite(query);
    if (!results.length) {
        displayErrorMessage("Your search returned no results");
        return;
    }
    renderSearchResults(query, results);
}

function displayErrorMessage(message) {
    document.querySelector(".search-error-message").innerHTML = message;
    document.querySelector(".search-container").classList.remove("focused");
    document.querySelector(".search-error").classList.remove("hide-element");
    document.querySelector(".search-error").classList.add("fade");
}

function searchSite(query) {
    const originalQuery = query;
    query = getLunrSearchQuery(query);
    let results = getSearchResults(query);
    return results.length
        ? results
        : query !== originalQuery
            ? getSearchResults(originalQuery)
            : [];
}

function getSearchResults(query) {
    return searchIndex.search(query).flatMap((hit) => {
        if (hit.ref == "undefined") return [];
        let pageMatch = pagesIndex.filter((page) => page.href === hit.ref)[0];
        pageMatch.score = hit.score;
        return [pageMatch];
    });
}

function getLunrSearchQuery(query) {
    const searchTerms = query.split(" ");
    if (searchTerms.length === 1) {
        return query;
    }
    query = "";
    for (const term of searchTerms) {
        query += `+${term} `;
    }
    return query.trim();
}

function renderSearchResults(query, results) {
    clearSearchResults();
    updateSearchResults(query, results);
    scrollToTop();
}

function clearSearchResults() {
    const results = document.querySelector(".search-results ul");
    while (results.firstChild) results.removeChild(results.firstChild);
}

function updateSearchResults(query, results) {

    document.querySelector(".search-results ul").innerHTML = results
        .map(
            (hit) => `<li class="search-result-item" data-score="${hit.score.toFixed(2)}"><a href="${hit.href}" class="search-result-page-title">${hit.title}</a></li>`).join("");
}

function showSearchResults() {
    document.querySelector(".primary").classList.add("hide-element");
    document.querySelector(".search-results").classList.remove("hide-element");
    document.getElementById("site-search").classList.add("expanded");
}

function scrollToTop() {
    const toTopInterval = setInterval(function () {
        const supportedScrollTop = document.body.scrollTop > 0 ? document.body : document.documentElement;
        if (supportedScrollTop.scrollTop > 0) {
            supportedScrollTop.scrollTop = supportedScrollTop.scrollTop - 50;
        }
        if (supportedScrollTop.scrollTop < 1) {
            clearInterval(toTopInterval);
        }
    }, 10);
}

function handleClearSearchButtonClicked() {
    hideSearchResults();
    clearSearchResults();
    document.getElementById("search").value = "";
}

function hideSearchResults() {
    document.getElementById("site-search").classList.remove("expanded");
    document.querySelector(".search-results").classList.add("hide-element");
    document.querySelector(".primary").classList.remove("hide-element");
}

initSearchIndex();
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("search-form") != null) {
        const searchInput = document.getElementById("search");
        searchInput.addEventListener("focus", () => searchBoxFocused());
        searchInput.addEventListener("keydown", (event) => {
            if (event.keyCode == 13) handleSearchQuery(event);
        });
        document
            .querySelector(".search-error");
    }
    document
        .querySelectorAll(".clear-search-results")
        .forEach((button) =>
            button.addEventListener("click", () => handleClearSearchButtonClicked())
        );
});


