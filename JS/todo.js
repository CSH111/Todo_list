// "use strict";

const toDoForm = document.body.querySelector("form#toDoForm");
const textInput = document.body.querySelector("form#toDoForm #textInput");
const submitBtn = document.body.querySelector("form#toDoForm #submitBtn");

function arrToLocal() {
  localStorage.setItem("toDoDB", JSON.stringify(toDoArray));
}

function strike(event) {
  event.target.nextSibling.classList.toggle("strike");
}

function deleteToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDoArray = toDoArray.filter((item) => item.id != li.id);
  arrToLocal();
}

let toDoArray = [];

function paintToDo(xx) {
  const toDoList = document.body.querySelector("#toDoList");
  const li = document.createElement("li");
  const strikeBtn = document.createElement("button");
  const delBtn = document.createElement("button");
  const span = document.createElement("span");
  // li.appendChild(strikeBtn);
  // strikeBtn.innerText = "v";
  // strikeBtn.addEventListener("click", strike);
  li.id = xx.id;
  li.appendChild(span);
  span.innerText = xx.text;
  li.appendChild(delBtn);
  delBtn.innerText = "X";
  delBtn.addEventListener("click", deleteToDo);
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

if (localStorage.getItem("toDoDB") != null) {
  const listData2 = JSON.parse(localStorage.toDoDB);
  const listData = JSON.parse(localStorage.getItem("toDoDB"));
  console.log(listData2);
  console.log(listData);

  listData2.forEach(paintToDo);
  toDoArray = listData2;
}

// 우선 싹다 하나의 어레이, 로컬로.. 스트라이크 버튼 입력시 이동

// createElement로 블록형식 요소에 여러 자식요소 추가할때 특이한점..
// 1. 인라인 요소 + innertext 순서=> 인라인 요소 추가 안됨
// -> innertext에 span 사용하면 된다.
// 2. innertext + 인라인요소 순서 => 인라인요소 추가됨
