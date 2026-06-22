import { chromium } from 'playwright';

(async () => {
  console.log("Launching browser for 3D inspection...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5201/portfolio');
  await page.waitForTimeout(3000);

  const debugInfo = await page.evaluate(() => {
    const debug = window.debugData;
    if (!debug) return "No debugData found on window";

    const camera = debug.getCamera();
    const folderGroup = debug.getFolderGroup();
    if (!camera) return "No camera found";
    if (!folderGroup) return "No folderGroup found";

    const scene = folderGroup.parent;
    if (!scene) return "No scene found";

    const info = {
      camera: {
        position: [camera.position.x, camera.position.y, camera.position.z],
      },
      objects: []
    };

    const getAbsolutePos = (obj) => {
      let x = obj.position.x;
      let y = obj.position.y;
      let z = obj.position.z;
      let p = obj.parent;
      while (p && p.type !== 'Scene') {
        x += p.position.x;
        y += p.position.y;
        z += p.position.z;
        p = p.parent;
      }
      return [x, y, z];
    };

    scene.traverse((obj) => {
      if (obj.type === 'Mesh') {
        const name = obj.geometry ? obj.geometry.type : 'mesh';
        const absPos = getAbsolutePos(obj);

        if (absPos[2] < -4) {
          info.objects.push({
            type: obj.type,
            name: obj.name || name,
            position: absPos,
            visible: obj.visible,
            color: obj.material && obj.material.color ? obj.material.color.getHexString() : null
          });
        }
      }
    });

    return info;
  });

  console.log("3D Debug Info:", JSON.stringify(debugInfo, null, 2));
  await browser.close();
})();
