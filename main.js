import * as threeJsHelper from "./threeJsHelpers.js";
import * as OctreeHelper from "./octTree.js";
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//----------------------------------------------------
//----------------------------------------------------
// SETUP
//-----------------------------
//-----------------------------
// --------------------------------------------------
// --------------------------------------------------
//QQQ DEBUG section
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

const particleSize = 20;
let totalParticles = 70;
let particlesArr = [];

//test octree
//size of each cube dimension w,h,d
let boxW = 1500;
let boxH = 1500;
let boxD = 1500;
//---
let rootBox = new OctreeHelper.Box3D(0, 0, 0, boxW, boxH, boxD);
let oTree = new OctreeHelper.OctTree(rootBox);
//----------
//----------
// set camera pos based on box size
threeJsHelper.camera.position.set(boxW / 2, boxH / 2, boxD * 1.5);
//----------
//--- insert first particles
for (let i = 0; i < totalParticles; i++) {
  let rp = getRandomPoint(oTree.boundary);
  let p = new OctreeHelper.Point(rp.x, rp.y, rp.z, 1, "A", particleSize);
  particlesArr.push(p);
  oTree.insert(p);
}
//----
console.log("QQQ oTree ", oTree);
//draw octree to test
oTree.draw(threeJsHelper);

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
// let pA = new OctreeHelper.Point(50, 50, 50, 1, "A", particleSize);
// let pB = new OctreeHelper.Point(900, 50, 50, 1, "A", particleSize);

// let octA = threeJsHelper.drawOctahedronWithLines(pA.size, colorList.neonOrange);
// octA.mesh.position.set(pA.x, pA.y, pA.z);
// octA.wireframe.position.set(pA.x, pA.y, pA.z);
// threeJsHelper.scene.add(octA.mesh);
// threeJsHelper.scene.add(octA.wireframe);
// //----------------------------------------------------
// let octB = threeJsHelper.drawOctahedronWithLines(pB.size, colorList.neonOrange);
// octB.mesh.position.set(pB.x, pB.y, pB.z);
// octB.wireframe.position.set(pB.x, pB.y, pB.z);
// threeJsHelper.scene.add(octB.mesh);
// threeJsHelper.scene.add(octB.wireframe);

// console.log("QQQ rootBox.contains(pA); ", rootBox.contains(pA));
// console.log("QQQ rootBox.contains(pB); ", rootBox.contains(pB));

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const updateSimulation = () => {};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//  RENDER LOOP
function main() {
  function resizeRendererToDisplaySize(renderer) {
    const canvas = threeJsHelper.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      threeJsHelper.renderer.setSize(width, height, false);
    }

    return needResize;
  }

  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //  RENDER LOOP
  let intervalId = null;
  function renderLoop() {
    if (resizeRendererToDisplaySize(threeJsHelper.renderer)) {
      const canvas = threeJsHelper.renderer.domElement;
      threeJsHelper.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      threeJsHelper.camera.updateProjectionMatrix();
    }

    //QQQ
    updateSimulation();

    //render results on screen
    threeJsHelper.renderer.render(threeJsHelper.scene, threeJsHelper.camera);

    intervalId = requestAnimationFrame(renderLoop);
  }

  intervalId = requestAnimationFrame(renderLoop);
}

main();
