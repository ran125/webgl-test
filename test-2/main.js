var VSHADER_SOURCE =
'void main(){\n'+
'gl_Position = vec4(0.0,0.0,0.0,1.0); \n'+//设置坐标
'gl_PointSize =10.0; \n'+
'}\n';//因为着色器必须预先处理成单个字符串的形式。
// var FSHADER_SOURCE =
// 'void main() {\n'+
// 'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'+
// '}\n';
var FSHADER_SOURCE =`
void main() {
  gl_FragColor =vec4(1.0,0.0,0.0,1.0);
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
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS,0,1);

}