
/**
 * Return a new multidimensional array of type V.
 * @param {number} rows 
 * @param {number} cols
 * @returns {V[][]} New multidimensional array.
 */
export function multi<V>( rows:number=0, cols:number=0 ):V[][]{

	let a:V[][] = new Array<V[]>( rows );

	for( let i = 0; i < rows; i++ ) a[i] = new Array<V>(cols);

	return a;

}

/**
 * Returns a random element from an array.
 * If the array is empty, undefined is returned.
 * @param a 
 */
export function random<V>( a:V[] ):V {
		return a.length === 0 ? undefined : a[ Math.floor( Math.random()*a.length) ];
}