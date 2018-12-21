var VSHADER_SOURCE =
'attribute vec4 a_Position;\n'+
'void main(){\n'+
'gl_Position = a_Position; \n'+//设置坐标
'gl_PointSize =30.0; \n'+
'}\n';//因为着色器必须预先处理成单个字符串的形式。

var FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main() {
  gl_FragColor =u_FragColor;
}
`


function main(){
  //
  var canvas =document.getElementById('webgl');
  var gl =getWebGLContext(canvas);

  if(!gl){
    console.log('Failded to get the rendering context for WebGL');
    return ;
  }
  //初始化着色器
  if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
    console.log('Failded to initialize shaders.');
    return;
  }
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  } 
  gl.clearColor(0.0,0.0,0.0,1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS,0,1);//gl.TRIANGLE_FAN三角扇 gl.TRIANGLE_STRIP 三角面 gl.LINE_IOOP 回路 gl.LINE_STRIP 线条

  gl.drawArrays(gl.LINE_LOOP, 0, n);//（mode,first,count）first指定从哪个顶点开始绘制 count 指定绘制需要用到多少个顶点
}
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -0.2, 0.2,   -0.2, -0.2,   0.2, 0.2,　0.2, -0.2,　
  ]);
  var n = 4; // The number of vertices

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
