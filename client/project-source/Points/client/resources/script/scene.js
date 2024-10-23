// IMPORTS
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js'

// INITIALIZE VARIABLES
let renderer, scene, camera, count = 0


// RENDERER
renderer = new THREE.WebGLRenderer({canvas: document.querySelector(".scene #canvas"), antialias: true, alpha: true})   
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap    

// CAMERA
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 )
camera.position.set( 5, 0, 0 )

// SCENE
scene = new THREE.Scene()

// Lights
const light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(0, 0, 20);
const light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(0, 0, -20);
scene.add(light1, light2);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

// PARTICLES CONFIG
const particlesGeo = new THREE.BufferGeometry()
const particlesMat = new THREE.PointsMaterial({
    size: 0.01,
    color: 0x9290C3
})
const particlesCount = 1000
const posArray = new Float32Array(particlesCount * 3)

// PARTICLE POSITIONING
for(let i = 0; i < particlesCount * 3; i++){
    posArray[i] = Math.random() - 0.5
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const particles = new THREE.Points(particlesGeo, particlesMat)
scene.add(particles)

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

    // update particles position | particle animation
    const positions = particles.geometry.attributes.position.array;

    let i = 0
    for ( let ix = 0; ix < particlesCount * 3; ix ++ ) {
        for ( let iy = 0; iy < particlesCount; iy ++ ) {

            positions[ i + 1 ] = ( Math.sin( ( iy + count ) * 0.5 ) * 0.5 );

            i += 3;
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    count += 0.01;

    // controls
    controls.update()

    // render ittttt
    renderer.render(scene, camera)
}
requestAnimationFrame(animate)