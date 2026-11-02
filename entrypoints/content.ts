import "~/assets/style.css";

export default defineContentScript({
  matches: ["*://*.example.com/*"],
  main() {},
});
