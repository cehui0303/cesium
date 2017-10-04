varying float v_slope;

// Ideally this would be inserted after the variable definitions but before the first function in GlobeFS.
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = materialInput.diffuse;

    //vec3 slopeColor = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), v_slope);
    material.alpha = 0.0;

    if (v_slope < 0.1) {
        material.diffuse = vec3(1.0, 0.0, 0.0);
        material.alpha = 1.0;
    }
    else if (v_slope < 0.25) {
        material.diffuse = vec3(0.0, 1.0, 0.0);
        material.alpha = 1.0;
    }
    else if (v_slope < 0.5) {
        material.diffuse = vec3(0.0, 1.0, 1.0);
        material.alpha = 1.0;
    }
    else if (v_slope < 0.75) {
        material.diffuse = vec3(0.0, 0.0, 1.0);
        material.alpha = 1.0;
    }

    return material;
}