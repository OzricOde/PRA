var navbarString = '';
var baseString =    `<nav class="navbar navbar-dark bg-dark"><span class="navbar-brand mb-0 h1">Dept Of Computer Science, Acharya Institute Of Technology</span>`
var arr = [
    {
        title: 'Scrape',
        href: 'index.html'
    },
    {
        title: 'Analytics',
        href: 'analytics.html'
    }
]
for (let obj of arr){
    navbarString += `<a class="navbar-brand" href="${obj.href}">${obj.title}</a>`
}    
navbarString += `</nav>`
var string = baseString+navbarString;
document.getElementById('nav').innerHTML = string