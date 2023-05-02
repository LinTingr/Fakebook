const postLikerFrame = document.querySelector(".postLikerFrame")
const allPostLikerFrame = document.querySelector(".allPostLikerFrame")
const closePostLiker = document.querySelector(".closePostLiker")
const memberPostLocation = document.querySelector(".memberPostLocation")
const memberPostPicture = document.querySelector(".memberPostPicture")
const closelocation = document.querySelector(".closelocation")
const closeImage = document.querySelector(".closeImage")
const button = document.querySelector(".button")
const searchlocation = document.querySelector(".searchlocation")
const searchresultframeback = document.querySelector(".searchresultframeback")

closePostLiker.addEventListener("click", () => {
    backgroundFrame.style.display = "none";
    postLikerFrame.className = "postLikerFrame none"
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
    const place = searchlocation.value
    fetch(`/api/location?keyword=${place}`).then((response) =>{
        return response.json()
    }).then((data)=>{
        if(data.locationData){
            searchresultframeback.innerHTML = "";
            for(let i = 0; i < data.locationData.length; i++){
                let locationname = data.locationData[i].name
                let locationaddress = data.locationData[i].address
                let frame = locationframe(locationname, locationaddress, i)
                searchresultframeback.appendChild(frame)
            }
            const searchresultframe = document.querySelectorAll(".searchresultframe")
            searchresultframe.forEach((element)=>{
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

function zoomImage(postImage){
    const zoomimageFrame = document.querySelector(".zoomimageFrame")
    const ImageZoom = document.querySelector(".ImageZoom")
    const closeImageZoom = document.querySelector(".closeImageZoom")
    postImage.addEventListener("click", ()=>{
        backgroundFrame.style.display = "block"
        zoomimageFrame.style.display = "flex"
        ImageZoom.src = postImage.src
    })
    closeImageZoom.addEventListener("click", ()=>{
        backgroundFrame.style.display = "none"
        zoomimageFrame.style.display = "none"
        ImageZoom.src = ""
    })
}

function lookLiker(likeIconFrameDiv, postLiker, postId){
    likeIconFrameDiv.addEventListener("click", async()=>{
        backgroundFrame.style.display = ""
        postLikerFrame.classList.remove("none")
        allPostLikerFrame.innerHTML = ""
        fetch(`/api/post/like?postId=${postId}`).then((response)=>{
            return response.json()
        }).then((data)=>{
            const postLiker = data.allLiker
            for(let i in postLiker){
                const postLikerLink = "/member/" + postLiker[i].userid
                const likerImage = postLiker[i].useravatar
                const likerName = postLiker[i].userName
                const liker = likerFrame(postLikerLink, likerImage, likerName, i)
                allPostLikerFrame.appendChild(liker)
            }
        })
    })
}

function likerFrame(postLikerLink, likerImage, likerName, i){
    const likerLink = document.createElement("a");
    likerLink.setAttribute("href", postLikerLink);
    const divOnePostLikerFrame = document.createElement("div");
    if(i % 2){
        divOnePostLikerFrame.setAttribute("class", "onePostLikerFrame color");
    }else{
        divOnePostLikerFrame.setAttribute("class", "onePostLikerFrame");
    }
    const divPostLikerImageFrame = document.createElement("div");
    divPostLikerImageFrame.setAttribute("class", "PostLikerImageFrame");
    const imgPostLikerImage = document.createElement("img");
    imgPostLikerImage.setAttribute("src", likerImage);
    imgPostLikerImage.setAttribute("class", "PostLikerImage");
    divPostLikerImageFrame.appendChild(imgPostLikerImage);
    const divPostLikerNameFrame = document.createElement("div");
    divPostLikerNameFrame.setAttribute("class", "PostLikerNameFrame");
    const spanPostLikerName = document.createElement("span");
    spanPostLikerName.setAttribute("class", "PostLikerName");
    spanPostLikerName.textContent = likerName;
    divPostLikerNameFrame.appendChild(spanPostLikerName);
    divOnePostLikerFrame.appendChild(divPostLikerImageFrame);
    divOnePostLikerFrame.appendChild(divPostLikerNameFrame);
    likerLink.appendChild(divOnePostLikerFrame);
    return likerLink
}

function likeClick(likeclickFrame, likeImg, likeCount, postId, likeIconFrameDiv){
    likeclickFrame.addEventListener("click", ()=>{
        let postlikeCount = likeIconFrameDiv.querySelector(".likeCount").textContent
        postlikeCount = parseInt(postlikeCount)
        if(likeCount){
            likeImg.src = "/icon/fblike.png"
            postlikeCount -= 1
            likeIconFrameDiv.querySelector(".likeCount").textContent = postlikeCount
            likeCount -= 1
        }else{
            likeImg.src = "/icon/fblike1.png"
            postlikeCount += 1
            likeIconFrameDiv.querySelector(".likeCount").textContent = postlikeCount
            likeCount += 1
        }
        const dateTime = new Date();
        const timestamp = dateTime.getTime();
        let data = {
            likeCount : likeCount,
            postId : postId,
            timestamp : timestamp
        }
        fetch("/api/post/like", {
            method : "POST",
            body : JSON.stringify(data),
            headers : new Headers({
                "content-type" : "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
        })
    })
}
function lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount, messageIconFrameDiv, inputElement){
    if(messageIconFrameDiv){
        messageIconFrameDiv.addEventListener("click", ()=>{
            if(chatCount){
                allchatmessageFrame.className = "allchatmessageFrame none"
                chatCount = 0
            }else{
                allchatmessageFrame.className = "allchatmessageFrame"
                chatCount = 1
            }
        })
    }
    messagechatFrame.addEventListener("click", ()=>{
        if(chatCount){
            allchatmessageFrame.className = "allchatmessageFrame none"
            chatCount = 0
        }else{
            inputElement.focus()
            allchatmessageFrame.className = "allchatmessageFrame"
            chatCount = 1
        }
    })
    return chatCount
}
function chatMessage(chatboxInputFrame, postId, userName, userAvatar, messagechatFrame, allchatmessageFrame, messageIconFrameDiv, chatCount, inputElement){
    chatboxInputFrame.addEventListener("keydown", (event)=>{
        if(event.keyCode === 13){
            const chatboxInput = chatboxInputFrame.querySelector(".chatboxInput")
            let messageCount = messageIconFrameDiv.querySelector(".messageCount").textContent
            const dateTime = new Date();
            const timestamp = dateTime.getTime();
            let data = {
                postId : postId,
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
            lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount, messageIconFrameDiv, inputElement)

            fetch("/api/post/comment", {
                method : "POST",
                body : JSON.stringify(data),
                headers : new Headers({
                    "content-type" : "application/json"
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
