"use strict";

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
});

function fetchQuotes() {
  fetch("http://localhost:3000/quotes")
    .then((res) => res.json())
    .then((json) => json.forEach((quote) => renderQuote(quote)));
}

const quoteList = document.querySelector("#quote-list");
function renderQuote(json) {
  console.log(json);
  const listContainer = document.createElement("li");
  const quote = document.createElement("h3");
  const author = document.createElement("p");
  const likes = document.createElement("p");
  const likeButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  let likesNum = 0;

  quote.innerText = json.quote;
  author.innerText = json.author;
  likes.innerText = `Likes: ${likesNum}`;
  likeButton.innerText = "Like";
  deleteButton.innerText = "Delete";

  likeButton.addEventListener("click", (e) => {
    console.log(e.target.previousSibling);
    console.log(likesNum++);
    e.target.previousSibling.innerText = `Likes: ${likesNum}`;
    let likeData = {
      quoteId: json.id,
      createdAt: new Date().toString(),
    };
    likePost(likeData);
  });

  deleteButton.addEventListener("click", (e) => {
    deleteQuote(e, json);
  });

  listContainer.append(quote, author, likes, likeButton, deleteButton);

  quoteList.append(listContainer);
}

function likePost(data) {
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

document.querySelector("#new-quote-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let data;
  uploadNewQuote(e);
  function uploadNewQuote(e) {
    data = {
      quote: e.target.quote.value,
      author: e.target.author.value,
    };
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
  renderQuote(data);
});

function deleteQuote(e, json) {
  e.target.parentNode.remove();
  fetch(`http://localhost:3000/quotes/${json.id}`, { method: "DELETE" });
}
