const getNotionEvents = require("./lib/notion");
const getCalendarEvents = require("./lib/google");

(async () => {
  const notionEvents = await getNotionEvents();
  //   console.log(notionEvents);

  const nowDate = new Date();
  const oldDate = new Date();
  oldDate.setMonth(oldDate.getMonth() - 1);

  const calendarEvents = await getCalendarEvents(oldDate, nowDate);
  console.log(calendarEvents);
})();
