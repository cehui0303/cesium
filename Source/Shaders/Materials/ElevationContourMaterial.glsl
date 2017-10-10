varying float v_height;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    if (fract(v_height / spacing) < 0.1 ) {
       material.diffuse = vec3(1.0, 0.0, 0.0);
       material.alpha = 1.0;
    }
    else {
        material.alpha = 0.0;
    }
    /*
    else {
       material.diffuse = vec3(0.0, 1.0, 0.0);
    }
    */

    return material;
}