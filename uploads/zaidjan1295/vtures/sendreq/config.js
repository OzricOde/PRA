const config = (usn, frontData) => {
    return {
        '2019' : {
            headers :   {
                "Origin": "http://results.vtu.ac.in",
                "Upgrade-Insecure-Requests": 1,
                "User-Agent":" Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Referer": "http://results.vtu.ac.in/resultsvitavicbcs_19/index.php",
                "Cookie": `PHPSESSID=${frontData.cookie}`
            },           
            body : {
                "captchacode":frontData.captcha,
                "lns":usn,
                "token": frontData.token,
                "current_url": "http://results.vtu.ac.in/resultsvitavicbcs_19/index.php"
            },
            url: "http://results.vtu.ac.in/resultsvitavicbcs_19/resultpage.php"
        }
    }
}

module.exports = {
    config
}