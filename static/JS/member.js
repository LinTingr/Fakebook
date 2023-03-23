const memberName = document.querySelector(".memberName")
const memberavatar = document.querySelector(".memberavatar")
const memberavatarFrame = document.querySelector(".memberavatarFrame")
const memberEditavatarFrame = document.querySelector(".memberEditavatarFrame")
const updateavatarFrame = document.querySelector(".updateavatarFrame")
const memberEditavatarText = document.querySelector(".memberEditavatarText")
const backupdateavatar = document.querySelector(".backupdateavatar")
const memberEditavatar = document.querySelector(".memberEditavatar")
const output = document.querySelector('.output');
const upload = document.querySelector(".upload")
const closeX = document.querySelector(".closeX")
const memberSystemAvatar = document.querySelector(".memberSystemAvatar")
const memberLink = document.querySelector(".memberLink")
const memberEdit = document.querySelector(".memberEdit")
const addFriendFrame = document.querySelector(".addFriendFrame")
const addFriend = document.querySelector(".addFriend")
const sendMessageFrame = document.querySelector(".sendMessageFrame")
const sendMessage = document.querySelector(".sendMessage")
const addfriendicon = document.querySelector(".addfriendicon")
const memberArticle = document.querySelector(".memberArticle")
const postBlock = document.querySelector(".postBlock")
const memberPostAvatarImg = document.querySelector(".memberPostAvatarImg")

let articleData
let nowUserId
let nowUserName
let nowUserAvatar
let visitUser

fetch("/api/user").then(response=>{
    return response.json()
}).then(data=>{
    console.log(data)
    if(data.ok){
        nowUserId = data.user.userid;
        nowUserName = data.user.username;
        nowUserAvatar = data.user.useravatar;
        memberLink.textContent = nowUserName;
        memberLink.href = "/member/" + nowUserId;
        memberSystemAvatar.src = nowUserAvatar;
        memberPostAvatarImg.src = nowUserAvatar;
    }else{
        window.location.href = "/login"
    }
})

const path = window.location.pathname
fetch(`/api${path}`).then(response=>{
    return response.json()
}).then(data=>{
    console.log(data)
    if(data.ok){
        const permissions = data.permissions
        const checkfriend = data.checkfriend.status
        visitUser = data.user.userid
        console.log(visitUser)
        memberName.textContent = data.user.username
        memberavatar.src = data.user.useravatar
        articleData = data.articleData
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
            memberEdit.style.display = "flex";
        }else{
            addFriendFrame.style.display = "flex";
            sendMessageFrame.style.display = "flex";
            memberEditavatarFrame.remove();
        }
        articleData.forEach(({ postId, societyId, dateTime, postText, images, postLike, postUserId, postUserName, postUserAvatar, postComment, location }) => {
            let postOwn = postArticle(postId, societyId, dateTime, postText, images, postLike, postUserId, postUserName, postUserAvatar, postComment, location);
            memberArticle.appendChild(postOwn);
        });
    }
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
})

closeX.addEventListener("click", ()=>{
    backupdateavatar.className = "backupdateavatar none"
})

upload.addEventListener("change", function(event) {
    let reader = new FileReader();
    reader.onload = function(){
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

const button = document.querySelector(".button")
button.addEventListener("click", ()=>{
    const upload = document.querySelector(".upload")
    let formdata = new FormData()
    formdata.append("image", upload.files[0])
    fetch("/api/member",{
        method:"POST",
        body:formdata
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data)
        if (data.ok == true){
            memberavatar.src = data.picUrl
            // 字根圖片都未輸入的時候該跳的
        }else{
        //     fetch("/api/member").then((response)=>{
        //         return response.json()
        //     }).then((data)=>{
        //         console.log(data)
        //         console.log(data.url) 
        //     })
        }
    })
})

// let nextPage = 0
// fetch(`/api/post/${nowUserId}?postPage=${nextPage}`).then((response)=>{
//     return response.json()
// }).then((data)=>{
//     console.log(data)
//     const next = data.nextPage
//     const article = data.articleData
//     for(let i = 0; i < article.length; i++){
//         let newPostArticle = postArticle(
//             article[i].postId,
//             article[i].societyId,
//             article[i].postDateTime,
//             article[i].postText,
//             article[i].images,
//             article[i].postLike,
//             article[i].postUserId,
//             article[i].postUserName,
//             article[i].postUserAvatar,
//             article[i].postComment,
//             article[i].location)
//         memberArticle.appendChild(newPostArticle)
//     }
//     if (next == 1){
//         nextPage = nextPage + 1 ;
//     }else{
//         nextPage = null;
//     }
//     getPost();
// })


// let loading = false
// function getPost(){
//     const allPostBlock = document.querySelectorAll(".postBlock");
//     // console.log(allPostBlock)
//     const threshold = 0.5
//     const options = {
//         root: null,
//         threshold: threshold,
//     };
//     const observer = new IntersectionObserver(callback, options);
//     console.log(allPostBlock[allPostBlock.length - 2])
//     if(allPostBlock){
//         observer.observe(allPostBlock[allPostBlock.length - 2]); 
//     }
     
// }
// // setTimeout(getPost, 1000)

// async function callback(entry){
//     if (entry[0].isIntersecting){
//         if (loading == false){
//             loading = true
//             console.log(nextPage)
//             if (nextPage != null){
//                 await fetch(`/api/post/${nowUserId}?postPage=${nextPage}`).then(function(response){
//                     return response.json();
//                 }).then(function(data){
//                     console.log(data)
//                     const next = data.nextPage
//                     console.log(next)
//                     const article = data.articleData
//                     console.log(article.length)
//                     for(let i =0; i<article.length; i++){
//                         let newPostArticle = postArticle(
//                             article[i].postId,
//                             article[i].societyId,
//                             article[i].postDateTime,
//                             article[i].postText,
//                             article[i].images,
//                             article[i].postLike,
//                             article[i].postUserId,
//                             article[i].postUserName,
//                             article[i].postUserAvatar,
//                             article[i].postComment,
//                             article[i].location)
//                         allArticle.appendChild(newPostArticle)
//                     }
//                     if (next == 1){
//                         nextPage = nextPage + 1 ;
//                     }else{
//                         nextPage = null;
//                     }
//                     getPost()
//                 })
//             }
//         }
//         loading = false
//     }
// }