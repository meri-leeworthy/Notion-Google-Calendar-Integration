const notion = require("./lib/notion");
const getCalendarEvents = require("./lib/google");

//format Google Calendar event into the format Notion expects
//and only send event end time if there is one on the GCal one
const formatNotionEvent = (event) => {
  const formattedEvent = {
    title: event.summary,
    id: event.id,
    start: event.start,
    status: event.status,
    description: event.description ? event.description : "",
  };

  event.end ? (formattedEvent.end = event.end) : null;

  return formattedEvent;
};

const syncNotionToGoogle = (googleEvents, dictionary) => {
  //iterate through events; for each one, update or create a Notion event
  googleEvents.forEach((event) => {
    dictionary[event.id]
      ? notion.updateEvent(formatNotionEvent(event), dictionary[event.id])
      : notion.createEvent(formatNotionEvent(event));
  });
};

module.exports = async function bigSync() {
  //get a dictionary that maps Google calendar IDs to Notion calendar ID
  const dictionary = await notion.getEventDictionary();

  //set the range of dates to fetch from Google calendar
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 90);
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 90);

  //fetch events from Google calendar
  const { nextSyncToken, googleEvents } = await getCalendarEvents(
    oldDate,
    newDate
  );

  // console.log(googleEvents);
  console.log(`nextSyncToken: ${nextSyncToken}`);
  syncNotionToGoogle(googleEvents, dictionary);
};

//notion.getDatabase() can be used to get the database id or property ids

//TODO: syncGoogleToNotion ??
//TODO: webhooks server
