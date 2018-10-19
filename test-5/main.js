


// var VSHADER_SOURCE =`
// precision mediump float;
 
// uniform sampler2D texture0;
// uniform sampler2D texture1;
// varying vec4      vColor;
// varying vec2      vTextureCoord;
 
// void main(void){
//     vec4 smpColor0 = texture2D(texture0, vTextureCoord);
//     vec4 smpColor1 = texture2D(texture1, vTextureCoord);
//     gl_FragColor   = vColor * smpColor0 * smpColor1;
// }

// `

// var FSHADER_SOURCE =`
// precision mediump float;
// uniform vec4 u_FragColor;
// void main() {
//   gl_FragColor =u_FragColor;
// }
// `

// var Tx =0.5, Ty =0.5,Tz =0.0; 
// var ANGLE_STEP =45.0;
// var t=0;
// function main() {
//   //
//   var canvas = document.getElementById('webgl');
//   var gl = getWebGLContext(canvas);

//   if (!gl) {
//     console.log('Failded to get the rendering context for WebGL');
//     return;
//   }
//   //初始化着色器
//   if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('Failded to initialize shaders.');
//     return;
//   }
//   var n =initVertexBuffers(gl);
//   if (n < 0) {
//     console.log('Failed to set the positions of the vertices');
//     return;
//   }

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
//   var xformMatrix =new Matrix4();
//   var u_xformMatrix =gl.getUniformLocation(gl.program,'u_xformMatrix');
//   if (!u_xformMatrix) {
//     console.log('Failed to get the storage location of u_xformMatrix');
//     return;
//   }
//   // uniformLocationを配列に取得
//   var uniLocation = new Array();
//   uniLocation[0]  = gl.getUniformLocation(prg, 'mvpMatrix');
//   uniLocation[1]  = gl.getUniformLocation(prg, 'texture0');
//   uniLocation[2]  = gl.getUniformLocation(prg, 'texture1');

//   var texture0 = null, texture1 = null;
//   create_texture('texture0.png', 0);
//   create_texture('texture1.png', 1);
  
//   gl.activeTexture(gl.TEXTURE0);
//   gl.bindTexture(gl.TEXTURE_2D, texture0);
//   gl.uniform1i(uniLocation[1], 0);
  

//   gl.activeTexture(gl.TEXTURE1);
//   gl.bindTexture(gl.TEXTURE_2D, texture1);
//   gl.uniform1i(uniLocation[2], 1);


//   // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   // //var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
 
//   var run ={
//     Vo:0.1,
//     a:-0.01
//   }
//   var runpos =null;
//   var tick =function(){
//     runpos =animation(run);//更新当前角
//     requestAnimationFrame(tick);
//   }
//   tick();
//   var ANGLE = 90.0;
// }


// function create_texture(source, number){
 
//   var img = new Image();
  
 
//   img.onload = function(){
     
//       var tex = gl.createTexture();
      
     
//       gl.bindTexture(gl.TEXTURE_2D, tex);
      
    
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      
      
//       gl.generateMipmap(gl.TEXTURE_2D);
      
     
//       gl.bindTexture(gl.TEXTURE_2D, null);
      
     
//       switch(number){
//           case 0:
//               texture0 = tex;
//               break;
//           case 1:
//               texture1 = tex;
//               break;
//           default:
//               break;
//       };
//   }
  
  
//   img.src = source;

// }

 
var VSHADER_SOURCE =
    `attribute vec4 a_Position;
     attribute vec2 a_TexCoord;
     varying vec2 v_TexCoord;
     void main() {
       gl_Position = a_Position;
       v_TexCoord = a_TexCoord;
     }`;
 
// Fragment shader program
var FSHADER_SOURCE =
    `#ifdef GL_ES
     precision mediump float;
     #endif
     uniform sampler2D u_Sampler0;
     uniform sampler2D u_Sampler1;
     varying vec2 v_TexCoord;
     void main() {
       vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
       vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
       gl_FragColor = color0 + color1;
     }`;
 
function main() {
 
   
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    // 获取WebGL上下文对象
    if (!gl) {
        console.log('获取 context for WebGL失败');
        return;
    }
 
    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
 
    // 设置顶点坐标
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('设置顶点信息失败');
        return;
    }
 
    // 设置背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
 
    // 设置材质
    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }
}
 
function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
        // 顶点坐标，材质坐标
        -0.5,  0.5,   0.0, 1.0,
        -0.5, -0.5,   0.0, 0.0,
        0.5,  0.5,   1.0, 1.0,
        0.5, -0.5,   1.0, 0.0,
    ]);
    var n = 4; // 顶点数量
 
    // 生成缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('生成缓冲区对象失败');
        return -1;
    }
 
    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
 
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('获取 a_Position失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);  // 开启缓冲区对象
 
    // 获取材质坐标存储
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('获取材质坐标失败');
        return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);  //开启缓冲区
 
    return n;
}
 
function initTextures(gl, n) {
    // 新建材质
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    if (!texture0 || !texture1) {
        console.log('新建材质失败');
        return false;
    }
 
    //获取取样器存储
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler0 || !u_Sampler1) {
        console.log('获取取样器失败');
        return false;
    }
 
    // Create the image object
    var image0 = new Image();
    var image1 = new Image();
    if (!image0 || !image1) {
        console.log('新建图像失败');
        return false;
    }
    // 图片加载完成后执行创建材质
    image0.onload = function(){ loadTexture(gl, n, texture0, u_Sampler0, image0, 0); };
    image1.onload = function(){ loadTexture(gl, n, texture1, u_Sampler1, image1, 1); };
 
    image0.src = '00.jpg';
    image1.src = '11.png';
 
    return true;
}
// 指定图片加载状态
var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// 翻转Y轴
    // 激活材质单元
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    // 绑定材质
    gl.bindTexture(gl.TEXTURE_2D, texture);
 
    // 设置材质参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 将图片赋予材质
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
 
    gl.uniform1i(u_Sampler, texUnit);   // 将材质传递给取样器
 
    // 清空绘图
    gl.clear(gl.COLOR_BUFFER_BIT);
 
    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);   // Draw the rectangle
    }
}
main();
