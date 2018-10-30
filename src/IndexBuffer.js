class GlIndexBuffer {
    constructor(data) {
        this.rendererId = gl.createBuffer();
        this._count = data.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rendererId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    getCount() {
        return this._count;
    }

    bind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rendererId);
    }

    unbind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
    }

    destroy() {
        gl.deleteBuffer(this.rendererId);
    }
}
