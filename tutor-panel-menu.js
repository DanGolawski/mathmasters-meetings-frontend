const menuPanel = document.querySelector('.menu-panel');
let waitingClientCheckInterval = null;
let longestWaitingMeetingId = null;
let currentMeetingId = null;

monitorState();

function showMenu() {
   menuPanel.style.marginLeft = 0;
   monitorState();
}

function closeMenu() {
   menuPanel.style.marginLeft = '-40vw';
   clearInterval(waitingClientCheckInterval);
}

function startMeeting() {
   if (!longestWaitingMeetingId) {
      return;
   }
   currentMeetingId = longestWaitingMeetingId;
   closeMenu();
   markMeetingAsInProgress(longestWaitingMeetingId);
   window.open(`https://meet.jit.si/${longestWaitingMeetingId}`, "_blank");
}

function markMeetingAsInProgress(meetingId) {
   fetch(`https://mathmasters-meetings-backend.onrender.com/meetings/status/change`, {
      method: 'PUT',
      body: JSON.stringify({
         new_status: 'INPROGRESS',
         meeting_id: meetingId
      }),
      headers: { 'Content-Type': 'application/json' },
   }).catch(error => alert(error));
}

function updateAndDisplayMeetingsStates() {
   fetch('https://mathmasters-meetings-backend.onrender.com/meetings/states').then(res => res.json()).then(response => {
      displayNumberOfClients(response.waiting_clients);
      updatePlannedMeetings(response.planned_meetings_statuses);
      longestWaitingMeetingId = response.longest_waiting_client;
   }).catch(error => console.log(error));
}

function displayNumberOfClients(numberOfClients) {
   document.querySelector('#waiting-clients-number').innerHTML = numberOfClients;
}

function updatePlannedMeetings(planned_meetings_statuses) {
   // do zrobienia po implementacji kalendarza
}

function monitorState() {
   updateAndDisplayMeetingsStates()
   waitingClientCheckInterval = setInterval(() => updateAndDisplayMeetingsStates(), 5000);
}
