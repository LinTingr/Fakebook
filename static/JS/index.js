const membername = document.querySelector(".membername")
const memberSystemAvatar = document.querySelector(".memberSystemAvatar")
const memberavatar = document.querySelector(".memberavatar")
const memberPostAvatarImg = document.querySelector(".memberPostAvatarImg")
const lastclickPost = document.querySelector(".lastclickPost")
const postTextInput = document.querySelector(".postTextInput")
const searchlocation = document.querySelector(".searchlocation")
const searchresultframeback = document.querySelector(".searchresultframeback")
const closelocation = document.querySelector(".closelocation")
const closeImage = document.querySelector(".closeImage")
const backgroundFrame = document.querySelector(".backgroundFrame")
const locationFrame = document.querySelector(".locationFrame")
const memberPostLocation = document.querySelector(".memberPostLocation")
const memberPostPicture = document.querySelector(".memberPostPicture")
const selectlocation = document.querySelector(".selectlocation")
const findlocation = document.querySelector(".findlocation")
const upload = document.querySelector(".upload")
const output = document.querySelector(".output")
const imagePreview = document.querySelector(".imagePreview")
const errorMessage = document.querySelector(".errorMessage")
const imageFrame = document.querySelector(".imageFrame")
const button = document.querySelector(".button")
const AllPostFrame = document.querySelector(".AllPostFrame")
const allArticle = document.querySelector(".allArticle")
const memberLink = document.querySelector(".memberLink")
const memberCenter = document.querySelector(".memberCenter")
const nameLink = document.querySelectorAll(".nameLink")
// const invitationAvatar = document.querySelector(".invitationAvatar")
// const invitationMessage = document.querySelector(".invitationMessage")

let nextPage = 0;
let nowUserName;
let nowUserAvatar;
let nowUserId;

fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    console.log(data)
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        membername.textContent = nowUserName;
        memberLink.textContent = nowUserName;
        memberSystemAvatar.src = nowUserAvatar;
        memberavatar.src = nowUserAvatar;
        memberPostAvatarImg.src = nowUserAvatar;
        nameLink.forEach((element)=>{
            element.href = "/member/" + nowUserId
        })
    }else{
        window.location.href = "/login"
    }
})

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
        console.log(sendUserId)
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

fetch("/api/friend").then((response)=>{
    return response.json()
}).then((data)=>{
    let friendsData = data.data.friends
    console.log(friendsData)
    for(let i in friendsData){
        let userId =  friendsData[i].userId
        let userName = friendsData[i].userName
        let userAvatar = friendsData[i].userAvatar
        let friend = friends(userId, userName, userAvatar)
        PersonFrame.appendChild(friend)
    }
})

fetch(`/api/post?postPage=${nextPage}`).then((response)=>{
    return response.json()
}).then((data)=>{
    console.log(data)
    const next = data.nextPage
    const article = data.articleData
    for(let i = 0; i < article.length; i++){
        let newPostArticle = postArticle(
            article[i].postId,
            article[i].societyId,
            article[i].postDateTime,
            article[i].postText,
            article[i].images,
            article[i].postLike,
            article[i].postUserId,
            article[i].postUserName,
            article[i].postUserAvatar,
            article[i].postComment,
            article[i].location)
        allArticle.appendChild(newPostArticle)
    }
    if (next == 1){
        nextPage = nextPage + 1 ;
    }else{
        nextPage = null;
    }
    getPost();
})



memberPostLocation.addEventListener("click", ()=>{
    backgroundFrame.style.display = "flex";
    locationFrame.className = "locationFrame";
})
memberPostPicture.addEventListener("click", ()=>{
    backgroundFrame.style.display = "flex";
    imageFrame.className = "imageFrame";
})

closelocation.addEventListener("click", ()=>{
    backgroundFrame.style.display = "none";
    locationFrame.className = "locationFrame none";
})

closeImage.addEventListener("click", ()=>{
    backgroundFrame.style.display = "none";
    imageFrame.className = "imageFrame none";
    imagePreview.innerHTML = ""
    upload.value = "";
    memberPostPicture.classList.remove("color")
})
button.addEventListener("click", ()=>{
    if(upload.files.length != 0){
        backgroundFrame.style.display = "none";
        imageFrame.className = "imageFrame none";
        let file = upload.files;
        console.log(file)
        memberPostPicture.classList.add("color")
    }
})


function locationframe(name, address, i){
    const searchresultframe = document.createElement("div");
    if(i%2){
        searchresultframe.setAttribute("class","searchresultframe color hover");
    }else{
        searchresultframe.setAttribute("class","searchresultframe hover");
    }
    const searchIcon = document.createElement("div");
    searchIcon.setAttribute("class","searchIcon");
    const searchIconImg = document.createElement("img");
    searchIconImg.setAttribute("src", "/icon/searchlocation.png");
    searchIconImg.setAttribute("width", "40px");
    searchIcon.appendChild(searchIconImg);
    searchresultframe.appendChild(searchIcon);
    const searchresultTextframe = document.createElement("div");
    searchresultTextframe.setAttribute("class","searchresultTextframe");
    const resultname = document.createElement("div");
    resultname.setAttribute("class","resultname");
    resultname.textContent = name;
    searchresultTextframe.appendChild(resultname);
    const resultaddress = document.createElement("div");
    resultaddress.setAttribute("class","resultaddress");
    resultaddress.textContent = address; 
    searchresultTextframe.appendChild(resultaddress);
    searchresultframe.appendChild(searchresultTextframe);
    return searchresultframe
}
function addlocation(name){
    const selectlocationFrame = document.createElement("div");
    selectlocationFrame.setAttribute("class", "selectlocationFrame");
    const img = document.createElement("img");
    img.setAttribute("src", "/icon/placemarker.png");
    const selectlocation = document.createElement("div");
    selectlocation.setAttribute("class", "selectlocation");
    selectlocation.textContent = name;
    const alink = document.createElement("a");
    alink.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${name}`);
    alink.setAttribute("class", "linklocation");
    alink.setAttribute("target", "_blank");
    alink.appendChild(img);
    alink.appendChild(selectlocation);
    const locationClose = document.createElement("img")
    locationClose.setAttribute("src", "/icon/icon_close.png");
    locationClose.setAttribute("class", "locationClose");
    selectlocationFrame.appendChild(alink)
    selectlocationFrame.appendChild(locationClose)
    return selectlocationFrame
}

searchlocation.addEventListener("input", ()=>{
    console.log(searchlocation.value)
    const place = searchlocation.value
    fetch(`api/location?keyword=${place}`).then(response =>{
        return response.json()
    }).then(data=>{
        if(data.locationData){
            searchresultframeback.innerHTML = "";
            for(let i = 0; i < data.locationData.length; i++){
                let locationname = data.locationData[i].name
                let locationaddress = data.locationData[i].address
                let frame = locationframe(locationname, locationaddress, i)
                searchresultframeback.appendChild(frame)
            }
            const searchresultframe = document.querySelectorAll(".searchresultframe")
            searchresultframe.forEach(element=>{
                element.addEventListener("click", ()=>{
                    const resultName = element.querySelector(".resultname").textContent;      
                    let addplace = addlocation(resultName)
                    findlocation.innerHTML = ""
                    findlocation.appendChild(addplace)
                    backgroundFrame.style.display = "none"
                    locationFrame.className = "locationFrame none"
                    memberPostLocation.classList.add("color")
                    const locationClose = document.querySelector(".locationClose")
                    locationClose.addEventListener("click", ()=>{
                        findlocation.innerHTML = ""
                        memberPostLocation.classList.remove("color")
                    })
                })
            })

        }
    })
})

upload.addEventListener("change", function(event) {
    errorMessage.className ="errorMessage none"
    imagePreview.innerHTML = ""
    if(event.target.files.length < 4){
        for (const file of event.target.files) {
            let reader = new FileReader();
            reader.onload = function(){
                const img = document.createElement("img");
                img.src = reader.result;
                img.setAttribute("class", "output");
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }else{
        errorMessage.className ="errorMessage"
    }
});

lastclickPost.addEventListener("click", ()=>{
    const selectlocation = document.querySelector(".selectlocation")
    const postText = postTextInput.value;
    let files = upload.files;
    const dateTime = new Date();
    const timestamp = dateTime.getTime();
    const formData = new FormData();
    const judgeLocation = memberPostLocation.className.includes("color");
    const judgePicture = memberPostPicture.className.includes("color");
    if(judgeLocation){
        let location = selectlocation.textContent;
        formData.append("location", location);
    }
    for(let i=0 ; i < files.length ; i++){
        formData.append("images", files[i]);
    };
    formData.append("dateTime", timestamp);
    formData.append("postText", postText);
    fetch("/api/post", {
        method:"POST",
        body:formData
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data);
        if(data.error){

        }else{
            if(judgeLocation){
                postTextInput.value = ""
                findlocation.innerHTML = ""
                memberPostPicture.classList.remove("color")
                memberPostLocation.classList.remove("color")
            }else if(judgePicture){
                postTextInput.value = ""
                imagePreview.innerHTML = ""
                memberPostLocation.classList.remove("color")
                memberPostPicture.classList.remove("color")
            }
            let newPostArticle = postArticle(
                data.postId,
                data.societyId,
                data.dateTime,
                data.postText,
                data.images,
                data.postLike,
                data.userName,
                data.userAvatar,
                data.location)
            allArticle.insertBefore(newPostArticle, allArticle.firstChild)
            
        }
    })
})

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
        console.log(images)
        const postimageFrame = document.createElement("div");
        postimageFrame.setAttribute("class", "postimageFrame");
        for(let i in images){
            console.log(i)
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
    // console.log("postLike",postLike)
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
        // console.log(postComment)
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

let loading = false
function getPost(){
    const allPostBlock = document.querySelectorAll(".postBlock");
    // console.log(allPostBlock)
    const threshold = 0.5
    const options = {
        root: null,
        threshold: threshold,
    };
    const observer = new IntersectionObserver(callback, options);
    console.log(allPostBlock[allPostBlock.length - 2])
    if(allPostBlock){
        observer.observe(allPostBlock[allPostBlock.length - 2]); 
    }
     
}
// setTimeout(getPost, 1000)

async function callback(entry){
    if (entry[0].isIntersecting){
        if (loading == false){
            loading = true
            console.log(nextPage)
            if (nextPage != null){
                await fetch(`/api/post?postPage=${nextPage}`).then(function(response){
                    return response.json();
                }).then(function(data){
                    console.log(data)
                    const next = data.nextPage
                    console.log(next)
                    const article = data.articleData
                    console.log(article.length)
                    for(let i =0; i<article.length; i++){
                        let newPostArticle = postArticle(
                            article[i].postId,
                            article[i].societyId,
                            article[i].postDateTime,
                            article[i].postText,
                            article[i].images,
                            article[i].postLike,
                            article[i].postUserId,
                            article[i].postUserName,
                            article[i].postUserAvatar,
                            article[i].postComment,
                            article[i].location)
                        allArticle.appendChild(newPostArticle)
                    }
                    if (next == 1){
                        nextPage = nextPage + 1 ;
                    }else{
                        nextPage = null;
                    }
                    getPost()
                })
            }
        }
        loading = false
    }
}