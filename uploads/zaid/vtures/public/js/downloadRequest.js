$(function() {    
    setTimeout(() => {
        console.log("sending request to download")
        window.open("http://localhost:8000/download");
    },5000)
});
