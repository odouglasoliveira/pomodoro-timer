export default class NotificationService {
  constructor() {
    this.permission = "default";
  }

  async setup() {
    try {
      if (!("Notification" in window)) {
        console.log("Este navegador não suporta notificações");
        return false;
      }

      this.permission = await Notification.requestPermission();
      return this.permission === "granted";
    } catch (error) {
      console.error("Erro ao configurar notificações:", error);
      return false;
    }
  }

  send(title, body, icon = "/timer-svgrepo-com.svg") {
    if (this.permission !== "granted") return;

    const notification = new Notification(title, {
      body,
      icon,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
    };
  }
}
