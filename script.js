const date = document.getElementById("date");
date.min = new Date().toISOString().slice(0,10);
const formular = document.getElementById("form");
const aplica = document.getElementById("aplica");
const table = document.getElementById("table");
const getdb = localStorage.getItem("db");
if (getdb) {
  table.innerHTML = JSON.parse(getdb);
  forgetOldRex();
} else {
  table.innerHTML = ``;
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
  localStorage.setItem("db", JSON.stringify(table.innerHTML));
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
  localStorage.setItem("db", JSON.stringify(table.innerHTML));
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
  localStorage.setItem("db", JSON.stringify(table.innerHTML));
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

function renderCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  let calendarHTML =
    `<table><tr><th>lun</th><th>mar</th><th>mie</th><th>joi</th><th>vin</th><th>sâm</th><th>dum</th></tr><tr>`;
  let dayCount = 1;
  for (let i = 0; i < 42; i++) {
    if (i >= firstDay && dayCount <= daysInMonth) {
      calendarHTML += `<td><span class="day">${dayCount}</span></td>`;
      dayCount++;
    } else {
      calendarHTML += `<td></td>`;
    }
    if (i % 7 === 6 && dayCount <= daysInMonth) {
      calendarHTML += `</tr><tr>`;
    }
    if (dayCount > daysInMonth && i % 7 === 6) {
      break;
    }
  }
  calendarHTML += `</tr></table>`;
  const calendar = document.getElementById("month-calendar");
  calendar.innerHTML = `${calendarHTML}`;
  const days1 = calendar.querySelectorAll(".day");
  days1.forEach((day1) => {
    day1.addEventListener('click', function() {
      const date2 = new Date(year, month, parseInt(day1.textContent) + 1);
      date.value = new Date(date2).toISOString().slice(0,10);
    });
  });
}

renderCalendar(2026, 8);
