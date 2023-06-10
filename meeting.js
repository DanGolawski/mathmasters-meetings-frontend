const url = window.location.href.split('?')

const meetingId = url[1]


var domain = "meet.jit.si";
var options = {
   roomName: meetingId,
   parentNode: document.querySelector('#meeting-screen'),
   configOverwrite: {},
   interfaceConfigOverwrite: {}
}
var api = new JitsiMeetExternalAPI(domain, options);


fetch(`http://localhost:5000/meeting/start/${meetingId}`, {
   method: 'PUT',
   headers: { 'Content-Type': 'application/json' },
}).then(response => {
   if (response.status >= 300) {
      window.location.href = 'error.html';
   }
})