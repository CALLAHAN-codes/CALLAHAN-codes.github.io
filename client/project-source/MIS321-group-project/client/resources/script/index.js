// Handle Document OnLoad
function handleOnLoad()
{
    // loader
    loaderDisplay()
}


// LOGIC | HANDLER FUNCTIONS



// DOM MANIPULATION FUNCTIONS
// Loader Function
function loaderDisplay()
{
    // get loader dom element
    const loader = document.getElementById('loader')

    // once loaded, fade out after 1.5 seconds
    setTimeout(() => {
        loader.classList.add('fade-out')
    }, 1500)
}