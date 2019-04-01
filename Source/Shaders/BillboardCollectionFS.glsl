uniform sampler2D u_atlas;

#ifdef VECTOR_TILE
uniform vec4 u_highlightColor;
#endif

#ifdef SDF
uniform float u_sdfEdge;
uniform float u_sdfOutlineWidth;
uniform vec4 u_sdfOutlineColor;
uniform float u_sdfSmoothing;
#endif

varying vec2 v_textureCoordinates;
varying vec4 v_pickColor;
varying vec4 v_color;
varying vec4 v_sdf;

#ifdef FRAGMENT_DEPTH_CHECK
varying vec4 v_textureCoordinateBounds;                  // the min and max x and y values for the texture coordinates
varying vec4 v_originTextureCoordinateAndTranslate;      // texture coordinate at the origin, billboard translate (used for label glyphs)
varying vec4 v_compressed;                               // x: eyeDepth, y: applyTranslate & enableDepthCheck, z: dimensions, w: imageSize
varying mat2 v_rotationMatrix;

const float SHIFT_LEFT12 = 4096.0;
const float SHIFT_LEFT1 = 2.0;

const float SHIFT_RIGHT12 = 1.0 / 4096.0;
const float SHIFT_RIGHT1 = 1.0 / 2.0;

float getGlobeDepth(vec2 adjustedST, vec2 depthLookupST, bool applyTranslate, vec2 dimensions, vec2 imageSize)
{
    vec2 lookupVector = imageSize * (depthLookupST - adjustedST);
    lookupVector = v_rotationMatrix * lookupVector;
    vec2 labelOffset = (dimensions - imageSize) * (depthLookupST - vec2(0.0, v_originTextureCoordinateAndTranslate.y)); // aligns label glyph with bounding rectangle.  Will be zero for billboards because dimensions and imageSize will be equal

    vec2 translation = v_originTextureCoordinateAndTranslate.zw;

    if (applyTranslate)
    {
        // this is only needed for labels where the horizontal origin is not LEFT
        // it moves the label back to where the "origin" should be since all label glyphs are set to HorizontalOrigin.LEFT
        translation += (dimensions * v_originTextureCoordinateAndTranslate.xy * vec2(1.0, 0.0));
    }

    vec2 st = ((lookupVector - translation + labelOffset) + gl_FragCoord.xy) / czm_viewport.zw;
    float logDepthOrDepth = czm_unpackDepth(texture2D(czm_globeDepthTexture, st));

    if (logDepthOrDepth == 0.0)
    {
        return 0.0; // not on the globe
    }

    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, logDepthOrDepth);
    return eyeCoordinate.z / eyeCoordinate.w;
}
#endif

void main()
{
    vec4 color = texture2D(u_atlas, v_textureCoordinates);
    //color = vec4(color.r, color.g, color.b, color.a);
    //color = czm_gammaCorrect(color);
    //color *= czm_gammaCorrect(v_color);

#ifdef SDF

    float distance = color.r;

    vec4 outlineColor = vec4(v_sdf.xyz, 1.0);
    float outlineWidth = v_sdf.w;

    // sdf with outline
    /*
    float outlineFactor = smoothstep(u_sdfEdge - u_sdfSmoothing, u_sdfEdge + u_sdfSmoothing, distance);
    vec4 finalColor = mix(u_sdfOutlineColor, v_color, outlineFactor);
    float alpha = smoothstep(u_sdfOutlineWidth - u_sdfSmoothing, u_sdfOutlineWidth + u_sdfSmoothing, distance);
    color = vec4(finalColor.rgb, finalColor.a * alpha);
    */

    float spread = 8.0; // Needs to match radius in sdf generator.

    float outlineEdge = u_sdfEdge - (outlineWidth / spread);

    float outlineFactor = smoothstep(u_sdfEdge - u_sdfSmoothing, u_sdfEdge + u_sdfSmoothing, distance);
    vec4 finalColor = mix(outlineColor, v_color, outlineFactor);
    float alpha = smoothstep(outlineEdge - u_sdfSmoothing, outlineEdge + u_sdfSmoothing, distance);
    color = vec4(finalColor.rgb, finalColor.a * alpha);
#endif

// Fully transparent parts of the billboard are not pickable.
#if !defined(OPAQUE) && !defined(TRANSLUCENT)
    if (color.a < 0.005)   // matches 0/255 and 1/255
    {
        discard;
    }
#else
// The billboard is rendered twice. The opaque pass discards translucent fragments
// and the translucent pass discards opaque fragments.
#ifdef OPAQUE
    if (color.a < 0.995)   // matches < 254/255
    {
        discard;
    }
#else
    if (color.a >= 0.995)  // matches 254/255 and 255/255
    {
        discard;
    }
#endif
#endif

#ifdef VECTOR_TILE
    color *= u_highlightColor;
#endif
    gl_FragColor = color;

    czm_writeLogDepth();


#ifdef FRAGMENT_DEPTH_CHECK

    float temp = v_compressed.y;

    temp = temp * SHIFT_RIGHT1;

    float temp2 = (temp - floor(temp)) * SHIFT_LEFT1;
    bool enableDepthTest = temp2 != 0.0;
    bool applyTranslate = floor(temp) != 0.0;

    if (enableDepthTest) {
        temp = v_compressed.z;
        temp = temp * SHIFT_RIGHT12;

        vec2 dimensions;
        dimensions.y = (temp - floor(temp)) * SHIFT_LEFT12;
        dimensions.x = floor(temp);

        temp = v_compressed.w;
        temp = temp * SHIFT_RIGHT12;

        vec2 imageSize;
        imageSize.y = (temp - floor(temp)) * SHIFT_LEFT12;
        imageSize.x = floor(temp);

        vec2 adjustedST = v_textureCoordinates - v_textureCoordinateBounds.xy;
        adjustedST = adjustedST / vec2(v_textureCoordinateBounds.z - v_textureCoordinateBounds.x, v_textureCoordinateBounds.w - v_textureCoordinateBounds.y);

        float epsilonEyeDepth = v_compressed.x + czm_epsilon1;
        float globeDepth1 = getGlobeDepth(adjustedST, v_originTextureCoordinateAndTranslate.xy, applyTranslate, dimensions, imageSize);

        // negative values go into the screen
        if (globeDepth1 != 0.0 && globeDepth1 > epsilonEyeDepth)
        {
            float globeDepth2 = getGlobeDepth(adjustedST, vec2(0.0, 1.0), applyTranslate, dimensions, imageSize); // top left corner
            if (globeDepth2 != 0.0 && globeDepth2 > epsilonEyeDepth)
            {
                float globeDepth3 = getGlobeDepth(adjustedST, vec2(1.0, 1.0), applyTranslate, dimensions, imageSize); // top right corner
                if (globeDepth3 != 0.0 && globeDepth3 > epsilonEyeDepth)
                {
                    discard;
                }
            }
        }
    }
#endif


}
