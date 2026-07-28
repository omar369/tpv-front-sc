import { registerSW } from "virtual:pwa-register"

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl: string) {
    console.log('SW regstrada!', swScriptUrl)
  },
  onOfflineReady() {
    console.log("PWA app lista para trabajar offline")
  },
})
