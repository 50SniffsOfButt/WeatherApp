




// Function to add a div to the chat log and delete the oldest one if there are more than 10 divs
function addDivToChatLog(newDivContent) {
    const parentDiv = document.getElementById('chatLog');

    const newDiv = document.createElement('div');
    newDiv.innerHTML = newDivContent;
    parentDiv.appendChild(newDiv);

    let scrollableDiv = document.getElementById('chatLog');
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;

    // Check and delete the oldest div if there are more than 10 divs
    const childDivs = parentDiv.getElementsByTagName('div');
    if (childDivs.length > 10) {
        parentDiv.removeChild(childDivs[0]);
        console.log('Oldest child div removed');
    }
    console.log('Number of child divs:', childDivs.length);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addDivsWithDelay() {
    for (let i = 1; i <= 50; i++) {
        addDivToChatLog(i);
        await delay(Math.random() * 2000); 
    }
}

addDivsWithDelay();
