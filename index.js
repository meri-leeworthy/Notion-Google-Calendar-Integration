const notion = require("./lib/notion");
const getCalendarEvents = require("./lib/google");

(async () => {
  //   const notionEvents = await notion.getEvents();
  //   console.log(notionEvents);

  const nowDate = new Date();
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 10);

  const calendarEvents = await getCalendarEvents(oldDate, nowDate);
  //   console.log(calendarEvents);

  calendarEvents.forEach((event) => {
    const notionEvent = {
      title: event.summary,
      start: event.start,
      description: event.description ? event.description : ""
    };

    event.end ? (notionEvent.end = event.end) : null;

    console.log("google event: ");
    console.log(event);
    console.log("notionEvent: ");
    console.log(notionEvent);

    notion.createEvent(notionEvent);
  });

  //   notion.createEvent({
  //     title: "Meri Event 4",
  //     description: "This is the description of the event",
  //     date: "2021-07-14"
  //   });
})();

//notion.getDatabase() can be used to get the database id or property ids
