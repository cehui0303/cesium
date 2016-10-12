varying vec2 v_st;

void main()
{
    czm_materialInput materialInput;
    
    materialInput.s = v_st.s;
    materialInput.st = v_st;
    materialInput.str = vec3(v_st, 0.0);
    czm_material material = czm_getMaterial(materialInput);
    float dash = smoothstep(.475, .525, mod(st.s * 10., 1.));
    material.alpha = dash;
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha) * a;
}
