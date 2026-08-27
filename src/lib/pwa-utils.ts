// PWA Utility Functions
// Handles online/offline detection, install prompts, and update notifications

export class PWAUtils {
  static isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  static setupOnlineOfflineListener(
    onlineCallback: () => void,
    offlineCallback: () => void
  ): void {
    window.addEventListener('online', () => {
      if (onlineCallback) onlineCallback();
    });
    
    window.addEventListener('offline', () => {
      if (offlineCallback) offlineCallback();
    });
  }

  static setupInstallPrompt(
    installPromptCallback: (show: boolean) => void
  ): void {
    let deferredPrompt: Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: string }> } | null = null;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e as Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: string }> };
      // Notify that install is available
      if (installPromptCallback) installPromptCallback(true);
    });
    
    // Install app button handler
    (window as any).installPWA = () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt?.();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
          ?.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
          });
      }
    };
    
    // Clean up the deferred prompt
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      if (installPromptCallback) installPromptCallback(false);
    });
  }

  static setupUpdateListener(updateCallback: (available: boolean) => void): void {
    // This would typically be handled by the service worker
    // For now, we'll provide a basic implementation
    if (updateCallback) {
      updateCallback(false); // No update by default
    }
  }
}

export default PWAUtils;