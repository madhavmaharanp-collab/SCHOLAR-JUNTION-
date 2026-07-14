function validateEvent(){ return true; }
function publishEvent(){ if(validateEvent()){ showToast('Event published • invites sent'); location.href='events.html'; } }
