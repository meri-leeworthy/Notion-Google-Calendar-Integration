const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;
const name_id = process.env.NOTION_NAME_ID;
const description_id = process.env.NOTION_DESCRIPTION_ID;
const date_id = process.env.NOTION_DATE_ID;
const id_id = process.env.NOTION_ID_ID;

const formatPage = ({ title, id, description, status, start, end }) => {
  const formattedPage = {
    archived: status == "cancelled" ? true : false,
    properties: {
      //event name
      [name_id]: {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      //event id
      [id_id]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: id,
            },
          },
        ],
      },
      //event desription
      [description_id]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: description,
            },
          },
        ],
      },
      //event start and end datetime
      [date_id]: {
        date: {
          start,
        },
      },
    },
  };
  end ? (formattedPage.properties[date_id].date.end = end) : null;
  return formattedPage;
};

module.exports.getEventDictionary = async function getEventDictionary() {
  let page = await notion.databases.query({
    database_id,
    page_size: 100,
  });

  // console.log(`hasMore: ${page.has_more}`);
  // console.log(`next_cursor: ${page.next_cursor}`);

  let results = page.results;
  // console.log(`first page length: ${results.length}`);

  while (page.has_more === true) {
    page = await notion.databases.query({
      database_id,
      page_size: 100,
      start_cursor: page.next_cursor,
    });
    // console.log(`next page length: ${page.results.length}`);
    results = results.concat(page.results);
  }

  //function that gets the Google Calendar ID for a given event
  const gCalId = (event) => {
    // console.log(`Event?? ${!!event}`);
    return event.properties.ID?.rich_text[0]?.text.content;
  };

  //create a dictionary that maps Google Calendar IDs to Notion page IDs
  const gCalLookup = {};
  results.forEach((event) => {
    // console.log(`is this event archived?? ${event.archived}`);
    gCalId(event) ? (gCalLookup[gCalId(event)] = event.id) : null;
  });

  console.log(`length: ${Object.keys(gCalLookup).length}`);

  return gCalLookup;
};

//call this to get a list of databases
module.exports.getDatabase = async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id,
  });
  console.log(response);
};

module.exports.createEvent = async function createEvent(event) {
  if (event.status === "cancelled") return;
  const newEvent = formatPage(event);
  newEvent.parent = {};
  newEvent.parent.database_id = database_id;
  notion.pages.create(newEvent);
};

module.exports.updateEvent = async function updateEvent(event, id) {
  const updatedEvent = formatPage(event);
  updatedEvent.page_id = id;
  const response = await notion.request({
    path: "pages/" + id,
    method: "patch",
    body: updatedEvent,
  });
  // console.log(response);
};
