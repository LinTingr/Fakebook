function postArticle(postId, societyId, dateTime, postText, images, postLike, postUserId, userName, userAvatar, postComment, location){
    const postBlockDiv = document.createElement("div");
    postBlockDiv.setAttribute("class", "postBlock");
    const postContainerDiv = document.createElement("div");
    const postmemberLink = document.createElement("a");
    postmemberLink.setAttribute("class", "postmemberLink");
    postmemberLink.setAttribute("href", "/member/" + postUserId);
    const postAvatarDiv = document.createElement("div");
    postAvatarDiv.setAttribute("class", "postAvatar");
    const postAvatarImg = document.createElement("img");
    if(userAvatar){
        postAvatarImg.setAttribute("src", userAvatar);
        postAvatarImg.setAttribute("class", "userAvatarImg");
    }else{
        postAvatarImg.setAttribute("src", "/icon/member_icon.png");
    }
    postmemberLink.appendChild(postAvatarImg);
    postAvatarDiv.appendChild(postmemberLink);
    const postMembernameLink = document.createElement("a");
    postMembernameLink.setAttribute("href", "/member/" + postUserId);
    const postMembernameDiv = document.createElement("div");
    postMembernameDiv.setAttribute("class", "postmembername");
    postMembernameLink.textContent = userName;
    const postAvatarMembernameDiv = document.createElement("div");
    postAvatarMembernameDiv.setAttribute("class", "postAvatarMembername");
    postAvatarMembernameDiv.appendChild(postAvatarDiv);
    postMembernameDiv.appendChild(postMembernameLink);
    postAvatarMembernameDiv.appendChild(postMembernameDiv);
    if(location){
        const postMemberlocationspan = document.createElement("span");
        const postMemberlocationlnk = document.createElement("a");
        postMemberlocationspan.setAttribute("class","postMemberlocation")
        postMemberlocationlnk.setAttribute("href",`https://www.google.com/maps/search/?api=1&query=${location}`)
        postMemberlocationlnk.setAttribute("class","postMemberlocationlink")
        postMemberlocationlnk.textContent = " __在 "
        postMemberlocationspan.textContent = location;
        postMemberlocationlnk.appendChild(postMemberlocationspan)
        postAvatarMembernameDiv.appendChild(postMemberlocationlnk)
    }
    const hr = document.createElement("hr");
    // const postContainerDiv = document.createElement("div");
    postContainerDiv.setAttribute("class", "postContainer");
    postContainerDiv.appendChild(postAvatarMembernameDiv);
    postContainerDiv.appendChild(hr);
    //
    const postContextDiv = document.createElement("div");
    postContextDiv.setAttribute("class", "postcontext");
    if(postText){
        postContextDiv.textContent = postText;
    }else{
        postContextDiv.textContent = "";
    }
    const likeIconImg = document.createElement("img");
    likeIconImg.setAttribute("src", "/icon/facebooklike.png");
    likeIconImg.setAttribute("width", "30px");
    const likeCountDiv = document.createElement("div");
    likeCountDiv.setAttribute("class", "likeCount");
    if(postLike){
        likeCountDiv.textContent = postLike["count"];
    }else{
        likeCountDiv.textContent = "0"
    }
    
    const likeIconFrameDiv = document.createElement("div");
    likeIconFrameDiv.setAttribute("class", "likeiconFrame hover");
    likeIconFrameDiv.appendChild(likeIconImg);
    likeIconFrameDiv.appendChild(likeCountDiv);
    const messageIconImg = document.createElement("img");
    messageIconImg.setAttribute("src", "/icon/chatmessage.png");
    messageIconImg.setAttribute("width", "30px");
    const messageCountDiv = document.createElement("div");
    messageCountDiv.setAttribute("class", "messageCount");
    if(postComment.length){
        messageCountDiv.textContent = postComment.length;
    }else{
        messageCountDiv.textContent = 0;
    }
    const messageIconFrameDiv = document.createElement("div");
    messageIconFrameDiv.setAttribute("class", "messiconFrame hover");
    messageIconFrameDiv.appendChild(messageIconImg);
    messageIconFrameDiv.appendChild(messageCountDiv);
    const likeMessageIconCountFrameDiv = document.createElement("div");
    likeMessageIconCountFrameDiv.setAttribute("class", "likeMessageiconCountFrame");
    likeMessageIconCountFrameDiv.appendChild(likeIconFrameDiv);
    likeMessageIconCountFrameDiv.appendChild(messageIconFrameDiv);
    const hr1 = document.createElement("hr");
    postContainerDiv.appendChild(postContextDiv);
    if(images){
        const postimageFrame = document.createElement("div");
        postimageFrame.setAttribute("class", "postimageFrame");
        for(let i in images){
            const postImage = document.createElement("img");
            postImage.setAttribute("class", "postImage");
            postImage.setAttribute("src", images[i]);
            postimageFrame.appendChild(postImage);
        }
        postContainerDiv.appendChild(postimageFrame);
    }
    postContainerDiv.appendChild(likeMessageIconCountFrameDiv);
    postContainerDiv.appendChild(hr1);
    //
    const likeMessageiconFrame = document.createElement("div");
    likeMessageiconFrame.setAttribute("class", "likeMessageiconFrame");
    const likeclickFrame = document.createElement("div");
    likeclickFrame.setAttribute("class", "likeclickFrame hover");
    const likeImg = document.createElement("img");

    let likeCount = 0
    console.log("postLike",postLike)
    if(postLike["clickLike"]){
        likeCount = 1
        likeImg.setAttribute("src", "/icon/fblike1.png");
    }else{
        likeImg.setAttribute("src", "/icon/fblike.png");
    }

    likeImg.setAttribute("width", "36px");
    likeImg.setAttribute("class", "likeclick");
    const likeText = document.createTextNode("讚");
    likeclickFrame.appendChild(likeImg);
    likeclickFrame.appendChild(likeText);
    const messagechatFrame = document.createElement("div");
    messagechatFrame.setAttribute("class", "messagechatFrame hover");
    const messageImg = document.createElement("img");
    messageImg.setAttribute("src", "/icon/chatmessage.png");
    messageImg.setAttribute("width", "30px");
    const messageText = document.createTextNode("留言");
    messagechatFrame.appendChild(messageImg);
    messagechatFrame.appendChild(messageText);
    const shareclickFrame = document.createElement("div");
    shareclickFrame.setAttribute("class", "shareclickFrame hover");
    const shareImg = document.createElement("img");
    shareImg.setAttribute("src", "/icon/share.png");
    shareImg.setAttribute("width", "32px");
    const shareText = document.createTextNode("分享");
    shareclickFrame.appendChild(shareImg);
    shareclickFrame.appendChild(shareText);
    likeMessageiconFrame.appendChild(likeclickFrame);
    likeMessageiconFrame.appendChild(messagechatFrame);
    likeMessageiconFrame.appendChild(shareclickFrame);
    const hr2 = document.createElement("hr");
    postContainerDiv.appendChild(likeMessageiconFrame);
    postContainerDiv.appendChild(hr2);

    likeClick(likeclickFrame, likeImg, likeCount, postId, likeIconFrameDiv)
    //
//     const AllchatFrame = document.createElement("div");
//     AllchatFrame.setAttribute("class", "AllchatFrame");
// //
//     const watchmorechatmessage = document.createElement("div");
//     watchmorechatmessage.setAttribute("class", "watchmorechatmessage");
//     watchmorechatmessage.textContent = "查看更多留言...";
//     AllchatFrame.appendChild(watchmorechatmessage);
    const allchatmessageFrame = document.createElement("div");
    allchatmessageFrame.setAttribute("class", "allchatmessageFrame none");
//
    for(let i = 0 ; i< postComment.length; i++){
        const avatarchatmessageFrame = document.createElement("div");
        avatarchatmessageFrame.setAttribute("class", "avatarchatmessageFrame");
        const avatarFrame = document.createElement("div");
        avatarFrame.setAttribute("class", "avatarFrame");
        const postMemberavatarLink = document.createElement("a");
        postMemberavatarLink.setAttribute("href", "/member/" + postComment[i].postCommentUserId);
        const userAvatarchat = document.createElement("img");
        userAvatarchat.setAttribute("src", postComment[i].postCommentAvatar);
        userAvatarchat.setAttribute("class", "userAvatar");
        avatarFrame.appendChild(postMemberavatarLink);
        postMemberavatarLink.appendChild(userAvatarchat);
        avatarchatmessageFrame.appendChild(avatarFrame);
        const userChatmessageFrame = document.createElement("div");
        userChatmessageFrame.setAttribute("class", "userChatmessageFrame");
        const userChatmessageName = document.createElement("div");
        const postMembernameDiv = document.createElement("div");
        postMembernameDiv.setAttribute("class", "postmembername");
        const postMembernameLink = document.createElement("a");
        postMembernameLink.setAttribute("href", "/member/" + postComment[i].postCommentUserId);
        postMembernameLink.textContent = postComment[i].postCommentUserName;
        userChatmessageName.setAttribute("class", "userChatmessageName");
        userChatmessageName.appendChild(postMembernameLink);
        userChatmessageFrame.appendChild(userChatmessageName);
        const userChatmessageMess = document.createElement("div");
        userChatmessageMess.setAttribute("class", "userChatmessageMess");
        userChatmessageMess.textContent = postComment[i].commentText;
        userChatmessageFrame.appendChild(userChatmessageMess);
        allchatmessageFrame.appendChild(avatarchatmessageFrame)
        avatarchatmessageFrame.appendChild(userChatmessageFrame);
    }
//
    
    postContainerDiv.appendChild(allchatmessageFrame)

    // 
    const chatBoxFrame = document.createElement("div");
    chatBoxFrame.setAttribute("class", "chatBoxFrame");
    // const chatboxAvatarFrame = document.createElement("div");
    // chatboxAvatarFrame.setAttribute("class", "chatboxAvatarFrame");
    const chatboxAvatarFrame = document.createElement("div");
    chatboxAvatarFrame.setAttribute("class", "chatboxAvatarFrame");
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", nowUserAvatar);
    imgElement.setAttribute("class", "userAvatarimgElement");
    chatboxAvatarFrame.appendChild(imgElement);
    // chatboxAvatarFrame.appendChild(chatboxAvatarFrameChild);
    const chatboxInputFrame = document.createElement("div");
    chatboxInputFrame.setAttribute("class", "chatboxInputFrame");
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "留言···");
    inputElement.setAttribute("class", "chatboxInput");

    let chatCount = 0
    chatMessage(chatboxInputFrame, postId, userName, userAvatar, messagechatFrame, allchatmessageFrame, messageIconFrameDiv, chatCount)
    lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount)
    chatboxInputFrame.appendChild(inputElement);
    chatBoxFrame.appendChild(chatboxAvatarFrame);
    chatBoxFrame.appendChild(chatboxInputFrame);
    postContainerDiv.appendChild(chatBoxFrame)
    postBlockDiv.appendChild(postContainerDiv);
    return postBlockDiv
}
function likeClick(likeclickFrame, likeImg, likeCount, postId, likeIconFrameDiv){
    likeclickFrame.addEventListener("click", ()=>{
        let postlikeCount = likeIconFrameDiv.querySelector(".likeCount").textContent
        console.log(postlikeCount)
        postlikeCount = parseInt(postlikeCount)
        console.log(typeof(postlikeCount))
        if(likeCount){
            likeImg.src = "/icon/fblike.png"
            postlikeCount -= 1
            console.log(postlikeCount)
            likeIconFrameDiv.querySelector(".likeCount").textContent = postlikeCount
            likeCount -= 1
        }else{
            likeImg.src = "/icon/fblike1.png"
            postlikeCount += 1
            console.log(postlikeCount)
            likeIconFrameDiv.querySelector(".likeCount").textContent = postlikeCount
            likeCount += 1
        }
        let data = {
            likeCount : likeCount,
            postId : postId
        }
        fetch("/api/post/like", {
            method:"POST",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
        })

    })
}
function lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount){
    messagechatFrame.addEventListener("click", ()=>{
        if(chatCount){
            allchatmessageFrame.className = "allchatmessageFrame none"
            chatCount = 0
        }else{
            allchatmessageFrame.className = "allchatmessageFrame"
            chatCount = 1
        }
        
    })
    return chatCount
}
function chatMessage(chatboxInputFrame, postId, userName, userAvatar, messagechatFrame, allchatmessageFrame, messageIconFrameDiv, chatCount){
    chatboxInputFrame.addEventListener("keydown", (event)=>{
        if(event.keyCode === 13){
            const chatboxInput = chatboxInputFrame.querySelector(".chatboxInput")
            let messageCount = messageIconFrameDiv.querySelector(".messageCount").textContent
            const dateTime = new Date();
            const timestamp = dateTime.getTime();
            let data = {
                postId :postId,
                comment : chatboxInput.value,
                dateTime : timestamp
            }
            const avatarchatmessageFrame = document.createElement("div");
            avatarchatmessageFrame.setAttribute("class", "avatarchatmessageFrame");
            const avatarFrame = document.createElement("div");
            avatarFrame.setAttribute("class", "avatarFrame");
            const postMemberavatarLink = document.createElement("a");
            postMemberavatarLink.setAttribute("href", "/member/" + nowUserId);
            const userAvatarchat = document.createElement("img");
            userAvatarchat.setAttribute("src", nowUserAvatar);
            userAvatarchat.setAttribute("class", "userAvatar");
            avatarFrame.appendChild(postMemberavatarLink);
            postMemberavatarLink.appendChild(userAvatarchat);
            avatarchatmessageFrame.appendChild(avatarFrame);
            const userChatmessageFrame = document.createElement("div");
            userChatmessageFrame.setAttribute("class", "userChatmessageFrame");
            const userChatmessageName = document.createElement("div");
            userChatmessageName.setAttribute("class", "userChatmessageName");
            const postMembernameLink = document.createElement("a");
            postMembernameLink.setAttribute("href", "/member/" + nowUserId);
            postMembernameLink.textContent = nowUserName;
            userChatmessageName.setAttribute("class", "userChatmessageName");
            userChatmessageName.appendChild(postMembernameLink);
            userChatmessageFrame.appendChild(userChatmessageName);
            userChatmessageFrame.appendChild(userChatmessageName);
            const userChatmessageMess = document.createElement("div");
            userChatmessageMess.setAttribute("class", "userChatmessageMess");
            userChatmessageMess.textContent = chatboxInput.value;
            userChatmessageFrame.appendChild(userChatmessageMess);
            allchatmessageFrame.appendChild(avatarchatmessageFrame)
            avatarchatmessageFrame.appendChild(userChatmessageFrame);
            messageCount = parseInt(messageCount)
            messageCount += 1
            messageIconFrameDiv.querySelector(".messageCount").textContent = messageCount
            allchatmessageFrame.className = "allchatmessageFrame"
            chatCount = 1
            lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount)
            
            
            fetch("/api/post/comment", {
                method:"POST",
                body:JSON.stringify(data),
                headers:new Headers({
                    "content-type": "application/json"
                })
            }).then((response)=>{
                return response.json()
            }).then((data)=>{
                console.log(data)
            })
            chatboxInput.value = ""
        }
    })
}


