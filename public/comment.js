document.addEventListener('DOMContentLoaded', () => {
  const USERID = {
      name: null,
      identity: null,
      image: null,
      message: null,
      date: null
  };

  const userComment = document.querySelector(".usercomment");
  const publishBtn = document.querySelector("#publish");
  const comments = document.querySelector(".comments");
  const userName = document.querySelector(".user");
  const notify = document.querySelector(".notifyinput");

  // Load existing comments
  fetch('/comments')
      .then(response => response.json())
      .then(data => {
          data.forEach(comment => {
              displayComment(comment);
          });
          document.getElementById("comment-count").textContent = data.length;
      });

  userComment.addEventListener("input", e => {
      if (!userComment.value) {
          publishBtn.setAttribute("disabled", "disabled");
          publishBtn.classList.remove("abled");
      } else {
          publishBtn.removeAttribute("disabled");
          publishBtn.classList.add("abled");
      }
  });

  function displayComment(comment) {
      const published = 
          `<div class="parents">
              <img src="${comment.identity ? 'user.png' : 'public/images/anonymous.png'}">
              <div>
                  <h1>${comment.name}</h1>
                  <p>${comment.message}</p>
                  <div class="engagements"><img src="public/images/like.png" id="like"><img src="public/images/share.png" alt=""></div>
                  <span class="date">${new Date(comment.date).toLocaleString()}</span>
              </div>
          </div>`;
      comments.innerHTML += published;
  }

  function addPost() {
      if (!userComment.value) return;
      USERID.name = userName.value;
      USERID.identity = USERID.name !== "Anonymous";
      USERID.message = userComment.value;
      USERID.date = new Date().toISOString();

      const newComment = {
          name: USERID.name,
          message: USERID.message,
          date: USERID.date
      };

      fetch('/comments', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newComment)
      })
      .then(response => response.json())
      .then(comment => {
          displayComment(comment);
          let commentsNum = document.querySelectorAll(".parents").length;
          document.getElementById("comment-count").textContent = commentsNum;
      });

      userComment.value = "";
      publishBtn.classList.remove("abled");
      publishBtn.setAttribute("disabled", "disabled");
  }

  publishBtn.addEventListener("click", addPost);
});
