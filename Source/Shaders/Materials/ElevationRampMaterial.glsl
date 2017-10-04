varying float v_height;

// Ideally this would be inserted after the variable definitions but before the first function in GlobeFS.
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec3 heightColor = vec3(1.0, 1.0, 1.0);
    if (v_height < 1000.0) {
        heightColor = vec3(1.0, 0.0, 0.0);
    }
    else if (v_height < 2000.0) {
        heightColor = vec3(0.0, 1.0, 0.0);
    }
    else if (v_height < 3000.0) {
        heightColor = vec3(0.0, 1.0, 1.0);
    }
    else if (v_height < 4000.0) {
        heightColor = vec3(0.0, 0.0, 1.0);
    }
    else if (v_height < 5000.0) {
        heightColor = vec3(1.0, 0.0, 1.0);
    }
    else {
        heightColor = vec3(1.0, 1.0, 1.0);
    }
    material.diffuse = heightColor;

    material.alpha = 1.0;

    return material;
}