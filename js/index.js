function submitForm(button) {
   button.disabled = true;
   showLoader();
   const emailInput = document.querySelector('#email');
   if (!emailInput.value) {
      alert('Wpisz swój email!');
      return;
   }
   let url = window.location.href.split('/')
   url.pop();
   url = url.join('/');
   // fetch("https://mathmasters-meetings-backend.onrender.com/meeting/request", {
   fetch("https://mathmasters-meetings-backend.onrender.com/meeting/request", {
      method: "POST",
      body: JSON.stringify({
         email: emailInput.value,
         domain: url
      }),
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
   }).then(response => {
      if (response.status >= 300) {
         window.location.href = 'error.html';
      } else {
         hideLoader()
         window.location.href = 'success.html';
      }
   });
}