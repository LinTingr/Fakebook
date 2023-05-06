const membername = document.querySelector(".membername")
const memberSystemAvatar = document.querySelector(".memberSystemAvatar")
const memberavatar = document.querySelector(".memberavatar")
const memberPostAvatarImg = document.querySelector(".memberPostAvatarImg")
const lastclickPost = document.querySelector(".lastclickPost")
const postTextInput = document.querySelector(".postTextInput")
const backgroundFrame = document.querySelector(".backgroundFrame")
const locationFrame = document.querySelector(".locationFrame")
const selectlocation = document.querySelector(".selectlocation")
const findlocation = document.querySelector(".findlocation")
const upload = document.querySelector(".upload")
const output = document.querySelector(".output")
const imagePreview = document.querySelector(".imagePreview")
const errorMessage = document.querySelector(".errorMessage")
const imageFrame = document.querySelector(".imageFrame")
const AllPostFrame = document.querySelector(".AllPostFrame")
const allArticle = document.querySelector(".allArticle")
const memberLink = document.querySelector(".memberLink")
const nameLink = document.querySelectorAll(".nameLink")
const Fakebookloading = document.querySelector(".Fakebookloading")
const postloading = document.querySelector(".postloading")
const societyName = document.querySelector(".societyName")
const createSociety = document.querySelector(".createSociety")
const createSocietyFrame = document.querySelector(".createSocietyFrame")
const closeCreateSociety = document.querySelector(".closeCreateSociety")
let nextPage = 0;

fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        membername.textContent = nowUserName;
        memberCenter.textContent = nowUserName;
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

fetch("/api/society").then(response=>{
    return response.json()
}).then((data)=>{
    if(data.ok){
        const society = data.society
        for(let i in society){
            const societyFrame = document.querySelector(".societyFrame")
            let societyDivFrame = societyDiv(society[i].societyName, society[i].societyId)
            societyFrame.appendChild(societyDivFrame)
        }
    }
})

const global = document.querySelector(".global")
const globalFrame = document.querySelector(".globalFrame")
const privacy = document.querySelector(".privacy")
const privacyFrame = document.querySelector(".privacyFrame")
const createSocietyPrivacyInput = document.querySelector(".createSocietyPrivacyInput")
const createSocietyHideFrame = document.querySelector(".createSocietyHideFrame")
const createSocietyHide = document.querySelector(".createSocietyHide")
const openSearch = document.querySelector(".openSearch")
const openSearchFrame = document.querySelector(".openSearchFrame")
const hide = document.querySelector(".hide")
const hideFrame = document.querySelector(".hideFrame")
const createSocietyHideInput = document.querySelector(".createSocietyHideInput")
const createSocietyPrivacyFrame = document.querySelector('.createSocietyPrivacyFrame');
const createSocietyPrivacy = document.querySelector('.createSocietyPrivacy');
const createSocietyNameInput = document.querySelector(".createSocietyNameInput")

createSociety.addEventListener("click", ()=>{
    backgroundFrame.style.display = "flex"
    createSocietyFrame.classList.remove("none")
})

closeCreateSociety.addEventListener("click",()=>{
    backgroundFrame.style.display = "none"
    createSocietyFrame.classList.add("none")
    createSocietyResult.innerHTML = "" 
    createSocietyNameInput.value = ""
    createSocietyHide.style.display = 'none'
    createSocietyHideFrame.style.display = 'none'
    createSocietyPrivacyInput.textContent = "公開"
    createSocietyPrivacy.style.display = "none"
})

createSocietyPrivacyFrame.addEventListener("click", (e)=>{
    createSocietyPrivacy.style.display = "block"
    createSocietyHide.style.display = "none"
    e.stopPropagation()
})
body.addEventListener("click", ()=>{
    createSocietyPrivacy.style.display = "none"
    createSocietyHide.style.display = "none"
})
createSocietyPrivacy.addEventListener("click", (e)=>{
    e.stopPropagation()
})

createSocietyHideFrame.addEventListener("click", (e)=>{
    createSocietyHide.style.display = "block"
    createSocietyPrivacy.style.display = "none"
    e.stopPropagation()
})
body.addEventListener("click", ()=>{
    createSocietyHide.style.display = "none"
})
createSocietyHide.addEventListener("click", (e)=>{
    e.stopPropagation()
})

globalFrame.addEventListener("click", ()=>{
    createSocietyPrivacyInput.textContent = global.textContent
    createSocietyPrivacy.style.display = 'none';
    createSocietyHideFrame.style.display = 'none';
})
privacyFrame.addEventListener("click", ()=>{
    createSocietyPrivacyInput.textContent = privacy.textContent
    createSocietyHideFrame.style.display = 'block'
    createSocietyPrivacy.style.display = 'none';
})

openSearchFrame.addEventListener("click", ()=>{
    createSocietyHideInput.textContent = openSearch.textContent
    createSocietyHide.style.display = 'none';
})
hideFrame.addEventListener("click", ()=>{
    createSocietyHideInput.textContent = hide.textContent
    createSocietyHide.style.display = 'none'
})
const createSocietyButton = document.querySelector(".createSocietyButton")
const createSocietyResult = document.querySelector(".createSocietyResult")
createSocietyButton.addEventListener("click", ()=>{
    const createSocietyNameInput = document.querySelector(".createSocietyNameInput")
    const createSocietyPrivacyInput = document.querySelector(".createSocietyPrivacyInput")
    const createSocietyHideInput = document.querySelector(".createSocietyHideInput")
    let data = {
        userId : nowUserId,
        userName : nowUserName,
        societyName : createSocietyNameInput.value,
        privacy : createSocietyPrivacyInput.textContent,
        hide : createSocietyHideInput.textContent
    }
    fetch("/api/society/create",{
        method:"POST",
        body:JSON.stringify(data),
        headers:new Headers({
            "content-type": "application/json"
        })
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.ok){
            createSocietyResult.textContent = "建立成功"
            const societyFrame = document.querySelector(".societyFrame")
            let societyDivFrame = societyDiv(createSocietyNameInput.value, data.link)
            societyFrame.appendChild(societyDivFrame)
            setTimeout(()=>{
                backgroundFrame.style.display = "none"
                createSocietyFrame.classList.add("none")
                createSocietyResult.innerHTML = "" 
                createSocietyNameInput.value = ""
                createSocietyHide.style.display = 'none'
                createSocietyHideFrame.style.display = 'none'
                createSocietyPrivacyInput.textContent = "公開"
                createSocietyPrivacy.style.display = "none"
            },1000)
        }
    })
})

function societyDiv(societyName, link){
    const societyLink = document.createElement('a');
    const society = document.createElement('div');
    const societyAvatar = document.createElement('div');
    const societyAvatarImg = document.createElement('img');
    const societyNameDiv = document.createElement('div');
    societyLink.setAttribute('href', "/society/" + link);
    societyLink.setAttribute('class', 'societyLink');
    society.setAttribute('class', 'society');
    societyAvatar.setAttribute('class', 'societyAvatar');
    societyAvatarImg.setAttribute('src', '/icon/society.png');
    societyNameDiv.setAttribute('class', 'societyName');
    societyNameDiv.textContent = societyName;
    societyLink.appendChild(society);
    society.appendChild(societyAvatar);
    societyAvatar.appendChild(societyAvatarImg);
    society.appendChild(societyNameDiv)
    return societyLink
} 
// 點擊好友出現聊天室
function memberFriendClick(personDiv, userId, userName, userAvatar){
    personDiv.addEventListener("click", ()=>{
        const aLLChatInterfaceFrame = document.querySelectorAll(".chatInterfaceFrame")
        const numberOfChat = document.querySelector(`#chat${userId}`)
        if(numberOfChat){
            return
        }
        fetch(`/api/chatMessage/chat?memberId=${userId}`).then((response)=>{
            return response.json()
        }).then((data)=>{
            let allMessage = data.allMessage
            const backChat = document.querySelector(".backChat")
            backChat.style.display = ""
            let chatroom = chatroomDiv(userId, userName, userAvatar, allMessage)
            backChat.appendChild(chatroom)
            const chatID = backChat.querySelector(`#chat${userId}`)
            const chatMessageBoxFrame = chatID.querySelector(".chatMessageBoxFrame")
            chatMessageBoxFrame.scrollTop = chatMessageBoxFrame.scrollHeight
        })
        if(aLLChatInterfaceFrame.length>=3){
            const removechatframe = document.querySelector(".chatInterfaceFrame")
            removechatframe.remove()
        }
    }) 
}

function friends(userId, userName, userAvatar){
    const personDiv = document.createElement("div");
    personDiv.setAttribute("class", "Person");
    const avatarDiv = document.createElement("div");
    avatarDiv.setAttribute("class", "PersonAvatar");
    const avatarImg = document.createElement("img");
    avatarImg.setAttribute("src", userAvatar);
    avatarImg.setAttribute("width", "32px");
    avatarImg.setAttribute("class", "friendavatarImg");
    avatarDiv.appendChild(avatarImg);
    const nameDiv = document.createElement("div");
    const userIdDiv = document.createElement("div");
    nameDiv.setAttribute("class", "PersonName");
    userIdDiv.setAttribute("class", "PersonId none");
    userIdDiv.textContent = userId;
    nameDiv.textContent = userName;
    personDiv.appendChild(userIdDiv);
    personDiv.appendChild(avatarDiv);
    personDiv.appendChild(nameDiv);
    memberFriendClick(personDiv, userId, userName, userAvatar)
    return personDiv
}

fetch("/api/friend").then((response)=>{
    return response.json()
}).then((data)=>{
    let friendsData = data.data.friends
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
    setTimeout(function() {
        Fakebookloading.style.display = "none";
    }, 1000)
    Fakebookloading.style.opacity  = "0"; 
    const next = data.nextPage
    const article = data.articleData
    for(let i = 0; i < article.length; i++){
        let newPostArticle = postArticle(
            article[i].postId,
            article[i].postDateTime,
            article[i].postText,
            article[i].images,
            article[i].postLiker,
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

closePostLiker.addEventListener("click", ()=>{
    backgroundFrame.style.display = "none";
    postLikerFrame.className = "postLikerFrame none"
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
    Fakebookloading.style.display = "flex";
    Fakebookloading.style.opacity = "0.5";
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
        if(data.error){
        }else{
            postTextInput.value = ""
            if(judgeLocation){
                findlocation.innerHTML = ""
                memberPostPicture.classList.remove("color")
                memberPostLocation.classList.remove("color")
            }else if(judgePicture){
                imagePreview.innerHTML = ""
                memberPostLocation.classList.remove("color")
                memberPostPicture.classList.remove("color")
            }
            const postComment = []
            const postLiker = []
            let newPostArticle = postArticle(
                data.postId,
                data.dateTime,
                data.postText,
                data.images,
                postLiker,
                data.postLike,
                data.userId,
                data.userName,
                data.userAvatar,
                postComment, 
                data.location)
            allArticle.insertBefore(newPostArticle, allArticle.firstChild)
        }
        upload.value = "";
        Fakebookloading.style.display = "none";
    })
})

function postArticle(postId, dateTime, postText, images, postLiker, postLike, postUserId, userName, userAvatar, postComment, location){
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
        postMemberlocationlnk.setAttribute("target","_blank")
        postMemberlocationlnk.textContent = " __在 "
        postMemberlocationspan.textContent = location;
        postMemberlocationlnk.appendChild(postMemberlocationspan)
        postAvatarMembernameDiv.appendChild(postMemberlocationlnk)
    }
    const hr = document.createElement("hr");
    postContainerDiv.setAttribute("class", "postContainer");
    postContainerDiv.appendChild(postAvatarMembernameDiv);
    postContainerDiv.appendChild(hr);
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
    lookLiker(likeIconFrameDiv, postLiker, postId)
    const messageIconImg = document.createElement("img");
    messageIconImg.setAttribute("src", "/icon/chatmessage.png");
    messageIconImg.setAttribute("width", "30px");
    const messageCountDiv = document.createElement("div");
    messageCountDiv.setAttribute("class", "messageCount");
    if(postComment){
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
            zoomImage(postImage)
            postimageFrame.appendChild(postImage);
        }
        postContainerDiv.appendChild(postimageFrame);
    }
    postContainerDiv.appendChild(likeMessageIconCountFrameDiv);
    postContainerDiv.appendChild(hr1);
    const likeMessageiconFrame = document.createElement("div");
    likeMessageiconFrame.setAttribute("class", "likeMessageiconFrame");
    const likeclickFrame = document.createElement("div");
    likeclickFrame.setAttribute("class", "likeclickFrame hover");
    const likeImg = document.createElement("img");
    let likeCount = 0
    likeImg.setAttribute("src", "/icon/fblike.png");
    if(postLike){
        if(postLike["clickLike"]){
            likeCount = 1
            likeImg.setAttribute("src", "/icon/fblike1.png");
        }else{
            likeImg.setAttribute("src", "/icon/fblike.png");
        }
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
    likeMessageiconFrame.appendChild(likeclickFrame);
    likeMessageiconFrame.appendChild(messagechatFrame);
    const hr2 = document.createElement("hr");
    postContainerDiv.appendChild(likeMessageiconFrame);
    postContainerDiv.appendChild(hr2);
    likeClick(likeclickFrame, likeImg, likeCount, postId, likeIconFrameDiv)
    const allchatmessageFrame = document.createElement("div");
    allchatmessageFrame.setAttribute("class", "allchatmessageFrame none");
    if(postComment){
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
    }
    postContainerDiv.appendChild(allchatmessageFrame)
    const chatBoxFrame = document.createElement("div");
    chatBoxFrame.setAttribute("class", "chatBoxFrame");
    const chatboxAvatarFrame = document.createElement("div");
    chatboxAvatarFrame.setAttribute("class", "chatboxAvatarFrame");
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", nowUserAvatar);
    imgElement.setAttribute("class", "userAvatarimgElement");
    chatboxAvatarFrame.appendChild(imgElement);
    const chatboxInputFrame = document.createElement("div");
    chatboxInputFrame.setAttribute("class", "chatboxInputFrame");
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "留言···");
    inputElement.setAttribute("class", "chatboxInput");
    let chatCount = 0
    chatMessage(chatboxInputFrame, postId, userName, userAvatar, messagechatFrame, allchatmessageFrame, messageIconFrameDiv, chatCount, inputElement)
    lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount, messageIconFrameDiv, inputElement)
    chatboxInputFrame.appendChild(inputElement);
    chatBoxFrame.appendChild(chatboxAvatarFrame);
    chatBoxFrame.appendChild(chatboxInputFrame);
    postContainerDiv.appendChild(chatBoxFrame)
    postBlockDiv.appendChild(postContainerDiv);
    return postBlockDiv
}

let loading = false
function getPost(){
    const allPostBlock = document.querySelectorAll(".postBlock");
    const threshold = 0.5
    const options = {
        root: null,
        threshold: threshold,
    };
    const observer = new IntersectionObserver(callback, options);
    if(allPostBlock[allPostBlock.length - 2]){
        observer.observe(allPostBlock[allPostBlock.length - 2]); 
    }
}

async function callback(entry){
    if (entry[0].isIntersecting){
        if (loading == false){
            loading = true
            if (nextPage != null){
                postloading.style.display = "flex"
                await fetch(`/api/post?postPage=${nextPage}`).then(function(response){
                    return response.json();
                }).then(function(data){
                    postloading.style.display = "none"
                    const next = data.nextPage
                    const article = data.articleData
                    for(let i =0; i<article.length; i++){
                        let newPostArticle = postArticle(
                            article[i].postId,
                            article[i].postDateTime,
                            article[i].postText,
                            article[i].images,
                            article[i].postLiker,
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