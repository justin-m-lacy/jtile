class HeapNode<V> {

	public key:number;
	public value:V;

	public constructor( k:number, v:V ) {
		this.key = k;
		this.value = v;
	}

}

/// TODO: support for Heap resizing.
/// <summary>
/// Standard Heap datatype.
/// </summary>
/// <typeparam name="V">The data type stored in the heap.</typeparam>
export default class Heap<V> implements Iterable<V> {

		private static MAX_NODES:number = 60;
		private static ROOT:number = 0;

		private nodes:HeapNode<V>[];

		/// <summary>
		/// Last valid index of the Heap.
		/// -1 when Heap is empty.
		/// </summary>
		private END:number;

		constructor( max_size:number ) {

			this.nodes = new Array<HeapNode<V>>( (max_size || Heap.MAX_NODES) );
			this.END = -1;

		}

		/// <summary>
		/// Checks if the Heap is empty.
		/// </summary>
		/// <returns>True if Heap is currently empty, false otherwise.</returns>
		public isEmpty():boolean {
			return ( this.END == -1 );
		}

		/// <summary>
		/// Push a new value onto the Heap with an associated key.
		/// </summary>
		/// <param name="key"></param>
		/// <param name="value"></param>
		public push( key:number, value:V ):void {

			let node:HeapNode<V> = new HeapNode<V>( key, value );

			this.END++;
			this.pushUp( this.END, node );

		} //

		/// <summary>
		/// Updates the key of the first item in the Heap
		/// which matches the given value.
		/// </summary>
		/// <param name="value">The value in the Heap to update.</param>
		/// <param name="newKey">The new key for the value.</param>
		public updateKey( value:V, newKey:number ):void {

			let index:number = -1;
			for ( let i:number = this.nodes.length - 1; i >= 0; i-- ) {

				if ( this.nodes[i].value == value ) {
					index = i;
					break;
				}

			}
			if ( index < 0 ) return;

			let node:HeapNode<V> = this.nodes[index];
			if ( newKey >= node.key ) {

				node.key = newKey;
				this.pushDown( index, node );

			} else {
				node.key = newKey;
				this.pushUp( index, node );
			}

		}

		/// <summary>
		/// Returns the value on the Heap with the smallest
		/// key value.
		/// </summary>
		/// <returns></returns>
		public peekMin():V {

			if ( this.END >= Heap.ROOT ) this.nodes[ Heap.ROOT ].value;
			return undefined;

		}

		/// <summary>
		/// Removes the item in the Heap with the smallest associated key
		/// and returns it.
		/// </summary>
		/// <returns>The value on the Heap with the smallest associated key.</returns>
		public pop():V {

			let top:HeapNode<V>  = this.nodes[ Heap.ROOT];

			if ( this.END <= Heap.ROOT ) {

				if ( this.END == Heap.ROOT ) {

					this.nodes[ Heap.ROOT] = null;
					this.END--;
					return top.value;

				} else return undefined;

			}

			let last:HeapNode<V> = this.nodes[ this.END];
			this.nodes[ this.END] = null;
			this.END--;

			this.pushDown( Heap.ROOT, last );

			return top.value;

		}

		/// <summary>
		/// Attempts to place the given node at the specified index.
		/// The node descends until all children have larger keys.
		/// </summary>
		/// <param name="index"></param>
		/// <param name="node"></param>
		private pushDown( index:number, node:HeapNode<V> ):void {

			let leftIndex:number, rightIndex:number;
			let leftNode:HeapNode<V>, rightNode:HeapNode<V>;

			let key:number = node.key;

			do {

				leftIndex = 2 * index + 1;
				if ( leftIndex > this.END ) {
					break;
				}

				leftNode = this.nodes[leftIndex];

				if ( leftIndex == this.END ) {
					// NO RIGHT CHILD.

					if ( leftNode.key < key ) {

						this.nodes[index] = leftNode;
						index = leftIndex;

					} else {
						break;
					}

				} else {

					rightIndex = leftIndex + 1;
					rightNode = this.nodes[rightIndex];

					if ( leftNode.key < rightNode.key ) {

						// LEFT IS MIN CHILD.
						if ( leftNode.key < key ) {

							this.nodes[index] = leftNode;
							index = leftIndex;

						} else {
							break;
						}

					} else {

						// RIGHT IS MIN CHILD
						if ( rightNode.key < key ) {

							this.nodes[index] = rightNode;
							index = rightIndex;

						} else {
							break;
						}

					} //

				} // ( if right-child )


			} while ( index < this.END );

			this.nodes[index] = node;

		}

		/**
		 * Attempts to place the given node at the specified index.
		 * It will rise up the tree until the parent key is smaller.
		 */
		private pushUp( index:number, node:HeapNode<V> ):void {

			let key:number = node.key;
			let parentIndex:number = ( index - 1 ) >> 1;

			let parentNode:HeapNode<V>;

			while ( index > Heap.ROOT ) {

				parentNode = this.nodes[parentIndex];
				if ( parentNode.key > key ) {

					// parent is larger. shift parent to node position. move up tree.
					this.nodes[index] = parentNode;
					index = parentIndex;

				} else {

					// parent key is less. place node at current index.
					break;

				} //

				parentIndex = ( index - 1 ) / 2;
			}

			this.nodes[index] = node;

		} //


		/// <summary>
		/// Empties the heap.
		/// </summary>
		public clear():void {

			for ( let i:number = this.END; i >= 0; i-- ) {
				//this.items[i].value = default( V );
				this.nodes[i] = null;
			} //
			this.END = -1;

		} //

		*[Symbol.iterator]():Iterator<V> {

			for ( let i:number = 0; i <= this.END; i++ ) {
				yield this.nodes[i].value;
			}

		}

	} // class