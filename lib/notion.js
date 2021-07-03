const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const database_id = process.env.NOTION_DATABASE_ID;
const name_id = process.env.NOTION_NAME_ID;
const description_id = process.env.NOTION_DESCRIPTION_ID;
const date_id = process.env.NOTION_DATE_ID;

module.exports.getEvents = async function getEvents() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: "POST"
  };

  const { results } = await notion.request(payload);

  const events = results.map((event) => {
    return {
      id: event.id,
      title: event.properties.Name.title[0].text.content,
      date: event.properties.Date?.date.start
    };
  });

  return events;
};

module.exports.getDatabase = async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id
  });
  console.log(response);
};

module.exports.createEvent = async function createEvent({
  title,
  description,
  start,
  end
}) {
  const notionPage = {
    parent: {
      database_id
    },
    properties: {
      //event name
      [name_id]: {
        title: [
          {
            type: "text",
            text: {
              content: title
            }
          }
        ]
      },
      //event desription
      [description_id]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: description
            }
          }
        ]
      },
      //event start and end datetime
      [date_id]: {
        date: {
          start
          // how do i make it so that the end property is only included if it's included on the google event?
        }
      }
    }
  };

  end ? (notionPage.properties[date_id].date.end = end) : null;

  console.log(notionPage.properties[date_id].date);
  //create a Notion event
  //   notion.pages.create(notionPage);
};
