uniform vec4 color;
uniform float duty;
uniform float dashLength;
// An integer less than 2^16-1 that describes a pattern
uniform float dashPattern;

varying float v_width;

const float maskLength = 16.0;

varying float v_arcLength;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    float omega = fract(v_arcLength / dashLength);
    float dash = (1. - smoothstep(duty - .05, duty, omega));
    float maskIndex = floor(omega * maskLength);
    float maskTest = floor(dashPattern / pow(2.0, maskIndex));
    if (mod(maskTest, 2.0) < 1.0)
      dash = 0.0;
    material.emission = color.rgb;
    material.alpha = dash * color.a;

    return material;
}
