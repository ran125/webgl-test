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
  var a_Position = gl.getAttribLocation(gl.program,'a_Position');
  var u_FragColor=gl.getUniformLocation(gl.program,'u_FragColor');
  canvas.onmousedown =function(ev){
    click(ev ,gl,canvas,a_Position,u_FragColor);
  }

  gl.clearColor(0.0,0.0,0.0,1.0);
   gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS,0,1);

}
var g_points =[];//鼠标点击位置数组
var g_colors =[];
function click(ev,gl,canvas,a_Position,u_FragColor){
  var x =ev.clientX;//mousedown x coordinate
  var y =ev.clientY;//mousedown y coordinate
  var rect =ev.target.getBoundingClientRect();
  x =((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y =(canvas.height/2 -(y - rect.top))/(canvas.height/2);

  g_points.push([x, y]);

  if(x >= 0.0 && y >= 0.0){//第一象限
     g_colors.push([1.0,0.0,0.0,1.0]);//红色
  }else  if(x < 0.0 && y < 0.0){//第三象限
    g_colors.push([0.0,1.0,0.0,1.0]);//红色
 }else {//其他
  g_colors.push([1.0,1.0,1.0,1.0]);//红色
}

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len =g_points.length;
  for(var i =0;i<len;i++){
    var xy = g_points[i];
    var rgba =g_colors[i];
   gl.vertexAttrib3f(a_Position,xy[0], xy[1], 0.0);
   
   gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3])
   //绘制点
   gl.drawArrays(gl.POINTS,0,1);

  }
}