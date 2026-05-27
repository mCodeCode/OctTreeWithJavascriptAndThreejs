//3d version of a quadTree
// --------------------------------------------------
// --------------------------------------------------
class Point {
  constructor(x, y, z, charge, type = null, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.charge = charge;
    this.type = type;
    this.size = size;
  }
}
// --------------------------------------------------
// --------------------------------------------------
class Box3D {
  //x,y,z, width, height, depth
  constructor(x, y, z, w, h, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  // ---------------------------
  // ---------------------------
  //is point inside this cube?
  contains(point) {
    let px = point.x;
    let py = point.y;
    let pz = point.z;
    let rx = this.x;
    let ry = this.y;
    let rz = this.z;
    let rw = this.w;
    let rh = this.h;
    let rd = this.d;
    return px >= rx && px < rx + rw && py >= ry && py < ry + rh && pz >= rz && pz < rz + rd;
  }
  // ---------------------------
  // ---------------------------
  // Checks if another cube overlaps with this one
  intersects(range) {}
}
// --------------------------------------------------
// --------------------------------------------------
// the quadtree works like this :
//*  it starts at the root with a boundary with size equal to the canvas (or the screen size, or the container of the simulation)
//* you insert points into the quadtree at random positions
//* when you insert points, check the current boundary capacity
//  ---> if its full , subdivide, creating 4 new boundaries inside the current one
//  ---> after creating the boundaries, check where the point is located and insert it
//       in the correct boundary (top left, top right, botton left, bottom right)
// the division is taking a rectangle and dividing that rectangle into 4 small rectangles, each one a new quadtree.
//* this process repeats, untill the point/all points are inserted into a quadtree
//* each quadTree has a list of points to keep track of, along with a variable to check if its full

/*

Pro-Tip for your Implementation
If you decide to store your children in an array (this.children[8]), you can actually calculate which index a particle belongs to using bitmasking.

If you determine:

ix = (px >= x + w) ? 1 : 0

iy = (py >= y + h) ? 2 : 0

iz = (pz >= z + d) ? 4 : 0

Then index = ix + iy + iz will give you the exact number (0–7) from the table above! It’s a very common trick to avoid a long chain of if/else statements.

*/

class OctTree {
  // ---------------------------
  // ---------------------------
  constructor(boundary) {
    this.boundary = boundary;
    this.capacity = 4;
    this.boundaryPoints = [];
    this.boundaryBranches = [];
    this.hasDivided = false;

    // Barnes-Hut properties
    this.totalCharge = 0;
    this.centerOfChargeX = 0;
    this.centerOfChargeY = 0;
    this.centerOfChargeZ = 0;
  }

  // ---------------------------
  // ---------------------------
  /*
    // Use a loop or explicit naming to create the 8 children
    // The pattern is: (x, y, z), (x+w, y, z), (x, y+h, z), etc.
    * OCTREE SUBDIVISION REFERENCE TABLE
    * -------------------------------------------------------
    * Octant                     | X Off | Y Off | Z Off
    * ---------------------------|-------|-------|-------
    * 0 (Front-Top-Left)         |   0   |   0   |   0   
    * 1 (Front-Top-Right)        |  +w   |   0   |   0   
    * 2 (Front-Bottom-Left)      |   0   |  +h   |   0   
    * 3 (Front-Bottom-Right)     |  +w   |  +h   |   0   
    * 4 (Back-Top-Left)          |   0   |   0   |  +d   
    * 5 (Back-Top-Right)         |  +w   |   0   |  +d   
    * 6 (Back-Bottom-Left)       |   0   |  +h   |  +d   
    * 7 (Back-Bottom-Right)      |  +w   |  +h   |  +d   
    * -------------------------------------------------------
    * Note: w, h, d represent half-width, half-height, and half-depth.
 */
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;

    // // LAYER 1: Front (Z)
    // this.frontTopLeft = new Octree(new Box(x, y, z, w, h, d));
    // this.frontTopRight = new Octree(new Box(x + w, y, z, w, h, d));
    // this.frontBottomLeft = new Octree(new Box(x, y + h, z, w, h, d));
    // this.frontBottomRight = new Octree(new Box(x + w, y + h, z, w, h, d));

    // // LAYER 2: Back (Z + D)
    // this.backTopLeft = new Octree(new Box(x, y, z + d, w, h, d));
    // this.backTopRight = new Octree(new Box(x + w, y, z + d, w, h, d));
    // this.backBottomLeft = new Octree(new Box(x, y + h, z + d, w, h, d));
    // this.backBottomRight = new Octree(new Box(x + w, y + h, z + d, w, h, d));

    // LAYER 1: Front (Z)
    this.boundaryBranches.push(new OctTree(new Box3D(x, y, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x, y + h, z, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y + h, z, w, h, d)));
    // LAYER 2: Back (Z + D)
    this.boundaryBranches.push(new OctTree(new Box3D(x, y, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x, y + h, z + d, w, h, d)));
    this.boundaryBranches.push(new OctTree(new Box3D(x + w, y + h, z + d, w, h, d)));

    //---
    this.hasDivided = true;
  }
  // ---------------------------
  // ---------------------------
  insert(point) {
    // //check if point position falls into current boundary before inserting
    if (!this.boundary.contains(point)) return;

    //----
    if (this.boundaryPoints.length < this.capacity) {
      this.boundaryPoints.push(point);
    } else {
      if (!this.hasDivided) {
        //subdivide the current boundary
        this.subdivide();
      }
      //insert point in subdivision, this is recursive
      for (let i = 0; i < this.boundaryBranches.length; i++) {
        this.boundaryBranches[i].insert(point);
      }
    }
  }
  // ---------------------------
  // ---------------------------
  query(range, found = []) {
    // // Step A: If the range doesn't overlap this quadrant, stop searching here!
    // if (!this.boundary.intersects(range)) {
    //   return found;
    // }
    // // Step B: Check all the points stored *locally* in this specific quadrant
    // for (let p of this.boundaryPoints) {
    //   if (range.contains(p)) {
    //     found.push(p);
    //   }
    // }
    // // Step C: If this node has sub-quadrants, recursively query them too
    // if (this.hasDivided) {
    //   this.topLeftBoundary.query(range, found);
    //   this.topRightBoundary.query(range, found);
    //   this.bottomLeftBoundary.query(range, found);
    //   this.bottomRightBoundary.query(range, found);
    // }
    // return found;
  }
  // ---------------------------
  // ---------------------------
  draw(drawHelper) {
    //---
    //--- draw current boundary
    let boundaryWireframe = drawHelper.drawBoxWireFrame(this.boundary.w, this.boundary.h, this.boundary.d, "#00ff15");
    // Shift the wireframe so the logical (x,y,z) is the corner, not the center
    boundaryWireframe.position.set(
      this.boundary.x + this.boundary.w / 2,
      this.boundary.y + this.boundary.h / 2,
      this.boundary.z + this.boundary.d / 2,
    );
    drawHelper.scene.add(boundaryWireframe);
    //----
    // draw points inside boundary
    for (let i = 0; i < this.boundaryPoints.length; i++) {
      const p = this.boundaryPoints[i];
      let oct = drawHelper.drawOctahedronWithLines(p.size, colorList.neonOrange);
      oct.mesh.position.set(p.x, p.y, p.z);
      oct.wireframe.position.set(p.x, p.y, p.z);
      drawHelper.scene.add(oct.mesh);
      drawHelper.scene.add(oct.wireframe);
    }
    //---
    // draw subdivisions
    if (this.hasDivided) {
      for (let br = 0; br < this.boundaryBranches.length; br++) {
        this.boundaryBranches[br].draw(drawHelper);
      }
    }
  }
}

//----------------------------------------------------
//----------------------------------------------------
export { OctTree, Point, Box3D };
