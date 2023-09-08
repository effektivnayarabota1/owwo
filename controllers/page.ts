// TODO вынести настройку edgedb в отдельный файл. в конфиге.
import { e, client } from "../config/edgedb.ts";
import { eta } from "../config/eta.ts";

export default class page {
  static async create({ request, response, params }) {
    const username = params.username;
    const result = await e
      .insert(e.Page, {
        authors: e.select(e.User, (user) => ({
          filter: e.op(user.username, "=", username),
        })),
      })
      .run(client);
    await response.redirect(`/${username}`);
  }

  static async index({ request, response, params }) {
    response.body = eta.render("./page", {
      request,
      params,
    });
  }

  static async state({ request, response, params }) {
    const pageId = params.pageId;

    const body = await request.body().value;
    const state = await body.get("button_page-state");
    const editor = request.headers.get("referer").split("/").at(-1);

    await e
      .update(e.Page, (page) => ({
        filter_single: { id: pageId },
        set: {
          state: state,
        },
      }))
      .run(client);

    await response.redirect(`/${editor}`);
  }

  static async meta({ request, response, params }) {
    const pageId = params.pageId;

    const formDataReader = await request.body({ type: "form-data" }).value;
    const formDataBody = await formDataReader.read({ maxSize: 10000000 }); // Max file size to handle

    const file = formDataBody.files[0];
    console.log(file);
    const directory = "./data/";
    console.log(file.originalName);
    console.log(file.content);
    await Deno.writeFile(`${directory}${file.originalName}`, file.content);

    // const page = formDataBody.fields;
    // console.log(page);

    await response.redirect(`/page/${pageId}`);
  }
}
