import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";

import File from "../middleware/file.ts";
import Props from "../middleware/props.js";
import { eta } from "../config/eta";
import sql from "./sql.ts";

export default class ElementController {
  static async index(c) {
    const { params, cookie, query } = c;

    const props = new Props(c);
    props.page_type = "element";

    if (query.mode) props.view_mode = query.mode;

    props.element = sql("elements")
      .select(["element_id", "text", "author_id"])
      .where({ element_id: params.element_id })
      .get();

    if (cookie.auth && props.element.author_id === cookie.auth.user_id) {
      props.user_type = "owner";
    }

    props.element.src = File.get_src("elements", params.element_id);

    if (props.element.text) {
      props.element.html = marked.parse(props.element.text);
    }

    return eta.render("ELEMENT", props);
  }

  static create(c) {
    const { set, params, cookie } = c;

    const element_id = uuidv4();

    sql("elements")
      .insert({
        element_id,
        date_creation: Date.now(),
        date_lastModify: Date.now(),
        author_id: cookie.auth.user_id,
      })
      .run();

    sql("connections")
      .update({ page_id: params.page_id })
      .where({ element_id })
      .run();

    set.redirect = `/element/${element_id}`;
  }

  static async update(c) {
    const { set, params, body } = c;
    const { text, cover, script, style } = body;

    if (!!cover.size)
      await File.removeImage("elements", params.element_id, "cover");

    await File.write("elements", cover, "cover", params.element_id);
    await File.write("elements", script, "script", params.element_id);
    await File.write("elements", style, "style", params.element_id);

    sql("elements")
      .update({ text, date_lastModify: Date.now() })
      .where({ element_id: params.element_id })
      .run();

    const referer = c.request.headers.get("referer");
    set.redirect = referer;
    // set.redirect = `/element/${params.element_id}`;
  }

  static async delete(c) {
    const { set, params, cookie } = c;
    await File.removeDir("elements", params.element_id);
    // TODO Удаляется ли connection?
    sql("elements").delete().where({ element_id: params.element_id }).run();
    set.redirect = `/${cookie.username}`;
  }

  static async removeFile(c) {
    const { set, params } = c;
    await File.removeFile("elements", params.element_id, params.file);
    set.redirect = `/element/${params.element_id}`;
  }
}
