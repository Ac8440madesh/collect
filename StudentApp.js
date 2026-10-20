// ---------- Class to store student details ----------
class Student {
  constructor(name, dob, age, mobile, email) {
    this.name = name;
    this.dob = dob;
    this.age = age;
    this.mobile = mobile;
    this.email = email;
  }
}

// Helper: show or clear an error message under a field
function setError(id, message) {
  document.getElementById(id).textContent = message;
}

// ---------- Validation functions (called on focusout) ----------

// Name: only letters and spaces, not blank
function validateName() {
  const value = document.getElementById("name").value;
  if (!/^[A-Za-z ]+$/.test(value) || value.trim() === "") {
    setError("nameError", "Name must contain only alphabets and spaces, and cannot be blank.");
    return false;
  }
  setError("nameError", "");
  return true;
}

// DOB: dd/mm/yyyy format, real date; also calculates age
function validateDob() {
  const value = document.getElementById("dob").value;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  document.getElementById("age").value = "";

  if (!match) {
    setError("dobError", "Date must be in dd/mm/yyyy format.");
    return false;
  }
  const day = Number(match[1]), month = Number(match[2]), year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const realDate = date.getFullYear() === year &&
                   date.getMonth() === month - 1 &&
                   date.getDate() === day;
  if (!realDate || date > new Date()) {
    setError("dobError", "Please enter a valid date of birth.");
    return false;
  }
  setError("dobError", "");
  calculateAge(date);
  return true;
}

// Age: calculated from DOB
function calculateAge(dobDate) {
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const hadBirthday =
    today.getMonth() > dobDate.getMonth() ||
    (today.getMonth() === dobDate.getMonth() && today.getDate() >= dobDate.getDate());
  if (!hadBirthday) age--;
  document.getElementById("age").value = age;
}

// Mobile: digits only, not blank, cannot start with 0; clear on error
function validateMobile() {
  const field = document.getElementById("mobile");
  if (!/^[1-9][0-9]*$/.test(field.value)) {
    setError("mobileError", "Mobile must be digits only and cannot start with 0.");
    field.value = "";
    return false;
  }
  setError("mobileError", "");
  return true;
}

// Email: contains @, does not start with @, ends with .com or .in; clear on error
function validateEmail() {
  const field = document.getElementById("email");
  const v = field.value;
  const ok = v.includes("@") && !v.startsWith("@") &&
             (v.endsWith(".com") || v.endsWith(".in"));
  if (!ok) {
    setError("emailError", "Email must contain @, not start with @, and end with .com or .in.");
    field.value = "";
    return false;
  }
  setError("emailError", "");
  return true;
}

// ---------- Cookie helpers ----------
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

function getCookie(name) {
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const [key, val] = part.split("=");
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

// ---------- Form submit ----------
document.getElementById("studentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Re-run all validations before accepting the form
  const allValid = [validateName(), validateDob(), validateMobile(), validateEmail()]
    .every(Boolean);
  if (!allValid) {
    alert("Please correct the errors in the form.");
    return;
  }

  // Create object from the class and show it in the console
  const student = new Student(
    document.getElementById("name").value.trim(),
    document.getElementById("dob").value,
    document.getElementById("age").value,
    document.getElementById("mobile").value,
    document.getElementById("email").value
  );
  console.log("Student object:", student);

  // Store the object in a cookie, keyed by mobile number
  setCookie("student_" + student.mobile, JSON.stringify(student), 7);

  // "Navigate" to the retrieve page
  document.getElementById("formPage").style.display = "none";
  document.getElementById("retrievePage").style.display = "block";
});

// ---------- Retrieve cookie ----------
document.getElementById("retrieveBtn").addEventListener("click", function () {
  const mobile = document.getElementById("retrieveMobile").value.trim();
  const data = getCookie("student_" + mobile);
  if (data === null) {
    alert("No details found for this mobile number.");
    return;
  }
  const s = JSON.parse(data);
  alert(
    "Name: " + s.name + "\nDate of Birth: " + s.dob + "\nAge: " + s.age +
    "\nMobile: " + s.mobile + "\nEmail: " + s.email
  );
});
