uniform vec4 color;

varying float v_width;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;
    float dash = smoothstep(.4, .6, mod(st.s * 10));
    material.alpha = dash * color.a;

    return material;
}
