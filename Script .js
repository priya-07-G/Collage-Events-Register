// ---------- Data ----------
const events = [
  { id: 1, title: "Hackathon 2026", category: "Technical", date: "2026-11-05", venue: "Main Auditorium", description: "24-hour coding challenge." },
  { id: 2, title: "Capture The Flag", category: "Technical", date: "2026-11-12", venue: "Cyber Lab", description: "Solve security puzzles and win prizes." },
  { id: 3, title: "Cultural Fest", category: "Cultural", date: "2026-11-20", venue: "Open Ground", description: "Music, dance and drama performances." },
  { id: 4, title: "Inter-Department Cricket", category: "Sports", date: "2026-11-25", venue: "College Ground", description: "Knockout tournament between departments." }
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function setMessage(el, text, ok = false) {
  el.textContent = text;
  el.className = ok ? "msg-ok" : "msg-error";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Events page ----------
const eventList = document.getElementById("eventList");

function renderEvents(category = "All") {
  const filtered = category === "All"
    ? events
    : events.filter(e => e.category === category);

  eventList.innerHTML = filtered.map(e => `
    <div class="card event-card">
      <span class="tag">${e.category}</span>
      <h3>${e.title}</h3>
      <p>${e.description}</p>
      <p class="meta">${formatDate(e.date)} | ${e.venue}</p>
      <a href="register.html?event=${encodeURIComponent(e.title)}" class="btn">Register</a>
    </div>
  `).join("");
}

if (eventList) {
  renderEvents();

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderEvents(btn.dataset.category);
    });
  });
}

// ---------- Registration page ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const eventSelect = document.getElementById("eventSelect");
  const formMsg = document.getElementById("formMsg");

  eventSelect.innerHTML =
    `<option value="">Select event</option>` +
    events.map(e => `<option value="${e.title}">${e.title}</option>`).join("");

  // Pre-fill the event when coming from the Events page (?event=...)
  const preselected = new URLSearchParams(window.location.search).get("event");
  if (preselected) eventSelect.value = preselected;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const eventName = eventSelect.value;

    if (name.length < 3) return setMessage(formMsg, "Please enter your full name (at least 3 characters).");
    if (!emailPattern.test(email)) return setMessage(formMsg, "Please enter a valid email address.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setMessage(formMsg, "Enter a valid 10-digit phone number.");
    if (!department) return setMessage(formMsg, "Please select your department.");
    if (!eventName) return setMessage(formMsg, "Please select an event.");

    try {
      const saved = JSON.parse(localStorage.getItem("registrations") || "[]");
      saved.push({ name, email, phone, department, event: eventName, time: new Date().toISOString() });
      localStorage.setItem("registrations", JSON.stringify(saved));
    } catch (err) {
      console.error("Could not save registration:", err);
    }

    setMessage(formMsg, `Thank you, ${name}! You are registered for ${eventName}.`, true);
    registerForm.reset();
  });
}

// ---------- Contact page ----------
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const contactMsg = document.getElementById("contactMsg");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const message = document.getElementById("cMsg").value.trim();

    if (name.length < 2) return setMessage(contactMsg, "Please enter your name.");
    if (!emailPattern.test(email)) return setMessage(contactMsg, "Please enter a valid email address.");
    if (message.length < 10) return setMessage(contactMsg, "Message should be at least 10 characters.");

    setMessage(contactMsg, "Thanks for reaching out! We will reply soon.", true);
    contactForm.reset();
  });
}