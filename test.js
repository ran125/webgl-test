// helper (which I did write)
Helper = {};
Helper.createShader = function(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}
Helper.createProgram = function(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}
Helper.pixel2DVertexVaryingShader = `
attribute vec2 a_position;
uniform vec2 u_resolution;
attribute vec2 a_color;
varying vec2 v_color;

void main(){
  gl_Position = vec4( vec2( 1, -1 ) * ( ( a_position / u_resolution ) * 2.0 - 1.0 ), 0, 1 );

  v_color = a_color;
}
`;
Helper.uniform2DFragmentVaryingShader = `
precision mediump float;
varying vec2 v_color;
uniform float u_tick;

float frac = 1.0/6.0;

void main(){

  float hue = v_color.x + u_tick;
  hue = abs(hue - floor(hue));
  vec4 color = vec4( 0, 0, 0, 1 );

  if( hue < frac ){
    color.r = 1.0;
    color.g = hue / frac;
    color.b = 0.0;
  } else if( hue < frac * 2.0 ){
    color.r = 1.0 - ( hue - frac ) / frac;
    color.g = 1.0;
    color.b = 0.0;
  } else if( hue < frac * 3.0 ){
    color.r = 0.0;
    color.g = 1.0;
    color.b = ( hue - frac * 2.0 ) / frac;
  } else if( hue < frac * 4.0 ){
    color.r = 0.0;
    color.g = 1.0 - ( hue - frac * 3.0 ) / frac;
    color.b = 1.0;
  } else if( hue < frac * 5.0 ){
    color.r = ( hue - frac * 4.0 ) / frac;
    color.g = 0.0;
    color.b = 1.0;
  } else {
    color.r = 1.0;
    color.g = 0.0;
    color.b = 1.0 - ( hue - frac * 5.0 ) / frac;
  }

  color = vec4( color.rgb * v_color.y, 1.0 );

  gl_FragColor = color;
}
`;
// end of helper

var gl = c.getContext('webgl'),
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight

, webgl = {};

webgl.shaderProgram =
    Helper.createProgram(
        gl,
        Helper.createShader(gl, gl.VERTEX_SHADER, Helper.pixel2DVertexVaryingShader),
        Helper.createShader(gl, gl.FRAGMENT_SHADER, Helper.uniform2DFragmentVaryingShader));
        //attrbute 传值
webgl.attribLocs = {
    position: gl.getAttribLocation(webgl.shaderProgram, 'a_position'),
    color: gl.getAttribLocation(webgl.shaderProgram, 'a_color')
};
//缓冲区
webgl.buffers = {
    position: gl.createBuffer(),
    color: gl.createBuffer()
};
//uinform 传值 
webgl.uniformLocs = {
    resolution: gl.getUniformLocation(webgl.shaderProgram, 'u_resolution'),
    tick: gl.getUniformLocation(webgl.shaderProgram, 'u_tick')
};

gl.viewport(0, 0, w, h);

gl.useProgram(webgl.shaderProgram);
// 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
gl.enableVertexAttribArray(webgl.attribLocs.position);
gl.enableVertexAttribArray(webgl.attribLocs.color);

//将缓冲区对象绑定到目标
gl.bindBuffer(gl.ARRAY_BUFFER, webgl.buffers.position);
// 设置变量获取数据规则
gl.vertexAttribPointer(webgl.attribLocs.position, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, webgl.buffers.color);
// 设置变量获取数据规则
gl.vertexAttribPointer(webgl.attribLocs.color, 2, gl.FLOAT, false, 0, 0);

gl.uniform2f(webgl.uniformLocs.resolution, w, h);

webgl.data = {
    triangles: [], // x, y
    colors: [] // hue, light
};
webgl.clear = function() {
    webgl.data.triangles = [
        0, 0,
        w, 0,
        0, h,
        w, 0,
        0, h,
        w, h
    ];
    webgl.data.colors = [
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0
    ];

    webgl.draw();

    webgl.data.triangles = [];
    webgl.data.colors = [];
}
webgl.draw = function() {

    gl.bindBuffer(gl.ARRAY_BUFFER, webgl.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(webgl.data.triangles), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, webgl.buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(webgl.data.colors), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, webgl.data.triangles.length / 2);
}

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

function Particle() {
    this.reset();
}
Particle.prototype.reset = function() {
    this.size = 5 + 5 * Math.random();
    this.x = cx;
    this.y = cy;
    this.vx = (Math.random() - .5) * 2 * 4;
    this.vy = -2 - 4 * Math.random();
    this.time = 1;
}
Particle.prototype.step = function() {
    this.x += this.vx *= .995;
    this.y += this.vy += .05;

    this.time *= .99;

    var triangles = getCircleTriangles(this.x, this.y, this.size * this.time),
        hue = this.vy / 10;

    for (var i = 0; i < triangles.length; i += 2) {
        webgl.data.triangles.push(triangles[i], triangles[i + 1]);
        webgl.data.colors.push(hue, this.time);
    }

    if (this.y - this.size > h)
        this.reset();
}

var tick = 0,
    particles = [],
    cx = w / 2,
    cy = h / 2;

function anim() {
    window.requestAnimationFrame(anim);

    webgl.clear();

    ++tick;

    if (particles.length < 1000)
        particles.push(new Particle, new Particle);

    particles.sort(function(a, b) {
        return a.time - b.time
    });
    particles.map(function(particle) {
        particle.step()
    });

    gl.uniform1f(webgl.uniformLocs.tick, tick / 100);

    webgl.draw();
}
anim();

window.addEventListener('click', function(e) {

    cx = e.clientX;
    cy = e.clientY;
})
window.addEventListener('resize', function() {

    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;

    cx = w / 2;
    cy = h / 2;

    gl.viewport(0, 0, w, h);
    gl.uniform2f(webgl.uniformLocs.resolution, w, h);
})