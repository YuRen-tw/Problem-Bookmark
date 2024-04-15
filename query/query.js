import SearchSuggestions from "../scripts/searchSuggestions.js"

// getting all required elements
const Storage = chrome.storage.local;

// 0 = 未排序，1 = 升序，2 = 降序
var sort_difficulty = 0;

function renderProblemList(problems) {
    const problemList = document.querySelector("#problem tbody");

    // 清空題目渲染區
    problemList.innerHTML = "";
    
    // 取得每一筆題目的資料，並且渲染上去
    for (const url of Object.keys(problems)) {
        let {name, difficulty, tags, comment} = problems[url];

        // 將難度表轉換成星星
        difficulty = parseInt(difficulty);
        let difficulty_star = "<i class=\"fas fa-star\"></i>".repeat(difficulty)+"<i class=\"far fa-star\"></i>".repeat(5-difficulty);

        // 將 tags 拆開成 <p>
        let tag_element = "";
        for (let x of tags){
            tag_element += `<p class="tag">${x}</p>`;
        }

        const rowHTML = `
        <tr>
            <td><a href=${url}>${name}</a></td>
            <td>${difficulty_star}</td>
            <td>${tag_element}</td>
            <td>${comment}</td>
        </tr>`;
        problemList.innerHTML += rowHTML;
    }
}

// 讀取題目資料
Storage.get(["problems"]).then((result) => {
    
    // template for query result
    const resultTemplate = {
        "problems": {
            "url": {
                name: "name",
                difficulty: "Easy",
                tags: ["tag1", "tag2"],
                note: "note"
            }
        }
    }

    console.log(result.problems);
    
    // 如果沒有資料就丟空字典
    if (!result.problems)
        result.problems = {};

    const searchSuggestions = new SearchSuggestions({
        allData: [...new Set(Object.values(result.problems).flatMap((problemData) => problemData.tags))],
        inputElement: document.querySelector("#search-input"),
        listElement: document.querySelector("#suggestions-list"),
        suggestionsLimit: 3,
        selectCallback: () => {}
    });

    renderProblemList(result.problems);
});

const difficultyButton = document.getElementById("difficulty");
const difficultyButtonIcon = document.getElementById("sorting");
var difficultyIcon = ["fas fa-sort", "fas fa-sort-down", "fas fa-sort-up"];
difficultyButton.onclick = function () {
    sort_difficulty = (sort_difficulty+1)%3;
    difficultyButtonIcon.setAttribute("class", difficultyIcon[sort_difficulty]);
};