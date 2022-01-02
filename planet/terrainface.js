class TerrainFace {
    constructor(resolution, localUp, shapeGenerator) {
        this.resolution = resolution;
        this.localUp = localUp;
        this.shapeGenerator = shapeGenerator;

        this.axisA = new THREE.Vector3(localUp.getComponent(1), localUp.getComponent(2), localUp.getComponent(0));
        this.axisB = new THREE.Vector3();
        this.axisB.crossVectors(this.localUp, this.axisA);

        // console.log("this.localUp: " + this.localUp.toArray());
        // console.log("this.axisA: " + this.axisA.toArray());
        // console.log("this.axisB: " + this.axisB.toArray());
    }

    constructMesh() {
        let vertices = new Array(this.resolution ** 2);              // float32[]
        let uvs = new Array(this.resolution ** 2);                   // float32[]
        let triangles = new Array((this.resolution - 1) ** 2 * 6);   // int[]
        let verticesResult = new Float32Array(triangles.length * 3);     // float32[]
        let uvsResult = new Float32Array(triangles.length * 2)           // float32[]

        let triIndex = 0;

        for (let y = 0; y < this.resolution; y++) {
            for (let x = 0; x < this.resolution; x++) {

                let i = x + y * this.resolution;

                let percent = new THREE.Vector2(x, y).divideScalar(this.resolution - 1);
                let pointOnUnitCube = this.localUp.clone()
                    .add(this.axisA.clone()
                        .multiplyScalar(2 * (percent.getComponent(0) - .5)))
                    .add(this.axisB.clone()
                        .multiplyScalar(2 * (percent.getComponent(1) - .5)));
                let pointOnUnitSphere = pointOnUnitCube.clone().normalize();

                let unscaledElevation = this.shapeGenerator.getUnscaledElevation(pointOnUnitSphere);
                uvs[i] = unscaledElevation;
                vertices[i] = pointOnUnitSphere.multiplyScalar(this.shapeGenerator.getScaledElevation(unscaledElevation));


                if (x !== this.resolution - 1 && y !== this.resolution - 1) {
                    triangles[triIndex] = i;
                    triangles[triIndex + 1] = i + this.resolution + 1;
                    triangles[triIndex + 2] = i + this.resolution;

                    triangles[triIndex + 3] = i;
                    triangles[triIndex + 4] = i + 1;
                    triangles[triIndex + 5] = i + this.resolution + 1;

                    triIndex += 6;
                }

            }
        }

        for (let i = 0; i < verticesResult.length; i += 3) {
            const index = i / 3;
            const triangle = triangles[index];
            const vector = vertices[triangle];
            verticesResult[i] = vector.getComponent(0);
            verticesResult[i + 1] = vector.getComponent(1);
            verticesResult[i + 2] = vector.getComponent(2);

        }

        for (let i = 0; i < uvsResult.length; i += 2) {
            const index = i / 2;
            const triangle = triangles[index]

            uvsResult[i] = 0;
            uvsResult[i + 1] = uvs[triangle];
        }

        // console.log(uvs)
        // console.log(uvsResult)

        return [verticesResult, uvsResult];

        // console.log(vertices)
        // this.geometry.clear()
        // this.geometry.vertices = vertices
        // this.geometry.triangles = triangles
        // this.geometry.computeVertexNormals();
    }
}