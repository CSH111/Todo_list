"use strict";

const toDoForm = document.body.querySelector("form#toDoForm");
const textInput = document.body.querySelector("form#toDoForm #textInput");
const submitBtn = document.body.querySelector("form#toDoForm #submitBtn");
const lis = document.querySelector("#toDoList").childNodes;
//
let toDoArray = [];
let strikedArray = [];

textInput.focus();
textInput.onkeyup = () => {
  if (textInput.value.trim() != "") {
    submitBtn.classList.add("active");
  } else {
    submitBtn.classList.remove("active");
  }
};

toDoForm.addEventListener("submit", toDoSubmit);

if (localStorage.getItem("toDoDB") !== null) {
  const listData = JSON.parse(localStorage.getItem("toDoDB"));
  listData.forEach(paintToDo);
  toDoArray = listData;
  const strikedData = JSON.parse(localStorage.getItem("striked"));
  strikedArray = strikedData;

  for (let i = 0; i < lis.length; i++) {
    if (strikedArray.includes(lis[i].firstChild.id)) {
      lis[i].firstChild.lastChild.classList.add("strike");
    }
  }
} else {
  arrToLocal(); //빈 array
  strikeArrToLocal(); //빈 array
}
updateRestCount();
handledelAllBtn();

const delAllBtn = document.querySelector("#delAllBtn");
delAllBtn.addEventListener("click", delAll);

function delAll(event) {
  event.preventDefault;
  const ul = document.querySelector("#toDoList");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  localStorage.clear();
  toDoArray = [];
  strikedArray = [];
  arrToLocal(); //빈 array
  strikeArrToLocal(); //빈 array
  updateRestCount();
}

function handledelAllBtn() {
  const delAllBtn = document.querySelector("#delAllBtn");
  if (lis.length < 2) {
    ////////////////////////
    delAllBtn.classList.add("hidden");
  } else {
    delAllBtn.classList.remove("hidden");
  }
}
function paintToDo(toDoObj) {
  const toDoList = document.body.querySelector("#toDoList");
  const li = document.createElement("li");
  const div = document.createElement("div");
  makeStrikeBtn(div);
  objToLi(div, toDoObj);
  li.appendChild(div);
  makeDelBtn(li);

  toDoList.appendChild(li);

  textInput.value = "";
}

function toDoSubmit(event) {
  event.preventDefault();
  if (textInput.value.trim() != "") {
    const toDoObj = { text: textInput.value, id: Date.now() };
    toDoArray.push(toDoObj);
    arrToLocal();
    paintToDo(toDoObj);
    updateRestCount();

    const ul = document.body.querySelector("#toDoList");
    ul.scrollTo({
      top: ul.scrollHeight,
      behavior: "smooth",
    });
  }
  handledelAllBtn();
}
function arrToLocal() {
  localStorage.setItem("toDoDB", JSON.stringify(toDoArray));
}
function strikeArrToLocal() {
  localStorage.setItem("striked", JSON.stringify(strikedArray));
}

function makeStrikeBtn(li) {
  const strikeBtn = document.createElement("button");
  li.appendChild(strikeBtn);
  strikeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  strikeBtn.addEventListener("click", strike);
}
function filterStrikeArr(id) {
  strikedArray = strikedArray.filter((element) => element != id);
}

function strike(event) {
  const id = event.target.parentElement.id;
  const classList = event.target.nextSibling.classList;
  classList.toggle("strike");

  if (classList.contains("strike") == true) {
    strikedArray.push(id);
  } else {
    filterStrikeArr(id);
  }
  strikeArrToLocal();
  updateRestCount();
}

function makeDelBtn(li) {
  const delBtn = document.createElement("button");
  li.appendChild(delBtn);
  delBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  delBtn.addEventListener("click", deleteToDo);
}
function deleteToDo(event) {
  const li = event.target.parentElement;
  toDoArray = toDoArray.filter((item) => item.id != li.firstChild.id);
  li.remove();
  arrToLocal();
  filterStrikeArr(li.firstChild.id);
  strikeArrToLocal();
  updateRestCount();
  handledelAllBtn();
}
function objToLi(div, toDoObj) {
  const span = document.createElement("span");
  div.id = toDoObj.id; //수정할곳
  div.appendChild(span);
  span.innerText = toDoObj.text;
}

function updateRestCount() {
  const toDoDBCount = JSON.parse(localStorage.getItem("toDoDB")).length;
  const rest = document.querySelector("#restCount");
  const checkedDBCount = JSON.parse(localStorage.getItem("striked")).length;

  if (toDoDBCount - checkedDBCount !== 0) {
    rest.innerText = toDoDBCount - checkedDBCount + "개의 할 일이 있습니다";
  } else {
    rest.innerText = "할 일이 없습니다.";
  }
}

// createElement로 블록형식 요소에 여러 자식요소 추가할때 특이한점..
// 1. 인라인 요소 + innertext 순서=> 인라인 요소 추가 안됨
// -> innertext에 span 사용하면 된다.
// 2. innertext + 인라인요소 순서 => 인라인요소 추가됨

//어레이요소 포함 확인 => includes (JS)
//클래스리스트 포함 확인  => contains (API)
//API 돔 JS 등 큰 틀에서의 명확한 개념공부가 필요해보인다....

///추가하고싶은 기능////
//클리어 올, 클리어 취소선// hover이용 x버튼 색깔표시

//문제!!  버튼내부에 태그가 들어가면 클릭 이벤트 오류남  ==> 클릭이벤트시 부모자식 형제 요소 선택 이 달리지기 때문!
// css 에서 pointer-events: none; 으로 오류 해결   ★★★★★★★★★★★★★

// jS 의 firstChild: 자식요소중 첫번째
// css의 first-child: 형제요소중 첫번째
