uniform vec4 color;
uniform float duty;

varying float v_width;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;
    float omega = mod(st.s * 10., 1.);
    float dash = smoothstep(duty - .05, duty, omega)*(1. - smoothstep(.95, 1., omega));
    material.emission = color.rgb;
    material.alpha = dash * color.a;

    return material;
}
