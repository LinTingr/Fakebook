const inUp = document.querySelectorAll(".inUp");
const signinFrame = document.querySelector(".signinFrame");
const signupFrame = document.querySelector(".signupFrame");
const accountSignin = document.querySelector(".accountSignin");
const passwordSignin = document.querySelector(".passwordSignin");
const signinBtn = document.querySelector(".signinBtn");
const nameSignup = document.querySelector(".nameSignup")
const accountSignup = document.querySelector(".accountSignup")
const passwordSignup = document.querySelector(".passwordSignup")
const signupBtn = document.querySelector(".signupBtn")
const messageSignin = document.querySelector(".messageSignin")
const messageSignup = document.querySelector(".messageSignup")
const messageSigninRespond = document.querySelector(".messageSigninRespond")
const messageSignupRespond = document.querySelector(".messageSignupRespond")

const nameRe = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,15}$/
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRe = /^(?=.*[a-zA-Z\d])[a-zA-Z\d]{4,}$/

const memberName = document.querySelector(".memberName")
fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    if(data.ok){
        window.location.href = "/"
    }
})

inUp.forEach(element => {
    element.addEventListener("click", ()=>{
        const signin = document.querySelector(".signinFrame");
        const signup = document.querySelector(".signupFrame");
        searchSignup = signup.className.includes("none");
        if(searchSignup){
            signin.classList.add("none");
            signup.classList.remove("none");
            if(messageSigninRespond){
                messageSigninRespond.style.display = "none";
            }
        }else{
            signin.classList.remove("none");
            signup.classList.add("none");
            if(messageSignupRespond){
                messageSignupRespond.style.display = "none";
            }
        }
    })
})

signinBtn.addEventListener("click", ()=>{
    const email = accountSignin.value;
    const password = passwordSignin.value;
    const signInData = {
        email : email,
        password : password
    }
    fetch("/api/user", {
        method:"PUT",
        body:JSON.stringify(signInData),
        headers:new Headers({
            "content-type": "application/json"
        })
    }).then((response) => {
        return response.json()
    }).then((data) => {
        if(data.error){
            messageSigninRespond.style.display = "block"
            messageSigninRespond.textContent = data.message
        }else{
            window.location.href = "/"
        }
    })
})



signupBtn.addEventListener("click", ()=>{
    const name = nameSignup.value;
    const email = accountSignup.value;
    const password = passwordSignup.value;
    const nameRules = nameRe.test(name)
    const emailRules = emailRe.test(email)
    const passwordRules = passwordRe.test(password)
    messageSignupRespond.style.display = "none"
    if(!name && !email && !password){
        messageSignupRespond.style.display = "block"
        messageSignupRespond.textContent = "帳號、用戶名稱、密碼皆不可空白!"
    }else{
        if(!nameRules){
            messageSignupRespond.style.display = "block"
            messageSignupRespond.textContent = "名字長度限制 1~15 個字元"
        }else{
            if(!emailRules){
                messageSignupRespond.style.display = "block"
                messageSignupRespond.textContent = "帳號格式錯誤"
            }else{
                if(!passwordRules){
                    messageSignupRespond.style.display = "block"
                    messageSignupRespond.textContent = "密碼最少 4 個字元"
                }else{
                    let data = {
                        name : name,
                        email : email,
                        password : password
                    }
                    fetch("/api/user", {
                        method:"POST",
                        body:JSON.stringify(data),
                        headers:new Headers({
                            "Content-type": "application/json"
                        })
                    }).then((response)=>{
                        return response.json()
                    }).then((data)=>{
                        if(data.error){
                            messageSignupRespond.style.display = "block"
                            messageSignupRespond.textContent = data.message
                        }else{
                            messageSignupRespond.style.display = "block"
                            messageSignupRespond.style.color = "green"
                            messageSignupRespond.textContent = data.message
                            setTimeout(()=>{
                                window.location.href = "/"
                            }, 2500)
                        }
                    })
                }
            }
        }
    }
})