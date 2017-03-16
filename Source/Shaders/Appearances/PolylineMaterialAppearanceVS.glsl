attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec3 prevPosition3DHigh;
attribute vec3 prevPosition3DLow;
attribute vec3 nextPosition3DHigh;
attribute vec3 nextPosition3DLow;
attribute vec2 expandAndWidth;
attribute vec2 st;
attribute float batchId;
attribute float arcLength;

varying float v_width;
varying vec2 v_st;
varying float v_arcLength;
varying float v_metersPerPixel;
varying float v_angle;

void main()
{
    float expandDir = expandAndWidth.x;
    float width = abs(expandAndWidth.y) + 0.5;
    bool usePrev = expandAndWidth.y < 0.0;

    vec4 p = czm_computePosition();
    vec4 prev = czm_computePrevPosition();
    vec4 next = czm_computeNextPosition();

    v_width = width;
    v_st = st;
    v_arcLength = arcLength;

    //vec4 positionEC = (czm_modelViewRelativeToEye * p);      // position in eye coordinates
    //v_metersPerPixel = clamp(czm_metersPerPixel(positionEC), 100.0, 100000.0);

    float fCameraHeight = length(czm_viewerPositionWC) - 6378137.0;
    v_metersPerPixel = clamp(czm_metersPerPixel(vec4(0.0, 0.0, -fCameraHeight, 1.0)), 100.0, 100000.0);

    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev);


    // Try to get the general direction of the line in clip space, is it going up and down or left and right.
    vec4 prevEC = czm_modelViewRelativeToEye * prev;
    vec4 nextEC = czm_modelViewRelativeToEye * next;
    vec4 pEC = czm_modelViewRelativeToEye * p;

    vec4 prevClip = czm_viewportOrthographic * prevEC;
    vec4 nextClip = czm_viewportOrthographic * nextEC;
    vec4 pClip = czm_viewportOrthographic * pEC;

    vec2 dir;
    if (usePrev) {
        dir = normalize(pClip.xy - prevClip.xy);
    }
    else {
        dir = normalize(nextClip.xy - pClip.xy);
    }
    float dotProd = abs(dot(dir, vec2(1,0)));
    v_angle = dotProd;

    gl_Position = czm_viewportOrthographic * positionWC;
}
