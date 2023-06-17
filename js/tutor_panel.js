let scrollDistance = 0;
let numberOfPages = 1;
let prevX = null;
let prevY = null;
let draw = false;
let currentColor = null;
let topNavHeight = document.querySelector('.top-nav').offsetHeight;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

setColorControls();
setCanvasSettings(); // set white background initially;

window.addEventListener('mousedown', (e) => draw = true)
window.addEventListener('mouseup', (e) => draw = false)
window.addEventListener('scroll', () => scrollDistance = window.scrollY);

window.addEventListener('mousemove', (e) => {
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX;
        prevY = getMousePosition(e);
        return
    }

    let mouseX = e.clientX;
    let mouseY = getMousePosition(e);
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    prevX = mouseX;
    prevY = mouseY;
});

function addPage() {
    numberOfPages += 1;
    setCanvasSettings();
}

function setCanvasSettings() {
    const temp_cnvs = document.createElement('canvas');
    const temp_cntx = temp_cnvs.getContext('2d');
    temp_cnvs.width = window.innerWidth; 
    temp_cnvs.height = window.innerHeight * numberOfPages;
    temp_cntx.fillStyle = '#ffffff';
    temp_cntx.fillRect(0, 0, window.innerWidth, window.innerHeight * numberOfPages);
    temp_cntx.drawImage(canvas, 0, 0);
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight * numberOfPages;
    ctx.drawImage(temp_cnvs, 0, 0);
    ctx.lineWidth = 5;
    ctx.strokeStyle = currentColor;
}

function sendBoard() {
    if (!currentMeetingId) {
        alert('Nie rozpocząłeś spotkania')
    }
    if (confirm('Czy na pewno chcesz wysłać tablicę? Spotkanie zostanie zakończone automatyczne.') === false) {
        return;
    }
    canvas.toBlob(blob => {
        const payload = new FormData();
        payload.append('image', blob, 'image.png');
        sendBoardImage(payload);
    })
    // let data = canvas.toDataURL("imag/png")
    // let a = document.createElement("a")
    // a.href = data
    // a.download = "sketch.png"
    // a.click()
    
}

function sendBoardImage(payload) {
    fetch(`${apiUrl}/meeting/close/${currentMeetingId}`, {
        method: "POST",
        body: payload,
    })
    .then(res => res.json())
    .then(data => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        alert('Wysłano tablicę. Spotkanie zakończone.');
    })
    .catch(err => alert(err))
}

function clearBoard() {
    if (confirm('Czy na pewno chcesz wyczyścić tablicę?') === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function getMousePosition(event) {
    return event.clientY + scrollDistance - topNavHeight;
}

function setColorControls() {
    const colorButtons = document.querySelectorAll('.color-button')
    colorButtons.forEach(button => {
        let color = button.dataset.color;
        button.style.backgroundColor = color;
        button.addEventListener('click', () => {
            currentColor = color;
            ctx.strokeStyle = color;
        });
    });
    currentColor = colorButtons[0].dataset.color;
}

function cancelMeeting() {

}
