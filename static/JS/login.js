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
const respond = document.createElement("div")
respond.setAttribute("class", "messageRespond")

const memberName = document.querySelector(".memberName")
fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    // console.log(data)
    if(data.ok){
        window.location.href = "/"
    }
})

inUp.forEach(element => {
    element.addEventListener("click", ()=>{
        const messageRespond = document.querySelector(".messageRespond");
        const signin = document.querySelector(".signinFrame");
        const signup = document.querySelector(".signupFrame");
        searchSignup = signup.className.includes("none");
        if(searchSignup){
            signin.classList.add("none");
            signup.classList.remove("none");
            if(messageRespond){
                messageRespond.remove();
            }
        }else{
            signin.classList.remove("none");
            signup.classList.add("none");
            if(messageRespond){
                messageRespond.remove();
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
        console.log(data)
        if(data.error){
            messageSignin.appendChild(respond)
            respond.textContent = data.message
            console.log(respond)
        }else{
            window.location.href = "/"
        }
    })
})

signupBtn.addEventListener("click", ()=>{
    let name = nameSignup.value;
    let email = accountSignup.value;
    let password = passwordSignup.value;
    if(name && email && password){
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
            console.log(data)
            if(data.error){
                const respond = document.createElement("div")
                respond.setAttribute("class", "messageRespond")
                if(messageSignup.textContent){
                    const messageRespond = document.querySelector(".messageRespond")
                    messageRespond.textContent = data.message
                }else{
                    messageSignup.appendChild(respond)
                    respond.textContent = data.message
                }
            }else{
                const respond = document.createElement("div")
                respond.setAttribute("class", "messageRespond")
                if(messageSignup.textContent){
                    const messageRespond = document.querySelector(".messageRespond")
                    messageRespond.textContent = data.message
                }else{
                    messageSignup.appendChild(respond)
                    respond.textContent = data.message
                }
            }
            
        })
    }else{
        const respond = document.createElement("div")
        respond.setAttribute("class", "messageRespond")
        if(messageSignup.textContent){
        }else{
            messageSignup.appendChild(respond)
            respond.textContent = "沒輸入還敢點阿!"
        }
    }
})