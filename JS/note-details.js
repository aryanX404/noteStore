const params =
    new URLSearchParams(
        window.location.search
    );

const noteId =
    params.get("id");

fetchNote();
let currentNote = null;

async function fetchNote() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/notes/${noteId}`
            );

        const note =
            await response.json();

        currentNote = note;

        document.getElementById(
            "noteContainer"
        ).innerHTML = `

        <div class="note-layout">

            <div class="note-main">

                <div class="hero-badge">
                    PDF NOTES
                </div>

                <h1 class="note-title">
                    ${note.title}
                </h1>

                <div class="note-meta">

                    <span class="note-badge">
                        ${note.subject}
                    </span>

                    <span class="note-badge">
                        Semester ${note.semester}
                    </span>

                    <span class="note-badge">
                        ₹${note.price}
                    </span>

                </div>

                <div class="note-description">

                    ${note.description}

                </div>

                <div class="pdf-preview">

                    <h3 class="section-title">
                        📄 PDF Preview
                    </h3>

                    <iframe
                        src="http://localhost:5000/api/notes/${note._id}/preview"                     width="100%"
                        height="600"
                    >
                    </iframe>

                </div>

            </div>

            <div class="note-sidebar">

                <div class="stats-card">

                    <h3>
                        Note Stats
                    </h3>

                    <div class="stat">
                        <span>👤 Uploader</span>
                        <strong>${note.uploader.name}</strong>
                    </div>

                    <div class="stat">
                        <span>📧 Email</span>
                        <strong>
                            ${note.uploader.email}
                        </strong>
                    </div>

                    <div class="stat">
                        <span>📚 Subject</span>
                        <strong>${note.subject}</strong>
                    </div>

                    <div class="stat">
                        <span>🎓 Semester</span>
                        <strong>${note.semester}</strong>
                    </div>

                    <div class="stat">
                        <span>
                            ⬇ Downloads
                        </span>
                        <strong>
                            ${note.downloads || 0}
                        </strong>
                    </div>

                    <div class="stat">
                        <span>👁 Views</span>
                        <strong>${note.views || 0}</strong>
                    </div>

                    <div class="stat">
                        <span>📅 Added</span>
                        <strong>
                            ${new Date(note.createdAt)
                                .toLocaleDateString(
                                    "en-IN",
                                    {
                                        day:"numeric",
                                        month:"short",
                                        year:"numeric"
                                    }
                                )
                            }
                        </strong>
                    </div>

                    <div class="stat">
                        <span>💰 Price</span>
                        <span class="note-badge note-price-badge">
                            ₹${note.price}
                        </span>
                    </div>

                </div>

                <div class="action-card">

                    <button
                        class="primary-btn"
                        onclick="openPDF()"
                    >
                        Open PDF
                    </button>

                    <button
                        class="secondary-btn"
                        onclick="history.back()"
                    >
                        Back
                    </button>

                </div>

            </div>

        </div>

        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "noteContainer"
        ).innerHTML = `

            <h2>
                Failed to load note.
            </h2>

        `;

    }

}

async function openPDF() {

    try {

        await fetch(
            `http://localhost:5000/api/notes/${currentNote._id}/download`,
            {
                method: "PUT"
            }
        );

        if (
            window.opener &&
            window.opener.fetchNotes
        ) {

            window.opener.fetchNotes();

        }

        window.open(
            `http://localhost:5000/api/notes/${currentNote._id}/pdf`,
            "_blank"
        );

    } catch (error) {

        console.error(error);

    }

}