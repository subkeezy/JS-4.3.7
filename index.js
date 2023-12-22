const searchInput = document.querySelector('.input');
const wrapper = document.querySelector('.search-app');
const searchInputContainer = document.querySelector('.input-container')

const usersList = document.createElement('ul');
const noUsersFound = document.createElement('p');

const infoTitle = document.createElement('h2')
const reposInfoList = document.createElement('ul');

const secretMessage = document.createElement('p')
wrapper.append(secretMessage);
secretMessage.classList.add('secret-message')
secretMessage.innerHTML = `Looking for something? &#128527`

const url = `https://api.github.com/search/repositories?q=`;

const reposList = []

async function getRepos() {
  if (searchInput.value && searchInput.value.indexOf(' ') === -1) {
  secretMessage.innerHTML = '';
  secretMessage.remove()
  noUsersFound.innerHTML = '';
  usersList.innerHTML = '';
  return await fetch(`${url}${searchInput.value}`)
    .then((res) => {
      try {
        if (res.ok) {
          res.json().then((repos) => {
            const newRepos = [...repos.items]
            console.log(newRepos)
            let reposNames = []
            for (let repo of newRepos) {
              reposNames.push(repo.name)
              reposList.push(repo)
            }
            createSearchElements(reposNames)
          })
        } else {
          throw new Error('Request failed!')
        }
      }
      catch(err) {
        console.log(err)
      }
    })
  } else {
    usersList.innerHTML = '';
    noUsersFound.innerHTML = '';
  }
}


function createSearchElements(repoArr) {
  let newRepoArr = new Array(...new Set(repoArr)).slice(0, 5) 
  searchInputContainer.append(usersList)
  usersList.classList.add('users-list')

  for (let i = 0; i < newRepoArr.length; i++) {
    let usersItem = document.createElement('li')
    usersList.append(usersItem)
    usersItem.classList.add('item')

    let usersItemBtn = document.createElement('button')
    usersItem.append(usersItemBtn)
    usersItemBtn.classList.add('item-btn')

    usersItemBtn.textContent = `${newRepoArr[i]}`
  }
  if (newRepoArr.length === 0) {
    searchInputContainer.append(noUsersFound)
    noUsersFound.classList.add('message')
    noUsersFound.textContent = 'No repositories found.';
  } else {
    noUsersFound.innerHTML = '';
  }
}


const debounce = (fn, ms) => {
  let timeout;

  return function wrapper() {
    const newCall = () => {
      fn.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(newCall, ms)
  }
}

function reposInfo() {
  let target = event.target;

  wrapper.append(infoTitle)
  infoTitle.classList.add('info-title')
  infoTitle.textContent = 'Chosen repositories:';

  wrapper.append(reposInfoList)
  reposInfoList.classList.add('info-list');

  searchInput.value = '';
  usersList.innerHTML = '';


  reposList.forEach((el) => {
    if (el.name === target.textContent) {

      const reposInfoItem = document.createElement('li');
      reposInfoList.append(reposInfoItem)
      reposInfoItem.classList.add('info-item');


      const repoName = document.createElement('p');
      reposInfoItem.append(repoName)
      repoName.classList.add('repo-text', 'repo-name');
      repoName.textContent = `Name: ${el.name}`;

      const repoOwner = document.createElement('p');
      reposInfoItem.append(repoOwner)
      repoOwner.classList.add('repo-text', 'repo-owner');
      repoOwner.textContent = `Owner: ${el.owner.login}`;

      const repoStars = document.createElement('p');
      reposInfoItem.append(repoStars)
      repoStars.classList.add('repo-text', 'repo-stars');
      repoStars.textContent = `Stars: ${el.stargazers_count}`;

      const reposInfoDel = document.createElement('button');
      reposInfoItem.append(reposInfoDel);
      reposInfoDel.classList.add('del-btn')
      reposInfoDel.textContent = 'Delete';

      reposInfoDel.addEventListener('click', () => {
        reposInfoItem.remove();
        if (!reposInfoList.childNodes.length) {
          infoTitle.remove()
        }
      })
    }

  })
}


searchInput.addEventListener('keydown', debounce(getRepos, 500))
usersList.onclick = function(event) {
  reposInfo()
}



