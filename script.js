const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let tool = 'pen';
let color = '#000000';
let size = 5;
let startX = 0;
let startY = 0;
let savedCanvas = [];
let undoneCanvas = [];

// Set tool
function setTool(selectedTool) {
    tool = selectedTool;
}

// Set color
function setColor(selectedColor) {
    color = selectedColor;
}

// Set size
function setSize(selectedSize) {
    size = selectedSize;
}

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
});

// Drawing on the canvas
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';

        switch (tool) {
            case 'pen':
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
                break;
            case 'eraser':
                ctx.strokeStyle = '#ffffff';
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
                break;
            case 'line':
                drawShape(startX, startY, mouseX, mouseY, 'line');
                break;
            case 'rectangle':
                drawShape(startX, startY, mouseX, mouseY, 'rectangle');
                break;
            case 'circle':
                drawShape(startX, startY, mouseX, mouseY, 'circle');
                break;
            case 'triangle':
                drawShape(startX, startY, mouseX, mouseY, 'triangle');
                break;
            case 'star':
                drawShape(startX, startY, mouseX, mouseY, 'star');
                break;
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
    saveCanvasState();
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    ctx.closePath();
});

// Save canvas state for undo
function saveCanvasState() {
    const canvasData = canvas.toDataURL();
    savedCanvas.push(canvasData);
}

// Undo last action
function undo() {
    if (savedCanvas.length > 0) {
        const lastCanvasState = savedCanvas.pop();
        undoneCanvas.push(lastCanvasState);

        const img = new Image();
        img.src = lastCanvasState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Redo last undone action
function redo() {
    if (undoneCanvas.length > 0) {
        const lastUndoneState = undoneCanvas.pop();
        savedCanvas.push(lastUndoneState);

        const img = new Image();
        img.src = lastUndoneState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

// Save drawing to local storage
function saveDrawing() {
    const drawing = canvas.toDataURL();
    localStorage.setItem('drawing', drawing);
    alert('Drawing saved!');
}

// Load drawing from local storage
function loadDrawing() {
    const drawing = localStorage.getItem('drawing');
    if (drawing) {
        const img = new Image();
        img.src = drawing;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert('No saved drawing found!');
    }
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    savedCanvas = [];
    undoneCanvas = [];
}

// Recognize drawing
function recognizeDrawing() {
    var canvas = document.getElementById('canvas');
    var imageData = canvas.toDataURL('image/png');

    fetch('/recognize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        alert('Recognized symbol: ' + data.recognized);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Draw shapes
function drawShape(startX, startY, mouseX, mouseY, shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (savedCanvas.length > 0) {
        const img = new Image();
        img.src = savedCanvas[savedCanvas.length - 1];
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            switch (shape) {
                case 'line':
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(mouseX, mouseY);
                    break;
                case 'rectangle':
                    ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
                    break;
                case 'circle':
                    const radius = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
                    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                    break;
                case 'triangle':
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(startX, mouseY);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.closePath();
                    break;
                case 'star':
                    drawStar(ctx, startX, startY, 5, (mouseX - startX) / 2, (mouseX - startX) / 4);
                    break;
            }
            ctx.stroke();
        };
    }
}

// Draw star
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.stroke();
}
