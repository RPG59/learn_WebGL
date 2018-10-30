class Shader {
    constructor(vertexShaderId, fragmentShaderId) {
        this.program = 0;
        this._createProgram(vertexShaderId, fragmentShaderId);
    }

    _getShader(shaderId, type) {
        const shaderSource = document.getElementById(shaderId).innerHTML;
        const shader = gl.createShader(type);

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log('Compile shader ERROR: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return;
        }
        
        return shader;
    }
    
    _createProgram(vertexShaderId, fragmentShaderId) {
        const vertexShader = this._getShader(vertexShaderId, gl.VERTEX_SHADER);
        const fragmentShader = this._getShader(fragmentShaderId, gl.FRAGMENT_SHADER);
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }
    
    bind() {
        gl.useProgram(this.program);
    }
    
    unbind() {
        gl.useProgram(0);
    }
}