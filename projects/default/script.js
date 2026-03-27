document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('click-me');
    
    button.addEventListener('click', () => {
        alert('Hello from AmkyawDev Editor! You just clicked the button in your live preview.');
        button.style.backgroundColor = '#3498db';
        button.textContent = 'Clicked!';
    });
    
    console.log('Default project script loaded successfully.');
});
