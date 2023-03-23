

function notificationbar(sendUserId, sendUser, sendUserAvatar){
    let invitationFrame = document.createElement("div");
    invitationFrame.className = "invitationFrame";
    let invitationAvatarMessageFrame = document.createElement("div");
    invitationAvatarMessageFrame.className = "invitationAvatarMessageFrame";
    let invitationAvatarFrame = document.createElement("div");
    invitationAvatarFrame.className = "invitationAvatarFrame";
    let invitationAvatar = document.createElement("img");
    invitationAvatar.className = "invitationAvatar";
    invitationAvatar.src = sendUserAvatar; // 設定圖片路徑
    invitationAvatarFrame.appendChild(invitationAvatar);
    let invitationMessage = document.createElement("div");
    invitationMessage.className = "invitationMessage";
    invitationMessage.textContent = sendUser + "傳送了交友邀請給你"; // 設定文字內容
    invitationAvatarMessageFrame.appendChild(invitationAvatarFrame);
    invitationAvatarMessageFrame.appendChild(invitationMessage);
    let chooseFrame = document.createElement("div");
    chooseFrame.className = "chooseFrame";
    let accept = document.createElement("div");
    accept.className = "accept";
    accept.textContent = "接受"; // 設定文字內容
    let reject = document.createElement("div");
    reject.className = "reject";
    reject.textContent = "拒絕"; // 設定文字內容
    chooseFrame.appendChild(accept);
    chooseFrame.appendChild(reject);
    invitationFrame.appendChild(invitationAvatarMessageFrame);
    invitationFrame.appendChild(chooseFrame);
    clickAccept(accept, sendUserId, sendUser, invitationFrame)
    clickReject(reject, sendUserId, sendUser, invitationFrame)
    return invitationFrame
}

function clickAccept(accept, sendUserId, sendUser, invitationFrame){
    accept.addEventListener("click", ()=>{
        const data = {
            confirm : "ACCEPTED",
            sendUserId : sendUserId,
            sendUserName : sendUser
        }
        fetch("/api/friend", {
            method:"PUT",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
            if(data.ok){
                invitationFrame.remove()
            }
        })
    })
}
function clickReject(reject, sendUserId, sendUser, invitationFrame){
    reject.addEventListener("click", ()=>{
        const data = {
            confirm : "DECLINED",
            sendUserId : sendUserId,
            sendUserName : sendUser
        }
        fetch("/api/friend", {
            method:"PUT",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
            if(data.ok){
                invitationFrame.remove()
            }
        })
    })
}
fetch("/api/friend/confirm").then((response)=>{
    return response.json()
}).then((data)=>{
    let allsendUser = data.allsendUser
    for(let i in allsendUser){
        let sendUserId = allsendUser[i].userId
        let sendUser = allsendUser[i].userName
        let sendUserAvatar = allsendUser[i].userAvatar
        let invitationFrame = notificationbar(sendUserId, sendUser, sendUserAvatar)
        notificationbarContent.appendChild(invitationFrame)
    }
})

function friends(userId, userName, userAvatar){
    const personDiv = document.createElement("div");
    personDiv.setAttribute("class", "Person")
    const avatarDiv = document.createElement("div");
    avatarDiv.setAttribute("class", "PersonAvatar")
    const avatarImg = document.createElement("img");
    avatarImg.setAttribute("src", userAvatar)
    avatarImg.setAttribute("width", "32px")
    avatarImg.setAttribute("class", "friendavatarImg")
    avatarDiv.appendChild(avatarImg);
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "PersonName")
    nameDiv.textContent = userName;
    personDiv.appendChild(avatarDiv);
    personDiv.appendChild(nameDiv);
    return personDiv
}

// fetch("/api/friend/member").then((response)=>{
//     return response.json()
// }).then((data)=>{
//     const path = window.location.pathname
//     const numbers = path.match(/\d+/g);
//     console.log(numbers)
//     let friendsData = data.data.friends
//     console.log(data.data.userId)
//     console.log(friendsData)
//     for(let i in friendsData){
//         for(let j in friendsData[i]){
//             let friendId =  friendsData[i][j].friendId
//             let userId =  friendsData[i][j].userId
//             if(userId == numbers){
//                 if(data.data.userId = friendId){
//                     const addFriendFrame = document.querySelector(".addFriendFrame")
//                     console.log(addFriendFrame)
    
//                     addFriendFrame.remove()
//                 }

//             }
//         }
//     }
// })