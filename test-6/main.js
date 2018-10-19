var VSHADER_SOURCE =
'attribute vec2 a_Position;\n'+
'uniform vec2 u_resolution;\n'+
'attribute vec2 a_color;'+
'varying vec2 v_color;'+
'void main(){\n'+
'gl_Position = vec4( vec2( 1, -1 ) * ( ( a_Position / u_resolution ) * 2.0 - 1.0 ), 0, 1 ); \n'+//设置坐标
'v_color = a_color; \n'+
'}\n';//因为着色器必须预先处理成单个字符串的形式。

var FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main() {
  gl_FragColor =u_FragColor;
}
`

var Tx =0.5, Ty =0.5,Tz =0.0; 
var ANGLE_STEP =45.0;
var t=0;

var canvas = document.getElementById('webgl');
var gl = getWebGLContext(canvas);

var w =  canvas.innerWidth,
h = canvas.innerHeight;
var ver_data_position =[
  0, 0,
  w, 0,
  0, h,
  w, 0,
  0, h,
  w, h
];
var ver_data_color =[
  0, 0,
  0, 0,
  0, 0,
  0, 0,
  0, 0,
  0, 0
];

//创建缓冲区对象
var ver_buffer_position = gl.createBuffer();
var ver_buffer_color = gl.createBuffer();
function main() {
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
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  // var xformMatrix =new Matrix4();//创建矩阵4乘4 的矩阵
  var u_resolution =gl.getUniformLocation(gl.program,'u_resolution');
  if (!u_resolution) {
    console.log('Failed to get the storage location of u_resolution');
    return;
  }
 
  var tick =function(){
    draw(gl,n,u_resolution);
    requestAnimationFrame(tick);
  }
  tick();
}

//初始化顶点缓冲区
function initVertexBuffers(gl){

  var n =4;//顶点个数

  if(!ver_buffer_position){
    console.log('Failed to create the buffer object');
    return -1;
  }
  //将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER,ver_buffer_position);
  gl.bindBuffer(gl.ARRAY_BUFFER,ver_buffer_color);

  // //向缓冲区对象中写入数据
  // gl.bufferData(gl.ARRAY_BUFFER,ver_data_position,gl.STATIC_DRAW);
  // gl.bufferData(gl.ARRAY_BUFFER,ver_data_color,gl.STATIC_DRAW);


  // 获取顶点着色器代码中的顶点变量
  var a_Position =gl.getAttribLocation(gl.program,'a_Position');
  //我们的目的是要 a_Position 能够动态从缓冲区对象中获取数据，所以我们还要设置获取的规则，比如，数据的类型，每个顶点占用多少个变量，这样才会正确处理缓冲区中的数值而不会乱来。
  //  设置变量获取数据规则
  //  第二个参数2表示每个顶点只有两个数据
  //  后面两个参数用于控制数组包括多种数据内容的情况，在本例中都为0，后面用到再详细解释
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
  // 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
  gl.enableVertexAttribArray(a_Position);


  var a_color =gl.getAttribLocation(gl.program,'a_color');
  gl.vertexAttribPointer(a_color,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_color);
  return n;
}

var g_points =[];
function draw(gl,n,u_resolution){
  gl.uniform2f(u_resolution,w,h);
  //清楚canvas 
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, ver_buffer_position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ver_data_position), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, ver_buffer_color);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ver_data_color), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, ver_buffer_position.length / 2);
  t+=0.1;
}
var g_last =Date.now();//记录上一次调用的时刻
function animation(obj){
  console.log(798798)
  //计算距离上次调用经过多长时间
  if(t>10){
    t=0;
    g_points =[];
  }
  var translate_x =obj.Vo*t;
  var translate_y =obj.Vo*t +obj.a*t*t;
  var  vy = -2 - 4 * Math.random();
  console.log(translate_x, translate_y, 2 * t);
  var triangles = getCircleTriangles(translate_x, translate_y, 2 * t),
  hue = vy / 10;

for (var i = 0; i < triangles.length; i += 2) {
  ver_data_position.push(triangles[i], triangles[i + 1]);
  ver_data_color.push(hue, this.time);
}
  var r_obj ={
    x:translate_x,
    y:translate_y
  }
  return r_obj ;
}
function getCircleTriangles(x, y, r) {
  console.log(x, y, r);
  var triangles = [],
      inc = Math.PI * 2 / 6,
      px = x + r,
      py = y;

  for (var i = 0; i <= Math.PI * 2 + inc; i += inc) {

      var nx = x + r * Math.cos(i),
          ny = y + r * Math.sin(i);

      triangles.push(x, y, px, py, nx, ny);

      px = nx;
      py = ny;
  }

  return triangles;
}
