//selects div with class "overview" -> div that renders profile information pulled from Github
const overview = document.querySelector(".overview");
//github username
const username = "ivybergstrom";
//selects ul to display repos list
const repoList = document.querySelector(".repo-list");
const allRepos = document.querySelector(".repos");
const repoData= document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


//function for fetching API for user information
const getApi = async function () {
    const showRequest = await fetch (`https://api.github.com/users/${username}`);
    const data = await showRequest.json();
    displayUserInfo(data);
};
    //this is only for collecting profile data about user
getApi();

//renders user info collected in getApi
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> `

    overview.append(div);
    getRepos();
};

//for fetching user repositories from Github
const getRepos = async function () {
    const showRequest = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const reposData = await showRequest.json();
    //console.log(reposData); this was just to verify that the API was successful
    displayRepoInfo(reposData);
};

//for rendering repo list, set to accept data fromm getRepos api call
const displayRepoInfo = function (allRepos) {
    filterInput.classList.remove("hide");
for (const repo of allRepos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `
    <h3>${repo.name}</h3>`
    repoList.append(repoItem);
    }

    getRepos();
};

repoList.addEventListener("click", function (e){ //function for selecting individual repos to see details
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoDetails(repoName);
    }
});

const getRepoDetails = async function (repoName){
    const showRequest = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await showRequest.json();
    console.log(repoInfo); 

    //this is for fetching languages so we can make them into an array
    const fetchLanguages = await fetch (repoInfo.languages_url); 
        const languageData = await fetchLanguages.json();
    

    //array for languages
    let languages = []
    for (const language in languageData) {
        languages.push(language);
    }

    displayRepoDetails(repoInfo, languages);
};

//displaying repo details
const displayRepoDetails = function (repoInfo, languages) {
    backButton.classList.remove("hide");
    repoData.innerHTML="";
    repoData.classList.remove("hide");
    allRepos.classList.add("hide");

    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.repo_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

    repoData.append(div);
};

//for returning to list that displays all repos 
backButton.addEventListener("click", function (e){
    allRepos.classList.remove("hide");
    repoData.classList.add("hide");
    backButton.classList.add("hide");
});

 //dynamic search- applies entered text to lowercase value- should work for anything that is entered: repo names or languages used
filterInput.addEventListener("input", function(e){
    const beingSearched = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchedTextLower = beingSearched.toLowerCase();


    //matching search value (beingSearched/searchTextLower) to information on screen
    for (const repo of repos) { 
        const repoTextLower= repo.innerText.toLowerCase();
        if (repoTextLower.includes(searchedTextLower)){
            repo.classList.remove("hide");
        } else if(repoTextLower.includes(languages)){ //this is the conditional statement added for trying to add search by language feature, does not currently work because languages comes back as undefined, duue to scope
            repo.classList.remove("hide");
        }
         else {
            repo.classList.add("hide");
        };
    
    
    //Option A: adapt the current search feature to include a languages in what it is comparing, for another else if statement
        //issue: languages array is not a global variable, so it cannot read it from the section where we are matching the search value

    //Option B: add a new search section, which would loop through languages[] and apply elements to a function that indicates if they would match
        //still has issue of Option A

    //Option C: convert to ES6, transfer everything to a react application and pass a reference from language array to if statement



    };
});
//The next part of the lesson will be about creating an array of languages
//After you make that array, figure out if you can have the search fitler there. 
//may require you to adjust the display to make every repo element visible, cross reference React App for hotel

//CHALLENGE: language array is in a function scope

