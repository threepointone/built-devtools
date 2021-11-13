function sleep(period) {
  return new Promise((resolve) => setTimeout(resolve, period));
}

async function loop() {
  let value = -1;
  while (true) {
    const ctr = (await fetch(`http://localhost:3142`)).json().value;
    if (value !== -1) {
      if (ctr !== value) {
        location.reload();
      } else {
        await sleep(1000);
      }
    } else {
      value = ctr;
      await sleep(1000);
    }
  }
}
