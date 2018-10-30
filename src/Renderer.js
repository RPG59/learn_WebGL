class Renderer {

    static draw(vbo, ibo, nbo, tbo, shader) {
        shader.bind();

        vbo.bind();
        GLCall(() => {
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

            nbo.bind();
        });
        GLCall(() => {
            gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        });
        tbo.bind();
        GLCall(() => {
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        });

        gl.enable(gl.DEPTH_TEST);
        gl.drawElements(gl.TRIANGLES, ibo.getCount(), gl.UNSIGNED_SHORT, 0);
    }

    static clear() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }
}