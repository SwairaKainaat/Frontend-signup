   // Configuration
      const API_URL = 'http://localhost:8080/auth/signup';

      // Elements
      const form = document.getElementById('signupForm');
      const submitBtn = document.getElementById('submitBtn');
      const message = document.getElementById('message');
      const togglePwd = document.getElementById('togglePwd');
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirm');

      // Toggle both password fields visibility
      togglePwd.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        confirmInput.type = isHidden ? 'text' : 'password';
        togglePwd.textContent = isHidden ? 'Hide' : 'Show';
      });

      function setMessage(text = '', type = ''){
        message.textContent = text;
        message.className = 'msg' + (type ? ' ' + type : '');
      }

      function validate(){
        const name = form.fullName.value.trim();
        const pwd = passwordInput.value;
        const confirm = confirmInput.value;

        if(!name) return 'Please enter your full name.';
        if(!pwd) return 'Please enter a password.';
        if(pwd.length < 8) return 'Password must be at least 8 characters.';
        if(pwd !== confirm) return 'Passwords do not match.';
        return '';
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setMessage('');

        const err = validate();
        if(err){ setMessage(err, 'error'); return; }

        // prepare payload
        const payload = { name: form.fullName.value.trim(), password: passwordInput.value };

        // disable
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing up...';

        try{
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          let data = null;
          try{ data = await res.json(); }catch(e){}

          if(res.ok){
            setMessage((data && data.message) ? data.message : 'Account created successfully!', 'success');
            form.reset();
          }else{
            const errMsg = (data && (data.error || data.message)) || `Signup failed (status ${res.status})`;
            setMessage(errMsg, 'error');
          }
        }catch(err){
          console.error(err);
          setMessage('Network error — could not reach the server.', 'error');
        }finally{
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign up';
        }
      });

      // instant feedback while typing
      form.addEventListener('input', () => { if(message.textContent) setMessage(''); });

      // basic enter-key convenience on confirm field
      confirmInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') submitBtn.click(); });
   