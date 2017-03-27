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

mat2 rotate(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat2(
        c, s,
        -s, c
    );
}

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 pos = rotate(v_angle) * gl_FragCoord.xy;

    vec2 oddOrEven = floor( fract( (pos.xy / dashLength) * 0.5 ) + 0.5 );

    // Horizontal
    if(oddOrEven.x > 0.5) discard;
    // Vertical
    //if( v_angle <= 0.5 && oddOrEven.y > 0.5) discard;

    material.emission = color.rgb;
    material.alpha = color.a;
    return material;
}
