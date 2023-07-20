export default class CooldownController {
  static isOnCooldown = false;
  static cooldownTime = 5000;

  static applyCooldown() {
    CooldownController.isOnCooldown = true;

    setTimeout(() => {
      CooldownController.isOnCooldown = false;
    }, CooldownController.cooldownTime);
  }
}
