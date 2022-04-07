import * as $3 from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './style.css'

const SIZE = 400
const HSIZE = SIZE / 4

const scene = new $3.Scene()
scene.background = new $3.Color(0xffffff)

const camera = new $3.OrthographicCamera(-SIZE / 2, SIZE / 2, SIZE / 2, -SIZE / 2, 0.1, 2000)

camera.position.setZ(100)
camera.position.setY(100)
camera.position.setX(100)
camera.zoom = 1.5

camera.updateProjectionMatrix()

const renderer = new $3.WebGLRenderer({
	canvas: document.getElementById('bloch'),
	// alpha: true
})

renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(SIZE, SIZE)

renderer.render(scene, camera)

// Circle
const circle_geo = new $3.TorusGeometry(HSIZE, 1, 4, 100)
const circle_mat = new $3.MeshStandardMaterial({ color: 0x7777777 })

const torusX = new $3.Mesh(circle_geo, circle_mat)
scene.add(torusX)

const torusY = new $3.Mesh(circle_geo, circle_mat)
scene.add(torusY)
torusY.rotateY($3.Math.degToRad(90))

const torusZ = new $3.Mesh(circle_geo, circle_mat)
scene.add(torusZ)
torusZ.rotateX($3.Math.degToRad(90))

// Axis Lines
const al_mat = new $3.LineBasicMaterial({
	color: 0x7777777,
})

const al_x_pts = [new $3.Vector3(HSIZE * 1.5, 0, 0), new $3.Vector3(HSIZE * -1.5, 0, 0)]
const al_x_geo = new $3.BufferGeometry().setFromPoints(al_x_pts)
const al_x_line = new $3.Line(al_x_geo, al_mat)
scene.add(al_x_line)

const al_y_pts = [new $3.Vector3(0, HSIZE * 1.5, 0), new $3.Vector3(0, HSIZE * -1.5, 0)]
const al_y_geo = new $3.BufferGeometry().setFromPoints(al_y_pts)
const al_y_line = new $3.Line(al_y_geo, al_mat)
scene.add(al_y_line)

const al_z_pts = [new $3.Vector3(0, 0, HSIZE * 1.5), new $3.Vector3(0, 0, HSIZE * -1.5)]
const al_z_geo = new $3.BufferGeometry().setFromPoints(al_z_pts)
const al_z_line = new $3.Line(al_z_geo, al_mat)
scene.add(al_z_line)

// Line
const line_geo = new $3.CylinderGeometry(1, 1, HSIZE - 10, 16, 16)
line_geo.translate(0, (HSIZE - 10) / 2, 0)
const line_mat = new $3.MeshBasicMaterial({ color: 0xff0000 })
const line = new $3.Mesh(line_geo, line_mat)

const line_tip_geo = new $3.CylinderGeometry(0, 3, 10, 16, 16)
line_tip_geo.translate(0, HSIZE - 5, 0)
const line_tip_mat = new $3.MeshBasicMaterial({ color: 0xff0000 })
const line_tip = new $3.Mesh(line_tip_geo, line_tip_mat)

const line_group = new $3.Group()
line_group.add(line)
line_group.add(line_tip)
scene.add(line_group)

// Light
const ambientLight = new $3.AmbientLight(0xffffff)
scene.add(ambientLight)

// Helpers
// const gridHelper = new $3.GridHelper(200, 50);
// scene.add(gridHelper);

// Controller
const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = false

// Animate
const worldX = new $3.Vector3(1, 0, 0)
const worldY = new $3.Vector3(0, 1, 0)
// const worldZ = new $3.Vector3(0, 0, 1);

let prev_st = 0
let prev_sp = 0
let prev_th = 0
let prev_p = 0
let prev_l = 0

function animate() {
	requestAnimationFrame(animate)

	// reset rotation
	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(-prev_l || 0))
	line_group.rotateOnWorldAxis(worldX, $3.Math.degToRad(-prev_th || 0))
	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(-prev_p || 0))

	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(-prev_sp || 0))
	line_group.rotateOnWorldAxis(worldX, $3.Math.degToRad(-prev_st || 0))

	let st = window._bloch_stheta
	let sp = window._bloch_sphi

	let t = window._bloch_time / 100
	let p = window._bloch_phi * t
	let th = -window._bloch_theta * t
	let l = window._bloch_lambda * t

	// rotation again
	line_group.rotateOnWorldAxis(worldX, $3.Math.degToRad(st || 0))
	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(sp || 0))

	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(p || 0))
	line_group.rotateOnWorldAxis(worldX, $3.Math.degToRad(th || 0))
	line_group.rotateOnWorldAxis(worldY, $3.Math.degToRad(l || 0))

	prev_st = st
	prev_sp = sp

	prev_th = th
	prev_p = p
	prev_l = l

	// controls.update();

	renderer.render(scene, camera)
}

animate()
