function networkCheck() {
    if(!navigator.onLine) {
    document.write("<p class='networkError'>Network Error: Please check your Internet connection.</p>");
    }
    return navigator.onLine;
}
networkCheck();
