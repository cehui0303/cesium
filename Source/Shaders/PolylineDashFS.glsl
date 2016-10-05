varying vec2 v_st;

void main()
{
    czm_materialInput materialInput;
    
    materialInput.s = v_st.s;
    materialInput.st = v_st;
    materialInput.str = vec3(v_st, 0.0);
    float a = mod(v_st.t,1.0);
    a = .1;
    czm_material material = czm_getMaterial(materialInput);
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha) * a;
}
