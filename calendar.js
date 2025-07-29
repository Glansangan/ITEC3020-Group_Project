// Simple calendar with add event functionality
const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const eventDay = document.querySelector(".eventDay");
const eventDate = document.querySelector(".eventDate");
const eventsContainer = document.querySelector(".events");
const addEventBtn = document.querySelector(".addEvent");
const addEventWrapper = document.querySelector(".addEventWrapper");
const addEventCloseBtn = document.querySelector(".addEventClose");
const addEventSubmit = document.querySelector(".addEventBtn");
const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");

let eventsArr = [];
let dateObj = new Date();
let month = dateObj.getMonth();
let year = dateObj.getFullYear();
let activeDay = dateObj.getDate();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
  const startDay = firstDay.getDay();

  daysContainer.innerHTML = "";
  date.querySelector(".month").textContent = `${months[month]} ${year}`;

  for (let i = startDay; i > 0; i--) {
    daysContainer.innerHTML += `<div class="day prev-date">${prevLastDate - i + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const isToday =
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();
    daysContainer.innerHTML += `<div class="day${isToday ? " today active" : ""}">${i}</div>`;
  }

  const days = daysContainer.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", () => {
      days.forEach((d) => d.classList.remove("active"));
      day.classList.add("active");
      activeDay = Number(day.textContent);
      updateEvents(activeDay);
    });
  });

  updateEvents(activeDay);
}

prev.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
});

next.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
});

function updateEvents(day) {
  const currentEvents = eventsArr.find(
    (e) => e.day === day && e.month === month + 1 && e.year === year
  );

  eventDay.textContent = `${months[month]} ${day}`;
  eventDate.textContent = `${day}/${month + 1}/${year}`;
  eventsContainer.innerHTML = "";

  if (currentEvents) {
    currentEvents.events.forEach((event) => {
      eventsContainer.innerHTML += `
        <div class="event">
          <div class="event-title">${event.title}</div>
          <div class="event-time">${event.time}</div>
        </div>`;
    });
  }
}

function convertTime(time) {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const converted = hour % 12 || 12;
  return `${converted}:${m} ${ampm}`;
}

addEventBtn.addEventListener("click", () => addEventWrapper.classList.add("active"));
addEventCloseBtn.addEventListener("click", () => addEventWrapper.classList.remove("active"));
document.addEventListener("click", (e) => {
  if (e.target === addEventWrapper) {
    addEventWrapper.classList.remove("active");
  }
});

addEventSubmit.addEventListener("click", () => {
  const title = addEventTitle.value.trim();
  const from = addEventFrom.value.trim();
  const to = addEventTo.value.trim();

  if (!title || !from || !to) return alert("Please fill all fields");

  const timeFrom = convertTime(from);
  const timeTo = convertTime(to);
  const newEvent = { title, time: `${timeFrom} - ${timeTo}` };

  let existing = eventsArr.find(
    (e) => e.day === activeDay && e.month === month + 1 && e.year === year
  );

  if (existing) {
    existing.events.push(newEvent);
  } else {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  updateEvents(activeDay);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl && !activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

initCalendar();
