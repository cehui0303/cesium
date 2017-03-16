uniform vec4 color;
uniform float duty;
uniform float dashLength;
// An integer less than 2^16-1 that describes a pattern
uniform float dashPattern;

varying float v_width;

const float maskLength = 16.0;

varying float v_arcLength;
varying float v_angle;

varying float v_metersPerPixel;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 oddOrEven = floor( fract( (gl_FragCoord.xy / dashLength) * 0.5 ) + 0.5 );

    // Horizontal
    if( v_angle > 0.5 && oddOrEven.x > 0.5) discard;
    // Vertical
    if( v_angle <= 0.5 && oddOrEven.y > 0.5) discard;

    material.emission = color.rgb;
    material.alpha = color.a;
    return material;
}
