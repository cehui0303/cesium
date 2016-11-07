precision highp float;

uniform vec4 color;
uniform float duty;
uniform float dashLength;

varying float v_width;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;
    // float omega = fract(st.s / dashLength);
    // float dash = smoothstep(duty - .05, duty, omega)*(1. - smoothstep(.95, 1., omega));
    // float dash = omega;
    // float dash = clamp(st.s / 2000000.0, 0.0, 1.0);
    float dash = clamp(st.s, 0.0, 1.0);
    material.emission = color.rgb;
    material.alpha = dash * color.a;

    return material;
}
