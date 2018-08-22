var VSHADER_SOURCE =
'attribute vec4 a_Position;\n'+
'uniform mat4 u_xformMatrix;\n'+
'void main(){\n'+
'gl_Position = u_xformMatrix * a_Position; \n'+//设置坐标
'gl_PointSize =5.0; \n'+
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
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
  var xformMatrix =new Matrix4();
  var u_xformMatrix =gl.getUniformLocation(gl.program,'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  
  // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // //var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
 
  var run ={
    Vo:0.1,
    a:-0.01
  }
  var runpos =null;
  var tick =function(){
    runpos =animation(run);//更新当前角
    draw(gl,n,runpos,xformMatrix,u_xformMatrix);
    requestAnimationFrame(tick);
  }
  tick();
  var ANGLE = 90.0;
}

//初始化顶点缓冲区
function initVertexBuffers(gl){
  var vertices =new Float32Array([0.0,0.1]);
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

var g_points =[];
function draw(gl,n,runpos,xformMatrix,u_xformMatrix){
  //xformMatrix.setRotate(currentAngle,0,0,1);//设置旋转矩阵
  g_points.push(runpos.x,runpos.y);
  console.log(g_points)
  xformMatrix.setTranslate(runpos.x,runpos.y,0);
  gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix.elements);
  //清楚canvas 
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len =g_points.length;
  var a_Position =gl.getAttribLocation(gl.program,'a_Position');
  for(var i =0;i<len;i++){
    var xy =g_points[i];
    gl.vertexAttrib3f(a_Position,xy[0], xy[1], 0.0);
    gl.drawArrays(gl.POINTS,0,1);
  }
  
  //绘制三角形
  t+=0.1;
  //
}
var g_last =Date.now();//记录上一次调用的时刻
function animation(obj){
  //计算距离上次调用经过多长时间
  var now  =Date.now();
 
  var translate_x =obj.Vo*t;
  var translate_y =obj.Vo*t +obj.a*t*t;
  var r_obj ={
    x:translate_x,
    y:translate_y
  }
 
  return r_obj ;
  
}
