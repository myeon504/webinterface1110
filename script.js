const LOADER = document.getElementById('js-loader');

var cakeModel;

var MODEL_PATH = "cake_palette.glb";

var loaded = false;

function changeType(File){
  MODEL_PATH = File;
  }

function checkedSolid(){
  document.getElementById("palettecolor1").style.display="none"
  document.getElementById("palettecolor2").style.display="none"
}

function checkedPalette(){
  document.getElementById("palettecolor1").style.display="block"
  document.getElementById("palettecolor2").style.display="block"
}

const BACKGROUND_COLOR = 0xffffff;
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

var cameraFar = 5;

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.y = 55;

let MTL_1 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});
let MTL_2 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});
let MTL_3 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});
let MTL_4 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});
let MTL_5 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});
let MTL_6 = new THREE.MeshPhongMaterial({color: 0xf1f1f1});

function selectBaseColor(a){
  MTL_1.color.set(a);
}
function selectTopColor(b){
  MTL_2.color.set(b);
}
function selectSideColor(c){
  MTL_3.color.set(c);
}
function selectBottomColor(d){
  MTL_4.color.set(d);
}
function selectColor1Color(e){
  MTL_5.color.set(e);
}
function selectColor2Color(f){
  MTL_6.color.set(f);
}

let INITIAL_MAP = [
{ childID: "base", mtl: MTL_1},
{ childID: "cream_t", mtl: MTL_2},
{ childID: "cream_s", mtl: MTL_3},
{ childID: "cream_b", mtl: MTL_4},
{ childID: "color_1", mtl: MTL_5},
{ childID: "color_2", mtl: MTL_6}];

var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  cakeModel = gltf.scene;

  cakeModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  cakeModel.scale.set(0.1, 0.1, 0.1);
  cakeModel.rotation.y = Math.PI;

  cakeModel.position.y = 3.5;

  for (let object of INITIAL_MAP) {
    initColor(cakeModel, object.childID, object.mtl);
  }

  function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type;
      }
    }
  });
}


  scene.add(cakeModel);

  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 50, 0);  
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(-10, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);  
scene.add(dirLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2.5;
controls.minPolarAngle = Math.PI / 4.4;
controls.minDistance = 38;
controls.maxDistance = 48;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
