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
let count = 0;


function searchDiv(userId, userName, userAvatar){
    const searchResultLink = document.createElement("a");
    searchResultLink.setAttribute("href", "/member/" + userId);
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
    let memberName = search.value
    fetch(`/api/search?memberName=${memberName}`).then((response)=>{
        return response.json()
    }).then((data)=>{
        let results = data.results
        console.log(results[0])
        if(results){
            searchResultFrame.style.display="block"
            allSearchResult.innerHTML = ""
            for(i in results){
                let search = searchDiv(
                    results[i].userId,
                    results[i].userName, 
                    results[i].userAvatar)
                    allSearchResult.append(search)
            }
        }
    })
})

searchFrame.addEventListener("click", function(e) {
    e.stopPropagation()
    searchResultFrame.style.display = searchResultFrame.style.display === "none" ? "block" : "none"
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

memberSystemFrame.addEventListener("click", ()=>{
    memberSystem.style.display = "" 
    count = 1
})
document.addEventListener("mousedown", () => {
    if (count == 1) {
        setTimeout(() => {
            memberSystem.style.display = "none" 
            count = 0;
        },150)
    }
});


// notifyFrame.onclick = function(e) {
//     e.stopPropagation()
//     notificationbarFrame.style.display = notificationbarFrame.style.display === "none" ? "block" : "none"
// }
// body.onclick = function() {
//     notificationbarFrame.style.display = "none"
// }
// notificationbarFrame.onclick = function(e) {
//     e.stopPropagation()
// }

notifyFrame.addEventListener("click", function(e) {
    e.stopPropagation()
    notificationbarFrame.style.display = notificationbarFrame.style.display === "none" ? "block" : "none"
})

body.addEventListener("click", function() {
    notificationbarFrame.style.display = "none"
})

notificationbarFrame.addEventListener("click", function(e) {
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