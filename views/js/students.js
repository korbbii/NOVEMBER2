document.addEventListener("DOMContentLoaded", function () {
    loadStudents(); // Load students on page load

    // Search functionality
    document.getElementById("search").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        filterStudents(query);
    });
});

// Fetch students and populate the table
async function loadStudents() {
    try {
        const response = await fetch("/api/students");
        const students = await response.json();
        const tableBody = document.getElementById("student-table-body");
        tableBody.innerHTML = ""; // Clear existing rows

        students.forEach((student, index) => {
            const row = document.createElement("tr");
            row.dataset.id = student.studentId; // Ensure this is set correctly
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.studentId}</td>
                <td>${student.fname}</td>
                <td>${student.section}</td>
                <td>${student.subjects}</td>
                <td>
                    <i class="bx bx-show show-btn" onclick="viewStudent(${student.studentId})"></i>
                    <i class="bx bx-edit edit-btn" onclick="editStudent(${student.studentId})"></i>
                    <i class="bx bx-trash delete-btn" data-id="${student.studentId}"></i> 
                </td>`;
            tableBody.appendChild(row);

            // Add click event listener for delete button in the current row
            const deleteButton = row.querySelector(".delete-btn");
            deleteButton.addEventListener("click", function () {
                const studentId = this.dataset.id; // Get student ID from data-id
                console.log("Student ID to delete:", studentId); // Debugging statement
                deleteStudent(studentId);
            });
        });

        // Maintain the search state after loading students
        const searchQuery = document.getElementById("search").value;
        filterStudents(searchQuery);
    } catch (error) {
        console.error("Error loading students:", error);
    }
}


// Function to filter displayed students based on search input
function filterStudents(query) {
    const rows = document.querySelectorAll("#student-table-body tr");
    rows.forEach(row => {
        const fname = row.cells[2].textContent.toLowerCase();
        const studentId = row.cells[1].textContent.toLowerCase();
        row.style.display = fname.includes(query) || studentId.includes(query) ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadStudents();

    // Event delegation for delete buttons
    document.getElementById("student-table-body").addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const studentId = event.target.dataset.id; // Correctly get the studentId from data-id
            console.log("Student ID to delete:", studentId); // Debugging statement
            deleteStudent(studentId);
        }
    });
});

// Delete student
async function deleteStudent(id) {
    console.log("Deleting student with ID:", id); // Debugging statement
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
            if (response.ok) {
                loadStudents(); // Reload the students after deletion
            } else {
                alert("Failed to delete student. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }
}

document.getElementById("close-view-popup").addEventListener("click", () => {
    const viewModal = document.getElementById("view-student-modal");
    viewModal.style.display = "none"; // Hide the modal
});

window.addEventListener("click", (event) => {
    const viewModal = document.getElementById("view-student-modal");
    if (event.target == viewModal) {
        viewModal.style.display = "none";
    }
});

document.getElementById("student-table-body").addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
        const studentId = event.target.closest("tr").dataset.id; // Get student ID
        editStudent(studentId); // Call edit function
    }
});
        // Open modal and fill in data
        openPopup.addEventListener("click", () => {
            modal.style.display = "flex";
            // Reset form fields and modal title
            document.querySelector(".modal-header h2").innerHTML = '<i class="bx bx-plus"></i> Add Student';
            document.querySelector(".btn-add").textContent = "Add";
            document.querySelector(".add-student-form").reset(); // Reset form fields
            document.getElementById("edit-mode").value = "false"; // Reset edit mode
        });

        closePopup.addEventListener("click", () => {
            modal.style.display = "none";
            // Reset form when modal is closed
            document.querySelector(".add-student-form").reset();
            isEditing = false; // Reset editing state
        });

        cancelBtn.addEventListener("click", () => {
            modal.style.display = "none";
            // Reset form when canceled
            document.querySelector(".add-student-form").reset();
            isEditing = false; // Reset editing state
        });

        const isEditMode = document.getElementById("edit-mode").value === "true";
        const studentId = document.getElementById("student-id").value;
        
// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) throw new Error("Failed to fetch student data");

        const student = await response.json();

        // Populate the form fields with the student's data
        document.getElementById("student-id").value = student.studentId;
        document.getElementById("section").value = student.section;
        document.getElementById("student-name").value = student.fname;
        document.getElementById("student-password").value = student.password || ''; // Plain text password
        document.getElementById("subjects").value = student.subjects;

        // Update modal UI for editing
        const modal = document.getElementById("add-student-modal");
        modal.style.display = "flex";
        document.querySelector(".modal-header h2").innerHTML = '<i class="bx bx-edit"></i> Edit Student';
        document.querySelector(".btn-add").textContent = "Save Changes";
        document.getElementById("edit-mode").value = "true"; // Set edit mode
    } catch (error) {
        console.error("Error editing student:", error);
    }
}

// Add or Update student on form submission
document.querySelector(".add-student-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const editMode = document.getElementById("edit-mode").value === "true";
    const studentId = document.getElementById("student-id").value;
    const section = document.getElementById("section").value;
    const fname = document.getElementById("student-name").value;
    const password = document.getElementById("student-password").value;
    const subjects = document.getElementById("subjects").value;

    const studentData = { studentId, section, fname, password, subjects };

    try {
        const url = editMode ? `/api/students/${studentId}` : '/api/students';
        const method = editMode ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            document.getElementById("add-student-modal").style.display = "none";
            loadStudents();
        } else {
            alert("Failed to save student data. Please try again.");
        }
    } catch (error) {
        console.error("Error saving student data:", error);
    }
});
// View student details
async function viewStudent(id) {
    try {
        const response = await fetch(`/api/students/${id}`);
        const student = await response.json();

        // Fill in the modal with student details
        document.getElementById("view-student-id").textContent = student.studentId;
        document.getElementById("view-student-name").textContent = student.fname;
        document.getElementById("view-student-section").textContent = student.section;
        document.getElementById("view-student-subjects").textContent = student.subjects;

        // Display the modal
        const viewModal = document.getElementById("view-student-modal");
        viewModal.style.display = "flex"; // Show the modal

    } catch (error) {
        console.error("Error viewing student:", error);
    }
}

function closeModal() {
    modal.style.display = "none";
    document.querySelector(".add-student-form").reset();
    document.getElementById("edit-mode").value = "false";
    document.querySelector(".modal-header h2").textContent = "Add Student";
    document.querySelector(".btn-add").textContent = "Add";
}