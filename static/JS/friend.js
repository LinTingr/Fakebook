function notificationbar(sendUserId, sendUser, sendUserAvatar){
    const invitationFrame = document.createElement("div");
    invitationFrame.className = "invitationFrame";
    const invitationAvatarMessageFrame = document.createElement("div");
    invitationAvatarMessageFrame.className = "invitationAvatarMessageFrame";
    const invitationAvatarFrame = document.createElement("div");
    invitationAvatarFrame.className = "invitationAvatarFrame";
    const invitationAvatar = document.createElement("img");
    invitationAvatar.className = "invitationAvatar";
    invitationAvatar.src = sendUserAvatar; // 設定圖片路徑
    invitationAvatarFrame.appendChild(invitationAvatar);
    const invitationMessage = document.createElement("div");
    invitationMessage.className = "invitationMessage";
    invitationMessage.textContent = sendUser + "傳送了交友邀請給你"; // 設定文字內容
    invitationAvatarMessageFrame.appendChild(invitationAvatarFrame);
    invitationAvatarMessageFrame.appendChild(invitationMessage);
    const chooseFrame = document.createElement("div");
    chooseFrame.className = "chooseFrame";
    const accept = document.createElement("div");
    accept.className = "accept";
    accept.textContent = "接受"; // 設定文字內容
    const reject = document.createElement("div");
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
        const AcceptedData = {
            confirm : "ACCEPTED",
            sendUserId : sendUserId,
            sendUserName : sendUser
        }
        fetch("/api/friend", {
            method:"PUT",
            body:JSON.stringify(AcceptedData),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data.ok){
                invitationFrame.remove()
                socket.emit("ACCEPTED", AcceptedData)
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
        notificationbarContent.insertBefore(invitationFrame, notificationbarContent.firstChild) 
    }
})