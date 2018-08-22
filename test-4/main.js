var VSHADER_SOURCE =
'attribute vec4 a_Position;\n'+
'void main(){\n'+
'gl_Position = a_Position; \n'+//设置坐标
'gl_PointSize =5.0; \n'+
'}\n';//因为着色器必须预先处理成单个字符串的形式。

var FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main() {
  gl_FragColor =u_FragColor;
}
`


function main() {
  //
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log('Failded to get the rendering context for WebGL');
    return;
  }
  //初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failded to initialize shaders.');
    return;
  }
  var n =initVertexBuffers(gl);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.POINTS,0,n);

}
var g_points = [];//鼠标点击位置数组
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX;//mousedown x coordinate
  var y = ev.clientY;//mousedown y coordinate
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  g_points.push([x, y]);

  if (x >= 0.0 && y >= 0.0) {//第一象限
    g_colors.push([1.0, 0.0, 0.0, 1.0]);//红色
  } else if (x < 0.0 && y < 0.0) {//第三象限
    g_colors.push([0.0, 1.0, 0.0, 1.0]);//红色
  } else {//其他
    g_colors.push([1.0, 1.0, 1.0, 1.0]);//红色
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for (var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
    //绘制点
    gl.drawArrays(gl.TRIANGLES, 0, 1);

  }
}
//初始化顶点缓冲区
function initVertexBuffers(gl){
  var vertices =new Float32Array([0.0,0.5,-0.5,-0.5,0.5,-0.5]);
  var n =3;//顶点个数
  //创建缓冲区对象
  var vertexBuffer =gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;

  }
  //将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  //向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  
  var a_Position =gl.getAttribLocation(gl.program,'a_Position');

  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_Position);
  return n;
}