// 聊天
function chatroomDiv(userId, userName, userAvatar, allMessage){
    const chatInterfaceFrame = document.createElement("div");
    const chatInterface = document.createElement("div");
    const chatTitleFrame = document.createElement("div");
    const chatImgFrame = document.createElement("div");
    const chatImg = document.createElement("img");
    const chatNameFrame = document.createElement("div");
    const chatName = document.createElement("span");
    // const chatMinusFrame = document.createElement("div");
    // const chatMinus = document.createElement("img");
    const chatCloseChatFrame = document.createElement("div");
    const chatCloseChat = document.createElement("img");
    const chatMessageBoxFrame = document.createElement("div");
    const chatInputFrame = document.createElement("div");
    const chatInput = document.createElement("input");
    const chatSend = document.createElement("img");
    chatInterfaceFrame.setAttribute("class", "chatInterfaceFrame");
    chatInterfaceFrame.setAttribute("id", `chat${userId}`);
    chatInterface.setAttribute("class", "chatInterface");
    chatTitleFrame.setAttribute("class", "chatTitleFrame");
    chatImgFrame.setAttribute("class", "chatImgFrame");
    chatImg.setAttribute("src", userAvatar);
    chatImg.setAttribute("class", "chatImg");
    chatNameFrame.setAttribute("class", "chatNameFrame");
    chatName.setAttribute("class", "chatName");
    chatName.textContent = userName
    // chatMinusFrame.setAttribute("class", "chatMinusFrame");
    // chatMinus.setAttribute("src", "/icon/minus.png");
    // chatMinus.setAttribute("class", "chatMinus");
    chatCloseChatFrame.setAttribute("class", "chatCloseChatFrame");
    chatCloseChat.setAttribute("src", "/icon/closechat.png");
    chatCloseChat.setAttribute("class", "chatCloseChat");
    chatMessageBoxFrame.setAttribute("class", "chatMessageBoxFrame");
    chatInputFrame.setAttribute("class", "chatInputFrame");
    chatInput.setAttribute("type", "text");
    chatInput.setAttribute("class", "chatInput");
    chatInput.setAttribute("placeholder", "Aa");
    chatSend.setAttribute("src", "/icon/send.png");
    chatSend.setAttribute("class", "chatSend");
    chatImgFrame.appendChild(chatImg);
    chatNameFrame.appendChild(chatName);
    // chatMinusFrame.appendChild(chatMinus);
    chatCloseChatFrame.appendChild(chatCloseChat);
    chatTitleFrame.appendChild(chatImgFrame);
    chatTitleFrame.appendChild(chatNameFrame);
    // chatTitleFrame.appendChild(chatMinusFrame);
    chatTitleFrame.appendChild(chatCloseChatFrame);
    chatInputFrame.appendChild(chatInput);
    chatInputFrame.appendChild(chatSend);
    chatInterface.appendChild(chatTitleFrame);
    chatInterface.appendChild(chatMessageBoxFrame);
    chatInterface.appendChild(chatInputFrame);
    chatInterfaceFrame.appendChild(chatInterface);
    inputchat(chatInputFrame, chatInput, chatSend, userId, userName)
    chatcontent(chatMessageBoxFrame, allMessage)
    closechatclose(chatCloseChat, chatInterfaceFrame)
    return chatInterfaceFrame
}
function closechatclose(chatCloseChat, chatInterfaceFrame){
    chatCloseChat.addEventListener("click", ()=>{
        chatInterfaceFrame.remove()
    })
}
function chatcontent(chatMessageBoxFrame , allMessage){
    for(let i in allMessage){
        if(allMessage[i].sendId == nowUserId){
            const ownmessage = ownMessageFrame(allMessage[i].content)
            chatMessageBoxFrame.appendChild(ownmessage)
        }else{
            let otherSideMessage = otherSideMessageFrame(allMessage[i].sendId, allMessage[i].userName, allMessage[i].userAvatar, allMessage[i].content)
            chatMessageBoxFrame.appendChild(otherSideMessage)
        }
    }
}
function inputchat(chatInputFrame, chatInput, chatSend, userId, userName){
    chatInputFrame.addEventListener("keydown", function(event) {
        if(event.keyCode === 13){
            let message = chatInput.value
            sendMessage(chatInput, message, userId, userName, nowUserAvatar);
        }
    })
    chatSend.addEventListener("click", ()=>{
        console.log(1)
        let message = chatInput.value
        sendMessage(chatInput, message, userId, userName, nowUserAvatar);
    })
}

function sendMessage(chatInput, message, userId, userName, nowUserAvatar){
    if(chatInput.value != ""){
        socket.emit("sendMessage", {
            sendUserId : nowUserId,
            sendUserName : nowUserName,
            sendUserAvatar : nowUserAvatar,
            receiveUserId : userId,
            receiveUserName : userName,
            message: message
        })
        const dateTime = new Date();
        const timestamp = dateTime.getTime();
        let data = {
            sendUserId : nowUserId,
            sendUserName : nowUserName,
            receiveUserId : userId,
            receiveUserName : userName,
            message : message,
            timestamp : timestamp
        }
        fetch("/api/chatMessage", {
            method:"POST",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
            const ownmessage = ownMessageFrame(message)
            const chatID = document.querySelector(`#chat${userId}`)
            const chatMessageBoxFrame = chatID.querySelector(".chatMessageBoxFrame")
            chatMessageBoxFrame.appendChild(ownmessage)
            chatInput.value = ""
            chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight
            //聊天通知
            fetch("/api/chatMessage").then(response=>{
                return response.json()
            }).then((data)=>{
                console.log(1)
                if(data){
                    let allMessageLast = data.allMessageLast
                    let chatroom = data.chatroom
                    const chatroombarContent = document.querySelector(".chatroombarContent")
                    chatroombarContent.innerHTML = ""
                    for(let i in chatroom){
                        if(allMessageLast[i].reciveId == chatroom[i].reciveId){
                            const notifyChatFrame = notifyChatFrameDiv(
                                chatroom[i].reciveId, 
                                chatroom[i].userName, 
                                chatroom[i].userAvatar,
                                allMessageLast[i].messageLast[0].content
                            )
                            chatroombarContent.appendChild(notifyChatFrame)
                        }
                    }
                }
            })
        })
    }
}
const backChat = document.querySelector(".backChat")
socket.on("privateMessage",async(content)=>{
    backChat.style.display = ""
    const chatID  = document.querySelector(`#chat${content.sendUserId}`)
    if(chatID){
        const chatMessageBoxFrame = chatID.querySelector(".chatMessageBoxFrame")
        const otherSideMessage = otherSideMessageFrame(content.sendUserId, content.sendUserName, content.sendUserAvatar, content.message)
        chatMessageBoxFrame.appendChild(otherSideMessage)
        const chatroombarContent = document.querySelector(".chatroombarContent")
        const notifyChatFrame = notifyChatFrameDiv(content.sendUserId, content.sendUserName, content.sendUserAvatar, content.message)
        chatroombarContent.appendChild(notifyChatFrame)
        chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight
    }else{
        const chatroom = chatroomDiv(content.sendUserId, content.sendUserName, content.sendUserAvatar)
        backChat.appendChild(chatroom)
        const chatMessageBoxFrame = document.querySelector(".chatMessageBoxFrame")
        await fetch(`/api/chatMessage/chat?memberId=${content.sendUserId}`).then((response)=>{
            return response.json()
        }).then((data)=>{
            const allMessage = data.allMessage
            for(let i in allMessage){
                if(allMessage[i].sendId == nowUserId){
                    const ownmessage = ownMessageFrame(allMessage[i].content)
                    chatMessageBoxFrame.appendChild(ownmessage)
                }else{
                    let otherSideMessage = otherSideMessageFrame(allMessage[i].sendId, allMessage[i].userName, allMessage[i].userAvatar, allMessage[i].content)
                    chatMessageBoxFrame.appendChild(otherSideMessage)
                }
            }
            let otherSideMessage = otherSideMessageFrame(content.sendUserId, content.sendUserName, content.sendUserAvatar, content.message)
            chatMessageBoxFrame.appendChild(otherSideMessage)
            chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight
        })
        const chatroombarContent = document.querySelector(".chatroombarContent")
        const notifyChatFrame = notifyChatFrameDiv(content.sendUserId, content.sendUserName, content.sendUserAvatar, content.message)
        chatroombarContent.appendChild(notifyChatFrame)
    }
    //聊天通知
    fetch("/api/chatMessage").then(response=>{
        return response.json()
    }).then((data)=>{
        console.log(data)
        if(data){
            let allMessageLast = data.allMessageLast
            let chatroom = data.chatroom
            for(let i in chatroom){
                if(allMessageLast[i].reciveId == chatroom[i].reciveId){
                    console.log(123)
                    const chatroombarContent = document.querySelector(".chatroombarContent")
                    const notifyChatFrame = notifyChatFrameDiv(
                        chatroom[i].reciveId, 
                        chatroom[i].userName, 
                        chatroom[i].userAvatar,
                        allMessageLast[i].messageLast[0].content
                        )
                    chatroombarContent.appendChild(notifyChatFrame)
                }
            }
        }
    })
})

function notifyChatFrameDiv(sendUserId, sendUserName, sendUserAvatar, message){
    const chatroomFrame = document.createElement("div");
    const chatroomAvatarFrame = document.createElement("div");
    const chatroomAvatar = document.createElement("img");
    const chatroomNameFrame = document.createElement("div");
    const chatroomName = document.createElement("div");
    const chatroomMessageContent = document.createElement("div");
    chatroomFrame.setAttribute("class", "chatroomFrame");
    chatroomAvatarFrame.setAttribute("class", "chatroomAvatarFrame");
    chatroomAvatar.setAttribute("class", "chatroomAvatar");
    chatroomAvatar.setAttribute("src", sendUserAvatar);
    chatroomNameFrame.setAttribute("class", "chatroomNameFrame");
    chatroomName.setAttribute("class", "chatroomName");
    chatroomName.textContent = sendUserName;
    chatroomMessageContent.setAttribute("class", "chatroomMessageContent");
    chatroomMessageContent.textContent = message;
    chatroomFrame.appendChild(chatroomAvatarFrame);
    chatroomAvatarFrame.appendChild(chatroomAvatar);
    chatroomFrame.appendChild(chatroomNameFrame);
    chatroomNameFrame.appendChild(chatroomName);
    chatroomNameFrame.appendChild(chatroomMessageContent);
    memberFriendnotifyClick(chatroomFrame, sendUserId, sendUserName, sendUserAvatar)
    return chatroomFrame
}