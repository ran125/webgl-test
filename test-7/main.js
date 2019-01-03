// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' + //模型矩阵
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize =3.0; \n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// Rotation angle (degrees/second)
var count = 0; var circlePoint =[];
class Point {
  constructor() {
    this.pos ={
      x:0.5,
      y:0.5
    }
    this.V0 = 1.1;
    this.a = -0.1;
    this.point ={x:0.,y:0.};
    // circlePoint.push(this.point.x,this.point.y);
    this.timeStar = Date.now();
    this.time = 0;
  }
  
  //创建一个点s
  // creat() {
  //   circlePoint.push(this.point[0],this.point[1])
  // }
  //删除一个点
  destory() {
    circlePoint.splice(-1, 2);
  }
  autoRunOrbit(currenTime) {
    var time = this.timeStar - currenTime;
   if(time !="NaN"){
    if(this.time >10){
      this.time =0;
      this.destory();
    }
    if(this.V0 < 0){
      this.V0 = 1.0
    }
    this.pos.x = ((this.V0 * this.time) - this.pos.x)/10;
    this.pos.y = (((this.V0 * this.time + this.a * this.time * this.time)) - this.pos.y)/10;
    this.point = {x:this.pos.x,y:this.pos.y};
 
    circlePoint.push(this.point.x,this.point.y);
    this.time++;
    this.V0 = this.V0-0.1;
   }
  }
  getPos() {
    return [this.pos.x, this.pos.y];
  }
  magRange(val){
    if(val){

    }
  }
}
var point = new Point();
var canvas = document.getElementById('webgl');
var gl = getWebGLContext(canvas);
// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
  // return;
}

// Write the positions of vertices to a vertex shader
var n = initVertexBuffers(gl);
if (n < 0) {
  console.log('Failed to set the positions of the vertices');
  // return;
}
// Specify the color for clearing <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Get storage location of u_ModelMatrix
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
  console.log('Failed to get the storage location of u_ModelMatrix');
  // return;
}
// Model matrix
var modelMatrix = new Matrix4();
var currentPos = {
  x: 0,
  y: 0.0
}

function main() {
  // Retrieve <canvas> element
  // Get the rendering context for WebGL
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Start drawing
  var tick = function () {
    currentPos = animate(currentPos); // Update the rotation angle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

function initVertexBuffers(gl,time) {
  // var point = new Point();
  if(time != "undefined"){
    point.autoRunOrbit(time);
  }
  var vertices = new Float32Array(circlePoint);

  // g_poiont.push
  var n = vertices.length / 2; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  return n;
}

function draw(gl, n, modelMatrix, u_ModelMatrix) {
  // Set the rotation matrix
  // modelMatrix.setRotate(currentAngle, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  // modelMatrix.setTranslate(currentPos.x, currentPos.y, 0, 1);//先注释掉  然后实现增加点   ，然后消失点

  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.POINTS, 0, n);
}

// 记录上一次调用函数的时刻
var g_last = Date.now();

function animate(pos) {
  // 计算距离上次调用经过多长时间
  var now = Date.now();
  var elapsed = now - g_last;
  if (elapsed > 500) {
    g_last = Date.now();
    draw(gl, n, modelMatrix, u_ModelMatrix); // Draw the triangle
    n = initVertexBuffers(gl,now);
   }
  //超出区域销毁
  // if(n>1){
  //   point.destory();
  // }
  // 根据距离上次调用的时间，更新当前数据
  // var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;//旋转角度每秒   在烟花函数里边 这个是平移的距离根据烟花轨迹

  return pos;
}
