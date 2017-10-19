uniform sampler2D image;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = texture2D(image, vec2(clamp(materialInput.height / 9000.0, 0.0, 1.0), 0.5)).rgb;
    return material;
}