window.onload = main;

let angle = 1;
let zTranslation = -2.0;

let texture;

const pMatrix = mat4.create();
const mvMatrix = mat4.create();
const nMatrix = mat3.create();

function main() {

    const evenHandler = new UserEventsHandler();
    document.addEventListener('keydown', e => {
        evenHandler.mainHandler(e);
    }, false);

    console.log(gl.getParameter(gl.VERSION));
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

    gl.viewportHeight = canvas.height;
    gl.viewportWidth = canvas.width;


    shader = new Shader('vertexShaderSource', 'fragmentShaderSource');
    shader.bind();
    setUniformLocations();

    var vertices = [
        -0.8, -0.5, 0.5,
        -0.8, 0.5, 0.5,
        -0.4, 0.5, 0.5,
        -0.4, -0.5, 0.5,

        -0.8, -0.5, 0.0,
        -0.8, 0.5, 0.0,
        -0.4, 0.5, 0.0,
        -0.4, -0.5, 0.0,

        -0.8, -0.5, 0.5,
        -0.8, 0.5, 0.5,
        -0.8, 0.5, 0.0,
        -0.8, -0.5, 0.0,

        -0.4, -0.5, 0.5,
        -0.4, 0.5, 0.5,
        -0.4, 0.5, 0.0,
        -0.4, -0.5, 0.0,

        0.8, -0.5, 0.5,
        0.8, 0.5, 0.5,
        0.4, 0.5, 0.5,
        0.4, -0.5, 0.5,

        0.8, -0.5, 0.0,
        0.8, 0.5, 0.0,
        0.4, 0.5, 0.0,
        0.4, -0.5, 0.0,

        0.8, -0.5, 0.5,
        0.8, 0.5, 0.5,
        0.8, 0.5, 0.0,
        0.8, -0.5, 0.0,

        0.4, -0.5, 0.5,
        0.4, 0.5, 0.5,
        0.4, 0.5, 0.0,
        0.4, -0.5, 0.0
    ];

    indices = [
        0, 1, 2,
        2, 3, 0,

        4, 5, 6,
        6, 7, 4,

        8, 9, 10,
        10, 11, 8,

        12, 13, 14,
        14, 15, 12,

        // 16, 17, 18,
        // 18, 19, 16,

        // 20, 21, 22,
        // 22, 23, 20,

        // 24, 25, 26,
        // 26, 27, 24,

        // 28, 29, 30,
        // 30, 31, 28
    ];

    normals = [
        
        0.0, 0.0, 1.0, //v0
        0.0, 0.0, 1.0, //v1
         0.0,  0.0,  1.0, //v2
           0.0,  0.0,  1.0, //v3
      
           0.0,  0.0, -1.0, //v4
           0.0,  0.0, -1.0, //v5
           0.0,  0.0, -1.0, //v6
           0.0,  0.0, -1.0, //v7
            
          -1.0,  0.0,  0.0, //v8
          -1.0,  0.0,  0.0, //v9
          -1.0,  0.0,  0.0, //v10
          -1.0,  0.0,  0.0, //v11
            
           1.0,  0.0,  0.0, //v12
           1.0,  0.0,  0.0, //v13
           1.0,  0.0,  0.0, //v14
           1.0,  0.0,  0.0, //v15
    ];

    textureCoords = [];

    for (let i = 0; i < 8; i++)
        textureCoords.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0);



    vbo = new GlArrayBuffer(new Float32Array(vertices));
    ibo = new GlIndexBuffer(new Uint16Array(indices));
    tbo = new GlArrayBuffer(new Float32Array(textureCoords));
    nbo = new GlArrayBuffer(new Float32Array(normals));

    createTexture();
    setupLights();
    setMaterials();

    (function animloop() {
        setTexture();
        setupWebGL();
        Renderer.clear();
        Renderer.draw(vbo, ibo, nbo, tbo, shader);
        requestAnimFrame(animloop, canvas);
    })();

}

function setMaterials(){
    gl.uniform3fv(gl.getUniformLocation(shader.program, 'uAmbientMaterialColor'), [0.0, 1.0, 0.0]);
    gl.uniform3fv(gl.getUniformLocation(shader.program, 'uDiffuseMaterialColor'), [0.7, 0.7, 0.7]);
    gl.uniform3fv(gl.getUniformLocation(shader.program, 'uSpecularMaterialColor'), [1.0, 1.0, 1.0]);

}

function setupWebGL() {
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, 'uMVMatrix'), false, pMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, 'uPMatrix'), false, mvMatrix);
    gl.uniformMatrix3fv(gl.getUniformLocation(shader.program, 'uNMatrix'), false, nMatrix)

    // gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

}

function setUniformLocations() {
    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'aVertexPosition'));
    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'aVertexTextureCoords'));

    shader.program.vertexNormalAttribute = gl.getAttribLocation(shader.program, 'aVertexNormal');
    gl.enableVertexAttribArray(shader.program.vertexNormalAttribute);

    shader.program.uniformLightPosition = gl.getUniformLocation(shader.program, 'uLightPosition');
    shader.program.uniformDiffuseLightColor = gl.getUniformLocation(shader.program, 'uDiffuseLightColor');
    shader.program.uniformSpecularLightColor = gl.getUniformLocation(shader.program, 'uSpecularLightColor');
    shader.program.uniformAmbientLightColor = gl.getUniformLocation(shader.program, 'uAmbientLightColor')

}

function setupLights() {
    gl.uniform3fv(shader.program.uniformLightPosition, [0.0, 10.0, 5.0]);
    gl.uniform3fv(shader.program.uniformAmbientLightColor, [0.1, 0.1, 0.1]);
    gl.uniform3fv(shader.program.uniformDiffuseLightColor, [0.7, 0.7, 0.7]);
    gl.uniform3fv(shader.program.uniformSpecularLightColor, [1.0, 1.0, 1.0]);
}


function createTexture() {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const image = new Image();

    image.addEventListener('load', () => {

        handleTextureLoaded(image, texture);
    });

    image.src = './src/img/test.png';
}

function setTexture() {
    mat4.perspective(pMatrix, 1, 640 / 480, 0.1, 100);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0, 0, zTranslation]);
    mat4.rotate(mvMatrix, mvMatrix, angle, [0, 1, 0]);
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}

function glClearError() {
    while (gl.getError() !== gl.NO_ERROR);
}

function glLogCall() {
    let error;
    while (error = gl.getError()) {
        console.log(error);
        debugger
    }
}

function GLCall(x) {
    glClearError();
    x();
    glLogCall();
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

class UserEventsHandler {
    constructor() {
        this.handlers = {
            ['w']: this.W_Handler,
            s: this.S_Handler,
            a: this.A_Handler,
            d: this.D_Handler,
            ['ц']: this.W_Handler,
            ['ф']: this.A_Handler,
            ['ы']: this.S_Handler,
            ['в']: this.D_Handler
        }
    }

    mainHandler(e) {
        if (e && e.key && this.handlers.hasOwnProperty(e.key)) {
            this.handlers[e.key]();
        }
    }

    W_Handler() {
        zTranslation += 0.05;
    }

    S_Handler() {
        zTranslation -= 0.05;
    }

    A_Handler() {
        angle += 0.05;
    }

    D_Handler() {
        angle -= 0.05;
    }

}

