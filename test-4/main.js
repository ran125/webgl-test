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
var aa =getCircleTriangles(0.1,0.1,10);
var canvas = document.getElementById('webgl');
var gl = getWebGLContext(canvas);

var w =canvas.innerWidth;h =canvas.innerHeight;
var bb =[
        0, 0,
        w, 0,
        0, h,
        w, 0,
        0, h,
        w, h];
function main() {
  //
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
  
  var run ={
    Vo:0.1,
    a:-0.01
  }
  var currpos =null;
  var tick =function(){
    currpos =animation(run);//更新当前角
    draw(gl,n,currpos,xformMatrix,u_xformMatrix);
    requestAnimationFrame(tick);
  }
  tick();
  var ANGLE = 90.0;
}

//初始化顶点缓冲区
function initVertexBuffers(gl){
  var vertices =new Float32Array([
    0.0,0.1,
    0.3,0.2,
    0.8,0.3,
    0.9,0.4
  ]);
  var n =4;//顶点个数
  //创建缓冲区对象
  var vertexBuffer =gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  //将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  //向缓冲区对象中写入数据
 
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bb),gl.STATIC_DRAW);
  var a_Position =gl.getAttribLocation(gl.program,'a_Position');
  //我们的目的是要 a_Position 能够动态从缓冲区对象中获取数据，所以我们还要设置获取的规则，比如，数据的类型，每个顶点占用多少个变量，这样才会正确处理缓冲区中的数值而不会乱来。
  //  设置变量获取数据规则
  //  第二个参数2表示每个顶点只有两个数据
  //  后面两个参数用于控制数组包括多种数据内容的情况，在本例中都为0，后面用到再详细解释
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(a_Position);
  return n;
}

var g_points =[];

function getCircleTriangles(x, y, r) {
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
function draw(gl,n,currpos,xformMatrix,u_xformMatrix){
  g_points.push(currpos.x,currpos.y);
  xformMatrix.setTranslate(currpos.x,currpos.y,0);
  gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix.elements);
  //清楚canvas 
  gl.clear(gl.COLOR_BUFFER_BIT);
  bb =[];
  for (var i = 0; i < aa.length; i += 2) {
   bb.push(aa[i], aa[i + 1]);
 }
  gl.drawArrays(gl.TRIANGLES,0,bb.length/2);
  // var len =g_points.length;
  // var a_Position =gl.getAttribLocation(gl.program,'a_Position');
  // for(var i =0;i<len;i++){
  //   var xy =g_points[i];
  //   gl.vertexAttrib3f(a_Position,xy[0], xy[1], 0.0);
  //   gl.drawArrays(gl.POINTS,0,n);
  // }
  t+=0.1;
}
var g_last =Date.now();//记录上一次调用的时刻
function animation(obj){
  //计算距离上次调用经过多长时间
  var now  =Date.now();
  if(t>10){
    t=0;
    g_points =[];
  }
  var translate_x =obj.Vo*t;
  var translate_y =obj.Vo*t +obj.a*t*t;
  var r_obj ={
    x:translate_x,
    y:translate_y
  }
  return r_obj ;
  
}
//创建一个粒子 类
//运动 位置
//颜色

