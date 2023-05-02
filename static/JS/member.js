const memberName = document.querySelector(".memberName")
const memberavatar = document.querySelector(".memberavatar")
const memberavatarFrame = document.querySelector(".memberavatarFrame")
const memberEditavatarFrame = document.querySelector(".memberEditavatarFrame")
const updateavatarFrame = document.querySelector(".updateavatarFrame")
const memberEditavatarText = document.querySelector(".memberEditavatarText")
const backupdateavatar = document.querySelector(".backupdateavatar")
const memberEditavatar = document.querySelector(".memberEditavatar")
const output = document.querySelector('.output');
// const upload = document.querySelector(".upload")
const closeX = document.querySelectorAll(".closeX")
const memberSystemAvatar = document.querySelector(".memberSystemAvatar")
const memberLink = document.querySelector(".memberLink")
const memberEdit = document.querySelector(".memberEdit")
const addFriendFrame = document.querySelector(".addFriendFrame")
const addFriend = document.querySelector(".addFriend")
const sendMessageFrame = document.querySelector(".sendMessageFrame")
const sendMemberMessage = document.querySelector(".sendMessage")
const addfriendicon = document.querySelector(".addfriendicon")
const memberArticle = document.querySelector(".memberArticle")
const postBlock = document.querySelector(".postBlock")
const memberPostAvatarImg = document.querySelector(".memberPostAvatarImg")
const memberloading = document.querySelector(".memberloading")
const memberPostLoading = document.querySelector(".memberPostLoading")
const memberFriend = document.querySelector(".memberFriend")
const personalProfileFrame = document.querySelector(".personalProfileFrame")
const addPersonalProfileframe = document.querySelector(".addPersonalProfileframe")
const cancelbutton = document.querySelector(".cancelbutton")
const confirmbutton = document.querySelector(".confirmbutton")
const personIntroduction = document.querySelector(".personIntroduction")
// const editDetailsFrame = document.querySelector(".editDetailsFrame")
const allFriendFrame = document.querySelector(".allFriendFrame")
const numberOfFriend = document.querySelector(".numberOfFriend")
const outPutFrame = document.querySelector(".outPutFrame")
const backgroundUpload = document.querySelector(".backgroundUpload")
const backgroundButton = document.querySelector(".backgroundButton")
const backgroundOutPutFrame = document.querySelector(".backgroundOutPutFrame")
const backgroundUpdate = document.querySelector(".backgroundUpdate")
const memberEditBackgroundButton = document.querySelector(".memberEditBackgroundButton")
const backUpdateBackgroundFrame = document.querySelector(".backUpdateBackgroundFrame")
const memberEditBackgroundButtonFrame = document.querySelector(".memberEditBackgroundButtonFrame")
const backgroundFrame = document.querySelector(".backgroundFrame")
const moreFriendFrame = document.querySelector(".moreFriendFrame")
const aboutMyselfFrame = document.querySelector(".aboutMyselfFrame")
const friendItem = document.querySelector(".friendItem")
const postItem = document.querySelector(".postItem")
const moreFriendButton = document.querySelector(".moreFriendButton")
const allArticle = document.querySelector(".allArticle")
let articleData
let visitUser
let nextPage

fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        memberSystemAvatar.src = nowUserAvatar;
        memberPostAvatarImg.src = nowUserAvatar;
    }else{
        window.location.href = "/login"
    }
})
//會員頁面 好友 9個
function memberFriendsFrame(userId, userName, userAvatar){
    const friendLink = document.createElement("a");
    const friendDiv = document.createElement("div");
    const friendNameDiv = document.createElement("div");
    const friendImage = document.createElement("img")
    friendLink.setAttribute("href", "/member/"+ userId);
    friendLink.setAttribute("class", "friendLink");
    friendDiv.setAttribute("class", "friend");
    friendImage.setAttribute("class", "friendImage");
    friendImage.setAttribute("src", userAvatar);
    friendNameDiv.setAttribute("class", "friendName");
    friendNameDiv.textContent = userName;
    friendDiv.appendChild(friendImage);
    friendDiv.appendChild(friendNameDiv);
    friendLink.appendChild(friendDiv);
    return friendLink
}

friendItem.addEventListener("click", ()=>{
    aboutMyselfFrame.style.display = "none"
    moreFriendFrame.style.display = "flex"
})
moreFriendButton.addEventListener("click", ()=>{
    aboutMyselfFrame.style.display = "none"
    moreFriendFrame.style.display = "flex"
})
postItem.addEventListener("click", ()=>{
    moreFriendFrame.style.display = "none"
    aboutMyselfFrame.style.display = "flex"
})
// 會員頁面 好友
const moreFriend = document.querySelector(".moreFriend")
function friend(userId, userName, userAvatar, permissions){
    const oneFriendFrame = document.createElement("div");
    oneFriendFrame.setAttribute("class", "oneFriendFrame");
    const oneFriendAvatarFrame = document.createElement("div");
    oneFriendAvatarFrame.setAttribute("class", "oneFriendAvatarFrame");
    const oneFriendAvatar = document.createElement("img");
    const oneFriendAvatarLink = document.createElement("a");
    oneFriendAvatarLink.setAttribute("href", "/member/"+ userId);
    oneFriendAvatar.setAttribute("src", userAvatar);
    oneFriendAvatar.setAttribute("class", "oneFriendAvatar");
    oneFriendAvatarLink.appendChild(oneFriendAvatar);
    oneFriendAvatarFrame.appendChild(oneFriendAvatarLink);
    const oneFriendNameFrame = document.createElement("div");
    oneFriendNameFrame.setAttribute("class", "oneFriendNameFrame");
    const oneFriendNameLink = document.createElement("a");
    oneFriendNameLink.setAttribute("href", "/member/"+ userId);
    const oneFriendName = document.createElement("div");
    oneFriendName.textContent = userName;
    oneFriendName.setAttribute("class", "oneFriendName");
    oneFriendNameLink.appendChild(oneFriendName);
    oneFriendNameFrame.appendChild(oneFriendNameLink);
    const oneFriendSettingFrame = document.createElement("div");
    oneFriendSettingFrame.setAttribute("class", "oneFriendSettingFrame");
    const oneFriendSetting = document.createElement("img");
    oneFriendSetting.setAttribute("src", "/icon/ellipsis.png");
    oneFriendSetting.setAttribute("class", "deleteFriendButton");
    oneFriendSettingFrame.appendChild(oneFriendSetting);
    oneFriendFrame.appendChild(oneFriendAvatarFrame);
    oneFriendFrame.appendChild(oneFriendNameFrame);
    oneFriendFrame.appendChild(oneFriendSettingFrame);
    // 
    if(permissions){
        const deleteFriendButtonFrame = document.createElement("div");
        deleteFriendButtonFrame.setAttribute("class", "deleteFriendButtonFrame");
        const deleteFriend = document.createElement("div");
        deleteFriend.setAttribute("class", "deleteFriend");
        deleteFriend.textContent = "解除朋友關係"
        deleteFriendButtonFrame.appendChild(deleteFriend)
        oneFriendSettingFrame.appendChild(deleteFriendButtonFrame)
        deleteFriendFrame(oneFriendSetting, deleteFriendButtonFrame)
        deleteFriendButton(deleteFriend, userId, oneFriendFrame)
    }
    return oneFriendFrame
}
// 會員傳送訊息
sendMemberMessage.addEventListener("click", ()=>{
    const rules = /\d+/g
    const sendUserId = path.match(rules)
    const sendUserName = document.querySelector(".memberName").textContent
    const sendUserAvatar = document.querySelector(".memberavatar").src
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
})

//刪除好友
function deleteFriendFrame(oneFriendSetting, deleteFriendButtonFrame){
    oneFriendSetting.addEventListener("click", (e)=>{
        deleteFriendButtonFrame.style.display = "flex"
        e.stopPropagation()
        // deleteFriendButtonFrame.style.display = deleteFriendButtonFrame.style.display === "none" ? "block" : "none"
    })
    body.addEventListener("click", ()=>{
        deleteFriendButtonFrame.style.display = "none"
    })
    deleteFriendButtonFrame.addEventListener("click", (e)=>{
        e.stopPropagation()
    })
}
function deleteFriendButton(deleteFriend, userId, oneFriendFrame){
    deleteFriend.addEventListener("click", ()=>{
        const data = {
            deleteFriendId : userId,
        }
        fetch("/api/friend",{
            method:"DELETE",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data.ok){
                oneFriendFrame.remove()
            }
        })
    })
}

const path = window.location.pathname
fetch(`/api${path}`).then(response=>{
    return response.json()
}).then(data=>{
    if(data.error){
        window.location.href = "/"
    }
    if(data.ok){
        const permissions = data.permissions
        const checkfriend = data.checkfriend.status
        const friendCount = data.friendCount
        const friends = data.friends
        for(let i in friends){
            if(i<9){
                let userId =  friends[i].userId
                let userName = friends[i].userName
                let userAvatar = friends[i].userAvatar
                const memberFriends = memberFriendsFrame(userId, userName, userAvatar)
                allFriendFrame.appendChild(memberFriends)
                const onefriend = friend(userId, userName, userAvatar, permissions)
                moreFriend.appendChild(onefriend)
                moreFriendButton.style.display = "block"
            }
        }
        memberFriend.textContent = friendCount
        numberOfFriend.textContent = friendCount + "位朋友"
        visitUser = data.user.userId
        loadingarticle(visitUser)
        memberName.textContent = data.user.userName
        memberavatar.src = data.user.userAvatar
        if(data.user.userBackground){
            memberbackground.src = data.user.userBackground
        }
        personIntroduction.textContent = data.user.userIntroduction
        if(checkfriend == "PENDING"){
            const addFriendText = document.querySelector(".addFriendText")
            addFriendText.textContent = "送出邀請"
            addfriendicon.src = "/icon/invite.png"
        }else if(checkfriend == "ACCEPTED"){
            const addFriendText = document.querySelector(".addFriendText")
            addFriendText.textContent = "朋友"
            addfriendicon.src = "/icon/friend.png"
            addfriendicon.style.width = "25px"
        }
        if(permissions){
            memberEditBackgroundButtonFrame.style.display = "block";
            // memberEdit.style.display = "flex";
        }else{
            postBlock.style.display = "none";
            addFriendFrame.style.display = "flex";
            sendMessageFrame.style.display = "flex";
            memberEditBackgroundButtonFrame.remove();
            memberEditavatarFrame.remove();
            personalProfileFrame.style.display = "none"
            // editDetailsFrame.style.display = "none"
        }
    }
    setTimeout(function() {
        memberloading.style.display = "none";
    }, 1000)
    memberloading.style.opacity  = "0"; 
})

addFriendFrame.addEventListener("click", ()=>{
    const addFriendText = document.querySelector(".addFriendText")
    if(addFriendText.textContent == "朋友"){
    }else{
        addFriendText.textContent = "送出邀請"
        addfriendicon.src = "/icon/invite.png"
        let data = {
            userId : nowUserId,
            userName : nowUserName,
            visitUser : visitUser
        }
        fetch("/api/friend", {
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
    }
})

let memberavatarFrameStatus= 0 // status = close
memberavatarFrame.addEventListener("click", ()=>{
    let searchmemberEditavatarFrame = memberEditavatarFrame.className.includes("none");
    if(searchmemberEditavatarFrame){
        memberEditavatarFrame.className = "memberEditavatarFrame"
        memberavatarFrameStatus = 1
    }else{
        memberEditavatarFrame.className = "memberEditavatarFrame none"
        memberavatarFrameStatus = 0
    } 
})

document.addEventListener("mousedown", () => {
    if (memberavatarFrameStatus == 1) {
        setTimeout(() => {
            memberEditavatarFrame.className = "memberEditavatarFrame none"
            memberavatarFrameStatus = 0;
        },150)
    }
});
memberEditavatar.addEventListener("click", ()=>{
    backupdateavatar.className = "backupdateavatar"
    backgroundFrame.style.display = "block"
})
closeX.forEach((element)=>{
    element.addEventListener("click", ()=>{
        const backgroundConfirm = backUpdateBackgroundFrame.className.includes("none");
        const avatarConfirm = backupdateavatar.className.includes("none");
        if(!avatarConfirm){
            outPutFrame.innerHTML = ""
            backupdateavatar.className = "backupdateavatar none"
            backgroundFrame.style.display = "none"
            memberPostUpload.value = ""
        }
        if(!backgroundConfirm){
            backgroundOutPutFrame.innerHTML = ""
            backUpdateBackgroundFrame.className = "backUpdateBackgroundFrame none"
            backgroundFrame.style.display = "none"
        }
    })
})
backgroundUpload.addEventListener("change", function(event) {
    let reader = new FileReader();
    reader.onload = function(){
        backgroundOutPutFrame.innerHTML = ""
        const img = document.createElement("img");
        img.src = reader.result;
        img.setAttribute("class", "backgroundOutput");
        backgroundOutPutFrame.appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
});
const memberbackground = document.querySelector(".memberbackground")
backgroundButton.addEventListener("click", ()=>{
    backgroundButton.style.pointerEvents = "none";
    const dateTime = new Date();
    const timestamp = dateTime.getTime();
    const formData = new FormData()
    formData.append("image", backgroundUpload.files[0])
    formData.append("dateTime", timestamp);
    fetch("/api/member/background",{
        method:"POST",
        body:formData
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if (data.ok == true){
            memberbackground.src = data.picUrl
            backUpdateBackgroundFrame.classList.add("none")
            backgroundFrame.style.display ="none"
            backgroundOutPutFrame.innerHTML = ""
            backgroundButton.style.pointerEvents = "auto";
        }
    })
})

memberPostUpload.addEventListener("change", function(event) {
    let reader = new FileReader();
    reader.onload = function(){
        outPutFrame.innerHTML = ""
        const img = document.createElement("img");
        img.src = reader.result;
        img.setAttribute("class", "output");
        outPutFrame.appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
});

memberEditBackgroundButton.addEventListener("click", ()=>{
    const backUpdateBackgroundFrame = document.querySelector(".backUpdateBackgroundFrame")
    backUpdateBackgroundFrame.classList.remove("none")
    backgroundFrame.style.display = "block"
})


const avatarButton = document.querySelector(".avatarButton")
avatarButton.addEventListener("click", ()=>{
    avatarButton.style.pointerEvents = "none";
    const memberPostUpload = document.querySelector(".memberPostUpload")
    let formdata = new FormData()
    formdata.append("image", memberPostUpload.files[0])
    fetch("/api/member",{
        method:"POST",
        body:formdata
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data)
        if (data.ok == true){
            outPutFrame.innerHTML = ""
            memberavatar.src = data.picUrl
            backupdateavatar.classList.add("none")
            backgroundFrame.style.display ="none"
            window.location.href = "/member/"+ nowUserId
        }
    })
})

//編輯個人簡介
const addPersonalProfile = document.querySelector(".addPersonalProfile")
personalProfileFrame.addEventListener("click", ()=>{
    personalProfileFrame.style.display = "none"
    addPersonalProfileframe.classList.remove("none")
    addPersonalProfile.value = personIntroduction.textContent
    personIntroduction.textContent = ""
})

cancelbutton.addEventListener("click", ()=>{
    personalProfileFrame.style.display = "flex"
    addPersonalProfileframe.classList.add("none")
    personIntroduction.textContent = addPersonalProfile.value
})

confirmbutton.addEventListener("click", ()=>{
    const addPersonalProfile = document.querySelector(".addPersonalProfile")
    const data = {
        introduction: addPersonalProfile.value
    }
    fetch(`/api/member/${visitUser}`, {
        method:"PATCH",
        body:JSON.stringify(data),
        headers:new Headers({
            "content-type": "application/json"
        })
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.ok){
            personIntroduction.textContent = addPersonalProfile.value
            personalProfileFrame.style.display = "flex"
            addPersonalProfileframe.classList.add("none")
        }
    })
})

memberPostLoading.style.display = "flex"
// 會員頁面 文章
function loadingarticle(visitUser){
    nextPage = 0
    fetch(`/api/post/${visitUser}?postPage=${nextPage}`).then((response)=>{
        return response.json()
    }).then((data)=>{
        memberPostLoading.style.display = "none"
        const next = data.nextPage
        const article = data.articleData
        article.forEach(({ postId, societyId, dateTime, postText, images, postLiker, postLike, postUserId, postUserName, postUserAvatar, postComment, location }) => {
            let postOwn = postArticle(postId, societyId, dateTime, postText, images, postLiker, postLike, postUserId, postUserName, postUserAvatar, postComment, location);
            allArticle.appendChild(postOwn);
        });
        if (next == 1){
            nextPage = nextPage + 1 ;
        }else{
            nextPage = null;
        }
        getPost(nextPage);
    })
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
                memberPostLoading.style.display = "flex"
                await fetch(`/api/post/${visitUser}?postPage=${nextPage}`).then(function(response){
                    return response.json();
                }).then(function(data){
                    memberPostLoading.style.display = "none"
                    const next = data.nextPage
                    const article = data.articleData
                    article.forEach(({ postId, societyId, dateTime, postText, postLiker, images, postLike, postUserId, postUserName, postUserAvatar, postComment, location }) => {
                        let postOwn = postArticle(postId, societyId, dateTime, postText, images, postLiker, postLike, postUserId, postUserName, postUserAvatar, postComment, location);
                        allArticle.appendChild(postOwn);
                    });
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