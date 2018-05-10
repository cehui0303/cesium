uniform sampler2D u_atlas;

#ifdef VECTOR_TILE
uniform vec4 u_highlightColor;
#endif

varying vec2 v_textureCoordinates;

#ifdef RENDER_FOR_PICK
varying vec4 v_pickColor;
#else
varying vec4 v_color;
#endif

//const float smoothing = 1.0/16.0;
const float smoothing = 1.0/16.0;

void main()
{
#ifdef RENDER_FOR_PICK
    vec4 vertexColor = vec4(1.0, 1.0, 1.0, 1.0);
#else
    vec4 vertexColor = v_color;
#endif

    //vec4 color = texture2D(u_atlas, v_textureCoordinates) * vertexColor;
    vec4 color = texture2D(u_atlas, v_textureCoordinates);

    // SDF
    /*
    float distance = color.a;
    float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);
    color = vec4(color.rgb * vertexColor.rgb, alpha);
    */

    // sdf withoutline
    vec4 outlineColor = vec4(1.0, 0.0, 0.0, 1.0);
    float outlineDistance = 0.6;
    float distance = color.a;
    float outlineFactor = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);
    vec4 finalColor = mix(outlineColor, vertexColor, outlineFactor);
    float alpha = smoothstep(outlineDistance - smoothing, outlineDistance + smoothing, distance);
    color = vec4(finalColor.rgb, alpha);


// Fully transparent parts of the billboard are not pickable.
#if defined(RENDER_FOR_PICK) || (!defined(OPAQUE) && !defined(TRANSLUCENT))
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

#ifdef RENDER_FOR_PICK
    gl_FragColor = v_pickColor;
#else
    gl_FragColor = color;
#endif

    czm_writeLogDepth();
}
