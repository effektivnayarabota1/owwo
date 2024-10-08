import { StaticController } from "@site/controllers";
import { ViewController } from "@site/controllers";

class PageRouterService {
  static getFavicon() {
    return console.log("TODO create favicon");
  }

  static getPublic({ param }: { param: string }) {
    return StaticController.sendFile({ param });
  }

  static getHomePage() {
    return ViewController.renderHomePage();
  }

  static getAboutPage() {
    return ViewController.renderAboutPage();
  }

  static getLoginPage() {
    return ViewController.renderLoginPage();
  }

  static getSignupPage() {
    return ViewController.renderSignupPage();
  }

  static getNodePage(nodeId: string) {
    return ViewController.renderNodePage(nodeId);
  }

  static getErrorPage() {
    return ViewController.renderErrorPage();
  }
}

export { PageRouterService };
