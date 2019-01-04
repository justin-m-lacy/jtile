/**
 * Returns only unique elements from an iterable.
 */
export class UniqueIterator<T> implements Iterator<T> {

	/**
	 * Original iteration source.
	 */
	private _source;
	private used:Map<T,boolean>;

	constructor( source:Iterable<T> ) {

		this._source = source;
		this.used = new Map<T,boolean>();

	}

	next():IteratorResult<T> {

		let res:IteratorResult<T> = this._source.next();
		if ( res.done === true ) return res;

		while ( this.used.has( res.value ) ) {

		}

		this.used.set( res.value, true );

	}

}