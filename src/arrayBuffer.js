class GlArrayBuffer {
    constructor(data) {
        this.rendererId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererId);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererId);
    }

    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, 0);
    }

    destroy() {
        gl.deleteBuffer(this.rendererId);
    }
}
