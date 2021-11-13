function sleep(period) {
  return new Promise((resolve) => setTimeout(resolve, period));
}

async function loop() {
  let value = -1;
  while (true) {
    const ctr = await (await fetch(`http://localhost:3142`)).json();
    if (value !== -1) {
      if (ctr.value !== value) {
        location.reload();
        break;
      } else {
        await sleep(1000);
      }
    } else {
      value = ctr.value;
      await sleep(1000);
    }
  }
}

loop();
