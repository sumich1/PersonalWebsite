(() => {
  const storageKey = "abdullah-homepage-comments";
  const form = document.querySelector("#comment-form");
  const nameInput = document.querySelector("#comment-name");
  const messageInput = document.querySelector("#comment-message");
  const status = document.querySelector("#comment-status");
  const list = document.querySelector("#comment-list");

  if (!form || !nameInput || !messageInput || !status || !list) {
    return;
  }

  const getComments = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  };

  const saveComments = (comments) => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  };

  const createCommentId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const renderComments = () => {
    const comments = getComments();
    list.replaceChildren();

    if (!comments.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No comments yet. Be the first to say hello!";
      list.append(emptyMessage);
      return;
    }

    comments.forEach((comment) => {
      const card = document.createElement("article");
      card.className = "comment-card";

      const header = document.createElement("header");
      const author = document.createElement("h3");
      author.textContent = comment.name;

      const date = document.createElement("time");
      date.className = "comment-date";
      date.dateTime = comment.createdAt;
      date.textContent = new Date(comment.createdAt).toLocaleString();
      header.append(author, date);

      const message = document.createElement("p");
      message.textContent = comment.message;

      const deleteButton = document.createElement("button");
      deleteButton.className = "comment-delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        saveComments(getComments().filter((item) => item.id !== comment.id));
        renderComments();
      });

      card.append(header, message, deleteButton);
      list.append(card);
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      status.textContent = "Please enter your name and a comment.";
      return;
    }

    const comments = getComments();
    comments.unshift({
      id: createCommentId(),
      name,
      message,
      createdAt: new Date().toISOString(),
    });
    saveComments(comments);
    form.reset();
    status.textContent = "Your comment was posted.";
    renderComments();
  });

  renderComments();
})();
