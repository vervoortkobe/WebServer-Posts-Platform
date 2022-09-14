self.addEventListener("push", e => {
    const data = e.data.json();
    self.registration.showNotification(
        data.title,
        {
          //body: data.title,
          image:"https://web.vervoortkobe.ga/icons/logo.png",
          icon: "https://web.vervoortkobe.ga/icons/favicon.png"
        }
    );
});