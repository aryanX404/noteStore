document.addEventListener("DOMContentLoaded", () => {

  const learnerButton = document.getElementById('learner-btn');
  const contributorButton = document.getElementById('contributor-btn');
  const stepBox = document.querySelector('.step-box');
  const resultBox = document.querySelector('.result');

  if (learnerButton && contributorButton && stepBox && resultBox) {

    function loadContributerSteps() {
    stepBox.innerHTML = `
      <div class="step-card">
        <div class="step-logo"><i class="fa-solid fa-cloud-arrow-up"></i></div>
        <div class="step-data">Share your notes in PDF format.</div>
        <div class="step-title">Upload Notes</div>
      </div>

      <div class="step-card">
        <div class="step-logo"><i class="fa-solid fa-tag"></i></div>
        <div class="step-data">Set a fair price for your notes.</div>
        <div class="step-title">Set Your Price</div>
      </div>

      <div class="step-card">
        <div class="step-logo"><i class="fa-solid fa-download"></i></div>
        <div class="step-data">Students download your notes.</div>
        <div class="step-title">Get Downloads</div>
      </div>

      <div class="step-card">
        <div class="step-logo passive-logo"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        <div class="step-data">Earn money per download.</div>
        <div class="step-title">Earn Money</div>
      </div>
    `;
  }

    function loadLearnerSteps() {
    stepBox.innerHTML = `
        <div class="step-card">
        <div class="step-logo">
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="step-data">
            Find notes by subject, semester, or college in a few clicks.
        </div>
        <div class="step-title">Browse Notes</div>
        </div>

        <div class="step-card">
        <div class="step-logo">
            <i class="fa-solid fa-book-open"></i>
        </div>
        <div class="step-data">
            Preview details and select the notes that match your needs.
        </div>
        <div class="step-title">Choose a Note</div>
        </div>

        <div class="step-card">
        <div class="step-logo">
            <i class="fa-solid fa-credit-card"></i>
        </div>
        <div class="step-data">
            Make a one-time payment. No subscriptions or hidden charges.
        </div>
        <div class="step-title">Pay Once</div>
        </div>

        <div class="step-card">
        <div class="step-logo">
            <i class="fa-solid fa-cloud-arrow-down"></i>
        </div>
        <div class="step-data">
            Access your notes instantly and study at your own pace.
        </div>
        <div class="step-title">Download Notes</div>
        </div>
    `;
    }


    function loadResultBox() {
      if (learnerButton.classList.contains('active')) {
        resultBox.innerHTML = `
          <p class="outcome">Instant access • One-time payment • No subscriptions</p>
          <p class="browse">Browse <i class="fa-solid fa-arrow-up-right-from-square"></i></p>
        `;
      } else {
        resultBox.innerHTML = `
          <p class="outcome">Earn per download • Full control • Monthly payouts</p>
          <p class="browse">Upload <i class="fa-solid fa-upload"></i></p>
        `;
      }
    }

    learnerButton.addEventListener('click', () => {
      learnerButton.classList.add('active');
      contributorButton.classList.remove('active');
      loadLearnerSteps();
      loadResultBox();
    });

    contributorButton.addEventListener('click', () => {
      contributorButton.classList.add('active');
      learnerButton.classList.remove('active');
      loadContributerSteps();
      loadResultBox();
    });
  }

  /* FAQ — EVENT DELEGATION */
  document.addEventListener("click", (e) => {
    const question = e.target.closest(".faq-question");
    if (!question) return;

    const item = question.closest(".faq-item");
    if (!item) return;

    const allItems = document.querySelectorAll(".faq-item");
    const isActive = item.classList.contains("active");

    allItems.forEach(i => i.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });

});
