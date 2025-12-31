document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     LEARNER / CONTRIBUTOR
  ======================== */

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
          <div class="step-logo passive-logo">
            <i class="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div class="step-data">Earn money per download.</div>
          <div class="step-title">Earn Money</div>
        </div>
      `;
    }

    function loadLearnerSteps() {
      stepBox.innerHTML = `
        <div class="step-card">
          <div class="step-logo"><i class="fa-solid fa-magnifying-glass"></i></div>
          <div class="step-data">Find notes by subject, semester, or college.</div>
          <div class="step-title">Browse Notes</div>
        </div>

        <div class="step-card">
          <div class="step-logo"><i class="fa-solid fa-book-open"></i></div>
          <div class="step-data">Preview details and choose what fits you.</div>
          <div class="step-title">Choose a Note</div>
        </div>

        <div class="step-card">
          <div class="step-logo"><i class="fa-solid fa-credit-card"></i></div>
          <div class="step-data">Pay once. No subscriptions.</div>
          <div class="step-title">Pay Once</div>
        </div>

        <div class="step-card">
          <div class="step-logo"><i class="fa-solid fa-cloud-arrow-down"></i></div>
          <div class="step-data">Instant access after purchase.</div>
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
          <p class="upload">Upload <i class="fa-solid fa-upload"></i></p>
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

  /* =======================
        FAQ (DELEGATION)
  ======================== */

  document.addEventListener("click", (e) => {
    const question = e.target.closest(".faq-question");
    if (!question) return;

    const item = question.closest(".faq-item");
    if (!item) return;

    document.querySelectorAll(".faq-item")
      .forEach(i => i.classList.remove("active"));

    item.classList.add("active");
  });

  /* =======================
        NAV LINKS
  ======================== */

  document.querySelector('.nav-item.login')?.addEventListener('click', () => {
    window.location.href = '../PAGES/login_signup.html?mode=login';
  });

  document.querySelector('.signup-btn')?.addEventListener('click', () => {
    window.location.href = '../PAGES/login_signup.html?mode=signup';
  });

  /* =======================
        HAMBURGER
  ======================== */

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger?.addEventListener("click", () => {
    mobileMenu.style.display =
      mobileMenu.style.display === "flex" ? "none" : "flex";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileMenu) {
      mobileMenu.style.display = "none";
    }
  });

  /* =======================
        HERO CTA
  ======================== */

  document.querySelector('.primary-CTA')?.addEventListener('click', () => {
    window.location.href = '../PAGES/notes.html';
  });

  /* =======================
      RESULT BOX ACTIONS
  ======================== */

  resultBox?.addEventListener('click', (e) => {
    if (e.target.closest('.browse')) {
      window.location.href = '../PAGES/notes.html';
    }

    if (e.target.closest('.upload')) {
      window.location.href = '../PAGES/notes.html?mode=upload';
    }
  });

  /* =======================
        UPLOAD MODAL
  ======================== */

  const uploadBtn = document.querySelector('.secondary-CTA');
  const uploadModal = document.getElementById('uploadModal');
  const closeUpload = document.getElementById('closeUpload');

  uploadBtn?.addEventListener('click', () => {
    window.location.href = "../PAGES/notes.html?mode=upload";
    uploadModal.style.display = 'flex';
    console.log('Upload Modal Opened');
  });

  closeUpload?.addEventListener('click', () => {
    uploadModal.style.display = 'none';
  });

  uploadModal?.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
      uploadModal.style.display = 'none';
    }
  });

  /* =======================
     FILE INPUT (FIXED)
     EVENT DELEGATION
  ======================== */

  document.addEventListener('change', (e) => {
    if (e.target.id === 'pdfUpload') {
      const fileName = e.target
        .closest('.file-upload-box')
        ?.querySelector('.file-name');
        console.log(fileName);

      if (!fileName) return;

      fileName.textContent = e.target.files.length
        ? e.target.files[0].name
        : 'No file selected';
    }
  });

  const sellNotesNav = document.querySelector('.nav-item.sell-notes');  
  sellNotesNav.addEventListener('click', () => {
    loadContributerSteps();
    learnerButton.classList.remove('active');
    contributorButton.classList.add('active');
    window.location.href = '#working';
  });

});
