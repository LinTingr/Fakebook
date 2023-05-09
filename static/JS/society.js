const memberSystemAvatar = document.querySelector(".memberSystemAvatar")
const memberLink = document.querySelector(".memberLink")
const memberPostAvatarImg = document.querySelector(".memberPostAvatarImg")
const societyName = document.querySelector(".societyName")
const societyIntroduce = document.querySelector(".societyIntroduce")
const addSocietyIntroduceframe = document.querySelector(".addSocietyIntroduceframe")
const confirmbutton = document.querySelector(".confirmbutton")
const cancelbutton = document.querySelector(".cancelbutton")
const societyIntroduction = document.querySelector(".societyIntroduction")
const societyEditBackgroundButton = document.querySelector(".societyEditBackgroundButton")
const societyEditBackgroundButtonFrame = document.querySelector(".societyEditBackgroundButtonFrame")
const societyIntroduceFrame = document.querySelector(".societyIntroduceFrame")
const backUpdateBackgroundFrame = document.querySelector(".backUpdateBackgroundFrame")
const backgroundFrame = document.querySelector(".backgroundFrame")
const backgroundUpload = document.querySelector(".backgroundUpload")
const backgroundOutPutFrame = document.querySelector(".backgroundOutPutFrame")
const backgroundButton = document.querySelector(".backgroundButton")
const societyBackground = document.querySelector(".societyBackground")
const privacyContent = document.querySelector(".privacyContent")
const HideContent = document.querySelector(".HideContent")
const privacyText = document.querySelector(".privacyText")
const HideText = document.querySelector(".HideContent")
const closeX = document.querySelector(".closeX")
const societyArticle = document.querySelector(".societyArticle")
const societyAdd = document.querySelector(".societyAdd")
const Add = document.querySelector(".Add")
const addicon = document.querySelector(".addicon")
const talk = document.querySelector(".talk")
const aboutSociety = document.querySelector(".aboutSociety")
const memberRequestFrame = document.querySelector(".memberRequestFrame")
const memberRequest = document.querySelector(".memberRequest")
const applicationForm = document.querySelector(".applicationForm")
const Fakebookloading = document.querySelector(".Fakebookloading")
const allArticle = document.querySelector(".allArticle")
const postloading = document.querySelector(".postloading")
const deleteFrame = document.querySelector(".deleteFrame")
const deleteList = document.querySelector(".deleteList")
const societyPostBlock = document.querySelector(".societyPostBlock")
const societyInvite = document.querySelector(".societyInvite")

const path = window.location.pathname

fetch(`/api${path}`).then(response=>{
    return response.json()
}).then((data)=>{
    setTimeout(function() {
        Fakebookloading.style.display = "none";
    }, 1000)
    Fakebookloading.style.opacity  = "0"; 
    if(data.error){
        window.location.href = "/"
    }else{
        const society = data.society
        const societymember = data.societyMember
        const permissions = data.permissions
        const confirm = data.confirm
        societyName.textContent = society.societyName
        societyIntroduction.textContent = society.societyDescription
        if(confirm && confirm.status == "PENDING"){
            Add.textContent = "等待回應"
        }
        if(society.societyPicture){
            societyBackground.src = society.societyPicture
        }else{
            societyBackground.src = "/icon/white.jpg"
        }
        //
        if(society.societyPrivacy){
            privacyText.textContent = "私密"
            privacyContent.textContent = "只有成員可以查看社團成員名單和他們發佈的貼文。"
        }else{
            privacyText.textContent = "公開"
            privacyContent.textContent = "任何人都可以查看社團成員名單和他們發佈的貼文。"
        }
        //
        console.log(society.societyHide, society.societyPrivacy)
        if(society.societyHide){
            HideText.textContent = "隱藏"
            HideContent.textContent = "只有成員能找到這個社團。"
        }else{
            HideText.textContent = "開放搜尋"
            HideContent.textContent = "所有人都能找到這個社團。"
        }
        //
        const societyInvite = document.querySelector(".societyInvite")
        const societyAdd = document.querySelector(".societyAdd")
        const noMemberList = document.querySelector(".noMemberList")
        const list = document.querySelector(".list")
        console.log("societymember", societymember)
        if(societymember){
            if(permissions){
                applicationForm.style.display = "flex"
                deleteList.style.display = "flex"
                societyEditBackgroundButtonFrame.style.display = "block"
            }else{
                societyEditBackgroundButtonFrame.remove()
                societyIntroduceFrame.remove()
                applicationForm.remove()
                deleteList.remove()
            }
            societyInvite.style.display = "flex"
            societyAdd.remove()
        }else{
            societyPostBlock.remove()
            if(society.societyPrivacy){
                societyArticle.remove()
                societyEditBackgroundButtonFrame.remove()
                societyIntroduceFrame.remove()
                societyAdd.style.display = "flex"
                societyInvite.remove()
                list.remove()
                noMemberList.style.display = "flex"
            }else{
                societyEditBackgroundButtonFrame.remove()
                societyIntroduceFrame.remove()
                societyAdd.style.display = "flex"
                societyInvite.remove()
                list.remove()
                noMemberList.style.display = "flex"
            }
        }
    }
})
//加入社團

societyAdd.addEventListener("click", ()=>{
    Add.textContent = "等待回應"
    const data ={            
        userid : nowUserId,
        userName : nowUserName
    }
    fetch(`/api${path}/add`, {
        method:"POST",
        body:JSON.stringify(data),
        headers:new Headers({
            "content-type": "application/json"
        })
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data.message)
    })
})
//申請欄
function memberRequestDiv(userId, userName, userAvatar){
    const one = document.createElement("div");
    const memberRequestAvatarFrame = document.createElement("div");
    const memberRequestAvatarLink = document.createElement("a");
    const memberRequestAvatar = document.createElement("img");
    const memberRequestNameFrame = document.createElement("div");
    const memberRequestName = document.createElement("div");
    const memberRequestNameLink = document.createElement("a");
    const memberRequestConfirmFrame = document.createElement("div");
    const memberRequestConfirm = document.createElement("div");
    const memberRequestReject = document.createElement("div");
    one.setAttribute("class", "one");
    memberRequestAvatarFrame.setAttribute("class", "memberRequestAvatarFrame");
    memberRequestAvatarLink.setAttribute("href", "/member/" + userId);
    memberRequestAvatarLink.setAttribute("class", "memberRequestAvatarLink");
    memberRequestAvatar.setAttribute("src", userAvatar);
    memberRequestAvatar.setAttribute("class", "memberRequestAvatar");
    memberRequestNameFrame.setAttribute("class", "memberRequestNameFrame");
    memberRequestName.setAttribute("class", "memberRequestName");
    memberRequestName.textContent = userName;
    memberRequestNameLink.setAttribute("href", "/member/" + userId);
    memberRequestNameLink.setAttribute("class", "memberRequestNameLink");
    memberRequestConfirmFrame.setAttribute("class", "memberRequestConfirmFrame");
    memberRequestConfirm.setAttribute("class", "memberRequestConfirm");
    memberRequestConfirm.textContent = "批准";
    memberRequestReject.setAttribute("class", "memberRequestReject");
    memberRequestReject.textContent = "拒絕";
    societyMemberConfirmClick(memberRequestConfirm, memberRequestReject, userId, userName, userAvatar, one)
    one.appendChild(memberRequestAvatarFrame);
    memberRequestAvatarLink.appendChild(memberRequestAvatar);
    memberRequestAvatarFrame.appendChild(memberRequestAvatarLink);
    one.appendChild(memberRequestNameFrame);
    memberRequestNameLink.appendChild(memberRequestName);
    memberRequestNameFrame.appendChild(memberRequestNameLink);
    one.appendChild(memberRequestConfirmFrame);
    memberRequestConfirmFrame.appendChild(memberRequestConfirm);
    memberRequestConfirmFrame.appendChild(memberRequestReject);
    return one
}

applicationForm.addEventListener("click", ()=>{
    societyArticle.style.display = "none"
    aboutSociety.style.display = "none"
    societyMemberFrame.style.display = "none"
    memberRequestFrame.style.display = "block"
    fetch(`/api${path}/memberRequests`).then((response)=>{
        return response.json()
    }).then((data)=>{
        memberRequest.innerHTML = ""
        if(data){
            const societyMemberRequest = data.societyMemberRequest
            for(let i in societyMemberRequest){
                const memberApply = memberRequestDiv(
                    societyMemberRequest[i].userId,
                    societyMemberRequest[i].userName,
                    societyMemberRequest[i].userAvatar
                )
                memberRequest.appendChild(memberApply)
            }
        }
    })
})
// 切會成員頁
const societyMemberForm = document.querySelector(".societyMemberForm")
const societyMemberFrame = document.querySelector(".societyMemberFrame")
const allsocietyMemberFrame = document.querySelector(".allsocietyMemberFrame")
societyMemberForm.addEventListener("click", ()=>{
    societyArticle.style.display = "none"
    aboutSociety.style.display = "none"
    memberRequestFrame.style.display = "none"
    societyMemberFrame.style.display = "block"
    fetch(`/api${path}/member`).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.ok){
            allsocietyMemberFrame.innerHTML = ""
            const permissions = data.permissions
            // const checkfriend = data.checkfriend.status
            // const friendCount = data.friendCount
            const allsocietyMember = data.allsocietyMember
            for(let i in allsocietyMember){
                let userId =  allsocietyMember[i].userid
                let userName = allsocietyMember[i].username
                let userAvatar = allsocietyMember[i].useravatar
                const onefriend = friend(userId, userName, userAvatar, permissions)
                allsocietyMemberFrame.appendChild(onefriend)
            }
        }
    })
})

//刪除會員
function deleteMemberFrame(oneMemberSetting, deleteMemberButtonFrame){
    oneMemberSetting.addEventListener("click", (e)=>{
        deleteMemberButtonFrame.style.display = "flex"
        e.stopPropagation()
    })
    body.addEventListener("click", ()=>{
        deleteMemberButtonFrame.style.display = "none"
    })
    deleteMemberButtonFrame.addEventListener("click", (e)=>{
        e.stopPropagation()
    })
}
function deleteMemberButton(deleteMember, userId, oneMemberFrame){
    deleteMember.addEventListener("click", ()=>{
        const data = {
            deleteMemberId : userId,
        }
        fetch(`/api${path}/member`,{
            method:"DELETE",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data.ok){
                oneMemberFrame.remove()
            }
        })
    })
}

function friend(userId, userName, userAvatar, permissions){
    const oneMemberFrame = document.createElement("div");
    oneMemberFrame.setAttribute("class", "oneMemberFrame");
    const oneMemberAvatarFrame = document.createElement("div");
    oneMemberAvatarFrame.setAttribute("class", "oneMemberAvatarFrame");
    const oneMemberAvatar = document.createElement("img");
    const oneMemberAvatarLink = document.createElement("a");
    oneMemberAvatarLink.setAttribute("href", "/member/"+ userId);
    oneMemberAvatar.setAttribute("src", userAvatar);
    oneMemberAvatar.setAttribute("class", "oneMemberAvatar");
    oneMemberAvatarLink.appendChild(oneMemberAvatar);
    oneMemberAvatarFrame.appendChild(oneMemberAvatarLink);
    const oneMemberNameFrame = document.createElement("div");
    oneMemberNameFrame.setAttribute("class", "oneMemberNameFrame");
    const oneMemberNameLink = document.createElement("a");
    oneMemberNameLink.setAttribute("href", "/member/"+ userId);
    const oneMemberName = document.createElement("div");
    oneMemberName.textContent = userName;
    oneMemberName.setAttribute("class", "oneMemberName");
    oneMemberNameLink.appendChild(oneMemberName);
    oneMemberNameFrame.appendChild(oneMemberNameLink);
    const oneMemberSettingFrame = document.createElement("div");
    oneMemberSettingFrame.setAttribute("class", "oneMemberSettingFrame");
    const oneMemberSetting = document.createElement("img");
    oneMemberSetting.setAttribute("src", "/icon/ellipsis.png");
    oneMemberSetting.setAttribute("class", "deleteMemberButton");
    oneMemberSettingFrame.appendChild(oneMemberSetting);
    oneMemberFrame.appendChild(oneMemberAvatarFrame);
    oneMemberFrame.appendChild(oneMemberNameFrame);
    oneMemberFrame.appendChild(oneMemberSettingFrame);
    if(permissions){
        const deleteMemberButtonFrame = document.createElement("div");
        deleteMemberButtonFrame.setAttribute("class", "deleteMemberButtonFrame");
        const deleteMember = document.createElement("div");
        deleteMember.setAttribute("class", "deleteMember");
        deleteMember.textContent = "踢出社團"
        deleteMemberButtonFrame.appendChild(deleteMember)
        oneMemberSettingFrame.appendChild(deleteMemberButtonFrame)
        deleteMemberFrame(oneMemberSetting, deleteMemberButtonFrame)
        deleteMemberButton(deleteMember, userId, oneMemberFrame)
    }
    return oneMemberFrame
}
//確認 拒絕
function societyMemberConfirmClick(memberRequestConfirm, memberRequestReject, userId, userName, userAvatar, one){
    memberRequestConfirm.addEventListener("click", ()=>{
        const data = {
            confirm : "ACCEPTED",
            userId : userId,
            userName : userName,
            userAvatar : userAvatar
        }
        fetch(`/api${path}/memberRequests`, {
            method:"PUT",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data.ok){
                one.remove()
            }
        })
    })
    memberRequestReject.addEventListener("click", ()=>{
        const data = {
            confirm : "DECLINED",
            userId:userId,
            userName:userName,
            userAvatar:userAvatar
        }
        fetch(`/api${path}/memberRequests`, {
            method:"PUT",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data.ok){
                one.remove()
            }
        })
    })
}
//切換討論頁
talk.addEventListener("click", ()=>{
    societyArticle.style.display = "block"
    aboutSociety.style.display = "block"
    memberRequestFrame.style.display = "none"
    societyMemberFrame.style.display = "none"
})
//
fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        memberCenter.textContent = nowUserName;
        memberNameLink.href = "/member/" + nowUserId
        memberSystemAvatar.src = nowUserAvatar;
        memberPostAvatarImg.src = nowUserAvatar;
    }else{
        window.location.href = "/login"
    }
})
//社團封面
closeX.addEventListener("click", ()=>{
    backgroundOutPutFrame.innerHTML = ""
    backgroundFrame.style.display = "none"
    backUpdateBackgroundFrame.classList.add("none")
})
societyEditBackgroundButton.addEventListener("click", ()=>{
    backUpdateBackgroundFrame.classList.remove("none")
    backgroundFrame.style.display = "block"
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
backgroundButton.addEventListener("click", ()=>{
    backgroundButton.style.pointerEvents = "none";
    const dateTime = new Date();
    const timestamp = dateTime.getTime();
    const formData = new FormData()
    formData.append("image", backgroundUpload.files[0])
    formData.append("dateTime", timestamp);
    fetch(`/api${path}/background`,{
        method:"post",
        body:formData
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if (data.ok == true){
            societyBackground.src = data.picUrl
            backgroundButton.style.pointerEvents = "auto";
            backgroundFrame.style.display = "none"
            backgroundOutPutFrame.innerHTML = ""
        }
    })
})
//邀請
function oneInviteFrame(userId, userName, userAvatar){
    const oneFriendFrame = document.createElement("div");
    oneFriendFrame.className = "oneFriendFrame";
    const oneFriendImageFrame = document.createElement("div");
    oneFriendImageFrame.setAttribute("class", "oneFriendImageFrame");
    oneFriendFrame.appendChild(oneFriendImageFrame);
    const image = document.createElement("img");
    image.setAttribute("src", userAvatar);
    image.setAttribute("class", "PostLikerImage");
    oneFriendImageFrame.appendChild(image);
    const oneFriendNameFrame = document.createElement("div");
    oneFriendNameFrame.setAttribute("class", "oneFriendNameFrame");
    oneFriendFrame.appendChild(oneFriendNameFrame);
    const name = document.createElement("span");
    name.setAttribute("class", "oneFriendName");
    name.textContent = userName;
    oneFriendNameFrame.appendChild(name);
    const inviteFrame = document.createElement("div");
    inviteFrame.setAttribute("class", "inviteFrame");
    oneFriendFrame.appendChild(inviteFrame);
    const invite = document.createElement("div");
    invite.setAttribute("class", "invite");
    inviteFrame.appendChild(invite);
    const plusIcon = document.createElement("img");
    plusIcon.setAttribute("src", "/icon/pluswhite.png");
    plusIcon.setAttribute("width", "16px");
    invite.appendChild(plusIcon);
    const inviteText = document.createTextNode("邀請");
    invite.appendChild(inviteText);
    inviteFriend(inviteFrame, invite, userId);
    return oneFriendFrame
}
const allFriendInviteFrame = document.querySelector(".allFriendInviteFrame")
const societyInviteFrame = document.querySelector(".societyInviteFrame")
const closeInvite = document.querySelector(".closeInvite")
societyInvite.addEventListener("click", async()=>{
    allFriendInviteFrame.innerHTML = ""
    societyInviteFrame.style.display = "block"
    backgroundFrame.style.display = "flex"
    const response = await fetch(`/api${path}/member`)
    const data = await response.json()
    const allsocietyMember = data.allsocietyMember
    fetch("/api/friend").then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data)
        const friends = data.data.friends
        const existedFriends = new Set()
        for (let i in allsocietyMember) {
          existedFriends.add(allsocietyMember[i].userId)
        }
        for (let i in friends) {
            if (!existedFriends.has(friends[i].userId)) {
              const inviteFrame = oneInviteFrame(friends[i].userId, friends[i].userName, friends[i].userAvatar)
              allFriendInviteFrame.appendChild(inviteFrame)
            }
          }
    })
})
closeInvite.addEventListener("click", ()=>{
    societyInviteFrame.style.display = "none"
    backgroundFrame.style.display = "none"
})
function inviteFriend(inviteFrame, invite, userId){
    inviteFrame.addEventListener("click", ()=>{
        inviteFrame.style.pointerEvents = "none";
        invite.textContent = "已邀請"
        const data = {
            userId : userId
        }
        fetch(`/api${path}/invite`,{
            method : "POST",
            body:JSON.stringify(data),
            headers:new Headers({
                "content-type": "application/json"
            })
        })
    })
}

//社團說明
const addSocietyIntroduce = document.querySelector(".addSocietyIntroduce")
societyIntroduce.addEventListener("click", ()=>{
    addSocietyIntroduce.value = societyIntroduction.textContent
    addSocietyIntroduceframe.classList.remove("none")
})

confirmbutton.addEventListener("click", ()=>{
    addSocietyIntroduceframe.classList.remove("none")
    const data = {
        description: addSocietyIntroduce.value
    }
    fetch(`/api${path}`, {
        method:"PATCH",
        body:JSON.stringify(data),
        headers:new Headers({
            "content-type": "application/json"
        })
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.ok){
            societyIntroduction.textContent = data.description
            addSocietyIntroduceframe.classList.add("none")
        }
    })
})
cancelbutton.addEventListener("click", ()=>{
    addSocietyIntroduce.value = ""
    addSocietyIntroduceframe.classList.add("none")
})

const societyPostLocation = document.querySelector(".societyPostLocation")
const societyLastClickPost = document.querySelector(".societyLastClickPost")
const societyPostPicture = document.querySelector(".societyPostPicture")
const societyPostTextInput = document.querySelector(".societyPostTextInput")
const locationFrame = document.querySelector(".locationFrame")
const imageFrame = document.querySelector(".imageFrame")
const closelocation = document.querySelector(".closelocation")
const closeImage = document.querySelector(".closeImage")
const closePostLiker = document.querySelector(".closePostLiker")
const searchlocation = document.querySelector(".searchlocation")
const searchresultframeback = document.querySelector(".searchresultframeback")
const findlocation = document.querySelector(".findlocation ")
const button = document.querySelector(".button ")
const imagePreview = document.querySelector(".imagePreview")
const upload = document.querySelector(".upload")
const errorMessage = document.querySelector(".errorMessage")
const postLikerFrame = document.querySelector(".postLikerFrame")

societyPostLocation.addEventListener("click", ()=>{
    backgroundFrame.style.display = "flex";
    locationFrame.className = "locationFrame";
})
societyPostPicture.addEventListener("click", ()=>{
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
    societyPostLocation.classList.remove("color")
})
closePostLiker.addEventListener("click", ()=>{
    backgroundFrame.style.display = "none";
    postLikerFrame.className = "postLikerFrame none"
})
societyLastClickPost.addEventListener("click", ()=>{
    Fakebookloading.style.display = "flex";
    Fakebookloading.style.opacity = "0.5";
    const selectlocation = document.querySelector(".selectlocation")
    const postText = societyPostTextInput.value;
    let files = upload.files;
    const dateTime = new Date();
    const timestamp = dateTime.getTime();
    const formData = new FormData();
    const judgeLocation = societyPostLocation.className.includes("color");
    const judgePicture = societyPostPicture.className.includes("color");
    if(judgeLocation){
        let location = selectlocation.textContent;
        formData.append("location", location);
    }
    for(let i=0 ; i < files.length ; i++){
        formData.append("images", files[i]);
    };
    formData.append("dateTime", timestamp);
    formData.append("postText", postText);
    fetch(`/api${path}`, {
        method:"POST",
        body:formData
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.error){
        }else{
            societyPostTextInput.value = ""
            if(judgeLocation){
                findlocation.innerHTML = ""
                societyPostPicture.classList.remove("color")
                societyPostLocation.classList.remove("color")
            }else if(judgePicture){
                imagePreview.innerHTML = ""
                societyPostLocation.classList.remove("color")
                societyPostPicture.classList.remove("color")
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
        Fakebookloading.style.display = "none";
    })
})
button.addEventListener("click", ()=>{
    if(upload.files.length != 0){
        backgroundFrame.style.display = "none";
        imageFrame.className = "imageFrame none";
        societyPostPicture.classList.add("color")
    }
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
                    societyPostLocation.classList.add("color")
                    const locationClose = document.querySelector(".locationClose")
                    locationClose.addEventListener("click", ()=>{
                        findlocation.innerHTML = ""
                        societyPostLocation.classList.remove("color")
                    })
                })
            })
        }
    })
})

let nextPage = 0
fetch(`/api${path}/article?postPage=${nextPage}`).then((response)=>{
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
            article[i].societyId,
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

function postArticle(postId, societyId, dateTime, postText, images, postLiker, postLike, postUserId, userName, userAvatar, postComment, location){
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
            postMemberavatarLink.setAttribute("href", "/member/" + postComment[i].societyPostCommentUserId);
            const userAvatarchat = document.createElement("img");
            userAvatarchat.setAttribute("src", postComment[i].societyPostCommentAvatar);
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
            postMembernameLink.setAttribute("href", "/member/" + postComment[i].societyPostCommentUserId);
            postMembernameLink.textContent = postComment[i].societyPostCommentUserName;
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
    chatMessage(chatboxInputFrame, postId, userName, userAvatar, messagechatFrame, allchatmessageFrame, messageIconFrameDiv, chatCount)
    lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount, messageIconFrameDiv, inputElement)
    chatboxInputFrame.appendChild(inputElement);
    chatBoxFrame.appendChild(chatboxAvatarFrame);
    chatBoxFrame.appendChild(chatboxInputFrame);
    postContainerDiv.appendChild(chatBoxFrame)
    postBlockDiv.appendChild(postContainerDiv);
    return postBlockDiv
}

const allPostLikerFrame = document.querySelector(".allPostLikerFrame ")
function lookLiker(likeIconFrameDiv, postLiker, postId){
    likeIconFrameDiv.addEventListener("click", async()=>{
        backgroundFrame.style.display = ""
        postLikerFrame.classList.remove("none")
        allPostLikerFrame.innerHTML = ""
        fetch(`/api${path}/like?postId=${postId}`).then((response)=>{
            return response.json()
        }).then((data)=>{
            const postLiker = data.allLiker
            for(i in postLiker){
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
    if(i%2){
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
        fetch(`/api${path}/like`, {
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

function lookmessagechatFrame(messagechatFrame, allchatmessageFrame, chatCount, messageIconFrameDiv, inputElement){
    messageIconFrameDiv.addEventListener("click", ()=>{
        if(chatCount){
            allchatmessageFrame.className = "allchatmessageFrame none"
            chatCount = 0
        }else{
            allchatmessageFrame.className = "allchatmessageFrame"
            chatCount = 1
        }
    })
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
            
            fetch(`/api${path}/comment`, {
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
//刪除社團
deleteList.addEventListener("click", function(e) {
    deleteFrame.style.display = "flex"
    e.stopPropagation()
})

body.addEventListener("click", function() {
    deleteFrame.style.display = "none"
})

deleteFrame.addEventListener("click", function(e) {
    e.stopPropagation()
})
deleteFrame.addEventListener("click", ()=>{
    fetch(`/api${path}/delete`, {
        method:"DELETE"
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data.ok){
            window.location.href = "/"
        }
    })
})

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
                await fetch(`/api${path}/article?postPage=${nextPage}`).then(function(response){
                    return response.json();
                }).then(function(data){
                    postloading.style.display = "none"
                    const next = data.nextPage
                    const article = data.articleData
                    for(let i =0; i<article.length; i++){
                        let newPostArticle = postArticle(
                            article[i].postId,
                            article[i].societyId,
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