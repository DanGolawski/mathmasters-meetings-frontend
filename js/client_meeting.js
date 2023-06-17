const meetingId = window.location.href.split('?')[1]

startMeeting(meetingId);

function startMeeting(meetingId) {
   fetch(`${apiUrl}/meetings/status/change`, {
      method: 'PUT',
      body: JSON.stringify({
         new_status: 'STARTED',
         meeting_id: meetingId
      }),
      headers: { 'Content-Type': 'application/json' },
   })
   .then(() => setTimeout(() => window.location.href = `https://meet.jit.si/${meetingId}`, 4000))
   .catch(error => window.location.href = 'error.html');
}