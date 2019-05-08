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
fruits();
function fruits(){}
  fruits.prototype ={
    color:"red",
    size:'12',
    say:function(){
      console.log("my color is "+this.size);
      // this.say()
    }
  }
  var apple =new fruits();
  apple.say();
  banana ={
    color:"yellow",
    size:'16',
    say:function(){
      console.log("输出"+app.color)
    }
  }
  apple.say.call(apple,banana);
  apple.say.apply(apple,banana);

// var array1 = [12 , "foo" , {name:"Joe"} , -2458]; 
// var array2 = ["Doe" , 555 , 100];
// var array3 =["wrr","123"]; 

// Array.prototype.console =function(arr1,arr2){
//   console.log(this);
//   console.log("参数1"+arr1)
//   console.log("参数2"+arr2)
// }
// Array.prototype.console.apply(array1,[array2,array3]); 
// // array1.console();
// // array2.console();

// var  numbers = [5, 458 , 120 , -215 ]; 
// var maxInNumbers = Math.max.apply(numbers),   //458
//     maxInNumbers = Math.max.call(5, 458 , 120 , -215); //458
//     console.log(maxInNumbers,maxInNumbers);
//     var  numbers = [5, 458 , 120 , -215 ]; 
//   function isArray(obj){ 
//     console.log(obj.toString());
//     var aa ={
//       a:1,b:2
//     }
//     console.log(aa.toString());
//       return Object.prototype.toString.call(obj) === '[object Array]' ;
//   }
//  var aa =isArray( numbers);
// function Parent1(){
//   this.name='wrr'
// }
// Parent1.prototype.say =function(){
//   console.log(this.name);
// }
// function Children(){
//   Parent1.apply(this);
//   this.age ="25"
// }
// console.log(new Children());

// function Children1(){
//  this.type ="children1"
// }

// Children1.prototype =new Parent1();
// console.log(new Children1())



// /**
//    * 借助原型链实现继承
//    */
//   function Parent1(){
//     this.name='wrr'
//   }
//   Parent1.prototype.say =function(){
//     console.log(this.name);
//   }
//   function Child2() {
//     this.type = 'child2';
//   }
//   Child2.prototype = Parent1.prototype; // prototype使这个构造函数的实例能访问到原型对象上
//   console.log(new Child2().__proto__);
//   console.log(new Child2().__proto__ === Parent1.prototype); // false

//   var s1 = new Child2(); // 实例
//   var s2 = new Child2();
//   // console.log(s1.play, s2.play);
//   // s1.play.push(4);

//   console.log(s1.__proto__ === s2.__proto__); // true // 父类的原型对象


//4 



// A
var a = b = 1;
b = 2;

// B
var a = {name: 'jack', age: 27};
var b = a;
b.name = 'may';

// C
var a = [1, 3, 5];
var b = [...a];

// D
var a = [1, 2, 3];
var b = a.push(4); // b = 4;

//数组去重 

function sele(arr){
  var temp = [];
  for( var i = 0 ; i < arr.length ; i++ ){
      if( temp.indexOf( arr[ i ] ) == -1 ){
          temp.push( arr[ i ] );
      }
  }
  return temp;
}
var arr = ['aa', 'bb', 'cc', '', 1, 0, '1', 1, 'bb', null, undefined, null];
console.log(sele(arr));


