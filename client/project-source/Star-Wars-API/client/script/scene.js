// IMPORTS
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/GLTFLoader.js'

// INITIALIZE VARIABLES
let directionalLight, renderer, scene, camera

// RENDERER
renderer = new THREE.WebGLRenderer({canvas: document.querySelector(".scene #canvas"), antialias: true, alpha: true})   
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap    

// CAMERA
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 )
camera.position.set( -130, 0, 50 )

// SCENE
scene = new THREE.Scene()

// LOADING MANAGER
const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );

} );

// LIGHT
// directional light is for model
directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(0, 170, -30);
scene.add(directionalLight);
// spotlight is for planet
let spotLight = new THREE.SpotLight(0x000000, 1, 0, 10, 2);
scene.add(spotLight)

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = false;

// STARS
function addStar() {
    // create geometry & material
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material); // add to scene

    // set location array | space far away | from a tutorial I watched a while ago, I would instance a single mesh for better timing but spacing is difficult and will randomly ruin scene
    // by weird placement of stars... not there in skill yet with matrix updating for 3js | https://www.youtube.com/watch?v=Q7AOvWpIVHU 
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));

    // set star position & add to scene
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// DEATH STAR MODEL | source: https://sketchfab.com/3d-models/death-star-star-wars-3d5f01485e9e4e8b9d995d7764341afe
const modelLoader = new GLTFLoader(loadingManager) // hide body until loaded
modelLoader.load('client/script/models/death-star/scene.gltf', (gltfScene) => {
    // adjust scale, rotation + add to scene
    gltfScene.scene.scale.set( 0.5, 0.5, 0.5 )
    gltfScene.scene.rotation.y = 5.75
    scene.add(gltfScene.scene)
});

// PLANET
// here we assign textures
const planetTexture = new THREE.TextureLoader().load('client/script/models/death-star/4k_makemake_fictional.jpg')
const normalTexture = new THREE.TextureLoader().load('client/script/models/death-star/4k_makemake_fictional.jpg')
// create geometry and material
const planetGeometry = new THREE.SphereGeometry(1000, 100, 100)
const planetMaterial = new THREE.MeshPhongMaterial({
    // set maps & bumpscale
    map: planetTexture,
    bumpMap: normalTexture,
    bumpScale:   7.5, // *oof he sharp
    color: 0x5f1100 // looks better than a red spotlight
})
// create & modify & add planet to scene
const planet = new THREE.Mesh(planetGeometry, planetMaterial)
planet.position.set( 1600, 170, 50 )
planet.receiveShadow = true
scene.add(planet)


// REZISE
function resizeCanvasToDisplaySize() {

    // get canvas, hieght/width
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // if new width != old width or same w/ height
    if (canvas.width !== width ||canvas.height !== height) {

        // reset render size
        renderer.setSize(width, height, false)
        // reset camera
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }
}

// ANIMATION
function animate() {

    // animate frame
    requestAnimationFrame(animate)
    // resize check
    resizeCanvasToDisplaySize()
    // planet spin
    planet.rotation.y += 0.0005
    // controls
    controls.update()
    // render ittttt
    renderer.render(scene, camera)
}
requestAnimationFrame(animate)