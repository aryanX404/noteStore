const uploadNotesBtn = document.querySelector('.upload-note-btn');

uploadNotesBtn.addEventListener('click', () => {
  uploadModal.style.display = 'flex';
});
const uploadModal = document.getElementById('uploadModal');
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

if (mode == "upload") {
    uploadModal.style.display = 'flex';
};

closeUpload.addEventListener('click', () => {
      uploadModal.style.display = 'none';
    });