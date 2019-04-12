var VSHADER_SOURCE =
  'attribute vec2 a_Position;\n' +
  'uniform vec2 u_resolution;\n' + //模型矩阵
  'void main() {\n' +
  '  gl_Position = vec4( vec2( 1, -1 ) * ( ( a_Position / u_resolution ) * 2.0 - 1.0 ), 0, 1 );\n' +
  '  gl_PointSize =3.0; \n' +
  '}\n'

var FSHADER_SOURCE =
  'void main() {\n' + '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + '}\n'

var canvas = document.getElementById('webgl')

var gl = getWebGLContext(canvas),
  w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight)

var tick = 0,
  points = [],
  cx = w / 2,
  cy = h / 2

var count = 0
var circlePoint = []; //

//创建点
class Point {
  constructor() {
    this.size = 5 + 5 * Math.random() //?
    this.x = cx
    this.y = cy
    this.vx = (Math.random() - 0.5) * 2 * 4 //webgl 坐标范围是【-0.5，0.5】
    this.vy = -2 - 4 * Math.random()
    this.time = 1
  }

  step() {
    this.x += this.vx *= .995;
    this.y += this.vy += .05;

    this.time = this.time * .99;

    // var triangles = getCircleTriangles(this.x, this.y, this.size * this.time);

    var triangles = [this.x, this.y];
    for (var i = 0; i < triangles.length; i = i + 2) {
      circlePoint.push(triangles[i], triangles[i + 1]);

    }

    if (this.y - this.size > h) this.reset()
  }
  reset() {
    this.size = 5 + 5 * Math.random();
    this.x = cx;
    this.y = cy;
    this.vx = (Math.random() - .5) * 2 * 4;
    this.vy = -2 - 4 * Math.random();
    this.time = 1;
  }

}

// Model matrix
var modelMatrix = new Matrix4()
var currentPos = {
  x: 0,
  y: 0.0
}
var vertexBuffer = gl.createBuffer()
var vertices = new Float32Array(circlePoint)

function getCircleTriangles(x, y, r) {
  var triangles = [],
    inc = (Math.PI * 2) / 6,
    px = x + r,
    py = y

  for (var i = 0; i <= Math.PI * 2 + inc; i = i + inc) {
    var nx = x + r * Math.cos(i),
      ny = y + r * Math.sin(i)

    triangles.push(x, y, px, py, nx, ny)

    px = nx
    py = ny
  }

  return triangles
}

function animate() {
  window.requestAnimationFrame(animate);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //操作数据
  if (circlePoint.length < 1000) {
    points.push(new Point(), new Point())
  } else {
    circlePoint = [];
  }

  points.sort(function (a, b) {
    return a.time - b.time
  })

  points.map(function (point) {
    point.step()
  })

  draw()
}

function draw() {
  vertices = new Float32Array(circlePoint);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, a_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  //将当前绑定的缓冲区绑定到当前顶点缓冲区对象的通用顶点属性
  gl.enableVertexAttribArray(a_Position)
  gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
  // gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)
}

function main() {
  // 获取WebGL上下文对象
  if (!gl) {
    console.log('获取 context for WebGL失败')
    return
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.viewport(0, 0, w, h)

  var u_resolution = gl.getUniformLocation(gl.program, 'u_resolution')
  gl.uniform2f(u_resolution, w, h)

  animate() // Update the rotation angle
}