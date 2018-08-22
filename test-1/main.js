// var FSHADER_SOURCE =document.getElementById('vertexShader').textContent;
// var VSHADER_SOURCE =document.getElementById('fragmentShader').textContent;
// HelloQuad_FAN.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'varying vec3 v_position;\n'+
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';


var FSHADER_SOURCE =
 'precision mediump float;\n'+
  'uniform vec4 u_FragColor;'+
  'uniform vec2 u_resolution;'+
  'uniform float pos;'+
  'void main() {\n' +
  'vec2 st = gl_FragCoord.xy.xy/u_resolution.xy;'+
  'vec4 white =vec4(1.0,1.0,1.0,1.0);'+
  'if(st.x >pos){'+
    '  gl_FragColor = u_FragColor;\n' +
  '}else{'+
    '  gl_FragColor = white;\n' +
  '}'+
  '}\n';
  
function main() {
   
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  console.log();
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
   // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

  var u_resolution = gl.getUniformLocation(gl.program, 'u_resolution');
  gl.uniform2f(u_resolution, gl.drawingBufferHeight, gl.drawingBufferWidth);

  //pos
  var u_resolution = gl.getUniformLocation(gl.program, 'pos');
  gl.uniform1f(u_resolution,0.6);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);//（mode,first,count）first指定从哪个顶点开始绘制 count 指定绘制需要用到多少个顶点
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -0.5, 0.5,   -0.5, -0.5,   0.5, 0.5,　
  ]);
  var n = 3; // The number of vertices

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

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
 
　// Assign the buffer object to a_Position variable
  //将缓冲区对象分配给attribute变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);//2 指定缓冲区中每个顶点的分量个数1-4，gl.float 指定数据格式 false normalize 表明是否将非浮点型的数据归一化【0，1】【-1，1】 0 指定相邻两个顶点建的字节数 0 指定缓冲区对象中的偏移量
 
  // Enable the assignment to a_Position variable
  //开启attribute变量
  gl.enableVertexAttribArray(a_Position);

  return n;
}
function click(){

}
