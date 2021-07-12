const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const arrayBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let array = ["Support-On-Air-Desk-V1", "Support-Proactive-vs.-Reactive-V2"];

let linkTag = searchWrapper.querySelector("a");
let linkPages;


inputBox.onkeyup = (e) => {
    let userData = e.target.value;
    let emptyArray = [];
    if (userData) {
        arrayBox.onclick = () => {
            linkPages = `pages/${userData}`;
            linkTag.setAttribute("href", linkPages);
            linkTag.click();
        }
        emptyArray = array.filter((data) => {

            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            return data = `<li>${data}</li>`;
        });
        searchWrapper.classList.add("active");
        showArray(emptyArray);
        let allList = arrayBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        searchWrapper.classList.remove("active");
    }
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;
    arrayBox.onclick = () => {
        linkPages = `pages/${selectData}.html`;
        linkTag.setAttribute("href", linkPages);
        linkTag.click();
    }
    searchWrapper.classList.remove("active");
}

function showArray(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join('');
    }
    arrayBox.innerHTML = listData;
}
