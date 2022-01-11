//selects div with class "overview" -> div that renders profile information pulled from Github
const overview = document.querySelector(".overview");
//github username
const username = "ivybergstrom";
//selects ul to display repos list
const repoList = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData= document.querySelector(".repo-data");



//function for fetching API for user information
const getApi = async function () {
    const showRequest = await fetch (`https://api.github.com/users/${username}`);
    const data = await showRequest.json();
    displayUserInfo(data);
};

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

//for rendering repo info, set to accept data fromm getRepos api call
const displayRepoInfo = function (repos) {
for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `
    <h3>${repo.name}</h3>`
    repoList.append(repoItem);
    }

    getRepos();
};

repoList.addEventListener("click", function (e){
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoDetails(repoName);
    }
});

const getRepoDetails = async function (repoName){
    const showRequest = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await showRequest.json();
    console.log(repoInfo); 

    //this is for fetching languages and making them an array
    const fetchLanguages = await fetch (repoInfo.languages_url); 
        const languageData = await fetchLanguages.json();
        console.log(languageData);

    //array for languages
    let languages = []
    for (const language in languageData) {
        languages.push(language);
    }

    displayRepoDetails(repoInfo, languages);
};

//displaying repo details
const displayRepoDetails = function (repoInfo, languages) {
    repoData.innerHTML="";
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.repo_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;

    repoData.append(div);
};
 
//The next part of the lesson will be about creating an array of languages
//After you make that array, figure out if you can have the search fitler there. 
//may require you to adjust the display to make every repo element visible, cross reference React App for hotel

//tbd: how to pull project languages
    //then add them as a search option

