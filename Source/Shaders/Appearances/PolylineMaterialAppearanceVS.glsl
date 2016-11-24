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

    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev);
    gl_Position = czm_viewportOrthographic * positionWC;
}
