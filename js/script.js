function search_articles() {
    const input = document.getElementById('input');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("selection");
    const li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


let x = 0
function countLike() {
    x = x + 1;
    document.getElementById('like').innerHTML = x;
}

let y = 0
function countDislike() {
    y = y + 1;
    document.getElementById('dislike').innerHTML = y;
}