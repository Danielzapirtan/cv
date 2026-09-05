const date = document.getElementById("date");
date.min = new Date().toISOString().slice(0,10);
const formular = document.getElementById("form");
const aplica = document.getElementById("aplica");
const table = document.getElementById("table");
const dbItem = "cvdb";
//localStorage.removeItem(dbItem);
const getdb = localStorage.getItem(dbItem);
if (getdb) {
  table.innerHTML = JSON.parse(getdb);
  forgetOldRex();
} else {
  table.innerHTML = ``;
  localStorage.setItem(dbItem, JSON.stringify(table.innerHTML));
}

formular.addEventListener("submit", function (e) {
  e.preventDefault();
  const dateValue = date.value;
  const nameValue = document.getElementById("name").value;
  const descValue = document.getElementById("desc").value || "";
  const startValue = document.getElementById("start").value;
  const endValue = document.getElementById("end").value;
  if (checkOverlaping(startValue, endValue)) {
    alert("Activitate suprapusă");
    return;
  }
  const tr = document.createElement("tr");
  tr.classList.add("activ");
  tr.innerHTML = `<td>${dateValue}</td><td>${nameValue}</td><td>${descValue}</td><td>${startValue}</td><td>${endValue}</td><td><input type="checkbox"></td>`;
  table.appendChild(tr);
  localStorage.setItem(dbItem, JSON.stringify(table.innerHTML));
  formular.reset();
});

const filter = document.getElementById("filter");
filter.addEventListener("change", function (e) {
  e.preventDefault();
  const rex = table.querySelectorAll("tr");
  rex.forEach((rec) => {
    const chk = filter.checked;
    if (chk && !rec.innerHTML.includes(date.value)) {
      rec.classList.add("hidden");
    } else {
      rec.classList.remove("hidden");
    }
  });
});

const clearAll = document.getElementById("clearAll");

clearAll.addEventListener("click", function(e) {
  e.preventDefault();
  const rex = table.querySelectorAll("tr");
  const toRemove = [];
  rex.forEach((rec) => {
    const mark1 = rec.querySelector("input[type='checkbox']");
    if (mark1 && mark1.checked || filter.checked) {
      toRemove.push(rec);
    }
  });
  toRemove.forEach(rec => rec.remove()); 
  localStorage.setItem(dbItem, JSON.stringify(table.innerHTML));
});

function forgetOldRex() {
  const rex = table.querySelectorAll("tr");
  const toRemove = [];
  rex.forEach((rec) => {
    const tds = rec.querySelectorAll("td");
    const date0 = Math.floor(new Date() / 86400000);
    const date1 = Math.floor(new Date(tds[0].innerHTML) / 86400000);
    if (date1 < date0) {
      toRemove.push(rec);
    }
  });
  toRemove.forEach(rec => rec.remove());
  localStorage.setItem(dbItem, JSON.stringify(table.innerHTML));
}

function checkOverlaping(start, end) {
  const dateValue = date.value;
  const rex = table.querySelectorAll("tr");
  for (let i = 0; i < rex.length; i++) {
    const rec = rex[i];
    const tds = rec.querySelectorAll("td");
    const myStart = tds[3].innerHTML;
    const myEnd = tds[4].innerHTML;
    const myDate = tds[0].innerHTML;
    if (myDate === dateValue) {
      if (myStart === start || myEnd === end) {
        return true;
      }
      if (start > myStart && start < myEnd) {
        return true;
      }
      if (end > myStart && end < myEnd) {
        return true;
      }
      if (start >= end) {
        return true;
      }
    }
  }
  return false;
}

const monthNames = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
];
const monthCount = 18;
const visibleMonthCount = 3;
let calendarStart = 0;

function renderCalendar(year, month, start = 0) {
  const calendar = document.getElementById("month-calendar");
  const rangeLabel = document.getElementById("calendar-range");
  const previousButton = document.getElementById("previous-months");
  const nextButton = document.getElementById("next-months");
  calendar.innerHTML = "";

  for (let monthOffset = start; monthOffset < Math.min(start + visibleMonthCount, monthCount); monthOffset++) {
    const monthDate = new Date(year, month + monthOffset, 1);
    const monthYear = monthDate.getFullYear();
    const monthNumber = monthDate.getMonth();
    const daysInMonth = new Date(monthYear, monthNumber + 1, 0).getDate();
    const firstDay = (monthDate.getDay() + 6) % 7;
    const monthTable = document.createElement("table");
    monthTable.innerHTML =
      `<caption>${monthNames[monthNumber]} ${monthYear}</caption>
      <tr><th>lun</th><th>mar</th><th>mie</th><th>joi</th><th>vin</th><th>sâm</th><th>dum</th></tr>`;

    let dayCount = 1;
    while (dayCount <= daysInMonth) {
      const row = monthTable.insertRow();
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const cell = row.insertCell();
        if ((row.rowIndex === 1 && dayOfWeek < firstDay) || dayCount > daysInMonth) {
          continue;
        }

        const day = document.createElement("span");
        day.className = "day";
        day.textContent = dayCount;
        day.dataset.date = `${monthYear}-${String(monthNumber + 1).padStart(2, "0")}-${String(dayCount).padStart(2, "0")}`;
        cell.appendChild(day);
        dayCount++;
      }
    }

    calendar.appendChild(monthTable);
  }

  calendar.querySelectorAll(".day").forEach((day) => {
    day.addEventListener("click", function() {
      date.value = day.dataset.date;
    });
  });

  const firstMonth = new Date(year, month + start, 1);
  const lastMonth = new Date(year, month + Math.min(start + visibleMonthCount, monthCount) - 1, 1);
  rangeLabel.textContent = `${monthNames[firstMonth.getMonth()]} ${firstMonth.getFullYear()} - ${monthNames[lastMonth.getMonth()]} ${lastMonth.getFullYear()}`;
  previousButton.disabled = start === 0;
  nextButton.disabled = start + visibleMonthCount >= monthCount;
}

const today = new Date();
const calendarYear = today.getFullYear();
const calendarMonth = today.getMonth();
const previousMonthsButton = document.getElementById("previous-months");
const nextMonthsButton = document.getElementById("next-months");

previousMonthsButton.addEventListener("click", () => {
  calendarStart = Math.max(0, calendarStart - visibleMonthCount);
  renderCalendar(calendarYear, calendarMonth, calendarStart);
});

nextMonthsButton.addEventListener("click", () => {
  calendarStart = Math.min(monthCount - visibleMonthCount, calendarStart + visibleMonthCount);
  renderCalendar(calendarYear, calendarMonth, calendarStart);
});

renderCalendar(calendarYear, calendarMonth, calendarStart);
