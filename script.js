document.addEventListener('DOMContentLoaded', function () {
    // Get canvas element and its context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set initial values
    let isDrawing = false;
    let currentTool = 'pen';
    let currentColor = '#000000';
    let penWidth = 5;
    let fontSize = 30; // Initial font size for text tool
    // Variable for storing the text input
    let textInput = '';

    // Use try-catch to handle errors and show error popup
    function showErrorPopup(errorMessage) {
        const errorPopup = document.getElementById('error-popup');
        const errorPopupMessage = document.getElementById('error-message');
        errorPopupMessage.textContent = errorMessage;
        errorPopup.style.display = 'block';
    }
    // Event listener for tool buttons
    const toolButtons = document.querySelectorAll('.tools button');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            toolButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            button.classList.add('active');

            currentTool = button.id;
            if (currentTool === 'color-picker') {
                document.getElementById('color-input').click();
            } else if (currentTool === 'text') {
                openTextPopup();
            }
        });
    });
    // Event listener for background color input
    const backgroundColorInput = document.getElementById('background-color-input');
    backgroundColorInput.addEventListener('input', () => {
        canvas.style.backgroundColor = backgroundColorInput.value;
    });
    // Event listener for color input
    const colorInput = document.getElementById('color-input');
    colorInput.addEventListener('input', () => {
        currentColor = colorInput.value;
    });

    // Event listener for pen width input
    const penWidthInput = document.getElementById('pen-width');
    penWidthInput.addEventListener('input', () => {
        penWidth = penWidthInput.value;
        document.getElementById('pen-width-label').textContent = `Pen: ${penWidth}`;
    });

    // Event listener for font size input
    const fontSizeInput = document.getElementById('font-size');
    fontSizeInput.addEventListener('input', () => {
        fontSize = fontSizeInput.value;
        document.getElementById('font-size-label').textContent = `Font Size: ${fontSize}`;
    });

    // Event listener for canvas interactions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listeners for touch interactions on canvas
    canvas.addEventListener('touchstart', startDrawingTouch);
    canvas.addEventListener('touchmove', drawTouch);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    // Event listener for canvas interactions using touch
    function startDrawingTouch(e) {
        if (currentTool === 'text') {
            // Handle opening text popup for touch interactions
            // You can decide how to handle this based on your design
            return;
        }

        isDrawing = true;
        const touch = e.touches[0];
        const { left, top } = canvas.getBoundingClientRect();
        const x = touch.clientX - left;
        const y = touch.clientY - top;
        drawTouch({ clientX: x, clientY: y });
    }
    // Open the text pop-up with specified coordinates
    function openTextPopup(x, y) {
        const textPopup = document.getElementById('text-popup');
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        textPopup.style.display = 'block';

        // Set initial position for text pop-up
        textPopup.style.left = `${x}px`;
        textPopup.style.top = `${y}px`;

        // Event listener for insert text button
        const insertTextButton = document.getElementById('insert-text');
        insertTextButton.addEventListener('click', () => {
            const textInput = document.getElementById('text-input').value;
            if (textInput) {
                drawText(x, y, textInput);
            }
            closeTextPopup();
        });

        // Close the text pop-up when clicking outside
        overlay.addEventListener('click', closeTextPopup);
    }
    // Close the text pop-up
    function closeTextPopup() {
        const textPopup = document.getElementById('text-popup');
        const overlay = document.querySelector('.overlay'); // This might be causing the issue
        textPopup.style.display = 'none';

        if (overlay) {
            overlay.parentNode.removeChild(overlay); // Use parentNode.removeChild() to remove the overlay
        }
    }


    function startDrawing(e) {
        if (currentTool === 'text') {
            openTextPopup(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            return;
        }

        isDrawing = true;
        draw(e);
    }
    // Event listener for canvas interactions using touch
    function startDrawingTouch(e) {
        if (currentTool === 'text') {
            return;
        }

        isDrawing = true;
        const touch = e.touches[0];
        const { left, top } = canvas.getBoundingClientRect();
        const x = touch.clientX - left;
        const y = touch.clientY - top;
        drawTouch({ clientX: x, clientY: y });
    }


    function drawTouch(e) {
        try {
            if (!isDrawing) return;

            const touch = e.touches[0];
            const { left, top } = canvas.getBoundingClientRect();
            const x = touch.clientX - left;
            const y = touch.clientY - top;

            ctx.lineWidth = penWidth;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        } catch (error) {
            //Ignore ... and enjoy :)
            //showErrorPopup('An error occurred while drawing.');
        }
    }


    function draw(e) {
        if (!isDrawing) return;

        ctx.lineWidth = penWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    // Clear canvas
    const clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    // Additional functions for new tools
    function drawText(x, y, text) {
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = currentColor;
        ctx.fillText(text, x, y);
    }

    // Resize canvas to fit container
    function resizeCanvas() {
        const container = document.querySelector('.container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight - 100; // Adjust for header and tools
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

});
