document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.querySelector('#usernameInput');
    const searchButton = document.querySelector('#searchButton');
    const randomButton = document.querySelector('#randomButton');
    const containerUserProfile = document.querySelector('.container');
    const profileContainer = document.querySelector('#profileContainer');
    const avatar = document.querySelector('#avatar');
    const username = document.querySelector('#username');
    const bio = document.querySelector('#bio');
    const location = document.querySelector('#location');
    const followers = document.querySelector('#followers');
    const reposContainer = document.querySelector('#reposContainer');

    const isValidUsername = (username) => /^[a-zA-Z0-9_-]+$/.test(username);

    searchButton.addEventListener('click', () => {
        const inputUsername = usernameInput.value.trim();
        if (isValidUsername(inputUsername)) {
            fetch(`https://api.github.com/users/${inputUsername}`)
                .then(response => response.json())
                .then(data => {
                    containerUserProfile.style.display = 'block';
                    avatar.src = data.avatar_url;
                    username.textContent = data.login;
                    bio.textContent = `Біографія : ${data.bio || 'Відсутня'}` ;
                    location.textContent = `Місцезнаходження: ${data.location || 'Відсутне'}`;
                    followers.textContent = `Кількість підписників: ${data.followers}`;
                    profileContainer.classList.remove('hidden');
                    loadRepositories(inputUsername);
                })
                .catch(error => {
                    console.error(error);
                    profileContainer.classList.add('hidden');
                    reposContainer.innerHTML = '';
                    alert('Користувача не знайдено або сталася помилка.');
                });
        } else {
            alert('Не вірне ім\'я користувача');
        }
    });

    randomButton.addEventListener('click', () => {
        fetch('https://api.github.com/users')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                const randomUser = data[randomIndex].login;
                usernameInput.value = randomUser;
                searchButton.click();
            })
            .catch(error => {
                console.error(error);
                alert('Помилка отримання випадкового користувача.');
            });
    });

    const loadRepositories = (username) => {
        fetch(`https://api.github.com/users/${username}/repos`)
            .then(response => response.json())
            .then(data => {
                reposContainer.innerHTML = '';
                data.forEach(repo => {
                    const repoCard = document.createElement('div');
                    repoCard.classList.add('repo-card');

                    const repoName = document.createElement('div');
                    repoName.classList.add('repo-name');
                    repoName.textContent = repo.name;

                    const repoDescription = document.createElement('div');
                    repoDescription.classList.add('repo-description');
                    repoDescription.textContent = repo.description || 'Немає опису';

                    repoCard.append(repoName);
                    repoCard.append(repoDescription);
                    reposContainer.append(repoCard);
                });
                reposContainer.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
                reposContainer.innerHTML = '';
            });
    };
});