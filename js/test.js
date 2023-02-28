/**
  test.js
  Ejemplo Three.js_r140: Rectangle RGB con iluminacion y textura

  Rectangle con color por vertice y mapa de uvs usando la clase BufferGeometry.
  La textura es una unica imagen en forma de rectangle desplegado en cruz horizontal.
  Cada cara se textura segun mapa uv en la textura.
  En sentido antihorario las caras son:
    Delante:   7,0,3,4
    Derecha:   0,1,2,3
    Detras:    1,6,5,2
    Izquierda: 6,7,4,5
    Arriba:    3,2,5,4
    Abajo:     0,7,6,1
  Donde se han numerado de 0..7 los vertices del rectangle.
  Los atributos deben darse por vertice asi que necesitamos 8x3=24 vertices pues
  cada vertice tiene 3 atributos de normal, color y uv al ser compartido por 3 caras. 

  @author rvivo@upv.es (c) Libre para fines docentes
*/

var renderer, scene, camera, rectangle;
var cameraControls;
var angulo = -0.01;

init();
loadBackground();
loadRectangle(1.0, 1.5, 1);
loadRectangle(1.0, 1.5, -0.5);
render();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  document.getElementById('container').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);

  window.addEventListener('resize', updateAspectRatio);
}

function loadBackground() {
  var VBack = [
    -24.0, 0.0, 0.0,
    24.0, 0.0, 0.0,
    -24.0, 48.0, 0.0,
    24.0, 48.0, 0.0,
  ];
  scene.add(rectangle);
}

function loadRectangle(ladoA, ladoB, offsetA) {
  // Instancia el objeto BufferGeometry
  var malla = new THREE.BufferGeometry();
  // Construye la lista de coordenadas y colores por vertice
  var semiladoA = ladoA / 2.0;
  var semiladoB = ladoB / 2.0;
  var coordenadas = [ // 6caras x 4vert x3coor = 72float
    // Front 
    -semiladoA + offsetA, -semiladoB, 0.01, // 7 -> 0
    semiladoA + offsetA, -semiladoB, 0.01,  // 0 -> 1
    semiladoA + offsetA, semiladoB, 0.01,  // 3 -> 2
    -semiladoA + offsetA, semiladoB, 0.01, // 4 -> 3
  ]
  var colores = [ // 24 x3
    0, 0, 0,   // 7
    1, 0, 0,   // 0
    1, 1, 0,   // 3
    0, 1, 0,   // 4
  ]
  var normales = [ // 24 x3
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,      // Front
  ];
  var uvs = [  // 24 x2
    // Front
    0 / 4, 1 / 3, 1 / 4, 1 / 3, 1 / 4, 2 / 3, 0 / 4, 2 / 3, // 7,0,3,4
  ];
  var indices = [ // 6caras x 2triangulos x3vertices = 36
    0, 1, 2, 2, 3, 0,    // Front
  ];

  scene.add(new THREE.DirectionalLight());

  // Geometria por att arrays en r140
  malla.setIndex(indices);
  malla.setAttribute('position', new THREE.Float32BufferAttribute(coordenadas, 3));
  malla.setAttribute('normal', new THREE.Float32BufferAttribute(normales, 3));
  malla.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
  malla.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  // Configura un material
  var textura = new THREE.TextureLoader().load('images/ilovecg.png');
  var material = new THREE.MeshLambertMaterial({ vertexColors: true, map: textura, side: THREE.DoubleSide });

  // Construye el objeto grafico 
  console.log(malla);   //-> Puedes consultar la estructura del objeto
  rectangle = new THREE.Mesh(malla, material);

  // Añade el objeto grafico a la escena
  scene.add(rectangle);
}

function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update() {
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();

  // Movimiento propio del rectangle
  rectangle.rotation.y += angulo;
  rectangle.rotation.x += angulo / 2;
}

function render() {
  //requestAnimationFrame(render);
  //update();
  renderer.render(scene, camera);
}