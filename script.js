document.addEventListener('DOMContentLoaded', () => {
    // Signup Form Logic
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = signupForm.querySelector('#username').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;
            const confirmPassword = signupForm.querySelector('#confirm-password').value;
            const signupMessage = document.getElementById('signupMessage');

            if (password !== confirmPassword) {
                signupMessage.style.color = 'red';
                signupMessage.textContent = '비밀번호가 일치하지 않습니다.';
                return;
            }

            if (password.length < 8) {
                signupMessage.style.color = 'red';
                signupMessage.textContent = '비밀번호는 8자 이상이어야 합니다.';
                return;
            }

            // Save user data to localStorage (for client-side demo)
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[username]) {
                signupMessage.style.color = 'red';
                signupMessage.textContent = '이미 존재하는 아이디입니다.';
                return;
            }

            users[username] = { password: password, email: email, name: '' }; // Add name field
            localStorage.setItem('users', JSON.stringify(users));

            signupMessage.style.color = 'green';
            signupMessage.textContent = '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.';
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Login Form Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = loginForm.querySelector('#username').value;
            const password = loginForm.querySelector('#password').value;
            const loginMessage = document.getElementById('loginMessage');

            const users = JSON.parse(localStorage.getItem('users')) || {};

            if (users[username] && users[username].password === password) {
                loginMessage.style.color = 'green';
                loginMessage.textContent = '로그인 성공! 프로필 페이지로 이동합니다.';
                // Store logged-in user (simple session management)
                localStorage.setItem('loggedInUser', username);
                
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                loginMessage.style.color = 'red';
                loginMessage.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
            }
        });
    }

    // Profile Page Logic (displaying user info)
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (loggedInUser && users[loggedInUser]) {
            const userInfo = users[loggedInUser];
            profileContainer.querySelector('.profile-info div:nth-child(1) span').textContent = loggedInUser;
            profileContainer.querySelector('.profile-info div:nth-child(2) span').textContent = userInfo.email;
            profileContainer.querySelector('.profile-info div:nth-child(3) span').textContent = userInfo.name || '이름 없음'; 
            profileContainer.querySelector('.profile-info div:nth-child(4) span').textContent = userInfo.signupDate || new Date().toLocaleDateString('ko-KR');

            // Logout button logic
            const logoutBtn = profileContainer.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('loggedInUser');
                    alert('로그아웃 되었습니다.');
                    window.location.href = 'login.html'; // Redirect to login page
                });
            }
        } else {
            // If not logged in, redirect to login page
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
        }
    }

    // Edit Profile Form Logic
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const editProfileMessage = document.getElementById('editProfileMessage');

        if (!loggedInUser || !users[loggedInUser]) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return;
        }

        const currentUser = users[loggedInUser];

        // Populate form fields with current user data
        editProfileForm.querySelector('#editUsername').value = loggedInUser;
        editProfileForm.querySelector('#editEmail').value = currentUser.email || '';
        editProfileForm.querySelector('#editName').value = currentUser.name || '';

        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newEmail = editProfileForm.querySelector('#editEmail').value;
            const newName = editProfileForm.querySelector('#editName').value;
            const newPassword = editProfileForm.querySelector('#editPassword').value;
            const confirmNewPassword = editProfileForm.querySelector('#confirmEditPassword').value;

            if (newPassword && newPassword !== confirmNewPassword) {
                editProfileMessage.style.color = 'red';
                editProfileMessage.textContent = '새 비밀번호가 일치하지 않습니다.';
                return;
            }

            if (newPassword && newPassword.length < 8) {
                editProfileMessage.style.color = 'red';
                editProfileMessage.textContent = '새 비밀번호는 8자 이상이어야 합니다.';
                return;
            }

            // Update user data
            currentUser.email = newEmail;
            currentUser.name = newName;
            if (newPassword) {
                currentUser.password = newPassword;
            }
            users[loggedInUser] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));

            editProfileMessage.style.color = 'green';
            editProfileMessage.textContent = '프로필 정보가 성공적으로 업데이트되었습니다!';
            
            // Optionally redirect back to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        });
    }
});