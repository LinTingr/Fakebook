const notificationbarContent = document.querySelector(".notificationbarContent")
const notifyFrame = document.querySelector(".notifyFrame")
const notificationbarFrame = document.querySelector(".notificationbarFrame")
const PersonFrame = document.querySelector(".PersonFrame")
const signOut = document.querySelector(".signOut")
const memberSystem = document.querySelector(".memberSystem")
const memberSystemFrame = document.querySelector(".memberSystemFrame")
const searchFrame = document.querySelector(".searchFrame")
const search = document.querySelector(".search")
const allSearchResult = document.querySelector(".allSearchResult")
const searchResultFrame = document.querySelector(".searchResultFrame")
const body = document.body
const chatCloseChat = document.querySelector(".chatCloseChat")
const chatInterfaceFrame = document.querySelector(".chatInterfaceFrame")
const chatroombarFrame = document.querySelector(".chatroombarFrame")
const chatFrame = document.querySelector(".chatFrame")
const memberCenter = document.querySelector(".memberCenter")
const memberNameLink = document.querySelector(".nameLink")
const socket = io();
let count = 0;
let nowUserName;
let nowUserAvatar;
let nowUserId;

fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        memberCenter.textContent = nowUserName;
        memberNameLink.href = "/member/" + nowUserId
        socket.emit("login", nowUserId)
    }else{
        window.location.href = "/login"
    }
})

fetch("/api/post/like/own").then(response=>{
    return response.json()
}).then(data=>{
    if(data){
        const getLikerSelfPost = data.getLikerSelfPost
        for(let i in getLikerSelfPost){
            const dateTime = timeCalculate(getLikerSelfPost[i].dateTime)
            if(getLikerSelfPost[i].userName !== nowUserName){
                let likeNotifyFrame = likeNotify(getLikerSelfPost[i].userId, 
                    getLikerSelfPost[i].userName, 
                    getLikerSelfPost[i].userAvatar, 
                    getLikerSelfPost[i].postId,
                    dateTime
                )
                notificationbarContent.appendChild(likeNotifyFrame)
            }
        }
    }
})

fetch("/api/society/invite").then((response)=>{
    return response.json()
}).then((data)=>{
    console.log(data)
    if(data){
        const invite = data.invite
        for(let i in invite){
            console.log(invite[i].societyId, 
                invite[i].userName, 
                invite[i].userAvatar)
            let societyInvite = NotifySocietyInviteFrame(
                invite[i].societyId,
                invite[i].societyName,
                invite[i].userId,
                invite[i].userName, 
                invite[i].userAvatar
            )
            notificationbarContent.appendChild(societyInvite)
        }
    }
})

//聊天通知
fetch("/api/chatMessage").then(response=>{
    return response.json()
}).then((data)=>{
    if(data){
        let allMessageLast = data.allMessageLast
        let chatroom = data.chatroom
        for(let i in chatroom){
            if(allMessageLast[i].reciveId == chatroom[i].reciveId){
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

function memberFriendnotifyClick(chatroomFrame, sendUserId, sendUserName, sendUserAvatar){
    chatroomFrame.addEventListener("click", ()=>{
        chatroombarFrame.style.display = "none"
        const aLLChatInterfaceFrame = document.querySelectorAll(".chatInterfaceFrame")
        const numberOfChat = document.querySelector(`#chat${sendUserId}`)
        if(numberOfChat){
            return
        }
        fetch(`/api/chatMessage/chat?memberId=${sendUserId}`).then((response)=>{
            return response.json()
        }).then((data)=>{
            let allMessage = data.allMessage
            const backChat = document.querySelector(".backChat")
            backChat.style.display = "flex"
            let chatroom = chatroomDiv(sendUserId, sendUserName, sendUserAvatar, allMessage)
            backChat.appendChild(chatroom)
            const chatID = backChat.querySelector(`#chat${sendUserId}`)
            const chatMessageBoxFrame = chatID.querySelector(".chatMessageBoxFrame")
            chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight
        })
        if(aLLChatInterfaceFrame.length>=3){
            const removechatframe = document.querySelector(".chatInterfaceFrame")
            removechatframe.remove()
        }
    }) 
}
// 聊天
function chatroomDiv(userId, userName, userAvatar, allMessage){
    const chatInterfaceFrame = document.createElement("div");
    const chatInterface = document.createElement("div");
    const chatTitleFrame = document.createElement("div");
    const chatImgFrame = document.createElement("div");
    const chatImg = document.createElement("img");
    const chatNameFrame = document.createElement("div");
    const chatName = document.createElement("span");
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
    chatCloseChatFrame.appendChild(chatCloseChat);
    chatTitleFrame.appendChild(chatImgFrame);
    chatTitleFrame.appendChild(chatNameFrame);
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
    backChat.style.display = "block";
    const chatID = document.querySelector(`#chat${content.sendUserId}`);
    const chatroombarContent = document.querySelector(".chatroombarContent");
    const notifyChatFrame = notifyChatFrameDiv(
        content.sendUserId,
        content.sendUserName,
        content.sendUserAvatar,
        content.message
    );
    if (chatID) {
        const chatMessageBoxFrame = chatID.querySelector(".chatMessageBoxFrame");
        const otherSideMessage = otherSideMessageFrame(
            content.sendUserId,
            content.sendUserName,
            content.sendUserAvatar,
            content.message
        );
        chatMessageBoxFrame.appendChild(otherSideMessage);
        chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight;
    } else {
        const chatroom = chatroomDiv(
            content.sendUserId,
            content.sendUserName,
            content.sendUserAvatar
        );
        backChat.appendChild(chatroom);
        const chatMessageBoxFrame = document.querySelector(".chatMessageBoxFrame");
        const response = await fetch(`/api/chatMessage/chat?memberId=${content.sendUserId}`);
        const data = await response.json();
        const allMessage = data.allMessage;
        for (let i in allMessage) {
            const message = allMessage[i];
            if (message.sendId == nowUserId) {
                const ownmessage = ownMessageFrame(message.content);
                chatMessageBoxFrame.appendChild(ownmessage);
            } else {
                const otherSideMessage = otherSideMessageFrame(
                    message.sendId,
                    message.userName,
                    message.userAvatar,
                    message.content
                );
                chatMessageBoxFrame.appendChild(otherSideMessage);
            }
        }
        // const otherSideMessage = otherSideMessageFrame(
        //     content.sendUserId,
        //     content.sendUserName,
        //     content.sendUserAvatar,
        //     content.message
        // );
        // chatMessageBoxFrame.appendChild(otherSideMessage);
        chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight;
    }
    chatroombarContent.appendChild(notifyChatFrame);
    //聊天通知
    fetch("/api/chatMessage").then(response=>{
        return response.json()
    }).then((data)=>{
        if(data){
            let allMessageLast = data.allMessageLast
            let chatroom = data.chatroom
            for(let i in chatroom){
                if(allMessageLast[i].reciveId == chatroom[i].reciveId){
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

function NotifySocietyInviteFrame(societyId, societyName, userId, userName, userAvatar){
    const societyLink = document.createElement("a");
    societyLink.setAttribute("href", "/society/" + societyId);
    const likerSelfPostFrame = document.createElement("div");
    likerSelfPostFrame.setAttribute("class", "likerSelfPostFrame");
    const likerSelfPostAvatarFrame = document.createElement("div");
    likerSelfPostAvatarFrame.setAttribute("class", "likerSelfPostAvatarFrame");
    const likerSelfPostAvatar = document.createElement("img");
    likerSelfPostAvatar.setAttribute("src", userAvatar);
    likerSelfPostAvatar.setAttribute("class", "likerSelfPostAvatar");
    likerSelfPostAvatarFrame.appendChild(likerSelfPostAvatar);
    const likerSelfPostTextFrame = document.createElement("div");
    likerSelfPostTextFrame.setAttribute("class", "likerSelfPostTextFrame");
    const likerSelfPostText = document.createElement("div");
    likerSelfPostText.setAttribute("class", "likerSelfPostText");
    likerSelfPostText.textContent = userName + " 邀請你加入社團 " + societyName;
    likerSelfPostTextFrame.appendChild(likerSelfPostText);
    likerSelfPostFrame.appendChild(likerSelfPostAvatarFrame);
    likerSelfPostFrame.appendChild(likerSelfPostTextFrame);
    societyLink.appendChild(likerSelfPostFrame);
    clickLink(societyLink, societyId, userId)
    return societyLink
}
function clickLink(societyLink, societyId, userId){
    const data = {
        societyId : societyId,
        userId : userId
    }
    societyLink.addEventListener("click", ()=>{
        fetch("/api/society/invite", {
            method:"PATCH",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        })
    })
}
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
//
function otherSideMessageFrame(sendUserId, sendUserName, sendUserAvatar, message){
    const otherSide = document.createElement("div");
    const otherSideAvatarFrame = document.createElement("div");
    const otherSideAvatar = document.createElement("img");
    const otherSideMessageFrame = document.createElement("div");
    const otherSideMessage = document.createElement("span");
    otherSide.setAttribute("class", "otherSide");
    otherSideAvatarFrame.setAttribute("class", "otherSideAvatarFrame");
    otherSideAvatar.setAttribute("class", "otherSideAvatar");
    otherSideAvatar.setAttribute("src", sendUserAvatar);
    otherSideMessageFrame.setAttribute("class", "otherSideMessageFrame");
    otherSideMessage.setAttribute("class", "otherSideMessage");
    otherSideMessage.textContent = message;
    otherSide.appendChild(otherSideAvatarFrame);
    otherSideAvatarFrame.appendChild(otherSideAvatar);
    otherSide.appendChild(otherSideMessageFrame);
    otherSideMessageFrame.appendChild(otherSideMessage);
    return otherSide
}

function ownMessageFrame(message){
    const own = document.createElement("div");
    const ownMessageFrame = document.createElement("div");
    const ownMessage = document.createElement("span");
    own.setAttribute("class", "own");
    ownMessageFrame.setAttribute("class", "ownMessageFrame");
    ownMessage.setAttribute("class", "ownMessage");
    ownMessage.textContent = message;
    ownMessageFrame.appendChild(ownMessage);
    own.appendChild(ownMessageFrame);
    return own
}
//
function likeNotify(userId, userName, userAvatar, postId, dateTime){
    const likerSelfPostFrame = document.createElement("div");
    likerSelfPostFrame.setAttribute("class", "likerSelfPostFrame");
    const likerSelfPostAvatarFrame = document.createElement("div");
    likerSelfPostAvatarFrame.setAttribute("class", "likerSelfPostAvatarFrame");
    const likerSelfPostAvatar = document.createElement("img");
    likerSelfPostAvatar.setAttribute("src", userAvatar);
    likerSelfPostAvatar.setAttribute("class", "likerSelfPostAvatar");
    likerSelfPostAvatarFrame.appendChild(likerSelfPostAvatar);
    const likerSelfPostTextFrame = document.createElement("div");
    likerSelfPostTextFrame.setAttribute("class", "likerSelfPostTextFrame");
    const likerSelfPostText = document.createElement("div");
    likerSelfPostText.setAttribute("class", "likerSelfPostText");
    likerSelfPostText.textContent = userName + "喜歡你得貼文";
    likerSelfPostTextFrame.appendChild(likerSelfPostText);
    const likerSelfPostTime = document.createElement("div");
    likerSelfPostTime.setAttribute("class", "likerSelfPostTime");
    likerSelfPostTime.textContent = dateTime;
    likerSelfPostTextFrame.appendChild(likerSelfPostTime);
    likerSelfPostFrame.appendChild(likerSelfPostAvatarFrame);
    likerSelfPostFrame.appendChild(likerSelfPostTextFrame);
    return likerSelfPostFrame
}

function timeCalculate(dateTime) {
    const now = new Date().getTime();
    const timeDifference = now - dateTime;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if(timeDifference < minute) {
        return "剛剛";
    }else if(timeDifference < hour) {
        return Math.floor(timeDifference / minute) + "分鐘前";
    }else if(timeDifference < day) {
        return Math.floor(timeDifference / hour) + "小時前";
    }else if(timeDifference < week){
        return Math.floor(timeDifference / day) + "天前";
    }else{
        return Math.floor(timeDifference / week) + "周前";
    }
}

function searchDiv(userId, userName, userAvatar){
    const searchResultLink = document.createElement("a");
    searchResultLink.setAttribute("href", userId);
    searchResultLink.setAttribute("class", "searchResultLink");
    const searchResultDiv = document.createElement("div");
    searchResultDiv.setAttribute("class", "searchResult");
    const imageFrameDiv = document.createElement("div");
    imageFrameDiv.setAttribute("class", "searchResultImageFrame");
    const image = document.createElement("img");
    image.setAttribute("class", "searchResultImage");
    image.setAttribute("src", userAvatar);
    imageFrameDiv.appendChild(image);
    const textFrameDiv = document.createElement("div");
    textFrameDiv.setAttribute("class", "searchResultTextFrame");
    const text = document.createElement("span");
    text.setAttribute("class", "searchResultText");
    text.textContent = userName;
    textFrameDiv.appendChild(text);
    searchResultDiv.appendChild(imageFrameDiv);
    searchResultDiv.appendChild(textFrameDiv);
    searchResultLink.appendChild(searchResultDiv);
    return searchResultLink
}

search.addEventListener("input", ()=>{
    let text = search.value
    fetch(`/api/search?text=${text}`).then((response)=>{
        return response.json()
    }).then((data)=>{
        let memberResult = data.memberResult
        let societyResult = data.societyResult
        allSearchResult.innerHTML = ""
        if(memberResult[0] || societyResult[0]){
            if(memberResult[0]){
                searchResultFrame.style.display = "block"
                for(i in memberResult){
                    let search = searchDiv(
                        "/member/" + memberResult[i].userId,
                        memberResult[i].userName, 
                        memberResult[i].userAvatar)
                    allSearchResult.appendChild(search)
                }
            }
            if(societyResult[0]){
                searchResultFrame.style.display = "block"
                for(i in societyResult){
                    let societyPicture = societyResult[i].societyPicture
                    if(societyResult[i].societyPicture == null){
                        societyPicture = "/icon/society.png"
                    }
                    let search = searchDiv(
                        "/society/" + societyResult[i].societyId,
                        societyResult[i].societyName, 
                        societyPicture)
                    allSearchResult.appendChild(search)
                }
            }
        }else{
            searchResultFrame.style.display = "block"
            const noResult = document.createElement("div")
            noResult.setAttribute("class", "noResult")
            noResult.textContent = "無相關搜尋結果"
            allSearchResult.appendChild(noResult)
        }
    })
})

searchFrame.addEventListener("click", function(e) {
    e.stopPropagation()
})

body.addEventListener("click", function() {
    searchResultFrame.style.display = "none"
})

searchResultFrame.addEventListener("click", function(e) {
    e.stopPropagation()
})


signOut.addEventListener("click", ()=>{
    fetch("/api/user",{
        method : "DELETE"
    }).then(response=>{
        return response.json()
    }).then(data=>{
        if(data.ok){
            location.reload()
        }
    })
})

memberSystemFrame.addEventListener("click", function(e) {
    memberSystem.style.display = "flex"
    chatroombarFrame.style.display = "none"
    notificationbarFrame.style.display = "none" 
    e.stopPropagation()
})
body.addEventListener("click", function() {
    memberSystem.style.display = "none"
})
memberSystem.addEventListener("click", function(e) {
    e.stopPropagation()
})

//通知欄
notifyFrame.addEventListener("click", function(e) {
    e.stopPropagation()
    notificationbarFrame.style.display = "block"
    chatroombarFrame.style.display = "none"
    memberSystem.style.display = "none"
})
body.addEventListener("click", function() {
    notificationbarFrame.style.display = "none"
    chatroombarFrame.style.display = "none"
})
notificationbarFrame.addEventListener("click", function(e) {
    e.stopPropagation()
})

//聊天室
chatFrame.onclick = function(e) {
  e.stopPropagation()
  chatroombarFrame.style.display = "block"
  notificationbarFrame.style.display = "none"
  memberSystem.style.display = "none"
}

body.onclick = function() {
  chatroombarFrame.style.display = "none"
  notificationbarFrame.style.display = "none" 
}

chatroombarFrame.onclick = function(e) {
  e.stopPropagation()
}

signOut.addEventListener("click", ()=>{
    fetch("/api/user",{
        method : "DELETE"
    }).then(response=>{
        return response.json()
    }).then(data=>{
        if(data.ok){
            location.reload()
        }
    })
})