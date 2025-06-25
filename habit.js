let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let currentDate = date.getDate();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

const titulo = document.getElementById("titulo");
titulo.innerHTML = `Hábitos de ${currentYear}`;

const habitoTitulo = document.getElementById("habitoTitulo");
    habitoTitulo.onclick = function () {
    let habitos = prompt("Qual seu hábito?", habitoTitulo.innerHTML);
    if (habitos && habitos.trim().length > 0){
        habitoTitulo.innerHTML = habitos;
        localStorage.setItem("nomeDoHabito", habitos);
    } else{
        habitoTitulo.innerHTML = "Novo Hábito";
        localStorage.removeItem("nomedoHabito")
    }
    };

    document.addEventListener("DOMContentLoaded", () => {
    const savedHabit = localStorage.getItem("nomeDoHabito");
    if (savedHabit) {
        habitoTitulo.innerHTML = savedHabit;
    }
    });

    const calendarioAnualContainer = document.getElementById("calendarioAnualContainer");
    const resetButton = document.getElementById("resetButton");

   function isLeapYear(year){
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
   };

   function getDaysInMonth(year, month) {
    if (month === 1) {
        return isLeapYear(year) ? 29 : 28;
    }
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
}

function renderMonth(year, month) {
    const monthContainer = document.createElement("div");
    monthContainer.classList.add("mesCalendario");

    const monthHeader = document.createElement("div");
    monthHeader.classList.add("mesCabecalho");
    
    const monthName = document.createElement("span");
    monthName.classList.add("mesNome");
    monthName.textContent = meses[month];
    monthHeader.appendChild(monthName);

    const totalDaysSpan = document.createElement("span");
    totalDaysSpan.classList.add("totalDiasMes");
    monthHeader.appendChild(totalDaysSpan); 
    monthContainer.appendChild(monthHeader);

   
    const weekDaysContainer = document.createElement("div");
    weekDaysContainer.classList.add("diasSemana");
    diasDaSemana.forEach(day => {
        const weekDay = document.createElement("div");
        weekDay.classList.add("diaSemana");
        weekDay.textContent = day;
        weekDaysContainer.appendChild(weekDay);
    });
    monthContainer.appendChild(weekDaysContainer);

    const daysContainer = document.createElement("div");
    daysContainer.classList.add("diasContainer");

    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = getDaysInMonth(year, month);
    let completedDays = 0;

   
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.classList.add("dia", "dia-vazio");
        daysContainer.appendChild(emptyDay);
    }

   
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("dia");
        dayDiv.textContent = day;
        dayDiv.dataset.date = `${year}-${month + 1}-${day}`; 
        dayDiv.id = `dia-${year}-${month + 1}-${day}`; 

        
        const storageKey = dayDiv.dataset.date;
        const isMarked = localStorage.getItem(storageKey) === "true";

        if (isMarked) {
            dayDiv.classList.add("dia-marcado");
            completedDays++;
        }

       
        if (year === currentYear && month === currentMonth && day === currentDate) {
            dayDiv.classList.add("dia-atual");
        }

       
        dayDiv.addEventListener("click", function() {
            if (this.classList.contains("dia-vazio")) return; 

            const dateKey = this.dataset.date;
            const isCurrentlyMarked = localStorage.getItem(dateKey) === "true";

            if (isCurrentlyMarked) {
                this.classList.remove("dia-marcado");
                localStorage.setItem(dateKey, "false");
                completedDays--;
            } else {
                this.classList.add("dia-marcado");
                localStorage.setItem(dateKey, "true");
                completedDays++;
            }
            
            totalDaysSpan.textContent = `${completedDays}/${daysInMonth}`;
        });

        daysContainer.appendChild(dayDiv);
    }

    monthContainer.appendChild(daysContainer);

    
    totalDaysSpan.textContent = `${completedDays}/${daysInMonth}`;

    return monthContainer;
}


function renderFullYearCalendar(year) {
    calendarioAnualContainer.innerHTML = ''; 
    for (let i = 0; i < 12; i++) {
        const monthElement = renderMonth(year, i);
        calendarioAnualContainer.appendChild(monthElement);
    }
}

renderFullYearCalendar(currentYear);


resetButton.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja resetar TODOS os hábitos? Esta ação é irreversível.")) {
        localStorage.clear(); 
        renderFullYearCalendar(currentYear); 
        habitoTitulo.innerHTML = "Novo Hábito"; 
        alert("Todos os hábitos foram resetados!");
    }
});