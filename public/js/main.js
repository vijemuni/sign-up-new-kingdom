document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetCodeForm = document.getElementById('resetCodeForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const googleLoginBtn = document.getElementById('googleLogin');
  
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }
  
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
  
    if (resetCodeForm) {
      resetCodeForm.addEventListener('submit', handleResetCode);
    }
  
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', handleResetPassword);
    }
  
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
  });
  
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
  
    try {
      const response = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
      alert(data.msg);
      if (response.ok) {
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('resetCodeForm').style.display = 'block';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function handleResetCode(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const resetCode = document.getElementById('resetCode').value;
  
    try {
      const response = await fetch('/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode })
      });
  
      const data = await response.json();
      if (response.ok) {
        document.getElementById('resetCodeForm').style.display = 'none';
        document.getElementById('resetPasswordForm').style.display = 'block';
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function handleResetPassword(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const resetCode = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
  
    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword })
      });
  
      const data = await response.json();
      alert(data.msg);
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function handleGoogleLogin() {
    try {
      const auth2 = await gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const id_token = googleUser.getAuthResponse().id_token;
  
      const response = await fetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: id_token })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }