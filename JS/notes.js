const uploadNotesBtn = document.querySelector('.upload-note-btn');
const uploadModal = document.getElementById('uploadModal');
const closeUpload = document.getElementById('closeUpload');
const notesGrid = document.getElementById('notesGrid');
const uploadForm = document.getElementById("uploadForm");
const titleInput = document.getElementById("title");
const subjectInput = document.getElementById("subject");
const semesterInput = document.getElementById("semester");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const pdfInput = document.getElementById("pdf");
const logoutBtn =document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const semesterFilter = document.getElementById("semesterFilter");
const subjectFilter = document.getElementById("subjectFilter");

const token = localStorage.getItem("token");

if (!token) {
    window.location.href =
        "login_signup.html?mode=login";
}

let allNotes = [];

const currentUserId = localStorage.getItem("userId");


logoutBtn.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm("Logout?");

        console.log("Logout confirmed:", confirmed);

        if (confirmed) {
            localStorage.clear();
            window.location.href =
                "login_signup.html?mode=login";
        }


    }
);

uploadNotesBtn.addEventListener('click', () => {
    uploadModal.style.display = 'flex';
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

if (mode === "upload") {
    uploadModal.style.display = 'flex';
}

closeUpload.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

uploadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first");

            return;

        }

        const formData = new FormData();

        formData.append(
            "title",
            titleInput.value
        );

        formData.append(
            "subject",
            subjectInput.value
        );

        formData.append(
            "semester",
            semesterInput.value
        );

        formData.append(
            "description",
            descriptionInput.value
        );

        formData.append(
            "price",
            priceInput.value
        );

        if (pdfInput.files.length > 0) {

            formData.append(
                "pdf",
                pdfInput.files[0]
            );

        }

        const response = await fetch(
            "http://localhost:5000/api/notes",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message
            );

        }

        uploadModal.style.display = "none";

        uploadForm.reset();

        await fetchNotes();

        alert(
            "Note uploaded successfully"
        );

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

function renderNotes(notes) {
    if (notes.length === 0) {

        notesGrid.innerHTML = `
            <p class="error-message">
                No notes found.
            </p>
        `;

        return;
    }

    let cardsHTML = "";

    notes.forEach(note => {

        cardsHTML += `
        
        <div class="note-card">

            <div class="note-top">
                <span class="tag">PDF</span>
            </div>

            <h3>${note.title}</h3>

            <p class="meta">
                ${note.subject} • Semester ${note.semester}
            </p>

            <p class="description">
                ${note.description || "No description available"}
            </p>

            <div class="note-stats">
                <span>
                    👤 ${note.uploader?.name || "Unknown"}
                </span>
            </div>

            <div class="note-footer">

                <span class="price">
                    ₹${note.price}
                </span>

                <div class="card-actions">

                    <button
                        class="buy-btn"
                        data-file="${note.pdfFile || ""}"
                    >
                        View
                    </button>

                    

                    ${
                        note.uploader?._id === currentUserId

                        ?

                        `
                        <button
                            class="delete-btn"
                            data-id="${note._id}"
                        >
                            Delete
                        </button>
                        `

                        :

                        ""
                    }

                </div>

            </div>

        </div>
        `;
    });

    notesGrid.innerHTML = cardsHTML;

    attachDeleteListeners();
    attachViewListeners();
}

function attachDeleteListeners() {

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const confirmed =
                        confirm(
                            "Delete this note?"
                        );

                    if (!confirmed) return;

                    try {

                        const token =
                            localStorage.getItem(
                                "token"
                            );

                        const noteId =
                            button.dataset.id;

                        const response =
                            await fetch(
                                `http://localhost:5000/api/notes/${noteId}`,
                                {
                                    method: "DELETE",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            );

                        const data =
                            await response.json();

                        if (!response.ok) {

                            throw new Error(
                                data.message
                            );

                        }

                        fetchNotes();

                    } catch (error) {

                        console.error(error);

                        alert(
                            error.message
                        );

                    }

                }
            );

        });

}

function attachViewListeners() {

    document
        .querySelectorAll(".buy-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const file =
                        button.dataset.file;

                    if (!file) {

                        alert(
                            "PDF not uploaded yet"
                        );

                        return;

                    }

                    window.open(
                        `http://localhost:5000/uploads/${file}`,
                        "_blank"
                    );

                }
            );

        });

}

function populateSubjectFilter() {

    const subjects = [
        ...new Set(
            allNotes.map(
                note => note.subject
            )
        )
    ];

    subjectFilter.innerHTML = `
        <option value="all">
            All Subjects
        </option>
    `;

    subjects.forEach(subject => {

        subjectFilter.innerHTML += `
            <option value="${subject}">
                ${subject}
            </option>
        `;

    });

}

async function fetchNotes() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/notes"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to fetch notes"
            );

        }

        allNotes = await response.json();

        populateSubjectFilter();

        renderNotes(allNotes);

        
    } catch (error) {

        console.error(error);

        notesGrid.innerHTML = `
            <p class="error-message">
                Failed to load notes.
            </p>
        `;

    }

}

searchInput.addEventListener(
    "input",
    applyFilters
);

semesterFilter.addEventListener(
    "change",
    applyFilters
);

subjectFilter.addEventListener(
    "change",
    applyFilters
);

function applyFilters() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const semesterValue =
        semesterFilter.value;

    const subjectValue =
        subjectFilter.value;

    const filteredNotes =
        allNotes.filter(note => {

            const matchesSearch =

                note.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                note.subject
                    .toLowerCase()
                    .includes(searchText);

            const matchesSemester =

                semesterValue === "all"

                ||

                note.semester.toString()
                    === semesterValue;

            const matchesSubject =

                subjectValue === "all"

                ||

                note.subject
                    === subjectValue;

            return (

                matchesSearch &&

                matchesSemester &&

                matchesSubject

            );

        });

    renderNotes(filteredNotes);

}

fetchNotes();