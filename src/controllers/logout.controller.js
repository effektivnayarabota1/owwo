import { EtaModel } from "../models/Eta.model";

export class LogoutController {
  static async index(c) {
    // const params = await Context.getParams(c)
    const html = await EtaModel.getHtml("Logout", {});
    return c.html(html);
  }
}
