// "use strict";

const toDoForm = document.body.querySelector("form#toDoForm");
const textInput = document.body.querySelector("form#toDoForm #textInput");
const submitBtn = document.body.querySelector("form#toDoForm #submitBtn");
let toDoArray = [];
let strikedArray = [];
function arrToLocal() {
  localStorage.setItem("toDoDB", JSON.stringify(toDoArray));
}
function strikeArrToLocal() {
  localStorage.setItem("striked", JSON.stringify(strikedArray));
}

function makeStrikeBtn(li) {
  const strikeBtn = document.createElement("button");
  li.appendChild(strikeBtn);
  strikeBtn.innerText = "v";
  strikeBtn.addEventListener("click", strike);
}
function filterStrikeArr(id) {
  strikedArray = strikedArray.filter((element) => element != id);
}

function strike(event) {
  const id = event.target.parentElement.id;
  const classList = event.target.nextSibling.classList;
  classList.toggle("strike");

  console.log(classList);
  console.log(typeof classList);

  if (classList.contains("strike") == true) {
    strikedArray.push(id);
  } else {
    filterStrikeArr(id);
  }

  strikeArrToLocal();
}

function makeDelBtn(li) {
  const delBtn = document.createElement("button");
  li.appendChild(delBtn);
  delBtn.innerText = "X";
  delBtn.addEventListener("click", deleteToDo);
}
function deleteToDo(event) {
  const li = event.target.parentElement;
  toDoArray = toDoArray.filter((item) => item.id != li.id);
  li.remove();
  arrToLocal();
  filterStrikeArr(li.id);
  strikeArrToLocal();
}
function objToLi(li, toDoObj) {
  const span = document.createElement("span");
  li.id = toDoObj.id;
  li.appendChild(span);
  span.innerText = toDoObj.text;
}

function paintToDo(toDoObj) {
  const toDoList = document.body.querySelector("#toDoList");
  const li = document.createElement("li");
  makeStrikeBtn(li);
  objToLi(li, toDoObj);
  makeDelBtn(li);
  toDoList.appendChild(li);
  textInput.value = "";
}

function toDoSubmit(event) {
  event.preventDefault();
  const toDoObj = { text: textInput.value, id: Date.now() };
  toDoArray.push(toDoObj);
  arrToLocal();
  paintToDo(toDoObj);
}

toDoForm.addEventListener("submit", toDoSubmit);

function checkStirke() {}

if (localStorage.getItem("toDoDB") != null) {
  // const listData2 = JSON.parse(localStorage.toDoDB);
  const listData = JSON.parse(localStorage.getItem("toDoDB"));
  listData.forEach(paintToDo);
  toDoArray = listData;
  const strikedData = JSON.parse(localStorage.getItem("striked"));
  strikedArray = strikedData;

  const ul = document.querySelector("#toDoList").childNodes;

  for (let i = 0; i < ul.length; i++) {
    if (strikedArray.includes(ul[i].id)) {
      ul[i].firstChild.nextSibling.classList.add("strike");
    }
  }
}

// createElement로 블록형식 요소에 여러 자식요소 추가할때 특이한점..
// 1. 인라인 요소 + innertext 순서=> 인라인 요소 추가 안됨
// -> innertext에 span 사용하면 된다.
// 2. innertext + 인라인요소 순서 => 인라인요소 추가됨

//어레이요소 포함 확인 => includes (JS)
//클래스리스트 포함 확인  => contains (API)
//API 돔 JS 등 큰 틀에서의 명확한 개념공부가 필요해보인다....
