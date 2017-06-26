(function () {

    /**
     * Main function. It returns an object with all the public functions bound to
     * a new context that it creates by loading a cart
     */
    function boot () {
        let WIDTH = 160;
        let HEIGHT = 144;
        let PIXEL_WIDTH = 4;

        const SYSTEM_FONT_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAkCAYAAAAeor16AAACh0lEQVRoge1Y0Y7jMAjEVf//l70v64rQGXswiXZbZaRTNxwxhBAGaL13I+hm1sC1lzPZgKLnbSC7qgzZuAq9tdbMzB5nHEbkjfy9OksJ3jgzvix2/5k42MgEsIXfKI/X0XElMyqZ08Mvk7F7u6D3hlkAM1kzux4yJYsqQC+YvfRos7l/KcwCqD4Yy0DkjBJsdL7yUjrRVUsCwvIrahMSuTHBL4fY0zhr+mtb6EVZhpk9MjaiLItVJkr+PfzFwilUIzJ1Q9FlOqqMfepIFpMjkggrBwe7T3A4A/vWM04PJ2ayig0l0CizmH3UGh3sZvtAloWKjppFzK5ynhJolFmsjWHBfsmeThEZZdFnvR5DJnsretkmfNUxLOU3C2/Cs7DZ/DtfMR/LyjPPU1kdydj87qF2Im/yRzDikSnIqE4sGQzI2HnMD2XqqCA+x1vws5NIZdOhMql6b8au4vPWc/kAqr3g7sNkWFj5GjJ2Lyv0D2dAMcJaAnWhsGNjpoM2Lwq2Ni/u3puFqxgsPEhEyaKZXswEJItnXiFjvkR/ETK6L7BZWGVmxJpXsKECddphNVGNwQEjgBk2RIaurANoHh12IypdArLrfyF8BqpDd2w6Kw4rrQ3KBNXfy8H6QHXWHdmnNL6sHOw8NMt6tY6xhYJq96V7s/AmPAubXVvDvhpjmZAZ1tUlwc4yIbMQqNx76jIh3siuGdRlAjtTXZaie5T2qUIupy8T/moWrpQY1efyMkE5MMN8u/2i2uRG3XsW/iREFv5mZOb8NL59mTCgkhLCNC6fsExQZ2E23mWgbHIOcZk10sxpFKxKQV7JMrOwGfZPRbqlYssEFhjUF/33WdiIbPX/aot1o4IfMzlNL4+bwx4AAAAASUVORK5CYII=';

        const LOGO_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAaCAYAAABW6GksAAAERUlEQVRoge1YvW4jNxD+xtAzpI97Iydp/QAOlOYQuDqlDCC/ggP4KhVyEwNJebWQ2lcZQZrbJG0Qr2wf3Pv6vEMwKbTDzHI5JFdaXbUfIEgi54/8OMMfYmYM+HwgInPCfwHo+0w+aCDuAHj7qdVEN8cMAHz1YqrRzTFqGQKAj3+/c31f/fFTQ3bUQ5gDEqCbY3aE/fjl9jtArsjU8hSzORB3YDjSIoT54KsX0M0xP51dmuQd9RbhgBYapL39lEWagK9e8OrPn819bNjjesTjN+8BAOPptFkeU3qbjdk3Ked4mN02Mm/84c1QKg+BGGkxkkJ4mN1iUs7ZJ28g7jOhK2EpDHtcz5iU80a2PW42e5MmWafbBuIOiL6zTGMExG/zeyJ4+FH+ooejDnE5O0SEPmwyc+so3mWeDkkaAIyIKO/0I/cQgXW0VXJExNd00ZiAJdasJrnV35CLxWX4WWGBa7oIqnS1ucLCxRbVrfWu6QJLrA9OGtClVMo9JHUf8frvime3St3gjf6WXE48ETt92Uzqdryj9YERAJJ3NKD9libvZ7lw+t5A/METEYqiSNqz/Ft+crCPzaRuBJNyDmZ297195Ea1Uzr9/TuWwNSbWdbkCqqqcr+1bos01XdenbRLacK/5cfCPjb92OvnqIYNrWthUs7d7/GHNyYpuXIjZsbHr39wE1ihYr9G+5MbwhJrfpjdtup7VVXQ7ZNybpImiPm3/KRi1PKhibZshuajPp5jhQWF4qlfO4JxEJGzEYOWC72eNC7gEoQ416tqiXX2icrXDbWHJjrmP+VHx+cfKvQkpSbMt6nj0fqhu9USaxRFkZWB+yL5cnJenZA/+FzIipX/eqV2sSG/rTgkq4FtefFPhAJdhjS0zaOjo2DsAFAURSOb/FhEd4UF1c9UDR8++VYsWi6UbYAizlrtXUnzM8UfhKxUf2L3yTYN2RPuimfWhFryOjti2SbtIVJyxi1j1xhPp83Y63Kr/VqLPJpx/qoLrViLVJ0pueRpyIT6GRvyc46TRtmySLf2tpBNP9v8eKx9TCoUsL1TWnLj6bS1p+q2mjQsseZluZZY3XwRM0tpAfB/nZZgQ+3+gEIy1h4msiIvG7xuT8Hyo+9yVVX9s8Lii11s7qnriPq1/M31p7JN8LjZONIE385eA2gkDpkZF1p10q7/58gIQiTdFc+MHfdy30+92mmFBYfiyrW5q64mDdgSBmwzT0iU9lXZWsDuf51pAJoVQZVQdhknnXol65Na7N6VkvEhOpavFFJ+hLxdbO4aj7+fAuEyrPtaZNbkSYaJfGg/JWbG6ekpAOhA9YRY7egoY+lYvlLo6mcXm9m6VVWRyFv7fi6hoXaNp7PLbam8v78PBS3ImaDs431CZxc7u/jpXZeI8DC7Jf9uJ9DHev+0GesD0L4O/PsXwMzDp6ePAvufp7NLPJ1dAoB8t/pDfdLu4z+cdEhy69j5KwAAAABJRU5ErkJggg==';

        const INTRO_WAV_DATA = 'data:audio/wav;base64,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/qDBgszMXYyifjpHCGwcs3/9pOLx9JRxI2Cfj2OIP69SnJYy//N4xLo2XBbC/svbdB6mLunZExMSRE7CEZJvqMiWLyknSWv3dI6MUUk1pTj13vu5pGi0Rn0g859X3lc1HYjStcxk25FEpyO3YY3Y5CpUzlnVh4zASVp/p7eFmmJ8Vz4FVANdK3jSalun0e05ZZbSapGjUYV87C3qu81bwqSy3usJpNRfjH+8MLd7/f1//n/68d/vG9RlDfGM/W9a+MZz70pedMGAaxWMDjLaB7+mNZ3iku5LtkAoyAPztO1dwH96UvvWsazvWr2kOY5Z4WJWuGyx7/X3///9aduO653j58CBBdRNff/x4byP9ff+PnP+4lM338eCy8yc3tAg//NoxM8yPBba/1h4AAgIDm0OC2cmKhxMZuFiwcJA6eCahMEW1GDCQEHC67FNwMBGZEQcUm3tuUlMGpsWjKFEJ5AQGAh+163rPm8sM1o+mOLqERfP9fNyfed+ZgSfXYocmKXHACUeb0n/5hkws2ov1gDQDHr2com9X6g62Cy1yPwz04xFvefrLXOZYsVKqFxzu9/t/jIGFxfjbz/KEGlJDQCxJaORSCH4ugFgWU7/9fdVQHktfvf7h+vpyAcNJZfb7yHoEopHDkIYNJX6k0vv//1x0VB////3//OIxNFKxBa69ZvRIBIRMAf964IBL2/rv775YEpwXpfTyhlV6/Y5bpLleGauOsv/6ihw0lhHe/+tQgsEJJjRd529e8vuBg8j53/zuQ+YMCrD2QS+njErpcnpaVC4clE3WtbmGAwJG+qLc0JWa3JJaqFQRjGMUKEmuPtVVCh1VChj5IkQLUFhZpVa+VXhmXZmaVJb+vleV4Ypm4vVdmrv/ZvZr1U0eGpUNkryp5YKlg4nBpQdKgqdErpXiUNiUNKBpx7PcRf4KlQ0oGj3K8RBwRA1BWqiIc5BzU+uT//////t5K9JzoopaJfvKy+mw/8dBrj2Hft2pwETe65jmOUJP//////////////r9JhaJimmKUmIxh5BMzTbll+WDyqi//NIxLkbEY6y/8lAAJH/////////6rGfR//+3Iwo97xN1U81UxTLCqdTjrLGj2SNAA1EI////////y7nZAelKbepf///98cMev39rratR5G6tTqDyqIh///////////////603XXvp//////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';

        const INTRO_LOGO_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAaCAYAAABW6GksAAAERUlEQVRoge1YvW4jNxD+xtAzpI97Iydp/QAOlOYQuDqlDCC/ggP4KhVyEwNJebWQ2lcZQZrbJG0Qr2wf3Pv6vEMwKbTDzHI5JFdaXbUfIEgi54/8OMMfYmYM+HwgInPCfwHo+0w+aCDuAHj7qdVEN8cMAHz1YqrRzTFqGQKAj3+/c31f/fFTQ3bUQ5gDEqCbY3aE/fjl9jtArsjU8hSzORB3YDjSIoT54KsX0M0xP51dmuQd9RbhgBYapL39lEWagK9e8OrPn819bNjjesTjN+8BAOPptFkeU3qbjdk3Ked4mN02Mm/84c1QKg+BGGkxkkJ4mN1iUs7ZJ28g7jOhK2EpDHtcz5iU80a2PW42e5MmWafbBuIOiL6zTGMExG/zeyJ4+FH+ooejDnE5O0SEPmwyc+so3mWeDkkaAIyIKO/0I/cQgXW0VXJExNd00ZiAJdasJrnV35CLxWX4WWGBa7oIqnS1ucLCxRbVrfWu6QJLrA9OGtClVMo9JHUf8frvime3St3gjf6WXE48ETt92Uzqdryj9YERAJJ3NKD9libvZ7lw+t5A/METEYqiSNqz/Ft+crCPzaRuBJNyDmZ297195Ea1Uzr9/TuWwNSbWdbkCqqqcr+1bos01XdenbRLacK/5cfCPjb92OvnqIYNrWthUs7d7/GHNyYpuXIjZsbHr39wE1ihYr9G+5MbwhJrfpjdtup7VVXQ7ZNybpImiPm3/KRi1PKhibZshuajPp5jhQWF4qlfO4JxEJGzEYOWC72eNC7gEoQ416tqiXX2icrXDbWHJjrmP+VHx+cfKvQkpSbMt6nj0fqhu9USaxRFkZWB+yL5cnJenZA/+FzIipX/eqV2sSG/rTgkq4FtefFPhAJdhjS0zaOjo2DsAFAURSOb/FhEd4UF1c9UDR8++VYsWi6UbYAizlrtXUnzM8UfhKxUf2L3yTYN2RPuimfWhFryOjti2SbtIVJyxi1j1xhPp83Y63Kr/VqLPJpx/qoLrViLVJ0pueRpyIT6GRvyc46TRtmySLf2tpBNP9v8eKx9TCoUsL1TWnLj6bS1p+q2mjQsseZluZZY3XwRM0tpAfB/nZZgQ+3+gEIy1h4msiIvG7xuT8Hyo+9yVVX9s8Lii11s7qnriPq1/M31p7JN8LjZONIE385eA2gkDpkZF1p10q7/58gIQiTdFc+MHfdy30+92mmFBYfiyrW5q64mDdgSBmwzT0iU9lXZWsDuf51pAJoVQZVQdhknnXol65Na7N6VkvEhOpavFFJ+hLxdbO4aj7+fAuEyrPtaZNbkSYaJfGg/JWbG6ekpAOhA9YRY7egoY+lYvlLo6mcXm9m6VVWRyFv7fi6hoXaNp7PLbam8v78PBS3ImaDs431CZxc7u/jpXZeI8DC7Jf9uJ9DHev+0GesD0L4O/PsXwMzDp6ePAvufp7NLPJ1dAoB8t/pDfdLu4z+cdEhy69j5KwAAAABJRU5ErkJggg==';

        const INTRO_DURATION = 3000;

        const GL_VERTEX_SHADER_SOURCE = `
            attribute vec4 a_position;
            varying vec2 v_texcoord;
            void main() {
                gl_Position = a_position;

                // assuming a unit quad for position we
                // can just use that for texcoords. Flip Y though so we get the top at 0
                v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
            }
         `;

        // https://stackoverflow.com/questions/19695658/emulating-palette-based-graphics-in-webgl-v-s-canvas-2d
        const GL_FRAGMENT_SHADER_SOURCE = `
            precision mediump float;
            varying vec2 v_texcoord;
            uniform sampler2D u_image;
            uniform sampler2D u_palette;

            vec4 color;

            void main() {
                float index = texture2D(u_image, v_texcoord).a * 255.0;

                color = texture2D(u_palette, vec2((index + 0.5) / 256.0, 0.5));

                // CRT effect
                // color -= abs(sin(v_texcoord.y * 100.0 * 5.0)) * 0.08; // (1)
                // color -= abs(sin(v_texcoord.y * 300.0 * 10.0)) * 0.05; // (2)

                gl_FragColor = color;
            }
        `;

        const PALETTE = [[0, 0, 0, 0], [0, 0, 0, 255], [37, 37, 37, 255], [52, 52, 52, 255], [78, 78, 78, 255], [104, 104, 104, 255], [117, 117, 117, 255], [142, 142, 142, 255], [164, 164, 164, 255], [184, 184, 184, 255], [197, 197, 197, 255], [208, 208, 208, 255], [215, 215, 215, 255], [225, 225, 225, 255], [234, 234, 234, 255], [255, 255, 255, 255], [66, 32, 0, 255], [85, 40, 0, 255], [119, 55, 0, 255], [155, 80, 0, 255], [197, 104, 0, 255], [230, 123, 0, 255], [255, 146, 0, 255], [255, 172, 0, 255], [255, 198, 0, 255], [255, 209, 33, 255], [255, 217, 59, 255], [255, 232, 64, 255], [255, 246, 68, 255], [255, 251, 101, 255], [255, 255, 137, 255], [255, 255, 165, 255], [70, 25, 1, 255], [115, 29, 11, 255], [161, 34, 24, 255], [181, 57, 23, 255], [202, 81, 17, 255], [229, 105, 6, 255], [254, 129, 0, 255], [255, 140, 0, 255], [255, 153, 16, 255], [255, 175, 35, 255], [255, 186, 55, 255], [255, 192, 68, 255], [255, 199, 101, 255], [255, 214, 129, 255], [255, 229, 147, 255], [255, 231, 167, 255], [94, 31, 7, 255], [123, 35, 5, 255], [154, 43, 0, 255], [178, 46, 0, 255], [193, 53, 27, 255], [213, 77, 32, 255], [233, 97, 54, 255], [245, 110, 67, 255], [255, 120, 78, 255], [255, 138, 101, 255], [255, 152, 120, 255], [255, 164, 136, 255], [255, 179, 156, 255], [255, 194, 176, 255], [255, 208, 194, 255], [255, 218, 207, 255], [75, 23, 0, 255], [115, 30, 0, 255], [170, 16, 0, 255], [202, 30, 0, 255], [226, 34, 0, 255], [239, 57, 20, 255], [253, 81, 44, 255], [255, 96, 65, 255], [255, 111, 90, 255], [255, 125, 123, 255], [255, 142, 141, 255], [255, 156, 156, 255], [255, 171, 172, 255], [255, 185, 188, 255], [255, 199, 206, 255], [255, 201, 222, 255], [74, 0, 55, 255], [103, 0, 76, 255], [129, 0, 96, 255], [151, 1, 117, 255], [172, 26, 137, 255], [188, 56, 154, 255], [204, 73, 170, 255], [217, 86, 183, 255], [230, 99, 196, 255], [241, 110, 208, 255], [253, 123, 220, 255], [255, 138, 227, 255], [255, 155, 230, 255], [255, 163, 232, 255], [255, 173, 235, 255], [255, 182, 237, 255], [73, 0, 110, 255], [93, 0, 138, 255], [102, 0, 146, 255], [124, 24, 170, 255], [148, 52, 194, 255], [158, 62, 204, 255], [168, 73, 214, 255], [179, 84, 225, 255], [190, 96, 236, 255], [198, 104, 244, 255], [207, 113, 253, 255], [214, 127, 255, 255], [219, 140, 255, 255], [223, 153, 255, 255], [227, 167, 255, 255], [231, 180, 255, 255], [2, 24, 131, 255], [1, 30, 168, 255], [0, 37, 206, 255], [35, 53, 216, 255], [67, 69, 226, 255], [78, 84, 240, 255], [88, 98, 255, 255], [100, 112, 255, 255], [112, 127, 255, 255], [127, 142, 255, 255], [143, 158, 255, 255], [150, 167, 255, 255], [158, 176, 255, 255], [174, 189, 255, 255], [191, 202, 255, 255], [205, 210, 255, 255], [9, 0, 123, 255], [31, 20, 145, 255], [52, 43, 166, 255], [69, 61, 183, 255], [86, 79, 200, 255], [96, 89, 210, 255], [109, 101, 222, 255], [123, 115, 236, 255], [137, 130, 250, 255], [145, 138, 255, 255], [156, 149, 255, 255], [167, 162, 255, 255], [178, 173, 255, 255], [187, 182, 255, 255], [195, 192, 255, 255], [211, 208, 255, 255], [28, 39, 91, 255], [27, 54, 120, 255], [26, 70, 148, 255], [23, 90, 175, 255], [20, 111, 201, 255], [44, 132, 210, 255], [67, 154, 219, 255], [73, 167, 239, 255], [79, 181, 255, 255], [100, 201, 255, 255], [112, 202, 255, 255], [127, 210, 255, 255], [138, 217, 255, 255], [157, 211, 255, 255], [178, 226, 255, 255], [191, 235, 255, 255], [0, 75, 90, 255], [0, 93, 111, 255], [0, 111, 133, 255], [0, 132, 157, 255], [0, 152, 193, 255], [0, 171, 204, 255], [0, 188, 224, 255], [0, 208, 247, 255], [0, 220, 255, 255], [47, 225, 255, 255], [93, 231, 255, 255], [113, 234, 255, 255], [135, 237, 255, 255], [151, 239, 255, 255], [175, 243, 255, 255], [198, 246, 255, 255], [0, 73, 0, 255], [0, 85, 0, 255], [0, 108, 0, 255], [1, 119, 0, 255], [14, 129, 10, 255], [31, 147, 29, 255], [48, 166, 46, 255], [73, 187, 72, 255], [75, 207, 73, 255], [110, 220, 109, 255], [120, 230, 119, 255], [129, 239, 128, 255], [150, 244, 149, 255], [177, 248, 176, 255], [193, 250, 193, 255], [204, 253, 203, 255], [20, 65, 0, 255], [25, 84, 0, 255], [32, 103, 0, 255], [36, 121, 0, 255], [41, 141, 0, 255], [53, 153, 0, 255], [67, 167, 0, 255], [77, 177, 13, 255], [88, 188, 30, 255], [110, 209, 55, 255], [130, 229, 77, 255], [138, 237, 85, 255], [148, 247, 96, 255], [157, 255, 105, 255], [175, 255, 132, 255], [186, 255, 149, 255], [44, 54, 0, 255], [56, 69, 0, 255], [68, 83, 0, 255], [73, 87, 0, 255], [96, 114, 0, 255], [108, 128, 0, 255], [121, 142, 0, 255], [139, 160, 0, 255], [158, 179, 29, 255], [171, 193, 46, 255], [184, 206, 61, 255], [194, 216, 72, 255], [205, 227, 70, 255], [219, 241, 98, 255], [232, 254, 112, 255], [242, 255, 167, 255], [70, 58, 3, 255], [77, 64, 2, 255], [84, 70, 0, 255], [109, 89, 0, 255], [145, 119, 0, 255], [172, 140, 0, 255], [194, 162, 0, 255], [209, 177, 24, 255], [223, 191, 44, 255], [231, 199, 53, 255], [238, 206, 61, 255], [246, 217, 87, 255], [252, 227, 110, 255], [253, 239, 147, 255], [253, 244, 165, 255], [253, 244, 187, 255], [65, 26, 0, 255], [89, 31, 0, 255], [113, 36, 0, 255], [142, 58, 8, 255], [173, 81, 20, 255], [183, 100, 29, 255], [193, 119, 38, 255], [210, 134, 48, 255], [227, 148, 58, 255], [239, 161, 69, 255], [251, 174, 79, 255], [254, 184, 83, 255], [255, 194, 87, 255], [255, 203, 96, 255], [255, 208, 120, 255], [255, 219, 145, 255]];

        let COLORS = PALETTE.slice();
        let palette = new Uint8Array(COLORS.length * 4);
        makePalette();

        let gl;
        let image;

        const _images = {
            0: {
                id:     0,
                data:   new Uint8Array(),
                width:  0,
                height: 0,
                masks:  {}
            }
        };
        const _sfx  = {};
        const _mods = {};
        const _maps = {};

        let _color    = 0xF;
        let _layer    = 0;
        let _camera   = [0, 0];
        let _colorize = null;
        let _status   = 'paused';
        let _sshot    = false;
        let _sshotfn  = null;

        const _fps = {
            running: false,
            lastTime: new Date(),
            fps: 0,
            lastFps: 0
        }
        const _btns  = {};
        const _btnsp = {};

        const publicFunctions = [color, colorize,
            layer, layern, mask,
            camera,
            pset, pget,
            line, rect, rectfill, circ, circfill,
            cp,
            sprset, sprcp,
            print,
            sfx, play, stop, volume,
            cls, draw,
            run, pause, runcart, stopcart,
            fps,
            btn, btnp,
            map, mapn, mget, mset,
            pal,
            tri, trifill,
            sshot,
            sin, cos, atan2,
            rnd, rndseed
        ];

        let _rndSeed = new Date().getTime();

        /**
         * Loads the palette Uint8Array with colors from colors
         */
        function makePalette () {
            for (var i = 0; i < COLORS.length; i++) {
                palette[i * 4 + 0] = COLORS[i][0];
                palette[i * 4 + 1] = COLORS[i][1];
                palette[i * 4 + 2] = COLORS[i][2];
                palette[i * 4 + 3] = COLORS[i][3];
            }
        }

        /**
         * Given an image data object, returns a Uint8Array usable by tako80.
         * It maps each color to a color from the standard palette. If a color
         * is not part of the palette, the most similar available color is used
         */
        function rgb2palette (imageData, width, height) {
            function getNearestColor (color_r, color_g, color_b, a) {
                if (a !== 255) return 0;
                // handle hex input
                if (color_r && color_g === undefined) {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color_r);
                    [color_r, color_g, color_b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                }

                //Function to find the smallest value in an array
                // TODO: don't extend Array
                Array.min = (array) => Math.min.apply(Math, array);

                //Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array
                const differenceArray = PALETTE.map(c => {
                    return Math.sqrt( ((color_r - c[0]) * (color_r - c[0])) + ((color_g - c[1]) * (color_g - c[1])) + ((color_b - c[2]) * (color_b - c[2])) );
                });

                //Get the lowest number from the differenceArray
                const lowest = Array.min(differenceArray);

                return differenceArray.indexOf(lowest);
            }

            const paletteImage = new Uint8Array(imageData.length / 4);
            for (var i = 0, ii = 0; i < imageData.length; i+=4, ii++) {
                let [color_r, color_g, color_b, a] = [imageData[i], imageData[i+1], imageData[i+2], imageData[i+3]];
                paletteImage[ii] = getNearestColor(color_r, color_g, color_b, a);
                if (paletteImage[ii] === 0 && a === 255) {
                    paletteImage[ii] = 1;
                }
            }

            return paletteImage;
        }

        /**
         * Initialize the cart by creating a canvas and loading the cart.
         * assets is an object with the following keys:
         * images, sfx, mods, maps
         */
        function init (container, assets={}) {
            // create and initialize the display canvas
            const canvas = document.createElement('canvas');
            canvas.width  = WIDTH * PIXEL_WIDTH;
            canvas.height = HEIGHT * PIXEL_WIDTH;
            canvas.tabIndex = 1;
            canvas.style.outline = 'none';

            container.style.width = canvas.width + 'px';
            container.style.height = canvas.height + 'px';

            container.appendChild(canvas);
            canvas.focus();

            // create the webgl context. the webgl program has two textures, one
            // with the actual image to display (160 x 144 pixels, it is then scaled up
            // 4 times for the retro look effect) and the other with the palette
            gl = canvas.getContext('webgl', {
                alpha: false
            });
            const glProgramInfo = twgl.createProgramInfo(gl, [GL_VERTEX_SHADER_SOURCE, GL_FRAGMENT_SHADER_SOURCE]);

            // Note: createProgramFromScripts will call bindAttribLocation
            // based on the index of the attibute names we pass to it.
            gl.useProgram(glProgramInfo.program);

            const imageLoc = gl.getUniformLocation(glProgramInfo.program, "u_image");
            const paletteLoc = gl.getUniformLocation(glProgramInfo.program, "u_palette");

            // tell it to use texture units 0 and 1 for the image and palette
            gl.uniform1i(imageLoc, 0);
            gl.uniform1i(paletteLoc, 1);

            // Setup a unit quad
            const positions = [
                 1,  1,
                -1,  1,
                -1, -1,
                 1,  1,
                -1, -1,
                 1, -1
            ];
            const vertBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            // Make image. Just going to make something 8x8
            _images[0].data = new Uint8Array(WIDTH * HEIGHT);
            _images[0].width = WIDTH;
            _images[0].height = HEIGHT;
            layer();
            cls();

            // make image textures and upload image
            gl.activeTexture(gl.TEXTURE0);
            const imageTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, imageTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, WIDTH, HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _images[0].data);

            // make image textures and upload image
            gl.activeTexture(gl.TEXTURE1);
            const paletteTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, paletteTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, COLORS.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

            gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

            // handle the supported key events. when a key is pressed, it sets its entry
            // on the _btns object to 0. after one frame, it is set to 1 by the main game loop
            // (to handle the "just pressed")
            canvas.addEventListener('keydown', function (evt) {
                const pressedKey = evt.key.toLowerCase();
                const key = ['arrowup', 'arrowright', 'arrowdown', 'arrowleft', 'a', 's', 'z', 'x'].indexOf(pressedKey);
                if (key !== -1) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _btns[pressedKey] = true;
                    if (_btnsp[pressedKey] === undefined) {
                        _btnsp[pressedKey] = 0;
                    }
                }
            });

            // remove the entry of the key from the _btns object
            canvas.addEventListener('keyup', function (evt) {
                const pressedKey = evt.key.toLowerCase();
                try {
                    delete _btns[pressedKey];
                    delete _btnsp[pressedKey];
                } catch (e) {}
            });

            // asynchronously load all the assets
            return new Promise(resolve => {
                // load the default font
                assets.images.font = SYSTEM_FONT_DATA;
                const assetsToLoad = Object.keys(assets.images || {}).length
                                   + Object.keys(assets.mods   || {}).length
                                   + Object.keys(assets.maps   || {}).length;

                /**
                 * checks that the number of assets to load equals to the number of
                 * assets loaded. called by each loading function till the loading is
                 * done
                 */
                function checkLoadingDone () {
                    const loadedAssets = Object.keys(_images).length
                                       + Object.keys(_mods).length
                                       + Object.keys(_maps).length - 1;

                    if (loadedAssets === assetsToLoad) {
                        // set the default font
                        sprset(5, 6, 'font');
                        resolve();
                    }
                }

                if (assets.images) {
                    // load the image onto a temporary canvas to get its data. then convert
                    // the data to the data format used internally by tako80
                    for (let img in assets.images) {
                        const newImage = document.createElement('img');
                        newImage.onload = function () {
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.width = newImage.width;
                            canvas.height = newImage.height;
                            context.drawImage(newImage, 0, 0 );
                            const imageData = context.getImageData(0, 0, newImage.width, newImage.height);

                            _images[img] = {
                                id:     img,
                                data:   rgb2palette(new Uint8Array(imageData.data)),
                                width:  newImage.width,
                                height: newImage.height,
                                masks:  {}
                            };

                            checkLoadingDone();
                        };

                        // handle both images to load from the server and images already mapped as
                        // data urls (images packed in the cart)
                        if (assets.images[img] instanceof Uint8Array) {
                            newImage.src = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, assets.images[img]));
                        } else {
                            if (assets.images[img].startsWith('data:image/png;base64,')) {
                                newImage.src = assets.images[img];
                            } else {
                                newImage.src = assets.images[img];
                            }
                        }
                    }
                }

                // load the wave sound effects
                if (assets.sfx) {
                    for (let sound in assets.sfx) {
                        if (assets.sfx[sound] instanceof Uint8Array) {
                            const dataUri = 'data:audio/wav;base64,' + btoa(String.fromCharCode.apply(null, assets.sfx[sound]));
                            _sfx[sound] = new Audio(dataUri)
                        } else {
                            _sfx[sound] = new Audio(assets.sfx[sound]);
                        }
                    }
                }

                // load the protracker modules
                if (assets.mods) {
                    for (let mod in assets.mods) {
                        _mods[mod] = new Modplayer();
                        _mods[mod].setrepeat(true);

                        if (assets.mods[mod] instanceof Uint8Array) {
                            _mods[mod].load(assets.mods[mod], 'mod');
                        } else {
                            _mods[mod].load(assets.mods[mod]);
                        }

                        _mods[mod].onReady = function () {
                            checkLoadingDone();
                        }
                    }
                }

                // load the Tiled maps
                if (assets.maps) {
                    for (let map in assets.maps) {
                        if (assets.maps[map] instanceof Uint8Array) {
                            const json = JSON.parse(new TextDecoder("utf-8").decode(assets.maps[map]));
                            _maps[map] = {
                                width:  json.width,
                                height: json.height,
                                data:   json.layers[0].data
                            };
                            checkLoadingDone();
                        } else {
                            window.fetch(assets.maps[map])
                            .then(response => {
                                response.json().then(json => {
                                    _maps[map] = {
                                        width:  json.width,
                                        height: json.height,
                                        data:   json.layers[0].data
                                    };
                                    checkLoadingDone();
                                });
                            });
                        }
                    }
                }

                // call checkLoadingDone even if there are no assets to load
                if (Object.keys(assets.images).length === 0
                    && Object.keys(assets.sfx).length === 0
                    && Object.keys(assets.mods).length === 0
                    && Object.keys(assets.maps).length === 0) {
                    checkLoadingDone();
                }
            });
        }

        /**
         * Set a pixel at coordinate (x, y) of the current layer to be of the
         * current color. Ignore the color "0" (transparent). Offset the pixel
         * coordinates if camera is set. Also, take into account any mask that
         * might be applied to the layer
         */
        function pset (x, y) {
            x -= _camera[0];
            y -= _camera[1];

            if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;

            try {
                x = Math.floor(x);
                y = Math.floor(y);

                const currentLayer = _layer;
                const layerMasks = _layer.masks;
                for (let m in layerMasks) {
                    layer(m);
                    if (layerMasks[m]) {
                        if (pget(x, y) !== 0) {
                            _layer = currentLayer;
                            return;
                        }
                    } else {
                        if (pget(x, y) === 0) {
                            _layer = currentLayer;
                            return;
                        }
                    }
                }
                _layer = currentLayer;

                if (_color === 0) return;
                let index = ((y * _layer.width) + x);

                _layer.data[index] = _color;
            } catch (e) {}
        }

        /**
         * Return the color of the pixel at (x, y) of the current layer
         */
        function pget (x, y) {
            try {
                x = Math.floor(x);
                y = Math.floor(y);
                let index = ((y * _layer.width) + x);

                return _layer.data[index];
            } catch (e) {}
        }

        /**
         * Set the current color to the color specified. Default is white (16)
         * @param  {Number} [c=0xF] [description]
         * @return {[type]}         [description]
         */
        function color (c = 0xF) {
            _color = c;
        }

        /**
         * Sets a color as "corizer". When it is enables, draw
         * all the images and sprites with the current color for any non-transparent
         * pixel
         */
        function colorize (c = null) {
            _colorize = c;
        }

        /**
         * Set the active layer. Defaul is the main layer (0)
         */
        function layer (l = 0) {
            _layer = _images[l];
        }

        /**
         * Create a new layer with the given name. If the width or the height are
         * not specified, create a layer as big as the default one (160 x 144)
         */
        function layern (l, w = 0, h = 0) {
            if (w === 0) w = WIDTH;
            if (h === 0) h = HEIGHT;

            _images[l] = {
                id:     l,
                data:   new Uint8Array(w * h),
                width:  w,
                height: h,
                masks:  {}
            };
        }

        /**
         * Set the width and height of each sprite of the specified layer (default to
         * the currently selected layer)
         */
        function sprset (w, h, l) {
            l = l || _layer.id;

            if (_images[l].width % w !== 0 || _images[l].height % h !== 0)
                throw "Width and height of the layer must be multiple of the sprites' width and height";

            _images[l].sprw = w;
            _images[l].sprh = h;
        }

        /**
         * Set or reset the camera. When the camera is set, all the drawing functions
         * are offset by (-x, -y)
         */
        function camera(x = 0, y = 0) {
            _camera = [x, y];
        }

        /**
         * Draw a line from (x1, y1) to (x2, y2)
         */
        function line (x1, y1, x2, y2) {
            // bresenham midpoint circle algorithm to draw a pixel-perfect line
            x1 = Math.floor(x1);
            y1 = Math.floor(y1);
            x2 = Math.floor(x2);
            y2 = Math.floor(y2);

            let dx = Math.abs(x2 - x1);
            let dy = Math.abs(y2 - y1);
            let sx = (x1 < x2) ? 1 : -1;
            let sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;

            while(true) {
                pset(x1, y1);

                if ((x1 === x2) && (y1 === y2)) break;

                let e2 = 2 * err;
                if (e2 >- dy) { err -= dy; x1  += sx; }
                if (e2 <  dx) { err += dx; y1  += sy; }
            }
        }

        /**
         * Draw a rectangle having its top.left vertex at (x, y), a width of w and
         * a d height of h
         */
        function rect (x, y, w, h) {
            // normalize input
            let x0 = Math.min(x, x + w);
            let x1 = Math.max(x, x + w);
            let y0 = Math.min(y, y + h);
            let y1 = Math.max(y, y + h);

            line(x0, y0, x1, y0);
            line(x1, y0, x1, y1);
            line(x1, y1, x0, y1);
            line(x0, y1, x0, y0);
        }

        /**
         * Like rect, but the rectangle is filled
         */
        function rectfill (x, y, w, h) {
            // normalize input
            let x0 = Math.floor(Math.min(x, x + w));
            let x1 = Math.floor(Math.max(x, x + w));
            let y0 = Math.floor(Math.min(y, y + h));
            let y1 = Math.floor(Math.max(y, y + h));

            for (let yy = y0; yy < y1; yy++) {
                for (let xx = x0; xx < x1; xx++) {
                    pset(xx, yy);
                }
            }
        }

        /**
         * Draw a circle having its center at (x, y) and a redius od rd.
         * Optionally, only draw it from angle a1 to angle a2 where a1 is the topmost
         * pixel
         */
        function circ (x, y, rd, a1 = 0, a2 = 360) {
            let xx = rd;
            let yy = 0;
            let radiusError = 1 - xx;

            function inAngle(x1, y1) {
                const deltaY = y1 - y;
                const deltaX = x1 - x;
                const angleInDegrees = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) + 180;

                if (a2 > a1) {
                    return angleInDegrees >= a1 && angleInDegrees <= a2;
                } else {
                    return angleInDegrees >= a1 || angleInDegrees <= a2;
                }
            }

            if (a1 !== undefined) {
                a1 = (a1 + 90) % 360;
                a2 = (a2 + 90) % 360;
            }

            // two different paths for performace reasons
            while (xx >= yy) {
                if (a1 === undefined) {
                    pset( xx + x,  yy + y);
                    pset( yy + x,  xx + y);
                    pset(-xx + x,  yy + y);
                    pset(-yy + x,  xx + y);
                    pset(-xx + x, -yy + y);
                    pset(-yy + x, -xx + y);
                    pset( xx + x, -yy + y);
                    pset( yy + x, -xx + y);
                } else {
                    if (inAngle( xx + x,  yy + y)) pset( xx + x,  yy + y);
                    if (inAngle( yy + x,  xx + y)) pset( yy + x,  xx + y);
                    if (inAngle(-xx + x,  yy + y)) pset(-xx + x,  yy + y);
                    if (inAngle(-yy + x,  xx + y)) pset(-yy + x,  xx + y);
                    if (inAngle(-xx + x, -yy + y)) pset(-xx + x, -yy + y);
                    if (inAngle(-yy + x, -xx + y)) pset(-yy + x, -xx + y);
                    if (inAngle( xx + x, -yy + y)) pset( xx + x, -yy + y);
                    if (inAngle( yy + x, -xx + y)) pset( yy + x, -xx + y);
                }

                yy++;

                if (radiusError < 0) {
                    radiusError += 2 * yy + 1;
                }
                else {
                    xx--;
                    radiusError+= 2 * (yy - xx + 1);
                }
            }
        }

        /**
         * Like circ, but the circle is filled. Does not support drawing a partial
         * circle
         */
        function circfill (x, y, rd) {
            // bresenham midpoint circle algorithm to draw a pixel-perfect line
            let xx = rd;
            let yy = 0;
            let radiusError = 1 - xx;

            while (xx >= yy) {
                line( xx + x,  yy + y, -xx + x,  yy + y);
                line( yy + x,  xx + y, -yy + x,  xx + y);
                line(-xx + x, -yy + y,  xx + x, -yy + y);
                line(-yy + x, -xx + y,  yy + x, -xx + y);

                yy++;

                if (radiusError < 0) {
                    radiusError += 2 * yy + 1;
                }
                else {
                    xx--;
                    radiusError+= 2 * (yy - xx + 1);
                }
            }
        }

        /**
         * Draw a triangle having its vertices at (x1, x1), (x2, y2), (x3, y3)
         */
        function tri (x1, y1, x2, y2, x3, y3) {
            line(x1, y1, x2, y2);
            line(x2, y2, x3, y3);
            line(x3, y3, x1, y1);
        }

        /**
         * Like tri, but filled
         */
        function trifill (x1, y1, x2, y2, x3, y3) {
            // http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
            // sort the points vertically
            if (y2 > y3) {
                [x2, x3] = [x3, x2];
                [y2, y3] = [y3, y2];
            }
            if (y1 > y2) {
                [x1, x2] = [x2, x1];
                [y1, y2] = [y2, y1];
            }
            if (y2 > y3) {
                [x2, x3] = [x3, x2];
                [y2, y3] = [y3, y2];
            }

            tri(x1, y1, x2, y2, x3, y3);

            // fourth, middle vertex
            const x4 = x1 + ((y2 - y1) / (y3 - y1)) * (x3 - x1);
            const y4 = y2;

            // fillBottomFlatTriangle
            let invslope1 = (x2 - x1) / (y2 - y1);
            let invslope2 = (x4 - x1) / (y4 - y1);
            let curx1 = x1;
            let curx2 = x1;

            for (let sy = y1; sy <= y2; sy++) {
                line(curx1, sy, curx2, sy);
                curx1 += invslope1;
                curx2 += invslope2;
            }

            // fillTopFlatTriangle
            invslope1 = (x3 - x2) / (y3 - y2);
            invslope2 = (x3 - x4) / (y3 - y4);

            curx1 = x3;
            curx2 = x3;

            for (let sy = y3; sy > y2; sy--) {
              line(curx1, sy, curx2, sy);
              curx1 -= invslope1;
              curx2 -= invslope2;
            }
        }

        /**
         * Copy a portion of a layer into the current layer
         * @param  {String}  l          Layer to copy from
         * @param  {Number}  [dx=0]     Destination X coordinate
         * @param  {Number}  [dy=0]     Destination Y coordinate
         * @param  {Number}  [sx=0]     Source X coordinate
         * @param  {Number}  [sy=0]     Source Y coordinate
         * @param  {Number}  [sw=0]     Source width - 0 = all
         * @param  {Number}  [sh=0]     Source height - 0 = all
         * @param  {Number}  [dw=0]     Destination width - 0 = like source
         * @param  {Number}  [dh=0]     Destination Height - 0 = like source
         * @param  {Boolean} [fh=false] Flip horizontal
         * @param  {Boolean} [fv=false] Flip vertical
         * @param  {Number}  [a=0]      Rotation angle in degrees
         */
        function cp (l, dx = 0, dy = 0, sx = 0, sy = 0, sw = 0, sh = 0, dw = 0, dh = 0, fh = false, fv = false, a = 0) {
            let currentLayerId = _layer.id;
            let currentColor = _color;

            layer(l);

            sw = sw === 0 ? _layer.width  - sx: sw;
            sh = sh === 0 ? _layer.height - sy: sh;
            dw = dw === 0 ? sw : dw;
            dh = dh === 0 ? sh : dh;
            rw = dw / sw;
            rh = dh / sh;

            let cx = dx + (dw / 2);
            let cy = dy + (dh / 2);

            function rotate(x, y) {
                if (a === 0) return [x, y];

                const radians = (Math.PI / 180) * -a;
                const cos = Math.cos(radians)
                const sin = Math.sin(radians)
                const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
                const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
                return [nx, ny];
            }

            let step = a === 0 ? 1 : 0.5;

            for (let x = 0; x < dw; x += step) {
                for (let y = 0; y < dh; y += step) {
                    layer(l);
                    let _x = (x / rw) + sx;
                    let _y = (y / rh) + sy;

                    const pixelColor = pget(_x, _y);
                    if (_colorize !== null) {
                        if (pixelColor === 0) continue;
                        color(_colorize);
                    } else {
                        color(pixelColor);
                    }

                    [_x, _y] = rotate(x + dx, y + dy)

                    if (fh) { _x = dw  + (dx * 2) - _x - 1; }
                    if (fv) { _y = dh  + (dy * 2) - _y - 1; }

                    layer(currentLayerId);
                    pset(_x, _y);
                }
            }

            layer(currentLayerId);
            _color = currentColor

        }

        /**
         * Like cp but works with sprites
         * @param  {String}  l          Layer with the spritesheet
         * @param  {Number}  s          Index of the sprite
         * @param  {Number}  x          X position where to draw
         * @param  {Number}  y          Y position where to draw
         * @param  {Number}  [sw=1]     Number of horizontal sprites to draw
         * @param  {Number}  [sh=1]     Number of vertical sprites to draw
         * @param  {Number}  [w=0]      Width of the destination image (to scale sprites)
         * @param  {Number}  [h=0]      Height of the destination image (to scale sprites)
         * @param  {Boolean} [fh=false] Flip horizontal
         * @param  {Boolean} [fv=false] Flip vertical
         * @param  {Number}  [a=0]      Rotation angle in degrees
         */
        function sprcp(l, s, x = 0, y = 0, sw = 1, sh = 1, w = 0, h = 0, fh = false, fv = false, a = 0) {
            if (!_images[l].sprw || !_images[l].sprh)
                throw 'The selected layer is not a spritesheet';

            // ignore offscreen sprites
            if (   x - _camera[0] < 0 - _images[l].sprw || x - _camera[0] > WIDTH
                || y - _camera[1] < 0 - _images[l].sprh || y - _camera[1] > HEIGHT)
                    return

            let sprw = _images[l].sprw;
            let sprh = _images[l].sprh;
            if (!sprw) sprw = _images[l].width;
            if (!sprh) sprh = _images[l].height;

            w = w === 0 ? sprw * sw : w;
            h = h === 0 ? sprh * sh : h;

            let spritesPerRow    = _images[l].width / sprw;

            let spriteX = s % spritesPerRow;
            let spriteY = Math.floor(s / spritesPerRow);

            cp (l, x,  y, spriteX * sprw, spriteY * sprh, sprw * sw, sprh * sh, w, h, fh, fv, a);
        }

        /**
         * Print the string "text" at the coordinate (x, y) using the layer "l"
         * as font (default = system font). If colorize is enabled, the font will adhere to it.
         * The layer used as font must have been set as spritesheet and must
         * have exaclty 96 sprites (see the system font.png as an example)
         */
        function print (text, x = 0, y = 0, l = 'font') {
            text = text.toString();

            if (!_images[l].sprw || !_images[l].sprh)
                throw 'The selected layer is not a spritesheet';
            if ((_images[l].width / _images[l].sprw) * (_images[l].height / _images[l].sprh) !== 96)
                throw 'A font spritesheet must have exactly 96 sprites';

            for (var i = 0; i < text.length; i++) {
                const sprIdx = text.charCodeAt(i) - 32;
                sprcp(l, sprIdx, x + (i * _images[l].sprw), y);
            }
        }

        /**
         * Play the sound effect s
         */
        function sfx (s) {
            _sfx[s].play();
        }

        /**
         * Play the protracker module m
         */
        function play (m) {
            _mods[m].play();
        }

        /**
         * Stop playing the protraker module m
         */
        function stop (m) {
            _mods[m].stop();
        }

        /**
         * Set the volume of protracker module m at v (0-20)
         */
        function volume (m, v) {
            if (v === 0) {
                v = 0;
            } else if (v >= 1 && v <= 10) {
                v = 11 - v;
            } else if (v >= 11 && v <= 19) {
                v = (20 - v) / 10;
            } else if (v === 20) {
                v = 0.5;
            } else {
                v = 8;
            }

            _mods[m].mixval = v;
        }

        /**
         * Main display function. Plots the layer "0" to the canvas using the current
         * palette
         */
        function draw () {
            const positions = [1,  1,-1,  1,-1, -1, 1,  1,-1, -1, 1, -1];
            gl.activeTexture(gl.TEXTURE0);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, WIDTH, HEIGHT, 0, gl.ALPHA, gl.UNSIGNED_BYTE, _images[0].data);

            gl.drawArrays(gl.TRIANGLES, 0, 6); // 6 = positions length
        }

        /**
         * Fill the current layer wit color c (default is black)
         */
        function cls (c = 1) {
            _layer.data.fill(c)
        }

        /**
         * Take a screenshot of the canvas as soon as the current update function
         * finishes and call the function fn with the canvas data as data url
         */
        function sshot (fn) {
            _sshotfn = fn;
            _sshot = true;
        }

        /**
         * Load the assets, create the display canvas in container and call the
         * initFn function (if any) and 60 times a second the updateFn.
         * If dev is true, exposes all the public functions on the window object
         */
        function run (container, assets, updatefn, initfn, dev=true) {
            // if not in development mode (from a cart), load the assets used by the intro
            // screen
            if (!dev) {
                assets.sfx               = assets.sfx || {};
                assets.images            = assets.images || {};
                assets.sfx.tako80Intro   = INTRO_WAV_DATA;
                assets.images.tako80Logo = INTRO_LOGO_DATA;
            }

            init(container, assets)
            .then(function () {

                if (dev) {
                    for (let f of publicFunctions) {
                        window[f.name] = f;
                    }
                }

                _status = 'running';
                if (!updatefn) return;

                function runfn () {
                    if (_status === 'running') updatefn();

                    // if a screeshot is requested, call _sshotfn with the current
                    // canvas data
                    if (_sshot) {
                        _sshotfn(canvas.toDataURL());
                        _sshot = false;
                    }

                    // set all the buttons to 1 (they are initially set as 0). This
                    // makes it possible to call btnp (has the button been pressed
                    // in the last frame?)
                    for (let btn in _btnsp) {
                        _btnsp[btn] = 1;
                    }

                    // update the fps counter
                    _fps.fps++;
                    if ((new Date() - _fps.lastTime) >= 1000) {
                        _fps.lastTime = new Date();
                        _fps.lastFps = _fps.fps;
                        _fps.fps = 0;
                    }
                    if (_fps.running) {
                        const currentLayer = _layer;
                        const currentCamera = _camera;
                        camera(0, 0);
                        layer();
                        const layerMasks = _layer.masks;
                        mask();
                        print(_fps.lastFps, 1, 1);
                        _layer.masks = layerMasks;
                        draw();
                        _layer = currentLayer;
                        _camera = currentCamera;
                    }

                    window.requestAnimationFrame(runfn);
                }

                // if not in development mode (from a cart), play the intro screen
                // before the game
                if (!dev) {
                    sfx('tako80Intro');
                    let introFnRunning = true;
                    let takoIntroStep1 = 70;
                    let takoIntroStep2 = 71;
                    let takoIntroStep  = 1;

                    function introFn () {
                        cls();

                        cp('tako80Logo', 25, 50);

                        color(1);
                        if (takoIntroStep < 4) {
                            const stepX = takoIntroStep;
                            const stepY = takoIntroStep;
                            for (var x = 0; x < 160; x += stepX) {
                                for (var y = 0; y < 144; y += stepX) {
                                    pset(x, y)
                                }
                            }
                            takoIntroStep += 0.03;
                        }

                        color(1);
                        rectfill(0, 0, 160, takoIntroStep1);
                        rectfill(0, takoIntroStep2, 160, 144);

                        color(86);
                        line(0, takoIntroStep1, 160, takoIntroStep1);
                        line(0, takoIntroStep2, 160, takoIntroStep2);

                        takoIntroStep1 -= 0.7;
                        takoIntroStep2 += 0.7;
                        takoIntroStep  += 0.005;

                        draw();
                        if (introFnRunning) window.requestAnimationFrame(introFn);
                    }

                    introFn();
                    setTimeout(function () {
                        introFnRunning = false;
                        if (initfn) initfn();
                        runfn();
                    }, INTRO_DURATION);
                } else {
                    if (initfn) initfn();
                    runfn();
                }
            });
        }

        /**
         * Initialize the context from a cart and not from the server
         */
        function runcart (container, cart) {
            /**
             * Utility function. Looks for the index of an array within an array
             */
            function searchArray(array, searchElements, fromIndex = 0) {
                let index = Array.prototype.indexOf.call(array, searchElements[0], fromIndex);

                if(searchElements.length === 1 || index === -1) {
                    return index;
                }

                let i;
                for(i = index, j = 0; j < searchElements.length && i < array.length; i++, j++) {
                    if(array[i] !== searchElements[j]) {
                        return searchArray(array, searchElements, index + 1)
                    }
                }

                return index;
            }

            /**
             * Utility function. Like String.split but for arrays
             */
            function splitArray(array, searchElements) {
                const arr = [];
                let prevIdx = 0;
                let idx = searchArray(array, searchElements);
                while (idx !== -1) {
                    arr.push(array.subarray(prevIdx, idx));
                    prevIdx = idx + searchElements.length;
                    idx = searchArray(array, searchElements, prevIdx);
                }

                return arr;
            }


            // ignore cart if it's not an image
            if (cart.tagName === 'IMG') {
                fetch(cart.src)
                .then(response => {
                    return response.blob();
                })
                .then(cartData => {
                    // unpack the cart by reading all the various parts (code, images and so on)
                    const fileReader = new FileReader();
                    fileReader.onload = function() {
                        const data = new Uint8Array(this.result);
                        const endOfPng = [0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82];
                        const splitBuf = new TextEncoder("utf-8").encode('***TAKO80-SEPARATOR***');
                        const splitBufSub = new TextEncoder("utf-8").encode('***TAKO80-SUB-SEPARATOR***');

                        const cartDataIdx = searchArray(data, endOfPng) + endOfPng.length;
                        const cartData = data.subarray(cartDataIdx);
                        const splittedcartData = splitArray(cartData, splitBuf);

                        // code
                        const takoFunctions = []
                        let code = new TextDecoder("utf-8").decode(splittedcartData[0]);
                        const cartInitFnName = `tako80cartInit${ new Date().getTime() }`;
                        const cartUpdateFnName = `tako80cartUpdate${ new Date().getTime() }`;
                        const cartFnName = `tako80cart${ new Date().getTime() }`;
                        code = code.replace(/function\s+update\s+\(\)/, `window.${cartUpdateFnName} = function ()`);
                        code = code.replace(/function\s+init\s+\(\)/, `window.${cartInitFnName} = function ()`);
                        code = `
                            window.${ cartFnName } = function (${ publicFunctions.map(f => f.name).join(', ') }) {
                                ${code}
                            };
                        `;
                        eval(code);
                        window[cartFnName].apply(this, publicFunctions);

                        // assets
                        const assets = {
                            images: {},
                            sfx:    {},
                            mods:   {},
                            maps:   {}
                        }

                        // images
                        const imagesData = splitArray(splittedcartData[1], splitBufSub);
                        for (let imgData of imagesData) {
                            const imgName = new TextDecoder("utf-8").decode(imgData.subarray(0, 100)).trim();
                            const imageData = imgData.subarray(100);
                            assets.images[imgName] = imageData;
                        }

                        // sfx
                        const sfxData = splitArray(splittedcartData[2], splitBufSub);
                        for (let sData of sfxData) {
                            const sfxName = new TextDecoder("utf-8").decode(sData.subarray(0, 100)).trim();
                            const soundData = sData.subarray(100);
                            assets.sfx[sfxName] = soundData;
                        }

                        // mods
                        const modsData = splitArray(splittedcartData[3], splitBufSub);
                        for (let modData of modsData) {
                            const modName = new TextDecoder("utf-8").decode(modData.subarray(0, 100)).trim();
                            const moduleData = modData.subarray(100);
                            assets.mods[modName] = moduleData;
                        }

                        // maps
                        const mapsData = splitArray(splittedcartData[4], splitBufSub);
                        for (let mapData of mapsData) {
                            const mapName = new TextDecoder("utf-8").decode(mapData.subarray(0, 100)).trim();
                            const tilemapData = mapData.subarray(100);
                            assets.maps[mapName] = tilemapData;
                        }

                        const initfn = window[cartInitFnName] ? window[cartInitFnName] : function () {};
                        run(container, assets, window[cartUpdateFnName], initfn, false);
                    };
                    fileReader.readAsArrayBuffer(cartData);
                })
            }
        }

        /**
         * Pauses the execution and stops the music
         */
        function stopcart () {
            pause();
            for (m in _mods) {
                stop(m);
            }
        }

        /**
         * Enables or disables printing the current fps
         */
        function fps (f = false) {
            _fps.running = f;
        }

        /**
         * Pauses the execution of the cart. Not used
         */
        function pause(paused=true) {
            _status = paused ? 'paused' : 'running';
        }

        /**
         * Return true if the specified key is currenly bein pressed
         */
        function btn (k) {
            switch (k) {
                case 'up':    k = 'arrowup'; break;
                case 'down':  k = 'arrowdown'; break;
                case 'left':  k = 'arrowleft'; break;
                case 'right': k = 'arrowright'; break;
            }
            return _btns[k.toLowerCase()] === true;
        }

        /** Return true if the specified key has been recently pressed
         */
        function btnp (k) {
            switch (k) {
                case 'up':    k = 'arrowup'; break;
                case 'down':  k = 'arrowdown'; break;
                case 'left':  k = 'arrowleft'; break;
                case 'right': k = 'arrowright'; break;
            }
            return _btnsp[k.toLowerCase()] === 0;
        }

        /**
         * Draw a map or a portion of a map on the current layer
         * @param  {String} m      - Code of the map to draw
         * @param  {String} l      - Code of the layer to use as spritesheet to draw the map
         * @param  {Number} [x=0]  - X coordinate where to draw the map
         * @param  {Number} [y=0]  - Y coordinate where to draw the map
         * @param  {Number} [sx=0] - X coordinate of the map to start drawing from
         * @param  {Number} [sy=0] - Y coordinate of the map to start drawing from
         * @param  {Number} [sw=0] - How may horizontal tiles of the map to draw
         * @param  {Number} [sh=0] - How may vertical tiles of the map to draw
         */
        function map (m, l, x = 0, y = 0, sx = 0, sy = 0, sw = 0, sh = 0) {
            sw = sw === 0 ? _maps[m].width  : sw - sx;
            sh = sh === 0 ? _maps[m].height : sh - sy;

            for (var xx = sx; xx < sw; xx++) {
                for (var yy = sy; yy < sh; yy++) {
                    const tileIdx = ((yy * _maps[m].width) + xx);
                    if (_maps[m].data[tileIdx] === 0) continue;
                    const tile = _maps[m].data[tileIdx] - 1; // tiled is 1 based
                    const _xx = xx * _images[l].sprw + x;
                    const _yy = yy * _images[l].sprh + y;

                    sprcp(l, tile, _xx, _yy);
                }
            }
        }

        /**
         * Create a new map called m with a width of w and a height of h
         */
        function mapn (m, w, h) {
            _maps[m] = {
                width:  w,
                height: h,
                data:   new Array(w * h)
            };
            _maps[m].data.fill(0);
        }

        /**
         * Return the tile at (x, y) of the map m
         */
        function mget (m, x, y) {
            let index = ((y * _maps[m].width) + x);
            return _maps[m].data[index] - 1;
        }

        /**
         * Set the tile at (x, y) of map m to t
         */
        function mset (m, x, y, t) {
            let index = ((y * _maps[m].width) + x);
            _maps[m].data[index] = t + 1;
        }

        /**
         * Set the color c1 of the palette to the value of the color c2
         */
        function pal (c1, c2) {
            if (c1 === undefined) {
                COLORS = PALETTE.slice();
            } else {
                COLORS[c1] = COLORS[c2];
            }

            palette = new Uint8Array(COLORS.length * 4);
            makePalette();
            gl.activeTexture(gl.TEXTURE1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, COLORS.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);
        }

        /**
         * Apply or remove (if l is undefined) the layer l as mask to the current
         * layer. If i(nverse) is true, use all the colors !== 0 as mask
         */
        function mask (l, i = false) {
            if (l === undefined) {
                _layer.masks = {};
            } else {
                _layer.masks[l] = i
            }
        }

        /**
        * Alternative implementation of Math.sin() compatible with PICO-8's sin
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function sin (x) {
            return Math.sin(-(x || 0) * (Math.PI * 2));
        }

        /**
        * Alternative implementation of Math.cos() compatible with PICO-8's cos
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function cos (x) {
            return Math.cos((x || 0) * (Math.PI * 2));
        }

        /**
        * Alternative implementation of Math.atan2() compatible with PICO-8's atan2
        * Handle values from 0 to 1 instead of 0 to 2PI
        */
        function atan2 (dx, dy) {
            function angle(a) { return (((a - Math.PI) / (Math.PI * 2)) + 0.25) % 1.0; }

            return angle(Math.atan2(dy, dx));
        }

        /**
        * Return a random number between min and max (included) calculated based on
        * _rndSeed. By default, return an integer number but you can ask for a float
        */
        function rnd (min = 0, max = 1, int = true) {
            let x = Math.sin(_rndSeed++) * 10000;
            x -= Math.floor(x);
            x = (x * (max - min)) + min;
            if (int) x = Math.round(x);
            return x;
        }

        /**
        * Set the seed of calculates a new random one
        */
        function rndseed (s) {
            if (s === undefined) s = new Date().getTime();
            _rndSeed = s;
        }

        return publicFunctions.reduce((acc, f) => { acc[f.name] = f; return acc; }, {});
    }

    // Export the functions run and runcart to the window object
    window.tako80 = {
        run: function (container, assets, updatefn, initfn, dev=true) {
            const tako80env = boot();
            tako80env.run(container, assets, updatefn, initfn);
            return tako80env;
        },
        runcart: function (container, cart) {
            const tako80env = boot();
            tako80env.runcart(container, cart, tako80env);
            return tako80env;
        },
        stopcart: function (tako80env) {
            tako80env.stopcart();
            return tako80env;
        }
    };
}());
