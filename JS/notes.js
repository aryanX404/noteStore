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
const modalTitle =document.getElementById("modalTitle");
const submitBtn =document.getElementById("submitBtn");
const allNotesBtn =document.getElementById("allNotesBtn");
const myNotesBtn =document.getElementById("myNotesBtn");
const welcomeUser = document.getElementById("welcomeUser");
const uploadCount =document.getElementById("uploadCount");
const totalViews =document.getElementById("totalViews");
const averageViews =document.getElementById("averageViews");
const earnings =document.getElementById("earnings");

let showMyNotes = false;

const token = localStorage.getItem("token");
const currentUserName =
    localStorage.getItem(
        "userName"
    );

if (
    currentUserName &&
    welcomeUser
) {

    welcomeUser.textContent =
        `Welcome, ${currentUserName} 👋`;

}

if (!token) {
    window.location.href =
        "login_signup.html?mode=login";
}

let allNotes = [];
let editingNoteId = null;

const currentUserId = localStorage.getItem("userId");

allNotesBtn.addEventListener(
    "click",
    () => {

        showMyNotes = false;

        allNotesBtn.classList.add(
            "active"
        );

        myNotesBtn.classList.remove(
            "active"
        );

        applyFilters();

    }
);

myNotesBtn.addEventListener(
    "click",
    () => {

        showMyNotes = true;

        myNotesBtn.classList.add(
            "active"
        );

        allNotesBtn.classList.remove(
            "active"
        );

        applyFilters();

    }
);

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
    editingNoteId = null;

    uploadForm.reset();

    modalTitle.textContent =
        "Upload Notes";

    submitBtn.textContent =
        "Upload Notes";
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

        let url =
            "http://localhost:5000/api/notes";

        let method = "POST";

        if (editingNoteId) {

            url =
                `http://localhost:5000/api/notes/${editingNoteId}`;

            method = "PUT";

        }

        const response = await fetch(
            url,
            {
                method,

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

        
        editingNoteId = null;
        uploadForm.reset();

        modalTitle.textContent =
            "Upload Notes";

        submitBtn.textContent =
            "Upload Notes";

        await fetchNotes();

        alert(
            method === "POST"
                ? "Note uploaded successfully"
                : "Note updated successfully"
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
                <span>
                    👁️ ${note.views || 0}
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
                        data-id="${note._id}"
                    >
                        View
                    </button>

                    

                    ${
                        note.uploader?._id === currentUserId

                        ?

                        `
                        <button
                            class="edit-btn"
                            data-id="${note._id}"
                        >
                            Edit
                        </button>
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
    attachEditListeners();
}

function updateDashboard() {

    const myNotes =
        allNotes.filter(
            note =>
                note.uploader?._id ===
                currentUserId
        );

    uploadCount.textContent =
        myNotes.length;

    const views =
        myNotes.reduce(
            (total, note) =>
                total +
                (note.views || 0),
            0
        );

    totalViews.textContent =
        views;

    const avgViews =
        myNotes.length > 0
            ? (
                views /
                myNotes.length
            ).toFixed(1)
            : 0;

    averageViews.textContent =
        avgViews;

    const totalEarnings =
        myNotes.reduce(
            (total, note) =>
                total +
                (
                    (note.views || 0)
                    *
                    (note.price || 0)
                ),
            0
        );

    earnings.textContent =
        `₹${totalEarnings}`;

}

function attachEditListeners() {

    document
        .querySelectorAll(".edit-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const noteId =
                        button.dataset.id;

                    const note =
                        allNotes.find(
                            n =>
                                n._id === noteId
                        );

                    if (!note) return;

                    editingNoteId =
                        note._id;

                    console.log("Changing button text");

                    modalTitle.textContent =
                        "Update Note";

                    submitBtn.textContent =
                        "Update Note";

                    titleInput.value =
                        note.title;

                    subjectInput.value =
                        note.subject;

                    semesterInput.value =
                        note.semester;

                    descriptionInput.value =
                        note.description;

                    priceInput.value =
                        note.price;

                    uploadModal.style.display =
                        "flex";

                }
            );

        });

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
                async () => {

                    const file =
                        button.dataset.file;

                    if (!file) {

                        alert(
                            "PDF not uploaded yet"
                        );

                        return;

                    }

                    await fetch(
                        `http://localhost:5000/api/notes/${button.dataset.id}/view`,
                        {
                            method: "PUT"
                        }
                    );

                    await fetchNotes();

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
        updateDashboard();

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

    let filteredNotes =
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

    if (showMyNotes) {
        filteredNotes =
            filteredNotes.filter(
                note =>
                    note.uploader?._id ===
                    currentUserId
            );
    }

    renderNotes(filteredNotes);

}

fetchNotes();