const publicVapidKey = "BH-VuN3WI94FPhQZKgG0gsPoPZV0eBNO8vTHtPagO8a4uYRGBZCa9eyiY_YqHFycHH9LGTNYqzWpT_jeZpGb6c8";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


async function subscribe() {
  if (!"serviceWorker" in navigator) return;
  
  const register = await navigator.serviceWorker.register("/sworker.js", {
      scope: "/"
  });

  await navigator.serviceWorker.ready;

  const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json"
    }
  });
}