// Function to reshuffle text back to original
export function reshuffleText(shuffledText, originalOrder) {
    let shuffledArray = shuffledText.split('');
    for (let i = 0; i < originalOrder.length; i++) {
        let index = originalOrder.indexOf(i);
        [shuffledArray[i], shuffledArray[index]] = [shuffledArray[index], shuffledArray[i]];
    }
    return shuffledArray.join('');
}