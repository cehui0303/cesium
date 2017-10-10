varying float v_slope;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = materialInput.diffuse;

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