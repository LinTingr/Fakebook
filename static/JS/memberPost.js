const findlocation = document.querySelector(".findlocation")
const locationFrame = document.querySelector(".locationFrame")
const upload = document.querySelector(".upload")
const lastclickPost = document.querySelector(".lastclickPost")
const postTextInput = document.querySelector(".postTextInput")
const memberPostUpload = document.querySelector(".memberPostUpload")
const imagePreview = document.querySelector(".imagePreview")

function postEditFrameButton(postEditIconFrame, postEditFrame) {
    postEditIconFrame.addEventListener("click", (e) => {
        postEditFrame.style.display = "block"
        e.stopPropagation()
    })
    body.addEventListener("click", () => {
        postEditFrame.style.display = "none"
    })
    postEditFrame.addEventListener("click", (e) => {
        e.stopPropagation()
    })
}
function postDeleteButton(postDelete, postId, postUserId, postBlockDiv) {
    postDelete.addEventListener("click", () => {
        const postData = {
            postUserId: postUserId,
            postId: postId
        }
        fetch("/api/post", {
            method: "DELETE",
            body: JSON.stringify(postData),
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.ok) {
                postBlockDiv.remove()
            }
        })
    })
}

const errorMessage = document.querySelector(".errorMessage")
upload.addEventListener("change", function(event) {
    errorMessage.className ="errorMessage none"
    imagePreview.innerHTML = ""
    if(event.target.files.length < 4){
        for (const file of event.target.files) {
            let reader = new FileReader();
            reader.onload = function(){
                const img = document.createElement("img");
                img.src = reader.result;
                img.setAttribute("class", "postOutput");
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }else{
        errorMessage.className ="errorMessage"
    }
});

lastclickPost.addEventListener("click", ()=>{
    memberloading.style.display = "flex";
    memberloading.style.opacity = "0.5";
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
            const postComment = []
            const postLiker = []
            let newPostArticle = postArticle(
                data.postId,
                data.societyId,
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
        memberloading.style.display = "none";
    })
})

function postArticle(postId, societyId, dateTime, postText, images, postLiker, postLike, postUserId, userName, userAvatar, postComment, location){
    const postEditIconFrame = document.createElement("div");
    postEditIconFrame.setAttribute("class", "postEditIconFrame");
    const postEditIcon = document.createElement("img");
    postEditIcon.setAttribute("src", "/icon/ellipsis2.png");
    postEditIcon.setAttribute("class", "postEditIcon");
    postEditIconFrame.appendChild(postEditIcon);
    const postEditFrame = document.createElement("div");
    postEditFrame.setAttribute("class", "postEditFrame");
    const postEdit = document.createElement("div");
    postEdit.setAttribute("class", "postEdit");
    postEdit.textContent = "編輯"
    const postDelete = document.createElement("div");
    postDelete.setAttribute("class", "postDelete");
    postDelete.textContent = "刪除"
    postEditFrame.appendChild(postEdit)
    postEditFrame.appendChild(postDelete)
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
        postMemberlocationspan.setAttribute("class", "postMemberlocation")
        postMemberlocationlnk.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${location}`)
        postMemberlocationlnk.setAttribute("class", "postMemberlocationlink")
        postMemberlocationlnk.setAttribute("target", "_blank")
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
        for (let i in images) {
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
    if(postLike){
        if(postLike["clickLike"]){
            likeCount = 1
            likeImg.setAttribute("src", "/icon/fblike1.png");
        }else{
            likeImg.setAttribute("src", "/icon/fblike.png");
        }
    }
    likeImg.setAttribute("class", "likeclick");
    likeImg.setAttribute("src", "/icon/fblike.png");
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
    for(let i = 0; i < postComment.length; i++){
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
    postContainerDiv.appendChild(postEditIconFrame);
    postContainerDiv.appendChild(chatBoxFrame)
    postContainerDiv.appendChild(postEditFrame)
    postBlockDiv.appendChild(postContainerDiv);
    if(postUserId == nowUserId){
        postEditFrameButton(postEditIconFrame, postEditFrame)
        postDeleteButton(postDelete, postId, postUserId, postBlockDiv)
        postEditButton(postEdit, postId, postUserId, userName, userAvatar, postText, images, location)
    }
    return postBlockDiv
}

const updatememberPostArticle = document.querySelector(".updatememberPostArticle")
const updatememberPostPicture = document.querySelector(".updatememberPostPicture")
const updatememberPostLocation = document.querySelector(".updatememberPostLocation")
const backPostEditImageDelete = document.querySelector(".backPostEditImageDelete")
const backPostEditContentFrame = document.querySelector(".backPostEditContentFrame")
const backPostEditLocationFrame = document.querySelector(".backPostEditLocationFrame")
const backPostEditImageFrame = document.querySelector(".backPostEditImageFrame")
const imageFrame = document.querySelector(".imageFrame")
const closeEdit = document.querySelector(".closeEdit")
const backPostEditFrame = document.querySelector(".backPostEditFrame")
const backPostEditContent = document.querySelector(".backPostEditContent")
const newPostImageFrame = document.querySelector(".newPostImageFrame")
let deleteImage = []

updatememberPostArticle.addEventListener("click", () => {
    backPostEditContentFrame.style.display = "block"
    backPostEditImageFrame.style.display = "none"
    backPostEditLocationFrame.style.display = "none"
})
updatememberPostPicture.addEventListener("click", () => {
    backPostEditContentFrame.style.display = "none"
    backPostEditImageFrame.style.display = "block"
    backPostEditLocationFrame.style.display = "none"
})
updatememberPostLocation.addEventListener("click", () => {
    backPostEditContentFrame.style.display = "none"
    backPostEditImageFrame.style.display = "none"
    backPostEditLocationFrame.style.display = "block"
})
// backPostEditImageDelete.addEventListener("click", ()=>{
//     const backPostEditImage = document.querySelector(".backPostEditImage")
//     backPostEditImage.remove()
//     backPostEditImageDelete.remove()
// })
function updatelocationframe(name, address, i) {
    const updateSearchresultframe = document.createElement("div");
    if (i % 2) {
        updateSearchresultframe.setAttribute("class", "updateSearchresultframe color hover");
    } else {
        updateSearchresultframe.setAttribute("class", "updateSearchresultframe hover");
    }
    const searchIcon = document.createElement("div");
    searchIcon.setAttribute("class", "searchIcon");
    const searchIconImg = document.createElement("img");
    searchIconImg.setAttribute("src", "/icon/searchlocation.png");
    searchIconImg.setAttribute("width", "40px");
    searchIcon.appendChild(searchIconImg);
    updateSearchresultframe.appendChild(searchIcon);
    const searchresultTextframe = document.createElement("div");
    searchresultTextframe.setAttribute("class", "updateSearchresultTextframe");
    const resultname = document.createElement("div");
    resultname.setAttribute("class", "resultname");
    resultname.textContent = name;
    searchresultTextframe.appendChild(resultname);
    const resultaddress = document.createElement("div");
    resultaddress.setAttribute("class", "resultaddress");
    resultaddress.textContent = address;
    searchresultTextframe.appendChild(resultaddress);
    updateSearchresultframe.appendChild(searchresultTextframe);
    return updateSearchresultframe
}

function addlocation(name) {
    const updateSelectlocationFrame = document.createElement("div");
    updateSelectlocationFrame.setAttribute("class", "updateSelectlocationFrame");
    const img = document.createElement("img");
    img.setAttribute("src", "/icon/placemarker.png");
    const updateSelectlocation = document.createElement("div");
    updateSelectlocation.setAttribute("class", "updateSelectlocation");
    updateSelectlocation.textContent = name;
    const alink = document.createElement("a");
    alink.setAttribute("href", `https://www.google.com/maps/search/?api=1&query=${name}`);
    alink.setAttribute("class", "linklocation");
    alink.setAttribute("target", "_blank");
    alink.appendChild(img);
    alink.appendChild(updateSelectlocation);
    const locationClose = document.createElement("img")
    locationClose.setAttribute("src", "/icon/icon_close.png");
    locationClose.setAttribute("class", "locationClose");
    updateSelectlocationFrame.appendChild(alink)
    updateSelectlocationFrame.appendChild(locationClose)
    return updateSelectlocationFrame
}

const updateSearchlocation = document.querySelector(".updateSearchlocation")
const updateSearchresultframeback = document.querySelector(".updateSearchresultframeback")
const updateFindlocation = document.querySelector(".updateFindlocation")
updateSearchlocation.addEventListener("input", () => {
    const place = updateSearchlocation.value
    fetch(`/api/location?keyword=${place}`).then((response) => {
        return response.json()
    }).then((data) => {
        if (data.locationData) {
            updateSearchresultframeback.innerHTML = "";
            for (let i = 0; i < data.locationData.length; i++) {
                let locationname = data.locationData[i].name
                let locationaddress = data.locationData[i].address
                let frame = updatelocationframe(locationname, locationaddress, i)
                updateSearchresultframeback.appendChild(frame)
            }
            const updateSearchresultframe = document.querySelectorAll(".updateSearchresultframe")
            updateSearchresultframe.forEach(element => {
                element.addEventListener("click", () => {
                    const resultName = element.querySelector(".resultname").textContent;
                    let addplace = addlocation(resultName)
                    updateFindlocation.innerHTML = ""
                    updateFindlocation.appendChild(addplace)
                    updatememberPostLocation.classList.add("color")
                    const locationClose = document.querySelector(".locationClose")
                    locationClose.addEventListener("click", () => {
                        updateFindlocation.innerHTML = ""
                        updatememberPostLocation.classList.remove("color")
                    })
                })
            })

        }
    })
})

const originalImageFrame = document.querySelector(".originalImageFrame")
const uploadUpdateImage = document.querySelector(".uploadUpdateImage")


function postEditButton(postEdit, postId, postUserId, userName, userAvatar, postText, images, location) {
    let postEditConsent = true
    postEdit.addEventListener("click", () => {
        updatePost(postId, postEditConsent)
        const backPostEditContent = document.querySelector(".backPostEditContent")
        const backPostEditImageFrame = document.querySelector(".backPostEditImageFrame")
        const originalImageFrame = document.querySelector(".originalImageFrame")
        const backPostEditLocation = document.querySelector(".backPostEditLocation")
        const updateFindlocation = document.querySelector(".updateFindlocation")
        backPostEditFrame.classList.remove("none")
        backgroundFrame.style.display = "flex"
        backPostEditContent.value = postText
        if (postText != 0) {
            updatememberPostArticle.classList.add("color")
            backPostEditContent.addEventListener("input", () => {
                if (backPostEditContent.value.length == 0) {
                    updatememberPostArticle.classList.remove("color")
                } else {
                    updatememberPostArticle.classList.add("color")
                }
            })
        }
        updateFindlocation.innerHTML = ""
        originalImageFrame.innerHTML = ""
        updateSearchlocation.value = ""
        updateSearchresultframeback.innerHTML = ""
        if (location) {
            let addplace = addlocation(location)
            updateFindlocation.appendChild(addplace)
            updatememberPostLocation.classList.add("color")
            const locationClose = document.querySelector(".locationClose")
            locationClose.addEventListener("click", () => {
                updateFindlocation.innerHTML = ""
                updatememberPostLocation.classList.remove("color")
            })
        }
        if (images) {
            updatememberPostPicture.classList.add("color")
            for (let i in images) {
                const postImageFrame = document.createElement("div");
                postImageFrame.setAttribute("class", "postImageFrame");
                const original = document.createElement("img");
                original.setAttribute("class", "original");
                original.setAttribute("src", images[i]);
                const postDeleteImage = document.createElement("img");
                postDeleteImage.setAttribute("class", "postDeleteImage");
                postDeleteImage.setAttribute("src", "/icon/icon_close.png");
                postImageFrame.appendChild(original);
                postImageFrame.appendChild(postDeleteImage);
                originalImageFrame.appendChild(postImageFrame);
                originalImageDelete(postDeleteImage, postImageFrame, images[i])
            }
        }

    })
}
let previewImages = []

function updatePost(postId, postEditConsent) {
    closeEdit.addEventListener("click", () => {
        backgroundFrame.style.display = "none"
        backPostEditFrame.classList.add("none")
        updatememberPostLocation.classList.remove("color")
        updatememberPostPicture.classList.remove("color")
        updatememberPostArticle.classList.remove("color")
        backPostEditContentFrame.style.display = "block"
        backPostEditImageFrame.style.display = "none"
        backPostEditLocationFrame.style.display = "none"
        backPostEditContent.value = ""
        originalImageFrame.innerHTML= ""
        updateFindlocation.innerHTML = ""
        newPostImageFrame.innerHTML = ""
        deleteImage = []
        postEditConsent = false
    })

    const updateLastClickPost = document.querySelector(".updateLastClickPost")
    const memberloading = document.querySelector(".memberloading")
    updateLastClickPost.addEventListener("click", () => {
        if(postEditConsent){
            memberloading.style.display = "flex"
            memberloading.style.opacity = "0.7"
            const backPostEditContent = document.querySelector(".backPostEditContent")
            const postText = backPostEditContent.value
            const selectlocation = document.querySelector(".selectlocation")
            const dateTime = new Date();
            const timestamp = dateTime.getTime();
            const formData = new FormData();
            const judgeLocation = updatememberPostLocation.className.includes("color");
            if (judgeLocation) {
                let location = selectlocation.textContent;
                formData.append("location", location);
            }
            for (let i = 0; i < previewImages.length; i++) {
                formData.append("images", previewImages[i]);
            };
            for (let i = 0; i < deleteImage.length; i++) {
                formData.append("deleteImages", deleteImage[i]);
            };
            formData.append("dateTime", timestamp);
            formData.append("postText", postText);
            formData.append("postId", postId);
            fetch("/api/post", {
                method: "PATCH",
                body: formData
            }).then((response) => { 
                return response.json()
            }).then((data) => {
                if (data.ok) {
                    window.location.href = "/member/" + nowUserId
                }
            })
        }
    })
}

// const formData = new FormData();
uploadUpdateImage.addEventListener("change", function (event) {
    previewImages = []
    // errorMessage.className ="errorMessage none"
    const AllpostImageFrame = document.querySelectorAll(".postImageFrame")
    const newPostImageFrame = document.querySelector(".newPostImageFrame")
    newPostImageFrame.innerHTML = ""
    if (uploadUpdateImage.files.length > 3) {
        uploadUpdateImage.value = ""
    }
    if (event.target.files.length + AllpostImageFrame.length < 4) {
        for (const file of event.target.files) {
            previewImages.push(file);
            let reader = new FileReader();
            reader.onload = function () {
                const postImageFrame = document.createElement("div");
                postImageFrame.setAttribute("class", "postImageFrame");
                const postDeleteImage = document.createElement("img");
                postDeleteImage.setAttribute("class", "postDeleteImage");
                postDeleteImage.setAttribute("src", "/icon/icon_close.png");
                const Preview = document.createElement("div");
                Preview.setAttribute("class", "Preview");
                Preview.textContent = "Preview"
                const img = document.createElement("img");
                img.src = reader.result;
                img.setAttribute("class", "output");
                postImageFrame.appendChild(img);
                postImageFrame.appendChild(Preview);
                postImageFrame.appendChild(postDeleteImage);
                const AllNewpostImageFrame = document.querySelectorAll(".newPostImageFrame")
                if (AllpostImageFrame.length + AllNewpostImageFrame.length < 4) {
                    newPostImageFrame.appendChild(postImageFrame);
                }
                deletePreview(postDeleteImage, postImageFrame, file)
            };
            reader.readAsDataURL(file);
        }
    } else {
        uploadUpdateImage.value = ""
    }
});

function deletePreview(postDeleteImage, postImageFrame, file){
    postDeleteImage.addEventListener("click", (e) => {
        for(const i in previewImages){
            if(previewImages[i].name == file.name){
                previewImages.splice(i, 1)
            }
        }

        postImageFrame.remove()
    })
}
function originalImageDelete(postDeleteImage, postImageFrame, imageUrl) {
    postDeleteImage.addEventListener("click", (e) => {
        deleteImage.push(imageUrl)
        postImageFrame.remove()
    })
}


