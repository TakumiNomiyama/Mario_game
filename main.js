const inputElement = document.getElementById("input-todo");
const container = document.getElementById("cards-container");
const addButton = document.getElementById("add-button");

addButton.onclick = function () {
  const text = inputElement.value;

  const card = document.createElement("div");
  card.className = "card";

  const todo = document.createElement("div");
  todo.className = "todo";
  todo.textContent = text;

  card.append(todo);

  container.append(card);

  inputElement.value = "";
};
