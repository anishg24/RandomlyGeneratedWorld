// noise.seed();
// const gui = new dat.GUI({name: 'My GUI'});
// const noiseSettings = {
//     enabled: true,
//     baseRoughness: 0.3,
//     roughness: 3,
//     persistence: 0.5,
//     strength: 1,
//     minValue: 0.85,
//     numLayers: 5,
//     center: new THREE.Vector3(),
//     usflam: true
// }
//
// gui.add(noiseSettings, 'enabled')
// gui.add(noiseSettings, 'baseRoughness')


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const simpleNoise = new SimpleNoiseFilter(
    true,
    0.71,
    1.83,
    0.5,
    0.12,
    0,
    5,
    new THREE.Vector3(),
    false,
)

const simpleNoise2 = new SimpleNoiseFilter(
    true,
    0.3,
    2,
    3,
    0.5,
    0,
    5,
    new THREE.Vector3(),
    true,
)
const minMax = new MinMax()
const shapeGenerator = new ShapeGenerator([simpleNoise, simpleNoise2], minMax, 1);

const planet = new Planet(50, 1, shapeGenerator);
planet.generateMesh()
const geometry = planet.geometry;

console.log(planet.geometry.getAttribute("uv"))

// const texture = new THREE.TextureLoader().load( '/planet/textures/lava-and-rock_albedo.png' );
// const aoTexture = new THREE.TextureLoader().load('../lunar-rock2-ue/lunar_rock2_ao.png');

function generateTexture() {

    const size = 512;

    // create canvas
    let canvas = document.createElement( 'canvas' );
    canvas.width = size;
    canvas.height = size;

    // get context
    const context = canvas.getContext( '2d' );

    // draw gradient
    context.rect( 0, 0, size, size );
    const gradient = context.createLinearGradient( 0, 0, 0, size );
    gradient.addColorStop(0.6, '#ffffff');
    gradient.addColorStop(0.9, "#382922");
    gradient.addColorStop(0.91, "#1f861f");
    gradient.addColorStop(0.92, "#bdb606");
    gradient.addColorStop(0.93, "#99ddff");
    gradient.addColorStop(1, '#0000ff');
    context.fillStyle = gradient;
    context.fill();

    return canvas;
}

let texture = new THREE.CanvasTexture( generateTexture(), THREE.UVMapping, THREE.RepeatWrapping );

// const vShader = `
//     varying vec2 vUv;
//     void main() {
//         gl_Position = vec4(vUv, 1.);
//     }
// `
//
// const fShader = `
//     void main() {
//         gl_FragColor = vec4(1., 0., 1., 1.);
//     }
// `

// const material = new THREE.ShaderMaterial({
//     uniforms: {u_time: { type: "f", value: 1.0 }},
//     // vertexShader: vShader,
//     fragmentShader: fShader,
// })


const material = new THREE.MeshToonMaterial({map: texture});
// material.wireframe = true;
const mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

const wireframe = new THREE.WireframeGeometry(geometry);
const line = new THREE.LineSegments(wireframe);
line.material.opacity = 0.25;
line.material.transparent = true;
// scene.add(line);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
scene.add(directionalLight);

camera.position.z = 3;

const animate = () => {
    requestAnimationFrame(animate);
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
    // Observe a scene or a renderer
}
console.log(scene.toJSON())
animate();