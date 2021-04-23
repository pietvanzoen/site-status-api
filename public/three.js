import * as THREE from "https://unpkg.com/three@0.119.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

export function renderStatusHeader(container, { text, color, speed = 1 } = {}) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  var box = container.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(
    75,
    box.width / box.height,
    0.1,
    1000,
  );
  renderer.setSize(box.width, box.height);

  container.replaceChildren(renderer.domElement);

  camera.position.z = 2;

  scene.add(new THREE.AmbientLight(0x404040));
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 128;
  canvas.height = 64;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "gray";
  ctx.fill();
  ctx.font = "bold 12pt Impact";
  ctx.textAlign = "center";

  ctx.fillStyle = color; // <-- Text colour here
  ctx.fillText(text, centerX, centerY);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshLambertMaterial({ map: texture }); // greenish blue
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  function render(time) {
    time *= 0.0001 * speed; // convert time to seconds

    sphere.rotation.x = time;
    sphere.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
