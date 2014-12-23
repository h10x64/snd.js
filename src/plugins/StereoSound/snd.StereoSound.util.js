/**
 * vecで指定された直交座標系の3次元ベクトルを球座標に変換します。<br/>
 * outに設定される値は、以下のようになります。<br/>
 * <ul>
 * <li>out[0]: 半径</li>
 * <li>out[1]: 方位角</li>
 * <li>out[2]: 仰角</li>
 * </ul>
 * また、このメソッドは引数outで指定されたオブジェクトを戻り値として返します。
 * @param {glMatrix.vec3} out 出力先
 * @param {glMatrix.vec3} vec 球座標系に変換する直交座標
 * @returns {glMatrix.vec3} 引数outで指定したオブジェクト
 */
snd.util.convertOrthogonalToSpherical = function(out, vec) {
    // out[0] = r
    out[0] = glMatrix.vec3.length(vec);
    // out[1] = azimuth
    out[1] = Math.atan2(vec[2], vec[0]);
    // out[2] = elevation
    out[2] = Math.acos(vec[1] / Math.sqrt(vec[0] * vec[0] + vec[2] * vec[2]));
    
    return out;
};

/**
 * sphで指定された球座標系の3次元ベクトルを直交座標に変換します。<br/>
 * sphの内容は、以下のようになっている必要があります。<br/>
 * <ul>
 * <li>sph[0]: 半径</li>
 * <li>sph[1]: 方位角</li>
 * <li>sph[2]: 仰角</li>
 * </ul>
 * また、このメソッドは引数outで指定されたオブジェクトを戻り値として返します。
 * @param {glMatrix.vec3} out 出力先
 * @param {glMatrix.vec3} sph 直交座標系に変換する球座標
 * @returns {glMatrix.vec3} 引数outで指定したオブジェクト
 */
snd.util.convertSphericalToOrthogonal = function(out, sph) {
    // out[0] = x
    out[0] = sph[0] * Math.cos(sph[2]) * Math.cos(sph[1]);
    // out[1] = y
    out[1] = sph[0] * Math.sin(sph[2]);
    // out[2] = z
    out[0] = sph[0] * Math.cos(sph[2]) * Math.sin(sph[1]);
    
    return out;
};

/**
 * vecで指定された直交座標系の3次元ベクトルを円筒座標に変換します。<br/>
 * outに設定される値は、以下のようになります。<br/>
 * <ul>
 * <li>out[0]: 半径</li>
 * <li>out[1]: 方位角</li>
 * <li>out[2]: 高さ</li>
 * </ul>
 * また、このメソッドは引数outで指定されたオブジェクトを戻り値として返します。
 * @param {glMatrix.vec3} out 出力先
 * @param {glMatrix.vec3} vec 円筒座標系に変換する直交座標
 * @returns {glMatrix.vec3} 引数outで指定したオブジェクト
 */
snd.util.convertOrthogonalToCylindrical = function(out, vec) {
    // out[0] = r
    out[0] = Math.sqrt(vec[0] * vec[0] + vec[2] * vec[2]);
    // out[1] = theta
    out[1] = Math.atan2(vec[0], vec[2]);
    // out[2] = height
    out[2] = vec[1];
    
    return out;
};

/**
 * cylで指定された円筒座標系の3次元ベクトルを直交座標に変換します。<br/>
 * cylの内容は、以下のようになっている必要があります。<br/>
 * <ul>
 * <li>cyl[0]: 半径</li>
 * <li>cyl[1]: 方位角</li>
 * <li>cyl[2]: 高さ</li>
 * </ul>
 * また、このメソッドは引数outで指定されたオブジェクトを戻り値として返します。
 * @param {glMatrix.vec3} out 出力先
 * @param {glMatrix.vec3} cyl 直交座標系に変換する円筒座標
 * @returns {glMatrix.vec3} 引数outで指定したオブジェクト
 */
snd.util.convertCylindricalToOrthogonal = function(out, cyl) {
    // out[0] = x
    out[0] = cyl[0] * Math.cos(cyl[1]);
    // out[1] = y
    out[1] = cyl[2];
    // out[2] = z
    out[2] = cyl[0] * Math.sin(cyl[1]);
    
    return out;
};
