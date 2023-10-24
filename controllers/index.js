import sql from "./sql.ts";
import { eta } from "../config/eta";

import File from "../middleware/file.ts";
import Props from "../middleware/props";

export default class IndexController {
  static async renderIndex(c) {
    const props = await new Props(c).init_index();
    return eta.render("INDEX", props);
  }
  static renderError({ code, error }) {
    console.log(error);
    return eta.render("error", { code, error });
  }
  static renderAbout(c) {
    return eta.render("about", c);
  }
  static renderLogin(c) {
    return eta.render("login", c);
  }
  static renderSignUp(c) {
    return eta.render("signup", c);
  }
}
