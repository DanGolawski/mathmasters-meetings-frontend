function submitForm() {
   const emailInput = document.querySelector('#email');
   if (!emailInput.value) {
      alert('Wpisz swój email!');
      return;
   }
   let url = window.location.href.split('/')
   url.pop();
   url = url.join('/');
   fetch("http://localhost:5000/meeting/request", {
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
         window.location.href = 'success.html';
      }
   });
}