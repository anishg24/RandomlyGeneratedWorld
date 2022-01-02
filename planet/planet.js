class Planet {
    constructor(resolution, radius, shapeGenerator) {
        this.resolution = resolution;
        this.radius = radius;
        this.shapeGenerator = shapeGenerator;
        this.geometry = new THREE.BufferGeometry();
        this.terrainFaces = new Array(6);

        const directions = [
            new THREE.Vector3(0, 1, 0),     // Up
            new THREE.Vector3(0, -1, 0),    // Down
            new THREE.Vector3(-1, 0, 0),    // Left
            new THREE.Vector3(1, 0, 0),     // Right
            new THREE.Vector3(0, 0, 1),     // Forward
            new THREE.Vector3(0, 0, -1)     // Backward
        ]

        for (let i = 0; i < this.terrainFaces.length; i++) {
            this.terrainFaces[i] = new TerrainFace(this.resolution, directions[i], this.shapeGenerator);
        }
    }

    generateMesh() {
        let meshes = [];
        let uvs = [];

        for (let i = 0; i < this.terrainFaces.length; i++) {
            let mesh = this.terrainFaces[i].constructMesh()
            for (let j = 0; j < mesh[0].length; j++) {
                meshes.push(mesh[0][j]);
            }

            for (let j = 0; j < mesh[1].length; j++) {
                uvs.push(mesh[1][j])
            }
        }

        const planetGeometry = new Float32Array(meshes.flat())
        const planetUVs = new Float32Array(uvs.flat())
        this.geometry.setAttribute('position', new THREE.BufferAttribute(planetGeometry, 3));
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(planetUVs, 2));
        this.geometry.computeVertexNormals()
    }

}