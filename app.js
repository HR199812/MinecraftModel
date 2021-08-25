import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

// Delta Time variable to update animations smoothly
const clock = new THREE.Clock();

// Variables for scene, camera, lights models, controls, character, characterAnimationClips
let camera, scene, renderer, skeleton, orbitControls, cameraTRBL = 100, cameraMapSize = 2048, cameraNear = 0.5,
    character, characterRotation, rotationCheck, actions = [], mixer, prevAction, hemiLight, dirlight, ambientLight;

const resourcePath = './ModelResources/';
initScene();
initRenderer();
await loadModels();
animate();

// Function to load character and it's related animations
async function loadModels() {

    //Create Grass Block
    let groundMaterialArray = [];
    let groundMudMaterialArray = [];
    let treeTrunkMaterialArray = [];
    let treeLeavesMaterialArray = [];

    // Ground Textures
    let groundTexture_ft = new THREE.TextureLoader().load('/ModelResources/Ground/MudWithGrass.jpg');
    let groundTexture_bk = new THREE.TextureLoader().load('/ModelResources/Ground/MudWithGrass.jpg');
    let groundTexture_up = new THREE.TextureLoader().load('/ModelResources/Ground/GrassOverMud.jpg');
    let groundTexture_dn = new THREE.TextureLoader().load('/ModelResources/Ground/mud.jpg');
    let groundTexture_rt = new THREE.TextureLoader().load('/ModelResources/Ground/MudWithGrass.jpg');
    let groundTexture_lf = new THREE.TextureLoader().load('/ModelResources/Ground/MudWithGrass.jpg');

    // Tree Texture
    let treeTextureAllFaces = new THREE.TextureLoader().load('/ModelResources/Ground/Tree.png');
    let treeLeavesTextureAllFaces = new THREE.TextureLoader().load('/ModelResources/Ground/treeleaves.png');

    // Ground With Grass
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_ft }));
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_bk }));
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_up }));
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_rt }));
    groundMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_lf }));
    
    // Ground only with dirt
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));
    groundMudMaterialArray.push(new THREE.MeshBasicMaterial({ map: groundTexture_dn }));

    // Oak Tree Trunk
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    treeTrunkMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeTextureAllFaces }));
    
    // Oak Tree Leaves
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));
    treeLeavesMaterialArray.push(new THREE.MeshBasicMaterial({ map: treeLeavesTextureAllFaces }));


    //   let ambientlight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    //   scene.add(ambientlight);

    console.log(groundMaterialArray);
    for (let i = 0; i < 6; i++) {
        groundMaterialArray[i].side = THREE.FrontSide;
        groundMudMaterialArray[i].side = THREE.FrontSide;
        treeTrunkMaterialArray[i].side = THREE.FrontSide;
        treeLeavesMaterialArray[i].side = THREE.FrontSide;
    }



    let groundBoxGeo = new THREE.BoxGeometry(100, 100, 100);
    let groundMudBoxGeo = new THREE.BoxGeometry(100, 100, 100);
    let treeTrunkBoxGeo = new THREE.BoxGeometry(100, 100, 100);
    let treeLeavesBoxGeo = new THREE.BoxGeometry(100, 100, 100);


    let posxaxis = 0;
    let negxaxis = 0;
    let poszaxis = 0;
    let negzaxis = 0;
    let posyaxis = 150;
    for (let i = 0; i < 400; i++) {
        if (i > 0 && i < 6) {
            // Grass
            let treeTrunkBox = new THREE.Mesh(treeTrunkBoxGeo, treeTrunkMaterialArray);
            treeTrunkBox.position.y = posyaxis;
            scene.add(treeTrunkBox);
            posyaxis += 100;
        }
        if (i > 0 && i < 100) {

            // Grass
            let groundBox = new THREE.Mesh(groundBoxGeo, groundMaterialArray);
            groundBox.position.y = 50;
            groundBox.position.x = posxaxis;
            scene.add(groundBox);
            posxaxis += 100;
        }
        else if (i > 100 && i < 200) {
            let groundBox = new THREE.Mesh(groundBoxGeo, groundMaterialArray);
            groundBox.position.y = 50;
            groundBox.position.x = negxaxis;
            scene.add(groundBox);
            negxaxis -= 100;
        }
        else if (i > 200 && i < 300) {
            let groundBox = new THREE.Mesh(groundBoxGeo, groundMaterialArray);
            groundBox.position.y = 50;
            groundBox.position.z = poszaxis;
            scene.add(groundBox);
            poszaxis += 100;
        }
        else if (i > 300 && i < 400) {
            let groundBox = new THREE.Mesh(groundBoxGeo, groundMaterialArray);
            groundBox.position.y = 50;
            groundBox.position.z = negzaxis;
            scene.add(groundBox);
            negzaxis -= 100;
        }
    }

    posxaxis = 0;
    negxaxis = 0;
    poszaxis = 0;
    negzaxis = 0;

    for (let i = 0; i < 400; i++) {
        if (i > 0 && i < 100) {
            // Mud
            let groundMudBox = new THREE.Mesh(groundMudBoxGeo, groundMudMaterialArray);
            groundMudBox.position.y = -50;
            groundMudBox.position.x = posxaxis;
            scene.add(groundMudBox);
            posxaxis += 100;
        }
        else if (i > 100 && i < 200) {
            let groundMudBox = new THREE.Mesh(groundMudBoxGeo, groundMudMaterialArray);
            groundMudBox.position.y = -50;
            groundMudBox.position.x = negxaxis;
            scene.add(groundMudBox);
            negxaxis -= 100;
        }
        else if (i > 200 && i < 300) {
            let groundMudBox = new THREE.Mesh(groundMudBoxGeo, groundMudMaterialArray);
            groundMudBox.position.y = -50;
            groundMudBox.position.z = poszaxis;
            scene.add(groundMudBox);
            poszaxis += 100;
        }
        else if (i > 300 && i < 400) {
            let groundMudBox = new THREE.Mesh(groundMudBoxGeo, groundMudMaterialArray);
            groundMudBox.position.y = -50;
            groundMudBox.position.z = negzaxis;
            scene.add(groundMudBox);
            negzaxis -= 100;
        }
    }

    // character = new THREE.ObjectLoader();

    // character.setPath(resourcePath);
    // character.load('minecraft-steve.json', (fbx) => {

    //     characterRotation = fbx;

    //     // mixer = new THREE.AnimationMixer(fbx);

    //     fbx.traverse(c => {
    //         c.castShadow = true;
    //         c.receiveShadow = false;
    //     });

    //     skeleton = new THREE.SkeletonHelper(fbx);
    //     skeleton.visible = true;
    //     scene.add(skeleton);

    //     scene.add(fbx);

    // });
}

// Function to render the 3d World
function initRenderer() {

    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.enableZoom = true;
    orbitControls.zoomSpeed = 1.15;
    orbitControls.screenSpacePanning = false;
    orbitControls.minDistance = 0;
    orbitControls.maxDistance = 45000;
    // orbitControls.minPolarAngle = -Math.PI / 1.5;
    // orbitControls.maxPolarAngle = Math.PI / 2.5;
    orbitControls.update();
}

// Function to initialise 3d World
function initScene() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);
    // scene.fog = new THREE.FogExp2(0xbfd1e5, 0.0015);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-180, 250, -150);

    dirlight = new THREE.DirectionalLight(0xd3d3d3, 1);
    dirlight.position.set(100, 100, 10);
    dirlight.target.position.set(0, 0, 0);
    dirlight.castShadow = true;
    dirlight.shadow.mapSize.width = cameraMapSize;
    dirlight.shadow.mapSize.height = cameraMapSize;
    // dirlight.shadow.camera.near = 0.1;
    // dirlight.shadow.camera.far = 500.0;
    dirlight.shadow.camera.near = cameraNear;
    dirlight.shadow.camera.far = cameraNear * 1000;
    dirlight.shadow.camera.left = cameraTRBL;
    dirlight.shadow.camera.right = -cameraTRBL;
    dirlight.shadow.camera.top = cameraTRBL;
    dirlight.shadow.camera.bottom = -cameraTRBL;

    scene.add(dirlight);

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambientLight);

    hemiLight = new THREE.HemisphereLight(0xbfd1e5, 0xFFFFFF, 1);
    hemiLight.color.setHSL(0.8, 0.8, 0.8);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(100, 100, 10);
    scene.add(hemiLight);


    // Ground
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(15000, 15000),
        new THREE.MeshPhongMaterial({ color: 0xFFFFFF, wireframe: false, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    scene.add(mesh);

    const gridHelper = new THREE.GridHelper(15000, 100, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    window.addEventListener('resize', onWindowResize);
}

function animate() {

    // mixer.forEach((mixer) => {

    //     mixer.update(clock.getDelta());
    // });

    if (mixer) mixer.update(clock.getDelta());

    requestAnimationFrame(animate);

    orbitControls.update();
    renderer.render(scene, camera);
}

// Called when window is resized and update the view with window size
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}