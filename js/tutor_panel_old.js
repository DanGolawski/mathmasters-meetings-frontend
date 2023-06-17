waitingMeetingId = null;
meetingInProgress = null;

getNumberOfWaitingClients();
setInterval(() => getNumberOfWaitingClients(), 5000);

function getNumberOfWaitingClients() {
   fetch('https://mathmasters-meetings-backend.onrender.com/waiting_clients').then(res => res.json()).then(response => {
      displayNumberOfClients(response.waiting_clients);
      waitingMeetingId = response.longest_waiting_client;
   }).catch(error => console.log(error));
}

function displayNumberOfClients(numberOfClients) {
   document.querySelector('#waiting-clients-number').innerHTML = numberOfClients;
}

function joinMeeting() {
   if (!waitingMeetingId || waitingMeetingId === 0) {
      return;
   }
   showLoader()
   meetingInProgress = waitingMeetingId;
   openJitsiMeeting(meetingInProgress);
   setMeetingAsInProgress(meetingInProgress);
}

function closeMeeting() {
   const uploadedFiles = document.querySelector('#file-uploader').files;
   if (!uploadedFiles.length) {
      alert('Wyślij tablicę!');
      return;
   }
   showLoader()
   const file = uploadedFiles[0];
   const reader  = new FileReader();
   reader.readAsDataURL(file);
 
   reader.onloadend = function () {
      const payload = new FormData();
      payload.append('image', file, 'image.png');

      fetch(`https://mathmasters-meetings-backend.onrender.com/meeting/close/202306142029094881`, {
         method: "POST",
         body: payload,
      })
      .then(res => res.json())
      .then(data => window.location.reload())
      .catch(err => alert(err))
      .finally(hideLoader);
   }
   
 }

function cancelMeeting() {
   showLoader();
   fetch(`https://mathmasters-meetings-backend.onrender.com/meetings/status/change`, {
      method: 'PUT',
      body: JSON.stringify({
         new_status: 'CANCELED',
         meeting_id: meetingInProgress
      }),
      headers: { 'Content-Type': 'application/json' },
   })
   .then(response => response.json()).then(response => alert('Anulowano spotkanie'))
   .catch(error => alert('Nie udało się anulować spotkania'))
   .finally(hideLoader);
}

function openJitsiMeeting(meetingId) {
   const domain = "meet.jit.si";
   const options = {
      roomName: meetingId,
      parentNode: document.querySelector('#meeting-screen'),
      configOverwrite: {},
      interfaceConfigOverwrite: {}
   }
   const api = new JitsiMeetExternalAPI(domain, options);
}

function setMeetingStatusAsInProgress(meetingId) {
   fetch(`https://mathmasters-meetings-backend.onrender.com/meetings/status/change`, {
      method: 'PUT',
      body: JSON.stringify({
         new_status: 'INPROGRESS',
         meeting_id: meetingId
      }),
      headers: { 'Content-Type': 'application/json' },
   }).catch(error => alert('nie udało się zmienić statusu spotkania!'))
   .finally(hideLoader);
}