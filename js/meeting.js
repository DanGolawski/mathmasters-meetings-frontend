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


fetch(`http://localhost:5000/meeting/status`, {
   method: 'PUT',
   body: JSON.stringify({
      new_status: 'STARTED',
      meeting_id: meetingId
   }),
   headers: { 'Content-Type': 'application/json' },
}).catch(error => window.location.href = 'error.html');